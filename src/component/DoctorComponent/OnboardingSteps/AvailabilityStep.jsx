import React, { useState } from "react";
import {
  Clock,
  Calendar,
  MapPin,
  Check,
  Timer,
  Hospital,
  Building,
  Phone,
  Mail,
  Award,
  Plus,
  X,
} from "lucide-react";

const AvailabilityStep = () => {
  const clinicTypes = [
    "Private Practice",
    "Multi-Specialty Clinic",
    "Hospital-Based Clinic",
    "Community Health Center",
    "Urgent Care Center",
    "Specialty Clinic",
    "Telemedicine Practice",
    "Mobile Clinic",
    "Academic Medical Center",
  ];

  const facilities = [
    "X-Ray",
    "MRI",
    "CT Scan",
    "Ultrasound",
    "ECG",
    "Laboratory Services",
    "Pharmacy",
    "Emergency Services",
    "Surgery Center",
    "Diagnostic Imaging",
    "Blood Bank",
    "Dialysis",
    "Physiotherapy",
    "Radiology",
    "Pathology",
  ];

  const [data, setData] = useState({
    clinicName: "",
    clinicType: "",
    clinicPhone: "",
    clinicEmail: "",
    clinicWebsite: "",
    clinicAddress: "",
    clinicCity: "",
    clinicState: "",
    clinicPinCode: "",
    establishedYear: "",
    availableFacilities: [],
    consultationDuration: "",
    operatingHours: {
      monday: { open: "09:00", close: "17:00", closed: false },
      tuesday: { open: "09:00", close: "17:00", closed: false },
      wednesday: { open: "09:00", close: "17:00", closed: false },
      thursday: { open: "09:00", close: "17:00", closed: false },
      friday: { open: "09:00", close: "17:00", closed: false },
      saturday: { open: "09:00", close: "14:00", closed: false },
      sunday: { open: "10:00", close: "16:00", closed: true },
    },
  });

  const [newFacility, setNewFacility] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const updateData = (updates) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const addFacility = () => {
    if (newFacility && !data.availableFacilities.includes(newFacility)) {
      updateData({
        availableFacilities: [...data.availableFacilities, newFacility],
      });
      setNewFacility("");
    }
  };

  const removeFacility = (index) => {
    updateData({
      availableFacilities: data.availableFacilities.filter(
        (_, i) => i !== index
      ),
    });
  };

  const handleOperatingHoursChange = (day, field, value) => {
    updateData({
      operatingHours: {
        ...data.operatingHours,
        [day]: {
          ...data.operatingHours[day],
          [field]: value,
        },
      },
    });
  };

  const isFieldValid = (field) => {
    return data[field] && data[field].length > 0;
  };

  const dayNames = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const dayLabels = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const consultationDurations = [
    { value: "15", label: "15 min", description: "Quick consultations" },
    { value: "20", label: "20 min", description: "Standard follow-ups" },
    { value: "30", label: "30 min", description: "Regular consultations" },
    { value: "45", label: "45 min", description: "Detailed consultations" },
    { value: "60", label: "60 min", description: "Comprehensive sessions" },
  ];

  const handleInputChange = (field, value) => {
    updateData({ [field]: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-100 p-3 sm:p-6">
       <div className="max-w-4xl mx-auto">
         {/* Modern Header */}
         <div className="text-center mb-8 sm:mb-12 relative">
           <div className="absolute -top-4 sm:-top-6 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>

           <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
             <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
           </div>

           <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2 sm:mb-3 leading-tight">
             Clinic Info
           </h2>
           <p className="text-slate-600 text-base sm:text-lg font-medium px-2">Configure your Clinic Information and preferences</p>

           {/* Progress Indicator */}
           <div className="flex justify-center mt-4 sm:mt-6">
             <div className="flex space-x-1 sm:space-x-2">
               <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
               <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-200 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
             </div>
           </div>
         </div>

<div className="space-y-6 sm:space-y-8">
           <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl sm:shadow-2xl border border-white/20">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2">
            {/* Clinic Name */}
            <div className="space-y-2 sm:col-span-2">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                <Building className="w-4 h-4 mr-2 text-blue-500" />
                Clinic Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={data.clinicName || ""}
                  onChange={(e) =>
                    handleInputChange("clinicName", e.target.value)
                  }
                  onFocus={() => setFocusedField("clinicName")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                    focusedField === "clinicName"
                      ? "border-blue-400 ring-2 sm:ring-4 ring-blue-100 shadow-lg transform scale-[1.02] sm:scale-105"
                      : isFieldValid("clinicName")
                      ? "border-green-300 shadow-md"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  placeholder="Enter your clinic name"
                  required
                />
                {isFieldValid("clinicName") && (
                  <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Clinic Type */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                <Hospital className="w-4 h-4 mr-2 text-purple-500" />
                Clinic Type *
              </label>
              <div className="relative">
                <select
                  value={data.clinicType || ""}
                  onChange={(e) =>
                    handleInputChange("clinicType", e.target.value)
                  }
                  onFocus={() => setFocusedField("clinicType")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none text-base ${
                    focusedField === "clinicType"
                      ? "border-purple-400 ring-2 sm:ring-4 ring-purple-100 shadow-lg transform scale-[1.02] sm:scale-105"
                      : isFieldValid("clinicType")
                      ? "border-green-300 shadow-md"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  required
                >
                  <option value="">Select clinic type</option>
                  {clinicTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {isFieldValid("clinicType") && (
                  <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Established Year */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                Established Year *
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={data.establishedYear || ""}
                  onChange={(e) =>
                    handleInputChange("establishedYear", e.target.value)
                  }
                  onFocus={() => setFocusedField("establishedYear")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                    focusedField === "establishedYear"
                      ? "border-orange-400 ring-2 sm:ring-4 ring-orange-100 shadow-lg transform scale-[1.02] sm:scale-105"
                      : isFieldValid("establishedYear")
                      ? "border-green-300 shadow-md"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  placeholder="2020"
                  min="1900"
                  max={new Date().getFullYear()}
                  required
                />
                {isFieldValid("establishedYear") && (
                  <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Clinic Phone */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                <Phone className="w-4 h-4 mr-2 text-green-500" />
                Clinic Phone *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={data.clinicPhone || ""}
                  onChange={(e) =>
                    handleInputChange("clinicPhone", e.target.value)
                  }
                  onFocus={() => setFocusedField("clinicPhone")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                    focusedField === "clinicPhone"
                      ? "border-green-400 ring-2 sm:ring-4 ring-green-100 shadow-lg transform scale-[1.02] sm:scale-105"
                      : isFieldValid("clinicPhone")
                      ? "border-green-300 shadow-md"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  placeholder="+91 98765 43210"
                  required
                />
                {isFieldValid("clinicPhone") && (
                  <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Clinic Email */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                <Mail className="w-4 h-4 mr-2 text-red-500" />
                Clinic Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={data.clinicEmail || ""}
                  onChange={(e) =>
                    handleInputChange("clinicEmail", e.target.value)
                  }
                  onFocus={() => setFocusedField("clinicEmail")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                    focusedField === "clinicEmail"
                      ? "border-red-400 ring-2 sm:ring-4 ring-red-100 shadow-lg transform scale-[1.02] sm:scale-105"
                      : isFieldValid("clinicEmail")
                      ? "border-green-300 shadow-md"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  placeholder="clinic@example.com"
                  required
                />
                {isFieldValid("clinicEmail") && (
                  <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Clinic Address */}
            <div className="sm:col-span-2 space-y-2">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                <MapPin className="w-4 h-4 mr-2 text-cyan-500" />
                Clinic Address *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={data.clinicAddress || ""}
                  onChange={(e) =>
                    handleInputChange("clinicAddress", e.target.value)
                  }
                  onFocus={() => setFocusedField("clinicAddress")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                    focusedField === "clinicAddress"
                      ? "border-cyan-400 ring-2 sm:ring-4 ring-cyan-100 shadow-lg transform scale-[1.02] sm:scale-105"
                      : isFieldValid("clinicAddress")
                      ? "border-green-300 shadow-md"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  placeholder="123 Medical Plaza, Suite 101"
                  required
                />
                {isFieldValid("clinicAddress") && (
                  <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Clinic City */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                <MapPin className="w-4 h-4 mr-2 text-pink-500" />
                City *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={data.clinicCity || ""}
                  onChange={(e) =>
                    handleInputChange("clinicCity", e.target.value)
                  }
                  onFocus={() => setFocusedField("clinicCity")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                    focusedField === "clinicCity"
                      ? "border-pink-400 ring-2 sm:ring-4 ring-pink-100 shadow-lg transform scale-[1.02] sm:scale-105"
                      : isFieldValid("clinicCity")
                      ? "border-green-300 shadow-md"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  placeholder="Enter city"
                  required
                />
                {isFieldValid("clinicCity") && (
                  <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Clinic State */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                <MapPin className="w-4 h-4 mr-2 text-emerald-500" />
                State *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={data.clinicState || ""}
                  onChange={(e) =>
                    handleInputChange("clinicState", e.target.value)
                  }
                  onFocus={() => setFocusedField("clinicState")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                    focusedField === "clinicState"
                      ? "border-emerald-400 ring-2 sm:ring-4 ring-emerald-100 shadow-lg transform scale-[1.02] sm:scale-105"
                      : isFieldValid("clinicState")
                      ? "border-green-300 shadow-md"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  placeholder="Enter state"
                  required
                />
                {isFieldValid("clinicState") && (
                  <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Clinic Pin Code */}
            <div className="sm:col-span-2 space-y-2">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                <MapPin className="w-4 h-4 mr-2 text-violet-500" />
                PinCode *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={data.clinicPinCode || ""}
                  onChange={(e) =>
                    handleInputChange("clinicZipCode", e.target.value)
                  }
                  onFocus={() => setFocusedField("clinicPinCode")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                    focusedField === "clinicPinCode"
                      ? "border-violet-400 ring-2 sm:ring-4 ring-violet-100 shadow-lg transform scale-[1.02] sm:scale-105"
                      : isFieldValid("clinicPinCode")
                      ? "border-green-300 shadow-md"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  placeholder="12345"
                  required
                />
                {isFieldValid("clinicPinCode") && (
                  <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Available Facilities */}
           

            {/* Operating Hours - Responsive Grid Layout */}
            <div className="sm:col-span-2 space-y-4">
              <label className="flex items-center text-sm font-semibold text-slate-700">
                <Clock className="w-4 h-4 mr-2 text-green-500" />
                Operating Hours
                {/* <span className="text-xs text-slate-500 ml-1">(Optional)</span> */}
              </label>

              {/* Grid: 1 column on mobile, 2 columns on tablet and desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dayNames.map((day, index) => (
                  <div
                    key={day}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200"
                  >
                    <div className="flex items-center gap-3 sm:w-24">
                      <input
                        type="checkbox"
                        checked={!data.operatingHours[day].closed}
                        onChange={(e) =>
                          handleOperatingHoursChange(
                            day,
                            "closed",
                            !e.target.checked
                          )
                        }
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm font-medium text-slate-700">
                        {dayLabels[index]}
                      </span>
                    </div>

                    {!data.operatingHours[day].closed && (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="time"
                          value={data.operatingHours[day].open}
                          onChange={(e) =>
                            handleOperatingHoursChange(
                              day,
                              "open",
                              e.target.value
                            )
                          }
                          className="px-1 py-1.5 border border-slate-300 rounded-lg text-xs focus:border-green-400 focus:ring-2 focus:ring-green-100"
                        />
                        <span className="text-slate-500 text-xs">to</span>
                        <input
                          type="time"
                          value={data.operatingHours[day].close}
                          onChange={(e) =>
                            handleOperatingHoursChange(
                              day,
                              "close",
                              e.target.value
                            )
                          }
                          className="px-1 py-1.5 border border-slate-300 rounded-lg text-xs focus:border-green-400 focus:ring-2 focus:ring-green-100"
                        />
                      </div>
                    )}

                    {data.operatingHours[day].closed && (
                      <div className="flex-1">
                        <span className="text-sm text-slate-500 italic">
                          Closed
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Consultation Duration - Compact Grid Layout */}
            <div className="sm:col-span-2 space-y-4">
              <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-white/20">
                <label className="flex items-center text-base font-bold text-slate-800 mb-2">
                  <Timer className="w-5 h-5 text-purple-500 mr-2" />
                  Consultation Duration *
                  {isFieldValid("consultationDuration") && (
                    <Check className="w-5 h-5 text-green-500 ml-2" />
                  )}
                </label>
                <p className="text-slate-600 text-sm mb-3">
                  How long is each consultation?
                </p>

                {/* Grid: 2 columns on mobile, 3 on small screens, 5 on large screens */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {consultationDurations.map((duration) => (
                    <button
                      key={duration.value}
                      type="button"
                      onClick={() =>
                        handleInputChange(
                          "consultationDuration",
                          duration.value
                        )
                      }
                      className={`p-2.5 rounded-lg border-2 text-center transition-all duration-300 transform hover:scale-[1.02] ${
                        data.consultationDuration === duration.value
                          ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-500 shadow-md"
                          : "bg-white/50 backdrop-blur-sm border-slate-200 hover:border-purple-300 hover:bg-purple-50 hover:shadow-md"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="font-semibold text-sm">
                          {duration.label}
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            data.consultationDuration === duration.value
                              ? "text-purple-100"
                              : "text-slate-500"
                          }`}
                        >
                          {duration.description}
                        </div>
                        {data.consultationDuration === duration.value && (
                          <Check className="w-4 h-4 text-white mt-1" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
     </div>
     </div>
  );
};

export default AvailabilityStep;

// import React, { useState } from 'react';
// import { Clock, Calendar, MapPin, Check, Globe, Timer, Sun, Moon } from 'lucide-react';

// const daysOfWeek = [
//   { id: 'monday', label: 'Monday', short: 'Mon' },
//   { id: 'tuesday', label: 'Tuesday', short: 'Tue' },
//   { id: 'wednesday', label: 'Wednesday', short: 'Wed' },
//   { id: 'thursday', label: 'Thursday', short: 'Thu' },
//   { id: 'friday', label: 'Friday', short: 'Fri' },
//   { id: 'saturday', label: 'Saturday', short: 'Sat' },
//   { id: 'sunday', label: 'Sunday', short: 'Sun' },
// ];

// const timeZones = [
//   { value: 'Asia/Kolkata', label: 'India Standard Time (IST)', offset: '+5:30' },
//   { value: 'America/New_York', label: 'Eastern Time (EST/EDT)', offset: '-5/-4' },
//   { value: 'America/Chicago', label: 'Central Time (CST/CDT)', offset: '-6/-5' },
//   { value: 'America/Denver', label: 'Mountain Time (MST/MDT)', offset: '-7/-6' },
//   { value: 'America/Los_Angeles', label: 'Pacific Time (PST/PDT)', offset: '-8/-7' },
//   { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)', offset: '+0/+1' },
//   { value: 'Europe/Berlin', label: 'Central European Time (CET)', offset: '+1/+2' },
//   { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST)', offset: '+4' },
//   { value: 'Asia/Singapore', label: 'Singapore Time (SGT)', offset: '+8' },
//   { value: 'Australia/Sydney', label: 'Australian Eastern Time (AEST)', offset: '+10/+11' },
// ];

// const consultationDurations = [
//   { value: '15', label: '15 minutes', description: 'Quick consultations' },
//   { value: '20', label: '20 minutes', description: 'Standard follow-ups' },
//   { value: '30', label: '30 minutes', description: 'Regular consultations' },
//   { value: '45', label: '45 minutes', description: 'Detailed consultations' },
//   { value: '60', label: '60 minutes', description: 'Comprehensive sessions' },
// ];

// const AvailabilityStep = ({ data = {}, updateData }) => {
//   const [focusedField, setFocusedField] = useState(null);

//   // Initialize default values
//   const availabilityData = {
//     workingDays: [],
//     startTime: '',
//     endTime: '',
//     consultationDuration: '',
//     timeZone: '',
//     ...data
//   };

//   const handleInputChange = (field, value) => {
//     updateData({ [field]: value });
//   };

//   const handleDayToggle = (day) => {
//     const updatedDays = availabilityData.workingDays.includes(day)
//       ? availabilityData.workingDays.filter(d => d !== day)
//       : [...availabilityData.workingDays, day];

//     updateData({ workingDays: updatedDays });
//   };

//   const isFieldValid = (field) => {
//     if (field === 'workingDays') {
//       return availabilityData.workingDays.length > 0;
//     }
//     return availabilityData[field] && availabilityData[field].length > 0;
//   };

//   const getTimeIcon = (time) => {
//     if (!time) return Clock;
//     const hour = parseInt(time.split(':')[0]);
//     return hour >= 6 && hour < 18 ? Sun : Moon;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-100 p-3 sm:p-6">
//       <div className="max-w-4xl mx-auto">
//         {/* Modern Header */}
//         <div className="text-center mb-8 sm:mb-12 relative">
//           <div className="absolute -top-4 sm:-top-6 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>

//           <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
//             <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
//           </div>

//           <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2 sm:mb-3 leading-tight">
//             Availability & Schedule
//           </h2>
//           <p className="text-slate-600 text-base sm:text-lg font-medium px-2">Configure your consultation hours and preferences</p>

//           {/* Progress Indicator */}
//           <div className="flex justify-center mt-4 sm:mt-6">
//             <div className="flex space-x-1 sm:space-x-2">
//               <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-bounce"></div>
//               <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
//               <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-200 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//             </div>
//           </div>
//         </div>

//         {/* Form Fields */}
//         <div className="space-y-6 sm:space-y-8">

//           {/* Working Days */}
//           <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl sm:shadow-2xl border border-white/20">
//             <div className="mb-6">
//               <label className="flex items-center text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">
//                 <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mr-3" />
//                 Working Days *
//                 {isFieldValid('workingDays') && (
//                   <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 ml-2" />
//                 )}
//               </label>
//               <p className="text-slate-600 text-sm sm:text-base mb-4">Select the days when you're available for consultations</p>
//             </div>

//             <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
//               {daysOfWeek.map((day) => (
//                 <button
//                   key={day.id}
//                   type="button"
//                   onClick={() => handleDayToggle(day.id)}
//                   className={`group relative p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 text-center transition-all duration-300 transform hover:scale-105 ${
//                     availabilityData.workingDays.includes(day.id)
//                       ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-500 shadow-lg shadow-blue-200'
//                       : 'bg-white/50 backdrop-blur-sm text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md'
//                   }`}
//                 >
//                   <div className="font-bold text-xs sm:text-sm lg:text-base">
//                     <span className="sm:hidden">{day.short}</span>
//                     <span className="hidden sm:inline lg:hidden">{day.short}</span>
//                     <span className="hidden lg:inline">{day.label}</span>
//                   </div>

//                   {/* Animated selection indicator */}
//                   {availabilityData.workingDays.includes(day.id) && (
//                     <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 opacity-20 animate-pulse"></div>
//                   )}
//                 </button>
//               ))}
//             </div>

//             {availabilityData.workingDays.length > 0 && (
//               <div className="mt-4 p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-200">
//                 <p className="text-blue-800 text-sm font-medium">
//                   Selected: {availabilityData.workingDays.map(day =>
//                     daysOfWeek.find(d => d.id === day)?.label
//                   ).join(', ')}
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Working Hours */}
//           <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl sm:shadow-2xl border border-white/20">
//             <div className="mb-6">
//               <label className="flex items-center text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">
//                 <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500 mr-3" />
//                 Working Hours *
//                 {isFieldValid('startTime') && isFieldValid('endTime') && (
//                   <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 ml-2" />
//                 )}
//               </label>
//               <p className="text-slate-600 text-sm sm:text-base mb-4">Define your daily consultation hours</p>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//               <div className="space-y-2">
//                 <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
//                   {React.createElement(getTimeIcon(availabilityData.startTime), {
//                     className: "w-4 h-4 mr-2 text-orange-500"
//                   })}
//                   Start Time *
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="time"
//                     value={availabilityData.startTime}
//                     onChange={(e) => handleInputChange('startTime', e.target.value)}
//                     onFocus={() => setFocusedField('startTime')}
//                     onBlur={() => setFocusedField(null)}
//                     className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
//                       focusedField === 'startTime'
//                         ? 'border-orange-400 ring-2 sm:ring-4 ring-orange-100 shadow-lg transform scale-[1.02] sm:scale-105'
//                         : isFieldValid('startTime')
//                         ? 'border-green-300 shadow-md'
//                         : 'border-slate-200 hover:border-slate-300'
//                     }`}
//                     required
//                   />
//                   {isFieldValid('startTime') && (
//                     <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
//                   )}
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
//                   {React.createElement(getTimeIcon(availabilityData.endTime), {
//                     className: "w-4 h-4 mr-2 text-indigo-500"
//                   })}
//                   End Time *
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="time"
//                     value={availabilityData.endTime}
//                     onChange={(e) => handleInputChange('endTime', e.target.value)}
//                     onFocus={() => setFocusedField('endTime')}
//                     onBlur={() => setFocusedField(null)}
//                     className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
//                       focusedField === 'endTime'
//                         ? 'border-indigo-400 ring-2 sm:ring-4 ring-indigo-100 shadow-lg transform scale-[1.02] sm:scale-105'
//                         : isFieldValid('endTime')
//                         ? 'border-green-300 shadow-md'
//                         : 'border-slate-200 hover:border-slate-300'
//                     }`}
//                     required
//                   />
//                   {isFieldValid('endTime') && (
//                     <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Time Duration Indicator */}
//             {availabilityData.startTime && availabilityData.endTime && (
//               <div className="mt-4 p-3 sm:p-4 bg-teal-50 rounded-xl border border-teal-200">
//                 <div className="flex items-center text-teal-800">
//                   <Timer className="w-4 h-4 mr-2 text-teal-600" />
//                   <span className="text-sm font-medium">
//                     Total Hours: {(() => {
//                       const start = new Date(`1970-01-01T${availabilityData.startTime}`);
//                       const end = new Date(`1970-01-01T${availabilityData.endTime}`);
//                       const diff = (end - start) / (1000 * 60 * 60);
//                       return diff > 0 ? `${diff} hours` : 'Invalid time range';
//                     })()}
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Consultation Duration & Time Zone */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

//             {/* Consultation Duration */}
//             <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl sm:shadow-2xl border border-white/20">
//               <label className="flex items-center text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">
//                 <Timer className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 mr-3" />
//                 Consultation Duration *
//                 {isFieldValid('consultationDuration') && (
//                   <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 ml-2" />
//                 )}
//               </label>
//               <p className="text-slate-600 text-sm sm:text-base mb-4">How long is each consultation?</p>

//               <div className="space-y-3">
//                 {consultationDurations.map((duration) => (
//                   <button
//                     key={duration.value}
//                     type="button"
//                     onClick={() => handleInputChange('consultationDuration', duration.value)}
//                     className={`w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 text-left transition-all duration-300 transform hover:scale-[1.02] ${
//                       availabilityData.consultationDuration === duration.value
//                         ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-500 shadow-lg shadow-purple-200'
//                         : 'bg-white/50 backdrop-blur-sm border-slate-200 hover:border-purple-300 hover:bg-purple-50 hover:shadow-md'
//                     }`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <div className="font-semibold text-sm sm:text-base">{duration.label}</div>
//                         <div className={`text-xs sm:text-sm ${
//                           availabilityData.consultationDuration === duration.value ? 'text-purple-100' : 'text-slate-500'
//                         }`}>
//                           {duration.description}
//                         </div>
//                       </div>
//                       {availabilityData.consultationDuration === duration.value && (
//                         <Check className="w-5 h-5 text-white" />
//                       )}
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Time Zone */}
//             <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl sm:shadow-2xl border border-white/20">
//               <label className="flex items-center text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">
//                 <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-500 mr-3" />
//                 Time Zone *
//                 {isFieldValid('timeZone') && (
//                   <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 ml-2" />
//                 )}
//               </label>
//               <p className="text-slate-600 text-sm sm:text-base mb-4">Select your local time zone</p>

//               <div className="relative">
//                 <select
//                   value={availabilityData.timeZone}
//                   onChange={(e) => handleInputChange('timeZone', e.target.value)}
//                   onFocus={() => setFocusedField('timeZone')}
//                   onBlur={() => setFocusedField(null)}
//                   className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none text-base ${
//                     focusedField === 'timeZone'
//                       ? 'border-cyan-400 ring-2 sm:ring-4 ring-cyan-100 shadow-lg transform scale-[1.02] sm:scale-105'
//                       : isFieldValid('timeZone')
//                       ? 'border-green-300 shadow-md'
//                       : 'border-slate-200 hover:border-slate-300'
//                   }`}
//                   required
//                 >
//                   <option value="">Select your time zone</option>
//                   {timeZones.map((tz) => (
//                     <option key={tz.value} value={tz.value}>
//                       {tz.label} ({tz.offset})
//                     </option>
//                   ))}
//                 </select>
//                 {isFieldValid('timeZone') && (
//                   <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Schedule Preview */}
//           {isFieldValid('workingDays') && isFieldValid('startTime') && isFieldValid('endTime') && (
//             <div className="bg-gradient-to-r from-green-50 to-emerald-50 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl border border-green-200">
//               <div className="flex items-center mb-4">
//                 <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
//                   <Check className="w-5 h-5 text-white" />
//                 </div>
//                 <h3 className="text-lg sm:text-xl font-bold text-green-900">Schedule Preview</h3>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-green-800">
//                 <div className="space-y-3">
//                   <div className="flex items-center">
//                     <Calendar className="w-4 h-4 mr-2 text-green-600" />
//                     <span className="font-medium text-sm sm:text-base">
//                       {availabilityData.workingDays.map(day =>
//                         daysOfWeek.find(d => d.id === day)?.label
//                       ).join(', ')}
//                     </span>
//                   </div>
//                   <div className="flex items-center">
//                     <Clock className="w-4 h-4 mr-2 text-green-600" />
//                     <span className="font-medium text-sm sm:text-base">
//                       {availabilityData.startTime} - {availabilityData.endTime}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="space-y-3">
//                   {availabilityData.consultationDuration && (
//                     <div className="flex items-center">
//                       <Timer className="w-4 h-4 mr-2 text-green-600" />
//                       <span className="font-medium text-sm sm:text-base">
//                         {availabilityData.consultationDuration} minutes per consultation
//                       </span>
//                     </div>
//                   )}
//                   {availabilityData.timeZone && (
//                     <div className="flex items-center">
//                       <Globe className="w-4 h-4 mr-2 text-green-600" />
//                       <span className="font-medium text-sm sm:text-base">
//                         {timeZones.find(tz => tz.value === availabilityData.timeZone)?.label}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Flexibility Note */}
//           <div className="bg-gradient-to-r from-purple-50 to-pink-50 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl border border-purple-200">
//             <div className="flex items-start">
//               <MapPin className="w-5 h-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
//               <div>
//                 <h3 className="text-base sm:text-lg font-semibold text-purple-900 mb-2">Scheduling Flexibility</h3>
//                 <p className="text-purple-800 text-sm sm:text-base">
//                   Your availability can be updated anytime after registration. Emergency consultations
//                   and special appointments can be scheduled outside regular hours. Our intelligent
//                   scheduling system will efficiently manage your calendar and patient bookings.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Mobile spacing */}
//         <div className="h-20 sm:h-8"></div>
//       </div>
//     </div>
//   );
// };

// export default AvailabilityStep;
