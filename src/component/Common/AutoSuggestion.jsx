import React from "react";
import defaultDoctorImage from "../../assets/img/defaultClinicImage.jpg"

const AutoSuggestion = ({ suggestions, onSuggestionClick, showDropdown }) => {
  if (!showDropdown || suggestions.length === 0) return null;
  return (
    <div className="absolute z-10 left-0 w-full sm:w-80 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-scroll">
      {suggestions.map((doctor) => (
        <div
          key={doctor.id}
          className="px-4 py-2 cursor-pointer hover:bg-blue-100 flex items-center gap-3 border-b"
          onClick={() => onSuggestionClick(doctor)}
        >
          <img
            src={doctor.profilePhoto || defaultDoctorImage}
            alt={doctor.doctorName}
            className="w-12 h-12 rounded-full object-cover border border-gray-200"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800">{doctor.doctorName}</span>
            <span className="text-xs text-gray-500">{doctor.specialization}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AutoSuggestion;
