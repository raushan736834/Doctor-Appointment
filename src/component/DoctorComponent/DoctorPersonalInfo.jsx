import { useState, useRef, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../hooks/useAxios";
import OverlayLoader from "../Common/Loader";
import useAuth from "../../hooks/useAuth";

const ADD_DOCTOR_DATA = "api/user/addDoctor";
const ALL_SPECIALIST_URL = "api/user/allSpecialist";

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const DoctorPersonalInfo = () => {
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [specialist, setSpecialist] = useState([]);
  const name = localStorage.getItem("name");
  const { setIsLoading, isLoading } = useAuth();
  const email = localStorage.getItem("email");
  const [doctorId, setDoctorId] = useState("");
  const [fetchData, setFetchData] = useState([]);
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(60), (val, index) => currentYear - index);

  const FETCH_URL = `/api/user/${email}`;

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(FETCH_URL);
      console.log(response);
      setFetchData(response.data);
      setDoctorId(response.data?.id);
      console.log(response.data); // Set loading to false after data is fetched
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  console.log(fetchData);
  useEffect(() => {
    fetchUserData();
    fetchSpecialist();
  }, [email]);

  const fetchSpecialist = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(ALL_SPECIALIST_URL);
      setSpecialist(response?.data);
    } catch (err) {
      console.log(err);
    } finally{
      setIsLoading(false);
    }
  };

  if(isLoading){
    <OverlayLoader/>
  }

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          doctorName: name || fetchData.doctorName,
          image: fetchData.profilePhoto,
          phoneNumber: fetchData?.phoneNumber,
          email: email || fetchData.email,
          gender: fetchData?.gender,
          locality: fetchData?.locality,
          city: fetchData?.city,
          state: fetchData?.state,
          pincode: fetchData?.pincode,
          specialization: fetchData?.specialization,
          qualifications:
      fetchData?.qualifications?.length > 0
        ? fetchData.qualifications.map((q) => ({
            qualification: q.qualification || "",
            college: q.college || "",
            completionYear: q.completionYear || "",
          }))
        : [{ qualification: "", college: "", completionYear: "" }],
          experience: fetchData?.experienceYears,
          fees: fetchData?.consultationFees,
          clinic: fetchData?.clinicName,
        }}
        validationSchema={Yup.object({
          image: Yup.string().required("Required"),
          doctorName: Yup.string()
            .required("Required")
            .max(40, "Must be less than 40 letters"),
          phoneNumber: Yup.string()
            .required("Required")
            .matches(
              /^\d{10}$/,
              "phoneNumber number must be 10 digits and Only Number"
            ),
          gender: Yup.string().required("Required"),
          locality: Yup.string().required("Required"),
          city: Yup.string().required("Required"),
          state: Yup.string().required("Required"),
          pincode: Yup.number()
            .required("Required")
            .positive("Must be a positive number")
            .integer("Must be an integer"),
          specialization: Yup.string().required("Required"),
          qualifications: Yup.array()
            .of(
              Yup.object().shape({
                qualification: Yup.string().required("Required"),
                college: Yup.string().required("Required"),
                completionYear: Yup.number()
                  .required("Required")
                  .positive("Must be a positive number")
                  .integer("Must be an integer")
                  .max(
                    new Date().getFullYear(),
                    "Year cannot be in the future"
                  ),
              })
            )
            .min(1, "At least one qualification is required")
            .max(4, "Maximum 4 qualifications allowed"),
          fees: Yup.number()
            .required("Required")
            .positive("Must be a positive number"),
          experience: Yup.number()
            .required("Required")
            .min(0, "Experience must be non-negative"),
          clinic: Yup.string().required("Required"),
        })}
        onSubmit={async (values, actions) => {
          if (doctorId == null) {
            const id = uuid();
            setDoctorId(id);
          }
          setErrMsg("");
          try {
            const formData = {
              id: doctorId,
              name: values.name,
              email : email,
              profilePhoto: values.image,
              phoneNumber: values.phoneNumber,
              gender: values.gender,
              locality: values.locality,
              city: values.city,
              state: values.state,
              pincode: values.pincode,
              specialization: values.specialization,
              consultationFees: values.fees,
              experienceYears: values.experience,
              qualifications: values.qualifications,
              clinicName: values.clinic,
            };
            const response = await api.put(ADD_DOCTOR_DATA, formData);
            console.log(response.data);
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
            errRef.current.focus();
          } finally {
            actions.setSubmitting(false);
          }
        }}
      >
        {({ isValid, isSubmitting }) => (
          <>
            <Form>
              <div className="m-4 sm:w-full mt-3">
                <h2 className="text-xl font-medium leading-9 tracking-tight text-gray-600 border-b-[1px] py-2">
                  Personal Info
                </h2>
              </div>
              <div className="flex justify-center">
                <p
                  ref={errRef}
                  className={errMsg ? "errmsg" : "offscreen"}
                  aria-live="assertive"
                >
                  {errMsg}
                </p>
              </div>
              <div className="flex flex-col min-h-full px-2 lg:px-2">
                <div className="sm:w-full sm:max-w-max">
                  <div className="border-b border-gray-900/10 ">
                    <div className="flex flex-col gap-y-4">
                      <div className="flex flex-col">
                        <div className="flex flex-col gap-y-2">
                          <label
                            htmlFor="image"
                            className="text-xs font-normal text-gray-500 flex"
                          >
                            <span className="">Profile Photo Url</span>
                          </label>
                          <Field
                            id="image"
                            name="image"
                            type="text"
                            placeholder="Your Profile Url"
                            className="border border-gray-300 rounded p-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="text-xs text-red-700">
                            <ErrorMessage name="image" />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <label
                            htmlFor="doctorName"
                            className="text-xs font-normal text-gray-500"
                          >
                            Name
                          </label>
                          <div className="flex mt-1">
                            <Field
                              as="select"
                              name="title"
                              className="border-[1px] border-gray-400 p-2 border-solid rounded-l min-w-16"
                            >
                              <option value="Dr.">Dr.</option>
                              <option value="Mr.">Mr.</option>
                              <option value="Ms.">Ms.</option>
                            </Field>
                            <Field
                              id="doctorName"
                              name="doctorName"
                              autoComplete="off"
                              className="border-y-[1px] px-2 rounded-r border-gray-400 border-r sm:w-[192px] focus:outline-none"
                            />
                          </div>
                          <div className="text-xs text-red-700">
                            <ErrorMessage name="doctorName" />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-x-11 border-t-[1px] border-b-[1px] py-2">
                        <div className="flex flex-col gap-y-2">
                          <label
                            htmlFor="phoneNumber"
                            className="text-xs font-normal text-gray-500"
                          >
                            Phone Number
                          </label>
                          <Field
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            className="border border-gray-300 rounded p-2 w-full text-sm sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your Phone number"
                          />
                          <div className="text-xs text-red-700">
                            <ErrorMessage name="phoneNumber" />
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
                            disabled
                            className="border border-gray-300 rounded p-2 w-full text-sm sm:w-64 focus:outline-none cursor-not-allowed focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email address"
                          />
                          <div className="text-xs text-red-700">
                            <ErrorMessage name="email" />
                          </div>
                        </div>

                        <div className="flex flex-col gap-y-2">
                          <label
                            htmlFor="gender"
                            className="text-xs font-normal text-gray-500"
                          >
                            Gender
                          </label>
                          <Field
                            as="select"
                            name="gender"
                            className="border border-gray-300 rounded p-2 w-full text-sm sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select an option</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </Field>
                          <div className="text-xs text-red-700">
                            <ErrorMessage name="gender" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className="text-sm font-semibold">Address</span>
                        <div className="flex flex-wrap gap-x-11">
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
                            <div className="text-xs text-red-700">
                              <ErrorMessage name="locality" />
                            </div>
                          </div>
                          <div className="flex flex-col gap-y-2">
                            <label
                              htmlFor="city"
                              className="text-xs font-normal text-gray-500"
                            >
                              City
                            </label>
                            <Field
                              id="city"
                              name="city"
                              type="city"
                              className="border border-gray-300 rounded p-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="text-xs text-red-700">
                              <ErrorMessage name="city" />
                            </div>
                          </div>
                          <div className="flex flex-col gap-y-2">
                            <label
                              htmlFor="state"
                              className="text-xs font-normal text-gray-500"
                            >
                              State
                            </label>
                            <Field
                              id="state"
                              name="state"
                              type="text"
                              className="border border-gray-300 rounded text-sm p-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="text-xs text-red-700">
                              <ErrorMessage name="state" />
                            </div>
                          </div>
                          <div className="flex flex-col gap-y-2">
                            <label
                              htmlFor="pincode"
                              className="text-xs font-normal text-gray-500"
                            >
                              Pincode
                            </label>
                            <Field
                              id="pincode"
                              name="pincode"
                              type="text"
                              className="border border-gray-300 rounded text-sm p-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="text-xs text-red-700">
                              <ErrorMessage name="pincode" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="m-2 sm:w-full mt-3">
                <h2 className="text-xl font-medium leading-9 tracking-tight text-gray-600 border-b-[1px] ">
                  qualifications Info
                </h2>
              </div>
              <div className="flex flex-col min-h-full px-2 lg:px-2">
                <div className=" border-b border-gray-900/10 pb-2">
                  <div className="my-1 flex flex-col sm:w-[355px]">
                    <label className="text-xs text-gray-600 mb-2">
                      Specialization
                    </label>
                    <Field
                      as="select"
                      name="specialization"
                      className="border border-gray-300 rounded sm:w-64 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select an option</option>
                      {specialist &&
                        specialist.length > 0 &&
                        specialist.map((item, idx) => (
                          <option key={idx} value={item}>
                            {item}
                          </option>
                        ))}
                    </Field>
                    <div className="text-xs text-red-700">
                      <ErrorMessage name="specialization" />
                    </div>
                  </div>
                  {/* Qualification Fields in a single row, dynamic with plus button */}
                  <FieldArray name="qualifications">
                    {({ push, remove, form }) => (
                      <div>
                        {form.values.qualifications.map((_, idx) => (
                          <div
                            key={idx}
                            className="flex flex-row flex-wrap gap-3 justify-between w-full bg-white p-2 my-2 max-w-60 md:max-w-full lg:max-w-full items-end"
                          >
                            <div className="flex w-64 flex-col min-w-52 max-w-56">
                              <label className="text-xs text-gray-600 mb-2">
                                Qualification
                              </label>
                              <Field
                                id={`qualifications.${idx}.qualification`}
                                name={`qualifications.${idx}.qualification`}
                                type="text"
                                placeholder="Enter your qualification"
                                className="border border-gray-300 rounded p-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <div className="text-xs text-red-700">
                                <ErrorMessage
                                  name={`qualifications.${idx}.qualification`}
                                />
                              </div>
                            </div>
                            <div className="flex w-64 flex-col min-w-52 max-w-56">
                              <label className="text-xs text-gray-600 mb-2">
                                College
                              </label>
                              <Field
                                id={`qualifications.${idx}.college`}
                                name={`qualifications.${idx}.college`}
                                type="text"
                                placeholder="Enter your college"
                                className="border border-gray-300 rounded p-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <div className="text-xs text-red-700">
                                <ErrorMessage
                                  name={`qualifications.${idx}.college`}
                                />
                              </div>
                            </div>
                            <div className="flex flex-col w-64 min-w-52 max-w-56">
                              <label className="text-xs text-gray-600 mb-2">
                                Completion Year
                              </label>
                              <Field
                                as="select"
                                id={`qualifications.${idx}.completionYear`}
                                name={`qualifications.${idx}.completionYear`}
                                className="border border-gray-300 rounded p-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select year</option>
                                {years.map((year) => (
                                  <option key={year} value={year}>
                                    {year}
                                  </option>
                                ))}
                              </Field>

                              <div className="text-xs text-red-700">
                                <ErrorMessage
                                  name={`qualifications.${idx}.completionYear`}
                                />
                              </div>
                            </div>
                            {/* Remove button always visible except when only 1 row */}
                            <button
                              type="button"
                              onClick={() => remove(idx)}
                              className="text-red-500 text-2xl font-bold pb-2 hover:text-red-700"
                              title="Remove this qualification"
                              disabled={form.values.qualifications.length === 1}
                            >
                              &minus;
                            </button>
                            {/* Plus button only visible if only 1 row, or last row and less than 4 */}
                            {form.values.qualifications.length < 4 &&
                              ((form.values.qualifications.length === 1 &&
                                idx === 0) ||
                                (form.values.qualifications.length > 1 &&
                                  idx ===
                                    form.values.qualifications.length - 1)) && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    push({
                                      qualification: "",
                                      college: "",
                                      completionYear: "",
                                    })
                                  }
                                  className="text-green-500 text-2xl font-bold pb-2 hover:text-green-700"
                                  title="Add another qualification"
                                >
                                  +
                                </button>
                              )}
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldArray>
                </div>
              </div>
              <div className="m-2 sm:w-full mt-3">
                <h2 className="text-xl font-medium leading-9 tracking-tight text-gray-600 border-b-[1px] ">
                  Other Info
                </h2>
              </div>
              <div className="flex flex-col min-h-full px-2 lg:px-2">
                <div className=" border-b border-gray-900/10 pb-2">
                  <div className="flex flex-wrap gap-x-11">
                    <div className="flex flex-col gap-y-2">
                      <label
                        htmlFor="fees"
                        className="text-xs font-normal text-gray-500"
                      >
                        Clinic Name
                      </label>
                      <Field
                        id="clinic"
                        name="clinic"
                        type="text"
                        className="border border-gray-300 rounded p-2 w-full text-sm sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="text-xs text-red-700">
                        <ErrorMessage name="clinic" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <label
                        htmlFor="fees"
                        className="text-xs font-normal text-gray-500"
                      >
                        Consulation Fees
                      </label>
                      <Field
                        id="fees"
                        name="fees"
                        type="number"
                        className="border border-gray-300 rounded p-2 w-full text-sm sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="text-xs text-red-700">
                        <ErrorMessage name="fees" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <label
                        htmlFor="experience"
                        className="text-xs font-normal text-gray-500"
                      >
                        Experience Years
                      </label>
                      <Field
                        id="experience"
                        name="experience"
                        type="number"
                        className="border border-gray-300 rounded p-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="text-xs text-red-700">
                        <ErrorMessage name="experience" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-center pt-2">
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="rounded-md bg-indigo-600 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-24 cursor-pointer"
                >
                  Save
                </button>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default DoctorPersonalInfo;
