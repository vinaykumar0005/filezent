import axios from "axios";

/*
  Production Axios Instance
  - Env based URL
  - JWT support
  - Timeout
  - Central error handling
  - Upload safe
*/

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",

  timeout: 60000, // 60s (large uploads)

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/* ===========================
   REQUEST INTERCEPTOR
   Attach JWT Automatically
=========================== */
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

/* ===========================
   RESPONSE INTERCEPTOR
   Central Error Handler
=========================== */
api.interceptors.response.use(
  (response) => response,

  (error) => {
    // Network error
    if (!error.response) {
      console.error("❌ Network Error:", error.message);

      return Promise.reject({
        message: "Server unreachable. Try again later.",
      });
    }

    const status = error.response.status;
    const message =
      error.response.data?.message ||
      "Something went wrong";

    /* Auth expired */
    if (status === 401) {
      localStorage.removeItem("token");

      // Optional: redirect to login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    console.error("❌ API Error:", {
      status,
      message,
      url: error.config?.url,
    });

    return Promise.reject({
      status,
      message,
      original: error,
    });
  }
);

export default api;
