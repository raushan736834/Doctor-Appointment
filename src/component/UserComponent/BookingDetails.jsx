import React, { useEffect, useState } from "react";
import defaultProfile from "../../assets/img/defaultClinicImage.jpg";
import PopUp from "../Common/PopUp";
import useAuth from "../../hooks/useAuth";
import { useToast } from "@chakra-ui/react";
import OverlayLoader from "../Common/Loader";
import api from "../../hooks/useAxios";
import RescheduleModal from "../DoctorComponent/RescheduleModal";

const BookingDetails = () => {
  const email = localStorage.getItem("email");
  const [showPopup, setShowPopup] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [rescheduleAppointment, setRescheduleAppointment] = useState(null);
  const [cancelAppointment, setCancelAppointment] = useState(null);
  const { setIsLoading, isLoading } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (!email) return;
    fetchAppointments();
  }, [email]);

  const fetchAppointments = () => {
    if (!email) return;
    setIsLoading(true);
    api
      .get(`appointment/booking/${email}`)
      .then((response) => {
        setAppointments(response.data.reverse());
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
        setIsLoading(false);
      });
  };

  const handleCancelAppointment = async (appointment) => {
    try {
      if (appointment.selectedPayment === "Online Payment") {
        const paymentId = appointment.payment.paymentId;
        const amount = appointment.doctor.consultationFees;
        const data = {
          payId: paymentId,
          amount: amount,
        };
        const razorpayResponse = await api.post("api/payment/refund", data);
        if (!razorpayResponse || razorpayResponse.status !== 200) {
          throw new Error("Razorpay refund failed");
        }
        console.log("Razorpay refund response:", razorpayResponse.data);
      }

      const body = {
        status: true,
        cancelledBy: "user",
        appointmentId: appointment.appointmentId,
      };
      const response = await api.put(`appointment/cancel-appointment`, body);
      console.log(response);
      setShowPopup(false);
      setIsLoading(true);

      if (response.status === 200) {
        toast({
          position: "top-center",
          title: "Appointment Sucessfully Cancelled!",
          description: "Happy Booking",
          status: "success",
          duration: 1500,
          isClosable: true,
          containerStyle: { marginTop: 20, marginRight: 5 },
        });
      } else {
        toast({
          position: "top-center",
          title: "Oops! Appointment Cancelling Fail",
          description: "Try Again",
          status: "error",
          duration: 1500,
          isClosable: true,
          containerStyle: { marginTop: 20, marginRight: 5 },
        });
      }

      fetchAppointments();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      setIsLoading(false);
      setShowPopup(false);
    }
  };

  const handleRescheduleAppointment = (appointment) => {
    setRescheduleAppointment(appointment);
    setShowPopup(false);
  };

  const handleRescheduleSuccess = () => {
    fetchAppointments();
  };

  const handleClick = (appointment) => {
    setCancelAppointment(appointment);
    setShowPopup(true);
  };

  const goHome = () => {
    window.location.href = "/";
  };

  function AppointmentCard({ appointment, onCancel, onReschedule }) {
    if (appointments == null) return "No Booking Found";
    return (
      <div
        key={appointment.id}
        className="bg-white rounded-lg shadow-md p-4 grid grid-cols-1 md:grid-cols-6 gap-3 items-center"
      >
        <div className="flex justify-center ml-2 md:col-span-1">
          <img
            src={appointment?.doctor?.profilePhoto || defaultProfile}
            className="w-20 h-20 rounded-md object-cover"
            alt="Doctor Profile"
          />
        </div>
        <div className="md:col-span-1 text-center md:text-left">
          <h3 className="font-semibold text-gray-800 text-md">
            {appointment?.doctor?.doctorName}
          </h3>
          <p className="text-gray-600 mt-1">
            Consultation Fees:{" "}
            <span className="font-semibold text-gray-800">
              ₹{appointment?.doctor?.consultationFees}
            </span>
          </p>
        </div>
        <div className="md:col-span-1 text-center md:text-left">
          <h3 className="font-semibold text-gray-800 text-md">
            {appointment?.doctor?.specialization}
          </h3>
        </div>
        <div className="md:col-span-1 text-center md:text-left">
          {appointment?.date && (
            <p className="text-gray-600 text-base font-semibold mt-1">
              Date: {appointment?.date}
            </p>
          )}
          <p className="font-semibold text-gray-600 text-base">
            Time: {appointment?.time}
          </p>
        </div>
        <div className="md:col-span-1 text-center">
          <p className={"text-green-600 font-bold"}>Upcoming</p>
        </div>
        <div className="md:col-span-1 text-center flex flex-col gap-2">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200 ease-in-out"
            onClick={() => onCancel(appointment)}
          >
            Cancel Appointment
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 ease-in-out"
            onClick={() => onReschedule(appointment)}
          >
            Reschedule
          </button>
        </div>
      </div>
    );
  }

  function AppointmentList({ appointments, onCancel, onReschedule }) {
    return (
      <div className="max-w-full mx-auto p-4 flex flex-col gap-4">
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            onCancel={onCancel}
            onReschedule={onReschedule}
          />
        ))}
      </div>
    );
  }

  // --- Main Render ---
  if (isLoading) return <OverlayLoader />;
  return (
    <>
      {appointments.length === 0 ? (
        <div className="flex min-h-[calc(100vh-140px)] justify-center items-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
          <div className="text-center max-w-md w-full">
            {/* Illustration */}
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-6xl">📅</span>
            </div>

            {/* Main content card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                No Appointments Booked!
              </h2>

              <p className="text-gray-600 mb-8 leading-relaxed">
                Your calendar is empty. Ready to schedule your first appointment
                and get started on your journey?
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
                  onClick={() => (window.location.href = "/book-appointment")}
                  className="w-full px-8 py-4 bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-50 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-3"
                >
                  <span className="text-xl">📅</span>
                  Book New Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <AppointmentList
            appointments={appointments}
            onCancel={handleClick}
            onReschedule={handleRescheduleAppointment}
          />
          {showPopup && (
            <PopUp
              message={"Are you sure!"}
              onClose={() => setShowPopup(false)}
              show={showPopup}
              title={"Cancel Your Appointment"}
              autoDismiss={false}
              handleCancelAppointment={() =>
                handleCancelAppointment(cancelAppointment)
              }
              handleRescheduleAppointment={() => setShowPopup(false)}
            />
          )}
          {rescheduleAppointment && (
            <RescheduleModal
              rescheduleAppointment={rescheduleAppointment}
              onClose={() => setRescheduleAppointment(null)}
              onRescheduleSuccess={handleRescheduleSuccess}
            />
          )}
        </>
      )}
    </>
  );
};

export default BookingDetails;