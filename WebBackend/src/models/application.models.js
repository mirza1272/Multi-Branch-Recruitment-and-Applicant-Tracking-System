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
    resumeUrl: {
      type: String,
    },
    coverLetterUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "shortlisted", "rejected", "accepted"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Prevent a candidate from applying to the same job twice
applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export const Application = mongoose.model("Application", applicationSchema);
