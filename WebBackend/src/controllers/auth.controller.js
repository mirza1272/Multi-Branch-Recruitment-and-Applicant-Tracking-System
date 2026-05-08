import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import { sendOTP } from "../utils/mailer.js";

// ─────────────────────────────────────────────
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────────────
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const register = asyncHandler(async (req, res) => {
  if (!req.body) {
    throw new ApiError(400, "Request body is required");
  }

  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  // Only allow 'candidate' self-registration. admin/recruiter set by admin.
  const safeRole = role === "candidate" ? "candidate" : "candidate";
  const otp = generateOtp();
  const otpExpiresAt = Date.now() + 15 * 60 * 1000;

  const user = await User.create({
    name,
    email,
    password,
    role: safeRole,
    otpCode: otp,
    otpExpiresAt,
    isVerified: false,
  });

  try {
    await sendOTP({ to: email, otp });
  } catch (error) {
    await User.deleteOne({ _id: user._id }).catch(() => {});
    console.error("Email send nahi ho saki:", error.message);
    return res.status(500).json({ message: "Email sending failed" });
  }

  return res.status(201).json(
    new ApiResponse(201, { email: user.email, userId: user._id }, "OTP sent to email")
  );
});

// ─────────────────────────────────────────────
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
  if (!req.body) {
    throw new ApiError(400, "Request body is required");
  }

  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password +isVerified");
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (user.isVerified === false) {
    throw new ApiError(401, "Email not verified. Please verify your account before logging in.");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateTokenAndSetCookie(res, { userId: user._id, role: user.role });

  return res.status(200).json(
    new ApiResponse(200, {
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    }, "Login successful")
  );
});

export const verifyOtp = asyncHandler(async (req, res) => {
  if (!req.body) {
    throw new ApiError(400, "Request body is required");
  }

  const { email, otp } = req.body;
  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }

  const user = await User.findOne({ email }).select("+otpCode +otpExpiresAt +isVerified");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isVerified === true) {
    throw new ApiError(400, "User is already verified");
  }

  if (!user.otpCode || user.otpCode !== otp) {
    throw new ApiError(400, "Invalid verification code");
  }

  if (!user.otpExpiresAt || user.otpExpiresAt < Date.now()) {
    throw new ApiError(400, "OTP expired. Please request a new one.");
  }

  user.isVerified = true;
  user.otpCode = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  const token = generateTokenAndSetCookie(res, { userId: user._id, role: user.role });

  return res.status(200).json(
    new ApiResponse(200, {
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    }, "Email verified successfully")
  );
});

export const resendOtp = asyncHandler(async (req, res) => {
  if (!req.body) {
    throw new ApiError(400, "Request body is required");
  }

  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isVerified === true) {
    throw new ApiError(400, "User is already verified");
  }

  const otp = generateOtp();
  user.otpCode = otp;
  user.otpExpiresAt = Date.now() + 15 * 60 * 1000;
  await user.save();

  try {
    await sendOTP({ to: email, otp });
  } catch (error) {
    console.error("Email send nahi ho saki:", error.message);
    return res.status(500).json({ message: "Email sending failed" });
  }

  return res.status(200).json(new ApiResponse(200, { email: user.email }, "New OTP sent"));
});

// ─────────────────────────────────────────────
// @route   POST /api/auth/logout
// @access  Private
// ─────────────────────────────────────────────
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});

// ─────────────────────────────────────────────
// @route   GET /api/auth/me
// @access  Private
// ─────────────────────────────────────────────
export const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, { user: req.user }, "User fetched"));
});

// ─────────────────────────────────────────────
// @route   PATCH /api/auth/me
// @access  Private
// ─────────────────────────────────────────────
export const updateProfile = asyncHandler(async (req, res) => {
  if (!req.body) {
    throw new ApiError(400, "Request body is required");
  }

  const { name, email } = req.body;

  const updates = {};
  if (name) updates.name = name;
  if (email) {
    const existing = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (existing) throw new ApiError(409, "Email already in use by another account");
    updates.email = email;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json(new ApiResponse(200, { user }, "Profile updated"));
});
