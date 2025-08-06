import React, { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import ActionMenu from "./ActionMenu";
import RescheduleModal from "./RescheduleModal";
import CancelReasonModal from "./CancelReasonModal";
import { cancelAppointmentByDoctor } from "../../constants/Method";
import useAuth from "../../hooks/useAuth";
import { CalendarX, ChevronLeft, ChevronRight, ListFilter } from "lucide-react";
import FilterDateComponent from "./FilterDateComponent";
import api from "../../hooks/useAxios";
import OverlayLoader from "../Common/Loader";
import { AppointmentStatus } from "../../constants/slots";

const tabs = ["Appointment", "Completed", "Rescheduled", "Cancelled"];

const ITEMS_PER_PAGE = 5;

export default function Appointments() {
  const today = new Date().toISOString().split("T")[0];
  const [activeTab, setActiveTab] = useState("Appointment");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: today,
    to: today,
  });
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const doctorId = localStorage.getItem("doctorId");
  const [todayAppointments, setTodayAppointments] = useState([]);
  const { setIsLoading, isLoading } = useAuth();
  const toast = useToast();
  const [pageSize] = useState(ITEMS_PER_PAGE);
  const [paginationInfo, setPaginationInfo] = useState({
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: ITEMS_PER_PAGE,
    first: true,
    last: true,
  });
  const [currentPage, setCurrentPage] = useState(0);

  const getStatusesForTab = (tab) => {
    switch (tab) {
      case "Appointment":
        return [AppointmentStatus.BOOKED, AppointmentStatus.RESCHEDULED];
      case "Rescheduled":
        return [AppointmentStatus.RESCHEDULED];
      case "Completed":
        return [AppointmentStatus.COMPLETED];
      case "Cancelled":
        return [AppointmentStatus.CANCELLED];
      default:
        return [AppointmentStatus.BOOKED, AppointmentStatus.RESCHEDULED];
    }
  };

  const fetchTodayAppointment = async (
    currentPage = 0,
    size = ITEMS_PER_PAGE,
    activeTab
  ) => {
    const statuses = getStatusesForTab(activeTab);
    const params = new URLSearchParams();
    params.append("startDate", dateRange.from);
    params.append("endDate", dateRange.to);
    params.append("page", currentPage);
    params.append("size", size);
    statuses.forEach((status) => params.append("statuses", status));
    setIsLoading(true);
    try {
      const response = await api.get(
        `/appointment/doctorAppointment/${doctorId}?${params.toString()}`
      );

      const { content, totalElements, totalPages, number, first, last } =
        response.data;

      setTodayAppointments(content || []);
      setPaginationInfo({
        totalElements: totalElements || 0,
        totalPages: totalPages || 0,
        number: number || 0,
        size: size,
        first: first ?? true,
        last: last ?? true,
      });
    } catch (error) {
      console.error("Error fetching today's appointments:", error);
      setTodayAppointments([]);
      setPaginationInfo({
        totalElements: 0,
        totalPages: 0,
        number: 0,
        size: ITEMS_PER_PAGE,
        first: true,
        last: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId) {
      fetchTodayAppointment(0, pageSize, activeTab);
    }
  }, [doctorId, dateRange, activeTab]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchTodayAppointment(newPage, pageSize, activeTab);
  };

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
    // Refresh appointments list here if needed
  };

  const handleCloseRescheduleModal = () => {
    setShowRescheduleModal(false);
    setSelectedAppointment(null);
  };

  const handleCancelAppointment = (appointment) => {
    console.log("Opening cancel modal for:", appointment);
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
    setOpenMenuIndex(null);
  };

  const handleConfirmCancel = async (cancelReason) => {
    if (!selectedAppointment) return;

    setIsCancelling(true);

    const success = await cancelAppointmentByDoctor(
      selectedAppointment,
      cancelReason,
      toast,
      setIsLoading,
      (appointment, reason) => {
        // Success callback
        console.log(`Appointment cancelled successfully. Reason: ${reason}`);

        // Update the appointments list to reflect the cancellation
        setTodayAppointments((prevList) =>
          prevList.map((appt) =>
            appt.appointmentId === appointment.appointmentId
              ? { ...appt, status: "CANCELLED", reason: reason }
              : appt
          )
        );

        setShowCancelModal(false);
        setSelectedAppointment(null);
      },
      (error, appointment) => {
        // Error callback
        console.error("Cancellation failed:", error);
        setShowCancelModal(false);
        setSelectedAppointment(null);
      }
    );

    setIsCancelling(false);
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setSelectedAppointment(null);
  };

  const handleView = (appointment) => {
    console.log("View details for:", appointment);
    setOpenMenuIndex(null);
  };

  const markAsCompleted = (appointment) => {
    console.log("Mark as completed for:", appointment);
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
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(0);
                }}
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

          <div className="relative inline-block">
            <button
              onClick={() => setShowFilterModal(!showFilterModal)}
              className="flex gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white ring-2 ring-indigo-300 
    px-3 py-2 rounded-full text-sm font-medium transition shadow items-center hover:opacity-90 cursor-pointer"
            >
              <ListFilter />
              Filter By Date
            </button>

            {showFilterModal && (
              <div className="absolute right-0 mt-2 z-50">
                <FilterDateComponent
                  dateRange={dateRange}
                  onClose={() => setShowFilterModal(false)}
                  onApply={(range) => {
                    setDateRange(range);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {!isLoading && paginationInfo.totalElements > 0 && (
        <div className="hidden md:grid grid-cols-7 gap-2 text-sm font-semibold text-gray-700 px-2 md:px-4 text-center">
          <div>Patient Name</div>
          <div>Payment</div>
          <div>Date</div>
          <div>Time Remaining</div>
          <div>Status</div>
          <div>Consultation Fees</div>
          <div>Action</div>
        </div>
      )}

      <div className="space-y-2">
        {/* loader till the appointment is loading */}
        {isLoading && <OverlayLoader />}

        {/* If no appointment fo the range */}
        {!isLoading && paginationInfo.totalElements === 0 && (
          <div className="p-12 text-center">
            <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <CalendarX className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No Appointments Today
            </h3>
            <p className="text-gray-500 mb-4">
              You don't have any appointments scheduled for today. Enjoy your
              day!
            </p>
            {/* <div className="flex justify-center gap-4">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                View All Appointments
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Schedule New
              </button>
            </div> */}
          </div>
        )}

        {!isLoading &&
          paginationInfo.totalElements > 0 &&
          todayAppointments
            .filter((appt) => {
              switch (activeTab) {
                case "Appointment":
                  return (
                    appt?.status === "BOOKED" || appt?.status === "RESCHEDULED"
                  );
                case "Completed":
                  return appt?.status === "COMPLETED";
                case "Rescheduled":
                  return appt?.status === "RESCHEDULED";
                case "Cancelled":
                  return appt?.status === "CANCELLED";
                default:
                  return true;
              }
            })
            .map((appt, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.01] transition transform p-4 grid grid-cols-1 md:grid-cols-7 gap-2 text-sm text-gray-800 items-center justify-items-center"
              >
                <div className="flex md:block justify-between md:justify-center">
                  <span className="font-semibold md:hidden">Patient: </span>
                  {appt?.fullName}
                </div>
                <div className="flex md:block justify-between md:justify-center">
                  <span className="font-semibold md:hidden">Payment: </span>
                  {appt?.selectedPayment}
                </div>
                <div className="flex md:block justify-between md:justify-center">
                  <span className="font-semibold md:hidden">Time: </span>
                  {appt?.date}
                </div>
                <div className="flex md:block justify-between md:justify-center">
                  <span className="font-semibold md:hidden">Time: </span>
                  {appt?.time}
                </div>
                <div className="flex md:block justify-between md:justify-center">
                  <span className="font-semibold md:hidden">Status: </span>
                  <span
                    className={`px-2 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${
                      appt?.status === "BOOKED"
                        ? "bg-emerald-100 text-emerald-800"
                        : appt?.status === "COMPLETED"
                        ? "bg-indigo-100 text-indigo-800"
                        : appt?.status === "RESCHEDULED"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {appt?.status}
                  </span>
                </div>
                <div className="flex md:block justify-between md:justify-center">
                  <span className="font-semibold md:hidden">Fees: </span>
                  {appt?.doctor?.consultationFees}
                </div>
                <div className="flex md:block justify-center cursor-pointer text-lg hover:text-indigo-600 transition">
                  <ActionMenu
                    isOpen={openMenuIndex === idx}
                    toggle={() =>
                      setOpenMenuIndex(openMenuIndex === idx ? null : idx)
                    }
                    appointment={appt}
                    onView={handleView}
                    onReschedule={handleReschedule}
                    onCancelAppointment={handleCancelAppointment}
                    markAsCompleted={markAsCompleted}
                  />
                </div>
              </div>
            ))}
      </div>

      {/* Pagination Code */}
      {paginationInfo.totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{currentPage * pageSize + 1}</span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(
                  (currentPage + 1) * pageSize,
                  paginationInfo.totalElements
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium">
                {paginationInfo.totalElements}
              </span>{" "}
              appointments
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={paginationInfo.first}
                onClick={() => handlePageChange(currentPage - 1)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  paginationInfo.first
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.min(5, paginationInfo.totalPages) },
                  (_, i) => {
                    const pageNum = i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${
                          currentPage === pageNum
                            ? "bg-indigo-600 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  }
                )}
              </div>
              <button
                disabled={paginationInfo.last}
                onClick={() => handlePageChange(currentPage + 1)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  paginationInfo.last
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                }`}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <RescheduleModal
          selectedAppointment={selectedAppointment}
          onClose={handleCloseRescheduleModal}
          onRescheduleSuccess={handleRescheduleSuccess}
        />
      )}

      {/* Cancel Reason Modal */}
      {showCancelModal && selectedAppointment && (
        <CancelReasonModal
          isOpen={showCancelModal}
          onClose={handleCloseCancelModal}
          onConfirm={handleConfirmCancel}
          appointment={selectedAppointment}
          isLoading={isCancelling}
        />
      )}
    </div>
  );
}
