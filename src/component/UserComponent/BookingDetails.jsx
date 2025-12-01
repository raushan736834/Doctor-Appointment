import React, { useState, useEffect } from "react";
import { Calendar, Stethoscope, X, Edit3, MapPin, Star } from "lucide-react";
import { useApiService, useAuthWithAxios } from "../../hooks/useAuthWithAxios";
import RescheduleModal from "../DoctorComponent/RescheduleModal";
import { cancelAppointment } from "../../constants/Method";
import { useToast } from "@chakra-ui/react";
import OverlayLoader from "../Common/Loader";
import { useNavigate } from "react-router-dom";
import defaultImage from "../../assets/img/defaultClinicImage.jpg";

const BookedAppointments = () => {
  const { user } = useAuthWithAxios();
  const email = user?.email;
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const toast = useToast();
  const api = useApiService();
  const navigate = useNavigate();

  const getStatusStyle = (status) => {
    switch (status) {
      case "BOOKED":
        return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25";
      case "RESCHEDULED":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25";
      case "CANCELLED":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25";
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg shadow-gray-500/25";
    }
  };

  const goHome = () => {
    navigate("/");
  };

  const handleConfirmCancel = async () => {
    console.log(selectedAppointment);
    if (!selectedAppointment) return;

    await cancelAppointment(
      selectedAppointment,
      toast,
      setIsLoading,
      api,
      () => {
        // Success callback
        fetchAppointments(); 
        setSelectedAppointment(null);
      },
      (error) => {
        // Error callback
        console.error("Cancellation failed:", error);
        setSelectedAppointment(null);
      }
    );
    setShowCancelModal(false);
  };

  const handleCancel = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
  };

  const handleRescheduleSuccess = (updatedAppointment) => {
    setShowRescheduleModal(false);
    
    // Update appointments state directly without API call
    if (updatedAppointment) {
      setAppointments((prevAppointments) =>
        prevAppointments.map((apt) =>
          apt.appointmentId === updatedAppointment.appointmentId
            ? updatedAppointment
            : apt
        )
      );
    } else {
      // Fallback: fetch appointments if updated appointment is not provided
      fetchAppointments();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysUntil = (dateString) => {
    const today = new Date();
    const appointmentDate = new Date(dateString);
    const diffTime = appointmentDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays > 0) return `In ${diffDays} days`;
    return "Past";
  };

  useEffect(() => {
    if (!email) return;
    fetchAppointments();
  }, [email]);

  const fetchAppointments = () => {
    if (!email) return;
    setIsLoading(true);
    api
      .get(`appointment/bookingUser/${email}`)
      .then((response) => {
        const filteredAppointments = response.data
          .filter(
            (appointment) =>
              appointment.status === "BOOKED" ||
              appointment.status === "RESCHEDULED"
          )
          .reverse();
        setAppointments(filteredAppointments);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Show overlay loader if isLoading is true */}
      {isLoading && <OverlayLoader />}
      
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative backdrop-blur-xl bg-white/70 border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800
                 to-purple-800 bg-clip-text text-transparent mb-2 leading-[1.2] pb-2"
                >
                  My Appointments
                </h1>
                <p className="text-lg text-gray-600">
                  Manage your healthcare journey with ease
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">
                    {appointments.length}
                  </div>
                  <div className="text-sm text-gray-500">
                    Total Appointments
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Upcoming",
              count: appointments.filter((a) => a.status === "BOOKED").length,
              color: "bg-emerald-500",
            },
            {
              label: "Rescheduled",
              count: appointments.filter((a) => a.status === "RESCHEDULED")
                .length,
              color: "bg-blue-500",
            },
            { label: "This Week", count: 2, color: "bg-purple-500" },
            {
              label: "Total",
              count: appointments.length,
              color: "bg-orange-500",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/60 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-lg"
            >
              <div className={`w-3 h-3 ${stat.color} rounded-full mb-2`}></div>
              <div className="text-2xl font-bold text-gray-800">
                {stat.count}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="group relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 hover:scale-[1.02] hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Content */}
              <div className="relative p-6">
                {/* Header with Status */}
                <div className="flex items-start justify-between mb-6">
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                      appointment.status
                    )}`}
                  >
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">
                      {/* #{appointment.appointmentId} */}
                    </div>
                    <div className="text-sm font-medium text-gray-700">
                      {getDaysUntil(appointment.date)}
                    </div>
                  </div>
                </div>

                {/* Doctor Profile */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg">
                      <img
                        src={defaultImage || appointment?.doctor?.profilePhoto}
                        alt={appointment?.doctor?.doctorName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-800 truncate">
                      {appointment?.doctor?.firstName +
                        " " +
                        appointment?.doctor?.lastName}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Stethoscope className="w-4 h-4" />
                      <span>
                        {appointment.doctor?.professional?.specialization}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {/* {appointment?.doctor?.rating} */}4.2
                      </span>
                      <span className="text-xs text-gray-500">
                        ({appointment?.doctor?.professional?.yearOfExp}+ years)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="space-y-3 py-8">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-800">
                          {formatDate(appointment.date)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {appointment.time}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-800">
                        ₹{appointment.doctor?.professional?.consultationFees}
                      </div>
                      <div className="text-xs text-gray-500">
                        {appointment.selectedPayment}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {appointment?.doctor?.clinicInfos?.clinicAddress}
                      </span>
                    </div>
                    <div className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                      {/* {appointment.type} */}
                      Clinic Visit
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleReschedule(appointment)}
                    disabled={appointment.status === "CANCELLED"}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 
                    text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Reschedule</span>
                  </button>
                  <button
                    onClick={() => handleCancel(appointment)}
                    disabled={appointment.status === "CANCELLED"}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {appointments.length === 0 && (
          <div className="flex min-h-[calc(100vh-140px)] justify-center items-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
            <div className="text-center max-w-md w-full">
              {/* Illustration */}
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-6xl">📅</span>
              </div>

              {/* Main content card */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  No Appointments Booked!
                </h2>

                <p className="text-gray-600 mb-8 leading-relaxed">
                  Your calendar is empty. Ready to schedule your first
                  appointment and get started on your journey?
                </p>

                {/* Action buttons */}
                <div className="space-y-4">
                  <button
                    onClick={goHome}
                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-3"
                  >
                    <span className="text-xl">🏠</span>
                    Back to Home
                  </button>

                  <button
                    onClick={goHome}
                    className="w-full px-8 py-4 bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-50 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-3"
                  >
                    <span className="text-xl">📅</span>
                    Book New Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modern Cancel Modal with Glassmorphism */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl max-w-md w-full p-4 shadow-2xl border border-white/20">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <X className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Cancel Appointment
              </h3>
              <p className="text-gray-600">
                Are you sure you want to cancel your appointment with{" "}
                {selectedAppointment?.doctor.doctorName}
                <span className="font-semibold text-gray-800">
                  {selectedAppointment?.doctor?.firstName}
                </span>
                ?
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-800">
                <strong>Note:</strong> Cancellation less than 24 hours before
                the appointment may incur charges.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 sm:px-6 px-4 py-3 border-2 bg-white border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl 
                font-medium shadow-lg hover:shadow-red-500/40 transition-all"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern Reschedule Modal */}
      {showRescheduleModal && (
        <RescheduleModal
          selectedAppointment={selectedAppointment}
          onClose={() => {
            setShowRescheduleModal(false);
            setSelectedAppointment(null);
          }}
          onRescheduleSuccess={handleRescheduleSuccess}
        />
      )}
    </div>
  );
};

export default BookedAppointments;
