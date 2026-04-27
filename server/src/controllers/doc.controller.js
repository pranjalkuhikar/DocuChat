import { setup, query, deleteAll } from "../utils/rag.js";
import ImageKit from "imagekit";
import config from "../config/config.js";

// Setup ImageKit
const imagekit = new ImageKit({
  publicKey: config.IMAGEKIT_PUBLIC_KEY,
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
});

export const docUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload to ImageKit manually since we're using memory storage
    const uploadResponse = await imagekit.upload({
      file: req.file.buffer, // required
      fileName: Date.now() + "-" + req.file.originalname, // required
      folder: "/docuchat",
    });

    const fileUrl = uploadResponse.url;
    await setup(fileUrl);

    res.json({ message: "PDF processed successfully" });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const processURL = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "No URL provided" });
    }
    await setup(url);
    res.json({ message: "URL processed successfully" });
  } catch (error) {
    console.error("URL error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }
    const response = await query(message);
    res.json({ response });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error.message });
  }
};
export const clearDB = async (req, res) => {
  try {
    await deleteAll();
    res.json({ message: "Pinecone index cleared successfully" });
  } catch (error) {
    console.error("Clear DB error:", error);
    res.status(500).json({ error: error.message });
  }
};
