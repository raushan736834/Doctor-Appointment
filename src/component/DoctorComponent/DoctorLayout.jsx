import { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const DoctorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const { auth } = useAuth();

  useEffect(() => {
    if (!auth?.accessToken) {
      navigate("/", { replace: true });
      return;
    }
  }, [auth, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
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
      <aside
        ref={sidebarRef}
        className={`
          fixed top-14 left-0 bottom-0 w-48 h-screen bg-gray-300 z-40 transform
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:top-0 md:translate-x-0 lg:w-64 md:block md:shadow-none
  `}
      >
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main
        className="flex-1 p-2 md:p-2 overflow-y-auto"
        style={{
          height: "calc(100vh - 24px)",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default DoctorLayout;
