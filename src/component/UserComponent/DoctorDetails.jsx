// import { useEffect, useState } from "react";
// import { useLocation, useParams } from "react-router-dom";
// import Shimmer from "./Shimmer";
// import DoctorCard from "./DoctorCard";
// import api from "../../hooks/useAxios";
// const DoctorDetails = () => {
//   const param = useParams();
//   const id = param.id;
//   const location = useLocation();
//   const doctorFromState = location.state && location.state.doctor;
//   const [doctor, setDoctor] = useState(doctorFromState ? [doctorFromState] : []);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!doctorFromState) {
//       getDoctorDetails();
//     }
//   }, [id]);

//   async function getDoctorDetails() {
//     setLoading(true);
//     try {
//       const url = `/api/public/search?keyword=${id}`;
//       const response = await api.get(url);
//       const json = response?.data;
//       console.log(json)
//       setDoctor(json);
//     } catch (error) {
//       setError(error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (loading) {
//     return <Shimmer />;
//   }
//   //  console.log(doctor)

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   return (
//     <main className="flex flex-col">
//       <div className="flex justify-center my-2">
//         <span className="text-gray-600 text-xl sm:text-2xl text-wrap">Doctor Specialized in {id}</span>
//       </div>
//       <div className="mx-5 max-w-24xl px-4 py-6 mb-5 sm:px-6 lg:px-8 bg-gray-100 rounded-lg  justify-evenly">
//         {doctor?.length === 0 ? (
//           <h1>No Doctor Found!!</h1>
//         ) : (
//           doctor?.map((doc) => {
//             return <div key={doc.id} className="p-2"><DoctorCard {...doc} /></div>;
//           })
//         )}
//       </div>
//     </main>
//   );
// };

// export default DoctorDetails;

// import { useEffect, useState } from "react";
// import DoctorCard from "./DoctorCard";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { Stethoscope } from "lucide-react";
// import api from "../../hooks/useAxios";
// const DoctorDetails = () => {
//   const param = useParams();
//   const id = param.id;
//   const location = useLocation();
//   const doctorFromState = location.state && location.state.doctor;
//   const [doctors, setDoctors] = useState(
//     doctorFromState ? [doctorFromState] : []
//   );
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchDoctors();
//   }, []);

//   const fetchDoctors = async () => {
//     setLoading(true);
//     try {
//       const url = `/api/public/search?keyword=${id}`;
//       const response = await api.get(url);
//       const json = response?.data;
//       console.log(json);
//       setDoctors(json);
//     } catch (error) {
//       setError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Mock available slots - replace with actual logic
//   const getAvailableSlots = (doctorId) => {
//     const slots = ["09:00 AM", "10:30 AM", "02:00 PM", "03:30 PM", "05:00 PM"];
//     return doctorId === "1941000" ? slots : slots.slice(0, 2); // Different availability
//   };

//   const handleBookAppointment = (appointmentData) => {
//     console.log(appointmentData)
//     const {doctorId, specialization} = appointmentData;
//     navigate(`/specialist/${specialization}/${doctorId}`);
//     // Add your booking logic here
//   };

//   const handleCall = (doctor) => {
//     if (doctor.phoneNumber) {
//       window.open(`tel:${doctor.phoneNumber}`);
//     } else {
//       alert("Phone number not available");
//     }
//   };

//   const handleMessage = (doctor) => {
//     if (doctor.email) {
//       window.open(`mailto:${doctor.email}`);
//     } else {
//       alert("Email not available");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="max-w-6xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {[...Array(4)].map((_, index) => (
//             <div
//               key={index}
//               className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse"
//             >
//               <div className="flex gap-4 mb-4">
//                 <div className="w-24 h-24 bg-gray-200 rounded-2xl"></div>
//                 <div className="flex-1">
//                   <div className="h-6 bg-gray-200 rounded mb-2"></div>
//                   <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
//                   <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="h-12 bg-gray-200 rounded-lg"></div>
//                 <div className="h-12 bg-gray-200 rounded-lg"></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="max-w-6xl mx-auto px-4 py-8">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
//           <p className="text-red-600 font-medium">
//             Error loading doctors: {error.message}
//           </p>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <main className="max-w-6xl mx-auto px-4 py-8">
//       {/* Header */}
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">
//           Available Doctors
//         </h1>
//         <p className="text-gray-600">
//           Choose from our verified healthcare professionals
//         </p>
//       </div>

//       {/* Doctors Grid */}
//       {doctors && doctors.length === 0 ? (
//         <div className="text-center py-12">
//           <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <Stethoscope className="w-12 h-12 text-gray-400" />
//           </div>
//           <h3 className="text-xl font-semibold text-gray-900 mb-2">
//             No Doctors Found
//           </h3>
//           <p className="text-gray-600">Try adjusting your search criteria</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {doctors?.map((doctor) => (
//             <DoctorCard
//               key={doctor.id}
//               doctor={doctor}
//               availableSlots={getAvailableSlots(doctor.id)}
//               onBookAppointment={handleBookAppointment}
//               onViewProfile={handleBookAppointment}
//               onCall={handleCall}
//               onMessage={handleMessage}
//               className="h-fit"
//             />
//           ))}
//         </div>
//       )}

//       {/* Load More Button */}
//       {doctors && doctors.length > 0 && (
//         <div className="text-center mt-8">
//           <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium">
//             Load More Doctors
//           </button>
//         </div>
//       )}
//     </main>
//   );
// };

// export default DoctorDetails;


import { useEffect, useState, useMemo } from "react";
import DoctorCard from "./DoctorCard";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Stethoscope, Filter, SortAsc, X, ChevronDown } from "lucide-react";
import { useApiService } from "../../hooks/useAuthWithAxios";

const DoctorDetails = () => {
  const param = useParams();
  const id = param.id;
  const location = useLocation();
  const api = useApiService();
  const doctorFromState = location.state && location.state.doctors;
  const flag = location.state && location.state.flag;
  
  const [doctors, setDoctors] = useState(doctorFromState || []);
  console.log(doctors)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Filter and Sort States
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    city: ''
  });
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  useEffect(() => {
    if(!doctorFromState && !flag)
      fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const url = `/api/public/search?keyword=${id}`;
      const response = await api.get(url);
      const json = response?.data;
      setDoctors(json);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique cities for filter dropdown
  const uniqueCities = useMemo(() => {
    if (!doctors) return [];
    const cities = doctors.map(doctor => doctor.city).filter(Boolean);
    return [...new Set(cities)].sort();
  }, [doctors]);

  // Filter and Sort Logic
  const filteredAndSortedDoctors = useMemo(() => {
    if (!doctors) return [];

    // Apply filters
    let filtered = doctors.filter(doctor => {
      // Consultation Fee Filter
      // if (filters.consultationFee.min && doctor.consultationFee < parseFloat(filters.consultationFee.min)) {
      //   return false;
      // }
      // if (filters.consultationFee.max && doctor.consultationFee > parseFloat(filters.consultationFee.max)) {
      //   return false;
      // }

      // // Experience Years Filter
      // if (filters.experienceYears.min && doctor.experienceYears < parseInt(filters.experienceYears.min)) {
      //   return false;
      // }
      // if (filters.experienceYears.max && doctor.experienceYears > parseInt(filters.experienceYears.max)) {
      //   return false;
      // }

      // // Rating Filter
      // if (filters.rating.min && doctor.rating < parseFloat(filters.rating.min)) {
      //   return false;
      // }
      // if (filters.rating.max && doctor.rating > parseFloat(filters.rating.max)) {
      //   return false;
      // }

      // City Filter
      if (filters.city && doctor.city?.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }

      return true;
    });

    // Apply sorting
    if (sortBy) {
      filtered.sort((a, b) => {
        let aValue, bValue;

        switch (sortBy) {
          case 'consultationFee':
            aValue = a.consultationFee || 0;
            bValue = b.consultationFee || 0;
            break;
          case 'experienceYears':
            aValue = a.experienceYears || 0;
            bValue = b.experienceYears || 0;
            break;
          case 'rating':
            aValue = a.rating || 0;
            bValue = b.rating || 0;
            break;
          default:
            return 0;
        }

        if (sortOrder === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      });
    }

    return filtered;
  }, [doctors, filters, sortBy, sortOrder]);

  // Handle filter changes
  const handleFilterChange = (filterType, field, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: field ? { ...prev[filterType], [field]: value } : value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      // consultationFee: { min: '', max: '' },
      // experienceYears: { min: '', max: '' },
      // rating: { min: '', max: '' },
      city: ''
    });
    setSortBy('');
    setSortOrder('asc');
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return filters.city || sortBy;
    //  filters.consultationFee.min || filters.consultationFee.max ||
    //        filters.experienceYears.min || filters.experienceYears.max ||
    //        filters.rating.min || filters.rating.max ||
  };

  // Mock available slots - replace with actual logic
  const getAvailableSlots = (doctorId) => {
    const slots = ["09:00 AM", "10:30 AM", "02:00 PM", "03:30 PM", "05:00 PM"];
    return doctorId === "1941000" ? slots : slots.slice(0, 2); // Different availability
  };

  const handleBookAppointment = (appointmentData) => {
    console.log(appointmentData)
    const {doctorId, specialization} = appointmentData;
    navigate(`/specialist/${specialization}/${doctorId}`);
  };

  const handleCall = (doctor) => {
    if (doctor.phoneNumber) {
      window.open(`tel:${doctor.phoneNumber}`);
    } else {
      alert("Phone number not available");
    }
  };

  const handleMessage = (doctor) => {
    if (doctor.email) {
      window.open(`mailto:${doctor.email}`);
    } else {
      alert("Email not available");
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse"
            >
              <div className="flex gap-4 mb-4">
                <div className="w-24 h-24 bg-gray-200 rounded-2xl"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-12 bg-gray-200 rounded-lg"></div>
                <div className="h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">
            Error loading doctors: {error.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Available Doctors
        </h1>
        <p className="text-gray-600">
          Choose from our verified healthcare professionals
        </p>
      </div>

      {/* Filter and Sort Controls */}
      <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters() && <span className="bg-blue-500 text-white text-xs rounded-full w-2 h-2"></span>}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg w-36 px-4 py-2 pr-8 text-gray-700 hover:border-gray-400 focus:outline-none focus:border-blue-500"
              >
                <option value="">Sort by</option>
                <option value="consultationFee">Consultation Fee</option>
                <option value="experienceYears">Experience</option>
                <option value="rating">Rating</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort Order */}
            {sortBy && (
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
              >
                <SortAsc className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                {sortOrder === 'asc' ? 'Low to High' : 'High to Low'}
              </button>
            )}
          </div>

          {/* Clear Filters */}
          {hasActiveFilters() && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Consultation Fee Filter */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consultation Fee (₹)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.consultationFee.min}
                  onChange={(e) => handleFilterChange('consultationFee', 'min', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.consultationFee.max}
                  onChange={(e) => handleFilterChange('consultationFee', 'max', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div> */}

            {/* Experience Years Filter */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience (Years)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.experienceYears.min}
                  onChange={(e) => handleFilterChange('experienceYears', 'min', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.experienceYears.max}
                  onChange={(e) => handleFilterChange('experienceYears', 'max', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div> */}

            {/* Rating Filter */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  min="1"
                  max="5"
                  step="0.1"
                  value={filters.rating.min}
                  onChange={(e) => handleFilterChange('rating', 'min', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  min="1"
                  max="5"
                  step="0.1"
                  value={filters.rating.max}
                  onChange={(e) => handleFilterChange('rating', 'max', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div> */}

            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', null, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="">All Cities</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredAndSortedDoctors?.length || 0} of {doctors?.length || 0} doctors
        </div>
      </div>

      {/* Doctors Grid */}
      {filteredAndSortedDoctors && filteredAndSortedDoctors.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Doctors Found
          </h3>
          <p className="text-gray-600">
            {hasActiveFilters() 
              ? "Try adjusting your filters or search criteria" 
              : "Try adjusting your search criteria"
            }
          </p>
          {hasActiveFilters() && (
            <button
              onClick={clearFilters}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAndSortedDoctors?.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              availableSlots={getAvailableSlots(doctor.id)}
              onBookAppointment={handleBookAppointment}
              onViewProfile={handleBookAppointment}
              onCall={handleCall}
              onMessage={handleMessage}
              className="h-fit"
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {filteredAndSortedDoctors && filteredAndSortedDoctors.length > 0 && (
        <div className="text-center mt-8">
          <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium">
            Load More Doctors
          </button>
        </div>
      )}
    </main>
  );
};

export default DoctorDetails;