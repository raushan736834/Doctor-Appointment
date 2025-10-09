// import React, { useState } from "react";
// import {
//   ArrowLeft,
//   MapPin,
//   Star,
//   Calendar,
//   Clock,
//   Phone,
//   Mail,
//   Award,
//   Stethoscope,
//   GraduationCap,
//   Building2,
//   CheckCircle,
//   Heart,
//   Share2,
// } from "lucide-react";
// import { useParams } from "react-router-dom";

// const DoctorProfile = ({
//   doctorData = null,
//   availabilityData = null,
//   reviewsData = null,
//   onBack = () => {},
//   onBookAppointment = () => {},
//   onCall = () => {},
//   onMessage = () => {},
// }) => {
//   // Default fallback data
//   const defaultDoctor = {
//     id: "1941000",
//     email: null,
//     doctorName: "Dr. Mohan Mishra",
//     phoneNumber: null,
//     specialization: "Ayurveda",
//     consultationFees: 500,
//     experienceYears: 10,
//     profilePhoto:
//       "https://imagesx.practo.com/providers/dr-mohan-mishra-ayurveda-jalandhar-aee1f6e0-c291-4423-beda-220a847d0cb3.jpg",
//     gender: null,
//     locality: "Raja Bazar",
//     clinicName: "Jiva Ayurveda Clinic",
//     state: null,
//     pincode: null,
//     city: "Patna",
//     qualifications: [
//       {
//         id: 2,
//         qualification: "BAMS",
//         college: "Lal Bahadur Shastri Homoeopathic Medical College, Bhopal",
//         completionYear: 2013,
//         qualificationValidInCountry: false,
//       },
//     ],
//   };

//   // Function to generate next 14 days
//   const generateNext14Days = () => {
//     const days = [];
//     const today = new Date();

//     for (let i = 0; i < 14; i++) {
//       const date = new Date(today);
//       date.setDate(today.getDate() + i);

//       // Format the date as "Day, DD Mon"
//       const formattedDate = date.toLocaleDateString('en-US', {
//         weekday: 'short',
//         day: 'numeric',
//         month: 'short'
//       });

//       // Sunday is not available
//       const available = date.getDay() !== 0;

//       days.push({
//         date: formattedDate,
//         available: available
//       });
//     }
//     return days;
//   };

//   const defaultAvailability = {
//     dates: generateNext14Days(),
//     timeSlots: [
//       "09:00 AM",
//       "09:30 AM",
//       "10:00 AM",
//       "10:30 AM",
//       "02:00 PM",
//       "02:30 PM",
//       "03:00 PM",
//       "03:30 PM",
//       "04:00 PM",
//       "04:30 PM",
//       "05:00 PM",
//     ],
//   };

//   const defaultReviews = [
//     {
//       name: "Priya Sharma",
//       rating: 5,
//       comment: "Excellent consultation and very knowledgeable in treatments.",
//     },
//     {
//       name: "Rajesh Kumar",
//       rating: 4,
//       comment: "Good experience, doctor explained everything clearly.",
//     },
//     {
//       name: "Anita Singh",
//       rating: 5,
//       comment: "Very patient and caring. Highly recommend!",
//     },
//   ];

//   // Use provided data or fallback to defaults
//   const params = useParams();
//   const doctorId = params.doctorId;
//   console.log(doctorId);
//   const doctor = doctorData || defaultDoctor;
//   const availability = availabilityData || defaultAvailability;
//   const reviews = reviewsData || defaultReviews;

//   const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(null);

//   // Calculate average rating from reviews
//   const averageRating =
//     reviews.length > 0
//       ? (
//           reviews.reduce((sum, review) => sum + review.rating, 0) /
//           reviews.length
//         ).toFixed(1)
//       : "4.8";

//   // Helper function to generate about text
//   const generateAboutText = (doctor) => {
//     const name = doctor.doctorName?.split(" ").slice(1).join(" ") || "Doctor";
//     return `Dr. ${name} is an experienced ${doctor.specialization} practitioner with ${doctor.experienceYears} years of dedicated service. Specializing in comprehensive healthcare, the doctor provides personalized care focusing on evidence-based treatments and patient-centered approaches for optimal health outcomes.`;
//   };

//   // Helper function to format location
//   const formatLocation = (doctor) => {
//     const parts = [doctor.locality, doctor.city, doctor.state].filter(Boolean);
//     return parts.join(", ");
//   };

//   const handleBookAppointment = () => {
//     const appointmentData = {
//       doctorId: doctor.id,
//       doctorName: doctor.doctorName,
//       selectedDate,
//       selectedTimeSlot,
//       consultationFees: doctor.consultationFees,
//     };
//     onBookAppointment(appointmentData);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <style>{`
//         /* Custom Scrollbar Styles */
//         .scrollbar-thin {
//           scrollbar-width: thin;
//         }

//         .scrollbar-thin::-webkit-scrollbar {
//           width: 6px;
//         }

//         .scrollbar-thin::-webkit-scrollbar-track {
//           background: #f1f1f1;
//           border-radius: 3px;
//         }

//         .scrollbar-thin::-webkit-scrollbar-thumb {
//           background: #cdcdcd;
//           border-radius: 3px;
//         }

//         .scrollbar-thin::-webkit-scrollbar-thumb:hover {
//           background: #bababa;
//         }
//       `}</style>

//       {/* Header with back button */}
//       <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
//           <button
//             onClick={onBack}
//             className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
//           >
//             <ArrowLeft className="w-5 h-5" />
//             <span>Back to Search</span>
//           </button>
//           <div className="flex items-center gap-3">
//             <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
//               <Heart className="w-5 h-5 text-gray-600" />
//             </button>
//             <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
//               <Share2 className="w-5 h-5 text-gray-600" />
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Profile Section */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Doctor Info Card */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <div className="flex flex-col md:flex-row gap-6">
//                 {/* Profile Image */}
//                 <div className="relative flex-shrink-0">
//                   <div className="w-32 h-32 bg-blue-100 rounded-2xl overflow-hidden">
//                     {doctor.profilePhoto ? (
//                       <img
//                         src={doctor.profilePhoto}
//                         alt={doctor.doctorName}
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           e.target.style.display = "none";
//                           e.target.nextElementSibling.style.display = "flex";
//                         }}
//                       />
//                     ) : null}
//                     <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
//                       {doctor.doctorName?.charAt(0) || "D"}
//                     </div>
//                   </div>
//                   <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
//                     <CheckCircle className="w-5 h-5 text-white" />
//                   </div>
//                 </div>

//                 {/* Doctor Details */}
//                 <div className="flex-1">
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
//                         {doctor.doctorName || "Doctor Name"}
//                       </h1>
//                       <p className="text-blue-600 font-semibold text-lg mb-2">
//                         {doctor.specialization || "General Practice"}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <div className="flex items-center gap-1 mb-1">
//                         <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                         <span className="font-semibold">{averageRating}</span>
//                         <span className="text-gray-500 text-sm">
//                           ({reviews.length} reviews)
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                     <div className="flex items-center gap-2 text-gray-600">
//                       <Stethoscope className="w-4 h-4 text-blue-500" />
//                       <span className="text-sm">
//                         {doctor.experienceYears || 0} years experience
//                       </span>
//                     </div>
//                     {doctor.clinicName && (
//                       <div className="flex items-center gap-2 text-gray-600">
//                         <Building2 className="w-4 h-4 text-blue-500" />
//                         <span className="text-sm">{doctor.clinicName}</span>
//                       </div>
//                     )}
//                     {formatLocation(doctor) && (
//                       <div className="flex items-center gap-2 text-gray-600">
//                         <MapPin className="w-4 h-4 text-blue-500" />
//                         <span className="text-sm">
//                           {formatLocation(doctor)}
//                         </span>
//                       </div>
//                     )}
//                     <div className="flex items-center gap-2 text-gray-600">
//                       <span className="text-lg font-bold text-green-600">
//                         ₹{doctor.consultationFees || "N/A"}
//                       </span>
//                       <span className="text-sm text-gray-500">
//                         consultation fee
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* About Section */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-4">
//                 About Doctor
//               </h2>
//               <p className="text-gray-700 leading-relaxed">
//                 {generateAboutText(doctor)}
//               </p>
//             </div>

//             {/* Education & Qualifications */}
//             {doctor.qualifications && doctor.qualifications.length > 0 && (
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
//                   <GraduationCap className="w-5 h-5 text-blue-500" />
//                   Education & Qualifications
//                 </h2>
//                 <div className="space-y-3">
//                   {doctor.qualifications.map((qual, index) => (
//                     <div
//                       key={qual.id || index}
//                       className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
//                     >
//                       <Award className="w-5 h-5 text-blue-500 mt-0.5" />
//                       <div>
//                         <h3 className="font-semibold text-gray-900">
//                           {qual.qualification}
//                         </h3>
//                         {qual.college && (
//                           <p className="text-gray-600 text-sm">
//                             {qual.college}
//                           </p>
//                         )}
//                         {qual.completionYear && (
//                           <p className="text-gray-500 text-xs">
//                             Completed: {qual.completionYear}
//                           </p>
//                         )}
//                         {qual.qualificationValidInCountry === false && (
//                           <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
//                             International Qualification
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Reviews Section */}
//             {reviews && reviews.length > 0 && (
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <h2 className="text-xl font-bold text-gray-900 mb-4">
//                   Patient Reviews
//                 </h2>
//                 <div className="space-y-4">
//                   {reviews.map((review, index) => (
//                     <div
//                       key={index}
//                       className="border-b border-gray-100 pb-4 last:border-b-0"
//                     >
//                       <div className="flex items-center gap-2 mb-2">
//                         <span className="font-medium text-gray-900">
//                           {review.name}
//                         </span>
//                         <div className="flex items-center gap-1">
//                           {[...Array(review.rating || 5)].map((_, i) => (
//                             <Star
//                               key={i}
//                               className="w-4 h-4 fill-yellow-400 text-yellow-400"
//                             />
//                           ))}
//                         </div>
//                       </div>
//                       <p className="text-gray-700 text-sm">{review.comment}</p>
//                     </div>
//                   ))}
//                   <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
//                     View all reviews
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Booking Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
//               <h2 className="text-xl font-bold text-gray-900 mb-6">
//                 Book Appointment
//               </h2>

//               {/* Date Selection */}
//               {availability?.dates && availability.dates.length > 0 && (
//                 <div className="mb-6">
//                   <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                     <Calendar className="w-4 h-4 text-blue-500" />
//                     Select Date
//                   </h3>
//                   {/* Scrollable dates container with fixed height of 4 items */}
//                   <div className="max-h-[268px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//                     <div className="grid grid-cols-1 gap-2">
//                       {availability.dates.map((dateObj, index) => (
//                         <button
//                           key={index}
//                           onClick={() => setSelectedDate(dateObj.date)}
//                           disabled={!dateObj.available}
//                           className={`p-3 rounded-lg text-sm font-medium transition-colors ${
//                             selectedDate === dateObj.date
//                               ? "bg-blue-600 text-white"
//                               : dateObj.available
//                               ? "bg-gray-50 text-gray-900 hover:bg-blue-50"
//                               : "bg-gray-100 text-gray-400 cursor-not-allowed"
//                           }`}
//                         >
//                           {dateObj.date}
//                           {!dateObj.available && " (Unavailable)"}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Time Slot Selection */}
//               {availability?.timeSlots && availability.timeSlots.length > 0 && (
//                 <div className="mb-6">
//                   <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                     <Clock className="w-4 h-4 text-blue-500" />
//                     Available Times
//                   </h3>
//                   <div className="grid grid-cols-2 gap-2">
//                     {availability.timeSlots.map((time, index) => (
//                       <button
//                         key={index}
//                         onClick={() => setSelectedTimeSlot(time)}
//                         className={`p-2 rounded-lg text-xs font-medium transition-colors ${
//                           selectedTimeSlot === time
//                             ? "bg-blue-600 text-white"
//                             : "bg-gray-50 text-gray-700 hover:bg-blue-50"
//                         }`}
//                       >
//                         {time}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Consultation Fee */}
//               <div className="bg-blue-50 rounded-lg p-4 mb-6">
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-700 font-medium">
//                     Consultation Fee
//                   </span>
//                   <span className="text-2xl font-bold text-blue-600">
//                     ₹{doctor.consultationFees || "Contact for pricing"}
//                   </span>
//                 </div>
//               </div>

//               {/* Contact Options */}
//               <div className="space-y-3 mb-6">
//                 <button
//                   onClick={handleBookAppointment}
//                   disabled={!selectedDate || !selectedTimeSlot}
//                   className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
//                 >
//                   <Calendar className="w-4 h-4" />
//                   {!selectedDate || !selectedTimeSlot
//                     ? "Select Date & Time"
//                     : "Book Appointment"}
//                 </button>

//                 <div className="grid grid-cols-2 gap-3">
//                   <button
//                     onClick={() => onCall(doctor)}
//                     className="flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//                   >
//                     <Phone className="w-4 h-4" />
//                     Call
//                   </button>
//                   <button
//                     onClick={() => onMessage(doctor)}
//                     className="flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//                   >
//                     <Mail className="w-4 h-4" />
//                     Message
//                   </button>
//                 </div>
//               </div>

//               {/* Clinic Info */}
//               {doctor.clinicName && (
//                 <div className="border-t border-gray-200 pt-4">
//                   <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
//                     <Building2 className="w-4 h-4 text-blue-500" />
//                     Clinic Information
//                   </h3>
//                   <div className="text-sm text-gray-600 space-y-1">
//                     <p className="font-medium">{doctor.clinicName}</p>
//                     {formatLocation(doctor) && <p>{formatLocation(doctor)}</p>}
//                     {doctor.pincode && <p>PIN: {doctor.pincode}</p>}
//                     <div className="flex items-center gap-1 text-green-600 mt-2">
//                       <CheckCircle className="w-4 h-4" />
//                       <span className="text-xs">Verified Clinic</span>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DoctorProfile;

import React, { useEffect, useState } from "react";
import { useBookedSlots } from "../../hooks/useBookedSlots";
import {
  MapPin,
  Star,
  Calendar,
  Clock,
  Phone,
  Mail,
  Award,
  Stethoscope,
  GraduationCap,
  Building2,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {  useNavigate, useParams } from "react-router-dom";
import useDate from "../../hooks/useDate";
import DoctorProfileShimmer from "../Shimmer/DoctorProfileShimmer";
import { useApiService } from "../../hooks/useAuthWithAxios";

const FETCH_DOCTOR_DATA = "/api/public/getDoctor";

const DoctorProfile = ({
  availabilityData = null,
  reviewsData = null,
  onCall = () => {},
  onMessage = () => {},
}) => {
  // Function to generate next 14 days
  const generateNext14Days = () => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Format the date as "Day, DD Mon"
      const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });

      // Sunday is not available
      const available = date.getDay() !== 0;

      days.push({
        date: formattedDate,
        available: available,
      });
    }
    return days;
  };

  const defaultAvailability = {
    dates: generateNext14Days(),
    periods: [
      { id: "morning", name: "Morning", timeRange: "8:00 AM - 10:00 PM" },
      { id: "noon", name: "Noon", timeRange: "12:00 PM - 2:00 PM" },
      { id: "evening", name: "Evening", timeRange: "4:00 PM - 6:00 PM" },
    ],
    timeSlotsByPeriod: {
      morning: [
        "08:00 AM",
        "08:15 AM",
        "08:30 AM",
        "08:45 AM",
        "09:00 AM",
        "09:15 AM",
        "09:30 AM",
        "09:45 AM",
      ],
      noon: [
        "12:00 PM",
        "12:15 PM",
        "12:30 PM",
        "12:45 PM",
        "01:00 PM",
        "01:15 PM",
        "01:30 PM",
        "01:45 PM",
      ],
      evening: [
        "04:00 PM",
        "04:15 PM",
        "04:30 PM",
        "04:45 PM",
        "05:00 PM",
        "05:15 PM",
        "05:30 PM",
        "05:45 PM"
      ],
    },
  };

  const defaultReviews = [
    {
      name: "Priya Sharma",
      rating: 5,
      comment: "Excellent consultation and very knowledgeable in treatments.",
    },
    {
      name: "Rajesh Kumar",
      rating: 4,
      comment: "Good experience, doctor explained everything clearly.",
    },
    {
      name: "Anita Singh",
      rating: 5,
      comment: "Very patient and caring. Highly recommend!",
    },
  ];

  // Use provided data or fallback to defaults
  const availability = availabilityData || defaultAvailability;
  const reviews = reviewsData || defaultReviews;
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
  const [doctor, setDoctor] = useState([]);
  const param = useParams();
  const specialization = param.specialist;
  const id = param.doctorId;
  const navigate = useNavigate();
  const { setData } = useDate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const api = useApiService();
  // Calculate average rating from reviews
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "4.8";

  // Helper function to generate about text
  const generateAboutText = (doctor) => {
    const name = doctor.doctorName?.split(" ").slice(1).join(" ") || "Doctor";
    return `Dr. ${name} is an experienced ${doctor.specialization} practitioner with ${doctor.experienceYears} years of 
    dedicated service. Specializing in comprehensive healthcare, the doctor provides personalized care focusing on evidence-based treatments 
    and patient-centered approaches for optimal health outcomes.`;
  };

  // Helper function to format location
  const formatLocation = (doctor) => {
    const parts = [doctor.locality, doctor.city, doctor.state].filter(Boolean);
    return parts.join(", ");
  };

  const handleBookAppointment = () => {
    const data = {
      doctorId: doctor.id,
      doctorName: doctor.doctorName,
      specialization: doctor.specialization,
      selectedDate,
      selectedPeriod,
      selectedTimeSlot,
    };
    const specialization = doctor.specialization;
    setData({ selectedDate, selectedTimeSlot, specialization, selectedPeriod });
    navigate(`/appointment-details/${data.doctorId}`, { state: { data } });
  };

  // Get available time slots based on selected period, filtering out booked slots
  const getAvailableTimeSlots = () => {
    if (!selectedPeriod) return [];
    const periodSlots = availability.timeSlotsByPeriod[selectedPeriod] || [];
    return periodSlots.filter(slot => !bookedSlots.includes(slot));
  };

  // Reset time slot when period changes
  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period.id);
    setSelectedTimeSlot(null); // Reset time slot when period changes
    setIsPeriodDropdownOpen(false);
  };

  useEffect(() => {
    fetchDoctorDetails();
  }, [id, specialization]);

  // Add the useBookedSlot hook
  const { bookedSlots, isLoading: slotsLoading, error: slotsError } = useBookedSlots(
    id,
    selectedDate ? new Date(`${selectedDate} ${new Date().getFullYear()}`) : null
  );

  const fetchDoctorDetails = async () => {
    const body = {
      specialization,
      id,
    };
    setIsLoading(true); 
    try {
      const response = await api.post(FETCH_DOCTOR_DATA, body);
      const data = response?.data;
      setDoctor(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if(isLoading){
    return <DoctorProfileShimmer />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        /* Custom Scrollbar Styles */
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cdcdcd;
          border-radius: 3px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #bababa;
        }
      `}</style>

      {/* Header with back button */}
      {/* <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Search</span>
          </button>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Heart className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Doctor Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Image */}
                <div className="relative flex-shrink-0">
                  <div className="w-32 h-32 bg-blue-100 rounded-2xl overflow-hidden">
                    {doctor.profilePhoto ? (
                      <img
                        src={doctor.profilePhoto}
                        alt={doctor.doctorName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextElementSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                      {doctor.doctorName?.charAt(0) || "D"}
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {doctor.doctorName || "Doctor Name"}
                      </h1>
                      <p className="text-blue-600 font-semibold text-lg mb-2">
                        {doctor.specialization || "General Practice"}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{averageRating}</span>
                        <span className="text-gray-500 text-sm">
                          ({reviews.length} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Stethoscope className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">
                        {doctor.experienceYears || 0} years experience
                      </span>
                    </div>
                    {doctor.clinicName && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building2 className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">{doctor.clinicName}</span>
                      </div>
                    )}
                    {formatLocation(doctor) && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">
                          {formatLocation(doctor)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-lg font-bold text-green-600">
                        ₹{doctor.consultationFees || "N/A"}
                      </span>
                      <span className="text-sm text-gray-500">
                        consultation fee
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                About Doctor
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {generateAboutText(doctor)}
              </p>
            </div>

            {/* Education & Qualifications */}
            {doctor.qualifications && doctor.qualifications.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-500" />
                  Education & Qualifications
                </h2>
                <div className="space-y-3">
                  {doctor.qualifications.map((qual, index) => (
                    <div
                      key={qual.id || index}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <Award className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {qual.qualification}
                        </h3>
                        {qual.college && (
                          <p className="text-gray-600 text-sm">
                            {qual.college}
                          </p>
                        )}
                        {qual.completionYear && (
                          <p className="text-gray-500 text-xs">
                            Completed: {qual.completionYear}
                          </p>
                        )}
                        {qual.qualificationValidInCountry === false && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            International Qualification
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            {reviews && reviews.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Patient Reviews
                </h2>
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-100 pb-4 last:border-b-0"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">
                          {review.name}
                        </span>
                        <div className="flex items-center gap-1">
                          {[...Array(review.rating || 5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm">{review.comment}</p>
                    </div>
                  ))}
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View all reviews
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Book Appointment
              </h2>

              {/* Date Selection Dropdown */}
              {availability?.dates && availability.dates.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    Select Date
                  </h3>
                  <div className="relative">
                    <button
                      onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                      className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg text-left hover:border-blue-500 transition-colors"
                    >
                      <span
                        className={
                          selectedDate ? "text-gray-900" : "text-gray-500"
                        }
                      >
                        {selectedDate || "Choose a date"}
                      </span>
                      {isDateDropdownOpen ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </button>

                    {isDateDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto scrollbar-thin">
                        {availability.dates.map((dateObj, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedDate(dateObj.date);
                              setIsDateDropdownOpen(false);
                              setSelectedPeriod(null); // Reset period when date changes
                              setSelectedTimeSlot(null); // Reset time slot when date changes
                            }}
                            disabled={!dateObj.available}
                            className={`w-full p-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                              selectedDate === dateObj.date
                                ? "bg-blue-50 text-blue-600 font-medium"
                                : dateObj.available
                                ? "text-gray-900"
                                : "text-gray-400 cursor-not-allowed bg-gray-50"
                            }`}
                          >
                            {dateObj.date}
                            {!dateObj.available && " (Unavailable)"}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Period Selection Dropdown */}
              {selectedDate &&
                availability?.periods &&
                availability.periods.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      Select Period
                    </h3>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setIsPeriodDropdownOpen(!isPeriodDropdownOpen)
                        }
                        className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg text-left hover:border-blue-500 transition-colors"
                      >
                        <div className="flex flex-col">
                          <span
                            className={
                              selectedPeriod ? "text-gray-900" : "text-gray-500"
                            }
                          >
                            {selectedPeriod
                              ? availability.periods.find(
                                  (p) => p.id === selectedPeriod
                                )?.name
                              : "Choose a period"}
                          </span>
                          {selectedPeriod && (
                            <span className="text-xs text-gray-500">
                              {
                                availability.periods.find(
                                  (p) => p.id === selectedPeriod
                                )?.timeRange
                              }
                            </span>
                          )}
                        </div>
                        {isPeriodDropdownOpen ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </button>

                      {isPeriodDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                          {availability.periods.map((period, index) => (
                            <button
                              key={period.id}
                              onClick={() => handlePeriodSelect(period)}
                              className={`w-full p-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                                selectedPeriod === period.id
                                  ? "bg-blue-50 text-blue-600 font-medium"
                                  : "text-gray-900"
                              }`}
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {period.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {period.timeRange}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* Time Slot Selection */}
              {selectedPeriod && getAvailableTimeSlots().length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    Available Times
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {getAvailableTimeSlots().map((time, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedTimeSlot(time)}
                        className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                          selectedTimeSlot === time
                            ? "bg-blue-600 text-white"
                            : "bg-gray-50 text-gray-700 hover:bg-blue-50"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Consultation Fee */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">
                    Consultation Fee
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{doctor.consultationFees || "Contact for pricing"}
                  </span>
                </div>
              </div>

              {/* Contact Options */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={handleBookAppointment}
                  disabled={
                    !selectedDate || !selectedPeriod || !selectedTimeSlot
                  }
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 
                  disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  {!selectedDate || !selectedPeriod || !selectedTimeSlot
                    ? "Select Date, Period & Time"
                    : "Book Appointment"}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onCall(doctor)}
                    className="flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                  <button
                    onClick={() => onMessage(doctor)}
                    className="flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Message
                  </button>
                </div>
              </div>

              {/* Clinic Info */}
              {doctor.clinicName && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-500" />
                    Clinic Information
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-medium">{doctor.clinicName}</p>
                    {formatLocation(doctor) && <p>{formatLocation(doctor)}</p>}
                    {doctor.pincode && <p>PIN: {doctor.pincode}</p>}
                    <div className="flex items-center gap-1 text-green-600 mt-2">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs">Verified Clinic</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
