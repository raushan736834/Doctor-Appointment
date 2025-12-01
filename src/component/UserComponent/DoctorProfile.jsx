import React, { useEffect, useState, useMemo } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import useDate from "../../hooks/useDate";
import DoctorProfileShimmer from "../Shimmer/DoctorProfileShimmer";
import { useApiService } from "../../hooks/useAuthWithAxios";
import defaultImage from "../../assets/img/defaultClinicImage.jpg";

const FETCH_DOCTOR_DATA = "/api/public/getDoctor";

const DoctorProfile = ({
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

      const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });

      days.push({
        date: formattedDate,
        dateObj: date,
        available: false,
        slots: [],
        timeRange: "Loading...",
      });
    }
    return days;
  };

  // Function to generate time slots based on availability hours and consultation duration
  const generateTimeSlots = (openTime, closeTime, durationInMinutes) => {
    const slots = [];
    
    const parseTime = (timeStr) => {
      const [hours, mins] = timeStr.split(':').map(Number);
      return hours * 60 + mins;
    };

    const openMinutes = parseTime(openTime);
    const closeMinutes = parseTime(closeTime);
    let currentTime = openMinutes;

    while (currentTime + durationInMinutes <= closeMinutes) {
      const hours = Math.floor(currentTime / 60);
      const mins = currentTime % 60;
      const timeStr = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
      slots.push(timeStr);
      currentTime += durationInMinutes;
    }
    return slots;
  };

  // Function to convert availability data and generate time slots per day
  const processAvailabilityData = (availData, duration) => {
    if (!availData || !Array.isArray(availData)) return generateNext14Days();

    const dayNames = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const processed = [];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = dayNames[date.getDay()];
      
      const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });

      // Find availability for this day
      const dayAvailability = availData.find(av => av.days === dayName);

      if (dayAvailability && !dayAvailability.isClosedToday) {
        const slots = generateTimeSlots(dayAvailability.open, dayAvailability.close, duration);
        processed.push({
          date: formattedDate,
          dateObj: date,
          available: true,
          slots: slots,
          timeRange: `${dayAvailability.open} - ${dayAvailability.close}`
        });
      } else {
        processed.push({
          date: formattedDate,
          dateObj: date,
          available: false,
          slots: [],
          timeRange: dayAvailability && dayAvailability.isClosedToday ? "Closed" : "Not Available"
        });
      }
    }
    return processed;
  };

  const defaultAvailability = {
    dates: generateNext14Days(),
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

  const reviews = reviewsData || defaultReviews;
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [availability, setAvailability] = useState([]);
  const param = useParams();
  const [consultationDuration, setConsulationDuration] = useState("");
  const id = param.doctorId;
  const navigate = useNavigate();
  const { setData } = useDate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const api = useApiService();
  const [processedAvailability, setProcessedAvailability] = useState(defaultAvailability);

  // FIXED: Properly memoize the date object
  const bookedSlotsDate = useMemo(() => {
    if (!selectedDate || !processedAvailability?.dates) return null;
    
    // Find the dateObj from processedAvailability that matches selectedDate
    const selectedDateObj = processedAvailability.dates.find(d => d.date === selectedDate);
    
    if (!selectedDateObj || !selectedDateObj.dateObj) return null;
    
    return selectedDateObj.dateObj;
  }, [selectedDate, processedAvailability]);

  // Use the hook with memoized date
  const { bookedSlots, isLoading: slotsLoading, error: slotsError } = useBookedSlots(id, bookedSlotsDate);
  console.log(bookedSlots)

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
    if (!doctor) return "Doctor information not available.";
    const firstName = doctor?.firstName || "";
    const lastName = doctor?.lastName || "";
    const fullName = (firstName + " " + lastName).trim() || "Doctor";
    const specialization = doctor?.professional?.specialization || "General Practice";
    const experience = doctor?.professional?.yearOfExp || 0;
    return `Dr. ${fullName} is an experienced ${specialization} practitioner with ${experience} years of 
    dedicated service. Specializing in comprehensive healthcare, the doctor provides personalized care focusing on evidence-based treatments 
    and patient-centered approaches for optimal health outcomes.`;
  };

  // Helper function to format location
  const formatLocation = (doctor) => {
    if (!doctor) return "";
    const parts = [doctor?.locality, doctor?.city, doctor?.state].filter(Boolean);
    return parts.join(", ");
  };

  const handleBookAppointment = () => {
    const data = {
      doctorId: doctor.doctorId,
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

  // FIXED: Get available time slots with proper slot comparison
  const getAvailableTimeSlots = () => {
    if (!selectedDate) return [];
    
    const selectedDateObj = processedAvailability?.dates?.find(d => d.date === selectedDate);
    
    if (!selectedDateObj || !selectedDateObj.available) {
      return [];
    }
    
    const slots = selectedDateObj.slots || [];
    
    // If there are no booked slots or still loading, return all slots
    if (!bookedSlots || bookedSlots.length === 0) {
      return slots;
    }
    
    // Normalize both slot arrays to ensure consistent format comparison
    const normalizedBookedSlots = bookedSlots.map(slot => {
      // Remove seconds if present (e.g., "10:00:00" -> "10:00")
      return slot.split(':').slice(0, 2).join(':');
    });
    
    // Filter out booked slots
    const availableSlots = slots.filter(slot => !normalizedBookedSlots.includes(slot));
    
    console.log("All Slots:", slots);
    console.log("Booked Slots (normalized):", normalizedBookedSlots);
    console.log("Available Slots:", availableSlots);
    
    return availableSlots;
  };

  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period.id);
    setSelectedTimeSlot(null);
    setIsPeriodDropdownOpen(false);
  };

  useEffect(() => {
    fetchDoctorDetails();
  }, [id]);

  // Process availability data when it changes or consultation duration changes
  useEffect(() => {
    if (availability && availability.length > 0 && consultationDuration) {
      const processed = processAvailabilityData(availability, parseInt(consultationDuration));
      setProcessedAvailability({ dates: processed });

      // Auto-select first available date with slots
      const firstAvailableWithSlots = processed.find(d => d.available && d.slots && d.slots.length > 0);
      if (!selectedDate && firstAvailableWithSlots) {
        setSelectedDate(firstAvailableWithSlots.date);
      }
    }
  }, [availability, consultationDuration]);

  const fetchDoctorDetails = async () => {
    const body = {
      doctorId: id,
    };
    setIsLoading(true);
    try {
      const response = await api.post(FETCH_DOCTOR_DATA, body);
      const data = response?.data;
      setDoctor(data);
      
      let availData = data?.clinicInfos?.operatingHours;
      let duration = data?.clinicInfos?.consultationDuration || 30;

      if (Array.isArray(availData)) {
        setAvailability(availData);
      } else if (availData && typeof availData === 'object') {
        setAvailability([availData]);
      }
      
      setConsulationDuration(duration);
    } catch (err) {
      console.log("Error fetching doctor details:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <DoctorProfileShimmer />;
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Doctor Not Found</h2>
          <p className="text-gray-600">Unable to load doctor information. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Doctor Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative flex-shrink-0">
                  <div className="w-32 h-32 bg-blue-100 rounded-2xl overflow-hidden">
                    {defaultImage || doctor?.profileImage ? (
                      <img
                        src={defaultImage || doctor?.profileImage}
                        alt={doctor?.firstName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextElementSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                      {doctor?.firstName?.charAt(0) || "D"}
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {doctor?.firstName + " " + doctor?.lastName || "Doctor Name"}
                      </h1>
                      <p className="text-blue-600 font-semibold text-lg mb-2">
                        {doctor?.professional?.specialization || "General Practice"}
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
                        {doctor?.professional?.yearOfExp || 0} years experience
                      </span>
                    </div>
                    {doctor?.clinicInfos?.clinicName && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building2 className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">{doctor?.clinicInfos?.clinicName}</span>
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
                        ₹{doctor?.professional?.consultationFees || "N/A"}
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
            {doctor?.doctorEducation && doctor?.doctorEducation.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-500" />
                  Education & Qualifications
                </h2>
                <div className="space-y-3">
                  {doctor?.doctorEducation.map((qual, index) => (
                    <div
                      key={qual.id || index}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <Award className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {qual?.degreeName}
                        </h3>
                        {qual?.schoolName && (
                          <p className="text-gray-600 text-sm">
                            {qual?.schoolName}
                          </p>
                        )}
                        {qual.completionYear && (
                          <p className="text-gray-500 text-xs">
                            Completed: {qual?.completionYear}
                          </p>
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
              {processedAvailability?.dates && processedAvailability?.dates?.length > 0 && (
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
                        {processedAvailability?.dates.map((dateObj, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedDate(dateObj?.date);
                              setIsDateDropdownOpen(false);
                              setSelectedTimeSlot(null);
                            }}
                            disabled={!dateObj?.available}
                            className={`w-full p-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                              selectedDate === dateObj.date
                                ? "bg-blue-50 text-blue-600 font-medium"
                                : dateObj?.available
                                ? "text-gray-900"
                                : "text-gray-400 cursor-not-allowed bg-gray-50"
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span>{dateObj?.date}</span>
                              <span className="text-xs text-gray-500">
                                {dateObj?.available ? dateObj?.timeRange : "Closed"}
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
              {selectedDate && slotsLoading && (
                <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
                  Loading available slots...
                </div>
              )}

              {selectedDate && !slotsLoading && getAvailableTimeSlots().length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    Available Times ({consultationDuration}min slots)
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
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

              {selectedDate && !slotsLoading && getAvailableTimeSlots().length === 0 && (
                <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                  No available slots for this date. All slots are booked.
                </div>
              )}

              {/* Consultation Fee */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">
                    Consultation Fee
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{doctor?.professional?.consultationFees || "Contact for pricing"}
                  </span>
                </div>
              </div>

              {/* Contact Options */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={handleBookAppointment}
                  disabled={!selectedDate || !selectedTimeSlot}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 
                  disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  {!selectedDate || !selectedTimeSlot
                    ? "Select Date & Time"
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
              {doctor?.clinicInfos?.clinicName && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-500" />
                    Clinic Information
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-medium">{doctor?.clinicInfos?.clinicName}</p>
                    {formatLocation(doctor) && <p>{formatLocation(doctor)}</p>}
                    {doctor?.clinicInfos?.pincode && <p>PIN: {doctor?.clinicInfos?.pincode}</p>}
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