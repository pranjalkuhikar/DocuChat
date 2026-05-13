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
    const uploadResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName: Date.now() + "-" + req.file.originalname,
      folder: "/docuchat",
    });

    const fileUrl = uploadResponse.url;
    await setup(fileUrl);

    res.json({
      message: "PDF processed successfully",
      fileName: req.file.originalname,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      error: error.message || "Failed to process PDF. Please try again.",
    });
  }
};

export const processURL = async (req, res) => {
  try {
    const { url } = req.body;
    await setup(url);

    res.json({
      message: "URL processed successfully",
      url: url,
    });
  } catch (error) {
    console.error("URL error:", error);

    // Provide more specific error messages
    let errorMessage = "Failed to process URL. Please try again.";
    if (error.message.includes("404"))
      errorMessage = "URL not found (404). Please check the URL.";
    if (error.message.includes("fetch"))
      errorMessage = "Unable to fetch URL. Please check the URL is accessible.";
    if (error.message.includes("No text"))
      errorMessage = "No text content could be extracted from this URL.";

    res.status(400).json({ error: errorMessage });
  }
};

export const chat = async (req, res) => {
  try {
    const { message } = req.body;
    const response = await query(message);
    res.json({ response });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: error.message || "Failed to process chat. Please try again.",
    });
  }
};

export const clearDB = async (req, res) => {
  try {
    await deleteAll();
    res.json({ message: "Pinecone index cleared successfully" });
  } catch (error) {
    console.error("Clear DB error:", error);
    res.status(500).json({ error: "Failed to clear database" });
  }
};
