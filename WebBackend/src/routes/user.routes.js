import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUserRole,
  deleteUser,
} from "../controllers/user.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

// All user management routes require Admin role
router.use(verifyJWT, authorizeRoles("admin"));

router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/:id", getUserById);
router.patch("/:id/role", updateUserRole);
router.delete("/:id", deleteUser);

export default router;
