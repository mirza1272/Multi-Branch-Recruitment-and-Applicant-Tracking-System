import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import { sendOTP } from "../utils/mailer.js";
import { getAuthUrl, getTokensFromCode } from "../utils/googleCalendar.js";

// ─────────────────────────────────────────────
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────────────
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const register = asyncHandler(async (req, res) => {
  if (!req.body) {
    throw new ApiError(400, "Request body is required");
  }

  const { name, email, password, role, phone, location, skills, company, bio } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const safeRole = role === "recruiter" ? "recruiter" : "candidate";
  const otp = generateOtp();
  const otpExpiresAt = Date.now() + 15 * 60 * 1000;

  const user = await User.create({
    name,
    email,
    password,
    role: safeRole,
    phone,
    location,
    skills,
    company,
    bio,
    otpCode: otp,
    otpExpiresAt,
    isVerified: false,
  });

  try {
    await sendOTP({ to: email, otp });
  } catch (error) {
    await User.deleteOne({ _id: user._id }).catch(() => { });
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
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, location: user.location, skills: user.skills, company: user.company, bio: user.bio },
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
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, location: user.location, skills: user.skills, company: user.company, bio: user.bio },
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
  if (req.body.phone !== undefined) updates.phone = req.body.phone;
  if (req.body.location !== undefined) updates.location = req.body.location;
  if (req.body.skills !== undefined) updates.skills = req.body.skills;
  if (req.body.company !== undefined) updates.company = req.body.company;
  if (req.body.bio !== undefined) updates.bio = req.body.bio;

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json(new ApiResponse(200, { user }, "Profile updated"));
});

// ─────────────────────────────────────────────
// @route   POST /api/auth/forgot-password
// @access  Public
// ─────────────────────────────────────────────
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User with this email does not exist");

  const otp = generateOtp();
  user.otpCode = otp;
  user.otpExpiresAt = Date.now() + 15 * 60 * 1000;
  await user.save();

  try {
    await sendOTP({ to: email, otp });
  } catch (error) {
    console.error("Forgot password email error:", error.message);
    throw new ApiError(500, "Failed to send reset code. Please try again later.");
  }

  return res.status(200).json(new ApiResponse(200, null, "Reset code sent to your email"));
});

// ─────────────────────────────────────────────
// @route   POST /api/auth/reset-password
// @access  Public
// ─────────────────────────────────────────────
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    throw new ApiError(400, "Email, code, and new password are required");
  }

  const user = await User.findOne({ email }).select("+otpCode +otpExpiresAt");
  if (!user) throw new ApiError(404, "User not found");

  if (!user.otpCode || user.otpCode !== otp) {
    throw new ApiError(400, "Invalid reset code");
  }

  if (!user.otpExpiresAt || user.otpExpiresAt < Date.now()) {
    throw new ApiError(400, "Reset code expired. Please request a new one.");
  }

  user.password = newPassword;
  user.otpCode = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  return res.status(200).json(new ApiResponse(200, null, "Password reset successfully"));
});

export const getGoogleAuthUrl = asyncHandler(async (req, res) => {
  const url = getAuthUrl();
  return res.status(200).json(new ApiResponse(200, { url }, "Google Auth URL generated"));
});

export const googleAuthCallback = asyncHandler(async (req, res) => {
  const { code } = req.query;
  if (!code) throw new ApiError(400, "Code is required");

  const tokens = await getTokensFromCode(code);

  // In a real app, you'd store tokens in the DB for the current user (HR)
  console.log("✅ Google Tokens:", tokens);

  res.send(`
    <div style="font-family: sans-serif; padding: 50px; text-align: center; background: #0F172A; color: #F1F5F9; min-height: 100vh;">
      <h1 style="color: #3B82F6;">Authentication Successful!</h1>
      <p>Google Calendar has been connected. You can now close this window.</p>
      <div style="background: #1E293B; padding: 20px; border-radius: 10px; margin-top: 20px; text-align: left; display: inline-block;">
        <p style="color: #94A3B8; font-size: 0.8rem; margin-bottom: 10px;">Refresh Token (Save this in your .env as GOOGLE_REFRESH_TOKEN if it doesn't auto-save):</p>
        <code style="word-break: break-all; color: #22C55E;">${tokens.refresh_token || "Already have one / check console"}</code>
      </div>
    </div>
  `);
});
export const checkGoogleConnection = asyncHandler(async (req, res) => {
  const isConnected = !!process.env.GOOGLE_REFRESH_TOKEN;
  return res.status(200).json(new ApiResponse(200, { isConnected }, "Connection status fetched"));
});
