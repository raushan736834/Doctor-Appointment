import React, { useState, useRef, useEffect } from "react";

const appointments = [
  {
    id: 1,
    date: "Apr 24, 2024",
    time: "9:00 AM",
    patient: "John Smith",
    reason: "General Consultation",
    status: "Confirmed",
  },
  {
    id: 2,
    date: "Apr 24, 2024",
    time: "10:30 AM",
    patient: "Emily Johnson",
    reason: "Follow-up",
    status: "Pending",
  },
  {
    id: 3,
    date: "Apr 24, 2024",
    time: "1:00 PM",
    patient: "Michael Brown",
    reason: "General Consultation",
    status: "Confirmed",
  },
  {
    id: 4,
    date: "Apr 25, 2024",
    time: "11:00 AM",
    patient: "Sarah Davis",
    reason: "Pediatric Checkup",
    status: "Confirmed",
  },
  {
    id: 5,
    date: "Apr 25, 2024",
    time: "2:00 PM",
    patient: "James Wilson",
    reason: "Annual Physical",
    status: "Confirmed",
  },
  {
    id: 6,
    date: "Apr 26, 2024",
    time: "3:00 PM",
    patient: "Olivia Smith",
    reason: "Dental Checkup",
    status: "Confirmed",
  },
  {
    id: 7,
    date: "Apr 27, 2024",
    time: "4:00 PM",
    patient: "Liam Johnson",
    reason: "Eye Test",
    status: "Pending",
  },
];

const statusStyles = {
  Confirmed: "bg-blue-100 text-blue-800",
  Pending: "bg-yellow-100 text-yellow-800",
};

const ITEMS_PER_PAGE = 5;

const AppointmentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const sidebarRef = useRef(null);

  const totalPages = Math.ceil(appointments.length / ITEMS_PER_PAGE);
  const paginatedAppointments = appointments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        sidebarOpen
      ) {
        setSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Hamburger Icon */}
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
    fixed top-14 left-0 bottom-0 w-48 z-40 bg-white p-6 transform
    transition-transform duration-300 ease-in-out
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    md:relative md:top-0 md:translate-x-0 md:w-64 md:block md:shadow-none
  `}
      >
        <div className="flex items-center space-x-2 mb-2">
          <div className="text-3xl hidden md:block">🩺</div>
          <h1 className="text-xl font-semibold hidden md:block">
            Doctor Panel
          </h1>
        </div>
        <nav className="space-y-4">
          <a
            href="#"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center space-x-2 text-blue-600 font-medium"
          >
            <span>🏠</span>
            <span>Home</span>
          </a>
          <a
            href="#"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
          >
            <span>📅</span>
            <span>Appointments</span>
          </a>
          <a
            href="#"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
          >
            <span>👥</span>
            <span>Patients</span>
          </a>
          <a
            href="#"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
          >
            <span>⚙️</span>
            <span>Settings</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <h2 className="text-2xl font-semibold mb-6">Upcoming Appointments</h2>

        <div className="hidden md:grid grid-cols-5 gap-4 px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-t-md">
          <div>Date</div>
          <div>Time</div>
          <div>Patient</div>
          <div>Reason</div>
          <div>Status</div>
        </div>

        {paginatedAppointments.map((appt) => (
          <div
            key={appt.id}
            className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 px-4 py-4 bg-white border-b text-sm text-gray-700 md:items-center"
          >
            <div>
              <span className="md:hidden font-semibold">Date: </span>
              {appt.date}
            </div>
            <div>
              <span className="md:hidden font-semibold">Time: </span>
              {appt.time}
            </div>
            <div>
              <span className="md:hidden font-semibold">Patient: </span>
              {appt.patient}
            </div>
            <div>
              <span className="md:hidden font-semibold">Reason: </span>
              {appt.reason}
            </div>
            <div>
              <span className="md:hidden font-semibold">Status: </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  statusStyles[appt.status]
                }`}
              >
                {appt.status}
              </span>
            </div>
          </div>
        ))}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default AppointmentDashboard;
