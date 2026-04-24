import { setup, query } from "../utils/rag.js";
import fs from "fs";

export const docUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const filePath = req.file.path;
    await setup(filePath);

    // Cleanup: Delete the file after processing
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
      else console.log(`Deleted temporary file: ${filePath} 🗑️`);
    });

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
