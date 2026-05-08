// User roles
export const ROLES = {
  ADMIN: "admin",
  RECRUITER: "recruiter",
  CANDIDATE: "candidate",
};

// Application statuses
export const APPLICATION_STATUS = {
  PENDING: "pending",
  SHORTLISTED: "shortlisted",
  REJECTED: "rejected",
  ACCEPTED: "accepted",
};

// Cloudinary folders
export const CLOUDINARY_FOLDERS = {
  RESUMES: "ats/resumes",
  COVER_LETTERS: "ats/cover_letters",
};

// Allowed file types for uploads
export const ALLOWED_FILE_TYPES = ["application/pdf", "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// Max file size: 5MB
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Cookie options
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

// Email subjects
export const EMAIL_SUBJECTS = {
  APPLICATION_RECEIVED: "Application Received – We Got Your Submission",
  SHORTLISTED: "Congratulations! You've Been Shortlisted",
  REJECTED: "Update on Your Application",
  ACCEPTED: "Offer Extended – Congratulations!",
  INTERVIEW_SCHEDULED: "Interview Scheduled – Action Required",
  OTP_VERIFICATION: "Verify Your Email Address",
};
