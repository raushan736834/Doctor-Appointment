import { useAuth } from '../component/GlobalComponent/AuthProvider';
import { setAuthFunctions } from '../config/axiosConfig';
import { useEffect, useCallback, useMemo } from 'react';

/**
 * Enhanced auth hook that integrates with axios interceptors
 * This hook should be used at the app level to ensure axios is properly configured
 */
export const useAuthWithAxios = () => {
  const auth = useAuth();

  useEffect(() => {
    // Set auth functions for axios interceptors
    setAuthFunctions({
      getAccessToken: () => auth.accessToken,
      refreshToken: auth.refreshToken,
      logout: auth.logout
    });
  }, [auth.accessToken, auth.refreshToken, auth.logout]);

  return auth;
};

/**
 * Custom API Error class with status and response data
 */
class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * API service hook that provides common API methods
 * Throws errors for any backend error responses (4xx, 5xx)
 */
export const useApiService = () => {
  const apiCall = useCallback(async (method, url, data = null, options = {}) => {
    const axiosInstance = (await import('../config/axiosConfig')).default;
    try {
      const config = {
        method,
        url,
        ...options
      };

      if (data) {
        if (method.toLowerCase() === 'get') {
          config.params = data;
        } else {
          config.data = data;
        }
      }

      const response = await axiosInstance(config);
      
      // Explicitly check for error status codes (4xx, 5xx)
      // Even if axios doesn't throw, treat these as errors and throw
      const status = response?.status;
      if (status >= 400) {
        const errorMessage = response?.data?.error || 
                            response?.data?.message ||
                            response?.error || 
                            `Request failed with status ${status}`;
        console.error(`API ${method.toUpperCase()} ${url} returned error status ${status}:`, errorMessage);
        
        // Throw error for any backend error response
        throw new ApiError(errorMessage, status, response?.data);
      }
      
      // Return data directly for successful responses
      return response.data;
    } catch (error) {
      // If it's already an ApiError, re-throw it
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Handle axios errors
      console.error(`API ${method.toUpperCase()} ${url} failed:`, error);
      
      const status = error.response?.status;
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'An error occurred';
      
      // Explicitly handle 403 Forbidden errors
      if (status === 403) {
        console.error('403 Forbidden - Access denied:', errorMessage);
      }
      
      // Throw error for any backend error response
      throw new ApiError(errorMessage, status, error.response?.data);
    }
  }, []);

  const api = useMemo(() => ({
    get: (url, params, options) => apiCall('get', url, params, options),
    post: (url, data, options) => apiCall('post', url, data, options),
    put: (url, data, options) => apiCall('put', url, data, options),
    patch: (url, data, options) => apiCall('patch', url, data, options),
    delete: (url, options) => apiCall('delete', url, null, options),
    // Convenience methods for common operations
    fetchUserProfile: () => apiCall('get', '/users/profile'),
    updateUserProfile: (profileData) => apiCall('put', '/users/profile', profileData),
  }), [apiCall]);

  return api;
};