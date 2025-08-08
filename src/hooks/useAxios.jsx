import axios from "axios";

const baseUrl = "http://localhost:8080"; // your backend
// const baseUrl =
//   import.meta.env.VITE_BASE_URL // your backend

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: attach access token
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refreshToken")
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const { data } = await axios.post(`${baseUrl}/auth/refresh-token`, {
          refreshToken,
        });
        console.log("Refresh token called");
        const newAccessToken = data.accessToken;
        localStorage.setItem("token", newAccessToken);

        // Update Authorization header and retry
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh failed. Logging out.");
        localStorage.clear();
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
