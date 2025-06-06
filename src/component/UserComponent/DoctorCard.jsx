import React, { useState, useMemo, useCallback } from "react";
import defaultDoctorImage from "../../assets/img/defaultClinicImage.jpg";
import AppointmentForm from "./AppointmentForm";
import { allSlots } from "../../constants/slots";
import useAxios from "../../hooks/useAxios";

function DoctorCard({
  id,
  doctorName,
  specialization,
  consultationFees,
  experienceYears,
  profilePhoto,
  locality,
  clinicName,
  city,
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const today = useMemo(() => new Date(), []);
  const allPossibleSlots = useMemo(() => Object.values(allSlots).flat(), []);
  const photoUrl = profilePhoto || defaultDoctorImage;
  const { fetchData } = useAxios();

  // Manual fetch function for booked slots
  const fetchBookedSlots = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchData({
        url: "/appointment/booked-slots",
        method: "post",
        data: {
          date: today.toISOString().slice(0, 10),
          doctor: { id },
        },
      });
      setBookedSlots((response.data || []).map((slot) => slot.trim()));
    } catch (err) {
      setError("Failed to fetch availability");
    } finally {
      setLoading(false);
    }
  }, [fetchData, id, today]);

  // Only show slots that are not booked
  const availableSlots = useMemo(
    () => allPossibleSlots.filter((slot) => !bookedSlots.includes(slot)),
    [allPossibleSlots, bookedSlots]
  );
  const isAvailableToday = availableSlots.length > 0;

  const handleClick = async () => {
    if (selectedId === id) {
      setSelectedId(null);
      setSelectedSpecialization(null);
      setBookedSlots([]);
    } else {
      await fetchBookedSlots();
      setSelectedId(id);
      setSelectedSpecialization(specialization);
      localStorage.setItem("specialization", specialization);
    }
  };

  return (
    <div className="bg-white w-full rounded-xl shadow-md p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:justify-between w-full">
        {/* Profile & Info */}
        <div className="flex flex-col lg:flex-row w-full">
          <div className="flex justify-center lg:block mb-3 lg:mb-0">
            <img
              src={photoUrl}
              alt={`Dr. ${doctorName}`}
              className="rounded-full w-24 h-24 lg:w-36 lg:h-36 object-cover"
            />
          </div>
          <div className="px-2 lg:px-6 flex-grow">
            <h2 className="font-bold text-lg lg:text-xl mt-2 text-cyan-800">
              {doctorName}
            </h2>
            <div className="my-2 text-sm space-y-1">
              <div>{specialization}</div>
              <div>{experienceYears} years experience overall</div>
              <div className="flex flex-wrap items-center mt-1 text-gray-700">
                <span className="font-medium">
                  {locality}, {city || ""}
                </span>
                <span className="mx-2 font-bold hidden sm:inline">•</span>
                <span>{clinicName}</span>
              </div>
              <div className="border-b border-gray-300 mt-2 pb-2 font-semibold">
                ₹{consultationFees} consultation fee at clinic
              </div>
            </div>
          </div>
        </div>
        {/* Button section */}
        <div className="flex flex-col items-center justify-center mt-4 lg:mt-0 lg:mr-6">
          {loading && (
            <span className="text-gray-500 font-medium mb-2">
              Checking availability...
            </span>
          )}
          {error && !loading && (
            <span className="text-red-500 font-medium mb-2">{error}</span>
          )}
          {!loading && !error && (
            <span
              className={
                isAvailableToday
                  ? "text-green-700 font-medium mb-2"
                  : "text-red-500 font-medium mb-2 cursor-not-allowed"
              }
            >
              {isAvailableToday ? "Available Today" : "Fully Booked Today"}
            </span>
          )}
          <button
            aria-pressed={selectedId === id}
            className="w-full sm:w-40 py-2 bg-sky-500 hover:bg-sky-600 rounded-md text-white font-semibold transition-colors duration-200"
            onClick={handleClick}
            disabled={!isAvailableToday}
            title={
              isAvailableToday
                ? "Book Clinic Visit"
                : "No slots available today"
            }
          >
            {selectedId === id ? "Cancel Booking" : "Book Clinic Visit"}
          </button>
        </div>
      </div>
      {/* Appointment Form */}
      {selectedId === id && (
        <div className="mt-6 border-t border-gray-300 pt-4">
          <AppointmentForm
            id={selectedId}
            specialization={selectedSpecialization}
          />
        </div>
      )}
    </div>
  );
}

export default DoctorCard;
