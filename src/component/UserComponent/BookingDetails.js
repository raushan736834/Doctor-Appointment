import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import defaultProfile from "../../assets/img/defaultClinicImage.jpg";

const Appointments = () => {
  const email = localStorage.getItem("email");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return; // Ensure user is logged in before fetching

    axios
      .get(`http://localhost:8080/appointment/get/${email}`)
      .then((response) => {
        setAppointments(response.data);
        console.log(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      });
  }, [email]);

  if (loading) return <p>Loading appointments...</p>;

  return (
    <>
      {/* <h2>Your Booked Appointments</h2> */}
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div className="max-w-full mx-auto p-4 rounded-lg">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-lg border-b-[1px] p-[0.5] m-1 flex items-center">
              <div></div>
              <div></div>
              <img
                src={appointment?.doctorProfileLink || defaultProfile}
                className="w-20 h-20 rounded-md mr-4"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">
                  {appointment?.doctorName}
                </h3>
                {appointment?.details && (
                  <p className="text-sm text-gray-600">
                    {appointment?.details}
                  </p>
                )}
                <p className="text-gray-700 font-medium">
                  {appointment?.consultation_fees}
                </p>
                <p
                  className={`text-sm font-semibold mt-1 ${
                    appointment?.status?.includes("Delivered")
                      ? "text-green-600"
                      : "text-orange-600"
                  }`}
                >
                  ● {appointment.status}{" "}
                  {appointment.date && `on ${appointment.date}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Appointments;
