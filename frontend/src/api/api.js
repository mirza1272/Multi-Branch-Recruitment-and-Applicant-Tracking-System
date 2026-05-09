import axios from "axios";

// Get the base API URL from environment variables
const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const api = axios.create({
  // Use absolute URL if provided, otherwise use relative path for local dev proxy
  // Trailing slash is important when baseURL has a subpath like /api/
  baseURL: API_BASE_URL ? `${API_BASE_URL}/api/` : "/api/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`🔐 Token added: ${config.method.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if it's a 401 AND we're not already trying to login
    const isLoginRequest = error.config?.url?.includes("auth/login");
    
    if (error.response?.status === 401 && !isLoginRequest) {
      console.error("🔓 Auth failed - clearing session");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth Routes
export const loginRequest = (payload) => api.post("auth/login", payload);
export const registerRequest = (payload) => api.post("auth/register", payload);
export const verifyOtpRequest = (payload) => api.post("auth/verify-otp", payload);
export const resendOtpRequest = (payload) => api.post("auth/resend-otp", payload);
export const logoutRequest = () => api.post("auth/logout");
export const getMeRequest = () => api.get("auth/me");
export const updateProfileRequest = (payload) => api.patch("auth/me", payload);
export const forgotPasswordRequest = (payload) => api.post("auth/forgot-password", payload);
export const resetPasswordRequest = (payload) => api.post("auth/reset-password", payload);

// Job Routes
export const getJobsRequest = (params) => api.get("jobs", { params });
export const getAllJobsAdminRequest = (params) => api.get("jobs/admin/all", { params });
export const getJobStatsAdminRequest = (params) => api.get("jobs/admin/stats/dashboard", { params });
export const getJobByIdRequest = (jobId) => api.get(`jobs/${jobId}`);
export const createJobRequest = (payload) => api.post("jobs", payload);
export const updateJobRequest = (jobId, payload) => api.patch(`jobs/${jobId}`, payload);
export const deleteJobRequest = (jobId) => api.delete(`jobs/${jobId}`);

// Branch Routes
export const getBranchesRequest = () => api.get("branches");
export const createBranchRequest = (payload) => api.post("branches", payload);

// Application Routes
export const applyForJobRequest = (formData) =>
  api.post("applications", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const getMyApplicationsRequest = () => api.get("applications/my");
export const getAllApplicationsRequest = (params) => api.get("applications", { params });
export const updateApplicationStatusRequest = (id, payload) =>
  api.patch(`applications/${id}/status`, payload);
export const getApplicationByIdRequest = (id) => api.get(`applications/${id}`);

// Interview & Google Routes
export const scheduleInterviewRequest = (payload) => api.post("interviews", payload);
export const getGoogleAuthUrlRequest = () => api.get("auth/google");
export const checkGoogleConnectionRequest = () => api.get("auth/google/check");

export default api;
