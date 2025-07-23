import React, { useState } from "react";
import ActionMenu from "./ActionMenu";
import RescheduleModal from "./RescheduleModal";
import {handleCancelAppointment} from '../UserComponent/BookingDetails';

const tabs = ["All Order", "Summary", "Completed", "Cancelled"];

const orders = [
  {
    id: "#2632",
    appointmentId: "apt_001", // Added appointmentId for reschedule functionality
    name: "Brooklyn Zoe",
    payment: "Cash",
    time: "13 min",
    type: "Delivery",
    status: "Delivered",
    total: "£12.00",
    doctorId: "doc_001", // Added doctor info for reschedule
    doctor: {
      id: "doc_001",
      doctorName: "Dr. Smith",
      specialization: "General Medicine",
    },
  },
  {
    id: "#2633",
    appointmentId: "apt_002",
    name: "Alice Krejcová",
    payment: "Paid",
    time: "49 min",
    type: "Collection",
    status: "Collected",
    total: "£14.00",
    doctorId: "doc_002",
    doctor: {
      id: "doc_002",
      doctorName: "Dr. Johnson",
      specialization: "Cardiology",
    },
  },
  {
    id: "#2634",
    appointmentId: "apt_003",
    name: "Jurinaon van",
    payment: "Cash",
    time: "07 min",
    type: "Delivery",
    status: "Cancelled",
    total: "£18.00",
    doctorId: "doc_003",
    doctor: {
      id: "doc_003",
      doctorName: "Dr. Williams",
      specialization: "Dermatology",
    },
  },
  {
    id: "#2635",
    appointmentId: "apt_004",
    name: "Tao Chin-Ho",
    payment: "Paid",
    time: "49 min",
    type: "Collection",
    status: "Collected",
    total: "£26.00",
    doctorId: "doc_004",
    doctor: {
      id: "doc_004",
      doctorName: "Dr. Brown",
      specialization: "Orthopedics",
    },
  },
  {
    id: "#2636",
    appointmentId: "apt_005",
    name: "Shaamikh Al",
    payment: "Cash",
    time: "13 min",
    type: "Delivery",
    status: "Delivered",
    total: "£08.00",
    doctorId: "doc_005",
    doctor: {
      id: "doc_005",
      doctorName: "Dr. Davis",
      specialization: "Pediatrics",
    },
  },
  {
    id: "#2637",
    appointmentId: "apt_006",
    name: "Nike Bove",
    payment: "Cash",
    time: "00 min",
    type: "Collection",
    status: "Cancelled",
    total: "£15.00",
    doctorId: "doc_006",
    doctor: {
      id: "doc_006",
      doctorName: "Dr. Wilson",
      specialization: "Neurology",
    },
  },
  {
    id: "#2638",
    appointmentId: "apt_007",
    name: "Uruwao Hinomo",
    payment: "Cash",
    time: "15 min",
    type: "Delivery",
    status: "Delivered",
    total: "£19.00",
    doctorId: "doc_007",
    doctor: {
      id: "doc_007",
      doctorName: "Dr. Miller",
      specialization: "Psychiatry",
    },
  },
];

export default function Appointments() {
  const [activeTab, setActiveTab] = useState("All Order");
  const [dateRange, setDateRange] = useState({
    from: "2021-01-11",
    to: "2021-03-11",
  });
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleReschedule = (appointment) => {
    console.log("Opening reschedule modal for:", appointment);
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
    setOpenMenuIndex(null);
  };

  const handleRescheduleSuccess = () => {
    console.log("Appointment rescheduled successfully");
    setShowRescheduleModal(false);
    setSelectedAppointment(null);
  };

  const handleCloseModal = () => {
    setShowRescheduleModal(false);
    setSelectedAppointment(null);
  };

  const handleView = (appointment) => {
    console.log("View details for:", appointment);
    setOpenMenuIndex(null);
  };

  const handleSendReminder = (appointment) => {
    console.log("Send reminder for:", appointment);
    setOpenMenuIndex(null);
  };

  const markAsCompleted = (appointment) => {
    console.log("Add notes for:", appointment);
    setOpenMenuIndex(null);
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-b from-[#f0f4ff] to-[#ffffff]">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-indigo-700">Appointments</h2>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex gap-2 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition shadow ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white ring-2 ring-indigo-300"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 flex-col md:flex-row">
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange({ ...dateRange, from: e.target.value })
              }
              className="border rounded-lg px-1 py-2 text-sm text-gray-700 border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange({ ...dateRange, to: e.target.value })
              }
              className="border rounded-lg px-1 py-2 text-sm text-gray-700 border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Table Header for md+ */}
      <div className="hidden md:grid grid-cols-6 gap-2 text-sm font-semibold text-gray-700 px-2 md:px-4 text-center">
        <div>Patient Name</div>
        <div>Payment</div>
        <div>Time Remaining</div>
        {/* <div>Type</div> */}
        <div>Status</div>
        <div>Consultation Fees</div>
        <div>Action</div>
      </div>

      {/* Orders List */}
      <div className="space-y-2">
        {orders.map((order, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.01] transition transform p-4 grid grid-cols-1 md:grid-cols-6 gap-2 text-sm text-gray-800 items-center justify-items-center"
          >
            <div className="flex md:block justify-between md:justify-center">
              <span className="font-semibold md:hidden">Patient: </span>
              {order.name}
            </div>
            <div className="flex md:block justify-between md:justify-center">
              <span className="font-semibold md:hidden">Payment: </span>
              {order.payment}
            </div>
            <div className="flex md:block justify-between md:justify-center">
              <span className="font-semibold md:hidden">Time: </span>
              {order.time}
            </div>
            <div className="flex md:block justify-between md:justify-center">
              <span className="font-semibold md:hidden">Status: </span>
              <span
                className={`px-2 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${
                  order.status === "Delivered"
                    ? "bg-emerald-100 text-emerald-800"
                    : order.status === "Collected"
                    ? "bg-indigo-100 text-indigo-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                {order.status}
              </span>
            </div>
            <div className="flex md:block justify-between md:justify-center">
              <span className="font-semibold md:hidden">Fees: </span>
              {order.total}
            </div>
            <div className="flex md:block justify-center cursor-pointer text-lg hover:text-indigo-600 transition">
              <ActionMenu
                isOpen={openMenuIndex === idx}
                toggle={() =>
                  setOpenMenuIndex(openMenuIndex === idx ? null : idx)
                }
                appointment={order}
                onView={handleView}
                onReschedule={handleReschedule}
                cancelAppointment={handleCancelAppointment}
                markAsCompleted={markAsCompleted}
              />
            </div>
          </div>
        ))}

        {/* Reschedule Modal */}
        {showRescheduleModal && selectedAppointment && (
          <RescheduleModal
            rescheduleAppointment={selectedAppointment}
            onClose={handleCloseModal}
            onRescheduleSuccess={handleRescheduleSuccess}
          />
        )}
      </div>
    </div>
  );
}
