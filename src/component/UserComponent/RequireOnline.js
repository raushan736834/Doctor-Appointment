import { Outlet } from "react-router-dom";
import useOnline from "../../hooks/useOnline";

const RequireOnline = () => {
  const isOnline = useOnline();
  console.log(isOnline)

  return isOnline ? (
    <Outlet />
  ) : (
    <div className="text-2xl font-bold">Offline, Check Your Internet Connection</div>
  );
};

export default RequireOnline;