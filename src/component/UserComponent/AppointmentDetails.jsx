// import React, { useRef, useState, useEffect } from "react";
// import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
// import { Calendar, Clock } from "lucide-react";
// import defaultImage from "../../assets/img/defaultClinicImage.jpg";
// import useAuth from "../../hooks/useAuth";
// import * as Yup from "yup";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import { format } from "date-fns";
// import useRazorpayScript from "../../hooks/useRazorpayScript";
// import api from "../../hooks/useAxios";
// import { AppointmentStatus } from "../../constants/slots";
// import OverlayLoader from "../Common/Loader";
// import ErrorBoundary from "../Common/ErrorBoudary";
// import useDate from "../../hooks/useDate";

// const BOOKED_URL = "/appointment/book-appointment";
// const FETCH_DOCTOR_DATA = "/api/user/getDoctor";

// function getDirectGoogleDriveLink(url) {
//   const match = url.match(/\/d\/([^/]+)/);
//   if (match && match[1]) {
//     return `https://drive.google.com/uc?export=view&id=${match[1]}`;
//   }
//   return url;
// }

// const AppointmentDetails = () => {
//   const errRef = useRef();
//   const [errMsg, setErrMsg] = useState("");
//   const { auth, setIsLoading, isLoading } = useAuth();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { data } = useDate();
//   const date = data.selectedDate;
//   const time = data.selectedTimeSlot;
//   const period = data.selectedPeriod;
//   const specialization = data.specialization;
//   const { id } = useParams();
//   const [filteredSpecialist, setFilteredSpecialist] = useState();
//   const email = localStorage.getItem("email");
//   const accessToken = auth.accessToken;
//   const [fetchName, setFetchName] = useState(
//     localStorage.getItem("name") || ""
//   );
//   const [doctorProfileLink, setDoctorProfileLink] = useState("");
//   const [error, setError] = useState(null);
//   const Navigate = useNavigate();

//   useRazorpayScript();

//   const doctorDetails = filteredSpecialist || {};
//   useEffect(() => {
//     getDoctorDetails();
//   }, []);

//   useEffect(() => {
//     if (doctorDetails?.profilePhoto) {
//       setDoctorProfileLink(doctorDetails.profilePhoto);
//     } else {
//       setDoctorProfileLink(defaultImage);
//     }
//   }, []);

//   async function getDoctorDetails() {
//     const save = {
//       specialization,
//       id,
//     };
//     setIsLoading(true);
//     try {
//       const response = await api.post(FETCH_DOCTOR_DATA, save);
//       const data = response?.data;
//       console.log(data);
//       setFilteredSpecialist(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   }

// function uuid() {
//   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
//     const r = (Math.random() * 16) | 0;
//     const v = c === "x" ? r : (r & 0x3) | 0x8;
//     return v.toString(16);
//   });
// }

//   const photoUrl =
//     doctorProfileLink && doctorProfileLink.trim() !== ""
//       ? getDirectGoogleDriveLink(doctorProfileLink)
//       : defaultImage;

//   console.log(photoUrl);

// const handleSubmit = async (values) => {
//   setIsLoading(true);
//   setErrMsg("");
//   setIsSubmitting(true);

//   try {
//     const receipt = uuid();
//     const formattedDate = format(new Date(date), "yyyy-MM-dd");
//     const appointmentId = uuid();

//     const appointmentBooking = {
//       appointmentId,
//       email,
//       status: AppointmentStatus.BOOKED,
//       time,
//       period,
//       doctorName: doctorDetails?.doctor_name,
//       specialization,
//       date: formattedDate,
//       fullName:
//         values.selectedPatient === "option1"
//           ? values.fullName
//           : values.patientFullName,
//       doctor: { id },
//       patientEmail:
//         values.selectedPatient === "option2" ? values.patientEmail : "",
//       selectedPayment:
//         values.selectedPayment === "option3"
//           ? "Online Payment"
//           : "Pay at Clinic",
//       phone: values.phone,
//       selectedPatient:
//         values.selectedPatient === "option1" ? fetchName : "someone else",
//     };

//     if (values.selectedPayment === "option3") {
//       // Online Payment with Razorpay
//       const paymentInitData = {
//         amount: doctorDetails.consultationFees * 100, // paise
//         currency: "INR",
//         receipt: receipt,
//       };

//       const razorResponse = await api.post(
//         "/api/payment/create-order",
//         paymentInitData
//       );
//       const { orderId, amount, currency, key } = razorResponse.data;

//       if (!window.Razorpay) {
//         alert("Razorpay SDK not loaded");
//         return;
//       }

//       const options = {
//         key,
//         amount,
//         currency,
//         name: "AppointDoctor",
//         description: "Consultation Fee",
//         image: "/logo.png",
//         order_id: orderId,
//         handler: async function (response) {
//           const {
//             razorpay_payment_id,
//             razorpay_order_id,
//             razorpay_signature,
//           } = response;

//           const verificationData = {
//             razorpay_payment_id,
//             razorpay_order_id,
//             razorpay_signature,
//           };

//           const verifyResponse = await api.post(
//             "/api/payment/verify",
//             verificationData
//           );

//           if (verifyResponse.data.status !== "success") {
//             alert("Payment verification failed!");
//             return;
//           }

//           const body = {
//             formData: appointmentBooking,
//             payment: {
//               receiptId: receipt,
//               paymentId: razorpay_payment_id,
//               orderId: razorpay_order_id,
//               doctorId: id,
//             },
//           };

//           console.log("Sending payload:", body);
//           const res = await api.post(BOOKED_URL, body);
//           console.log("Booking response:", res);
//           Navigate("/thankyou", {
//             state: {
//               date,
//               time,
//               doctorName: doctorDetails?.doctorName,
//               appointmentLocation: doctorDetails?.clinicName,
//             },
//           });
//         },
//         prefill: {
//           name: appointmentBooking.fullName,
//           email: email,
//           contact: values.phone,
//         },
//         notes: {
//           appointmentId,
//           doctorId: id,
//         },
//         theme: {
//           color: "#6B46C1",
//         },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } else {
//       // Pay at Clinic flow
//       const body = {
//         formData: appointmentBooking,
//         payment: null, // if your backend expects null
//       };

//       console.log("Sending payload:", body);
//       const res = await api.post(BOOKED_URL, body);
//       console.log("Booking response:", res);
//       Navigate("/thankyou", {
//         state: {
//           date,
//           time,
//           doctorName: doctorDetails?.doctorName,
//           appointmentLocation: doctorDetails?.clinicName,
//         },
//       });
//     }
//   } catch (err) {
//     console.error(err);
//     setErrMsg(
//       err?.response?.status === 500
//         ? "Internal Server Error"
//         : "Booking Failed"
//     );
//     errRef.current.focus();
//   } finally {
//     setIsSubmitting(false);
//     setIsLoading(false);
//   }
// };

//   if (error) {
//     return <ErrorBoundary />;
//   }
//   if (isLoading) {
//     return <OverlayLoader />;
//   }
//   return (
//     <>
//       {!accessToken ? (
//         Navigate("/auth/login")
//       ) : (
//         <section className="flex flex-col sm:flex-row lg:px-36 min-h-screen justify-center bg-gradient-to-br from-blue-200 to-purple-300 py-12">
//           <div className="w-full sm:m-3 lg:m-4 p-4 flex flex-col bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-xl">
//             {/* Doctor Details Section */}
//             <DoctorDetailsSection
//               calender={<Calendar />}
//               date={date}
//               time={time}
//               clock={<Clock />}
//               specialization={specialization}
//               doctorDetails={doctorDetails}
//               doctorProfileLink={photoUrl}
//             />
//           </div>
//           <div className="w-full sm:m-3 lg:m-4 p-4 flex flex-col bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-xl">
//             <PatientDetailsSection
//               email={email}
//               errRef={errRef}
//               errMsg={errMsg}
//               isSubmitting={isSubmitting}
//               fetchName={fetchName}
//               doctorDetails={doctorDetails}
//               handleSubmit={handleSubmit}
//             />
//           </div>
//         </section>
//       )}
//     </>
//   );
// };

// export default AppointmentDetails;

// function DoctorDetailsSection({
//   date,
//   time,
//   specialization,
//   doctorDetails,
//   doctorProfileLink,
// }) {
//   return (
//     <>
//       <div className="border-b-2 ">
//         <div className="m-3">
//           <p className="font-semibold text-[17px]">In Clinic Appointment</p>
//         </div>
//       </div>
//       <div className="flex justify-between mt-2 justify-items-center">
//         <div className="flex mx-3 justify-items-center gap-1">
//           <div className="w-4 h-4 mt-1">
//             <Calendar />
//           </div>
//           <span className="ml-1 text-gray-700 pt-1">On </span>
//           <span className="font-semibold text-gray-700 pt-1">
//             {date &&
//               new Date(date).toLocaleDateString("en-US", {
//                 year: "numeric",
//                 month: "long",
//                 day: "numeric",
//               })}
//           </span>
//         </div>
//         <div className="flex mx-3 justify-items-center gap-1">
//           <div className="w-4 h-4 mt-1">
//             <Clock />
//           </div>
//           <span className="ml-1 text-gray-700 pt-1">At</span>
//           <span className="font-semibold text-gray-700 pt-1">{time}</span>
//         </div>
//       </div>
//       <div className="border-b-2 ">
//         <div className="mx-3 mb-3">
//           <Link to={"/specialist/" + specialization} className="">
//             <span className="text-sm text-purple-400 font-semibold">
//               Change Date & Time
//             </span>
//           </Link>
//         </div>
//       </div>
//       <div className="border-b-2 my-2">
//         {doctorDetails && (
//           <div className="flex m-3">
//             <div>
//               <img src={doctorProfileLink} className="w-24 rounded-sm h-28" />
//             </div>
//             <div className="mx-2 flex flex-col mb-3">
//               <span className="font-medium text-gray-500 text-[17px]">
//                 {doctorDetails?.doctorName}
//               </span>
//               <span>
//                 {doctorDetails?.qualifications?.map((ele) => (
//                   <span
//                     className="text-sm text-gray-500"
//                     key={ele?.qualification}
//                   >
//                     {ele?.qualification},{" "}
//                   </span>
//                 ))}
//               </span>
//               <span className="text-gray-500 text-sm">
//                 {doctorDetails?.specialization}
//               </span>
//             </div>
//           </div>
//         )}
//       </div>
//       <div className="flex flex-col items-center mb-3">
//         <span className="text-xl text-gray-500">Clinic Location</span>
//         <div className="flex flex-col">
//           <div>
//             <span className="text-sm text-gray-500">
//               {doctorDetails?.clinicName},
//             </span>
//           </div>
//           <div className="flex justify-center">
//             <span className="text-sm mx-1 text-gray-500">
//               {" "}
//               {doctorDetails?.locality}
//             </span>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// function PatientDetailsSection({
//   email,
//   errRef,
//   errMsg,
//   isSubmitting,
//   fetchName,
//   doctorDetails,
//   handleSubmit,
// }) {
//   return (
//     <div className="p-3 bg-white/30 backdrop-blur-lg border border-white/20 shadow-2xl rounded-xl text-gray-700">
//       <div className="mb-2">
//         <span className="text-2xl font-semibold text-black">
//           Patient Details
//         </span>
//       </div>
//       <div>
//         <span className="text-gray-700 text-sm font-semibold">
//           This in-clinic appointment is for:
//         </span>
//       </div>

//       <Formik
//         initialValues={{
//           selectedPatient: "option1",
//           fullName: "",
//           patientFullName: "",
//           email: email,
//           patientEmail: "",
//           phone: "",
//           selectedPayment: "option4",
//         }}
//         validationSchema={Yup.object({
//           fullName: Yup.string().when("selectedPatient", {
//             is: "option1",
//             then: (schema) =>
//               schema
//                 .required("*Name Required")
//                 .max(20, "Must be less than 20 letters"),
//             otherwise: (schema) => schema.notRequired(),
//           }),
//           patientFullName: Yup.string().when("selectedPatient", {
//             is: "option2",
//             then: (schema) =>
//               schema
//                 .required("*Patient Name Required")
//                 .max(20, "Must be less than 20 letters"),
//             otherwise: (schema) => schema.notRequired(),
//           }),
//           patientEmail: Yup.string().when("selectedPatient", {
//             is: "option2",
//             then: (schema) =>
//               schema
//                 .email("*Invalid email address")
//                 .required("*Email Required"),
//             otherwise: (schema) => schema.notRequired(),
//           }),
//         })}
//         onSubmit={handleSubmit}
//       >
//         {({ values, setFieldValue }) => (
//           <Form className="flex flex-col">
//             <div className="flex justify-center">
//               <p
//                 ref={errRef}
//                 className={errMsg ? "errmsg" : "offscreen"}
//                 aria-live="assertive"
//               >
//                 {errMsg}
//               </p>
//             </div>

//             <div className="my-1 border border-white/30 bg-white/50 backdrop-blur-sm p-2 rounded-md">
//               <label className="p-2 text-sm">
//                 <Field
//                   type="radio"
//                   name="selectedPatient"
//                   value="option1"
//                   className="mr-2"
//                   onChange={() => setFieldValue("selectedPatient", "option1")}
//                 />
//                 {fetchName}
//               </label>
//             </div>
//             <div className="border border-white/30 bg-white/50 backdrop-blur-sm p-2 mb-2 rounded-md">
//               <label className="p-2 text-sm">
//                 <Field
//                   type="radio"
//                   name="selectedPatient"
//                   value="option2"
//                   className="mr-2"
//                   onChange={() => setFieldValue("selectedPatient", "option2")}
//                 />
//                 Someone Else
//               </label>
//             </div>

//             <span className="text-sm font-semibold text-gray-700">
//               Please provide the following information:
//             </span>

//             {values.selectedPatient === "option1" && (
//               <>
//                 <label
//                   className="text-sm mt-2 text-gray-700"
//                   htmlFor="fullName"
//                 >
//                   Full Name
//                 </label>
//                 <Field
//                   type="text"
//                   placeholder="Enter Your Full Name"
//                   id="fullName"
//                   name="fullName"
//                   autoComplete="off"
//                   className="bg-white/50 border border-white/30 backdrop-blur-sm p-2 text-sm rounded-md placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
//                 />
//                 <ErrorMessage
//                   name="fullName"
//                   component="div"
//                   className="text-purple-500 text-sm"
//                 />
//               </>
//             )}

//             {values.selectedPatient === "option2" && (
//               <>
//                 <label
//                   className="text-sm mt-2 text-gray-700"
//                   htmlFor="patientFullName"
//                 >
//                   Patient's Full Name
//                 </label>
//                 <Field
//                   type="text"
//                   placeholder="Enter Patient's Full Name"
//                   id="patientFullName"
//                   name="patientFullName"
//                   autoComplete="off"
//                   className="bg-white/50 border border-white/30 backdrop-blur-sm p-2 text-sm rounded-md placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
//                 />
//                 <ErrorMessage
//                   name="patientFullName"
//                   component="div"
//                   className="text-purple-500 text-sm"
//                 />
//               </>
//             )}

//             <label className="text-sm mt-2 text-gray-700" htmlFor="email">
//               Email
//             </label>
//             <Field
//               id="email"
//               name="email"
//               type="email"
//               value={email}
//               placeholder="Enter Your Email"
//               readOnly
//               autoComplete="off"
//               className="bg-white/50 border border-white/30 backdrop-blur-sm p-2 text-sm rounded-md placeholder-gray-500 text-gray-800 outline-none cursor-not-allowed"
//             />

//             {values.selectedPatient === "option2" && (
//               <>
//                 <label
//                   className="text-sm mt-2 text-gray-700"
//                   htmlFor="patientEmail"
//                 >
//                   Patient's Email
//                 </label>
//                 <Field
//                   id="patientEmail"
//                   name="patientEmail"
//                   type="text"
//                   placeholder="Enter Patient's Email"
//                   autoComplete="off"
//                   className="bg-white/50 border border-white/30 backdrop-blur-sm p-2 text-sm rounded-md placeholder-gray-500 text-gray-800  focus:outline-none focus:ring-2 focus:ring-indigo-300"
//                 />
//                 <ErrorMessage
//                   name="patientEmail"
//                   component="div"
//                   className="text-purple-500 text-sm"
//                 />
//               </>
//             )}

//             <label className="text-sm mt-2 text-gray-700" htmlFor="phone">
//               Phone Number
//             </label>
//             <Field
//               id="phone"
//               name="phone"
//               type="tel"
//               placeholder="Enter Your Phone Number (Optional)"
//               autoComplete="off"
//               className="bg-white/50 border border-white/30 backdrop-blur-sm p-2 text-sm rounded-md placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300e"
//             />

//             <div className="mt-2 mb-2 text-sm font-semibold text-gray-700">
//               Choose a payment option to Book Appointment:
//             </div>
//             <div className="border my-1 border-white/30 bg-white/50 backdrop-blur-sm p-2 rounded-md">
//               <label className="p-2 text-sm">
//                 <Field
//                   type="radio"
//                   name="selectedPayment"
//                   value="option3"
//                   className="mr-2"
//                   onChange={() => setFieldValue("selectedPayment", "option3")}
//                 />
//                 ₹{doctorDetails.consultationFees} Pay Online
//               </label>
//             </div>
//             <div className="border border-white/30 bg-white/50 backdrop-blur-sm p-2 mb-2 rounded-md">
//               <label className="p-2 text-sm">
//                 <Field
//                   type="radio"
//                   name="selectedPayment"
//                   value="option4"
//                   className="mr-2"
//                   onChange={() => setFieldValue("selectedPayment", "option4")}
//                 />
//                 ₹{doctorDetails.consultationFees} Pay later at the clinic
//               </label>
//             </div>

//             {/* Dark Styled Button */}
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="mt-4 w-full py-2 px-4 bg-gradient-to-br from-blue-600 to-purple-300 hover:bg-gradient-to-br hover:from-blue-400 hover:to-purple-500 text-white rounded-md hover:bg-gray-900 transition-all duration-300 font-semibold"
//             >
//               Book Clinic Visit
//             </button>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// }

import React, { useRef, useState, useEffect } from "react";
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
import { useApiService } from "../../hooks/useAuthWithAxios";

const FETCH_DOCTOR_DATA = "/api/public/getDoctor";
const BOOKED_URL = "/appointment/book-appointment";

const AppointmentDetails = () => {
  const api = useApiService();
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data } = useDate();
  const date = data.selectedDate;
  const time = data.selectedTimeSlot;
  const period = data.selectedPeriod;
  const specialization = data.specialization;
  const [doctorData, setDoctorData] = useState("");
  const { id } = useParams();
  const [selectedPatient, setSelectedPatient] = useState("myself");
  const [selectedPayment, setSelectedPayment] = useState("online");
  const email = localStorage.getItem("email");
  const [isLoading, setIsLoading] = useState(false);
  const fetchUserFullname = localStorage.getItem("name");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useRazorpayScript();

  const fetchDoctorDetails = async () => {
    const body = {
      specialization,
      id,
    };
    setIsLoading(true);
    try {
      const response = await api.post(FETCH_DOCTOR_DATA, body);
      const data = response?.data;
      setDoctorData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorDetails();
  }, [id, specialization]);

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
        period,
        doctorName: doctorData?.doctorName,
        specialization,
        date: formattedDate,
        fullName:
          selectedPatient === "myself"
            ? formData.fullName
            : formData.patientFullName,
        doctor: { id },
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
          amount: doctorData.consultationFees * 100, // paise
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
                doctorName: doctorData?.doctorName,
                appointmentLocation: doctorData?.clinicName,
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
            doctorName: doctorData?.doctorName,
            appointmentLocation: doctorData?.clinicName,
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

  const getPeriodIcon = (period) => {
    switch (period?.toLowerCase()) {
      case "morning":
        return "🌅";
      case "noon":
        return "☀️";
      case "evening":
        return "🌆";
      default:
        return "⏰";
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
                            {period.charAt(0).toUpperCase() + period.slice(1)}{" "}
                            {getPeriodIcon(period)}
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
                      {doctorData?.profilePhoto ? (
                        <img
                          src={doctorData.profilePhoto}
                          alt={doctorData.doctorName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextElementSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                        {doctorData.doctorName?.charAt(0) || "D"}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-2">
                        {doctorData.doctorName}
                      </h3>
                      <p className="text-blue-600 font-semibold text-base mb-3">
                        {doctorData.specialization}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        {doctorData.qualifications?.map((qual, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg"
                          >
                            <GraduationCap className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">
                              {qual.qualification}
                            </span>
                          </div>
                        ))}
                        <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                          <Stethoscope className="w-4 h-4 text-green-500" />
                          <span className="font-medium">
                            {doctorData.experienceYears}+ years
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
                        {doctorData.clinicName}
                      </p>
                      <p className="text-gray-600">
                        {doctorData.locality}, {doctorData.city}
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
                      ₹{doctorData.consultationFees}
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
