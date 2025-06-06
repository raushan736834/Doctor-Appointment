import React, { useEffect, useState } from "react";
import defaultProfile from "../../assets/img/defaultClinicImage.jpg";
import PopUp from "../Common/PopUp";
import useAxios from "@/hooks/useAxios";
import useAuth from "@/hooks/useAuth";

const Appointments = () => {
  const email = localStorage.getItem("email");
  const [appointments, setAppointments] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [appointmentId, setappointmentId] = useState();
  const { fetchData } = useAxios();
  const { setIsLoading } = useAuth();

  useEffect(() => {
    if (!email) return;
    setIsLoading(true);
    fetchData({
      url: `appointment/booking/${email}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        setAppointments(response.data.reverse());
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
        setIsLoading(false);
      });
  }, [email]);
  
  console.log(appointments)
  const handleCancelAppointment = async () => {
    const response = await fetchData({
      url: `appointment/cancel-appointment`,
      method: "PUT",
      data : {
        status : true,
        cancelledBy : "user",
        appointmentId : appointmentId
      },
    });
    console.log(response);
    setShowPopup(false);
    // Refresh appointments after cancel to show only active appointments
    setIsLoading(true);
    fetchData({
      url: `appointment/booking/${email}`,
    })
      .then((response) => {
        setAppointments(response.data.reverse());
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
        setIsLoading(false);
      });
  };

  const handleRescheduleAppointment = () => {
    setShowPopup(false);
  };

  const handleClick = (data) => {
    setappointmentId(data.appointmentId);
    setShowPopup(true);
  };
  console.log(appointmentId)

  // --- Rendered Components ---
  function AppointmentCard({ appointment, onCancel }) {
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
          <p
            className={
              "text-green-600 font-bold"
            }
          >
            Upcoming
          </p>
        </div>
        <div className="md:col-span-1 text-center">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200 ease-in-out"
            onClick={() => onCancel(appointment)}
          >
            Cancel Appointment
          </button>
        </div>
      </div>
    );
  }

  function AppointmentList({ appointments, onCancel }) {
    return (
      <div className="max-w-full mx-auto p-4 flex flex-col gap-4">
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            onCancel={onCancel}
          />
        ))}
      </div>
    );
  }

  // --- Main Render ---
  return (
    <>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <>
          <AppointmentList
            appointments={appointments}
            onCancel={handleClick}
          />
          {showPopup && (
            <PopUp
              message={"Are you sure!"}
              onClose={() => setShowPopup(false)}
              show={showPopup}
              title={"Cancel Your Appointment"}
              autoDismiss={false}
              handleCancelAppointment={handleCancelAppointment}
              handleRescheduleAppointment={handleRescheduleAppointment}
            />
          )}
        </>
      )}
    </>
  );
};

export default Appointments;
