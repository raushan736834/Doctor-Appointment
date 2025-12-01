import React, { useState } from "react";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Clock,
  Calendar,
  MapPin,
  Check,
  Timer,
  Hospital,
  Building,
  Phone,
  Mail
} from "lucide-react";

const AvailabilityStep = ({ data: initialData = {}, updateData, onSubmit }) => {
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

  const [focusedField, setFocusedField] = useState(null);
  const defaultOperatingHours = {
    monday: { open: "09:00", close: "17:00", isClosedToday: false },
    tuesday: { open: "09:00", close: "17:00", isClosedToday: false },
    wednesday: { open: "09:00", close: "17:00", isClosedToday: false },
    thursday: { open: "09:00", close: "17:00", isClosedToday: false },
    friday: { open: "09:00", close: "17:00", isClosedToday: false },
    saturday: { open: "09:00", close: "14:00", isClosedToday: false },
    sunday: { open: "10:00", close: "16:00", isClosedToday: true },
  };

  // If backend provides operatingHours as an array, map it to the form's object shape
  const mapOperatingHoursArrayToObject = (arr) => {
    if (!Array.isArray(arr)) return null;
    // start with defaults so any missing days stay sensible
    const result = { ...defaultOperatingHours };
    arr.forEach((item) => {
      if (!item || !item.days) return;
      const key = String(item.days).toLowerCase();
      if (!result[key]) return;
      const isClosedFlag = item.isClosedToday || false;
      result[key] = {
        open: item.open || result[key].open,
        close: item.close || result[key].close,
        isClosedToday: !!isClosedFlag,
      };
    });
    return result;
  };

  const mappedOperatingHours = mapOperatingHoursArrayToObject(initialData?.operatingHours) || defaultOperatingHours;
  const initialValues = {
    clinicName: initialData?.clinicName || "",
    clinicType: initialData?.clinicType || "",
    clinicPhone: initialData?.clinicPhone || "",
    clinicEmail: initialData?.clinicEmail || "",
    clinicWebsite: initialData?.clinicWebsite || "",
    clinicAddress: initialData?.clinicAddress || "",
    clinicCity: initialData?.clinicCity || "",
    clinicState: initialData?.clinicState || "",
    clinicPinCode: initialData?.clinicPincode || initialData?.clinicZipCode || "",
    establishedYear: initialData?.establishedYear || "",
    availableFacilities: initialData?.availableFacilities || [],
    consultationDuration: initialData?.consultationDuration || "",
    operatingHours: mappedOperatingHours,
  };
  const updateDataLocal = (updates) => {
    if (typeof updateData === 'function') updateData(updates);
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

  // Yup validation schema (basic rules, tweak as needed)
  const validationSchema = Yup.object().shape({
    clinicName: Yup.string().required('Clinic name is required'),
    clinicType: Yup.string().required('Clinic type is required'),
    establishedYear: Yup.number()
      .min(1900, 'Year must be after 1900')
      .max(new Date().getFullYear(), 'Year cannot be in the future')
      .required('Established year is required'),
    clinicPhone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone must be 10 digits')
      .required('Clinic phone is required'),
    clinicEmail: Yup.string().email('Invalid email').required('Clinic email is required'),
    clinicAddress: Yup.string().required('Clinic address is required'),
    clinicCity: Yup.string().required('City is required'),
    clinicState: Yup.string().required('State is required'),
    clinicPinCode: Yup.string().matches(/^[0-9]{5,6}$/, 'Pincode must be 5 or 6 digits').required('Pin code is required'),
    consultationDuration: Yup.string().required('Consultation duration is required'),
    operatingHours: Yup.object()
      .test('at-least-one-open', 'At least one working day must be open', value => {
        if (!value) return false;
        return Object.values(value).some(day => !day?.isClosedToday);
      })
      .shape(
        dayNames.reduce((acc, day) => {
          acc[day] = Yup.object().shape({
            isClosedToday: Yup.boolean(),
            open: Yup.string().when('isClosedToday', (isClosedToday, schema) => {
              return isClosedToday === false ? schema.required('Open time is required') : schema.notRequired();
            }),
            close: Yup.string().when('isClosedToday', (isClosedToday, schema) => {
              return isClosedToday === false ? schema.required('Close time is required') : schema.notRequired();
            }),
          });
          return acc;
        }, {})
      )
  });

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
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              enableReinitialize
              onSubmit={(values) => {
                // Transform form values into backend DTO shape (DoctorClinicInfo + OperationHours[])
                const operatingHoursArray = dayNames.map((day) => {
                  const h = values.operatingHours?.[day] || defaultOperatingHours[day];
                  return {
                    days: day.toUpperCase(), // matches Enum string in backend
                    open: h.open || "",
                    close: h.close || "",
                    isClosedToday: !!h.isClosedToday,
                  };
                });

                const payload = {
                  clinicName: values.clinicName || "",
                  clinicType: values.clinicType || "",
                  clinicPhone: values.clinicPhone || "",
                  clinicEmail: values.clinicEmail || "",
                  establishedYear: values.establishedYear ? String(values.establishedYear) : "",
                  clinicAddress: values.clinicAddress || "",
                  clinicCity: values.clinicCity || "",
                  clinicState: values.clinicState || "",
                  clinicPincode: values.clinicPinCode || "",
                  consultationDuration: values.consultationDuration || "",
                  operatingHours: operatingHoursArray,
                };

                // Update parent-local copy then submit payload to parent handler
                updateDataLocal(payload);
                if (typeof onSubmit === 'function') onSubmit(payload);
              }}
            >
              {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
                <Form data-formik-form>
                  <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2">
                    {/* Clinic Name */}
                    <div className="space-y-2 sm:col-span-2">
                      <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                        <Building className="w-4 h-4 mr-2 text-blue-500" />
                        Clinic Name *
                      </label>
                      <div className="relative">
                        <input
                          name="clinicName"
                          type="text"
                          value={values.clinicName}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("clinicName")}
                          onBlur={(e) => { handleBlur(e); setFocusedField(null); }}
                          className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                            focusedField === "clinicName"
                              ? "border-blue-400 ring-2 sm:ring-4 ring-blue-100 shadow-lg transform scale-[1.02] sm:scale-105"
                              : values.clinicName
                              ? "border-green-300 shadow-md"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                          placeholder="Enter your clinic name"
                        />
                        {values.clinicName && (
                          <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                        )}
                        {errors.clinicName && touched.clinicName && (
                          <div className="text-xs text-red-500 mt-1">{errors.clinicName}</div>
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
                          name="clinicType"
                          value={values.clinicType}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("clinicType")}
                          onBlur={(e) => { handleBlur(e); setFocusedField(null); }}
                          className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none text-base ${
                            focusedField === "clinicType"
                              ? "border-purple-400 ring-2 sm:ring-4 ring-purple-100 shadow-lg transform scale-[1.02] sm:scale-105"
                              : values.clinicType
                              ? "border-green-300 shadow-md"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <option value="">Select clinic type</option>
                          {clinicTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        {values.clinicType && (
                          <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                        )}
                        {errors.clinicType && touched.clinicType && (
                          <div className="text-xs text-red-500 mt-1">{errors.clinicType}</div>
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
                          name="establishedYear"
                          type="number"
                          value={values.establishedYear}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("establishedYear")}
                          onBlur={(e) => { handleBlur(e); setFocusedField(null); }}
                          className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                            focusedField === "establishedYear"
                              ? "border-orange-400 ring-2 sm:ring-4 ring-orange-100 shadow-lg transform scale-[1.02] sm:scale-105"
                              : values.establishedYear
                              ? "border-green-300 shadow-md"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                          placeholder="2020"
                          min="1900"
                          max={new Date().getFullYear()}
                        />
                        {values.establishedYear && (
                          <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                        )}
                        {errors.establishedYear && touched.establishedYear && (
                          <div className="text-xs text-red-500 mt-1">{errors.establishedYear}</div>
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
                          name="clinicPhone"
                          type="tel"
                          value={values.clinicPhone}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("clinicPhone")}
                          onBlur={(e) => { handleBlur(e); setFocusedField(null); }}
                          className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                            focusedField === "clinicPhone"
                              ? "border-green-400 ring-2 sm:ring-4 ring-green-100 shadow-lg transform scale-[1.02] sm:scale-105"
                              : values.clinicPhone
                              ? "border-green-300 shadow-md"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                          placeholder="+91 98765 43210"
                        />
                        {values.clinicPhone && (
                          <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                        )}
                        {errors.clinicPhone && touched.clinicPhone && (
                          <div className="text-xs text-red-500 mt-1">{errors.clinicPhone}</div>
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
                          name="clinicEmail"
                          type="email"
                          value={values.clinicEmail}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("clinicEmail")}
                          onBlur={(e) => { handleBlur(e); setFocusedField(null); }}
                          className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                            focusedField === "clinicEmail"
                              ? "border-red-400 ring-2 sm:ring-4 ring-red-100 shadow-lg transform scale-[1.02] sm:scale-105"
                              : values.clinicEmail
                              ? "border-green-300 shadow-md"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                          placeholder="clinic@example.com"
                        />
                        {values.clinicEmail && (
                          <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                        )}
                        {errors.clinicEmail && touched.clinicEmail && (
                          <div className="text-xs text-red-500 mt-1">{errors.clinicEmail}</div>
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
                          name="clinicAddress"
                          type="text"
                          value={values.clinicAddress}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("clinicAddress")}
                          onBlur={(e) => { handleBlur(e); setFocusedField(null); }}
                          className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                            focusedField === "clinicAddress"
                              ? "border-cyan-400 ring-2 sm:ring-4 ring-cyan-100 shadow-lg transform scale-[1.02] sm:scale-105"
                              : values.clinicAddress
                              ? "border-green-300 shadow-md"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                          placeholder="123 Medical Plaza, Suite 101"
                        />
                        {values.clinicAddress && (
                          <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                        )}
                        {errors.clinicAddress && touched.clinicAddress && (
                          <div className="text-xs text-red-500 mt-1">{errors.clinicAddress}</div>
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
                          name="clinicCity"
                          type="text"
                          value={values.clinicCity}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("clinicCity")}
                          onBlur={(e) => { handleBlur(e); setFocusedField(null); }}
                          className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                            focusedField === "clinicCity"
                              ? "border-pink-400 ring-2 sm:ring-4 ring-pink-100 shadow-lg transform scale-[1.02] sm:scale-105"
                              : values.clinicCity
                              ? "border-green-300 shadow-md"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                          placeholder="Enter city"
                        />
                        {values.clinicCity && (
                          <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                        )}
                        {errors.clinicCity && touched.clinicCity && (
                          <div className="text-xs text-red-500 mt-1">{errors.clinicCity}</div>
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
                          name="clinicState"
                          type="text"
                          value={values.clinicState}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("clinicState")}
                          onBlur={(e) => { handleBlur(e); setFocusedField(null); }}
                          className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                            focusedField === "clinicState"
                              ? "border-emerald-400 ring-2 sm:ring-4 ring-emerald-100 shadow-lg transform scale-[1.02] sm:scale-105"
                              : values.clinicState
                              ? "border-green-300 shadow-md"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                          placeholder="Enter state"
                        />
                        {values.clinicState && (
                          <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                        )}
                        {errors.clinicState && touched.clinicState && (
                          <div className="text-xs text-red-500 mt-1">{errors.clinicState}</div>
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
                          name="clinicPinCode"
                          type="text"
                          value={values.clinicPinCode}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("clinicPinCode")}
                          onBlur={(e) => { handleBlur(e); setFocusedField(null); }}
                          className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                            focusedField === "clinicPinCode"
                              ? "border-violet-400 ring-2 sm:ring-4 ring-violet-100 shadow-lg transform scale-[1.02] sm:scale-105"
                              : values.clinicPinCode
                              ? "border-green-300 shadow-md"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                          placeholder="123456"
                        />
                        {values.clinicPinCode && (
                          <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                        )}
                        {errors.clinicPinCode && touched.clinicPinCode && (
                          <div className="text-xs text-red-500 mt-1">{errors.clinicPinCode}</div>
                        )}
                      </div>
                    </div>

                    {/* Operating Hours - Responsive Grid Layout */}
                    <div className="sm:col-span-2 space-y-4">
                      <label className="flex items-center text-sm font-semibold text-slate-700">
                        <Clock className="w-4 h-4 mr-2 text-green-500" />
                        Operating Hours
                      </label>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {dayNames.map((day, index) => (
                          <div
                            key={day}
                            className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl border border-slate-200"
                          >
                            <div className="flex items-center gap-3 sm:w-24">
                              <input
                                type="checkbox"
                                checked={!values.operatingHours[day]?.isClosedToday}
                                onChange={(e) => setFieldValue(`operatingHours.${day}.isClosedToday`, !e.target.checked)}
                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                              />
                              <span className="text-sm font-medium text-slate-700">
                                {dayLabels[index]}
                              </span>
                            </div>

                            {!values.operatingHours[day]?.isClosedToday && (
                              <div className="flex items-center gap-2 flex-1">
                                <div className="flex flex-col w-1/2">
                                  <input
                                    aria-label={`${day}-open`}
                                    type="time"
                                    value={values.operatingHours[day]?.open}
                                    onChange={(e) => setFieldValue(`operatingHours.${day}.open`, e.target.value)}
                                    className="px-1 py-1.5 border border-slate-300 rounded-lg text-xs focus:border-green-400 focus:ring-2 focus:ring-green-100"
                                  />
                                  {errors.operatingHours && errors.operatingHours[day] && errors.operatingHours[day].open && (
                                    <div className="text-xs text-red-500 mt-1">{errors.operatingHours[day].open}</div>
                                  )}
                                </div>
                                <span className="text-slate-500 text-xs">to</span>
                                <div className="flex flex-col w-1/2">
                                  <input
                                    aria-label={`${day}-close`}
                                    type="time"
                                    value={values.operatingHours[day]?.close}
                                    onChange={(e) => setFieldValue(`operatingHours.${day}.close`, e.target.value)}
                                    className="px-1 py-1.5 border border-slate-300 rounded-lg text-xs focus:border-green-400 focus:ring-2 focus:ring-green-100"
                                  />
                                  {errors.operatingHours && errors.operatingHours[day] && errors.operatingHours[day].close && (
                                    <div className="text-xs text-red-500 mt-1">{errors.operatingHours[day].close}</div>
                                  )}
                                </div>
                              </div>
                            )}

                            {values.operatingHours[day]?.isClosedToday && (
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
                          {values.consultationDuration && (
                            <Check className="w-5 h-5 text-green-500 ml-2" />
                          )}
                        </label>
                        <p className="text-slate-600 text-sm mb-3">
                          How long is each consultation?
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                          {consultationDurations.map((duration) => (
                            <button
                              key={duration.value}
                              type="button"
                              onClick={() => setFieldValue('consultationDuration', duration.value)}
                              className={`p-2.5 rounded-lg border-2 text-center transition-all duration-300 transform hover:scale-[1.02] ${
                                values.consultationDuration === duration.value
                                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-500 shadow-md"
                                  : "bg-white/50 backdrop-blur-sm border-slate-200 hover:border-purple-300 hover:bg-purple-50 hover:shadow-md"
                              }`}
                            >
                              <div className="flex flex-col items-center justify-center">
                                <div className="font-semibold text-sm">
                                  {duration.label}
                                </div>
                                <div className={`text-xs mt-1 ${values.consultationDuration === duration.value ? "text-purple-100" : "text-slate-500"}`}>
                                  {duration.description}
                                </div>
                                {values.consultationDuration === duration.value && (
                                  <Check className="w-4 h-4 text-white mt-1" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                        {errors.consultationDuration && touched.consultationDuration && (
                          <div className="text-xs text-red-500 mt-2">{errors.consultationDuration}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Hidden submit button so parent Next/DoctorOnboarding can find and click it */}
                  <button type="submit" className="sr-only" aria-hidden="true">Submit</button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityStep;