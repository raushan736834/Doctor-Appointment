import { useState, useRef, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "../../api/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useAuth from "@/hooks/useAuth";

const DoctorPersonalInfo = () => {
  const errRef = useRef();
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [name, setName] = useState("");
  const auth = useAuth();
  const email = localStorage.getItem("email");

  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setFieldValue("profilePhoto", file); // Update Formik's state with the file
      setProfilePhoto(URL.createObjectURL(file)); // Generate profilePhoto URL
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/doctor/${email}`);
      setFetchName(response.data);
      console.log(response);

      setLoading(false); // Set loading to false after data is fetched
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchUserData();
  }, []);

  const [selectedDate, setSelectedDate] = useState(null);
  const today = new Date();

  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log("Selected date:", date);
  };

  const handleRemoveImage = (setFieldValue) => {
    setFieldValue("profilePhoto", null);
    setProfilePhoto(null);
    document.getElementById("photo-upload").value = "";
  };

  if(success) {
    navigate("auth/login")
  }
  return (
    <>
      <Formik
        initialValues={{
          image: null,
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
                            Name
                          </label>
                          <Field
                            id="fullName"
                            name="fullName"
                            type="text"
                            value={name}
                            disabled
                            className="border border-gray-300 rounded p-2 w-full text-sm sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="border border-gray-300 rounded p-2 w-full text-sm sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            value={email}
                            disabled
                            className="border border-gray-300 rounded p-2 w-full text-sm sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="border border-gray-300 rounded p-2 w-full text-sm sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="w-full p-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="border border-gray-300 rounded p-2 w-full text-sm sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                              className="border border-gray-300 rounded p-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                              className="border border-gray-300 rounded p-2 w-full text-sm sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                              className="border border-gray-300 rounded p-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                              className="border border-gray-300 rounded text-sm p-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                              className="border border-gray-300 rounded text-sm p-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default DoctorPersonalInfo;
