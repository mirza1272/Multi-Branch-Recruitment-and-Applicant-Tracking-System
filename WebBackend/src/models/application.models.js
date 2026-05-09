import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job is required"],
    },
    // Candidate info snapshot (captured at time of application)
    candidateName: String,
    candidateEmail: String,
    candidatePhone: String,
    candidateLocation: String,
    candidateQualification: String,
    candidateExperience: String,
    candidateCurrentCompany: String,
    candidateSkills: String,
    
    // Files
    resumeUrl: {
      type: String,
    },
    coverLetterUrl: {
      type: String,
    },
    
    // Application questions
    additionalInfo: String, // Why do you want to work here?
    achievement: String, // Notable achievement
    expectedSalary: String, // Expected salary
    
    status: {
      type: String,
      enum: ["pending", "shortlisted", "interview scheduled", "rejected", "accepted"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Prevent a candidate from applying to the same job twice
applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export const Application = mongoose.model("Application", applicationSchema);
