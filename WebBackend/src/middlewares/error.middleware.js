import ApiError from "../utils/ApiError.js";

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(`\n${'='.repeat(60)}`);
  console.error(`❌ ERROR HANDLER TRIGGERED`);
  console.error(`📍 Path: ${req.method} ${req.originalUrl}`);
  console.error(`💬 Message: ${err.message}`);
  console.error(`📌 Type: ${err.name || "Unknown"}`);
  console.error(`${'='.repeat(60)}\n`);

  // If it's our custom ApiError, use its status code
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }

  // Mongoose duplicate key error (e.g., unique email/application)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists.`,
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    console.error(`Validation errors:`, messages);
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: messages,
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // JWT errors are handled in auth middleware — catch any that slip through
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }

  // Multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ success: false, message: "File too large. Max size is 5MB." });
  }

  // Fallback: 500 Internal Server Error
  console.error("UNHANDLED ERROR:", err);
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { error: err.message, stack: err.stack }),
  });
};

export default errorHandler;
