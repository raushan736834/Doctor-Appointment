import React, { useState, useMemo, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, format } from "date-fns";
import { useNavigate } from "react-router-dom";
import useDate from "../../hooks/useDate";
import { allSlots } from "../../constants/slots";
import { useBookedSlots } from "../../hooks/useBookedSlots";

const AppointmentForm = React.memo(
  ({ id, specialization, isReschedule, appointmentId, onSelectionChange }) => {
    const navigate = useNavigate();
    const today = useMemo(() => new Date(), []);
    const { setData } = useDate();
    const [selectedDate, setSelectedDate] = useState(today);
    const [selectedPeriod, setSelectedPeriod] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
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
      if (isReschedule && onSelectionChange) {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        onSelectionChange({
          appointmentId,
          newDate: formattedDate,
          newTime: slot,
          newPeriod: selectedPeriod,
        });
      } else if (!isReschedule) {
        if (selectedDate && selectedPeriod && slot) {
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
          alert("Please select a date, period, and slot.");
        }
      }
    };

    const getAvailableSlots = () => {
      if (!selectedPeriod) return [];
      const normalizedBooked = bookedSlots.map((s) => s.trim());
      const periodSlots = allSlots[selectedPeriod] || [];
      const now = new Date();

      return periodSlots.filter((slot) => {
        const [time, meridian] = slot.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (meridian === "PM" && hours !== 12) hours += 12;
        if (meridian === "AM" && hours === 12) hours = 0;

        const slotDateTime = new Date(selectedDate);
        slotDateTime.setHours(hours, minutes, 0, 0);

        const isToday =
          format(selectedDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");

        // For today, only show slots with time >= current time
        const isFutureSlot = !isToday || slotDateTime >= now;

        // Return only if slot is not booked and is in future
        return !normalizedBooked.includes(slot) && isFutureSlot;
      });
    };

    return (
      <section className="flex flex-col items-center py-4 px-3">
        <form className="w-full max-w-md space-y-3">
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
  }
);

const DateSelector = ({ selectedDate, onDateChange, today }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:space-x-4">
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

const PeriodSelector = ({ selectedPeriod, onPeriodChange }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:space-x-4">
    <label className="mb-2 sm:mb-0 font-semibold w-32 text-gray-700">
      Select Period:
    </label>
    <select
      value={selectedPeriod}
      onChange={onPeriodChange}
      className="border-2 border-blue-500 rounded px-[6px] py-2 w-full sm:w-auto text-center"
    >
      <option value="">Select a Period</option>
      <option value="Morning">Morning (8 AM - 10 AM)</option>
      <option value="Noon">Noon (12 PM - 2 PM)</option>
      <option value="Evening">Evening (4 PM - 6 PM)</option>
    </select>
  </div>
);

const SlotSelector = ({ availableSlots, selectedSlot, handleSlotChange }) => (
  <div>
    <label className="block mb-2 font-semibold text-gray-700">
      Select Time Slot:
    </label>
    <div className="flex flex-wrap gap-1 justify-center">
      {availableSlots.length > 0 ? (
        availableSlots.map((slot) => (
          <button
            key={slot}
            type="button"
            onClick={() => handleSlotChange(slot)}
            className={`px-4 py-2 rounded-full border transition duration-200 text-sm
              ${
                selectedSlot === slot
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100"
              }
            `}
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

export default AppointmentForm;
