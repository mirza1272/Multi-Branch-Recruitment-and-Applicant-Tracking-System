import { Job } from "../models/job.models.js";
import { Branch } from "../models/branch.models.js";
import { Application } from "../models/application.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// ─────────────────────────────────────────────────────────────────────
// @route   POST /api/jobs
// @desc    Create a new job posting
// @access  Admin, Recruiter
// ─────────────────────────────────────────────────────────────────────
export const createJob = asyncHandler(async (req, res) => {
  const {
    branchId,
    title,
    company,
    description,
    requirements,
    department,
    category,
    type,
    salary,
    salaryNumeric,
    experience,
    degree,
    seats,
  } = req.body;

  // ─────────────────────────────────────────────
  // Validation
  // ─────────────────────────────────────────────
  const requiredFields = ["branchId", "title", "description", "department", "category", "type", "experience", "degree"];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    throw new ApiError(400, `Missing required fields: ${missingFields.join(", ")}`);
  }

  // Validate branch exists
  const branch = await Branch.findById(branchId);
  if (!branch) {
    throw new ApiError(404, "Branch not found");
  }

  // Validate enum fields
  const validCategories = ["Engineering", "Sales", "Marketing", "HR", "Finance", "Operations", "Other"];
  const validTypes = ["Full Time", "Part Time", "Internship", "Contract"];

  if (!validCategories.includes(category)) {
    throw new ApiError(400, `Invalid category. Must be one of: ${validCategories.join(", ")}`);
  }

  if (!validTypes.includes(type)) {
    throw new ApiError(400, `Invalid type. Must be one of: ${validTypes.join(", ")}`);
  }

  // ─────────────────────────────────────────────
  // Create Job
  // ─────────────────────────────────────────────
  
  // If company is not provided, use the recruiter's company from their profile
  let finalCompany = company ? company.trim() : null;
  if (!finalCompany && req.user.company) {
    finalCompany = req.user.company;
  }

  const jobData = {
    branchId,
    title: title.trim(),
    company: finalCompany,
    description: description.trim(),
    requirements: requirements ? requirements.trim() : null,
    department: department.trim(),
    category,
    type,
    salary: salary ? salary.trim() : null,
    salaryNumeric: salaryNumeric ? Number(salaryNumeric) : null,
    experience: experience.trim(),
    degree: degree.trim(),
    seats: seats ? Number(seats) : 1,
    createdBy: req.user._id,
  };

  const job = await Job.create(jobData);
  
  // Populate relationships
  await job.populate("branchId", "branchName");
  await job.populate("createdBy", "firstName lastName email");

  return res.status(201).json(
    new ApiResponse(201, { job }, "Job created successfully")
  );
});

// ─────────────────────────────────────────────────────────────────────
// @route   GET /api/jobs
// @desc    Get all open jobs with search, filter, and pagination
// @access  Public
// ─────────────────────────────────────────────────────────────────────
export const getAllJobs = asyncHandler(async (req, res) => {
  const {
    search,
    branchId,
    department,
    category,
    type,
    page = 1,
    limit = 10,
    sortBy = "postedAt",
    sortOrder = -1,
  } = req.query;

  // ─────────────────────────────────────────────
  // Build Filter
  // ─────────────────────────────────────────────
  const filter = {
    status: "open",
    isActive: true,
  };

  if (branchId) {
    filter.branchId = branchId;
  }

  if (department) {
    filter.department = new RegExp(department.trim(), "i");
  }

  if (category) {
    filter.category = category;
  }

  if (type) {
    filter.type = type;
  }

  if (search) {
    filter.$text = { $search: search.trim() };
  }

  // ─────────────────────────────────────────────
  // Pagination
  // ─────────────────────────────────────────────
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Math.min(100, Number(limit))); // Cap at 100
  const skip = (pageNum - 1) * limitNum;

  // ─────────────────────────────────────────────
  // Sorting
  // ─────────────────────────────────────────────
  const sortOptions = {
    postedAt: { postedAt: -1 },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    salary: { salaryNumeric: Number(sortOrder) },
  };

  const sortCriteria = sortOptions[sortBy] || sortOptions.postedAt;

  // ─────────────────────────────────────────────
  // Execute Query
  // ─────────────────────────────────────────────
  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .populate("branchId", "branchName")
      .populate("createdBy", "firstName lastName")
      .sort(sortCriteria)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Job.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        jobs,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: totalPages,
          hasMore: pageNum < totalPages,
        },
      },
      "Jobs fetched successfully"
    )
  );
});

// ─────────────────────────────────────────────────────────────────────
// @route   GET /api/jobs/admin/all
// @desc    Get all jobs including inactive (Admin view)
// @access  Admin, Recruiter
// ─────────────────────────────────────────────────────────────────────
export const getAllJobsAdmin = asyncHandler(async (req, res) => {
  const { branchId, status, page = 1, limit = 20 } = req.query;

  const filter = {};

  // Recruiters should only see their own jobs
  if (req.user.role === "recruiter") {
    filter.createdBy = req.user._id;
  }

  if (branchId) {
    filter.branchId = branchId;
  }

  if (status && ["open", "closed", "paused"].includes(status)) {
    filter.status = status;
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Math.min(100, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .populate("branchId", "branchName")
      .populate("createdBy", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Job.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        jobs,
        pagination: {
          total,
          page: pageNum,
          pages: totalPages,
        },
      },
      "Admin jobs fetched successfully"
    )
  );
});

// ─────────────────────────────────────────────────────────────────────
// @route   GET /api/jobs/:jobId
// @desc    Get single job by ID
// @access  Public
// ─────────────────────────────────────────────────────────────────────
export const getJobById = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId)
    .populate("branchId", "branchName")
    .populate("createdBy", "firstName lastName email");

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  // Check application count for this job
  const applicationCount = await Application.countDocuments({
    jobId: job._id,
    status: { $in: ["pending", "shortlisted", "rejected"] },
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...job.toObject(),
        applicationsCount: applicationCount,
      },
      "Job fetched successfully"
    )
  );
});

// ─────────────────────────────────────────────────────────────────────
// @route   GET /api/jobs/search/:query
// @desc    Search jobs by title, description, or department
// @access  Public
// ─────────────────────────────────────────────────────────────────────
export const searchJobs = asyncHandler(async (req, res) => {
  const { query, page = 1, limit = 10 } = req.query;

  if (!query || query.trim().length < 2) {
    throw new ApiError(400, "Search query must be at least 2 characters");
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Math.min(100, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [jobs, total] = await Promise.all([
    Job.find(
      { $text: { $search: query.trim() }, status: "open", isActive: true },
      { score: { $meta: "textScore" } }
    )
      .populate("branchId", "branchName")
      .sort({ score: { $meta: "textScore" } })
      .skip(skip)
      .limit(limitNum),
    Job.countDocuments({
      $text: { $search: query.trim() },
      status: "open",
      isActive: true,
    }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        jobs,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum),
        },
      },
      "Search results fetched"
    )
  );
});

// ─────────────────────────────────────────────────────────────────────
// @route   PATCH /api/jobs/:jobId
// @desc    Update job (safe update - no undefined overwrite)
// @access  Admin, Recruiter (only creator or admin can update)
// ─────────────────────────────────────────────────────────────────────
export const updateJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const updates = req.body;

  // Find job first
  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  // Authorization check
  const isCreator = job.createdBy.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isCreator && !isAdmin) {
    throw new ApiError(403, "You do not have permission to update this job");
  }

  // ─────────────────────────────────────────────
  // Validate branch if being updated
  // ─────────────────────────────────────────────
  if (updates.branchId) {
    const branch = await Branch.findById(updates.branchId);
    if (!branch) {
      throw new ApiError(404, "Branch not found");
    }
  }

  // ─────────────────────────────────────────────
  // Validate enums if being updated
  // ─────────────────────────────────────────────
  if (updates.category) {
    const validCategories = ["Engineering", "Sales", "Marketing", "HR", "Finance", "Operations", "Other"];
    if (!validCategories.includes(updates.category)) {
      throw new ApiError(400, `Invalid category`);
    }
  }

  if (updates.type) {
    const validTypes = ["Full Time", "Part Time", "Internship", "Contract"];
    if (!validTypes.includes(updates.type)) {
      throw new ApiError(400, `Invalid type`);
    }
  }

  if (updates.status) {
    if (!["open", "closed", "paused"].includes(updates.status)) {
      throw new ApiError(400, `Invalid status`);
    }
  }

  // ─────────────────────────────────────────────
  // Sanitize & Apply Updates
  // ─────────────────────────────────────────────
  const allowedFields = [
    "title",
    "company",
    "description",
    "requirements",
    "department",
    "category",
    "type",
    "salary",
    "salaryNumeric",
    "experience",
    "degree",
    "seats",
    "status",
    "isActive",
  ];

  const sanitizedUpdates = {};
  allowedFields.forEach((field) => {
    if (updates.hasOwnProperty(field) && updates[field] !== undefined && updates[field] !== null) {
      sanitizedUpdates[field] = typeof updates[field] === "string" ? updates[field].trim() : updates[field];
    }
  });

  if (Object.keys(sanitizedUpdates).length === 0) {
    throw new ApiError(400, "No valid fields to update");
  }

  // ─────────────────────────────────────────────
  // Update & Return
  // ─────────────────────────────────────────────
  const updatedJob = await Job.findByIdAndUpdate(jobId, sanitizedUpdates, {
    new: true,
    runValidators: true,
  })
    .populate("branchId", "branchName")
    .populate("createdBy", "firstName lastName email");

  return res.status(200).json(
    new ApiResponse(200, { job: updatedJob }, "Job updated successfully")
  );
});

// ─────────────────────────────────────────────────────────────────────
// @route   PATCH /api/jobs/:jobId/close
// @desc    Close a job posting
// @access  Admin, Recruiter (creator or admin)
// ─────────────────────────────────────────────────────────────────────
export const closeJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  // Authorization
  const isCreator = job.createdBy.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isCreator && !isAdmin) {
    throw new ApiError(403, "You do not have permission to close this job");
  }

  if (job.status === "closed") {
    throw new ApiError(400, "Job is already closed");
  }

  job.status = "closed";
  await job.save();

  await job.populate("branchId", "branchName");

  return res.status(200).json(
    new ApiResponse(200, { job }, "Job closed successfully")
  );
});

// ─────────────────────────────────────────────────────────────────────
// @route   DELETE /api/jobs/:jobId
// @desc    Delete a job (only if no applications exist)
// @access  Admin
// ─────────────────────────────────────────────────────────────────────
export const deleteJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  // Check for existing applications
  const applicationCount = await Application.countDocuments({ jobId });

  if (applicationCount > 0) {
    throw new ApiError(
      409,
      `Cannot delete job. ${applicationCount} application(s) exist. Close the job instead.`
    );
  }

  await Job.findByIdAndDelete(jobId);

  return res.status(200).json(
    new ApiResponse(200, null, "Job deleted successfully")
  );
});

// ─────────────────────────────────────────────────────────────────────
// @route   GET /api/jobs/stats/dashboard
// @desc    Get job statistics for dashboard
// @access  Admin, Recruiter
// ─────────────────────────────────────────────────────────────────────
export const getJobStats = asyncHandler(async (req, res) => {
  const { branchId } = req.query;

  const filter = branchId ? { branchId } : {};

  // Recruiters should only see their own job stats
  if (req.user.role === "recruiter") {
    filter.createdBy = req.user._id;
  }

  const [total, openJobs, closedJobs, pausedJobs] = await Promise.all([
    Job.countDocuments(filter),
    Job.countDocuments({ ...filter, status: "open" }),
    Job.countDocuments({ ...filter, status: "closed" }),
    Job.countDocuments({ ...filter, status: "paused" }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        total,
        open: openJobs,
        closed: closedJobs,
        paused: pausedJobs,
      },
      "Job statistics fetched"
    )
  );
});
