// // import { createContext, useState,useEffect } from "react";
// // import OverlayLoader from "../Common/Loader";

// // const AuthContext = createContext({});

// // export const AuthProvider = ({ children }) => {
// //   const [auth, setAuth] = useState({
// //     accessToken:localStorage.getItem('token') || null,
// //   });
// //   const [isLoading,setIsLoading]=useState(false);
// //   return (
// //     <AuthContext.Provider value={{ auth, setAuth , isLoading,setIsLoading}}>
// //       {children}
// //       {isLoading &&
// //         <OverlayLoader/>
// //       }
// //     </AuthContext.Provider>
// //   );
// // };

// // export default AuthContext;
// import { createContext, useState, useEffect } from "react";

// Create AuthContext with clear structure
// const AuthContext = createContext({});

// export const AuthProvider = ({ children }) => {
//   const [auth, setAuth] = useState({
//     accessToken: localStorage.getItem("token") || null,
//   });

//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (auth.accessToken) {
//       localStorage.setItem("token", auth.accessToken);
//     } else {
//       localStorage.removeItem("token");
//     }
//   }, [auth.accessToken]);

//   return (
//     <AuthContext.Provider value={{ auth, setAuth, isLoading, setIsLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;

// AuthContext.jsx
// import { createContext, useState, useEffect, useCallback } from "react";
// import useAxios from "../../hooks/useAxios";

// const AuthContext = createContext({});

// export const AuthProvider = ({ children }) => {
//   const [auth, setAuth] = useState(null); // {accessToken,email,role,fullname,doctorId,accountStatus}
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const api = useAxios();
//   const accessToken = auth?.accessToken;
//   // On app start, try to restore user from server if you're using httpOnly cookie refresh token
//   useEffect(() => {
//     (async () => {
//       try {
//         if (accessToken) {
//           // If we have an access token, set it immediately
//           setAuth({
//             accessToken: accessToken,
//           });
//           setIsAuthenticated(true);
//         }
//         {console.log(auth)}
//         // Try to get user info from server
//         const res = await api.get("/auth/me");
//         console.log("Auth me response:", res);

//         if (res.data) {
//           const roles = (res.data.roles || "").split(",").map(r => r.trim());

//           setAuth(prev => ({
//             ...prev,
//             accessToken: accessToken || prev?.accessToken,
//             email: res.data.email,
//             role: roles,
//             fullname: res.data.fullname,
//           }));

//           if (roles.includes("DOCTOR")) {
//             setAuth(prev => ({
//               ...prev,
//               doctorId: res.data?.doctorId,
//               accountStatus: res.data?.accountStatus,
//             }));
//           }

//           setIsAuthenticated(true);
//           console.log("Authentication successful:", auth);
//         }
//       } catch (err) {
//         console.log("Authentication failed:", err);
//         setAuth(null);
//         setIsAuthenticated(false);
//       } finally {
//         setIsLoading(false);
//       }
//     })();
//   }, [isAuthenticated]);

//   const logout = useCallback(async () => {
//     try {
//       await api.post("/auth/logout");
//     } catch (e) {
//       // ignore logout error and clear client state anyway
//     } finally {
//       setAuth(null);
//       setIsAuthenticated(false);
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ auth, setAuth, isLoading, setIsLoading, isAuthenticated, setIsAuthenticated, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;

import axiosInstance from "../../config/axiosConfig";
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";

const AuthContext = createContext();

// Auth reducer for managing authentication state
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        accessToken: action.payload.accessToken,
        user: action.payload.user,
        loading: false,
        error: null,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        accessToken: null,
        user: null,
        loading: false,
        error: null,
      };
    case "TOKEN_REFRESH_SUCCESS":
      return {
        ...state,
        accessToken: action.payload.accessToken,
        error: null,
      };
    case "TOKEN_REFRESH_FAILED":
      return {
        ...state,
        isAuthenticated: false,
        accessToken: null,
        user: null,
        loading: false,
        error: "Session expired. Please login again.",
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
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
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  // Initialize auth state by checking for existing session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });

        // Fix: axiosInstance.get takes (url, config) not (url, data, config)
        const { data } = await axiosInstance.get("/auth/me", {
          withCredentials: true,
        });

        if (data?.accessToken) {
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: {
              accessToken: data.accessToken,
              user: data, // This contains email, fullname, roles, etc.
            },
          });
        } else {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } catch (error) {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      console.log(
        "🔵 Attempting login to:",
        axiosInstance.defaults.baseURL + "/auth/login"
      );
      console.log("🔵 Email:", email);
      console.log("🔵 withCredentials:", true);

      const response = await axiosInstance.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );

      console.log("✅ Login response:", response);
      console.log("✅ Response data:", response.data);

      const { data } = response;

      if (data?.accessToken) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            accessToken: data.accessToken,
            user: data,
          },
        });
        return { success: true, data };
      }

      const errorMessage = data?.error || "Login failed";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      return { success: false, error: errorMessage };
    } catch (error) {
      console.error("❌ Login error:", error);
      console.error("❌ Error response:", error.response);
      console.error("❌ Error status:", error.response?.status);
      console.error("❌ Error data:", error.response?.data);
      console.error("❌ Error headers:", error.response?.headers);

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Network error. Please try again.";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const { data } = await axiosInstance.post(
        "/auth/refresh-token",
        {},
        { withCredentials: true }
      );
      if (data?.accessToken) {
        dispatch({
          type: "TOKEN_REFRESH_SUCCESS",
          payload: { accessToken: data.accessToken },
        });
        return data.accessToken;
      }
      dispatch({ type: "TOKEN_REFRESH_FAILED" });
      return null;
    } catch (error) {
      dispatch({ type: "TOKEN_REFRESH_FAILED" });
      return null;
    }
  }, []);

  const value = {
    ...state,
    login,
    logout,
    refreshToken,
    clearError: () => dispatch({ type: "CLEAR_ERROR" }),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
