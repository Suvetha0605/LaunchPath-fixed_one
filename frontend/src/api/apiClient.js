import axios from "axios";

/**
 * Centralized API base URL configuration.
 * Reads the Vite environment variable VITE_API_URL and provides a local fallback.
 */
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "https://launchpath-backend.onrender.com"
).replace(/\/+$/, "");

/**
 * Centralized Axios client instance for LaunchPath frontend.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically attach Bearer token from localStorage if available and not explicitly provided
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { api, api as apiClient };
export default api;
