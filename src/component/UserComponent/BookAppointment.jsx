import React, { useState } from "react";
import { format, addDays } from "date-fns";

const AppointmentForm = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateSelection = (date) => setSelectedDate(date);

  return (
    <div className="appointment-form">
      <h3>Select Appointment Date</h3>
      <DateButtonGroup
        selectedDate={selectedDate}
        onSelect={handleDateSelection}
      />
      <SelectedDateDisplay selectedDate={selectedDate} />
    </div>
  );
};

function DateButtonGroup({ selectedDate, onSelect }) {
  const buttons = [];
  for (let i = 0; i < 14; i++) {
    const date = addDays(new Date(), i);
    buttons.push(
      <button
        key={i}
        className={`date-button ${
          selectedDate.toDateString() === date.toDateString() ? "selected" : ""
        }`}
        onClick={() => onSelect(date)}
      >
        {i === 0 ? "Today" : format(date, "EEE, MMM d")}
      </button>
    );
  }
  return <div className="date-options">{buttons}</div>;
}

function SelectedDateDisplay({ selectedDate }) {
  return (
    <div className="selected-date">
      <p>Selected Date: {format(selectedDate, "yyyy-MM-dd")}</p>
    </div>
  );
}

export default AppointmentForm;
