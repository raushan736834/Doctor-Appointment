import React, { useState, useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Camera,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit3,
  Check,
} from "lucide-react";
import { useAuth } from "../../../component/GlobalComponent/AuthProvider";
import { useApiService } from "../../../hooks/useAuthWithAxios";

const PersonalInfoSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  dob: Yup.date()
    .max(new Date(), "Date of birth cannot be in the future")
    .required("Date of birth is required"),
  gender: Yup.string()
    .oneOf(
      ["male", "female", "other", "prefer-not-to-say"],
      "Please select a valid gender"
    )
    .required("Gender is required"),
  address: Yup.string()
    .min(5, "Address must be at least 5 characters")
    .required("Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  pincode: Yup.string()
    .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
    .required("Pincode is required"),
});

const PersonalInfoStep = ({ updateData, data, onSubmit }) => {
  const [photoPreview, setPhotoPreview] = useState(data?.profileImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    if (data?.profileImage) {
      setPhotoPreview(data.profileImage);
    }
  }, [data?.profileImage]);

  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const fullname = user?.fullname || "";
  const splitName = fullname.split(" ");
  const api = useApiService();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      setSubmitting(true);
      
      // Check if any values have changed
      const hasChanges = Object.keys(values).some(key => {
        // Skip profilePhoto comparison if it's a File object
        if (key === 'profilePhoto' && values[key] instanceof File) return true;
        return values[key] !== data?.[key];
      });

      // If no changes and data exists, skip API call
      if (!hasChanges && data) {
        if (onSubmit) {
          await onSubmit({ ...values, __skipApi: true });
        }
        return true;
      }

      const formData = new FormData();

      // Create a copy of values without the profilePhoto
      const doctorData = { ...values };
      delete doctorData.profilePhoto;

      // Append doctor data as JSON string
      formData.append("doctor", JSON.stringify(doctorData));

      // Append profile image if exists
      if (values.profilePhoto instanceof File) {
        formData.append("profileImage", values.profilePhoto);
      }

      const response = await api.put("api/doctors/personalDetails", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.success) {
        if (onSubmit) {
          await onSubmit(values);
        }
        return true;
      } else {
        setErrors({
          submit: response.data?.message || "Failed to submit form",
        });
        return false;
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setErrors({
        submit: "An error occurred while submitting the form",
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhotoUpload = (setFieldValue) => async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          setPhotoPreview(result);
          setFieldValue("profilePhoto", file);
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error uploading photo:", error);
        setIsUploading(false);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Mobile-Optimized Animated Header */}
        <div className="text-center mb-8 sm:mb-12 relative">
          <div className="absolute -top-4 sm:-top-6 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-1 bg-gradient-to-r
           from-blue-500 to-purple-500 rounded-full animate-pulse"></div>

          <div
            className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500
             to-purple-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-lg transform 
          rotate-3 hover:rotate-0 transition-transform duration-300"
          >
            <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text
           text-transparent mb-2 sm:mb-3 leading-tight">
            Personal Information
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-medium px-2">
            Tell us about yourself to get started
          </p>

          {/* Progress Indicator */}
          <div className="flex justify-center mt-4 sm:mt-6">
            <div className="flex space-x-1 sm:space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-300 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-200 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>

        <Formik
          initialValues={{
            profilePhoto: data?.profileImage || "",
            firstName: data?.firstName || splitName[0] || "",
            lastName: data?.lastName || splitName[1] || "",
            email: data?.email || user?.email || "",
            phone: data?.phone || "",
            dob: data?.dob || "",
            gender: data?.gender || "",
            address: data?.address || "",
            city: data?.city || "",
            state: data?.state || "",
            pincode: data?.pincode || "",
          }}
          validationSchema={PersonalInfoSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
          }) => (
            <Form data-formik-form>
              {/* Mobile-Optimized Profile Photo Section */}
              <div className="flex justify-center mb-8 sm:mb-12">
                <div className="relative group">
                  <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-400 via-purple-500
                   to-pink-500 p-1 shadow-xl sm:shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <div className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-white">
                      {photoPreview || values.profilePhoto ? (
                        <img
                          src={`data:image/jpeg;base64,${photoPreview}` || `data:image/jpeg;base64,${values.profilePhoto}`}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                          <Camera className="w-10 h-10 sm:w-16 sm:h-16 text-slate-400" />
                        </div>
                      )}

                      {isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-2xl sm:rounded-3xl">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 sm:border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center cursor-pointer hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg transform hover:scale-110 group-hover:rotate-12"
                  >
                    <Edit3 className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload(setFieldValue)}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Mobile-Optimized Form Fields */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl sm:shadow-2xl border border-white/20">
                <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                      <User className="w-4 h-4 mr-2 text-blue-500" />
                      First Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("firstName")}
                        onBlur={(e) => {
                          handleBlur(e);
                          setFocusedField(null);
                        }}
                        className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                          focusedField === "firstName"
                            ? "border-blue-400 ring-2 sm:ring-4 ring-blue-100 shadow-lg transform scale-[1.02] sm:scale-105"
                            : touched.firstName && !errors.firstName
                            ? "border-green-300 shadow-md"
                            : errors.firstName && touched.firstName
                            ? "border-red-300"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                        placeholder="Enter your first name"
                      />
                      {touched.firstName && errors.firstName && (
                        <div className="mt-1 text-xs text-red-600">
                          {errors.firstName}
                        </div>
                      )}
                      {touched.firstName && !errors.firstName && (
                        <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      )}
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                      <User className="w-4 h-4 mr-2 text-blue-500" />
                      Last Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("lastName")}
                        onBlur={(e) => {
                          handleBlur(e);
                          setFocusedField(null);
                        }}
                        className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                          focusedField === "lastName"
                            ? "border-blue-400 ring-2 sm:ring-4 ring-blue-100 shadow-lg transform scale-[1.02] sm:scale-105"
                            : touched.lastName && !errors.lastName
                            ? "border-green-300 shadow-md"
                            : errors.lastName && touched.lastName
                            ? "border-red-300"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                        placeholder="Enter your last name"
                      />
                      {touched.lastName && errors.lastName && (
                        <div className="mt-1 text-xs text-red-600">
                          {errors.lastName}
                        </div>
                      )}
                      {touched.lastName && !errors.lastName && (
                        <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2 sm:col-span-2">
                    <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                      <Mail className="w-4 h-4 mr-2 text-purple-500" />
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={(e) => {
                          handleBlur(e);
                          setFocusedField(null);
                        }}
                        className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base cursor-not-allowed ${
                          focusedField === "email"
                            ? "border-purple-400 ring-2 sm:ring-4 ring-purple-100 shadow-lg transform scale-[1.02] sm:scale-105"
                            : touched.email && !errors.email
                            ? "border-green-300 shadow-md"
                            : errors.email && touched.email
                            ? "border-red-300"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                        placeholder="your.email@example.com"
                        disabled
                      />
                      {touched.email && errors.email && (
                        <div className="mt-1 text-xs text-red-600">
                          {errors.email}
                        </div>
                      )}
                      {touched.email && !errors.email && (
                        <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                      <Phone className="w-4 h-4 mr-2 text-green-500" />
                      Phone Number *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("phone")}
                        onBlur={(e) => {
                          handleBlur(e);
                          setFocusedField(null);
                        }}
                        className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                          focusedField === "phone"
                            ? "border-green-400 ring-2 sm:ring-4 ring-green-100 shadow-lg transform scale-[1.02] sm:scale-105"
                            : touched.phone && !errors.phone
                            ? "border-green-300 shadow-md"
                            : errors.phone && touched.phone
                            ? "border-red-300"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                        placeholder="+1 (555) 123-4567"
                      />
                      {touched.phone && errors.phone && (
                        <div className="mt-1 text-xs text-red-600">
                          {errors.phone}
                        </div>
                      )}
                      {touched.phone && !errors.phone && (
                        <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      )}
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                      <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                      Date of Birth *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="dob"
                        value={values.dob}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("dob")}
                        onBlur={(e) => {
                          handleBlur(e);
                          setFocusedField(null);
                        }}
                        className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                          focusedField === "dob"
                            ? "border-orange-400 ring-2 sm:ring-4 ring-orange-100 shadow-lg transform scale-[1.02] sm:scale-105"
                            : touched.dob && !errors.dob
                            ? "border-green-300 shadow-md"
                            : errors.dob && touched.dob
                            ? "border-red-300"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      />
                      {touched.dob && errors.dob && (
                        <div className="mt-1 text-xs text-red-600">
                          {errors.dob}
                        </div>
                      )}
                      {touched.dob && !errors.dob && (
                        <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      )}
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-2 sm:col-span-2">
                    <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                      <User className="w-4 h-4 mr-2 text-pink-500" />
                      Gender *
                    </label>
                    <div className="relative">
                      <select
                        name="gender"
                        value={values.gender}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("gender")}
                        onBlur={(e) => {
                          handleBlur(e);
                          setFocusedField(null);
                        }}
                        className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none text-base ${
                          focusedField === "gender"
                            ? "border-pink-400 ring-2 sm:ring-4 ring-pink-100 shadow-lg transform scale-[1.02] sm:scale-105"
                            : touched.gender && !errors.gender
                            ? "border-green-300 shadow-md"
                            : errors.gender && touched.gender
                            ? "border-red-300"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">
                          Prefer not to say
                        </option>
                      </select>
                      {touched.gender && errors.gender && (
                        <div className="mt-1 text-xs text-red-600">
                          {errors.gender}
                        </div>
                      )}
                      {touched.gender && !errors.gender && (
                        <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2 space-y-2">
                    <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                      <MapPin className="w-4 h-4 mr-2 text-red-500" />
                      Street Address *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="address"
                        value={values.address}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("address")}
                        onBlur={(e) => {
                          handleBlur(e);
                          setFocusedField(null);
                        }}
                        className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                          focusedField === "address"
                            ? "border-red-400 ring-2 sm:ring-4 ring-red-100 shadow-lg transform scale-[1.02] sm:scale-105"
                            : touched.address && !errors.address
                            ? "border-green-300 shadow-md"
                            : errors.address && touched.address
                            ? "border-red-300"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                        placeholder="123 Main Street, Apt 4B"
                      />
                      {touched.address && errors.address && (
                        <div className="mt-1 text-xs text-red-600">
                          {errors.address}
                        </div>
                      )}
                      {touched.address && !errors.address && (
                        <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      )}
                    </div>
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                      <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                      City *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="city"
                        value={values.city}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("city")}
                        onBlur={(e) => {
                          handleBlur(e);
                          setFocusedField(null);
                        }}
                        className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                          focusedField === "city"
                            ? "border-indigo-400 ring-2 sm:ring-4 ring-indigo-100 shadow-lg transform scale-[1.02] sm:scale-105"
                            : touched.city && !errors.city
                            ? "border-green-300 shadow-md"
                            : errors.city && touched.city
                            ? "border-red-300"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                        placeholder="Enter your city"
                      />
                      {touched.city && errors.city && (
                        <div className="mt-1 text-xs text-red-600">
                          {errors.city}
                        </div>
                      )}
                      {touched.city && !errors.city && (
                        <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      )}
                    </div>
                  </div>

                  {/* State */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                      <MapPin className="w-4 h-4 mr-2 text-teal-500" />
                      State *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="state"
                        value={values.state}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("state")}
                        onBlur={(e) => {
                          handleBlur(e);
                          setFocusedField(null);
                        }}
                        className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                          focusedField === "state"
                            ? "border-teal-400 ring-2 sm:ring-4 ring-teal-100 shadow-lg transform scale-[1.02] sm:scale-105"
                            : touched.state && !errors.state
                            ? "border-green-300 shadow-md"
                            : errors.state && touched.state
                            ? "border-red-300"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                        placeholder="Enter your state"
                      />
                      {touched.state && errors.state && (
                        <div className="mt-1 text-xs text-red-600">
                          {errors.state}
                        </div>
                      )}
                      {touched.state && !errors.state && (
                        <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      )}
                    </div>
                  </div>

                  {/* PinCode */}
                  <div className="space-y-2 sm:col-span-2">
                    <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                      <MapPin className="w-4 h-4 mr-2 text-cyan-500" />
                      PinCode *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="pincode"
                        value={values.pincode}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("pincode")}
                        onBlur={(e) => {
                          handleBlur(e);
                          setFocusedField(null);
                        }}
                        className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                          focusedField === "pincode"
                            ? "border-cyan-400 ring-2 sm:ring-4 ring-cyan-100 shadow-lg transform scale-[1.02] sm:scale-105"
                            : touched.pincode && !errors.pincode
                            ? "border-green-300 shadow-md"
                            : errors.pincode && touched.pincode
                            ? "border-red-300"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                        placeholder="123456"
                      />
                      {touched.pincode && errors.pincode && (
                        <div className="mt-1 text-xs text-red-600">
                          {errors.pincode}
                        </div>
                      )}
                      {touched.pincode && !errors.pincode && (
                        <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile-Optimized Completion Status */}
              <div className="mt-6 sm:mt-8 text-center">
                <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
                  <div className="flex space-x-1 mr-2 sm:mr-3">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors duration-300 ${
                          [
                            values.firstName && !errors.firstName,
                            values.lastName && !errors.lastName,
                            values.email && !errors.email,
                            values.phone && !errors.phone,
                            values.dob && !errors.dob,
                            values.gender && !errors.gender,
                            values.address && !errors.address,
                            values.city && !errors.city,
                            values.state && !errors.state,
                            values.pincode && !errors.pincode,
                          ][i]
                            ? "bg-green-400"
                            : "bg-slate-200"
                        }`}
                      ></div>
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-slate-600">
                    {
                      [
                        values.firstName && !errors.firstName,
                        values.lastName && !errors.lastName,
                        values.email && !errors.email,
                        values.phone && !errors.phone,
                        values.dob && !errors.dob,
                        values.gender && !errors.gender,
                        values.address && !errors.address,
                        values.city && !errors.city,
                        values.state && !errors.state,
                        values.pincode && !errors.pincode,
                      ].filter(Boolean).length
                    }
                    /10 completed
                  </span>
                </div>
              </div>
              {/* Submit button that will be clicked programmatically */}
              <button
                type="submit"
                style={{ position: "absolute", left: "-9999px" }}
                aria-hidden="true"
              >
                Submit
              </button>

              {/* Mobile spacing for navigation */}
              <div className="h-20 sm:h-8"></div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PersonalInfoStep;