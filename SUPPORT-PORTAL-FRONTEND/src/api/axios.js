import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

/* Attach JWT token */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* Handle expired / missing auth */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";

    const isPublicRoute =
      url.includes("/kb/public") ||
      url.includes("/kb/documents") ||
      url.includes("/kb/ask") ||
      url.includes("/auth/login") ||
      url.includes("/auth/register");

    if (error.response?.status === 401 && !isPublicRoute) {
      localStorage.removeItem("token");
      alert("Session expired. Please login again.");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;