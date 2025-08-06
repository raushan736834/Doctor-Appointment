import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";

const tabs = [
  {
    name: "Your Profile",
    path: "doctor-profile"
  },
  {
    name: "Security & Password",
    path: "security"
  }
];

const DoctorSetting = () => {
  const { pathname } = useLocation();
  const isActive = (path) => {
    if (path === "doctor-profile" && pathname === "/doctor/settings") {
      return true;
    }
    return pathname.endsWith(`/settings/${path}`);
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-b from-[#f0f4ff] to-[#ffffff]">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-indigo-700">Settings</h2>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex gap-2 flex-wrap">
            {tabs.map((tab) => (
              <Link
                key={tab.path}
                to={tab.path}
                aria-current={isActive(tab.path) ? "page" : undefined}
                className={`px-3 py-2 rounded-full text-sm font-medium transition shadow ${
                  isActive(tab.path)
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white ring-2 ring-indigo-300"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default DoctorSetting;
