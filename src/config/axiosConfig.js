import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

// Create axios instance
const axiosInstance = axios.create({
  // baseURL: 'http://localhost:8080', // Adjust based on your backend URL
  baseURL : baseUrl, // Adjust based on your backend URL
  withCredentials: true, // Important for sending cookies
});

// Store for auth functions (will be set by AuthProvider)
let authFunctions = {
  getAccessToken: () => null,
  refreshToken: () => Promise.resolve(null),
  logout: () => {}
};

// Function to set auth functions from AuthProvider
export const setAuthFunctions = (functions) => {
  authFunctions = functions;
};

// Request interceptor to add access token and handle content types
axiosInstance.interceptors.request.use(
  (config) => {
    const token = authFunctions.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Handle FormData requests
    if (config.data instanceof FormData) {
      // Remove Content-Type header to let the browser set it with the correct boundary
      delete config.headers["Content-Type"];
    } else {
      // For regular JSON requests
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Check if the error indicates an expired token
      const errorData = error.response?.data;
      if (errorData?.code === 'TOKEN_EXPIRED' || errorData?.error?.includes('expired')) {
        try {
          // Attempt to refresh the token
          const newAccessToken = await authFunctions.refreshToken();
          
          if (newAccessToken) {
            // Update the original request with new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            
            // Retry the original request
            return axiosInstance(originalRequest);
          } else {
            // Refresh failed, redirect to login
            authFunctions.logout();
            return Promise.reject(error);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          authFunctions.logout();
          return Promise.reject(error);
        }
      } else {
        // Other 401 errors (invalid credentials, etc.)
        authFunctions.logout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;