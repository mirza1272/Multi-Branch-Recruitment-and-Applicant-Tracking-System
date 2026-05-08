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
  try {
    const { 
      jobId,
      firstName,
      lastName,
      email,
      phone,
      location,
      qualification,
      experience,
      currentCompany,
      skills,
      additionalInfo,
      achievement,
      expectedSalary
    } = req.body;
    const userId = req.user._id;

    console.log(`\n${'='.repeat(60)}`);
    console.log(`📝 APPLICATION SUBMISSION STARTED`);
    console.log(`📊 User ID: ${userId}`);
    console.log(`📊 Job ID: ${jobId}`);
    console.log(`📂 Files received:`, Object.keys(req.files || {}));
    if (req.files?.resume) console.log(`   - Resume: ${req.files.resume[0].originalname} (${req.files.resume[0].size} bytes)`);
    if (req.files?.coverLetter) console.log(`   - Cover Letter: ${req.files.coverLetter[0].originalname} (${req.files.coverLetter[0].size} bytes)`);
    console.log(`📋 Candidate Info - ${firstName} ${lastName} (${email})`);
    console.log(`${'='.repeat(60)}\n`);

    if (!jobId) throw new ApiError(400, "Job ID is required");

    console.log(`🔍 Checking if job exists (ID: ${jobId})...`);
    const job = await Job.findById(jobId).populate("branchId", "branchName");
    if (!job) {
      console.error(`❌ Job not found: ${jobId}`);
      throw new ApiError(404, "Job not found");
    }
    if (!job.isActive) {
      console.error(`❌ Job is not active: ${jobId}`);
      throw new ApiError(404, "Job is no longer active");
    }
    console.log(`✅ Job found: ${job.title}`);

    // Prevent duplicate applications
    console.log(`🔍 Checking for duplicate applications...`);
    const existing = await Application.findOne({ userId, jobId });
    if (existing) {
      console.error(`❌ Duplicate application - User already applied for this job`);
      throw new ApiError(409, "You have already applied for this job");
    }
    console.log(`✅ No duplicate found`);

    // Upload resume to Cloudinary if provided
    let resumeUrl = "";
    if (req.files?.resume?.[0]) {
      try {
        console.log(`⬆️  Uploading resume to Cloudinary...`);
        resumeUrl = await uploadToCloudinary(
          req.files.resume[0].buffer,
          CLOUDINARY_FOLDERS.RESUMES,
          `resume_${userId}_${jobId}`
        );
        console.log(`✅ Resume uploaded: ${resumeUrl.substring(0, 80)}...`);
      } catch (error) {
        console.error(`❌ Resume upload failed:`, error.message);
        throw new ApiError(400, `Resume upload failed: ${error.message}`);
      }
    }

    // Upload cover letter to Cloudinary if provided
    let coverLetterUrl = "";
    if (req.files?.coverLetter?.[0]) {
      try {
        console.log(`⬆️  Uploading cover letter to Cloudinary...`);
        coverLetterUrl = await uploadToCloudinary(
          req.files.coverLetter[0].buffer,
          CLOUDINARY_FOLDERS.COVER_LETTERS,
          `cover_${userId}_${jobId}`
        );
        console.log(`✅ Cover letter uploaded: ${coverLetterUrl.substring(0, 80)}...`);
      } catch (error) {
        console.error(`❌ Cover letter upload failed:`, error.message);
        throw new ApiError(400, `Cover letter upload failed: ${error.message}`);
      }
    }

    // Update user profile with candidate info (if provided)
    if (firstName || lastName || phone || location || qualification || experience || currentCompany || skills) {
      try {
        console.log(`👤 Updating user profile...`);
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
        console.log(`✅ User profile updated`);
      } catch (error) {
        console.error(`⚠️  User profile update failed:`, error.message);
        // Don't throw - application can still be created
      }
    }

    console.log(`💾 Creating application in MongoDB...`);
    const application = await Application.create({
      userId,
      jobId,
      candidateName: firstName && lastName ? `${firstName} ${lastName}` : req.user.name,
      candidateEmail: email || req.user.email,
      candidatePhone: phone,
      candidateLocation: location,
      candidateQualification: qualification,
      candidateExperience: experience,
      candidateCurrentCompany: currentCompany,
      candidateSkills: skills,
      resumeUrl,
      coverLetterUrl,
      additionalInfo,
      achievement,
      expectedSalary,
    });

    console.log(`✅ Application created in DB: ${application._id}`);
    console.log(`📧 Sending confirmation email...`);

    // Send confirmation email (non-blocking)
    sendApplicationReceivedEmail({
      to: email || req.user.email,
      name: firstName && lastName ? `${firstName} ${lastName}` : req.user.name,
      jobTitle: job.title,
      branchName: job.branchId?.branchName || "Head Office",
    }).catch((err) => console.error("⚠️  Email send error:", err.message));

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ APPLICATION SUBMISSION SUCCESSFUL`);
    console.log(`📌 Application ID: ${application._id}`);
    console.log(`${'='.repeat(60)}\n`);

    return res.status(201).json(new ApiResponse(201, { application }, "Application submitted successfully"));
  } catch (error) {
    console.error(`\n${'='.repeat(60)}`);
    console.error(`❌ APPLICATION SUBMISSION FAILED`);
    console.error(`Error: ${error.message}`);
    console.error(`${'='.repeat(60)}\n`);
    throw error;
  }
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
