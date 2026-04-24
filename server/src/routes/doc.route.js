import express from "express";
import upload from "../utils/multer.js";
import { docUpload, processURL, chat } from "../controllers/doc.controller.js";

const router = express.Router();

router.post("/upload", upload.single("pdf"), docUpload);
router.post("/url", processURL);
router.post("/chat", chat);

export default router;
