import axiosInstance from '../../config/axiosConfig';
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        accessToken: action.payload.accessToken,
        user: action.payload.user,
        loading: false,
        error: null
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        accessToken: null,
        user: null,
        loading: false,
        error: null
      };
    case 'TOKEN_REFRESH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true, // Explicitly ensure isAuthenticated remains true
        accessToken: action.payload.accessToken,
        error: null
      };
    case 'TOKEN_REFRESH_FAILED':
      return {
        ...state,
        isAuthenticated: false,
        accessToken: null,
        user: null,
        loading: false,
        error: 'Session expired. Please login again.'
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  accessToken: null,
  user: null,
  loading: true,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  // Initialize auth state by checking for existing session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
  
        const response = await axiosInstance.get('/auth/me', { withCredentials: true });
        const { data } = response?.data;
          
        if (data?.accessToken) {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              accessToken: data.accessToken,
              user: data 
            }
          });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
  
    initializeAuth();
  }, []);
  

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await axiosInstance.post('/auth/login', { email, password }, { withCredentials: true });
      console.log(response);
      const { data } = response?.data;
      if (data?.accessToken) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            accessToken: data.accessToken,
            user: data
          }
        });
        return { success: true, data };
      }

      const errorMessage = data?.error || 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Network error. Please try again.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await axiosInstance('/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const refreshToken = useCallback(async () => {
    try {
      console.log('Attempting to refresh access token...');
      const response = await axiosInstance.post('/auth/refresh-token', {}, { withCredentials: true });
      
      // Response structure: { data: { success: true, message: "...", data: "token_string", status: 200 } }
      const responseData = response?.data;
      const token = responseData?.data; // The token is directly in response.data.data
      
      if (token && typeof token === 'string' && responseData?.success) {
        console.log('Token refresh successful');
        dispatch({
          type: 'TOKEN_REFRESH_SUCCESS',
          payload: { accessToken: token }
        });
        return token;
      }
      console.warn('Token refresh returned no access token or unsuccessful response');
      dispatch({ type: 'TOKEN_REFRESH_FAILED' });
      return null;
    } catch (error) {
      console.error('Token refresh error:', error.response?.status, error.response?.data);
      // Only dispatch TOKEN_REFRESH_FAILED - don't call logout here
      // The logout will be handled by RequireAuth redirecting to login
      // or by the component that catches the error
      dispatch({ type: 'TOKEN_REFRESH_FAILED' });
      return null;
    }
  }, []);

  const value = {
    ...state,
    login,
    logout,
    refreshToken,
    clearError: () => dispatch({ type: 'CLEAR_ERROR' })
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};