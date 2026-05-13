// Timeout middleware to prevent hanging requests
export const requestTimeout = (timeoutMs = 120000) => {
  return (req, res, next) => {
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        res.status(408).json({ error: "Request timeout. Please try again." });
      }
    }, timeoutMs);

    res.on("finish", () => clearTimeout(timeout));
    res.on("close", () => clearTimeout(timeout));

    next();
  };
};

// Error logging utility
export const logError = (error, context = "") => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ${context}:`, error.message);
  if (error.stack) console.error(error.stack);
};

// Response wrapper
export const sendSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
  });
};

export const sendError = (res, error, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    error:
      typeof error === "string"
        ? error
        : error.message || "An error occurred",
  });
};
