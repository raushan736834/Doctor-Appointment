// // import axios from "axios";
// // import useAuth from "./useAuth";

// // const baseUrl = "http://localhost:8080"; // your backend
// // // const baseUrl = import.meta.env.VITE_BASE_URL // your backend
// // const { auth, setAuth } = useAuth();

// // const api = axios.create({
// //   baseURL: baseUrl,
// //   withCredentials: true,
// //   headers: {
// //     "Content-Type": "application/json",
// //   },
// // });

// // // Request Interceptor: attach access token
// // api.interceptors.request.use(
// //   (config) => {
// //     const accessToken = auth?.accessToken;
// //     if (accessToken) {
// //       config.headers.Authorization = `Bearer ${accessToken}`;
// //     }
// //     return config;
// //   },
// //   (error) => Promise.reject(error)
// // );

// // // Response Interceptor: handle token refresh
// // api.interceptors.response.use(
// //   (response) => response,
// //   async (error) => {
// //     const originalRequest = error.config;

// //     if (
// //       error.response?.status === 401 &&
// //       !originalRequest._retry &&
// //       auth?.refreshToken
// //     ) {
// //       originalRequest._retry = true;
// //       try {
// //         const refreshToken = auth?.refreshToken;
// //         const { data } = await axios.post(`${baseUrl}/auth/refresh-token`, {
// //           refreshToken,
// //         });
// //         console.log("Refresh token called");
// //         const newAccessToken = data.accessToken;
// //         setAuth((prev) => ({
// //           ...prev,
// //           accessToken : newAccessToken
// //         }));

// //         // Update Authorization header and retry
// //         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
// //         return api(originalRequest);
// //       } catch (refreshError) {
// //         console.error("Refresh failed. Logging out.");
// //         localStorage.clear();
// //         window.location.href = "/auth/login";
// //         return Promise.reject(refreshError);
// //       }
// //     }

// //     return Promise.reject(error);
// //   }
// // );

// // export default api;


// import { useEffect, useRef } from "react";
// import axios from "axios";
// import useAuth from "./useAuth";

// const baseUrl = "http://localhost:8080";

// // Create axios instance
// const api = axios.create({
//   baseURL: baseUrl,
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Create a reference to store the refresh promise
// let refreshTokenPromise = null;

// const useAxios = () => {
//   const { auth, setAuth } = useAuth();
//   const initialized = useRef(false);

//   useEffect(() => {
//     // Prevent multiple initializations
//     if (initialized.current) return;
//     initialized.current = true;

//     // Request interceptor: attach access token if present
//     const requestInterceptor = api.interceptors.request.use(
//       (config) => {
//         // Skip adding token for refresh token requests
//         if (config.url === "/auth/refresh-token") {
//           return config;
//         }

//         const accessToken = auth?.accessToken;
//         if (accessToken) {
//           config.headers.Authorization = `Bearer ${accessToken}`;
//         }
//         return config;
//       },
//       (error) => Promise.reject(error)
//     );

//     // Response interceptor: handle token refresh
//     const responseInterceptor = api.interceptors.response.use(
//       (response) => response,
//       async (error) => {
//         const originalRequest = error?.config;

//         // If error is 401 and we haven't retried yet and it's not a refresh token request
//         if (
//           error?.response?.status === 401 &&
//           !originalRequest?._retry &&
//           originalRequest?.url !== "/auth/refresh-token"
//         ) {
//           originalRequest._retry = true;

//           try {
//             // If a refresh is already in progress, wait for it
//             if (!refreshTokenPromise) {
//               refreshTokenPromise = api
//                 .post("/auth/refresh-token")
//                 .finally(() => {
//                   refreshTokenPromise = null;
//                 });
//             }

//             const response = await refreshTokenPromise;
//             const newAccessToken = response?.data?.accessToken;

//             if (!newAccessToken) {
//               throw new Error("No access token received");
//             }

//             // Update auth context with new token
//             setAuth((prev) => ({
//               ...prev,
//               accessToken: newAccessToken,
//             }));

//             // Retry original request with new token
//             originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//             return api(originalRequest);
//           } catch (refreshError) {
//             // Clear auth on refresh token failure
//             setAuth({});
//             localStorage.clear();
//             window.location.href = "/auth/login";
//             return Promise.reject(refreshError);
//           }
//         }

//         return Promise.reject(error);
//       }
//     );

//     // Cleanup function
//     return () => {
//       api.interceptors.request.eject(requestInterceptor);
//       api.interceptors.response.eject(responseInterceptor);
//       initialized.current = false;
//     };
//   }, []); // Remove dependency on auth.accessToken

//   return api;
// };

// export default useAxios;
