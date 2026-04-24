import dotenv from "dotenv";

dotenv.config();

const _config = {
  PORT: process.env.PORT?.trim(),
  GEMINI_API_KEY: process.env.GEMINI_API_KEY?.trim(),
  PINECONE_API_KEY: process.env.PINECONE_API_KEY?.trim(),
  PINECONE_INDEX: process.env.PINECONE_INDEX?.trim(),
  COHERE_API_KEY: process.env.COHERE_API_KEY?.trim(),
};

if (!_config.GEMINI_API_KEY) {
  throw new Error(`Missing GEMINI_API_KEY in ${envFilePath}`);
}

const config = Object.freeze(_config);

export default config;
