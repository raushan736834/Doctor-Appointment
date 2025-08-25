// import api from '../../hooks/useAxios';
// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import { Star, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

// const SPECIALIST_URL = "api/public/getSpecialist"

// const SpecialistDoctorsFinder = () => {
//   const [selectedSpecialty, setSelectedSpecialty] = useState(0);
//   const [err, setErr] = useState();
//   const [specialties, setSpecialties] = useState([]);
//   const carouselRef = useRef(null);

//   useEffect(() => {
//     fetchSpecialist();
//   }, []);

//   useEffect(() => {
//     if (carouselRef.current && specialties.length > 0) {
//       // Set initial scroll position after the component mounts
//       requestAnimationFrame(() => {
//         const cardWidth = 280; // width of card + gap
//         carouselRef.current.scrollLeft = cardWidth * 2; // Scroll to show the first actual item
//       });
//     }
//   }, [specialties.length]);

//   const scrollToCard = useCallback((index) => {
//     if (carouselRef.current) {
//       const targetCard = carouselRef.current.children[index + 2];
//       if (targetCard) {
//         targetCard.scrollIntoView({
//           behavior: 'smooth',
//           block: 'nearest',
//           inline: 'center'
//         });
//       }
//     }
//   }, []);

//   const fetchSpecialist = async () => {
//     try {
//       const response = await api.get(SPECIALIST_URL);
//       setSpecialties(response.data);
//     } catch (error) {
//       console.error("Error fetching specialists:", error);
//       setErr("Failed to load specialists. Please try again later.");
//     }
//   }
//   const doctorsData = {
//     0: [ // Cardiovascular
//       {
//         name: 'Dr. Luka Willson',
//         specialty: 'Cardiac surgeon',
//         rating: 4.5,
//         address: '456 Oak Street New York, NY 10001',
//         image: '/api/placeholder/80/80',
//         verified: true
//       },
//       {
//         name: 'Dr. Jasmin Smith',
//         specialty: 'heart specialist',
//         rating: 4.5,
//         address: '789 Maple Avenue Los Angeles, CA 90001',
//         image: '/api/placeholder/80/80',
//         verified: true
//       },
//       {
//         name: 'Dr. Mary White',
//         specialty: 'Cardiac surgeon',
//         rating: 4.5,
//         address: '456 Oak Street New York, NY 10001',
//         image: '/api/placeholder/80/80',
//         verified: true
//       },
//       {
//         name: 'Dr. Sam Stone',
//         specialty: 'heart specialist',
//         rating: 4.5,
//         address: '321 Elm Road Chicago, IL 60601',
//         image: '/api/placeholder/80/80',
//         verified: true
//       },
//       {
//         name: 'Dr. Emily Jackson',
//         specialty: 'heart specialist',
//         rating: 4.5,
//         address: '789 Maple Avenue Los Angeles, CA 90001',
//         image: '/api/placeholder/80/80',
//         verified: true
//       },
//       {
//         name: 'Dr. Shawn Cabio',
//         specialty: 'Cardiac surgeon',
//         rating: 4.5,
//         address: '321 Elm Road Chicago, IL 60601',
//         image: '/api/placeholder/80/80',
//         verified: true
//       }
//     ],
//     1: [ // Orthopedist
//       {
//         name: 'Dr. Robert Johnson',
//         specialty: 'Orthopedic surgeon',
//         rating: 4.7,
//         address: '123 Medical Plaza Boston, MA 02101',
//         image: '/api/placeholder/80/80',
//         verified: true
//       },
//       {
//         name: 'Dr. Sarah Davis',
//         specialty: 'Joint specialist',
//         rating: 4.6,
//         address: '567 Health Center Miami, FL 33101',
//         image: '/api/placeholder/80/80',
//         verified: true
//       }
//     ],
//     2: [ // Internist
//       {
//         name: 'Dr. Michael Brown',
//         specialty: 'Internal medicine',
//         rating: 4.4,
//         address: '890 Care Drive Seattle, WA 98101',
//         image: '/api/placeholder/80/80',
//         verified: true
//       },
//       {
//         name: 'Dr. Lisa Wilson',
//         specialty: 'General internist',
//         rating: 4.8,
//         address: '234 Wellness Ave Denver, CO 80201',
//         image: '/api/placeholder/80/80',
//         verified: true
//       }
//     ],
//     3: [ // Pulmonologist
//       {
//         name: 'Dr. David Lee',
//         specialty: 'Lung specialist',
//         rating: 4.5,
//         address: '345 Respiratory Rd Phoenix, AZ 85001',
//         image: '/api/placeholder/80/80',
//         verified: true
//       }
//     ],
//     4: [ // Dermatologist
//       {
//         name: 'Dr. Amanda Clark',
//         specialty: 'Skin specialist',
//         rating: 4.9,
//         address: '678 Skin Care Blvd Austin, TX 73301',
//         image: '/api/placeholder/80/80',
//         verified: true
//       }
//     ]
//   };

//   const currentDoctors = doctorsData[selectedSpecialty] || [];

//   const DoctorCard = ({ doctor }) => (
//     <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
//       <div className="flex items-start space-x-4 mb-4">
//         <div className="relative">
//           <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
//             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
//               <span className="text-2xl">👨‍⚕</span>
//             </div>
//           </div>
//           {doctor.verified && (
//             <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
//               <span className="text-white text-xs">✓</span>
//             </div>
//           )}
//         </div>
        
//         <div className="flex-1">
//           <h3 className="font-semibold text-gray-900 text-lg mb-1">{doctor.name}</h3>
//           <p className="text-gray-600 text-sm mb-2">{doctor.specialty}</p>
          
//           <div className="flex items-center mb-2">
//             <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
//             <span className="font-semibold text-gray-900">{doctor.rating}</span>
//           </div>
          
//           <div className="flex items-start text-gray-600 text-sm">
//             <span className="mr-1">📍</span>
//             <span>{doctor.address}</span>
//           </div>
//         </div>
//       </div>
      
//       <div className="flex space-x-3">
//         <button className="flex-1 bg-blue-900 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
//           Book Appointment
//         </button>
//         <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
//           <span className="mr-1">Doctor Profile</span>
//           <ArrowRight className="w-4 h-4" />
//         </button>
//       </div>
//     </div>
//   );

//   const SpecialtyCard = ({ specialty, index, isSelected, onClick }) => (
//     <div 
//       className={`flex-shrink-0 w-64 h-32 rounded-xl cursor-pointer transition-all transform hover:scale-105 ${isSelected ? 'bg-blue-900' : 'bg-gray-300'} ${isSelected ? 'shadow-lg' : 'shadow-sm'}`}
//       onClick={() => onClick(index)}
//     >
//       <div className="p-6 h-full flex items-center">
//         <div className="flex items-center space-x-4">
//           <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
//             <img
//               src={specialty.image}
//               alt={specialty.name}
//               loading="lazy"
//               className="object-cover w-full h-full"
//             />
//           </div>
//           <div>
//             <h3 className={`text-right text-lg font-semibold ${isSelected ? 'text-white' : 'text-gray-700'}`}>
//               {specialty.specialist}
//             </h3>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const handlePrevSpecialty = () => {
//     setSelectedSpecialty((prev) => (prev > 0 ? prev - 1 : specialties.length - 1));
//   };

//   const handleNextSpecialty = () => {
//     setSelectedSpecialty((prev) => (prev < specialties.length - 1 ? prev + 1 : 0));
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-white via-gray-100 to-white py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">
//             Find top specialist doctors here
//           </h1>
//         </div>

//         {/* Specialty Carousel */}
//         <div className="mb-12">
//           <div className="relative px-8">
//             <div 
//               ref={carouselRef}
//               className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
//               style={{
//                 scrollBehavior: 'smooth',
//                 scrollSnapType: 'x mandatory',
//                 padding: '0 calc(50% - 128px)', // Centers active card (half of container minus half of card width)
//                 WebkitOverflowScrolling: 'touch'
//               }}
//             >
//               {[
//                 ...specialties.slice(-2),
//                 ...specialties,
//                 ...specialties.slice(0, 2)
//               ].map((specialty, index) => (
//                 <div 
//                   key={index}
//                   className="flex-none"
//                   style={{ scrollSnapAlign: 'center' }}
//                 >
//                   <SpecialtyCard
//                     specialty={specialty}
//                     index={index - 2}
//                     isSelected={selectedSpecialty === (index - 2 + specialties.length) % specialties.length}
//                     onClick={(idx) => {
//                       const adjustedIndex = ((idx - 2 + specialties.length) % specialties.length);
//                       setSelectedSpecialty(adjustedIndex);
//                       scrollToCard(adjustedIndex);
//                     }}
//                   />
//                 </div>
//               ))}
//             </div>
            
//             {/* Carousel Navigation Buttons */}
//             <button
//               className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur rounded-full p-3 shadow-lg hover:shadow-xl transition-all z-10 border border-gray-100 hover:bg-blue-50"
//               onClick={() => {
//                 handlePrevSpecialty();
//                 const newIndex = selectedSpecialty > 0 ? selectedSpecialty - 1 : specialties.length - 1;
//                 scrollToCard(newIndex);
//               }}
//             >
//               <ChevronLeft className="w-6 h-6 text-gray-600" />
//             </button>
//             <button
//               className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur rounded-full p-3 shadow-lg hover:shadow-xl transition-all z-10 border border-gray-100 hover:bg-blue-50"
//               onClick={() => {
//                 handleNextSpecialty();
//                 const newIndex = selectedSpecialty < specialties.length - 1 ? selectedSpecialty + 1 : 0;
//                 scrollToCard(newIndex);
//               }}
//             >
//               <ChevronRight className="w-6 h-6 text-gray-600" />
//             </button>
//           </div>
//         </div>

//         {/* Doctors Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {currentDoctors.map((doctor, index) => (
//             <DoctorCard key={index} doctor={doctor} />
//           ))}
//         </div>

//         {/* Empty State */}
//         {currentDoctors.length === 0 && (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-lg">No doctors found for this specialty.</p>
//           </div>
//         )}

//         {/* Error Message */}
//         {err && (
//           <div className="text-center text-red-500 mb-4">
//             {err}
//           </div>
//         )}
//       </div>
      
//       <style>{`
//         .scrollbar-hide {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//         .scrollbar-hide::-webkit-scrollbar {
//           display: none;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SpecialistDoctorsFinder;

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Star, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../hooks/useAxios';

const SPECIALIST_URL = "api/public/getSpecialist"

const SpecialistDoctorsFinder = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState(0);
  const [err, setErr] = useState();
  const [specialties, setSpecialties] = useState([]);
  const carouselRef = useRef(null);

  useEffect(() => {
    // Simulate API call
    fetchSpecialist();
  }, []);

  const fetchSpecialist = async () => {
    try {
      const response = await api.get(SPECIALIST_URL);
      setSpecialties(response.data);
    } catch (error) {
      console.error("Error fetching specialists:", error);
      setErr("Failed to load specialists. Please try again later.");
    }
  }

  const scrollToCard = useCallback((index) => {
    if (carouselRef.current && specialties.length > 0) {
      const cardWidth = 280; // width of card + gap
      const scrollPosition = cardWidth * (index + 2); // +2 because of the duplicated items at start
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [specialties.length]);

  useEffect(() => {
    if (carouselRef.current && specialties.length > 0) {
      // Set initial scroll position after the component mounts
      setTimeout(() => {
        scrollToCard(selectedSpecialty);
      }, 100);
    }
  }, [specialties.length, scrollToCard, selectedSpecialty]);

  const doctorsData = {
    0: [
      {
        name: 'Dr. Luka Willson',
        specialty: 'Cardiac surgeon',
        rating: 4.5,
        address: '456 Oak Street New York, NY 10001',
        image: '/api/placeholder/80/80',
        verified: true
      },
      {
        name: 'Dr. Jasmin Smith',
        specialty: 'heart specialist',
        rating: 4.5,
        address: '789 Maple Avenue Los Angeles, CA 90001',
        image: '/api/placeholder/80/80',
        verified: true
      },
      {
        name: 'Dr. Mary White',
        specialty: 'Cardiac surgeon',
        rating: 4.5,
        address: '456 Oak Street New York, NY 10001',
        image: '/api/placeholder/80/80',
        verified: true
      },
      {
        name: 'Dr. Sam Stone',
        specialty: 'heart specialist',
        rating: 4.5,
        address: '321 Elm Road Chicago, IL 60601',
        image: '/api/placeholder/80/80',
        verified: true
      },
      {
        name: 'Dr. Emily Jackson',
        specialty: 'heart specialist',
        rating: 4.5,
        address: '789 Maple Avenue Los Angeles, CA 90001',
        image: '/api/placeholder/80/80',
        verified: true
      },
      {
        name: 'Dr. Shawn Cabio',
        specialty: 'Cardiac surgeon',
        rating: 4.5,
        address: '321 Elm Road Chicago, IL 60601',
        image: '/api/placeholder/80/80',
        verified: true
      }
    ],
    1: [
      {
        name: 'Dr. Robert Johnson',
        specialty: 'Orthopedic surgeon',
        rating: 4.7,
        address: '123 Medical Plaza Boston, MA 02101',
        image: '/api/placeholder/80/80',
        verified: true
      },
      {
        name: 'Dr. Sarah Davis',
        specialty: 'Joint specialist',
        rating: 4.6,
        address: '567 Health Center Miami, FL 33101',
        image: '/api/placeholder/80/80',
        verified: true
      }
    ],
    2: [ 
      {
        name: 'Dr. Michael Brown',
        specialty: 'Internal medicine',
        rating: 4.4,
        address: '890 Care Drive Seattle, WA 98101',
        image: '/api/placeholder/80/80',
        verified: true
      },
      {
        name: 'Dr. Lisa Wilson',
        specialty: 'General internist',
        rating: 4.8,
        address: '234 Wellness Ave Denver, CO 80201',
        image: '/api/placeholder/80/80',
        verified: true
      }
    ],
    3: [
      {
        name: 'Dr. David Lee',
        specialty: 'Lung specialist',
        rating: 4.5,
        address: '345 Respiratory Rd Phoenix, AZ 85001',
        image: '/api/placeholder/80/80',
        verified: true
      }
    ],
    4: [ 
      {
        name: 'Dr. Amanda Clark',
        specialty: 'Skin specialist',
        rating: 4.9,
        address: '678 Skin Care Blvd Austin, TX 73301',
        image: '/api/placeholder/80/80',
        verified: true
      }
    ]
  };

  const currentDoctors = doctorsData[selectedSpecialty] || [];

  const DoctorCard = ({ doctor }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4 mb-4">
        <div className="relative">
          <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👨‍⚕</span>
            </div>
          </div>
          {doctor.verified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">{doctor.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{doctor.specialty}</p>
          
          <div className="flex items-center mb-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="font-semibold text-gray-900">{doctor.rating}</span>
          </div>
          
          <div className="flex items-start text-gray-600 text-sm">
            <span className="mr-1">📍</span>
            <span>{doctor.address}</span>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-3">
        <button className="flex-1 bg-blue-900 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Book Appointment
        </button>
        <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <span className="mr-1">Doctor Profile</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const SpecialtyCard = ({ specialty, index, isSelected, onClick }) => (
    <div 
      className={`flex-shrink-0 w-64 h-32 rounded-xl cursor-pointer transition-all transform hover:scale-105 ${isSelected ? 'bg-blue-900' : 'bg-gray-300'} ${isSelected ? 'shadow-lg' : 'shadow-sm'}`}
      onClick={() => onClick(index)}
    >
      <div className="p-6 h-full flex items-center">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
            <img
              src={specialty.image}
              alt={specialty.specialist}
              loading="lazy"
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h3 className={`text-right text-lg font-semibold ${isSelected ? 'text-white' : 'text-gray-700'}`}>
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
    const newIndex = selectedSpecialty > 0 ? selectedSpecialty - 1 : specialties.length - 1;
    setSelectedSpecialty(newIndex);
    scrollToCard(newIndex);
  };

  const handleNextSpecialty = () => {
    const newIndex = selectedSpecialty < specialties.length - 1 ? selectedSpecialty + 1 : 0;
    setSelectedSpecialty(newIndex);
    scrollToCard(newIndex);
  };

  // Create extended array for infinite scroll effect
  const extendedSpecialties = [
    ...specialties.slice(-2), // Last 2 items at the beginning
    ...specialties,           // All original items
    ...specialties.slice(0, 2) // First 2 items at the end
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-gray-100 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
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
                scrollBehavior: 'smooth',
                scrollSnapType: 'x mandatory',
                padding: '0 calc(50% - 128px)',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {extendedSpecialties.map((specialty, extendedIndex) => {
                // Calculate the actual specialty index
                const actualIndex = extendedIndex < 2 
                  ? specialties.length - (2 - extendedIndex) // Last items at beginning
                  : extendedIndex >= specialties.length + 2 
                  ? extendedIndex - specialties.length - 2 // First items at end
                  : extendedIndex - 2; // Normal items

                const isSelected = selectedSpecialty === actualIndex;

                return (
                  <div 
                    key={`${actualIndex}-${extendedIndex}`}
                    className="flex-none"
                    style={{ scrollSnapAlign: 'center' }}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentDoctors.map((doctor, index) => (
            <DoctorCard key={index} doctor={doctor} />
          ))}
        </div>

        {/* Empty State */}
        {currentDoctors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No doctors found for this specialty.</p>
          </div>
        )}

        {/* Error Message */}
        {err && (
          <div className="text-center text-red-500 mb-4">
            {err}
          </div>
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
