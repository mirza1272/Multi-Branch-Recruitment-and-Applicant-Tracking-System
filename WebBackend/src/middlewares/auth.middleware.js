import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * verifyJWT — Checks token from cookie or Authorization header.
 * Attaches the user document to req.user.
 */
export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.token ||
    req.headers?.authorization?.replace("Bearer ", "");

  console.log(`\n🔐 JWT Verification - ${req.method} ${req.originalUrl}`);
  console.log(`   Cookie token present: ${!!req.cookies?.token}`);
  console.log(`   Bearer token present: ${!!(req.headers?.authorization)}`);

  if (!token) {
    console.error(`   ❌ No token provided`);
    throw new ApiError(401, "Unauthorized: No token provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`   ✅ Token verified - User ID: ${decoded.userId}`);
  } catch (error) {
    console.error(`   ❌ Token verification failed: ${error.message}`);
    throw new ApiError(401, "Unauthorized: Invalid or expired token");
  }

  const user = await User.findById(decoded.userId).select("-password");
  if (!user) {
    console.error(`   ❌ User not found`);
    throw new ApiError(401, "Unauthorized: User no longer exists");
  }

  console.log(`   ✅ User authenticated: ${user.name} (${user.role})\n`);
  req.user = user;
  next();
});

/**
 * authorizeRoles(...roles) — Restricts route to specified roles.
 * Must be used AFTER verifyJWT.
 * @example  router.delete("/job/:id", verifyJWT, authorizeRoles("admin", "recruiter"), deleteJob);
 */
export const authorizeRoles = (...roles) =>
  asyncHandler(async (req, res, next) => {
    console.log(`\n👤 Role Authorization Check`);
    console.log(`   User Role: ${req.user.role}`);
    console.log(`   Required Roles: ${roles.join(", ")}`);
    
    if (!roles.includes(req.user.role)) {
      console.error(`   ❌ Access denied - role '${req.user.role}' not in allowed roles`);
      throw new ApiError(
        403,
        `Forbidden: Role '${req.user.role}' is not allowed to access this resource. Required: ${roles.join(", ")}`
      );
    }
    console.log(`   ✅ Role authorized\n`);
    next();
  });
