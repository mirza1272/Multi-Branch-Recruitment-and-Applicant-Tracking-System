import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Route imports
import authRoutes from "./routes/auth.routes.js";
import branchRoutes from "./routes/branch.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import userRoutes from "./routes/user.routes.js";

// Middleware imports
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

// ─────────────────────────────────────────────
// Core Middleware
// ─────────────────────────────────────────────
app.use(express.json({ limit: "16mb" }));
app.use(express.urlencoded({ extended: true, limit: "16mb" }));
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://hrconnect-atc.vercel.app",
  "https://hrconnect-ats.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);

// CORS is already handled by the app.use(cors(...)) call above for all routes including preflight
app.use(cookieParser());

// Debug middleware to log requests
app.use((req, res, next) => {
  if (req.method === "POST" || req.method === "PATCH") {
    console.log(`\n📨 ${req.method} ${req.originalUrl}`);
    console.log(`🔐 Auth Token:`, req.cookies?.token ? "✅ Present" : "❌ Missing");
    // Only log body if it's not multipart (multer will handle that)
    if (!req.headers["content-type"]?.includes("multipart")) {
      console.log("📋 Body:", req.body);
    } else {
      console.log("📋 Type: [Multipart form data - will be parsed by multer]");
    }
  }
  next();
});

// ─────────────────────────────────────────────
// Root Route
// ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Multi-Branch Recruitment & Applicant Tracking System API", version: "1.0.0" });
});

// ─────────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/users", userRoutes);

// ─────────────────────────────────────────────
// 404 Handler
// ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found` });
});

// ─────────────────────────────────────────────
// Global Error Handler (must be last)
// ─────────────────────────────────────────────
app.use(errorHandler);

export default app;
