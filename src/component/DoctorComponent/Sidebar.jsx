import { BiSolidHome, BiBody, BiTask } from "react-icons/bi";
import { GiStethoscope } from "react-icons/gi";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { HomeIcon, Settings,Bell,ClipboardList,PersonStanding } from "lucide-react";
import { useAuth } from "../GlobalComponent/AuthProvider";

const ROUTES = [
  {
    name: "Home",
    path: "dashboard",
    icon: <HomeIcon />,
  },
  {
    name: "Appointments",
    path: "appointments",
    icon: <ClipboardList />,
  },
  {
    name: "Patients",
    path: "patients", 
    icon: <PersonStanding />,
  },
  {
    name: "Notifications",
    path: "notifications",
    icon: <Bell />,
  },
  {
    name: "Settings",
    path: "settings",
    icon: <Settings />,
  },
];

const Sidebar = ({ closeSidebar, onLogoutClick }) => {
  const { pathname } = useLocation();
  const isActive = (path) => pathname === `/doctor/${path}`;
  const { user } = useAuth();
  const accountStatus = user?.accountStatus;
  const isDoctorOnboarded = accountStatus === "COMPLETE" ? true : false;
  
  // Check if current route is doctorOnboarding
  const isOnboardingRoute = pathname === "/doctor/doctorOnboarding" || pathname === '/doctor/afterReview';

  const handleLinkClick = () => {
    if (closeSidebar) {
      closeSidebar();
    }
  };

  return (
    <div className={`flex flex-col items-center h-screen bg-gray-200 text-gray-900 px-5 ${
      isOnboardingRoute ? "w-20" : "md:w-48 lg:w-64"
    }`}>
      <div className={`flex flex-col md:justify-between justify-start h-full items-start text-start ${
        isOnboardingRoute ? "lg:items-center md:items-center" : "lg:items-center md:items-center"
      }`}>
        <div className="justify-start items-start flex flex-col">
          {/* Logo - Hidden on mobile, shrunk on onboarding route */}
          <div className={`gap-5 hidden md:flex p-5 items-center text-[#27374d] bg-gray-200 text-center ${
            isOnboardingRoute ? "justify-center" : ""
          }`}>
            <GiStethoscope className={`text-sm items-start md:items-center font-bold ${
              isOnboardingRoute ? "md:text-3xl lg:text-4xl" : "md:text-6xl lg:text-7xl"
            }`} />
          </div>
          {isDoctorOnboarded && (
            <div className="gap-[10px] mt-3 md:mt-0 flex flex-col text-start w-full">
              {ROUTES.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  onClick={handleLinkClick}
                  aria-current={isActive(route.path) ? "page" : undefined}
                  className={`flex items-center ${
                    isOnboardingRoute ? "justify-center" : "gap-5"
                  } text-xl p-[10px] font-semibold rounded-lg transition duration-300 ease-in-out ${
                    isActive(route.path)
                      ? "bg-gray-800 text-white"
                      : "hover:bg-gray-800 hover:text-white"
                  }`}
                  title={isOnboardingRoute ? route.name : ""} // Show tooltip on hover when shrunk
                >
                  {route.icon}
                  {!isOnboardingRoute && (
                    <span className="text-base md:text-lg ml-2">{route.name}</span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
        <div
          onClick={onLogoutClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onLogoutClick();
          }}
          role="button"
          tabIndex={0}
          className={`mb-4 md:mb-5 flex align ${
            isOnboardingRoute ? "justify-center" : "gap-5"
          } place-items-center p-2 font-semibold hover:bg-gray-800 hover:text-white transition duration-300 ease-in-out rounded-lg cursor-pointer w-full`}
          title={isOnboardingRoute ? "Logout" : ""}
        >
          <RiLogoutCircleRLine className="md:text-2xl" />
          {!isOnboardingRoute && (
            <button
              type="button"
              className="text-base md:text-lg"
              onClick={onLogoutClick}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;