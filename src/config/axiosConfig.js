import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

// Create axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // Adjust based on your backend URL
  // baseURL : baseUrl, // Adjust based on your backend URL
  withCredentials: true, // Important for sending cookies
});

// Store for auth functions (will be set by AuthProvider)
let authFunctions = {
  getAccessToken: () => null,
  refreshToken: () => Promise.resolve(null),
  logout: () => {}
};

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue = [];

// Function to set auth functions from AuthProvider
export const setAuthFunctions = (functions) => {
  authFunctions = functions;
};

// Request interceptor to add access token and handle content types
axiosInstance.interceptors.request.use(
  (config) => {
    // Skip adding Authorization header for refresh-token endpoint
    // Refresh token endpoint should use cookies/refresh token, not access token
    const isRefreshTokenRequest = config.url?.includes('/auth/refresh-token');
    
    // If token is already set (e.g., during retry after refresh), don't overwrite it
    if (!isRefreshTokenRequest && !config._tokenSet) {
      const token = authFunctions.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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

    // Skip token refresh for auth endpoints (login, refresh-token, logout)
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/login') || 
                          originalRequest?.url?.includes('/auth/refresh-token') ||
                          originalRequest?.url?.includes('/auth/logout');

    // If this is a refresh token request that failed, don't retry - just reject
    if (originalRequest?.url?.includes('/auth/refresh-token')) {
      console.error('Refresh token request failed:', error.response?.status, error.response?.data);
      // Don't logout here - let the refreshToken function handle it
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            originalRequest._tokenSet = true; // Prevent interceptor from overwriting
            return axiosInstance(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('Access token expired, attempting to refresh...');
        const newAccessToken = await authFunctions.refreshToken();
        
        if (newAccessToken) {
          console.log('Token refreshed successfully, retrying original request');
          
          // Update auth functions to use the new token immediately
          // This ensures getAccessToken() returns the latest token
          const currentFunctions = authFunctions;
          authFunctions = {
            ...currentFunctions,
            getAccessToken: () => newAccessToken
          };
          
          // Process queued requests
          failedQueue.forEach(({ resolve }) => resolve(newAccessToken));
          failedQueue = [];
          isRefreshing = false;
          
          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          
          // Mark this request as already having the token to prevent interceptor from overwriting it
          originalRequest._tokenSet = true;
          
          // Retry the original request with the new token
          return axiosInstance(originalRequest);
        } else {
          console.error('Token refresh returned null - refresh token may be expired');
          // Reject all queued requests
          failedQueue.forEach(({ reject }) => reject(error));
          failedQueue = [];
          isRefreshing = false;
          // refreshToken function already dispatched TOKEN_REFRESH_FAILED
          // which sets isAuthenticated to false, triggering RequireAuth redirect
          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Reject all queued requests
        failedQueue.forEach(({ reject }) => reject(refreshError));
        failedQueue = [];
        isRefreshing = false;
        // refreshToken function will handle logout on error
        return Promise.reject(refreshError);
      }
    }

    // For 401 errors on auth endpoints or if retry already attempted, don't try to refresh
    if (error.response?.status === 401 && (isAuthEndpoint || originalRequest._retry)) {
      // Don't logout for login failures
      if (!originalRequest?.url?.includes('/auth/login')) {
        // Only logout if this is not a refresh token request (refresh token handles its own logout)
        if (!originalRequest?.url?.includes('/auth/refresh-token')) {
          authFunctions.logout();
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
