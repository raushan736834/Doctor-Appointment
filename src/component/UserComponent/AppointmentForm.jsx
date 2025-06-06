import React, { useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, format } from "date-fns";
import { useNavigate } from "react-router-dom";
import useDate from "../../hooks/useDate";
import { allSlots } from "../../constants/slots";
import { useBookedSlots } from "../../hooks/useBookedSlots";

const AppointmentForm = ({ id, specialization }) => {
  const navigate = useNavigate();
  const today = useMemo(() => new Date(), []);
  const { setData } = useDate();

  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  // Use shared hook for fetching booked slots
  const { bookedSlots, isLoading, error } = useBookedSlots(id, selectedDate);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedPeriod("");
    setSelectedSlot("");
  };

  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value);
    setSelectedSlot("");
  };

  const handleSlotChange = (slot) => {
    setSelectedSlot(slot);
    if (selectedDate && slot) {
      setData({ selectedDate, slot, specialization, selectedPeriod });
      navigate("/appointment-details/" + id, {
        state: {
          date: format(selectedDate, "dd-MM-yyyy"),
          time: slot,
          period: selectedPeriod,
          specialization,
        },
      });
    } else {
      alert("Please select a date, period, and time slot.");
    }
  };

  function getSlotDateTime(date, slot) {
    const [time, meridian] = slot.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    let hour = meridian === "PM" && hours !== 12 ? hours + 12 : hours;
    if (meridian === "AM" && hours === 12) hour = 0;

    const slotDate = new Date(date);
    slotDate.setHours(hour, minutes, 0, 0);
    return slotDate;
  }

  const getAvailableSlots = () => {
    if (!selectedPeriod) return [];

    const normalizedBookedSlots = bookedSlots.map((slot) => slot.trim());
    const periodSlots = allSlots[selectedPeriod] || [];
    const now = new Date();

    return periodSlots.filter((slot) => {
      const isBooked = normalizedBookedSlots.includes(slot);
      const slotDateTime = getSlotDateTime(selectedDate, slot);
      const isToday =
        format(selectedDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
      const isInFuture = !isToday || slotDateTime > now;

      return !isBooked && isInFuture;
    });
  };

  return (
    <section className="flex flex-col items-center py-4 px-4 sm:px-6 md:px-8">
      <form className="w-full max-w-md space-y-6">
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          today={today}
        />
        <PeriodSelector
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
        />
        {error && <p className="text-center text-red-500">{error}</p>}
        {selectedPeriod && !isLoading && (
          <SlotSelector
            availableSlots={getAvailableSlots()}
            selectedSlot={selectedSlot}
            handleSlotChange={handleSlotChange}
          />
        )}
      </form>
    </section>
  );
};

function DateSelector({ selectedDate, onDateChange, today }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
      <label className="mb-2 sm:mb-0 font-semibold w-32 text-gray-700">
        Select Date:
      </label>
      <DatePicker
        selected={selectedDate}
        onChange={onDateChange}
        minDate={today}
        maxDate={addDays(today, 14)}
        dateFormat="dd-MM-yyyy"
        className="border-2 border-blue-500 rounded px-3 py-2 w-full sm:w-auto text-center"
      />
    </div>
  );
}

function PeriodSelector({ selectedPeriod, onPeriodChange }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
      <label className="mb-2 sm:mb-0 font-semibold w-32 text-gray-700">
        Select Period:
      </label>
      <select
        value={selectedPeriod}
        onChange={onPeriodChange}
        className="border-2 border-blue-500 rounded px-[6px] py-2 w-full sm:w-auto text-center"
      >
        <option value="">Select a Period</option>
        <option value="Morning">Morning (8 AM - 11 AM)</option>
        <option value="Noon">Noon (1 PM - 4 PM)</option>
        <option value="Evening">Evening (5 PM - 8 PM)</option>
      </select>
    </div>
  );
}

function SlotSelector({ availableSlots, selectedSlot, handleSlotChange }) {
  return (
    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        Select Time Slot:
      </label>
      <div className="flex flex-wrap gap-3 max-w-md mx-auto justify-center">
        {availableSlots.length > 0 ? (
          availableSlots.map((slot) => (
            <button
              type="button"
              key={slot}
              className={`px-4 py-2 rounded-full border transition-colors duration-200 text-sm sm:text-base
                ${
                  selectedSlot === slot
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100"
                }`}
              onClick={() => handleSlotChange(slot)}
            >
              {slot}
            </button>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No available slots for this period.
          </p>
        )}
      </div>
    </div>
  );
}

export default AppointmentForm;
