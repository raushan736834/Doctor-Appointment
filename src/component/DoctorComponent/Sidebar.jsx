import { useCallback } from "react";
import { BiSolidHome, BiBody, BiTask } from "react-icons/bi";
import { IoSettings } from "react-icons/io5";
import { GiStethoscope } from "react-icons/gi";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Sidebar = () => {
  const { setAuth } = useAuth();
  const location = useLocation();
  const handleLogout = useCallback(() => {
    setAuth({});
    localStorage.clear();
  }, [setAuth]);

  // Helper to check if route is active
  const isActive = (path) => location.pathname.endsWith(path);

  return (
    <div className="flex flex-col h-screen bg-gray-200 text-gray-900 md:w-48 lg:w-64">
      <div className="flex flex-col ml-2 justify-between h-full items-start text-start lg:items-center md:items-center">
        <div className="justify-start items-start flex flex-col">
          <div className="gap-5 flex p-5 items-center text-[#27374d] bg-gray-200 text-center">
            <GiStethoscope className="text-sm items-start md:items-center font-bold md:text-6xl lg:text-7xl " />
          </div>
          <div className="gap-[10px] flex flex-col text-start">
            <Link
              to="doctor-dashboard"
              className={`flex items-center gap-5 text-xl p-[10px] font-semibold rounded-lg transition duration-300 ease-in-out ${
                isActive("doctor-dashboard")
                  ? "bg-gray-800 text-white"
                  : "hover:bg-gray-800 hover:text-white"
              }`}
            >
              <BiSolidHome className="icon text-base md:text-2xl" />
              <span className="text-base md:text-lg ml-2">Home</span>
            </Link>
            <Link
              to="appointments"
              className={`flex items-center p-2 font-semibold rounded-lg transition duration-300 ease-in-out ${
                isActive("appointments")
                  ? "bg-gray-800 text-white"
                  : "hover:bg-gray-800 hover:text-white"
              }`}
            >
              <BiTask className="icon md:text-2xl" />
              <span className="text-base md:text-lg ml-2">Appointments</span>
            </Link>
            <Link
              to="#"
              className=" flex items-center p-2 font-semibold hover:bg-gray-800
                hover:text-white transition duration-300 ease-in-out rounded-lg text-start"
            >
              <BiBody className="icon md:text-2xl" />
              <span className="ml-2 md:text-lg text-base">Patients</span>
            </Link>
            <Link
              to="settings"
              className="flex items-center text-start p-2  font-semibold hover:bg-gray-800
                hover:text-white transition duration-300 ease-in-out rounded-lg "
            >
              <IoSettings className="icon md:text-2xl" />
              <span className="text-base md:text-lg ml-2">Setting</span>
            </Link>
          </div>
        </div>
        <div
          className="mb-20 md:mb-5 item flex  items-center p-2  font-semibold hover:bg-gray-800
                hover:text-white transition duration-300 ease-in-out rounded-lg "
        >
          <RiLogoutCircleRLine className="icon md:text-2xl" />
          <button className="text-base md:text-lg ml-2" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
