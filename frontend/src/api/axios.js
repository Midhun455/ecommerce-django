// api/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// Attach token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const setupInterceptors = (logout) => {
  API.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          const refresh = localStorage.getItem("refresh");
          if (!refresh) throw new Error("No refresh token");

          const res = await axios.post(
            "http://127.0.0.1:8000/api/token/refresh/",
            { refresh }
          );

          localStorage.setItem("token", res.data.access);
          API.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${res.data.access}`;

          // Retry original request with new token
          return API(originalRequest);
        } catch (err) {
          // Clear tokens & redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("refresh");
          logout("/login"); // ensure this navigates to login page
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default API;
