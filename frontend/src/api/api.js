import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
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
      console.log(`🔐 Token added to request: ${config.method.toUpperCase()} ${config.url}`);
    } else {
      console.log(`⚠️  No token in localStorage for: ${config.method.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("🔓 Authentication failed - clearing token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Optionally redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const loginRequest = (payload) => api.post("/auth/login", payload);
export const registerRequest = (payload) => api.post("/auth/register", payload);
export const verifyOtpRequest = (payload) => api.post("/auth/verify-otp", payload);
export const resendOtpRequest = (payload) => api.post("/auth/resend-otp", payload);
export const logoutRequest = () => api.post("/auth/logout");
export const getMeRequest = () => api.get("/auth/me");
export const updateProfileRequest = (payload) => api.patch("/auth/me", payload);

export const getJobsRequest = (params) => api.get("/jobs", { params });
export const getAllJobsAdminRequest = (params) => api.get("/jobs/admin/all", { params });
export const getJobStatsAdminRequest = (params) => api.get("/jobs/admin/stats/dashboard", { params });
export const getJobByIdRequest = (jobId) => api.get(`/jobs/${jobId}`);
export const createJobRequest = (payload) => api.post("/jobs", payload);
export const updateJobRequest = (jobId, payload) => api.patch(`/jobs/${jobId}`, payload);
export const deleteJobRequest = (jobId) => api.delete(`/jobs/${jobId}`);

export const getBranchesRequest = () => api.get("/branches");
export const createBranchRequest = (payload) => api.post("/branches", payload);

export const applyForJobRequest = (formData) =>
  api.post("/applications", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const getMyApplicationsRequest = () => api.get("/applications/my");
export const getAllApplicationsRequest = (params) => api.get("/applications", { params });
export const updateApplicationStatusRequest = (id, payload) =>
  api.patch(`/applications/${id}/status`, payload);
export const getApplicationByIdRequest = (id) => api.get(`/applications/${id}`);

export default api;
