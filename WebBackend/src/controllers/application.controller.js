import { Application } from "../models/application.models.js";
import { Job } from "../models/job.models.js";
import { User } from "../models/user.models.js";
import { Interview } from "../models/interview.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { CLOUDINARY_FOLDERS } from "../constants.js";
import {
  sendApplicationReceivedEmail,
  sendShortlistedEmail,
  sendRejectedEmail,
  sendAcceptedEmail,
} from "../utils/mailer.js";

// ─────────────────────────────────────────────
// @route   POST /api/applications
// @access  Candidate
// Expects multipart/form-data with fields: jobId, resume (file), coverLetter (file)
// ─────────────────────────────────────────────
export const applyForJob = asyncHandler(async (req, res) => {
  const { jobId } = req.body;
  const userId = req.user._id;

  if (!jobId) throw new ApiError(400, "Job ID is required");

  const job = await Job.findById(jobId).populate("branchId", "branchName");
  if (!job || !job.isActive) throw new ApiError(404, "Job not found or no longer active");

  // Prevent duplicate applications
  const existing = await Application.findOne({ userId, jobId });
  if (existing) throw new ApiError(409, "You have already applied for this job");

  // Upload resume to Cloudinary if provided
  let resumeUrl = "";
  if (req.files?.resume?.[0]) {
    resumeUrl = await uploadToCloudinary(
      req.files.resume[0].buffer,
      CLOUDINARY_FOLDERS.RESUMES,
      `resume_${userId}_${jobId}`
    );
  }

  // Upload cover letter to Cloudinary if provided
  let coverLetterUrl = "";
  if (req.files?.coverLetter?.[0]) {
    coverLetterUrl = await uploadToCloudinary(
      req.files.coverLetter[0].buffer,
      CLOUDINARY_FOLDERS.COVER_LETTERS,
      `cover_${userId}_${jobId}`
    );
  }

  const application = await Application.create({
    userId,
    jobId,
    resumeUrl,
    coverLetterUrl,
  });

  // Send confirmation email (non-blocking)
  sendApplicationReceivedEmail({
    to: req.user.email,
    name: req.user.name,
    jobTitle: job.title,
    branchName: job.branchId?.branchName || "Head Office",
  }).catch((err) => console.error("Email error:", err.message));

  return res.status(201).json(new ApiResponse(201, { application }, "Application submitted successfully"));
});

// ─────────────────────────────────────────────
// @route   GET /api/applications/my
// @access  Candidate — their own applications
// ─────────────────────────────────────────────
export const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ userId: req.user._id })
    .populate({
      path: "jobId",
      select: "title department seats",
      populate: { path: "branchId", select: "branchName" },
    })
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, { applications }, "Your applications fetched"));
});

// ─────────────────────────────────────────────
// @route   GET /api/applications
// @access  Admin, Recruiter — all applications with optional filters
// ─────────────────────────────────────────────
export const getAllApplications = asyncHandler(async (req, res) => {
  const { jobId, status, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (jobId) filter.jobId = jobId;
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Application.countDocuments(filter);

  const applications = await Application.find(filter)
    .populate("userId", "name email")
    .populate({
      path: "jobId",
      select: "title department",
      populate: { path: "branchId", select: "branchName" },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return res.status(200).json(
    new ApiResponse(200, {
      applications,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    }, "Applications fetched")
  );
});

// ─────────────────────────────────────────────
// @route   GET /api/applications/:id
// @access  Admin, Recruiter, or Owner Candidate
// ─────────────────────────────────────────────
export const getApplicationById = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate("userId", "name email")
    .populate({
      path: "jobId",
      populate: { path: "branchId", select: "branchName" },
    });

  if (!application) throw new ApiError(404, "Application not found");

  // Candidates can only view their own
  if (
    req.user.role === "candidate" &&
    application.userId._id.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "Access denied");
  }

  // Attach interview if it exists
  const interview = await Interview.findOne({ applicationId: application._id });

  return res.status(200).json(new ApiResponse(200, { application, interview }, "Application fetched"));
});

// ─────────────────────────────────────────────
// @route   PATCH /api/applications/:id/status
// @access  Admin, Recruiter
// ─────────────────────────────────────────────
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["pending", "shortlisted", "rejected", "accepted"];

  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }

  const application = await Application.findById(req.params.id)
    .populate("userId", "name email")
    .populate({ path: "jobId", select: "title" });

  if (!application) throw new ApiError(404, "Application not found");

  application.status = status;
  await application.save();

  // Send appropriate email notification (non-blocking)
  const emailData = {
    to: application.userId.email,
    name: application.userId.name,
    jobTitle: application.jobId.title,
  };

  if (status === "shortlisted") {
    sendShortlistedEmail(emailData).catch((e) => console.error("Email error:", e.message));
  } else if (status === "rejected") {
    sendRejectedEmail(emailData).catch((e) => console.error("Email error:", e.message));
  } else if (status === "accepted") {
    sendAcceptedEmail({ ...emailData, branchName: "Head Office" }).catch((e) =>
      console.error("Email error:", e.message)
    );
  }

  return res.status(200).json(new ApiResponse(200, { application }, `Application ${status}`));
});

// ─────────────────────────────────────────────
// @route   DELETE /api/applications/:id
// @access  Admin (hard delete) or Candidate (withdraw own)
// ─────────────────────────────────────────────
export const deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) throw new ApiError(404, "Application not found");

  if (
    req.user.role === "candidate" &&
    application.userId.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "You can only withdraw your own applications");
  }

  // Remove uploaded files from Cloudinary
  await deleteFromCloudinary(application.resumeUrl);
  await deleteFromCloudinary(application.coverLetterUrl);

  // Remove any scheduled interview
  await Interview.deleteOne({ applicationId: application._id });

  await application.deleteOne();
  return res.status(200).json(new ApiResponse(200, null, "Application withdrawn"));
});
