import { Router } from "express";
import {
  register,
  login,
  verifyOtp,
  resendOtp,
  logout,
  getMe,
  updateProfile,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/logout", verifyJWT, logout);
router.get("/me", verifyJWT, getMe);
router.patch("/me", verifyJWT, updateProfile);

export default router;
