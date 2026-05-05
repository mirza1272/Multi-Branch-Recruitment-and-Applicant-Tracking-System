import { Router } from "express";
import {
  scheduleInterview,
  getAllInterviews,
  getInterviewById,
  getInterviewByApplication,
  updateInterview,
  deleteInterview,
} from "../controllers/interview.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

// HR only
router.post("/", authorizeRoles("admin", "recruiter"), scheduleInterview);
router.get("/", authorizeRoles("admin", "recruiter"), getAllInterviews);

// Candidate can view their own interview via application ID
router.get("/application/:applicationId", getInterviewByApplication);

router.get("/:id", getInterviewById);
router.patch("/:id", authorizeRoles("admin", "recruiter"), updateInterview);
router.delete("/:id", authorizeRoles("admin", "recruiter"), deleteInterview);

export default router;
