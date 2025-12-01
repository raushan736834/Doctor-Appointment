import React, { useRef, useState, useEffect } from "react";
import defaultImage from "../../assets/img/defaultClinicImage.jpg";
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  User,
  Mail,
  Phone,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  Building2,
  GraduationCap,
  Edit3,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import useDate from "../../hooks/useDate";
import { format } from "date-fns";
import { AppointmentStatus } from "../../constants/slots";
import useRazorpayScript from "../../hooks/useRazorpayScript";
import { useApiService, useAuthWithAxios } from "../../hooks/useAuthWithAxios";
import { CoolLoader } from "../Common/LoaderApp";

const FETCH_DOCTOR_DATA = "/api/public/getDoctor";
const BOOKED_URL = "/appointment/book-appointment";

const AppointmentDetails = () => {
  const api = useApiService();
  const errRef = useRef();
  const { user } = useAuthWithAxios();
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data } = useDate();
  const date = data.selectedDate;
  console.log(date);
  const time = data.selectedTimeSlot;
  console.log(time)
  const [specialization, setSpecialization] = useState("");
  console.log(specialization);
  const [doctorData, setDoctorData] = useState({});
  const { id } = useParams();
  const [selectedPatient, setSelectedPatient] = useState("myself");
  const [selectedPayment, setSelectedPayment] = useState("online");
  const email = user?.email;
  const fetchUserFullname = user?.fullname;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useRazorpayScript();

  const fetchDoctorDetails = async () => {
    const body = {
      doctorId : id
    };
    setIsLoading(true);
    try {
      const response = await api.post(FETCH_DOCTOR_DATA, body);
      if(response?.success){
        const data = response?.data;
        setDoctorData(data);
        setSpecialization(data?.professional?.specialization);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorDetails();
  }, [id]);

  const [formData, setFormData] = useState({
    fullName: "" || fetchUserFullname,
    patientFullName: "",
    patientEmail: "",
    phone: "",
  });

  const formatDate = (dateString) => {
    // Attach current year (or custom year if needed)
    const currentYear = new Date().getFullYear();
    const date = new Date(`${dateString} ${currentYear}`);

    return date.toLocaleDateString("en-US", {
      weekday: "long", // e.g., Tuesday
      month: "long", // e.g., September
      day: "numeric", // e.g., 2
      year: "numeric", // e.g., 2025
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrMsg("");
    setIsLoading(true);

    try {
      const receipt = uuid();
      // Add current year to the date before formatting
      const currentYear = new Date().getFullYear();
      const dateWithYear = new Date(`${date} ${currentYear}`);
      const formattedDate = format(dateWithYear, "yyyy-MM-dd");
      const appointmentId = uuid();

      const appointmentBooking = {
        appointmentId,
        email: selectedPatient === "myself" ? email : formData.patientEmail,
        status: AppointmentStatus.BOOKED,
        time,
        date: formattedDate,
        fullName:
          selectedPatient === "myself"
            ? formData.fullName
            : formData.patientFullName,
        doctor: { doctorId: id },
        patientEmail:
          selectedPatient === "someone-else" ? formData.patientEmail : "",
        selectedPayment:
          selectedPayment === "online" ? "Online Payment" : "Pay at Clinic",
        phone: formData.phone,
        selectedPatient:
          selectedPatient === "myself" ? fetchUserFullname : "someone else",
      };

      if (selectedPayment === "online") {
        // Online Payment with Razorpay
        const paymentInitData = {
          amount: doctorData?.professional?.consultationFees * 100, // paise
          currency: "INR",
          receipt: receipt,
        };

        const razorResponse = await api.post(
          "/api/payment/create-order",
          paymentInitData
        );
        const { orderId, amount, currency, key } = razorResponse.data;

        if (!window.Razorpay) {
          setErrMsg("Razorpay SDK not loaded");
          return;
        }

        const options = {
          key,
          amount,
          currency,
          name: "HeyDoctor",
          description: "Consultation Fee",
          image: "/logo.png",
          order_id: orderId,
          handler: async function (response) {
            const {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
            } = response;

            const verificationData = {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
            };

            const verifyResponse = await api.post(
              "/api/payment/verify",
              verificationData
            );

            if (verifyResponse.data.status !== "success") {
              setErrMsg("Payment verification failed!");
              return;
            }

            const body = {
              formData: appointmentBooking,
              payment: {
                receiptId: receipt,
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                doctorId: id,
              },
            };

            console.log("Sending payload:", body);
            setIsLoading(true);
            const res = await api.post(BOOKED_URL, body);
            console.log("Booking response:", res);
            navigate("/thankyou", {
              state: {
                date,
                time,
                doctorName: doctorData?.firstName +" "+ doctorData?.lastName,
                clinicName: doctorData?.clinicInfos?.clinicName,
              },
              replace: true
            });
          },
          prefill: {
            name: appointmentBooking.fullName,
            email: appointmentBooking.email,
            contact: formData.phone,
          },
          notes: {
            appointmentId,
            doctorId: id,
          },
          theme: {
            color: "#6B46C1",
          },
          modal: {
            ondismiss: function () {
              setErrMsg("Payment cancelled. Please try again.");
              setIsSubmitting(false);
              setIsLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Pay at Clinic flow
        const body = {
          formData: appointmentBooking,
          payment: null,
        };

        console.log("Sending payload:", body);
        const res = await api.post(BOOKED_URL, body);
        console.log("Booking response:", res);
        navigate("/thankyou", {
          state: {
            date,
            time,
            doctorName: doctorData?.firstName +" "+ doctorData?.lastName,
            clinicName: doctorData?.clinicInfos?.clinicName,
          },
          replace : true
        });
      }
    } catch (err) {
      console.error(err);
      setErrMsg(
        err?.response?.status === 500
          ? "Internal Server Error"
          : "Booking Failed"
      );
      errRef.current?.focus();
    } finally {      
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    if (selectedPatient === "myself") {
      return formData.fullName.trim() !== "";
    } else {
      return (
        formData.patientFullName.trim() !== "" &&
        formData.patientEmail.trim() !== ""
      );
    }
  };

  if (isLoading) {
    return <CoolLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Appointment Summary Card */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r h-[104px] from-blue-600 via-purple-600 to-pink-600 p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Stethoscope className="w-7 h-7" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Appointment Summary</h1>
                    <p className="text-blue-100 text-sm opacity-90">
                      Review your booking details
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Date & Time Card */}
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl"></div>
                  <div className="relative flex items-center justify-between p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">
                          Appointment Date & Time
                        </p>
                        <p className="font-bold text-gray-900 text-lg">
                          {formatDate(date)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-semibold text-gray-700">
                            {time} •{" "}
                            {/* {period.charAt(0).toUpperCase() + period.slice(1)}{" "} */}
                            {/* {getPeriodIcon(period)} */}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link
                      to={"/specialist/" + specialization + "/" + id}
                      className="text-blue-600 hover:text-blue-700 p-2 rounded-xl hover:bg-blue-50 transition-all duration-200"
                    >
                      <Edit3 className="w-5 h-5" />
                    </Link>
                  </div>
                </div>

                {/* Doctor Info Card */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden shadow-lg">
                  <div className="flex gap-4 p-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
                      {defaultImage ? (
                        <img
                          src={ defaultImage || doctorData.profilePhoto}
                          alt={doctorData.doctorName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextElementSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                        {doctorData.firstName?.charAt(0) || "D"}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-2">
                        {doctorData?.firstName + " " + doctorData?.lastName}
                      </h3>
                      <p className="text-blue-600 font-semibold text-base mb-3">
                        {specialization}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        {doctorData?.doctorEducation?.map((qual, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg"
                          >
                            <GraduationCap className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">
                              {qual.degreeName}
                            </span>
                          </div>
                        ))}
                        <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                          <Stethoscope className="w-4 h-4 text-green-500" />
                          <span className="font-medium">
                            {doctorData?.professional?.yearOfExp} + years
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clinic Location Card */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-2">
                        Clinic Location
                      </h4>
                      <p className="text-gray-800 font-semibold">
                        {doctorData?.clinicInfos?.clinicName}
                      </p>
                      <p className="text-gray-600">
                        {doctorData?.clinicInfos?.clinicAddress}, {doctorData?.clinicInfos?.clinicCity}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600 font-medium">
                          Verified Location
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consultation Fee Card */}
                <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-sm rounded-2xl border border-emerald-200/50 p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-emerald-600" />
                      </div>
                      <span className="font-semibold text-gray-700 text-lg">
                        Consultation Fee
                      </span>
                    </div>
                    <span className="text-3xl font-bold text-emerald-600">
                      ₹{doctorData?.professional?.consultationFees}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Details Form */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Patient Information</h2>
                    <p className="text-purple-100 text-sm opacity-90">
                      Complete your booking details
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-6">
                {/* Error Message */}
                {errMsg && (
                  <div className="flex items-center gap-3 p-4 bg-red-50/80 border-l-4 border-red-500 rounded-xl backdrop-blur-sm">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p
                      ref={errRef}
                      className="text-red-700 text-sm font-medium"
                    >
                      {errMsg}
                    </p>
                  </div>
                )}

                {/* Patient Selection */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-700">
                    This appointment is for:
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-4 p-5 border-2 border-gray-200 rounded-2xl hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer group bg-white/50 backdrop-blur-sm">
                      <input
                        type="radio"
                        name="patientType"
                        value="myself"
                        checked={selectedPatient === "myself"}
                        onChange={(e) => setSelectedPatient(e.target.value)}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="font-semibold text-gray-700 text-lg">
                          {fetchUserFullname} (Myself)
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center gap-4 p-5 border-2 border-gray-200 rounded-2xl hover:border-purple-400 hover:shadow-lg transition-all duration-200 cursor-pointer group bg-white/50 backdrop-blur-sm">
                      <input
                        type="radio"
                        name="patientType"
                        value="someone-else"
                        checked={selectedPatient === "someone-else"}
                        onChange={(e) => setSelectedPatient(e.target.value)}
                        className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                          <User className="w-5 h-5 text-purple-600" />
                        </div>
                        <span className="font-semibold text-gray-700 text-lg">
                          Someone Else
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Patient Details Form */}
                <div className="space-y-5">
                  <h3 className="font-bold text-gray-700 text-base border-b border-gray-200 pb-2">
                    Required Information:
                  </h3>

                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      {selectedPatient === "myself"
                        ? "Your Full Name"
                        : "Patient's Full Name"}
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="text"
                        placeholder={
                          selectedPatient === "myself"
                            ? "Enter your full name"
                            : "Enter patient's full name"
                        }
                        value={
                          selectedPatient === "myself"
                            ? formData.fullName
                            : formData.patientFullName
                        }
                        onChange={(e) =>
                          handleInputChange(
                            selectedPatient === "myself"
                              ? "fullName"
                              : "patientFullName",
                            e.target.value
                          )
                        }
                        className="w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-500 text-gray-800 font-medium shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      {selectedPatient === "myself"
                        ? "Your Email"
                        : "Patient's Email"}
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="email"
                        value={
                          selectedPatient === "myself"
                            ? email
                            : formData.patientEmail
                        }
                        onChange={
                          selectedPatient === "someone-else"
                            ? (e) =>
                                handleInputChange(
                                  "patientEmail",
                                  e.target.value
                                )
                            : undefined
                        }
                        readOnly={selectedPatient === "myself"}
                        placeholder={
                          selectedPatient === "myself"
                            ? email
                            : "Enter patient's email"
                        }
                        className={`w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl transition-all duration-200 placeholder-gray-500 font-medium shadow-sm ${
                          selectedPatient === "myself"
                            ? "bg-gray-50/80 cursor-not-allowed text-gray-600"
                            : "bg-white/60 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                        }`}
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Phone Number{" "}
                      <span className="text-gray-500 font-normal">
                        (Optional)
                      </span>
                    </label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="tel"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-500 text-gray-800 font-medium shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-700 border-b border-gray-200 pb-2 block">
                    Choose Payment Method:
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-4 p-5 border-2 border-gray-200 rounded-2xl hover:border-green-400 hover:shadow-lg transition-all duration-200 cursor-pointer group bg-white/50 backdrop-blur-sm">
                      <input
                        type="radio"
                        name="payment"
                        value="online"
                        checked={selectedPayment === "online"}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="w-5 h-5 text-green-600 focus:ring-green-500"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                          <CreditCard className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-800 text-lg">
                              ₹{doctorData.consultationFees} Pay Online
                            </span>
                            <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                              INSTANT
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Secure payment • Instant confirmation
                          </p>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center gap-4 p-5 border-2 border-gray-200 rounded-2xl hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer group bg-white/50 backdrop-blur-sm">
                      <input
                        type="radio"
                        name="payment"
                        value="clinic"
                        checked={selectedPayment === "clinic"}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 "
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <span className="font-bold text-gray-800 text-lg">
                            ₹{doctorData.consultationFees} Pay at Clinic
                          </span>
                          <p className="text-sm text-gray-600 mt-1">
                            Pay directly at the clinic
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !isFormValid()}
                    className="w-full py-5 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:via-gray-400 disabled:to-gray-500 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-xl flex items-center justify-center gap-3 group"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Booking Appointment...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span>Confirm Booking</span>
                        <div className="ml-2 opacity-60">→</div>
                      </>
                    )}
                  </button>
                </div>

                {/* Security Notice */}
                <div className="flex items-center gap-3 p-4 bg-blue-50/80 backdrop-blur-sm rounded-xl border border-blue-200/50">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <p className="text-sm text-blue-800 font-medium">
                    Your payment and personal information are secured with
                    end-to-end encryption
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
