// import React, { useState, useMemo } from "react";
// import defaultDoctorImage from "../../assets/img/defaultClinicImage.jpg";
// import AppointmentForm from "./AppointmentForm";
// import { allSlots } from "../../constants/slots";
// import { useBookedSlots } from "../../hooks/useBookedSlots";
// import { useLocation } from "react-router-dom";

// // ✅ Robust Google Drive direct link extractor
// function getDirectGoogleDriveLink(url) {
//   const match = url.match(/\/d\/([^/]+)/);
//   if (match && match[1]) {
//     return `https://drive.google.com/uc?export=view&id=${match[1]}`;
//   }
//   return url;
// }

// function DoctorCard(props) {
//   const location = useLocation();
//   const state = location.state;

//   // If redirected from searchbar, use doctor data from state
//   const doctor = state && state.doctor ? state.doctor : props;

//   const {
//     id,
//     doctorName,
//     specialization,
//     consultationFees,
//     experienceYears,
//     profilePhoto,
//     locality,
//     clinicName,
//     city,
//   } = doctor;

//   const [selectedId, setSelectedId] = useState(null);
//   const [selectedSpecialization, setSelectedSpecialization] = useState(null);
//   const today = useMemo(() => new Date(), []);
//   const { bookedSlots, loading, error } = useBookedSlots(id, today);

//   const allPossibleSlots = useMemo(() => Object.values(allSlots).flat(), []);
//   const availableSlots = useMemo(
//     () => allPossibleSlots.filter((slot) => !bookedSlots.includes(slot)),
//     [allPossibleSlots, bookedSlots]
//   );

//   const isAvailableToday = availableSlots.length > 0;

//   const photoUrl =
//     profilePhoto && profilePhoto.trim() !== ""
//       ? getDirectGoogleDriveLink(profilePhoto)
//       : defaultDoctorImage;
  

//   console.log(photoUrl)
//   const handleClick = (id, specialization) => {
//     if (selectedId === id) {
//       setSelectedId(null);
//       setSelectedSpecialization(null);
//     } else {
//       setSelectedId(id);
//       setSelectedSpecialization(specialization);
//       localStorage.setItem("specialization", specialization);
//     }
//   };

//   return (
//     <div className="bg-white w-full rounded-xl shadow-md p-4 mb-6">
//       <div className="flex flex-col lg:flex-row lg:justify-between w-full">
//         {/* Profile & Info */}
//         <div className="flex flex-col lg:flex-row w-full">
//           <div className="flex justify-center lg:block mb-3 lg:mb-0">
//             <img
//               src={photoUrl}  
//               alt={`Dr. ${doctorName}`}
//               className="rounded-full w-24 h-24 lg:w-36 lg:h-36 object-cover"
//               onError={(e) => {
//                 e.target.onerror = null;
//                 e.target.src = defaultDoctorImage;
//               }}
//             />
//           </div>
//           <div className="px-2 lg:px-6 flex-grow">
//             <h2 className="font-bold text-lg lg:text-xl mt-2 text-cyan-800">
//               {doctorName}
//             </h2>
//             <div className="my-2 text-sm space-y-1">
//               <div>{specialization}</div>
//               <div>{experienceYears} years experience overall</div>
//               <div className="flex flex-wrap items-center mt-1 text-gray-700">
//                 <span className="font-medium">
//                   {locality}, {city || ""}
//                 </span>
//                 <span className="mx-2 font-bold hidden sm:inline">•</span>
//                 <span>{clinicName}</span>
//               </div>
//               <div className="border-b border-gray-300 mt-2 pb-2 font-semibold">
//                 ₹{consultationFees} consultation fee at clinic
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Button section */}
//         <div className="flex flex-col items-center justify-center mt-4 lg:mt-0 lg:mr-6">
//           {loading ? (
//             <span className="text-gray-500 font-medium mb-2">
//               Checking availability...
//             </span>
//           ) : error ? (
//             <span className="text-red-500 font-medium mb-2">{error}</span>
//           ) : isAvailableToday ? (
//             <span className="text-green-700 font-medium mb-2">
//               Available Today
//             </span>
//           ) : (
//             <span className="text-red-500 font-medium mb-2">
//               Fully Booked Today
//             </span>
//           )}

//           <button
//             aria-pressed={selectedId === id}
//             className="w-full sm:w-40 py-2 bg-sky-500 hover:bg-sky-600 rounded-md text-white font-semibold transition-colors duration-200"
//             onClick={() => handleClick(id, specialization)}
//             disabled={!isAvailableToday}
//             title={
//               isAvailableToday
//                 ? "Book Clinic Visit"
//                 : "No slots available today"
//             }
//           >
//             {selectedId === id ? "Cancel Booking" : "Book Clinic Visit"}
//           </button>
//         </div>
//       </div>

//       {/* Appointment Form */}
//       {selectedId === id && (
//         <div className="mt-6 border-t border-gray-300 pt-4">
//           <AppointmentForm
//             id={selectedId}
//             specialization={selectedSpecialization}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// export default DoctorCard;


import React, { useState, useMemo } from "react";
import { 
  MapPin, 
  Star, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  Stethoscope,
  Building2,
  CheckCircle,
  ArrowRight,
  Heart,
  Share2,
  Award
} from "lucide-react";
import defaultImage from "../../assets/img/defaultClinicImage.jpg"

// ✅ Robust Google Drive direct link extractor
function getDirectGoogleDriveLink(url) {
  if (!url) return null;
  const match = url.match(/\/d\/([^/]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return url;
}

const DoctorCard = ({ 
  doctor,
  onBookAppointment = () => {},
  onCall = () => {},
  onMessage = () => {},
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  console.log(doctor);
  // Safely extract doctor data with fallbacks
  const {
    doctorId = doctor.doctorId,
    doctorName = doctor?.firstName + " "+ doctor?.lastName || "Doctor Name",
    specialization = doctor?.professional?.specialization || "General Practice",
    consultationFees = doctor?.professional?.consultationFees || 0,
    experienceYears = doctor?.professional?.yearOfExp || 0,
    profilePhoto = null,
    locality = doctor?.clinicInfos?.clinicAddress || "",
    clinicName = doctor?.clinicInfos?.clinicName || "",
    city = doctor?.clinicInfos?.clinicCity || "",
    state = doctor?.clinicInfos?.clinicState || "",
    qualifications = [],
    email = null,
    phoneNumber = null
  } = {};

  // Process profile photo URL
  const photoUrl = useMemo(() => {
    if (profilePhoto && profilePhoto.trim() !== "") {
      return getDirectGoogleDriveLink(profilePhoto);
    }
    return defaultImage;
  }, [profilePhoto, defaultImage]);

  // Format location string
  const location = useMemo(() => {
    const parts = [locality, city, state].filter(Boolean);
    return parts.join(", ");
  }, [locality, city, state]);

  // Generate rating (placeholder - replace with actual rating logic)
  const rating = 4.5;
  const reviewCount = 124;

  const handleBookClick = () => {
    onBookAppointment({
      doctorId,
      doctorName,
      specialization,
      consultationFees,
      clinicName,
      location
    });
  };

  const handleProfileClick = () => {
    onBookAppointment({
      doctorId,
      doctorName,
      specialization,
      consultationFees,
      clinicName,
      location
    });
  };

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}>
      {/* Main Card Content */}
      <div className="p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          {/* Profile Image */}
          <div className="relative flex-shrink-0 mx-auto sm:mx-0">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={photoUrl || defaultImage}
                alt={doctorName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultImage;
                }}
              />
            </div>
            {/* Verification Badge */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Doctor Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {doctorName}
                </h3>
                <p className="text-blue-600 font-semibold text-base mb-2">
                  {specialization}
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Share2 className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center justify-center sm:justify-start gap-1 mb-3">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-900">{rating}</span>
              <span className="text-gray-500 text-sm">({reviewCount} reviews)</span>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
                <Stethoscope className="w-4 h-4 text-blue-500" />
                <span>{experienceYears} years experience</span>
              </div>
              
              {clinicName && (
                <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
                  <Building2 className="w-4 h-4 text-blue-500" />
                  <span className="truncate">{clinicName}</span>
                </div>
              )}
              
              {location && (
                <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="truncate">{location}</span>
                </div>
              )}
              
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-lg font-bold text-green-600">₹{consultationFees}</span>
                <span className="text-gray-500 text-sm">consultation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Availability Status */}
        {/* <div className="mb-4 p-3 rounded-lg bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-gray-900">
                {isLoading ? "Checking availability..." : 
                 isAvailableToday ? "Available Today" : "Fully Booked Today"}
              </span>
            </div>
            {isAvailableToday && nextAvailableSlot && (
              <span className="text-sm text-green-600 font-medium">
                Next: {nextAvailableSlot}
              </span>
            )}
          </div>
          
          {!isAvailableToday && (
            <p className="text-sm text-gray-500 mt-1">
              Next availability: Tomorrow 9:00 AM
            </p>
          )}
        </div> */}

        {/* Qualifications Preview */}
        {qualifications && qualifications.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-gray-900">Qualifications</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {qualifications.slice(0, 2).map((qual, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                >
                  {qual.qualification}
                </span>
              ))}
              {qualifications.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{qualifications.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleBookClick}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            {isLoading ? "Loading..." :  "Book Appointment"}
          </button>
          
          <button
            onClick={handleProfileClick}
            className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            View Profile
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Contact Options */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            onClick={() => onCall(doctor)}
            disabled={!phoneNumber}
            className="flex items-center justify-center gap-2 py-2 px-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            <Phone className="w-4 h-4" />
            Call
          </button>
          <button
            onClick={() => onMessage(doctor)}
            disabled={!email}
            className="flex items-center justify-center gap-2 py-2 px-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            <Mail className="w-4 h-4" />
            Message
          </button>
        </div>
      </div>

      {/* Expandable Appointment Form */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Available Time Slots</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {availableSlots.slice(0, 8).map((slot, index) => (
                <button
                  key={index}
                  className="p-2 text-xs border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  {slot}
                </button>
              ))}
            </div>
            {availableSlots.length > 8 && (
              <button className="mt-2 text-blue-600 text-sm hover:text-blue-700">
                View all {availableSlots.length} slots
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorCard;