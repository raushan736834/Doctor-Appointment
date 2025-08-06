import { Outlet } from "react-router-dom";
import useOnline from "../../hooks/useOnline";
import NoInternetPage from "../Common/NoInternetPage";

const RequireOnline = () => {
  const isOnline = useOnline();
  return isOnline ? (
    <Outlet />
  ) : (
    <NoInternetPage />
  );
};

export default RequireOnline;