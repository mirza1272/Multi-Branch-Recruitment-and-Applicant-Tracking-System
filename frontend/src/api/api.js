import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginRequest = (payload) => api.post("/auth/login", payload);
export const registerRequest = (payload) => api.post("/auth/register", payload);
export const verifyOtpRequest = (payload) => api.post("/auth/verify-otp", payload);
export const resendOtpRequest = (payload) => api.post("/auth/resend-otp", payload);
export const logoutRequest = () => api.post("/auth/logout");
export const getMeRequest = () => api.get("/auth/me");
export const updateProfileRequest = (payload) => api.patch("/auth/me", payload);

export const getJobsRequest = (params) => api.get("/jobs", { params });
export const getJobByIdRequest = (jobId) => api.get(`/jobs/${jobId}`);
export const createJobRequest = (payload) => api.post("/jobs", payload);
export const updateJobRequest = (jobId, payload) => api.patch(`/jobs/${jobId}`, payload);

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
