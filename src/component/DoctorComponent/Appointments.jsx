import { useState } from "react";
import AppointmentForm from "../UserComponent/AppointmentForm";

const appointmentsData = [
  { id: 1, patient: "John Doe", date: "April 25, 2024", time: "9:00 AM" },
  { id: 2, patient: "Jane Smith", date: "April 25, 2024", time: "10:30 AM" },
  {
    id: 3,
    patient: "Michael Johnson",
    date: "April 26, 2024",
    time: "2:00 PM",
  },
  { id: 4, patient: "Emily Davis", date: "April 27, 2024", time: "11:15 AM" },
];

export default function Appointments() {
  const [appointments, setAppointments] = useState(appointmentsData);
  const [selectedId, setSelectedId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [currentAppointment, setCurrentAppointments] = useState([]);
  const [appointmentId, setappointmentId] = useState();
  const [rescheduleAppointment, setRescheduleAppointment] = useState(null);

  const handleReschedule = (id) => {
    setSelectedId((prevId) => (prevId === id ? null : id));
  };

  const handleConfirm = () => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === selectedId
          ? {
              ...appt,
              date: newDate ? formatDate(newDate) : appt.date,
              time: newTime ? formatTime(newTime) : appt.time,
            }
          : appt
      )
    );
    setNewDate("");
    setNewTime("");
    setSelectedId(null);
  };

  const handleRescheduleApi = async ({ appointmentId, newDate, newTime }) => {
    setIsLoading(true);
    try {
      await fetchData({
        url: `appointment/reschedule-appointment`,
        method: "PUT",
        data: {
          appointmentId: String(appointmentId),
          newDate,
          newTime,
        },
      });
      setRescheduleAppointment(null);
      fetchAppointments();
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      setIsLoading(false);
    }
  };

  const handleRescheduleAppointment = (currentAppointment) => {
    setRescheduleAppointment(currentAppointment);
    setShowPopup(false);
  };

  const handleClick = (data) => {
    setappointmentId(data.appointmentId);
    setShowPopup(true);
  };

  const formatDate = (str) => {
    const [year, month, day] = str.split("-");
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Appointments</h2>

      {/* Table header */}
      <div className="grid grid-cols-4 bg-gray-100 font-semibold p-3 rounded-t">
        <div>Patient</div>
        <div>Date</div>
        <div>Time</div>
        <div>Actions</div>
      </div>

      {/* Table rows */}
      <div className="divide-y border border-gray-200 rounded-b">
        {appointments.map(({ id, patient, date, time }) => (
          <div
            key={id}
            className="grid grid-cols-4 items-center p-3 hover:bg-gray-50"
          >
            <div>{patient}</div>
            <div>{date}</div>
            <div>{time}</div>
            <div>
              <button
                onClick={() => onReschedule(currentAppointment)}
                className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
              >
                Reschedule
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reschedule Form */}
      {rescheduleAppointment && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <AppointmentForm
                  specialization={
                    rescheduleAppointment.doctor?.specialization ||
                    rescheduleAppointment.specialization
                  }
                  isReschedule={true}
                  appointmentId={rescheduleAppointment.appointmentId}
                  onReschedule={handleRescheduleApi}
                  onClose={() => setRescheduleAppointment(null)}
                />
                <button
                  className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                  onClick={() => setRescheduleAppointment(null)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
    </div>
  );
}
