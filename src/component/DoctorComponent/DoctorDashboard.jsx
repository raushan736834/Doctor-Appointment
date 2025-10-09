import { useEffect, useState } from "react";
import DoctorDashboardStats from "./DoctorDashboardStats";
import { Link } from "react-router-dom";
import NotificationBell from "../NotificationComponent/NotificationBell";
import { useAuth } from "../GlobalComponent/AuthProvider";
import { CalendarX, ChevronLeft, ChevronRight } from "lucide-react";
import OverlayLoader from "../Common/Loader";
import { useApiService } from "../../hooks/useAuthWithAxios";

const ITEMS_PER_PAGE = 5;

const DoctorDashboard = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(ITEMS_PER_PAGE);
  const { setIsLoading, isLoading } = useAuth();
  const name = localStorage.getItem("name")?.split(" ")[0];
  const doctorId = localStorage.getItem("doctorId");
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [totalAppointmentsLength, setTotalAppointmentsLength] = useState(0);
  const [paginationInfo, setPaginationInfo] = useState({
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: ITEMS_PER_PAGE,
    first: true,
    last: true,
  });
  const api = useApiService();

  const fetchAllAppointment = async () => {
    try {
      const response = await api.get(
        `/appointment/doctorAllAppointment/${doctorId}`
      );
      setTotalAppointmentsLength(response.data || 0);
    } catch (error) {
      console.error("Error fetching total appointments:", error);
      setTotalAppointmentsLength(0);
    }
  };

  const fetchTodayAppointment = async (
    currentPage = 0,
    size = ITEMS_PER_PAGE
  ) => {
    setIsLoading(true);

    try {
      const response = await api.get(
        `/appointment/doctorAppointment/${doctorId}?page=${currentPage}&size=${size}`
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
      fetchAllAppointment();
      fetchTodayAppointment(0, pageSize);
    }
  }, [doctorId, pageSize]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchTodayAppointment(newPage, pageSize);
  };

  return (
    <div className="p-4 space-y-6 bg-gradient-to-b from-[#f0f4ff] to-[#ffffff] min-h-full">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-2 flex justify-between">
        <div className="">
          <h2 className="text-xl font-semibold text-indigo-700">
            Good Morning, Dr. {name}!
          </h2>
          <p className="text-sm text-gray-500">
            You have {paginationInfo?.totalElements} patients waiting today.
          </p>
        </div>
        <Link to={"/doctor/notifications"}>
          <div>
            <NotificationBell />
          </div>
        </Link>
      </div>

      {/* Dashboard Stats */}
      <DoctorDashboardStats
        totalBookings={totalAppointmentsLength}
        todayBookings={todayAppointments.length}
      />

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
        {!isLoading && paginationInfo.totalElements > 0 && (
          <div className="hidden md:grid grid-cols-5 gap-4 px-4 py-2 text-sm font-semibold text-black text-center">
            <div>Date</div>
            <div>Time</div>
            <div>Patient</div>
            <div>Payment</div>
            <div>Status</div>
          </div>
        )}
        <div className="space-y-3">
          {/* loader till the appointment is loading */}
          {isLoading && <OverlayLoader />}

          {/* if no appointment for today */}
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
              <div className="flex justify-center gap-4">
                <Link
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  to={"/doctor/appointments"}
                >
                  View All Appointments
                </Link>
                <Link className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Schedule New
                </Link>
              </div>
            </div>
          )}

          {/* if appointment found for today */}
          {!isLoading &&
            paginationInfo.totalElements > 0 &&
            todayAppointments.map((appt, index) => (
              <div
                key={appt?.appointmentId || index}
                className="bg-gray-100 rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.01] transition transform p-4 grid grid-cols-1 md:grid-cols-5 gap-2 text-sm text-gray-800 items-center text-center"
              >
                <div className="font-medium">
                  <span className="md:hidden font-semibold">Date: </span>
                  {appt?.date}
                </div>
                <div>
                  <span className="md:hidden font-semibold">Time: </span>
                  {appt?.time}
                </div>
                <div>
                  <span className="md:hidden font-semibold">Patient: </span>
                  {appt?.fullName}
                </div>
                <div className="text-purple-600 font-medium">
                  <span className="md:hidden font-semibold">Reason: </span>
                  {appt?.selectedPayment}
                </div>
                <div>
                  <span className="md:hidden font-semibold">Status: </span>
                  <span
                    className={`px-2 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${
                      appt?.status === "BOOKED"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {appt?.status}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Pagination */}
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
    </div>
  );
};

export default DoctorDashboard;
