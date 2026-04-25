import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { CohereEmbeddings } from "@langchain/cohere";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import config from "../config/config.js";

// ===== MODEL =====
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: config.GEMINI_API_KEY,
});

// ===== EMBEDDINGS =====
const docEmbeddings = new CohereEmbeddings({
  apiKey: config.COHERE_API_KEY,
  model: "embed-english-v3.0",
  inputType: "search_document",
});

const queryEmbeddings = new CohereEmbeddings({
  apiKey: config.COHERE_API_KEY,
  model: "embed-english-v3.0",
  inputType: "search_query",
});

// ===== PINECONE =====
const pinecone = new Pinecone({
  apiKey: config.PINECONE_API_KEY,
});

const index = pinecone.Index(config.PINECONE_INDEX);

// ===== PROMPT =====
function template() {
  return ChatPromptTemplate.fromMessages([
    ["system", "You are an expert PDF analyzer."],
    ["human", "Answer the question based on this context:\n{pdfText}"],
  ]);
}

// ===== LOAD + STORE (ONLY FIRST TIME) =====
async function setup(source) {
  let loader;
  if (source.startsWith("http")) {
    if (
      source.toLowerCase().endsWith(".pdf") ||
      source.includes("imagekit.io")
    ) {
      console.log(`Loading PDF from URL: ${source} 📄`);
      const response = await fetch(source);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF from URL: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: "application/pdf" });
      loader = new PDFLoader(blob);
    } else {
      console.log(`Loading content from URL: ${source} 🌐`);
      loader = new CheerioWebBaseLoader(source);
    }
  } else {
    console.log(`Loading PDF from file: ${source} 📄`);
    loader = new PDFLoader(source);
  }

  const docs = await loader.load();
  console.log(`Loaded ${docs.length} document pages 📄`);

  const nonEmptyDocs = docs.filter((doc) => doc.pageContent?.trim());
  console.log(`Found ${nonEmptyDocs.length} non-empty pages 📄`);

  if (nonEmptyDocs.length === 0) {
    throw new Error(`No text could be extracted from source: ${source}`);
  }

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });

  const splitDocs = await textSplitter.splitDocuments(nonEmptyDocs);
  const chunks = splitDocs.filter((chunk) => chunk.pageContent?.trim());
  console.log(`Created ${chunks.length} chunks for Pinecone 🧩`);

  if (chunks.length === 0) {
    throw new Error(
      `Source was loaded, but no non-empty chunks were created: ${source}`,
    );
  }

  try {
    await PineconeStore.fromDocuments(chunks, docEmbeddings, {
      pineconeIndex: index,
    });
    console.log(`Stored ${chunks.length} chunks in Pinecone ✅`);
  } catch (error) {
    console.error("Error storing in Pinecone:", error);
    throw error;
  }
}

// ===== LOAD EXISTING VECTOR DB =====
async function getVectorStore() {
  const vectorStore = await PineconeStore.fromExistingIndex(queryEmbeddings, {
    pineconeIndex: index,
  });
  return vectorStore;
}

async function query(question) {
  const vectorStore = await getVectorStore();
  const chain = template().pipe(model);

  const results = await vectorStore.similaritySearch(question, 3);
  const context = results.map((result) => result.pageContent).join("\n");

  const response = await chain.invoke({
    pdfText: context,
  });

  return response.content;
}

export { setup, query };
