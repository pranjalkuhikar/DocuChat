import dotenv from "dotenv";

dotenv.config();

const _config = {
  PORT: process.env.PORT?.trim(),
  GEMINI_API_KEY: process.env.GEMINI_API_KEY?.trim(),
  PINECONE_API_KEY: process.env.PINECONE_API_KEY?.trim(),
  PINECONE_INDEX: process.env.PINECONE_INDEX?.trim(),
  COHERE_API_KEY: process.env.COHERE_API_KEY?.trim(),
  IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY?.trim(),
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY?.trim(),
  IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT?.trim(),
};

if (!_config.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in .env file");
}

const config = Object.freeze(_config);

export default config;
