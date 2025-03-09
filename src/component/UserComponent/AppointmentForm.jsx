// import React, { useState } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { addDays, format } from "date-fns";
// import { useNavigate } from "react-router-dom";
// import useDate from "../../hooks/useDate";

// const AppointmentForm = ({ id, specialization }) => {
//   const navigate = useNavigate();
//   const today = new Date().toISOString().split("T")[0];

//   const { setData } = useDate();
//   const [selectedDate, setSelectedDate] = useState(today);
//   const [selectedPeriod, setSelectedPeriod] = useState("");
//   const [selectedSlot, setSelectedSlot] = useState("");

//   const morningSlots = [
//     "8:00 AM",
//     "8:20 AM",
//     "8:40 AM",
//     "9:00 AM",
//     "9:20 AM",
//     "9:40 AM",
//     "10:00 AM",
//     "10:20 AM",
//     "10:40 AM",
//     "11:00 AM",
//   ];
//   const noonSlots = [
//     "1:00 PM",
//     "1:20 PM",
//     "1:40 PM",
//     "2:00 PM",
//     "2:20 PM",
//     "2:40 PM",
//     "3:00 PM",
//     "3:20 PM",
//     "3:40 PM",
//     "4:00 PM",
//   ];
//   const eveningSlots = [
//     "5:00 PM",
//     "5:20 PM",
//     "5:40 PM",
//     "6:00 PM",
//     "6:20 PM",
//     "6:40 PM",
//     "7:00 PM",
//     "7:20 PM",
//     "7:40 PM",
//     "8:00 PM",
//   ];

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//     setSelectedPeriod(""); // Reset period and slot when date changes
//     setSelectedSlot("");
//   };

//   const handlePeriodChange = (e) => {
//     setSelectedPeriod(e.target.value);
//   console.log(selectedPeriod);
//     setSelectedSlot(""); // Reset slot when period changes
//   };

//   const handleSlotChange = (slot) => {
//     setSelectedSlot(slot);
//     if (selectedDate && slot) {
//       setData({ selectedDate, slot, specialization,selectedPeriod });

//       navigate("/appointment-details/" + id, {
//         state: {
//           date: format(selectedDate, "dd-MM-yyyy"),
//           time: selectedSlot,
//           period: selectedPeriod,
//           specialization,
//         },
//       });
//     } else {
//       alert("Please select a date, period, and time slot.");
//     }
//   };

//   const getAvailableSlots = () => {
//     if (selectedPeriod === "Morning") return morningSlots;
//     if (selectedPeriod === "Noon") return noonSlots;
//     if (selectedPeriod === "Evening") return eveningSlots;
//     return [];
//   };

//   return (
//     <section className="flex items-center flex-col py-2">
//       <form>
//         <div>
//           <label>Select Date: </label>
//           <DatePicker
//             selected={selectedDate}
//             onChange={handleDateChange}
//             minDate={new Date()}
//             maxDate={addDays(new Date(), 14)}
//             dateFormat="dd-MM-yyyy"
//             placeholderText={today}
//             className="border-blue-500 border-2 text-center ml-3 my-2 w-56 "
//           />
//         </div>

//         <div>
//           <label>Select Period: </label>
//           <select
//             value={selectedPeriod}
//             onChange={handlePeriodChange}
//             className="border-blue-500 border-2 my-2 w-56 text-center"
//           >
//             <option value="">Select a Period</option>
//             <option value="Morning">Morning (8 AM - 11 AM)</option>
//             <option value="Noon">Noon (1 PM - 4 PM)</option>
//             <option value="Evening">Evening (5 PM - 8 PM)</option>
//           </select>
//         </div>

//         {selectedPeriod && (
//           <div>
//             <label>Select Time Slot:</label>
//             <div>
//               {getAvailableSlots().map((slot) => (
//                 <button
//                   type="button"
//                   key={slot}
//                   className={`time-slot-btn ${
//                     selectedSlot === slot ? "selected" : ""
//                   }`}
//                   onClick={() => handleSlotChange(slot)}
//                 >
//                   {slot}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}
//       </form>
//     </section>
//   );
// };

// export default AppointmentForm;

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, format } from "date-fns";
import { useNavigate } from "react-router-dom";
import useDate from "../../hooks/useDate";
import axios from "../../api/axios";

const AppointmentForm = ({ id, specialization }) => {
  const navigate = useNavigate();
  const today = new Date();
  
  const [availableSlots, setAvailableSlots] = useState([]);
  const { setData } = useDate();
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const allSlots = {
    Morning: [
      "8:00 AM",
      "8:20 AM",
      "8:40 AM",
      "9:00 AM",
      "9:20 AM",
      "9:40 AM",
      "10:00 AM",
      "10:20 AM",
      "10:40 AM",
      "11:00 AM",
    ],
    Noon: [
      "1:00 PM",
      "1:20 PM",
      "1:40 PM",
      "2:00 PM",
      "2:20 PM",
      "2:40 PM",
      "3:00 PM",
      "3:20 PM",
      "3:40 PM",
      "4:00 PM",
    ],
    Evening: [
      "5:00 PM",
      "5:20 PM",
      "5:40 PM",
      "6:00 PM",
      "6:20 PM",
      "6:40 PM",
      "7:00 PM",
      "7:20 PM",
      "7:40 PM",
      "8:00 PM",
    ],
  };

  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots();
    }
  }, [selectedDate]);

  const fetchBookedSlots = async () => {
    setLoading(true);
    setError("");
    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const response = await axios.get("/appointment/booked-slots", {
        params: {
          date: formattedDate,
          doctorId: id,
        },
      });
      
      console.log("🔹 Response from Backend:", response.data);
      const fetchedSlots = response.data || [];
      console.log("🔹 Raw Booked Slots from Backend:", fetchedSlots);
      
      // Normalize booked slots (trim and format)
      const normalizedBookedSlots = fetchedSlots.map(slot => slot.trim());
      console.log("🔹 Normalized Booked Slots:", normalizedBookedSlots);
  
      setBookedSlots(normalizedBookedSlots);
    } catch (error) {
      console.error("❌ Error fetching booked slots:", error);
      setError("Failed to fetch booked slots. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedPeriod("");
    setSelectedSlot("");
  };

  const handlePeriodChange = (e) => {
    const newPeriod = e.target.value;
    console.log("Previous Period:", selectedPeriod);
    console.log("New Period:", newPeriod);
    setSelectedPeriod(newPeriod);
    setSelectedSlot("");
  };

  const handleSlotChange = (slot) => {
    setSelectedSlot(slot);
    if (selectedDate && slot) {
      setData({ selectedDate, slot, specialization, selectedPeriod });

      navigate("/appointment-details/" + id, {
        state: {
          date: format(selectedDate, "dd-MM-yyyy"),
          time: selectedSlot,
          period: selectedPeriod,
          specialization,
        },
      });
    } else {
      alert("Please select a date, period, and time slot.");
    }
  };


  const getAvailableSlots = () => {
    console.log("🔹 Selected Period:", selectedPeriod);
    if (!selectedPeriod) return [];
  
    const normalizedBookedSlots = bookedSlots.map((slot) => slot.trim());
    console.log("🔹 Booked Slots (Normalized):", normalizedBookedSlots);
  
    const periodSlots = allSlots[selectedPeriod] || [];
    console.log("🔹 All Slots for Selected Period:", periodSlots);
  
    const availableSlots = periodSlots.filter((slot) => !normalizedBookedSlots.includes(slot));
    console.log("🟢 Final Available Slots:", availableSlots);
    
    return availableSlots;
  };
   // Run when `selectedPeriod` or `bookedSlots` change


  return (
    <section className="flex items-center flex-col py-2">
      <form>
        <div>
          <label>Select Date: </label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            minDate={today}
            maxDate={addDays(today, 14)}
            dateFormat="dd-MM-yyyy"
            className="border-blue-500 border-2 text-center ml-3 my-2 w-56"
          />
        </div>

        <div>
          <label>Select Period: </label>
          <select
            value={selectedPeriod}
            selected={selectedPeriod}
            onChange={handlePeriodChange}
            className="border-blue-500 border-2 my-2 w-56 text-center"
          >
            <option value="">Select a Period</option>
            <option value="Morning">Morning (8 AM - 11 AM)</option>
            <option value="Noon">Noon (1 PM - 4 PM)</option>
            <option value="Evening">Evening (5 PM - 8 PM)</option>
          </select>
        </div>

        {loading && <p>Loading slots...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {selectedPeriod && !loading && (
          <div>
            <label>Select Time Slot:</label>
            <div>
              {/* {console.log(getAvailableSlots())} */}
              {getAvailableSlots().length > 0 ? (
                getAvailableSlots().map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    className={`time-slot-btn ${
                      selectedSlot === slot ? "selected" : ""
                    }`}
                    onClick={() => handleSlotChange(slot)}
                  >
                    {slot}
                  </button>
                ))
              ) : (
                <p>No available slots for this period.</p>
              )}
            </div>
          </div>
        )}
      </form>
    </section>
  );
};

export default AppointmentForm;
