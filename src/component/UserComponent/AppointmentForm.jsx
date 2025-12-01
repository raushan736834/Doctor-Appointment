import React, { useState, useMemo, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useBookedSlots } from "../../hooks/useBookedSlots";
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
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [loadingDoctor, setLoadingDoctor] = useState(false);
  const { bookedSlots, isLoading: slotsLoading } = useBookedSlots(
    id,
    selectedDate
  );
  const api = useApiService();

  useEffect(() => {
    if (id) {
      fetchDoctorDetails();
    }
  }, [id]);

  const fetchDoctorDetails = async () => {
    try {
      setLoadingDoctor(true);
      const response = await api.post(`/api/public/getDoctor`, {
        doctorId: id,
      });
      setDoctorDetails(response.data);
    } catch (error) {
      console.error("Error fetching doctor details:", error);
    } finally {
      setLoadingDoctor(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlot("");
    setExpandedPeriod(null);
  };

  const handleSlotChange = (slot) => {
    setSelectedSlot(slot);
    if (isReschedule && onSelectionChange) {
      // Format date in local timezone to avoid UTC conversion issues
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      onSelectionChange({
        appointmentId,
        newDate: formattedDate,
        newTime: slot,
      });
    }
  };

  const generateTimeSlots = (startTime, endTime, duration) => {
    const slots = [];
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    let currentHour = startHour;
    let currentMin = startMin;

    const endTimeInMinutes = endHour * 60 + endMin;

    while (currentHour * 60 + currentMin < endTimeInMinutes) {
      const hour12 =
        currentHour === 0
          ? 12
          : currentHour > 12
          ? currentHour - 12
          : currentHour;
      const meridian = currentHour >= 12 ? "PM" : "AM";
      const timeStr = `${hour12.toString().padStart(2, "0")}:${currentMin
        .toString()
        .padStart(2, "0")} ${meridian}`;
      slots.push(timeStr);

      currentMin += parseInt(duration);
      if (currentMin >= 60) {
        currentHour += Math.floor(currentMin / 60);
        currentMin = currentMin % 60;
      }
    }

    return slots;
  };

  const getAvailableSlots = () => {
    if (!doctorDetails || !selectedDate) return [];

    const dayName = selectedDate
      .toLocaleDateString("en-US", { weekday: "long" })
      .toUpperCase();
    const daySchedule = doctorDetails.clinicInfos.operatingHours.find(
      (oh) => oh.days === dayName
    );

    if (!daySchedule || daySchedule.isClosedToday) return [];

    const allSlots = generateTimeSlots(
      daySchedule.open,
      daySchedule.close,
      parseInt(doctorDetails.clinicInfos.consultationDuration)
    );

    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();

    return allSlots.filter((slot) => {
      // Check if slot is booked
      if (bookedSlots.includes(slot)) return false;

      // For today, filter out past slots
      if (isToday) {
        const [time, meridian] = slot.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (meridian === "PM" && hours !== 12) hours += 12;
        if (meridian === "AM" && hours === 12) hours = 0;

        const slotTime = new Date(selectedDate);
        slotTime.setHours(hours, minutes, 0, 0);

        return slotTime > now;
      }

      return true;
    });
  };

  if (loadingDoctor) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  const DatePickerComponent = ({
    selectedDate,
    onDateChange,
    today,
    operatingHours,
  }) => {
    const isDayDisabled = (date) => {
      const dayName = date
        .toLocaleDateString("en-US", { weekday: "long" })
        .toUpperCase();
      const daySchedule = operatingHours?.find((oh) => oh.days === dayName);
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
        operatingHours={doctorDetails?.clinicInfos?.operatingHours}
      />
      <SlotSelector
        availableSlots={getAvailableSlots()}
        selectedSlot={selectedSlot}
        handleSlotChange={handleSlotChange}
        isLoading={slotsLoading}
      />
    </div>
  );
};

export default AppointmentForm;
