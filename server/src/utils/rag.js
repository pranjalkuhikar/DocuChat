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
  model: "gemini-1.5-flash",
  apiKey: config.GEMINI_API_KEY,
});

// ===== EMBEDDINGS =====
const embeddings = new CohereEmbeddings({
  apiKey: config.COHERE_API_KEY,
  model: "embed-english-v3.0", // 1024 dims — matches Pinecone index ✅
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

  const processedChunks = chunks.map((chunk, i) => ({
    ...chunk,
    metadata: {
      ...chunk.metadata,
      source: source,
      timestamp: Date.now(),
    },
  }));

  try {
    console.log("Embedding documents manually...");
    const texts = processedChunks.map((chunk) => chunk.pageContent);
    console.log(`Preparing to embed ${texts.length} text chunks`);

    const embeddingResponse = await embeddings.embedDocuments(texts);
    console.log(
      `Embedding response type: ${typeof embeddingResponse}, length: ${Array.isArray(embeddingResponse) ? embeddingResponse.length : "N/A"}`,
    );
    console.log(
      `First embedding type: ${Array.isArray(embeddingResponse) ? typeof embeddingResponse[0] : "N/A"}`,
    );

    if (
      !embeddingResponse ||
      !Array.isArray(embeddingResponse) ||
      embeddingResponse.length === 0
    ) {
      throw new Error(
        `Embeddings returned invalid response: ${JSON.stringify(embeddingResponse)}`,
      );
    }

    const firstEmbedding = Array.isArray(embeddingResponse[0])
      ? embeddingResponse[0]
      : embeddingResponse[0]?.values || [];
    console.log(`First embedding dimension: ${firstEmbedding.length}`);

    const vectors = processedChunks.map((chunk, i) => {
      const embedding = Array.isArray(embeddingResponse[i])
        ? embeddingResponse[i]
        : embeddingResponse[i]?.values || [];
      return {
        id: `doc-${Date.now()}-${i}`,
        values: embedding,
        metadata: {
          text: chunk.pageContent,
          ...chunk.metadata,
        },
      };
    });

    console.log(
      `Created ${vectors.length} vectors, first vector ID: ${vectors[0]?.id}, values length: ${vectors[0]?.values?.length}`,
    );
    console.log(`Upserting ${vectors.length} vectors to Pinecone...`);
    await index.upsert(vectors);
    console.log(`Stored ${vectors.length} chunks in Pinecone ✅`);
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

  const results = await vectorStore.similaritySearch(question, 3);
  const context = results.map((result) => result.pageContent).join("\n");

  const response = await chain.invoke({
    pdfText: context,
  });

  return response.content;
}

export { setup, query };
