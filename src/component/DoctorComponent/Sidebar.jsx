import { useCallback } from "react";
import { BiSolidHome, BiBody, BiTask } from "react-icons/bi";
import { IoSettings } from "react-icons/io5";
import { GiStethoscope } from "react-icons/gi";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const ROUTES = [
  {
    name: "Home",
    path: "dashboard",
    icon: <BiSolidHome />,
  },
  {
    name: "Appointments",
    path: "appointments",
    icon: <BiBody />,
  },
  {
    name: "Patients",
    path: "#", // add a placeholder or implement the page
    icon: <BiTask />,
  },
  {
    name: "Settings",
    path: "settings",
    icon: <IoSettings />,
  },
];

const Sidebar = ({ closeSidebar, onLogoutClick }) => {
  const { setAuth } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    setAuth({});
    localStorage.clear();
    navigate("/", { replace: true });
  }, [setAuth, navigate]);

  const isActive = (path) => pathname === `/doctor/${path}`;

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (closeSidebar) {
      closeSidebar();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-200 text-gray-900 md:w-48 lg:w-64">
      <div className="flex flex-col ml-2 justify-between h-full items-start text-start lg:items-center md:items-center">
        <div className="justify-start items-start flex flex-col">
          {/* Logo - Hidden on mobile */}
          <div className="gap-5 hidden md:flex p-5 items-center text-[#27374d] bg-gray-200 text-center">
            <GiStethoscope className="text-sm items-start md:items-center font-bold md:text-6xl lg:text-7xl " />
          </div>
          <div className="gap-[10px] mt-3 md:mt-0 flex flex-col text-start">
            {ROUTES.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                onClick={handleLinkClick}
                aria-current={isActive(route.path) ? "page" : undefined}
                className={`flex items-center gap-5 text-xl p-[10px] font-semibold rounded-lg transition duration-300 ease-in-out ${
                  isActive(route.path)
                    ? "bg-gray-800 text-white"
                    : "hover:bg-gray-800 hover:text-white"
                }`}
              >
                {route.icon}
                <span className="text-base md:text-lg ml-2">{route.name}</span>
              </Link>
            ))}
          </div>
        </div>
        <div
          className="mb-20 md:mb-5 flex items-center p-2 font-semibold hover:bg-gray-800
                hover:text-white transition duration-300 ease-in-out rounded-lg "
        >
          <RiLogoutCircleRLine className="md:text-2xl" />
          <button
            type="button"
            className="text-base md:text-lg ml-2"
            onClick={onLogoutClick}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
