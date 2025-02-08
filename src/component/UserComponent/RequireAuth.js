import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = () => {
  const location = useLocation();
  let accessToken = localStorage.getItem("token");

  return accessToken ? (
    <Outlet />
  ) : (
    <Navigate
      to="auth.login.user"
      state={{ from: location}}
      replace
    />
  );
};

export default RequireAuth;
