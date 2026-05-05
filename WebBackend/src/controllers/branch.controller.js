import { Branch } from "../models/branch.models.js";
import { Job } from "../models/job.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// ─────────────────────────────────────────────
// @route   POST /api/branches
// @access  Admin, Recruiter
// ─────────────────────────────────────────────
export const createBranch = asyncHandler(async (req, res) => {
  const { branchName } = req.body;
  if (!branchName) throw new ApiError(400, "Branch name is required");

  const branch = await Branch.create({ branchName });
  return res.status(201).json(new ApiResponse(201, { branch }, "Branch created"));
});

// ─────────────────────────────────────────────
// @route   GET /api/branches
// @access  Public
// ─────────────────────────────────────────────
export const getAllBranches = asyncHandler(async (req, res) => {
  const branches = await Branch.find().sort({ branchName: 1 });
  return res.status(200).json(new ApiResponse(200, { branches }, "Branches fetched"));
});

// ─────────────────────────────────────────────
// @route   GET /api/branches/:id
// @access  Public
// ─────────────────────────────────────────────
export const getBranchById = asyncHandler(async (req, res) => {
  const branch = await Branch.findById(req.params.id);
  if (!branch) throw new ApiError(404, "Branch not found");
  return res.status(200).json(new ApiResponse(200, { branch }, "Branch fetched"));
});

// ─────────────────────────────────────────────
// @route   PATCH /api/branches/:id
// @access  Admin
// ─────────────────────────────────────────────
export const updateBranch = asyncHandler(async (req, res) => {
  const { branchName } = req.body;
  if (!branchName) throw new ApiError(400, "Branch name is required");

  const branch = await Branch.findByIdAndUpdate(
    req.params.id,
    { branchName },
    { new: true, runValidators: true }
  );
  if (!branch) throw new ApiError(404, "Branch not found");

  return res.status(200).json(new ApiResponse(200, { branch }, "Branch updated"));
});

// ─────────────────────────────────────────────
// @route   DELETE /api/branches/:id
// @access  Admin
// ─────────────────────────────────────────────
export const deleteBranch = asyncHandler(async (req, res) => {
  const branch = await Branch.findById(req.params.id);
  if (!branch) throw new ApiError(404, "Branch not found");

  // Check if any jobs reference this branch
  const jobCount = await Job.countDocuments({ branchId: req.params.id });
  if (jobCount > 0) {
    throw new ApiError(
      409,
      `Cannot delete branch. ${jobCount} job(s) are assigned to it. Reassign or delete them first.`
    );
  }

  await branch.deleteOne();
  return res.status(200).json(new ApiResponse(200, null, "Branch deleted"));
});
