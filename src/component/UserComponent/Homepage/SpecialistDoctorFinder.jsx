import React, { useEffect, useState, useRef, useCallback } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import defaultImage from "../../../assets/img/defaultClinicImage.jpg"
import { useApiService } from "../../../hooks/useAuthWithAxios";


const SPECIALIST_URL = "api/public/getSpecialist";

const SpecialistDoctorsFinder = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState(0);
  const [err, setErr] = useState();
  const [specialties, setSpecialties] = useState([]);
  const [doctor, setDoctor] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const carouselRef = useRef(null);
  const api = useApiService();

  

  useEffect(() => {
    // Simulate API call
    fetchSpecialist();
  }, []);

  useEffect(() => {
    if (specialties.length > 0 && specialties[selectedSpecialty]) {
      fetchDoctor(specialties[selectedSpecialty].specialist);
    }
  }, [selectedSpecialty, specialties]);

  const fetchDoctor = async (specialist) => {
    if (!specialist) return;
    
    setIsLoading(true);
    try {
      const url = `/api/public/search?keyword=${encodeURIComponent(specialist)}`;
      const response = await api.get(url);
      const json = response?.data;
      const list = Array.isArray(json)
        ? json
        : Array.isArray(json?.results)
        ? json.results
        : [];
      setDoctor(list);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setErr("Failed to load doctors. Please try again later.");
      setDoctor([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSpecialist = async () => {
    try {
      const response = await api.get(SPECIALIST_URL);
      const data = response?.data;
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.specialists)
        ? data.specialists
        : [];
      setSpecialties(list);
    } catch (error) {
      console.error("Error fetching specialists:", error);
      setErr("Failed to load specialists. Please try again later.");
    }
  };

  const scrollToCard = useCallback(
    (index) => {
      if (carouselRef.current && specialties.length > 0) {
        const cardWidth = 280; // width of card + gap
        const scrollPosition = cardWidth * (index + 2); // +2 because of the duplicated items at start
        carouselRef.current.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
    },
    [specialties?.length]
  );

  useEffect(() => {
    if (carouselRef.current && specialties?.length > 0) {
      // Set initial scroll position after the component mounts
      setTimeout(() => {
        scrollToCard(selectedSpecialty);
      }, 100);
    }
  }, [specialties?.length, scrollToCard, selectedSpecialty]);


  const DoctorCard = ({ doctor }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4 mb-4 max-w-7xl">
        <div className="relative">
          <div className="w-28 h-28 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
            <div className="w-28 h-28 bg-blue-100 rounded-full flex items-center justify-center">
              <img src={doctor.profilePhoto || defaultImage} className="w-20 h-20 rounded-xl" loading="lazy" />
            </div>
          </div>
          {true && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">
            {doctor?.doctorName}
          </h3>
          <p className="text-gray-600 text-sm mb-2">{doctor.specialization}</p>

          <div className="flex items-center mb-2">
            <Stethoscope className="w-4 h-4 text-blue-400 mr-1" />
            <span className="font-semibold text-gray-900">{doctor.experienceYears}{" years"}</span>
          </div>

          <div className="flex items-start text-gray-600 text-sm">
            <span className="mr-1">📍</span>
            <span>{doctor.clinicName}{", "}{doctor.locality}{", "}{doctor.city}</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <Link 
          to={`/specialist/${encodeURIComponent(doctor.specialization)}/${doctor.id}`}
          state={{ doctor : doctor }}
          className="flex-1 bg-blue-900 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
        >
          Book Appointment
        </Link>
        <Link 
          to={`/specialist/${encodeURIComponent(doctor.specialization)}/${doctor.id}`}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <span className="mr-1">Doctor Profile</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );

  const SpecialtyCard = ({ specialty, index, isSelected, onClick }) => (
    <div
      className={`flex-shrink-0 w-64 h-32 rounded-xl cursor-pointer transition-all transform hover:scale-105 ${
        isSelected ? "bg-blue-900" : "bg-gray-300"
      } ${isSelected ? "shadow-lg" : "shadow-sm"}`}
      onClick={() => onClick(index)}
    >
      <div className="p-6 h-full flex items-center">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
            <img
              src={specialty.image}
              alt={specialty.specialist}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h3
              className={`text-right text-base font-semibold ${
                isSelected ? "text-white" : "text-gray-700"
              }`}
            >
              {specialty.specialist}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );

  const handleSpecialtyClick = (index) => {
    // Handle clicking on actual specialty cards (not duplicates)
    if (index >= 0 && index < specialties.length) {
      setSelectedSpecialty(index);
      scrollToCard(index);
    }
  };

  const handlePrevSpecialty = () => {
    const newIndex =
      selectedSpecialty > 0 ? selectedSpecialty - 1 : specialties.length - 1;
    setSelectedSpecialty(newIndex);
    scrollToCard(newIndex);
  };

  const handleNextSpecialty = () => {
    const newIndex =
      selectedSpecialty < specialties.length - 1 ? selectedSpecialty + 1 : 0;
    setSelectedSpecialty(newIndex);
    scrollToCard(newIndex);
  };

  // Create extended array for infinite scroll effect
  const safeSpecialties = Array.isArray(specialties) ? specialties : [];
  const extendedSpecialties = [
    ...safeSpecialties.slice(-2), // Last 2 items at the beginning
    ...safeSpecialties, // All original items
    ...safeSpecialties.slice(0, 2), // First 2 items at the end
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-gray-100 to-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
            Find top specialist doctors here
          </h1>
        </div>

        {/* Specialty Carousel */}
        <div className="mb-12">
          <div className="relative px-8">
            <div
              ref={carouselRef}
              className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
              style={{
                scrollBehavior: "smooth",
                scrollSnapType: "x mandatory",
                padding: "0 calc(50% - 128px)",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {extendedSpecialties.map((specialty, extendedIndex) => {
                // Calculate the actual specialty index
                const actualIndex =
                  extendedIndex < 2
                    ? specialties.length - (2 - extendedIndex) // Last items at beginning
                    : extendedIndex >= specialties.length + 2
                    ? extendedIndex - specialties.length - 2 // First items at end
                    : extendedIndex - 2; // Normal items

                const isSelected = selectedSpecialty === actualIndex;

                return (
                  <div
                    key={`${actualIndex}-${extendedIndex}`}
                    className="flex-none"
                    style={{ scrollSnapAlign: "center" }}
                  >
                    <SpecialtyCard
                      specialty={specialty}
                      index={actualIndex}
                      isSelected={isSelected}
                      onClick={handleSpecialtyClick}
                    />
                  </div>
                );
              })}
            </div>

            {/* Carousel Navigation Buttons */}
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur rounded-full p-3 shadow-lg hover:shadow-xl transition-all z-10 border border-gray-100 hover:bg-blue-50"
              onClick={handlePrevSpecialty}
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur rounded-full p-3 shadow-lg hover:shadow-xl transition-all z-10 border border-gray-100 hover:bg-blue-50"
              onClick={handleNextSpecialty}
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Doctors Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-gray-500 mt-4">Loading doctors...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {doctor.slice(0, 3).map((doc, index) => (
                <DoctorCard key={doc.id || index} doctor={doc} />
              ))}
            </div>

            {/* Show All Doctors Button */}
            {doctor.length > 3 && (
              <div className="text-center mt-8 mb-12">
                <Link 
                  to={`/specialist/${encodeURIComponent(specialties[selectedSpecialty]?.specialist)}`}
                  state={{doctors : doctor}}
                  className="inline-flex items-center px-6 py-3 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors duration-200 gap-2"
                >
                  View All {doctor.length} Doctors
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            )}

            {/* Empty State */}
            {doctor.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No doctors found for this specialty.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default SpecialistDoctorsFinder;
