// import React, { useState, useEffect } from "react";
// import { Calendar, Stethoscope, X, Edit3, MapPin, Star, ChevronLeft, ChevronRight } from "lucide-react";
// import { useApiService, useAuthWithAxios } from "../../hooks/useAuthWithAxios";
// import RescheduleModal from "../DoctorComponent/RescheduleModal";
// import { cancelAppointment } from "../../constants/Method";
// import { useToast } from "@chakra-ui/react";
// import OverlayLoader from "../Common/Loader";
// import { useNavigate } from "react-router-dom";
// import defaultImage from "../../assets/img/defaultClinicImage.jpg";
// import { ROLES } from "../../constants/slots";

// const BookedAppointments = () => {
  // const { user } = useAuthWithAxios();
  // const email = user?.email;
  // const [isLoading, setIsLoading] = useState(false);
  // const [appointments, setAppointments] = useState([]);
  // const [showCancelModal, setShowCancelModal] = useState(false);
  // const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  // const [selectedAppointment, setSelectedAppointment] = useState(null);
  // const toast = useToast();
  // const api = useApiService();
  // const navigate = useNavigate();
  // const [activeTab, setActiveTab] = useState("upcoming");
  // const [reviewData, setReviewData] = useState({
  //   rating: 0,
  //   review: ""
  // });
  
  // // Pagination states
  // const [upcomingPage, setUpcomingPage] = useState(1);
  // const [pastPage, setPastPage] = useState(1);
  // const itemsPerPage = 6;

//   const getStatusStyle = (status) => {
//     switch (status) {
//       case "BOOKED":
//         return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25";
//       case "RESCHEDULED":
//         return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25";
//       case "CANCELLED":
//         return "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25";
//       default:
//         return "bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg shadow-gray-500/25";
//     }
//   };

//   const goHome = () => {
//     navigate("/");
//   };

  // const handleConfirmCancel = async () => {
  //   console.log(selectedAppointment);
  //   if (!selectedAppointment) return;

  //   await cancelAppointment(
  //     selectedAppointment,
  //     toast,
  //     setIsLoading,
  //     api,
  //     () => {
  //       // Success callback
  //       fetchAppointments(); 
  //       setSelectedAppointment(null);
  //     },
  //     (error) => {
  //       // Error callback
  //       console.error("Cancellation failed:", error);
  //       setSelectedAppointment(null);
  //     }
  //   );
  //   setShowCancelModal(false);
  // };

//   const handleCancel = (appointment) => {
//     setSelectedAppointment(appointment);
//     setShowCancelModal(true);
//   };

//   const handleReschedule = (appointment) => {
//     setSelectedAppointment(appointment);
//     setShowRescheduleModal(true);
//   };

  // const handleRescheduleSuccess = (updatedAppointment) => {
  //   setShowRescheduleModal(false);
    
  //   // Update appointments state directly without API call
  //   if (updatedAppointment) {
  //     setAppointments((prevAppointments) =>
  //       prevAppointments.map((apt) =>
  //         apt.appointmentId === updatedAppointment.appointmentId
  //           ? updatedAppointment
  //           : apt
  //       )
  //     );
  //   } else {
  //     // Fallback: fetch appointments if updated appointment is not provided
  //     fetchAppointments();
  //   }
  // };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       weekday: "short",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const getDaysUntil = (dateString) => {
//     const today = new Date();
//     const appointmentDate = new Date(dateString);
//     const diffTime = appointmentDate - today;
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays === 0) return "Today";
//     if (diffDays === 1) return "Tomorrow";
//     if (diffDays > 0) return `In ${diffDays} days`;
//     return "Past";
//   };

//   const handleReview = (appointment) => {
//     setSelectedAppointment(appointment);
//     setReviewData({
//       rating: appointment.userRating || 0,
//       review: appointment.userReview || ""
//     });
//     setShowReviewModal(true);
//   };

//   const handleSubmitReview = () => {
//     console.log("Submitting review:", {
//       appointmentId: selectedAppointment.appointmentId,
//       ...reviewData
//     });
    
//     setAppointments(prev => prev.map(apt => 
//       apt.appointmentId === selectedAppointment.appointmentId
//         ? { ...apt, hasReview: true, userRating: reviewData.rating, userReview: reviewData.review }
//         : apt
//     ));
    
//     setShowReviewModal(false);
//     setReviewData({ rating: 0, review: "" });
//   };

//   // Pagination logic
//   const getPaginatedData = (data, currentPage) => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     return data.slice(startIndex, endIndex);
//   };

//   const getTotalPages = (data) => {
//     return Math.ceil(data.length / itemsPerPage);
//   };

  // useEffect(() => {
  //   if (!email) return;
  //   fetchAppointments();
  // }, [email]);

  // const fetchAppointments = () => {
  //   if (!email) return;
  //   setIsLoading(true);
  //   api
  //     .get(`appointment/bookingUser/${email}`)
  //     .then((response) => {
  //       console.log(response);
  //       const filteredAppointments = response.data
  //         .filter(
  //           (appointment) =>
  //             appointment.status === "BOOKED" ||
  //             appointment.status === "RESCHEDULED"
  //         )
  //         .reverse();
  //       setAppointments(filteredAppointments);
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching appointments:", error);
  //       setIsLoading(false);
  //     });
  // };

//   const paginatedUpcoming = getPaginatedData(upcomingAppointments, upcomingPage);
//   const paginatedPast = getPaginatedData(pastAppointments, pastPage);
//   const upcomingTotalPages = getTotalPages(upcomingAppointments);
//   const pastTotalPages = getTotalPages(pastAppointments);

//   const handlePageChange = (type, direction) => {
//     if (type === "upcoming") {
//       if (direction === "next" && upcomingPage < upcomingTotalPages) {
//         setUpcomingPage(upcomingPage + 1);
//       } else if (direction === "prev" && upcomingPage > 1) {
//         setUpcomingPage(upcomingPage - 1);
//       }
//     } else {
//       if (direction === "next" && pastPage < pastTotalPages) {
//         setPastPage(pastPage + 1);
//       } else if (direction === "prev" && pastPage > 1) {
//         setPastPage(pastPage - 1);
//       }
//     }
//   };

//   const defaultImage = "https://via.placeholder.com/150";

//   // Pagination component
//   const PaginationControls = ({ currentPage, totalPages, onPageChange, type }) => {
//     if (totalPages <= 1) return null;

//     return (
//       <div className="flex items-center justify-center space-x-4 mt-8 mb-4">
//         <button
//           onClick={() => onPageChange(type, "prev")}
//           disabled={currentPage === 1}
//           className="flex items-center space-x-2 px-4 py-2 bg-white/70 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           <ChevronLeft className="w-5 h-5" />
//           <span className="font-medium">Previous</span>
//         </button>

//         <div className="flex items-center space-x-2">
//           {[...Array(totalPages)].map((_, index) => {
//             const pageNumber = index + 1;
//             // Show first page, last page, current page, and pages around current
//             if (
//               pageNumber === 1 ||
//               pageNumber === totalPages ||
//               (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
//             ) {
//               return (
//                 <button
//                   key={pageNumber}
//                   onClick={() => {
//                     if (type === "upcoming") setUpcomingPage(pageNumber);
//                     else setPastPage(pageNumber);
//                   }}
//                   className={`w-10 h-10 rounded-xl font-semibold transition-all ${
//                     currentPage === pageNumber
//                       ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
//                       : "bg-white/70 backdrop-blur-lg text-gray-700 hover:bg-white border border-white/20"
//                   }`}
//                 >
//                   {pageNumber}
//                 </button>
//               );
//             } else if (
//               pageNumber === currentPage - 2 ||
//               pageNumber === currentPage + 2
//             ) {
//               return (
//                 <span key={pageNumber} className="text-gray-500">
//                   ...
//                 </span>
//               );
//             }
//             return null;
//           })}
//         </div>

//         <button
//           onClick={() => onPageChange(type, "next")}
//           disabled={currentPage === totalPages}
//           className="flex items-center space-x-2 px-4 py-2 bg-white/70 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           <span className="font-medium">Next</span>
//           <ChevronRight className="w-5 h-5" />
//         </button>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//       {/* Show overlay loader if isLoading is true */}
//       {isLoading && <OverlayLoader />}
      
//       <div className="relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
//         <div className="relative backdrop-blur-xl bg-white/70 border-b border-white/20">
//           <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1
//                   className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800
//                  to-purple-800 bg-clip-text text-transparent mb-2 leading-[1.2] pb-2"
//                 >
//                   My Appointments
//                 </h1>
//                 <p className="text-lg text-gray-600">
//                   Manage your healthcare journey with ease
//                 </p>
//               </div>
//               <div className="hidden md:flex items-center space-x-4">
//                 <div className="text-right">
//                   <div className="text-2xl font-bold text-gray-800">
//                     {appointments.length}
//                   </div>
//                   <div className="text-sm text-gray-500">
//                     Total Appointments
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
//         {/* Stats Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//           {[
//             {
//               label: "Upcoming",
//               count: upcomingAppointments.length,
//               color: "bg-emerald-500",
//             },
//             {
//               label: "Completed",
//               count: pastAppointments.filter(a => a.status === "COMPLETED").length,
//               color: "bg-purple-500",
//             },
//             {
//               label: "Cancelled",
//               count: pastAppointments.filter(a => a.status === "CANCELLED").length,
//               color: "bg-red-500",
//             },
//             {
//               label: "Total",
//               count: appointments.length,
//               color: "bg-orange-500",
//             },
//           ].map((stat, index) => (
//             <div
//               key={index}
//               className="bg-white/60 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-lg"
//             >
//               <div className={`w-3 h-3 ${stat.color} rounded-full mb-2`}></div>
//               <div className="text-2xl font-bold text-gray-800">{stat.count}</div>
//               <div className="text-sm text-gray-600">{stat.label}</div>
//             </div>
//           ))}
//         </div

//       {/* Modern Cancel Modal with Glassmorphism */}
//       {showCancelModal && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2">
//           <div className="bg-white/90 backdrop-blur-xl rounded-3xl max-w-md w-full p-4 shadow-2xl border border-white/20">
//             <div className="text-center mb-6">
//               <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
//                 <X className="w-8 h-8 text-white" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-800 mb-2">
//                 Cancel Appointment
//               </h3>
//               <p className="text-gray-600">
//                 Are you sure you want to cancel your appointment with{" "}
//                 {selectedAppointment?.doctorName}
//                 <span className="font-semibold text-gray-800">
//                   {selectedAppointment?.doctor?.firstName}
//                 </span>
//                 ?
//               </p>
//             </div>

//             <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
//               <p className="text-sm text-red-800">
//                 <strong>Note:</strong> Cancellation less than 24 hours before
//                 the appointment may incur charges.
//               </p>
//             </div>

//             <div className="flex space-x-3">
//               <button
//                 onClick={() => setShowCancelModal(false)}
//                 className="flex-1 sm:px-6 px-4 py-3 border-2 bg-white border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors"
//               >
//                 Keep Appointment
//               </button>
//               <button
//                 onClick={handleConfirmCancel}
//                 className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl 
//                 font-medium shadow-lg hover:shadow-red-500/40 transition-all"
//               >
//                 Yes, Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modern Reschedule Modal */}
//       {showRescheduleModal && (
//         <RescheduleModal
//           selectedAppointment={selectedAppointment}
//           onClose={() => {
//             setShowRescheduleModal(false);
//             setSelectedAppointment(null);
//           }}
//           onRescheduleSuccess={handleRescheduleSuccess}
//           rescheduledBy={ROLES.user}
//         />
//       )}
//     </div>
//   );
// };

// export default BookedAppointments;

import React, { useState, useEffect } from "react";
import { Calendar, Stethoscope, X, Edit3, MapPin, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useApiService, useAuthWithAxios } from "../../hooks/useAuthWithAxios";
import RescheduleModal from "../DoctorComponent/RescheduleModal";
import { cancelAppointment } from "../../constants/Method";
import { useToast } from "@chakra-ui/react";
import OverlayLoader from "../Common/Loader";
import { useNavigate } from "react-router-dom";
import defaultImage from "../../assets/img/defaultClinicImage.jpg";
import { ROLES } from "../../constants/slots";

const BookedAppointments = () => {
  const { user } = useAuthWithAxios();
  const email = user?.email;
  const toast = useToast();
  const api = useApiService();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [reviewData, setReviewData] = useState({
    rating: 0,
    review: "",
    anonymous: false
  });
  
  // Pagination states
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);
  const itemsPerPage = 6;

  const fetchAllAppointments = async () => {
    if (!email) return;

    setIsLoading(true);
    try {
      const [upcomingResp, pastResp] = await Promise.all([
        api.get(`appointment/user/booking/${email}`),
        api.get(`appointment/user/past-booking/${email}`),
      ]);


      const upcomingList = (upcomingResp.data || [])
        .filter(
          (appointment) =>
            appointment.status === "BOOKED" ||
            appointment.status === "RESCHEDULED"
        )
        .reverse();

      // API contract: returns past appointments, but we still guard by status
      const pastList = (pastResp.data || [])
        .filter(
          (appointment) =>
            appointment.status === "COMPLETED" ||
            appointment.status === "CANCELLED"
        )
        .reverse();

      setUpcomingAppointments(upcomingList);
      setPastAppointments(pastList);
      
      // Reset pagination when data changes
      setUpcomingPage(1);
      setPastPage(1);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setUpcomingAppointments([]);
      setPastAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };
  console.log(pastAppointments);
  

  const getStatusStyle = (status) => {
    switch (status) {
      case "BOOKED":
        return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25";
      case "RESCHEDULED":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25";
      case "CANCELLED":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25";
      case "COMPLETED":
        return "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/25";
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg shadow-gray-500/25";
    }
  };

  const handleCancel = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    console.log(selectedAppointment);
    if (!selectedAppointment) return;

    await cancelAppointment(
      selectedAppointment,
      toast,
      setIsLoading,
      api,
      () => {
        // Success callback
        fetchAllAppointments();
        setSelectedAppointment(null);
      },
      (error) => {
        // Error callback
        console.error("Cancellation failed:", error);
        setSelectedAppointment(null);
      }
    );
    setShowCancelModal(false);
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
  };

  const handleRescheduleSuccess = (updatedAppointment) => {
    setShowRescheduleModal(false);
    
    if (updatedAppointment) {
      setUpcomingAppointments((prevAppointments) =>
        prevAppointments.map((apt) =>
          apt.appointmentId === updatedAppointment.appointmentId
            ? updatedAppointment
            : apt
        )
      );
    } else {
      fetchAllAppointments();
    }
  };

  const handleReview = (appointment) => {
    setSelectedAppointment(appointment);
    setReviewData({
      rating: appointment.rating || 0,
      review: appointment.review || "",
      anonymous: appointment.anonymous || false
    });
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedAppointment || reviewData.rating === 0) return;

    setIsLoading(true);
    try {
      const ratingPayload = {
        appointmentId: selectedAppointment.appointmentId,
        rating: reviewData.rating,
        review: reviewData.review || null,
        anonymous: reviewData.anonymous || false
      };

      const response = await api.post("/api/ratings", ratingPayload);

      if (response.success || response) {
        // Update local state
        setPastAppointments(prev => prev.map(apt => 
          apt.appointmentId === selectedAppointment.appointmentId
            ? { 
                ...apt, 
                rating: reviewData.rating, 
                review: reviewData.review,
                anonymous: reviewData.anonymous
              }
            : apt
        ));

        toast({
          position: "top-center",
          title: "Review Submitted Successfully!",
          description: "Thank you for your feedback.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });

        setShowReviewModal(false);
        setReviewData({ rating: 0, review: "", anonymous: false });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        position: "top-center",
        title: "Failed to Submit Review",
        description: error.response?.data?.message || error.message || "Please try again later.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysUntil = (dateString) => {
    const today = new Date();
    const appointmentDate = new Date(dateString);
    const diffTime = appointmentDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays > 0) return `In ${diffDays} days`;
    return "Past";
  };

  // Pagination logic
  const getPaginatedData = (data, currentPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (data) => {
    return Math.ceil(data.length / itemsPerPage);
  };

  useEffect(() => {
    if (!email) return;
    fetchAllAppointments();
  }, [email]);

  const paginatedUpcoming = getPaginatedData(upcomingAppointments, upcomingPage);
  const paginatedPast = getPaginatedData(pastAppointments, pastPage);
  const upcomingTotalPages = getTotalPages(upcomingAppointments);
  const pastTotalPages = getTotalPages(pastAppointments);

  const handlePageChange = (type, direction) => {
    if (type === "upcoming") {
      if (direction === "next" && upcomingPage < upcomingTotalPages) {
        setUpcomingPage(upcomingPage + 1);
      } else if (direction === "prev" && upcomingPage > 1) {
        setUpcomingPage(upcomingPage - 1);
      }
    } else {
      if (direction === "next" && pastPage < pastTotalPages) {
        setPastPage(pastPage + 1);
      } else if (direction === "prev" && pastPage > 1) {
        setPastPage(pastPage - 1);
      }
    }
  };

  const defaultImage = "https://via.placeholder.com/150";
  const totalAppointmentsCount = upcomingAppointments.length + pastAppointments.length;

  // Pagination component
  const PaginationControls = ({ currentPage, totalPages, onPageChange, type }) => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center space-x-4 mt-8 mb-4">
        <button
          onClick={() => onPageChange(type, "prev")}
          disabled={currentPage === 1}
          className="flex items-center space-x-2 px-4 py-2 bg-white/70 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Previous</span>
        </button>

        <div className="flex items-center space-x-2">
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            // Show first page, last page, current page, and pages around current
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
              return (
                <button
                  key={pageNumber}
                  onClick={() => {
                    if (type === "upcoming") setUpcomingPage(pageNumber);
                    else setPastPage(pageNumber);
                  }}
                  className={`w-10 h-10 rounded-xl font-semibold transition-all ${
                    currentPage === pageNumber
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "bg-white/70 backdrop-blur-lg text-gray-700 hover:bg-white border border-white/20"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            } else if (
              pageNumber === currentPage - 2 ||
              pageNumber === currentPage + 2
            ) {
              return (
                <span key={pageNumber} className="text-gray-500">
                  ...
                </span>
              );
            }
            return null;
          })}
        </div>

        <button
          onClick={() => onPageChange(type, "next")}
          disabled={currentPage === totalPages}
          className="flex items-center space-x-2 px-4 py-2 bg-white/70 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="font-medium">Next</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative backdrop-blur-xl bg-white/70 border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2 leading-[1.2] pb-2">
                  My Appointments
                </h1>
                <p className="text-lg text-gray-600">
                  Manage your healthcare journey with ease
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">
                    {totalAppointmentsCount}
                  </div>
                  <div className="text-sm text-gray-500">Total Appointments</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Upcoming",
              count: upcomingAppointments.length,
              color: "bg-emerald-500",
            },
            {
              label: "Completed",
              count: pastAppointments.filter(a => a.status === "COMPLETED").length,
              color: "bg-purple-500",
            },
            {
              label: "Cancelled",
              count: pastAppointments.filter(a => a.status === "CANCELLED").length,
              color: "bg-red-500",
            },
            {
              label: "Total",
              count: totalAppointmentsCount,
              color: "bg-orange-500",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/60 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-lg"
            >
              <div className={`w-3 h-3 ${stat.color} rounded-full mb-2`}></div>
              <div className="text-2xl font-bold text-gray-800">{stat.count}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-6 bg-white/60 backdrop-blur-lg rounded-2xl p-2 border border-white/20 shadow-lg w-fit">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "upcoming"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Upcoming ({upcomingAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "past"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Past ({pastAppointments.length})
          </button>
        </div>

        {/* Upcoming Appointments Section */}
        {activeTab === "upcoming" && (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {paginatedUpcoming.map((appointment) => (
                <div
                  key={appointment.appointmentId}
                  className="group relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 hover:scale-[1.02] hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-700">
                          {getDaysUntil(appointment?.appointmentDate)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg">
                          <img
                            src={defaultImage}
                            alt={appointment?.doctorName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-800 truncate">
                          {appointment?.doctorName}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Stethoscope className="w-4 h-4" />
                          <span>{appointment?.specialization}</span>
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium text-gray-700">4.2</span>
                          <span className="text-xs text-gray-500">
                            ({appointment?.yearOfExp}+ years)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 py-8">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-medium text-gray-800">
                              {formatDate(appointment?.appointmentDate)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {appointment?.appointmentTime}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-800">
                            ₹{appointment?.consultationFees}
                          </div>
                          <div className="text-xs text-gray-500">
                            {appointment.paymentType}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{appointment?.clinicName}</span>
                        </div>
                        <div className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                          Clinic Visit
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleReschedule(appointment)}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Reschedule</span>
                      </button>
                      <button
                        onClick={() => handleCancel(appointment)}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105 transition-all duration-200"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {upcomingAppointments.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">No Upcoming Appointments</h3>
                  <p className="text-gray-600">You don't have any upcoming appointments scheduled.</p>
                </div>
              )}
            </div>

            <PaginationControls
              currentPage={upcomingPage}
              totalPages={upcomingTotalPages}
              onPageChange={handlePageChange}
              type="upcoming"
            />
          </>
        )}

        {/* Past Appointments Section */}
        {activeTab === "past" && (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {paginatedPast.map((appointment) => (
                <div
                  key={appointment.appointmentId}
                  className="group relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 hover:scale-[1.02] hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-indigo-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </div>
                      {appointment.rating && appointment.review && (
                        <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold text-gray-700">{appointment.rating}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 mb-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-white shadow-lg">
                          <img
                            src={defaultImage}
                            alt={appointment?.doctorName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-800 truncate">
                          {appointment?.doctorName}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Stethoscope className="w-4 h-4" />
                          <span>{appointment?.specialization}</span>
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          <span className="text-xs text-gray-500">
                            {appointment?.yearOfExp}+ years experience
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 py-4">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-purple-600" />
                          <div>
                            <div className="font-medium text-gray-800">
                              {formatDate(appointment?.appointmentDate)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {appointment?.appointmentTime}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-800">
                            ₹{appointment?.consultationFees}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{appointment?.clinicName}</span>
                      </div>
                    </div>

                    {appointment.rating && appointment.review ? (
                      <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= appointment.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          {appointment.anonymous && (
                            <span className="text-xs text-gray-500 italic">Anonymous</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 italic">"{appointment.review}"</p>
                      </div>
                    ) : appointment.status === "COMPLETED" ? (
                      <button
                        onClick={() => handleReview(appointment)}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-xl font-medium shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 hover:scale-105 transition-all duration-200"
                      >
                        <Star className="w-4 h-4" />
                        <span>Rate & Review</span>
                      </button>
                    ) : (
                      <div className="w-full py-3 text-center text-sm text-gray-500">
                        Appointment was cancelled
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {pastAppointments.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">No Past Appointments</h3>
                  <p className="text-gray-600">Your appointment history will appear here.</p>
                </div>
              )}
            </div>

            <PaginationControls
              currentPage={pastPage}
              totalPages={pastTotalPages}
              onPageChange={handlePageChange}
              type="past"
            />
          </>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl max-w-md w-full p-6 shadow-2xl border border-white/20">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <X className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Cancel Appointment</h3>
              <p className="text-gray-600">
                Are you sure you want to cancel your appointment with{" "}
                <span className="font-semibold text-gray-800">{selectedAppointment?.doctorName}</span>?
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-800">
                <strong>Note:</strong> Cancellation less than 24 hours before the appointment may incur charges.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-6 py-3 border-2 bg-white border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium shadow-lg hover:shadow-red-500/40 transition-all"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl max-w-md w-full p-6 shadow-2xl border border-white/20">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Star className="w-8 h-8 text-white fill-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                Rate Your Experience
              </h3>
              <p className="text-gray-600 text-center">
                How was your appointment with{" "}
                <span className="font-semibold text-gray-800">{selectedAppointment?.doctorName}</span>?
              </p>
            </div>

            <div className="flex justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setReviewData({ ...reviewData, rating: star })}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= reviewData.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 hover:text-yellow-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share your experience (optional)
              </label>
              <textarea
                value={reviewData.review}
                onChange={(e) => {
                  const reviewText = e.target.value;
                  if (reviewText.length <= 1000) {
                    setReviewData({ ...reviewData, review: reviewText });
                  }
                }}
                placeholder="Tell us about your appointment..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
                rows="4"
                maxLength={1000}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {reviewData.review.length}/1000 characters
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reviewData.anonymous}
                  onChange={(e) => setReviewData({ ...reviewData, anonymous: e.target.checked })}
                  className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                />
                <span className="text-sm text-gray-700">Submit as anonymous</span>
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewData({ rating: 0, review: "", anonymous: false });
                }}
                disabled={isLoading}
                className="flex-1 px-6 py-3 border-2 bg-white border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={reviewData.rating === 0 || isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-xl font-medium shadow-lg hover:shadow-yellow-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Review</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern Reschedule Modal */}
      {showRescheduleModal && (
        <RescheduleModal
          selectedAppointment={selectedAppointment}
          onClose={() => {
            setShowRescheduleModal(false);
            setSelectedAppointment(null);
          }}
          onRescheduleSuccess={handleRescheduleSuccess}
          rescheduledBy={ROLES.user}
        />
      )}
    </div>
  );
};

export default BookedAppointments;