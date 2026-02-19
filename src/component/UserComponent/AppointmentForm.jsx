import React, { useState, useMemo, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useBookedSlots } from "../../hooks/useBookedSlots";
import { useSlots } from "../../hooks/useSlots";
import { useApiService } from "../../hooks/useAuthWithAxios";
import { Calendar, Clock, Loader2, ChevronDown } from "lucide-react";

const AppointmentForm = ({
  id,
  isReschedule,
  appointmentId,
  onSelectionChange,
}) => {
  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [expandedPeriod, setExpandedPeriod] = useState(null);
  const [operatingHours, setOperatingHours] = useState(null);
  const [loadingOperatingHours, setLoadingDoctor] = useState(false);
  const [operatingHoursError, setOperatingHoursError] = useState(null);

  const {
    slots: allSlots,
    isLoading: slotsLoading,
    error: slotsError,
  } = useSlots(id, selectedDate);

  const api = useApiService();

  useEffect(() => {
    if(id){
      fetchDoctorDetails();
    }
  }, [id]);
  
  const fetchDoctorDetails = async () => {
    setLoadingDoctor(true);
    try {
      const response = await api.get(`/api/public/operatingHours/${id}`);
      setOperatingHours(response.data);
    } catch (error) {
      setOperatingHoursError(error.message);
      console.error("Error fetching doctor details:", error);
    } finally {
      setLoadingDoctor(false);
    }
  }

  // Convert 24-hour format (HH:MM) to 12-hour format (HH:MM AM/PM)
  const convertTo12Hour = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":").map(Number);
    const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const meridian = hours >= 12 ? "PM" : "AM";
    return `${hour12.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${meridian}`;
  };

  // Get available slots from API, filter out booked slots and past slots
  const getAvailableSlots = useMemo(() => {
    if (!selectedDate || !allSlots || allSlots.length === 0) return [];

    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();

    // Filter slots: only available/open slots, not booked, and not in the past (if today)
    const availableSlots = allSlots
      .filter((slot) => {
        // Filter by status (only AVAILABLE, OPEN, FREE, or undefined/null)
        const statusAllowed = ["AVAILABLE", "OPEN", "FREE", undefined, null];
        if (!statusAllowed.includes(slot?.status)) return false;

        // Check if slot is booked
        const slotTime = slot?.time || "";        

        // For today, filter out past slots
        if (isToday && slotTime) {
          const [hours, minutes] = slotTime.split(":").map(Number);
          const slotDateTime = new Date(selectedDate);
          slotDateTime.setHours(hours, minutes, 0, 0);
          if (slotDateTime <= now) return false;
        }

        return true;
      })
      .map((slot) => ({
        ...slot,
        displayTime: convertTo12Hour(slot.time), // Add 12-hour format for display
        originalTime: slot.time, // Keep original for comparison
      }));

    // Sort slots by time
    return availableSlots.sort((a, b) => {
      const [aHours, aMins] = a.originalTime.split(":").map(Number);
      const [bHours, bMins] = b.originalTime.split(":").map(Number);
      return aHours * 60 + aMins - (bHours * 60 + bMins);
    });
  }, [selectedDate, allSlots]);

  // Reset selected slot when date changes
  useEffect(() => {
    if (selectedDate) {
      setSelectedSlot("");
      setExpandedPeriod(null);
    }
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlot("");
    setExpandedPeriod(null);
  };

  const handleSlotChange = (slot) => {
    setSelectedSlot(slot);
    if (isReschedule && onSelectionChange) {
      // Find the slot object to get the slotId and time
      const slotObj = getAvailableSlots.find(s => s.displayTime === slot);
      
      // Format date in YYYY-MM-DD format
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      onSelectionChange({
        appointmentId,
        slotId: slotObj?.slotId,
        slotTime: slotObj?.originalTime || slotObj?.time, // 24-hour format time
        slotDate: formattedDate, // YYYY-MM-DD format date
        displayTime: slot, // 12-hour format for display
      });
    }
  };


  const DatePickerComponent = ({
    selectedDate,
    onDateChange,
    today,
    operatingHours,
    loadingOperatingHours,
  }) => {
    if (loadingOperatingHours) {
      return (
        <div className="flex justify-center items-center py-8">
          Loading available slots...
        </div>
      );
    }
    if (operatingHoursError) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600 font-medium">
            Error loading operating hours
          </p>
        </div>
      );
    }
    const isDayDisabled = (date) => {
      // If operating hours are not available, don't disable any days
      // The API will only return slots for available days anyway
      if (!operatingHours || !Array.isArray(operatingHours)) return false;
      
      const dayName = date
        .toLocaleDateString("en-US", { weekday: "long" })
        .toUpperCase();
      const daySchedule = operatingHours.find((oh) => oh.days === dayName);
      return daySchedule?.isClosedToday || false;
    };

    const dates = [];
    for (let i = 0; i < 15; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      // Only add dates that are not disabled (clinic is open)
      if (!isDayDisabled(date)) {
        dates.push(date);
      }
    }

    return (
      <div className="mb-6">
        <label className="mb-3 font-semibold text-gray-800 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
          Select Date
        </label>
        <div className="grid grid-cols-7 gap-2">
          {dates.map((date) => {
            const isSelected =
              selectedDate?.toDateString() === date.toDateString();
            const isPast = date < today;

            return (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => !isPast && onDateChange(date)}
                disabled={isPast}
                className={`
                p-2 rounded-lg text-center transition-all duration-200
                ${
                  isSelected
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg scale-105"
                    : isPast
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border-2 border-gray-200 hover:border-blue-400 hover:shadow-md"
                }
              `}
              >
                <div className="text-xs font-medium">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div
                  className={`text-lg font-bold ${
                    isSelected ? "text-white" : "text-gray-800"
                  }`}
                >
                  {date.getDate()}
                </div>
                <div className="text-xs">
                  {date.toLocaleDateString("en-US", { month: "short" })}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const SlotSelector = ({
    availableSlots,
    selectedSlot,
    handleSlotChange,
    isLoading,
  }) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      );
    }

    if (availableSlots.length === 0) {
      return (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">
            No available slots for this date
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Please select another date
          </p>
        </div>
      );
    }

    const groupSlotsByPeriod = (slots) => {
      const morning = [];
      const afternoon = [];
      const evening = [];

      slots.forEach((slot) => {
        const [time, meridian] = slot.split(" ");
        const [hours] = time.split(":").map(Number);
        const hour24 = meridian === "PM" && hours !== 12 ? hours + 12 : hours;

        if (hour24 < 12) morning.push(slot);
        else if (hour24 < 17) afternoon.push(slot);
        else evening.push(slot);
      });

      return { morning, afternoon, evening };
    };

    const { morning, afternoon, evening } = groupSlotsByPeriod(availableSlots);

    const PeriodAccordion = ({ title, emoji, slots, periodKey }) => {
      const isExpanded = expandedPeriod === periodKey;

      return (
        <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setExpandedPeriod(isExpanded ? null : periodKey)}
            className={`
              w-full px-4 py-3 flex items-center justify-between transition-all duration-200
              ${
                isExpanded
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  : "bg-white hover:bg-blue-50"
              }
            `}
          >
            <span className="flex items-center gap-2 font-medium">
              <span className="text-lg">{emoji}</span>
              {title}
            </span>
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>

          {isExpanded && (
            <div className="p-4 bg-gray-50">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      handleSlotChange(slot);
                      setExpandedPeriod(null);
                    }}
                    className={`
                      px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${
                        selectedSlot === slot
                          ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg scale-105"
                          : "bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-400 hover:shadow-md"
                      }
                    `}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-4">
        <label className="block font-semibold text-gray-800 items-center mb-4">
          <Clock className="w-5 h-5 mr-2 text-blue-600 inline" />
          Select Time Slot
        </label>

        <div className="space-y-3">
          {morning.length > 0 && (
            <PeriodAccordion
              title="Morning"
              emoji="🌅"
              slots={morning}
              periodKey="morning"
            />
          )}

          {afternoon.length > 0 && (
            <PeriodAccordion
              title="Noon"
              emoji="🌞"
              slots={afternoon}
              periodKey="afternoon"
            />
          )}

          {evening.length > 0 && (
            <PeriodAccordion
              title="Evening"
              emoji="🌆"
              slots={evening}
              periodKey="evening"
            />
          )}
        </div>

        {selectedSlot && (
          <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-500 rounded">
            <p className="text-sm text-green-700 font-medium">
              ✓ Selected: <span className="font-bold">{selectedSlot}</span>
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="py-4 px-2">
      <DatePickerComponent
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        today={today}
        operatingHours={operatingHours}
        loadingOperatingHours={loadingOperatingHours}
      />
      <SlotSelector
        availableSlots={getAvailableSlots.map(slot => slot.displayTime)}
        selectedSlot={selectedSlot}
        handleSlotChange={handleSlotChange}
        isLoading={slotsLoading}
      />
    </div>
  );
};

export default AppointmentForm;
