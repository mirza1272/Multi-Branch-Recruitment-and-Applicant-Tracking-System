import { Router } from "express";
import {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
} from "../controllers/branch.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

// Public
router.get("/", getAllBranches);
router.get("/:id", getBranchById);

// Protected — HR roles
router.post("/", verifyJWT, authorizeRoles("admin", "recruiter"), createBranch);
router.patch("/:id", verifyJWT, authorizeRoles("admin", "recruiter"), updateBranch);
router.delete("/:id", verifyJWT, authorizeRoles("admin"), deleteBranch);

export default router;
