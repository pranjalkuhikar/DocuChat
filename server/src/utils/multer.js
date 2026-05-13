import multer from "multer";

// Use memory storage for Multer with size limit
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
  },
});

export default upload;
