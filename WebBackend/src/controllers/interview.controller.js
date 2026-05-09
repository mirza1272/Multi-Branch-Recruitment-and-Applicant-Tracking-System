import { Interview } from "../models/interview.models.js";
import { Application } from "../models/application.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendInterviewScheduledEmail, sendInterviewNotificationToHR } from "../utils/mailer.js";

import { createCalendarEvent } from "../utils/googleCalendar.js";

// ─────────────────────────────────────────────
// @route   POST /api/interviews
// @access  Admin, Recruiter
// ─────────────────────────────────────────────
export const scheduleInterview = asyncHandler(async (req, res) => {
  const { applicationId, date, time, message, type, meetingLink } = req.body;

  if (!applicationId || !date) {
    throw new ApiError(400, "Application ID and date are required");
  }

  const application = await Application.findById(applicationId)
    .populate("userId", "name email")
    .populate({ path: "jobId", select: "title" });

  let finalMeetingLink = meetingLink;

  // STEP 1: Use Master Admin Token from .env to generate Unique Meet Link
  if (process.env.GOOGLE_REFRESH_TOKEN && process.env.GOOGLE_REFRESH_TOKEN !== "1") {
    try {
      const tokens = { refresh_token: process.env.GOOGLE_REFRESH_TOKEN };
      console.log("📅 Generating Unique Meet Link using Admin Account...");

      const event = await createCalendarEvent(tokens, {
        title: application.jobId.title,
        candidateEmail: application.userId.email,
        date,
        time,
        type,
      });

      if (event.hangoutLink) {
        finalMeetingLink = event.hangoutLink;
        console.log("✅ Unique Link Generated:", finalMeetingLink);
      }
    } catch (err) {
      console.error("❌ Google API Error:", err.message);
      // Fallback if token fails
    }
  }

  // Upsert interview record
  const interview = await Interview.findOneAndUpdate(
    { applicationId },
    { date, time, message, type, meetingLink: finalMeetingLink },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  // Update application status
  application.status = "interview scheduled";
  await application.save();

  console.log(`📧 Sending email with link: ${finalMeetingLink}`);

  // Send email notification
  // Send email notification to Candidate
  sendInterviewScheduledEmail({
    to: application.userId.email,
    name: application.userId.name,
    jobTitle: application.jobId.title,
    date,
    time,
    message,
    type,
    meetingLink: finalMeetingLink,
  }).catch((e) => console.error("❌ Email sending failed:", e.message));

  // Send copy to HR/Recruiter (Logged in user)
  sendInterviewNotificationToHR({
    to: req.user.email,
    hrName: req.user.name,
    candidateName: application.userId.name,
    jobTitle: application.jobId.title,
    date,
    time,
    type,
    meetingLink: finalMeetingLink,
  }).catch((e) => console.error("❌ HR Notification failed:", e.message));

  return res.status(201).json(new ApiResponse(201, { interview }, "Interview scheduled successfully"));
});

// ─────────────────────────────────────────────
// @route   GET /api/interviews
// @access  Admin, Recruiter
// ─────────────────────────────────────────────
export const getAllInterviews = asyncHandler(async (req, res) => {
  const interviews = await Interview.find()
    .populate({
      path: "applicationId",
      populate: [
        { path: "userId", select: "name email" },
        { path: "jobId", select: "title department", populate: { path: "branchId", select: "branchName" } },
      ],
    })
    .sort({ date: 1 });

  return res.status(200).json(new ApiResponse(200, { interviews }, "Interviews fetched"));
});

// ─────────────────────────────────────────────
// @route   GET /api/interviews/:id
// @access  Admin, Recruiter, or the candidate whose application it is
// ─────────────────────────────────────────────
export const getInterviewById = asyncHandler(async (req, res) => {
  const interview = await Interview.findById(req.params.id).populate({
    path: "applicationId",
    populate: [
      { path: "userId", select: "name email" },
      { path: "jobId", select: "title department" },
    ],
  });

  if (!interview) throw new ApiError(404, "Interview not found");

  // Restrict candidate access to their own interview
  if (req.user.role === "candidate") {
    const appUserId = interview.applicationId?.userId?._id?.toString();
    if (appUserId !== req.user._id.toString()) {
      throw new ApiError(403, "Access denied");
    }
  }

  return res.status(200).json(new ApiResponse(200, { interview }, "Interview fetched"));
});

// ─────────────────────────────────────────────
// @route   GET /api/interviews/application/:applicationId
// @access  Admin, Recruiter, or owner Candidate
// ─────────────────────────────────────────────
export const getInterviewByApplication = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({
    applicationId: req.params.applicationId,
  }).populate({
    path: "applicationId",
    populate: [{ path: "userId", select: "name email" }],
  });

  if (!interview) throw new ApiError(404, "No interview scheduled for this application");

  // Restrict candidate
  if (req.user.role === "candidate") {
    const appUserId = interview.applicationId?.userId?._id?.toString();
    if (appUserId !== req.user._id.toString()) {
      throw new ApiError(403, "Access denied");
    }
  }

  return res.status(200).json(new ApiResponse(200, { interview }, "Interview fetched"));
});

// ─────────────────────────────────────────────
// @route   PATCH /api/interviews/:id
// @access  Admin, Recruiter
// ─────────────────────────────────────────────
export const updateInterview = asyncHandler(async (req, res) => {
  const { date, time, message } = req.body;

  const interview = await Interview.findByIdAndUpdate(
    req.params.id,
    { date, time, message },
    { new: true, runValidators: true, omitUndefined: true }
  ).populate({
    path: "applicationId",
    populate: [{ path: "userId", select: "name email" }, { path: "jobId", select: "title" }],
  });

  if (!interview) throw new ApiError(404, "Interview not found");

  // Notify candidate of rescheduled interview
  sendInterviewScheduledEmail({
    to: interview.applicationId.userId.email,
    name: interview.applicationId.userId.name,
    jobTitle: interview.applicationId.jobId.title,
    date: interview.date,
    time: interview.time,
    message: interview.message,
  }).catch((e) => console.error("Email error:", e.message));

  return res.status(200).json(new ApiResponse(200, { interview }, "Interview updated"));
});

// ─────────────────────────────────────────────
// @route   DELETE /api/interviews/:id
// @access  Admin, Recruiter
// ─────────────────────────────────────────────
export const deleteInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findByIdAndDelete(req.params.id);
  if (!interview) throw new ApiError(404, "Interview not found");
  return res.status(200).json(new ApiResponse(200, null, "Interview cancelled"));
});
