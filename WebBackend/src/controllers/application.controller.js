import path from "path";
import { Application } from "../models/application.models.js";
import { Job } from "../models/job.models.js";
import { User } from "../models/user.models.js";
import { Interview } from "../models/interview.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadToSupabase, deleteFromSupabase } from "../utils/supabase.js";
import {
  sendApplicationReceivedEmail,
  sendShortlistedEmail,
  sendRejectedEmail,
  sendAcceptedEmail,
  sendInterviewScheduledEmail,
} from "../utils/mailer.js";

export const applyForJob = asyncHandler(async (req, res) => {
  try {
    const {
      jobId, firstName, lastName, email, phone, location,
      qualification, experience, currentCompany, skills,
      additionalInfo, achievement, expectedSalary
    } = req.body;
    const userId = req.user._id;

    if (!jobId) throw new ApiError(400, "Job ID is required");

    const job = await Job.findById(jobId).populate("branchId", "branchName");
    if (!job) throw new ApiError(404, "Job not found");
    if (!job.isActive) throw new ApiError(400, "Job is no longer active");

    const existing = await Application.findOne({ userId, jobId });
    if (existing) throw new ApiError(409, "You have already applied for this job");

    // Upload resume to Supabase
    let resumeUrl = "";
    if (req.files?.resume?.[0]) {
      const file = req.files.resume[0];
      const ext = path.extname(file.originalname) || ".pdf";
      const fileName = `applications/resume_${userId}_${jobId}_${Date.now()}${ext}`;
      const result = await uploadToSupabase(file.buffer, fileName, file.mimetype);
      resumeUrl = result.url;
    }

    // Upload cover letter to Supabase
    let coverLetterUrl = "";
    if (req.files?.coverLetter?.[0]) {
      const file = req.files.coverLetter[0];
      const ext = path.extname(file.originalname) || ".pdf";
      const fileName = `applications/cover_${userId}_${jobId}_${Date.now()}${ext}`;
      const result = await uploadToSupabase(file.buffer, fileName, file.mimetype);
      coverLetterUrl = result.url;
    }

    // Update user profile
    await User.findByIdAndUpdate(userId, {
      $set: {
        ...(firstName && lastName && { name: `${firstName} ${lastName}` }),
        ...(phone && { phone }),
        ...(location && { location }),
        ...(qualification && { qualification }),
        ...(experience && { experience }),
        ...(currentCompany && { company: currentCompany }),
        ...(skills && { skills }),
      },
    });

    const application = await Application.create({
      userId, jobId,
      candidateName: firstName && lastName ? `${firstName} ${lastName}` : req.user.name,
      candidateEmail: email || req.user.email,
      candidatePhone: phone, candidateLocation: location,
      candidateQualification: qualification, candidateExperience: experience,
      candidateCurrentCompany: currentCompany, candidateSkills: skills,
      resumeUrl, coverLetterUrl, additionalInfo, achievement, expectedSalary,
    });

    sendApplicationReceivedEmail({
      to: email || req.user.email,
      name: firstName && lastName ? `${firstName} ${lastName}` : req.user.name,
      jobTitle: job.title,
      branchName: job.branchId?.branchName || "Head Office",
    }).catch((err) => console.error("Email error:", err.message));

    return res.status(201).json(new ApiResponse(201, { application }, "Application submitted successfully"));
  } catch (error) {
    throw error;
  }
});

// ─────────────────────────────────────────────
// @route   GET /api/applications/my
// ─────────────────────────────────────────────
export const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ userId: req.user._id })
    .populate({ path: "jobId", populate: { path: "branchId", select: "branchName" } })
    .sort({ createdAt: -1 })
    .lean();
  return res.status(200).json(new ApiResponse(200, { applications }, "Your applications fetched"));
});

// ─────────────────────────────────────────────
// @route   GET /api/applications
// ─────────────────────────────────────────────
export const getAllApplications = asyncHandler(async (req, res) => {
  const { jobId, status, page = 1, limit = 20 } = req.query;
  const filter = {};

  if (req.user.role === "recruiter") {
    const myJobs = await Job.find({ createdBy: req.user._id }).select("_id");
    filter.jobId = { $in: myJobs.map(j => j._id) };
  }

  if (jobId) filter.jobId = jobId;
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Application.countDocuments(filter);

  const applications = await Application.find(filter)
    .populate("userId", "name email")
    .populate({ path: "jobId", populate: { path: "branchId", select: "branchName" } })
    .sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean();

  return res.status(200).json(
    new ApiResponse(200, { applications, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } }, "Applications fetched")
  );
});

// ─────────────────────────────────────────────
// @route   GET /api/applications/:id
// ─────────────────────────────────────────────
export const getApplicationById = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate("userId", "name email")
    .populate({ path: "jobId", populate: [{ path: "branchId", select: "branchName" }, { path: "createdBy" }] });

  if (!application) throw new ApiError(404, "Application not found");

  if (req.user.role === "candidate" && application.userId._id.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Access denied");
  }

  const interview = await Interview.findOne({ applicationId: application._id });
  return res.status(200).json(new ApiResponse(200, { application, interview }, "Application fetched"));
});

// ─────────────────────────────────────────────
// @route   PATCH /api/applications/:id/status
// ─────────────────────────────────────────────
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const application = await Application.findById(req.params.id)
    .populate("userId", "name email")
    .populate({ path: "jobId", select: "title" });

  if (!application) throw new ApiError(404, "Application not found");
  application.status = status;
  await application.save();

  const emailData = {
    to: application.userId.email,
    name: application.userId.name,
    jobTitle: application.jobId.title,
    hrEmail: req.user.email
  };

  if (status === "shortlisted") sendShortlistedEmail(emailData).catch(() => { });
  else if (status === "rejected") sendRejectedEmail(emailData).catch(() => { });
  else if (status === "accepted") sendAcceptedEmail({ ...emailData, branchName: "Head Office" }).catch(() => { });

  return res.status(200).json(new ApiResponse(200, { application }, `Application ${status}`));
});

// ─────────────────────────────────────────────
// @route   DELETE /api/applications/:id
// ─────────────────────────────────────────────
export const deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) throw new ApiError(404, "Application not found");

  await deleteFromSupabase(application.resumeUrl);
  await deleteFromSupabase(application.coverLetterUrl);
  await Interview.deleteOne({ applicationId: application._id });
  await application.deleteOne();

  return res.status(200).json(new ApiResponse(200, null, "Application withdrawn"));
});
