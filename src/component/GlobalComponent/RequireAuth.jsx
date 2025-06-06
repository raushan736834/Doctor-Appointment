import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

const RequireAuth = () => {
  const location = useLocation();
  const [accessToken] = useState(localStorage.getItem("token"));

  // useEffect(() => {
  //   const handleStorageChange = () => {
  //     setAccessToken(localStorage.getItem("token")); // Update state when localStorage changes
  //   };

  //   window.addEventListener("storage", handleStorageChange);
  //   return () => window.removeEventListener("storage", handleStorageChange);
  // }, []);

  return accessToken ? (
    <Outlet />
  ) : (
    <Navigate
      to="auth/login"
      state={{ from: location}}
      replace
    />
  );
};

export default RequireAuth;
