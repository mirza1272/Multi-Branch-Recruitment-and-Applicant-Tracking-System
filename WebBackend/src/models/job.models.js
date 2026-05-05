import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: [true, "Branch is required"],
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    seats: {
      type: Number,
      default: 1,
      min: [1, "Seats must be at least 1"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for faster search/filter by branch and department
jobSchema.index({ branchId: 1, department: 1 });

export const Job = mongoose.model("Job", jobSchema);
