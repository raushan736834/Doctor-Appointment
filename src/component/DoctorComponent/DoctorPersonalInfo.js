// import { useState } from "react";
// import logo from "../../assets/img/appointDoctor.jpg"; // Fixed typo in the path
// import { Formik, Field, Form, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { Link } from "react-router-dom";
// import { useRef, useState } from "react";
// import axios from "../../api/axios";

// const DoctorPersonalInfo = () => {
//   const errRef = useRef();
//   const [errMsg, setErrMsg] = useState("");
//   const [success, setSuccess] = useState(false);
//   const [profilePhoto, setProfilePhoto] = useState(null);

//   const handleImageChange = (event, setFieldValue) => {
//     const file = event.currentTarget.files[0];
//     if (file) {
//       setFieldValue("profilePhoto", file); // Update Formik's state with the file
//       setProfilePhoto(URL.createObjectURL(file)); // Generate profilePhoto URL
//     }
//   };

//   const handleRemoveImage = (setFieldValue) => {
//     setFieldValue("profilePhoto", null); // Remove the image from Formik's state
//     setProfilePhoto(null); // Remove the profilePhoto
//     document.getElementById("photo-upload").value = ""; // Clear the file input
//   };

//   return (
//     <>
//       {success ? (
//         <section>
//           <Login />
//         </section>
//       ) : (
//         <Formik
//           initialValues={{
//             image: null,
//             fullName: "",
//             email: "",
//             phone: "",
//             gender: "",
//             dob: "",
//             bloodgrp: "",
//             area: "",
//             locality: "",
//             city: "",
//             state: "",
//             country: "",
//             pincode: "",
//             alternatePhone: "",
//           }}
//           validationSchema={Yup.object({
//             fullName: Yup.string()
//               .required("Required")
//               .max(40, "Must be less than 40 letters"),
//             email: Yup.string()
//               .email("Invalid email address")
//               .required("Required"),
//             password: Yup.string()
//               .min(6, "Must be 6 characters or more")
//               .required("Required"),
//             confirm_pass: Yup.string()
//               .min(6, "Must be 6 characters or more")
//               .oneOf([Yup.ref("password"), null], "Passwords must match")
//               .required("Required"),
//             phone: Yup.string()
//               .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
//               .required("Phone number is required"),
//           })}
//           onSubmit={async (values, actions) => {
//             setErrMsg("");
//             try {
//               const userData = {
//                 fullName: values.fullName,
//                 email: values.email,
//                 password: values.password,
//               };
//               const response = await axios.post(
//                 REGISTER_URL,
//                 JSON.stringify(userData),
//                 {
//                   headers: { "Content-Type": "application/json" },
//                   withCredentials: true,
//                 }
//               );
//               console.log(response.data);
//               alert("Account Created Successfully");
//               setSuccess(true);
//               actions.resetForm();
//             } catch (err) {
//               if (!err?.response) {
//                 // No response from server
//                 setErrMsg("No Server Response");
//               } else if (err.response?.status === 409) {
//                 // Username taken
//                 setErrMsg("Email already in use");
//               } else if (err.response?.status === 400) {
//                 // Bad request (validation error, etc.)
//                 setErrMsg("Bad Request: " + err.response.data.message);
//               } else if (err.response?.status === 500) {
//                 // Internal server error
//                 setErrMsg("Internal Server Error");
//               } else {
//                 // Other errors
//                 setErrMsg("Registration Failed");
//               }
//               console.error(
//                 "Error details:",
//                 err.response?.data || err.message || err
//               );
//               errRef.current.focus();
//             } finally {
//               actions.setSubmitting(false);
//             }
//           }}
//         >
//           {({ isValid, isSubmitting, setFieldValue }) => (
//             <>
//               <div className="m-8 sm:w-full mt-3">
//                 <h2 className=" text-xl font-medium leading-9 tracking-tight text-gray-600 border-b">
//                   Personal Info
//                 </h2>
//               </div>
//               <Form>
//                 <div className="flex justify-center ">
//                   <p
//                     ref={errRef}
//                     className={errMsg ? "errmsg" : "offscreen"}
//                     aria-live="assertive"
//                   >
//                     {errMsg}
//                   </p>
//                 </div>
//                 <div className="flex flex-col min-h-full  px-6 py-1 lg:px-8">
//                   <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
//                     <div className="border-b border-gray-900/10 pb-4">
//                       <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
//                         <div className="flex justify-between">
//                           <div className="flex-shrink-0 mr-24">
//                             <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
//                               {profilePhoto ? (
//                                 <img
//                                   src={profilePhoto}
//                                   alt="Profile"
//                                   className="w-full h-full object-cover"
//                                 />
//                               ) : (
//                                 <span className="text-sm">Add Photo</span>
//                               )}
//                             </div>
//                             <input
//                               type="file"
//                               accept="image/*"
//                               id="photo-upload"
//                               className="hidden"
//                               onChange={(event) =>
//                                 handleImageChange(event, setFieldValue)
//                               }
//                             />
//                             {!profilePhoto ? (
//                               <label
//                                 htmlFor="photo-upload"
//                                 className="text-blue-500 underline mt-2 cursor-pointer"
//                               >
//                                 Add Photo
//                               </label>
//                             ) : (
//                               <div className="flex space-x-4 mt-2">
//                                 <label
//                                   htmlFor="photo-upload"
//                                   className="text-blue-500 underline cursor-pointer"
//                                 >
//                                   Edit
//                                 </label>
//                                 <button
//                                   type="button"
//                                   className="text-blue-500 underline cursor-pointer"
//                                   onClick={() =>
//                                     handleRemoveImage(setFieldValue)
//                                   }
//                                 >
//                                   Remove
//                                 </button>
//                               </div>
//                             )}
//                           </div>
//                         </div>

//                         {/* Name Input Section */}
//                         <div className="flex flex-col">
//                           <label
//                             htmlFor="fullName"
//                             className="text-sm font-semibold mb-1"
//                           >
//                             Name*
//                           </label>
//                           <Field
//                             id="fullName"
//                             name="fullName"
//                             type="text"
//                             className="border border-gray-300 rounded p-2 w-64"
//                             placeholder="Enter your name"
//                           />
//                         </div>
//                         <div className="sm:col-span-6">
//                           <label
//                             htmlFor="fullName"
//                             className="block text-sm font-medium leading-6 text-gray-900"
//                           >
//                             Full name
//                           </label>
//                           <Field
//                             id="fullName"
//                             name="fullName"
//                             type="text"
//                             className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                           />
//                           <div className="text-sm text-red-700">
//                             <ErrorMessage name="fullName" />
//                           </div>
//                         </div>

//                         <div className="sm:col-span-6">
//                           <label
//                             htmlFor="phone"
//                             className="block text-sm font-medium leading-6 text-gray-900"
//                           >
//                             Phone Number
//                           </label>
//                           <Field
//                             id="phone"
//                             name="phone"
//                             type="tel"
//                             className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                           />
//                           <div className="text-sm text-red-700">
//                             <ErrorMessage name="phone" />
//                           </div>
//                         </div>

//                         <div className="sm:col-span-6">
//                           <label
//                             htmlFor="email"
//                             className="block text-sm font-medium leading-6 text-gray-900"
//                           >
//                             Email address
//                           </label>
//                           <Field
//                             id="email"
//                             name="email"
//                             type="email"
//                             className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                           />
//                           <div className="text-sm text-red-700">
//                             <ErrorMessage name="email" />
//                           </div>
//                         </div>

//                         <div className="sm:col-span-6">
//                           <label
//                             htmlFor="password"
//                             className="block text-sm font-medium leading-6 text-gray-900"
//                           >
//                             Create Password
//                           </label>
//                           <Field
//                             id="password"
//                             name="password"
//                             type="password"
//                             className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                           />
//                           <div className="text-sm text-red-700">
//                             <ErrorMessage name="password" />
//                           </div>
//                         </div>

//                         <div className="sm:col-span-6">
//                           <label
//                             htmlFor="confirm_pass"
//                             className="block text-sm font-medium leading-6 text-gray-900"
//                           >
//                             Confirm Password
//                           </label>
//                           <Field
//                             id="confirm_pass"
//                             name="confirm_pass"
//                             type="password"
//                             className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                           />
//                           <div className="text-sm text-red-700">
//                             <ErrorMessage name="confirm_pass" />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mt-2 flex justify-center border-b pb-2">
//                     <button
//                       type="submit"
//                       disabled={!isValid || isSubmitting}
//                       className="rounded-md bg-indigo-600 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-24"
//                     >
//                       Save
//                     </button>
//                   </div>

//                   <div>
//                     <p className="text-center text-sm text-gray-500">
//                       <Link to="/doctor-login">
//                         Already a registered doctor?{" "}
//                       </Link>
//                       <Link
//                         to="/doctor-login"
//                         className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
//                       >
//                         Doctor Login
//                       </Link>
//                     </p>
//                   </div>
//                 </div>
//               </Form>
//             </>
//           )}
//         </Formik>
//       )}
//     </>
//   );
// };
// export default DoctorPersonalInfo;

import { useState, useRef } from "react";
import logo from "../../assets/img/appointDoctor.jpg"; // Fixed typo in the path
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DoctorPersonalInfo = () => {
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setFieldValue("profilePhoto", file); // Update Formik's state with the file
      setProfilePhoto(URL.createObjectURL(file)); // Generate profilePhoto URL
    }
  };

  const [selectedDate, setSelectedDate] = useState(null);
  const today = new Date();

  // Handler function for date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log("Selected date:", date);
  };

  const handleRemoveImage = (setFieldValue) => {
    setFieldValue("profilePhoto", null); // Remove the image from Formik's state
    setProfilePhoto(null); // Remove the profilePhoto
    document.getElementById("photo-upload").value = ""; // Clear the file input
  };

  return (
    <>
      {success ? (
        <section>
          <Login />
        </section>
      ) : (
        <Formik
          initialValues={{
            image: null,
            fullName: "",
            email: "",
            phone: "",
            gender: "",
            dob: "",
            bloodgrp: "",
            area: "",
            locality: "",
            city: "",
            state: "",
            country: "",
            pincode: "",
            alternatePhone: "",
          }}
          validationSchema={Yup.object({
            fullName: Yup.string()
              .required("Required")
              .max(40, "Must be less than 40 letters"),
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            password: Yup.string()
              .min(6, "Must be 6 characters or more")
              .required("Required"),
            gender: Yup.string().required("Gender is required"),
          })}
          onSubmit={async (values, actions) => {
            setErrMsg("");
            try {
              const userData = {
                fullName: values.fullName,
                email: values.email,
                password: values.password,
              };
              const response = await axios.post(
                REGISTER_URL,
                JSON.stringify(userData),
                {
                  headers: { "Content-Type": "application/json" },
                  withCredentials: true,
                }
              );
              console.log(response.data);
              alert("Account Created Successfully");
              setSuccess(true);
              actions.resetForm();
            } catch (err) {
              if (!err?.response) {
                // No response from server
                setErrMsg("No Server Response");
              } else if (err.response?.status === 409) {
                // Username taken
                setErrMsg("Email already in use");
              } else if (err.response?.status === 400) {
                // Bad request (validation error, etc.)
                setErrMsg("Bad Request: " + err.response.data.message);
              } else if (err.response?.status === 500) {
                // Internal server error
                setErrMsg("Internal Server Error");
              } else {
                // Other errors
                setErrMsg("Registration Failed");
              }
              console.error(
                "Error details:",
                err.response?.data || err.message || err
              );
              errRef.current.focus();
            } finally {
              actions.setSubmitting(false);
            }
          }}
        >
          {({ isValid, isSubmitting, setFieldValue }) => (
            <>
              <div className="m-8 sm:w-full mt-3">
                <h2 className="text-xl font-medium leading-9 tracking-tight text-gray-600 border-b-[1px] py-2">
                  Personal Info
                </h2>
              </div>
              <Form>
                <div className="flex justify-center">
                  <p
                    ref={errRef}
                    className={errMsg ? "errmsg" : "offscreen"}
                    aria-live="assertive"
                  >
                    {errMsg}
                  </p>
                </div>
                <div className="flex flex-col min-h-full px-6 py-1 lg:px-8">
                  <div className="mt-2 sm:w-full sm:max-w-max">
                    <div className="border-b border-gray-900/10 pb-4">
                      <div className="flex flex-col gap-y-4">
                        <div className="flex flex-wrap gap-x-8">
                          <div className="flex items-start flex-col gap-x-6 mb-4 w-64">
                            <div className="text-sm font-semibold">
                              <span>Profile Photo</span>
                            </div>
                            <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                              {profilePhoto ? (
                                <img
                                  src={profilePhoto}
                                  alt="Profile"
                                  className="w-full h-full object-cover relative inline-block align-middle bg-[#F0F0F5] overflow-hidden"
                                />
                              ) : (
                                <span className="text-sm">Add Photo</span>
                              )}
                            </div>
                            <div>
                              <input
                                type="file"
                                accept="image/*"
                                id="photo-upload"
                                className="hidden"
                                onChange={(event) =>
                                  handleImageChange(event, setFieldValue)
                                }
                              />
                              {!profilePhoto ? (
                                <label
                                  htmlFor="photo-upload"
                                  className="text-blue-500 underline cursor-pointer"
                                >
                                  Add Photo
                                </label>
                              ) : (
                                <div className="flex space-x-4">
                                  <label
                                    htmlFor="photo-upload"
                                    className="text-blue-500 underline cursor-pointer"
                                  >
                                    Edit
                                  </label>
                                  <button
                                    type="button"
                                    className="text-blue-500 underline cursor-pointer"
                                    onClick={() =>
                                      handleRemoveImage(setFieldValue)
                                    }
                                  >
                                    Remove
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col mx-3 gap-y-2">
                            <label
                              htmlFor="fullName"
                              className="text-xs font-normal gap-x-1 text-gray-500"
                            >
                              Name*
                            </label>
                            <Field
                              id="fullName"
                              name="fullName"
                              type="text"
                              className="border border-gray-300 rounded p-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter your name"
                            />
                            <div className="text-sm text-red-700">
                              <ErrorMessage name="fullName" />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-x-11 border-t-[1px] border-b-[1px] py-2">
                          <div className="flex flex-col gap-y-2">
                            <label
                              htmlFor="phone"
                              className="text-xs font-normal text-gray-500"
                            >
                              Phone Number
                            </label>
                            <Field
                              id="phone"
                              name="phone"
                              type="tel"
                              className="border border-gray-300 rounded p-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter your phone number"
                            />
                            <div className="text-sm text-red-700">
                              <ErrorMessage name="phone" />
                            </div>
                          </div>

                          <div className="flex flex-col gap-y-2">
                            <label
                              htmlFor="email"
                              className="text-xs font-normal text-gray-500"
                            >
                              Email address
                            </label>
                            <Field
                              id="email"
                              name="email"
                              type="email"
                              className="border border-gray-300 rounded p-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter your email address"
                            />
                            <div className="text-sm text-red-700">
                              <ErrorMessage name="email" />
                            </div>
                          </div>

                          <div className="flex flex-col gap-y-2">
                            <label
                              htmlFor="password"
                              className="text-xs font-normal text-gray-500"
                            >
                              Gender
                            </label>
                            <Field
                              as="select"
                              name="gender"
                              className="border border-gray-300 rounded p-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="" disabled>
                                select an option
                              </option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </Field>
                            <div className="text-sm text-red-700">
                              <ErrorMessage name="gender" />
                            </div>
                          </div>

                          <div className="flex flex-col gap-y-2 rounded w-full sm:w-64">
                            <label
                              htmlFor="dob"
                              className="text-xs font-normal text-gray-500"
                            >
                              Date of Birth
                            </label>
                            <DatePicker
                              selected={selectedDate}
                              onChange={handleDateChange}
                              dateFormat="dd/MM/yyyy"
                              placeholderText="Click to select a date"
                              showYearDropdown
                              showMonthDropdown
                              dropdownMode="select"
                              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              calendarClassName="rounded-lg shadow-lg border"
                              dayClassName={(date) =>
                                date.getDate() === today.getDate()
                                  ? "bg-blue-500 text-white rounded-full"
                                  : "hover:bg-blue-100 text-gray-800"
                              }
                              wrapperClassName="w-full"
                              maxDate={today}
                            />
                            <div className="text-sm text-red-700">
                              <ErrorMessage name="dob" />
                            </div>
                          </div>

                          <div className="flex flex-col gap-y-2">
                            <label
                              htmlFor="password"
                              className="text-xs font-normal text-gray-500"
                            >
                              Blood Group
                            </label>
                            <Field
                              as="select"
                              name="gender"
                              className="border border-gray-300 rounded p-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="" disabled>
                                select an option
                              </option>
                              <option value="male">O+</option>
                              <option value="female">A+</option>
                              <option value="other">B+</option>
                              <option value="other">O-</option>
                              <option value="other">A-</option>
                              <option value="other">B-</option>
                              <option value="other">AB+</option>
                              <option value="other">AB-</option>
                            </Field>
                            <div className="text-sm text-red-700">
                              <ErrorMessage name="gender" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <span className="text-sm font-semibold">Address</span>
                          <div className="flex flex-wrap gap-x-11">
                            <div className="flex flex-col gap-y-2">
                              <label
                                htmlFor="area"
                                className="text-xs font-normal text-gray-500 "
                              >
                                House No./Street Name/Area
                              </label>
                              <Field
                                id="area"
                                name="area"
                                type="text"
                                className="border border-gray-300 rounded p-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <div className="text-sm text-red-700">
                                <ErrorMessage name="area" />
                              </div>
                            </div>
                            <div className="flex flex-col gap-y-2">
                              <label
                                htmlFor="locality"
                                className="text-xs font-normal text-gray-500"
                              >
                                Colony/Street/Locality
                              </label>
                              <Field
                                id="locality"
                                name="locality"
                                type="text"
                                className="border border-gray-300 rounded p-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <div className="text-sm text-red-700">
                                <ErrorMessage name="locality" />
                              </div>
                            </div>
                            <div className="flex flex-col gap-y-2">
                              <label
                                htmlFor="city"
                                className="text-xs font-normal text-gray-500"
                              >
                                city
                              </label>
                              <Field
                                id="city"
                                name="city"
                                type="city"
                                className="border border-gray-300 rounded p-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <div className="text-sm text-red-700">
                                <ErrorMessage name="city" />
                              </div>
                            </div>
                            <div className="flex flex-col gap-y-2">
                              <label
                                htmlFor="state"
                                className="text-xs font-normal text-gray-500"
                              >
                                state
                              </label>
                              <Field
                                id="state"
                                name="state"
                                type="text"
                                className="border border-gray-300 rounded p-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <div className="text-sm text-red-700">
                                <ErrorMessage name="state" />
                              </div>
                            </div>
                            <div className="flex flex-col gap-y-2">
                              <label
                                htmlFor="pincode"
                                className="text-xs font-normal text-gray-500"
                              >
                                Pincode*
                              </label>
                              <Field
                                id="pincode"
                                name="pincode"
                                type="text"
                                className="border border-gray-300 rounded p-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <div className="text-sm text-red-700">
                                <ErrorMessage name="pincode" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center pt-2">
                    <button
                      type="submit"
                      disabled={!isValid || isSubmitting}
                      className="rounded-md bg-indigo-600 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-24"
                    >
                      Save
                    </button>
                  </div>

                  <div className="mt-4">
                    <p className="text-center text-sm text-gray-500">
                      <Link to="/doctor-login">
                        Already a registered doctor?{" "}
                      </Link>
                      <Link
                        to="/doctor-login"
                        className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                      >
                        Doctor Login
                      </Link>
                    </p>
                  </div>
                </div>
              </Form>
            </>
          )}
        </Formik>
      )}
    </>
  );
};

export default DoctorPersonalInfo;
