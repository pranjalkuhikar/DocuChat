import express from "express";
import upload from "../utils/multer.js";
import { docUpload, processURL, chat, clearDB } from "../controllers/doc.controller.js";

const router = express.Router();

router.post("/upload", upload.single("pdf"), docUpload);
router.post("/url", processURL);
router.post("/chat", chat);
router.delete("/clear", clearDB);

export default router;
