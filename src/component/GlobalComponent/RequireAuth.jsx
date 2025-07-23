import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; // adjust the path as per your structure

const RequireAuth = () => {
  const location = useLocation();
  const { auth } = useAuth();

  return auth?.accessToken ? (
    <Outlet />
  ) : (
    <Navigate
      to="/auth/login"
      state={{ from: location }}
      replace
    />
  );
};

export default RequireAuth;

