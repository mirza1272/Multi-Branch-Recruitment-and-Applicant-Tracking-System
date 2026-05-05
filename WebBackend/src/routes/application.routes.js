import { Router } from "express";
import {
  applyForJob,
  getMyApplications,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
} from "../controllers/application.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

// Candidate routes
router.post(
  "/",
  authorizeRoles("candidate"),
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 },
  ]),
  applyForJob
);
router.get("/my", authorizeRoles("candidate"), getMyApplications);

// HR routes
router.get("/", authorizeRoles("admin", "recruiter"), getAllApplications);
router.patch(
  "/:id/status",
  authorizeRoles("admin", "recruiter"),
  updateApplicationStatus
);

// Shared (candidate sees own, HR sees all)
router.get("/:id", getApplicationById);
router.delete("/:id", deleteApplication);

export default router;
