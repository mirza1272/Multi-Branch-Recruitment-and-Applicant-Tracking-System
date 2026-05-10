import mongoose from "mongoose";

// Counter schema for auto-incrementing jobId
const counterSchema = new mongoose.Schema({
  _id: String,
  sequence: {
    type: Number,
    default: 1000,
  },
});

const Counter = mongoose.model("Counter", counterSchema);

const jobSchema = new mongoose.Schema(
  {
    // ─────────────────────────────────────────────
    // Unique Identifiers & References
    // ─────────────────────────────────────────────
    jobId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: [true, "Branch is required"],
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ─────────────────────────────────────────────
    // Job Core Information
    // ─────────────────────────────────────────────
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      index: true,
    },
    company: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
    },
    requirements: {
      type: String,
      trim: true,
    },

    // ─────────────────────────────────────────────
    // Job Classification
    // ─────────────────────────────────────────────
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
      index: true,
    },
    category: {
      type: String,
      enum: [
        "Engineering",
        "Sales",
        "Marketing",
        "HR",
        "Finance",
        "Operations",
        "Design",
        "Customer Support",
        "Product",
        "Quality Assurance",
        "Healthcare",
        "Other"
      ],
      required: [true, "Category is required"],
      index: true,
    },
    type: {
      type: String,
      enum: ["Full Time", "Part Time", "Internship", "Contract"],
      required: [true, "Job type is required"],
      index: true,
    },

    // ─────────────────────────────────────────────
    // Compensation & Requirements
    // ─────────────────────────────────────────────
    salary: {
      type: String,
      trim: true,
    },
    salaryNumeric: {
      type: Number,
      min: 0,
    },
    experience: {
      type: String,
      required: [true, "Experience required is required"],
    },
    degree: {
      type: String,
      required: [true, "Degree required is required"],
    },

    // ─────────────────────────────────────────────
    // Hiring Info
    // ─────────────────────────────────────────────
    seats: {
      type: Number,
      required: [true, "Number of seats is required"],
      min: [1, "Seats must be at least 1"],
      default: 1,
    },
    status: {
      type: String,
      enum: ["open", "closed", "paused"],
      default: "open",
      index: true,
    },
    postedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    // ─────────────────────────────────────────────
    // Metadata
    // ─────────────────────────────────────────────
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

// ─────────────────────────────────────────────
// Indexes for Search & Filtering
// ─────────────────────────────────────────────
jobSchema.index({ title: "text", description: "text", department: "text" });
jobSchema.index({ branchId: 1, status: 1 });
jobSchema.index({ category: 1, type: 1 });
jobSchema.index({ salaryNumeric: 1 });
jobSchema.index({ createdAt: -1 });

// ─────────────────────────────────────────────
// Pre-save Hook: Auto-generate jobId
// ─────────────────────────────────────────────
jobSchema.pre("save", async function () {
  if (!this.jobId) {
    const counter = await Counter.findByIdAndUpdate(
      "jobId",
      { $inc: { sequence: 1 } },
      { new: true, upsert: true }
    );
    this.jobId = `JOB-${counter.sequence}`;
  }
});

// ─────────────────────────────────────────────
// Instance Methods
// ─────────────────────────────────────────────
jobSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return {
    _id: obj._id,
    jobId: obj.jobId,
    title: obj.title,
    company: obj.company,
    description: obj.description,
    requirements: obj.requirements,
    department: obj.department,
    category: obj.category,
    type: obj.type,
    salary: obj.salary,
    salaryNumeric: obj.salaryNumeric,
    experience: obj.experience,
    degree: obj.degree,
    seats: obj.seats,
    status: obj.status,
    postedAt: obj.postedAt,
    branchId: obj.branchId,
    createdBy: obj.createdBy,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

export const Job = mongoose.model("Job", jobSchema);
export const JobCounter = Counter;
