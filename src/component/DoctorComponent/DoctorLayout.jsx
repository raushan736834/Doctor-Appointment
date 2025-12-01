// import { useState, useRef, useEffect, useCallback } from "react";
// import Sidebar from "./Sidebar";
// import { Outlet } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../GlobalComponent/AuthProvider";
// import ConfirmationPopup from "../Common/ConfirmationPopup";
// import { FiAlertTriangle } from "react-icons/fi";

// const DoctorLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const sidebarRef = useRef(null);
//   const navigate = useNavigate();
//   const { auth, logout,accessToken } = useAuth();
//   const [showPopup, setShowPopup] = useState(false);
//   useEffect(() => {
//     if (!accessToken) {
//       navigate("/", { replace: true });
//       return;
//     }
//   }, [auth, navigate]);

//   // Close sidebar when clicking outside (but not on hamburger button)
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       // Don't close if clicking on the hamburger button
//       const hamburgerButton = event.target.closest('button[aria-label*="sidebar"]');
//       if (hamburgerButton) return;

//       if (sidebarRef.current && !sidebarRef.current.contains(event.target) && sidebarOpen) {
//         setSidebarOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [sidebarOpen]);

//   const handleLogout = useCallback(async () => {
//       await logout();
//     }, [logout]);

//   return (
//     <div className="min-h-screen bg-white flex flex-col md:flex-row">
//       {/* Mobile Header */}
//       <div className="bg-white px-4 py-3 shadow md:hidden flex justify-between items-center fixed top-0 left-0 right-0 z-50 h-14">
//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
//         >
//           <svg
//             className="w-6 h-6 text-gray-700"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d={
//                 sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
//               }
//             />
//           </svg>
//         </button>
//       </div>

//       {/* Sidebar */}
//       <aside
//         ref={sidebarRef}
//         className={`
//           fixed top-14 left-0 bottom-0 w-48 bg-gray-300 z-40 transform
//           transition-transform duration-300 ease-in-out overflow-hidden
//           ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
//           md:fixed md:top-0 md:translate-x-0 lg:w-64 md:block md:shadow-none
//         `}
//       >
//         <Sidebar closeSidebar={() => setSidebarOpen(false)} onLogoutClick={() => setShowPopup(true)} />
//       </aside>
//       {/* Main Content */}
//       <main className="flex-1 overflow-y-auto bg-white pt-14 md:pt-0 md:ml-48 lg:ml-64">
//         <Outlet />
//       </main>
//       <ConfirmationPopup
//         isOpen={showPopup}
//         onClose={() => setShowPopup(false)}
//         onConfirm={handleLogout}
//         title="Confirm Logout"
//         message="Are you sure you want to logout?"
//         confirmText="Logout"
//         cancelText="Stay Logged in"
//         type="danger"
//         icon={FiAlertTriangle}
//       />
//     </div>
//   );
// };

// export default DoctorLayout;

import { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../GlobalComponent/AuthProvider";
import ConfirmationPopup from "../Common/ConfirmationPopup";
import { FiAlertTriangle } from "react-icons/fi";

const DoctorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, accessToken, user } = useAuth();
  const [showPopup, setShowPopup] = useState(false);

  // destructure what you need
  const roles = user?.roles || []; // your array of roles
  const isDoctor = roles.includes("DOCTOR");
  const accountStatus = user?.accountStatus;

  // Check if current route is doctorOnboarding
  const isOnboardingRoute = (location.pathname === "/doctor/doctorOnboarding") || (location.pathname === '/doctor/afterReview');
  console.log(isOnboardingRoute);
  // if no token, push back to home/login
  useEffect(() => {
    if (!accessToken) {
      navigate("/", { replace: true });
    }
  }, [accessToken, navigate]);

  // 👇 *** Onboarding enforcement ***
  useEffect(() => {
    if (!isDoctor) return;
    if (
      accountStatus !== "COMPLETE" &&
      location.pathname !== "/doctor/doctorOnboarding"
    ) {
      console.log("navigating to onboarding");
      navigate("/doctor/doctorOnboarding", { replace: true });
    }
    if(accountStatus === 'PENDING'){
      navigate("/doctor/afterReview",{state: {doctor: user}}, { replace: true });
    }
    if (
      accountStatus === "COMPLETE" &&
      location.pathname === "/doctor/doctorOnboarding"
    ) {
      navigate("/doctor/dashboard", { replace: true });
    }
  }, [isDoctor, accountStatus, location.pathname, navigate]);

  // Close sidebar when clicking outside (but not on hamburger button)
  useEffect(() => {
    const handleClickOutside = (event) => {
      const hamburgerButton = event.target.closest(
        'button[aria-label*="sidebar"]'
      );
      if (hamburgerButton) return;

      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        sidebarOpen
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="bg-white px-4 py-3 shadow md:hidden flex justify-between items-center fixed top-0 left-0 right-0 z-50 h-14">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed top-14 left-0 bottom-0 bg-gray-300 z-40 transform
          transition-transform duration-300 ease-in-out overflow-hidden
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:fixed md:top-0 md:translate-x-0 md:block md:shadow-none
          ${isOnboardingRoute ? "w-20" : "w-48 md:w-48 lg:w-64"}
        `}
      >
        <Sidebar
          closeSidebar={() => setSidebarOpen(false)}
          onLogoutClick={() => setShowPopup(true)}
        />
      </aside>

      {/* Main Content */}
      <main
        className={`
        flex-1 overflow-y-auto bg-white pt-14 md:pt-0 transition-all duration-300 ease-in-out
        ${isOnboardingRoute ? "md:ml-16 lg:ml-16" : "md:ml-48 lg:ml-64"}
      `}
      >
        <Outlet />
      </main>

      <ConfirmationPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Stay Logged in"
        type="danger"
        icon={FiAlertTriangle}
      />
    </div>
  );
};

export default DoctorLayout;
