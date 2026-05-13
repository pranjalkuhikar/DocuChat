import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import config from "../config/config.js";
import { CohereEmbeddings } from "@langchain/cohere";

// ===== MODEL =====
const model = new ChatGoogleGenerativeAI({
  model: "gemini-flash-latest",
  apiKey: config.GEMINI_API_KEY,
});

// ===== EMBEDDINGS =====
const embeddings = new CohereEmbeddings({
  apiKey: config.COHERE_API_KEY,
  model: "embed-english-v3.0", // 1024 dims — matches Pinecone index ✅
  inputType: "search_document", // Required for Cohere v3 models
});

// ===== PINECONE =====
const pinecone = new Pinecone({
  apiKey: config.PINECONE_API_KEY,
});

const index = pinecone.Index(config.PINECONE_INDEX);

// ===== PROMPT =====
function template() {
  return ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a precise document assistant. Follow these rules strictly:
1. Answer ONLY the question asked - no extra information
2. Be concise and direct - keep answers under 5 sentences
3. Use only the provided context
4. If information is not in context, say "I couldn't find this information in the document"
5. Do not add assumptions or external knowledge
6. Format long answers with bullet points for clarity`,
    ],
    [
      "human",
      `Question: {question}

Context from document:
{pdfText}

Provide a direct, concise answer based ONLY on the context above.`,
    ],
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
    chunkSize: 500, // Reduced from 1000 for better relevance
    chunkOverlap: 50, // Reduced overlap
  });

  const splitDocs = await textSplitter.splitDocuments(nonEmptyDocs);
  const chunks = splitDocs.filter((chunk) => chunk.pageContent?.trim());
  console.log(`Created ${chunks.length} chunks for Pinecone 🧩`);

  if (chunks.length === 0) {
    throw new Error(
      `Source was loaded, but no non-empty chunks were created: ${source}`,
    );
  }

  // Tag each chunk with source metadata
  const processedChunks = chunks.map((chunk) => ({
    ...chunk,
    metadata: {
      ...chunk.metadata,
      source: source,
      timestamp: Date.now(),
    },
  }));

  try {
    console.log(
      `Storing ${processedChunks.length} chunks in Pinecone via PineconeStore... 🧩`,
    );
    // PineconeStore.fromDocuments handles embedding + upsert correctly
    await PineconeStore.fromDocuments(processedChunks, embeddings, {
      pineconeIndex: index,
      textKey: "text",
    });
    console.log(`Stored ${processedChunks.length} chunks in Pinecone ✅`);
  } catch (error) {
    console.error("Error storing in Pinecone:", error);
    throw error;
  }
}

// ===== LOAD EXISTING VECTOR DB =====
async function getVectorStore() {
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
    textKey: "text",
  });
  return vectorStore;
}

async function query(question) {
  const vectorStore = await getVectorStore();
  const chain = template().pipe(model);

  // Retrieve top 3 results with better relevance
  const results = await vectorStore.similaritySearch(question, 3);

  // Filter and format context - keep only relevant chunks
  const context = results
    .filter((result) => result.pageContent?.trim()) // Remove empty chunks
    .map((result) => result.pageContent)
    .join("\n---\n") // Better separation between chunks
    .slice(0, 2000); // Limit context to 2000 chars to prevent token bloat

  if (!context.trim()) {
    return "I couldn't find relevant information in the document to answer your question.";
  }

  const response = await chain.invoke({
    question: question,
    pdfText: context,
  });

  return response.content;
}

export { setup, query };

async function deleteAll() {
  await index.deleteAll();
  console.log("Pinecone index cleared ✅");
}

export { deleteAll };
