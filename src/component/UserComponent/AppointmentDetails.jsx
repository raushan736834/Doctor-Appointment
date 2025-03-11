// import React, { useRef } from "react";
// import { Link, useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import clock from "../../assets/img/clock.png";
// import calender from "../../assets/img/calendar.png";
// import defaultImage from "../../assets/img/defaultClinicImage.jpg";
// import useAuth from "../../hooks/useAuth";
// import axios from "../../api/axios";
// import useDate from "../../hooks/useDate";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import Login from "./Login";
// import { Spinner, Text, VStack } from "@chakra-ui/react";

// function filterData(id, data) {
//   return data.filter((ele) => ele.id === parseInt(id));
// }

// const BOOKED_URL = "http://localhost:8080/appointment/book";

// const AppointmentDetails = () => {
//   const errRef = useRef();
//   const [errMsg, setErrMsg] = useState("");
//   const [success, setSuccess] = useState(false);
//   const { auth } = useAuth();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const { data } = useDate();
//   const date = data.selectedDate;
//   const time = data.slot;
//   const period = data.selectedPeriod;
//   const specialization = data.specialization;
//   const { id } = useParams();
//   const [loading, setLoading] = useState(false);
//   const [filteredSpecialist, setFilteredSpecialist] = useState([]);
//   const email = localStorage.getItem("email");
//   const accessToken = auth.accessToken;
//   const [fetchName, setFetchName] = useState("");
//   const [doctorProfileLink, setDoctorProfileLink] = useState("");
//   const [error, setError] = useState(null);
//   const Navigate = useNavigate();

//   const doctorDetails = filteredSpecialist[0] || {};
//   useEffect(() => {
//     getDoctorDetails();
//     fetchUserData();
//   }, []);

//   useEffect(() => {
//     if (doctorDetails?.profile_photo?.url) {
//       setDoctorProfileLink(doctorDetails.profile_photo.url);
//     } else {
//       setDoctorProfileLink(defaultImage);
//     }
//   }, [doctorDetails]);

//   async function getDoctorDetails() {
//     setLoading(true);
//     try {
//       const url = `https://raushan736834.github.io/host_api/${specialization}.json`;
//       const response = await fetch(url);
//       const data = await response.json();
//       const filteredData = filterData(id, data);
//       setFilteredSpecialist(filteredData);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const fetchUserData = async () => {
//     try {
//       const response = await axios.get(`http://localhost:8080/user/${email}`);
//       setFetchName(response.data);
//       console.log(response);
//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (values) => {
//     setErrMsg("");
//     setIsSubmitting(true);
//     try {
//       const formData = {
//         email,
//         time,
//         period,
//         doctorName: doctorDetails?.doctor_name,
//         specialization,
//         date,
//         consultation_fees: doctorDetails?.consultation_fees,
//         doctorProfileLink,
//         fullName:
//           values.selectedPatient === "option1"
//             ? values.fullName
//             : values.patientFullName,
//         doctorId: doctorDetails?.id,
//         patientEmail:
//           values.selectedPatient === "option2" ? values.patientEmail : "",
//         selectedPayment:
//           values.selectedPayment === "option3"
//             ? "Online Payment"
//             : "Pay at Clinic",
//         phone: values.phone,
//         selectedPatient:
//           values.selectedPatient === "option1" ? fetchName : "someone else",
//       };
//       const response = await axios.post(BOOKED_URL, JSON.stringify(formData), {
//         headers: { "Content-Type": "application/json" },
//         withCredentials: true,
//       });
//       alert("Appointment Booked Successfully");
//       setSuccess(true);
//       setLoading(false);
//       Navigate("/thankyou", {
//         state: {
//           date,
//           time,
//           doctorName: doctorDetails?.doctor_name,
//           appointmentLocation: doctorDetails?.clinic_name,
//         },
//       });
//     } catch (err) {
//       if (!err?.response) {
//         setErrMsg("No Server Response");
//       } else if (err.response?.status === 500) {
//         setErrMsg("Internal Server Error");
//       } else {
//         setErrMsg("Booking Failed");
//       }
//       console.error("Error details:", err.response?.data || err.message || err);
//       errRef.current.focus();
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;
//   <VStack colorPalette="teal">
//     <Spinner color="colorPalette.600" />
//     <Text color="colorPalette.600">Loading...</Text>
//   </VStack>
//   return (
//     <>
//       {!accessToken ? (
//         <Login />
//       ) : (
//         <section className="flex bg-gray-300 justify-center flex-wrap">
//           <div className="w-96 bg-white m-8 rounded-sm flex flex-col">
//             {/* Doctor Details Section */}
//             <div className="border-b-2 ">
//               <div className="m-3">
//                 <p className="font-semibold text-[17px]">
//                   In Clinic Appointment
//                 </p>
//               </div>
//             </div>
//             <div className="flex justify-between mt-2">
//               <div className="flex mx-3">
//                 <img src={calender} className="w-4 h-4 mt-1" />
//                 <span className="ml-1 text-gray-700">On </span>
//                 <span className="mx-1 font-semibold text-gray-700">
//                   {date &&
//                     new Date(date).toLocaleDateString("en-US", {
//                       year: "numeric",
//                       month: "long",
//                       day: "numeric",
//                     })}
//                 </span>
//               </div>
//               <div className="flex mx-3">
//                 <img src={clock} className="w-4 h-4 mt-1" />
//                 <span className="ml-1 text-gray-700">At</span>
//                 <span className="mx-1 font-semibold text-gray-700">{time}</span>
//               </div>
//             </div>
//             <div className="border-b-2 ">
//               <div className="mx-3 mb-3">
//                 <Link to={"/specialist/" + specialization} className="">
//                   <span className="text-sm text-sky-600 font-semibold">
//                     Change Date & Time
//                   </span>
//                 </Link>
//               </div>
//             </div>
//             <div className="border-b-2 my-2">
//               {doctorDetails && (
//                 <div className="flex m-3">
//                   <div>
//                     {console.log(doctorDetails?.profile_photo?.url)}
//                     {console.log(doctorProfileLink)}
//                     <img
//                       src={doctorProfileLink}
//                       className="w-24 rounded-sm h-28"
//                     />
//                   </div>
//                   <div className="mx-2 flex flex-col mb-3">
//                     <span className="font-medium text-gray-500 text-[17px]">
//                       {doctorDetails?.doctor_name}
//                     </span>
//                     <span>
//                       {doctorDetails?.qualifications?.map((ele) => (
//                         <span
//                           className="text-sm text-gray-500"
//                           key={ele?.qualification}
//                         >
//                           {ele?.qualification},{" "}
//                         </span>
//                       ))}
//                     </span>
//                     <span className="text-gray-500 text-sm">
//                       {doctorDetails?.specialization}
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </div>
//             <div className="flex flex-col items-center mb-3">
//               <span className="text-xl text-gray-500">Clinic Location</span>
//               <div className="flex flex-col">
//                 <div>
//                   <span className="text-sm text-gray-500">
//                     {doctorDetails?.clinic_name},
//                   </span>
//                 </div>
//                 <div className="flex justify-center">
//                   <span className="text-sm mx-1 text-gray-500">
//                     {" "}
//                     {doctorDetails?.locality}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="mt-8">
//             <div className="mb-4">
//               <span className="text-2xl font-semibold text-gray-900">
//                 Patient Details
//               </span>
//             </div>
//             <div>
//               <span className="text-gray-900 text-sm font-semibold">
//                 This in-clinic appointment is for:
//               </span>
//             </div>
//             <Formik
//               initialValues={{
//                 selectedPatient: "option1",
//                 fullName: "",
//                 patientFullName: "",
//                 email: email,
//                 patientEmail: "",
//                 phone: "",
//                 selectedPayment: "option4",
//               }}
//               onSubmit={handleSubmit}
//             >
//               {({ values, setFieldValue }) => (
//                 <Form className="flex flex-col">
//                   <div className="flex justify-center ">
//                     <p
//                       ref={errRef}
//                       className={errMsg ? "errmsg" : "offscreen"}
//                       aria-live="assertive"
//                     >
//                       {errMsg}
//                     </p>
//                   </div>
//                   <div className="mt-2 border-[1px] border-gray-500 w-96 bg-white p-2 rounded-sm">
//                     <label className="p-2 text-[15px]">
//                       <Field
//                         type="radio"
//                         name="selectedPatient"
//                         value="option1"
//                         className="mr-2"
//                         onChange={() =>
//                           setFieldValue("selectedPatient", "option1")
//                         }
//                       />
//                       {fetchName}
//                     </label>
//                   </div>
//                   <div className="border-b border-l border-r border-gray-500 w-96 bg-white p-2 mb-2 rounded-sm">
//                     <label className="p-2 text-[15px]">
//                       <Field
//                         type="radio"
//                         name="selectedPatient"
//                         value="option2"
//                         className="mr-2"
//                         onChange={() =>
//                           setFieldValue("selectedPatient", "option2")
//                         }
//                       />
//                       Someone Else
//                     </label>
//                   </div>
//                   <div className="">
//                     <span className="text-gray-900 text-sm font-semibold">
//                       Please provide the following information:
//                     </span>
//                   </div>

//                   {values.selectedPatient === "option1" && (
//                     <>
//                       <label className="text-sm mt-2" htmlFor="fullName">
//                         Full Name
//                       </label>
//                       <Field
//                         type="text"
//                         placeholder="Enter Your Full Name"
//                         id="fullName"
//                         name="fullName"
//                         required
//                         autoComplete="off"
//                         className="border-[1px] p-[7px] border-gray-500 mt-1 text-sm rounded-sm"
//                       />
//                       <ErrorMessage
//                         name="fullName"
//                         component="div"
//                         className="text-red-600"
//                       />
//                     </>
//                   )}

//                   {values.selectedPatient === "option2" && (
//                     <>
//                       <label className="text-sm mt-2" htmlFor="patientFullName">
//                         Patient's Full Name
//                       </label>
//                       <Field
//                         type="text"
//                         placeholder="Enter Patient's Full Name"
//                         id="patientFullName"
//                         name="patientFullName"
//                         required
//                         autoComplete="off"
//                         className="border-[1px] p-[7px] border-gray-500 mt-1 text-sm rounded-sm"
//                       />
//                       <ErrorMessage
//                         name="patientFullName"
//                         component="div"
//                         className="text-red-600"
//                       />
//                     </>
//                   )}

//                   <label className="text-sm mt-2" htmlFor="email">
//                     Email
//                   </label>
//                   <Field
//                     id="email"
//                     name="email"
//                     type="email"
//                     value={email}
//                     placeholder="Enter Your Email"
//                     autoComplete="off"
//                     readOnly
//                     className="border-[1px] p-[7px] border-gray-500 mt-1 text-sm rounded-sm"
//                   />

//                   {values.selectedPatient === "option2" && (
//                     <>
//                       <label className="text-sm mt-2" htmlFor="patientEmail">
//                         Patient's Email
//                       </label>
//                       <Field
//                         id="patientEmail"
//                         name="patientEmail"
//                         type="email"
//                         placeholder="Enter Patient's Email"
//                         autoComplete="off"
//                         required
//                         className="border-[1px] p-[7px] border-gray-500 mt-1 text-sm rounded-sm"
//                       />
//                       <ErrorMessage
//                         name="patientEmail"
//                         component="div"
//                         className="text-red-600"
//                       />
//                     </>
//                   )}

//                   <label className="text-sm mt-2" htmlFor="phone">
//                     Phone Number
//                   </label>
//                   <Field
//                     id="phone"
//                     name="phone"
//                     type="tel"
//                     placeholder="Enter Your Phone Number (Optional)"
//                     autoComplete="off"
//                     className="border-[1px] p-[7px] border-gray-500 mt-1 text-sm rounded-sm"
//                   />

//                   <div className="mt-2 mb-1">
//                     <span className="text-gray-900 text-sm font-semibold">
//                       Choose a payment option to Book Appointment:
//                     </span>
//                   </div>
//                   <div className="border-[1px] border-gray-500 w-96 bg-white p-2 rounded-sm">
//                     <label className="p-2 text-[15px]">
//                       <Field
//                         type="radio"
//                         name="selectedPayment"
//                         value="option3"
//                         className="mr-2"
//                         onChange={() =>
//                           setFieldValue("selectedPayment", "option3")
//                         }
//                       />
//                       <span>₹</span>
//                       {doctorDetails.consultation_fees}
//                       <span> </span>
//                       Pay Online
//                     </label>
//                   </div>
//                   <div className="border-b border-l border-r border-gray-500 w-96 bg-white p-2 mb-2 rounded-sm">
//                     <label className="p-2 text-[15px]">
//                       <Field
//                         type="radio"
//                         name="selectedPayment"
//                         value="option4"
//                         className="mr-2"
//                         onChange={() =>
//                           setFieldValue("selectedPayment", "option4")
//                         }
//                       />
//                       <span>₹</span>
//                       {doctorDetails.consultation_fees}
//                       <span> </span>
//                       Pay later at the clinic
//                     </label>
//                   </div>
//                   <div className="">
//                     <button
//                       type="submit"
//                       className="w-96 py-2 bg-sky-500/100 hover:bg-sky-600
//                  rounded-md text-white font-semibold my-4"
//                       disabled={isSubmitting}
//                     >
//                       Book Clinic Visit
//                     </button>
//                   </div>
//                 </Form>
//               )}
//             </Formik>
//           </div>
//         </section>
//       )}
//     </>
//   );
// };

// export default AppointmentDetails;
// Modified AppointmentDetails component to show a loading UI with a blurred background during form submission

import React, { useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import clock from "../../assets/img/clock.png";
import calender from "../../assets/img/calendar.png";
import defaultImage from "../../assets/img/defaultClinicImage.jpg";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
import useDate from "../../hooks/useDate";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Login from "./Login";
import { Spinner, Text, VStack } from "@chakra-ui/react";
import { format } from "date-fns";

function filterData(id, data) {
  return data.filter((ele) => ele.id === parseInt(id));
}

const BOOKED_URL = "http://localhost:8080/appointment/book";

const AppointmentDetails = () => {
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const { auth } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data } = useDate();
  const date = data.selectedDate;
  const time = data.slot;
  const period = data.selectedPeriod;
  const specialization = data.specialization;
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [filteredSpecialist, setFilteredSpecialist] = useState([]);
  const email = localStorage.getItem("email");
  const accessToken = auth.accessToken;
  const [fetchName, setFetchName] = useState("");
  const [doctorProfileLink, setDoctorProfileLink] = useState("");
  const [error, setError] = useState(null);
  const Navigate = useNavigate();

  const doctorDetails = filteredSpecialist[0] || {};
  useEffect(() => {
    getDoctorDetails();
    fetchUserData();
  }, []);

  useEffect(() => {
    if (doctorDetails?.profile_photo?.url) {
      setDoctorProfileLink(doctorDetails.profile_photo.url);
    } else {
      setDoctorProfileLink(defaultImage);
    }
  }, [doctorDetails]);

  async function getDoctorDetails() {
    setLoading(true);
    try {
      const url = `https://raushan736834.github.io/host_api/${specialization}.json`;
      const response = await fetch(url);
      const data = await response.json();
      const filteredData = filterData(id, data);
      setFilteredSpecialist(filteredData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/user/${email}`);
      setFetchName(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setErrMsg("");
    setIsSubmitting(true);
    try {
      const formattedDate = format(new Date(date), "yyyy-MM-dd");
      const formData = {
        email,
        time,
        period,
        doctorName: doctorDetails?.doctor_name,
        specialization,
        date : formattedDate,
        consultation_fees: doctorDetails?.consultation_fees,
        doctorProfileLink,
        fullName:
          values.selectedPatient === "option1"
            ? values.fullName
            : values.patientFullName,
        doctorId: doctorDetails?.id,
        patientEmail:
          values.selectedPatient === "option2" ? values.patientEmail : "",
        selectedPayment:
          values.selectedPayment === "option3"
            ? "Online Payment"
            : "Pay at Clinic",
        phone: values.phone,
        selectedPatient:
          values.selectedPatient === "option1" ? fetchName : "someone else",
      };
      await axios.post(BOOKED_URL, JSON.stringify(formData), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      // alert("Appointment Booked Successfully");
      setSuccess(true);
      setLoading(false);
      Navigate("/thankyou", {
        state: {
          date,
          time,
          doctorName: doctorDetails?.doctor_name,
          appointmentLocation: doctorDetails?.clinic_name,
        },
      });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 500) {
        setErrMsg("Internal Server Error");
      } else {
        setErrMsg("Booking Failed");
      }
      errRef.current.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <VStack>
          <Spinner size="xl" color="teal.500" />
          <Text color="white">Loading...</Text>
        </VStack>
      </div>
    );
  if (error) return <div>{error}</div>;

  return (
    <>
      {!accessToken ? (
        <Login />
      ) : (
        <div className="blur-0">
          {isSubmitting && (
            <div className="fixed inset-0 w-full h-full bg-white/60 flex justify-center items-center z-[9999]">
              <Spinner size="xl" color="teal.500" />
              <Text>Booking Appointment...</Text>
            </div>
          )}
          <section className="flex bg-gray-300 justify-center flex-wrap">
            <div className="w-96 bg-white m-8 rounded-sm flex flex-col">
              {/* Doctor Details Section */}
              <div className="border-b-2 ">
                <div className="m-3">
                  <p className="font-semibold text-[17px]">
                    In Clinic Appointment
                  </p>
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <div className="flex mx-3">
                  <img src={calender} className="w-4 h-4 mt-1" />
                  <span className="ml-1 text-gray-700">On </span>
                  <span className="mx-1 font-semibold text-gray-700">
                    {date &&
                      new Date(date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                  </span>
                </div>
                <div className="flex mx-3">
                  <img src={clock} className="w-4 h-4 mt-1" />
                  <span className="ml-1 text-gray-700">At</span>
                  <span className="mx-1 font-semibold text-gray-700">
                    {time}
                  </span>
                </div>
              </div>
              <div className="border-b-2 ">
                <div className="mx-3 mb-3">
                  <Link to={"/specialist/" + specialization} className="">
                    <span className="text-sm text-sky-600 font-semibold">
                      Change Date & Time
                    </span>
                  </Link>
                </div>
              </div>
              <div className="border-b-2 my-2">
                {doctorDetails && (
                  <div className="flex m-3">
                    <div>
                      <img
                        src={doctorProfileLink}
                        className="w-24 rounded-sm h-28"
                      />
                    </div>
                    <div className="mx-2 flex flex-col mb-3">
                      <span className="font-medium text-gray-500 text-[17px]">
                        {doctorDetails?.doctor_name}
                      </span>
                      <span>
                        {doctorDetails?.qualifications?.map((ele) => (
                          <span
                            className="text-sm text-gray-500"
                            key={ele?.qualification}
                          >
                            {ele?.qualification},{" "}
                          </span>
                        ))}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {doctorDetails?.specialization}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center mb-3">
                <span className="text-xl text-gray-500">Clinic Location</span>
                <div className="flex flex-col">
                  <div>
                    <span className="text-sm text-gray-500">
                      {doctorDetails?.clinic_name},
                    </span>
                  </div>
                  <div className="flex justify-center">
                    <span className="text-sm mx-1 text-gray-500">
                      {" "}
                      {doctorDetails?.locality}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <div className="mb-4">
                <span className="text-2xl font-semibold text-gray-900">
                  Patient Details
                </span>
              </div>
              <div>
                <span className="text-gray-900 text-sm font-semibold">
                  This in-clinic appointment is for:
                </span>
              </div>
              <Formik
                initialValues={{
                  selectedPatient: "option1",
                  fullName: "",
                  patientFullName: "",
                  email: email,
                  patientEmail: "",
                  phone: "",
                  selectedPayment: "option4",
                }}
                onSubmit={handleSubmit}
              >
                {({ values, setFieldValue }) => (
                  <Form className="flex flex-col">
                    <div className="flex justify-center ">
                      <p
                        ref={errRef}
                        className={errMsg ? "errmsg" : "offscreen"}
                        aria-live="assertive"
                      >
                        {errMsg}
                      </p>
                    </div>
                    <div className="mt-2 border-[1px] border-gray-500 w-96 bg-white p-2 rounded-sm">
                      <label className="p-2 text-[15px]">
                        <Field
                          type="radio"
                          name="selectedPatient"
                          value="option1"
                          className="mr-2"
                          onChange={() =>
                            setFieldValue("selectedPatient", "option1")
                          }
                        />
                        {fetchName}
                      </label>
                    </div>
                    <div className="border-b border-l border-r border-gray-500 w-96 bg-white p-2 mb-2 rounded-sm">
                      <label className="p-2 text-[15px]">
                        <Field
                          type="radio"
                          name="selectedPatient"
                          value="option2"
                          className="mr-2"
                          onChange={() =>
                            setFieldValue("selectedPatient", "option2")
                          }
                        />
                        Someone Else
                      </label>
                    </div>
                    <div className="">
                      <span className="text-gray-900 text-sm font-semibold">
                        Please provide the following information:
                      </span>
                    </div>

                    {values.selectedPatient === "option1" && (
                      <>
                        <label className="text-sm mt-2" htmlFor="fullName">
                          Full Name
                        </label>
                        <Field
                          type="text"
                          placeholder="Enter Your Full Name"
                          id="fullName"
                          name="fullName"
                          required
                          autoComplete="off"
                          className="border-[1px] p-[7px] border-gray-500 mt-1 text-sm rounded-sm"
                        />
                        <ErrorMessage
                          name="fullName"
                          component="div"
                          className="text-red-600"
                        />
                      </>
                    )}

                    {values.selectedPatient === "option2" && (
                      <>
                        <label
                          className="text-sm mt-2"
                          htmlFor="patientFullName"
                        >
                          Patient's Full Name
                        </label>
                        <Field
                          type="text"
                          placeholder="Enter Patient's Full Name"
                          id="patientFullName"
                          name="patientFullName"
                          required
                          autoComplete="off"
                          className="border-[1px] p-[7px] border-gray-500 mt-1 text-sm rounded-sm"
                        />
                        <ErrorMessage
                          name="patientFullName"
                          component="div"
                          className="text-red-600"
                        />
                      </>
                    )}

                    <label className="text-sm mt-2" htmlFor="email">
                      Email
                    </label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      placeholder="Enter Your Email"
                      autoComplete="off"
                      readOnly
                      className="border-[1px] p-[7px] border-gray-500 mt-1 text-sm rounded-sm"
                    />

                    {values.selectedPatient === "option2" && (
                      <>
                        <label className="text-sm mt-2" htmlFor="patientEmail">
                          Patient's Email
                        </label>
                        <Field
                          id="patientEmail"
                          name="patientEmail"
                          type="email"
                          placeholder="Enter Patient's Email"
                          autoComplete="off"
                          required
                          className="border-[1px] p-[7px] border-gray-500 mt-1 text-sm rounded-sm"
                        />
                        <ErrorMessage
                          name="patientEmail"
                          component="div"
                          className="text-red-600"
                        />
                      </>
                    )}

                    <label className="text-sm mt-2" htmlFor="phone">
                      Phone Number
                    </label>
                    <Field
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter Your Phone Number (Optional)"
                      autoComplete="off"
                      className="border-[1px] p-[7px] border-gray-500 mt-1 text-sm rounded-sm"
                    />

                    <div className="mt-2 mb-1">
                      <span className="text-gray-900 text-sm font-semibold">
                        Choose a payment option to Book Appointment:
                      </span>
                    </div>
                    <div className="border-[1px] border-gray-500 w-96 bg-white p-2 rounded-sm">
                      <label className="p-2 text-[15px]">
                        <Field
                          type="radio"
                          name="selectedPayment"
                          value="option3"
                          className="mr-2"
                          onChange={() =>
                            setFieldValue("selectedPayment", "option3")
                          }
                        />
                        <span>₹</span>
                        {doctorDetails.consultation_fees}
                        <span> </span>
                        Pay Online
                      </label>
                    </div>
                    <div className="border-b border-l border-r border-gray-500 w-96 bg-white p-2 mb-2 rounded-sm">
                      <label className="p-2 text-[15px]">
                        <Field
                          type="radio"
                          name="selectedPayment"
                          value="option4"
                          className="mr-2"
                          onChange={() =>
                            setFieldValue("selectedPayment", "option4")
                          }
                        />
                        <span>₹</span>
                        {doctorDetails.consultation_fees}
                        <span> </span>
                        Pay later at the clinic
                      </label>
                    </div>
                    <div className="">
                      <button
                        type="submit"
                        className="w-96 py-2 bg-sky-500/100 hover:bg-sky-600 
                 rounded-md text-white font-semibold my-4"
                        disabled={isSubmitting}
                      >
                        Book Clinic Visit
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default AppointmentDetails;
