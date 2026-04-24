import multer from "multer";
import fs from "fs";

// Setup multer for file uploads
const upload = multer({ dest: "uploads/" });

// Ensure uploads directory exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

export default upload;
