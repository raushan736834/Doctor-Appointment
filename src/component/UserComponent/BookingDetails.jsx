import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import defaultProfile from "../../assets/img/defaultClinicImage.jpg";

const Appointments = () => {
  const email = localStorage.getItem("email");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;

    axios
      .get(`http://localhost:8080/appointment/get/${email}`)
      .then((response) => {
        setAppointments(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      });
  }, [email]);

  if (loading) return <p>Loading appointments...</p>;

  // Helper function to check if appointment is expired
  const isAppointmentExpired = (date, time) => {
    if (!date || !time) return false;
    const appointmentDateTime = new Date(`${date} ${time}`);
    console.log(appointmentDateTime);
    const now = new Date();
    console.log(now);
    console.log(appointmentDateTime < now);
    return appointmentDateTime < now;
  };

  return (
    <>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div className="max-w-full mx-auto p-4 flex flex-col gap-4">
          {appointments.map((appointment) => {
            const expired = isAppointmentExpired(appointment.date, appointment.time);
            return (
              <div
                key={appointment.id}
                className="bg-white rounded-lg shadow-md p-4 grid grid-cols-1 md:grid-cols-8 gap-3 items-center"
              >
                <div className="flex justify-center md:col-span-1">
                  <img
                    src={appointment?.doctorProfileLink || defaultProfile}
                    className="w-20 h-20 rounded-md object-cover"
                    alt="Doctor Profile"
                  />
                </div>

                <div className="md:col-span-2 text-center md:text-left">
                  <h3 className="font-semibold text-gray-800 text-md">
                    {appointment?.doctorName}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Consultation Fees:{" "}
                    <span className="font-semibold text-gray-800">
                      ₹{appointment?.consultation_fees}
                    </span>
                  </p>
                </div>

                <div className="md:col-span-1 text-center md:text-left">
                  <h3 className="font-semibold text-gray-800 text-md">
                    {appointment?.specialization}
                  </h3>
                </div>

                <div className="md:col-span-2 text-center md:text-left">
                  {appointment.date && (
                    <p className="text-gray-600 text-base font-semibold mt-1">
                      Date: {appointment.date}
                    </p>
                  )}
                  <p className="font-semibold text-gray-600 text-base">
                    Time: {appointment?.time}
                  </p>
                </div>

                <div className="md:col-span-1 text-center">
                  {expired ? (
                    <p className="text-red-600 font-bold">Expired</p>
                  ) : (
                    <p className="text-green-600 font-bold">Upcoming</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Appointments;
