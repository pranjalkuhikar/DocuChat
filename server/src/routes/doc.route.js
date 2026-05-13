import express from "express";
import upload from "../utils/multer.js";
import { docUpload, processURL, chat, clearDB } from "../controllers/doc.controller.js";
import {
  validateFile,
  validateURL,
  validateMessage,
} from "../middleware/validation.js";

const router = express.Router();

router.post("/upload", upload.single("pdf"), validateFile, docUpload);
router.post("/url", validateURL, processURL);
router.post("/chat", validateMessage, chat);
router.delete("/clear", clearDB);

export default router;
