import { Job } from "../models/job.models.js";
import { Branch } from "../models/branch.models.js";
import { Application } from "../models/application.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// ─────────────────────────────────────────────
// @route   POST /api/jobs
// @access  Admin, Recruiter
// ─────────────────────────────────────────────
export const createJob = asyncHandler(async (req, res) => {
  const { branchId, title, description, department, seats } = req.body;

  if (!branchId || !title) {
    throw new ApiError(400, "Branch and job title are required");
  }

  const branch = await Branch.findById(branchId);
  if (!branch) throw new ApiError(404, "Branch not found");

  const job = await Job.create({ branchId, title, description, department, seats });
  await job.populate("branchId", "branchName");

  return res.status(201).json(new ApiResponse(201, { job }, "Job created"));
});

// ─────────────────────────────────────────────
// @route   GET /api/jobs
// @access  Public  (search + filter support)
// ─────────────────────────────────────────────
export const getAllJobs = asyncHandler(async (req, res) => {
  const { branch, department, search, page = 1, limit = 10 } = req.query;

  const filter = { isActive: true };

  if (branch) filter.branchId = branch;
  if (department) filter.department = new RegExp(department, "i");
  if (search) filter.title = new RegExp(search, "i");

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Job.countDocuments(filter);

  const jobs = await Job.find(filter)
    .populate("branchId", "branchName")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return res.status(200).json(
    new ApiResponse(200, {
      jobs,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    }, "Jobs fetched")
  );
});

// ─────────────────────────────────────────────
// @route   GET /api/jobs/all  (admin sees inactive too)
// @access  Admin, Recruiter
// ─────────────────────────────────────────────
export const getAllJobsAdmin = asyncHandler(async (req, res) => {
  const jobs = await Job.find()
    .populate("branchId", "branchName")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, { jobs }, "All jobs fetched"));
});

// ─────────────────────────────────────────────
// @route   GET /api/jobs/:id
// @access  Public
// ─────────────────────────────────────────────
export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate("branchId", "branchName");
  if (!job) throw new ApiError(404, "Job not found");
  return res.status(200).json(new ApiResponse(200, { job }, "Job fetched"));
});

// ─────────────────────────────────────────────
// @route   PATCH /api/jobs/:id
// @access  Admin, Recruiter
// ─────────────────────────────────────────────
export const updateJob = asyncHandler(async (req, res) => {
  const { branchId, title, description, department, seats, isActive } = req.body;

  if (branchId) {
    const branch = await Branch.findById(branchId);
    if (!branch) throw new ApiError(404, "Branch not found");
  }

  const job = await Job.findByIdAndUpdate(
    req.params.id,
    { branchId, title, description, department, seats, isActive },
    { new: true, runValidators: true, omitUndefined: true }
  ).populate("branchId", "branchName");

  if (!job) throw new ApiError(404, "Job not found");
  return res.status(200).json(new ApiResponse(200, { job }, "Job updated"));
});

// ─────────────────────────────────────────────
// @route   DELETE /api/jobs/:id
// @access  Admin
// ─────────────────────────────────────────────
export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new ApiError(404, "Job not found");

  // Prevent deletion if applications exist
  const appCount = await Application.countDocuments({ jobId: req.params.id });
  if (appCount > 0) {
    throw new ApiError(
      409,
      `Cannot delete job. ${appCount} application(s) exist for it.`
    );
  }

  await job.deleteOne();
  return res.status(200).json(new ApiResponse(200, null, "Job deleted"));
});
