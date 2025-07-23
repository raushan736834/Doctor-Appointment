import { useState } from "react";
import DoctorDashboardStats from "./DoctorDashboardStats";

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

const ITEMS_PER_PAGE = 5;

const DoctorDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const name = localStorage.getItem("name")?.split(" ")[0] || "Doctor";
  const patient = 0; // Replace with actual patient count

  const totalPages = Math.ceil(appointments.length / ITEMS_PER_PAGE);
  const paginatedAppointments = appointments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-4 space-y-6 bg-gradient-to-b from-[#f0f4ff] to-[#ffffff] min-h-full">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-2">
        <h2 className="text-xl font-semibold text-indigo-700">
          Good Morning, Dr. {name}!
        </h2>
        <p className="text-sm text-gray-500">
          You have {patient} patients waiting today.
        </p>
      </div>

      {/* Dashboard Stats */}
      <DoctorDashboardStats />

      {/* Appointments */}
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <div className="border-b pb-2">
          <h2 className="text-xl font-semibold text-indigo-700">
            Upcoming Appointments
          </h2>
          <p className="text-sm text-gray-500">
            These are your appointments for today.
          </p>
        </div>
        <div className="hidden md:grid grid-cols-5 gap-4 px-4 py-2 text-sm font-semibold text-black text-center">
          <div>Date</div>
          <div>Time</div>
          <div>Patient</div>
          <div>Reason</div>
          <div>Status</div>
        </div>
        <div className="space-y-3">
          {paginatedAppointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-gray-100 rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.01] transition transform p-4 grid grid-cols-1 md:grid-cols-5 gap-2 text-sm text-gray-800 items-center text-center"
            >
              <div className="font-medium">
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
              <div className="text-purple-600 font-medium">
                <span className="md:hidden font-semibold">Reason: </span>
                {appt.reason}
              </div>
              <div>
                <span className="md:hidden font-semibold">Status: </span>
                <span
                  className={`px-2 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${
                    appt.status === "Confirmed"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {appt.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            currentPage === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90"
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
          className={`px-4 py-2 rounded-lg font-medium transition ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DoctorDashboard;