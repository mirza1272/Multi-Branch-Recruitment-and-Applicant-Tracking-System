import { Router } from "express";
import {
  createJob,
  getAllJobs,
  getAllJobsAdmin,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/job.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

// Public
router.get("/", getAllJobs);
router.get("/:id", getJobById);

// HR only
router.get(
  "/admin/all",
  verifyJWT,
  authorizeRoles("admin", "recruiter"),
  getAllJobsAdmin
);
router.post("/", verifyJWT, authorizeRoles("admin", "recruiter"), createJob);
router.patch("/:id", verifyJWT, authorizeRoles("admin", "recruiter"), updateJob);
router.delete("/:id", verifyJWT, authorizeRoles("admin"), deleteJob);

export default router;
