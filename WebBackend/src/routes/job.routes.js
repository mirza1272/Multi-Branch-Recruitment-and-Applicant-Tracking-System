import { Router } from "express";
import {
  createJob,
  getAllJobs,
  getAllJobsAdmin,
  getJobById,
  searchJobs,
  updateJob,
  closeJob,
  deleteJob,
  getJobStats,
} from "../controllers/job.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

// ─────────────────────────────────────────────
// PUBLIC ROUTES (No Auth Required)
// ─────────────────────────────────────────────

// Get all open jobs with filters and pagination
router.get("/", getAllJobs);

// Search jobs by keyword
router.get("/search/:query", searchJobs);

// Get single job by ID
router.get("/:jobId", getJobById);

// ─────────────────────────────────────────────
// PROTECTED ROUTES (Auth Required)
// ─────────────────────────────────────────────

// Create new job (Admin/Recruiter only)
router.post(
  "/",
  verifyJWT,
  authorizeRoles("admin", "recruiter"),
  createJob
);

// Get all jobs including inactive (Admin/Recruiter only)
router.get(
  "/admin/all",
  verifyJWT,
  authorizeRoles("admin", "recruiter"),
  getAllJobsAdmin
);

// Get job statistics (Admin/Recruiter only)
router.get(
  "/admin/stats/dashboard",
  verifyJWT,
  authorizeRoles("admin", "recruiter"),
  getJobStats
);

// Update job (Admin/Recruiter who created it)
router.patch(
  "/:jobId",
  verifyJWT,
  authorizeRoles("admin", "recruiter"),
  updateJob
);

// Close job (Admin/Recruiter who created it)
router.patch(
  "/:jobId/close",
  verifyJWT,
  authorizeRoles("admin", "recruiter"),
  closeJob
);

// Delete job (Admin only)
router.delete(
  "/:jobId",
  verifyJWT,
  authorizeRoles("admin"),
  deleteJob
);

export default router;
