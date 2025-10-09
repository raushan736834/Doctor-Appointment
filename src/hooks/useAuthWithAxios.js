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
 * API service hook that provides common API methods
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
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`API ${method.toUpperCase()} ${url} failed:`, error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'An error occurred';
      return { 
        success: false, 
        error: errorMessage,
        status: error.response?.status 
      };
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