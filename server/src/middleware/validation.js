// File validation middleware
export const validateFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const FILE_SIZE_LIMIT = 25 * 1024 * 1024; // 25MB
  const ALLOWED_TYPES = ["application/pdf"];

  if (req.file.size > FILE_SIZE_LIMIT) {
    return res.status(400).json({
      error: `File size exceeds ${FILE_SIZE_LIMIT / (1024 * 1024)}MB limit`,
    });
  }

  if (!ALLOWED_TYPES.includes(req.file.mimetype)) {
    return res
      .status(400)
      .json({ error: "Only PDF files are allowed" });
  }

  next();
};

// URL validation middleware
export const validateURL = (req, res, next) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    new URL(url);
  } catch {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  next();
};

// Message validation
export const validateMessage = (req, res, next) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  if (message.trim().length < 3) {
    return res
      .status(400)
      .json({ error: "Message must be at least 3 characters" });
  }

  if (message.trim().length > 500) {
    return res
      .status(400)
      .json({ error: "Message must not exceed 500 characters" });
  }

  next();
};
