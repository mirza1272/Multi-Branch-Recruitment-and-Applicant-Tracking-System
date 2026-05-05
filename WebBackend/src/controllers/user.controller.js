import { User } from "../models/user.models.js";
import { Application } from "../models/application.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// ─────────────────────────────────────────────
// @route   GET /api/users
// @access  Admin
// ─────────────────────────────────────────────
export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, search } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (search) filter.name = new RegExp(search, "i");

  const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, { users }, "Users fetched"));
});

// ─────────────────────────────────────────────
// @route   GET /api/users/:id
// @access  Admin
// ─────────────────────────────────────────────
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) throw new ApiError(404, "User not found");
  return res.status(200).json(new ApiResponse(200, { user }, "User fetched"));
});

// ─────────────────────────────────────────────
// @route   POST /api/users
// @access  Admin — create admin/recruiter accounts
// ─────────────────────────────────────────────
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    throw new ApiError(400, "Name, email, password, and role are required");
  }

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, "Email already registered");

  const user = await User.create({ name, email, password, role });
  return res.status(201).json(
    new ApiResponse(201, {
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    }, "User created")
  );
});

// ─────────────────────────────────────────────
// @route   PATCH /api/users/:id/role
// @access  Admin — change a user's role
// ─────────────────────────────────────────────
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const validRoles = ["admin", "recruiter", "candidate"];
  if (!validRoles.includes(role)) {
    throw new ApiError(400, `Role must be one of: ${validRoles.join(", ")}`);
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select("-password");

  if (!user) throw new ApiError(404, "User not found");
  return res.status(200).json(new ApiResponse(200, { user }, "User role updated"));
});

// ─────────────────────────────────────────────
// @route   DELETE /api/users/:id
// @access  Admin
// ─────────────────────────────────────────────
export const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    throw new ApiError(400, "You cannot delete your own account");
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  // Optionally cascade-delete their applications
  await Application.deleteMany({ userId: req.params.id });

  return res.status(200).json(new ApiResponse(200, null, "User deleted"));
});
