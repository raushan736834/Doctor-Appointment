import { useState, useRef, useEffect } from "react";
import { User, Phone, Mail, MapPin, GraduationCap, Building, IndianRupee, Clock, Plus, Camera, TrashIcon,
} from "lucide-react";
import { useAuth } from "../GlobalComponent/AuthProvider";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import OverlayLoader from "../Common/Loader";
import { useApiService } from "../../hooks/useAuthWithAxios";

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const ADD_DOCTOR_DATA = "api/user/addDoctor";
const ALL_SPECIALIST_URL = "api/user/allSpecialist";

const DoctorPersonalInfo = () => {
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [specialist, setSpecialist] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const { setIsLoading, isLoading } = useAuth();
  const email = localStorage.getItem("email");
  console.log(email);
  const name = localStorage.getItem("name");
  const [fetchData, setFetchData] = useState([]);
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(60), (val, index) => currentYear - index);
  const api = useApiService();
  const FETCH_URL = `/api/user/${email}`;

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(FETCH_URL);
      console.log(response);
      setFetchData(response.data);
      setDoctorId(response.data?.id);
      console.log(response.data);
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
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    <OverlayLoader />;
  }

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        doctorName: name || fetchData?.doctorName || "",
        image: fetchData?.profilePhoto || "",
        phoneNumber: fetchData?.phoneNumber || "",
        email: email || "",
        gender: fetchData?.gender || "",
        locality: fetchData?.locality || "",
        city: fetchData?.city || "",
        state: fetchData?.state || "",
        pincode: fetchData?.pincode || "",
        specialization: fetchData?.specialization || "",
        qualifications:
          fetchData?.qualifications?.length > 0
            ? fetchData.qualifications.map((q) => ({
                qualification: q.qualification || "",
                college: q.college || "",
                completionYear: q.completionYear || "",
              }))
            : [{ qualification: "", college: "", completionYear: "" }],
        experience: fetchData?.experienceYears || "",
        fees: fetchData?.consultationFees || "",
        clinic: fetchData?.clinicName || "",
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
                .max(new Date().getFullYear(), "Year cannot be in the future"),
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
            email: email,
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
            <div className="min-h-screen">
              <div className="max-w-6xl mx-auto py-2">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="flex justify-center">
                    <p
                      ref={errRef}
                      className={errMsg ? "errmsg" : "offscreen"}
                      aria-live="assertive"
                    >
                      {errMsg}
                    </p>
                  </div>
                  {/* Header */}
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8 sm:px-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                      Doctor Profile Information
                    </h1>
                    <p className="text-blue-100 mt-2">
                      Complete your professional profile
                    </p>
                  </div>

                  <div className="p-6 sm:p-8 space-y-8">
                    {/* Error Message */}
                    {errMsg && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-700 text-sm" ref={errRef}>
                          {errMsg}
                        </p>
                      </div>
                    )}

                    {/* Personal Information Section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
                        <User className="h-6 w-6 text-blue-600" />
                        <h2 className="text-xl font-semibold text-gray-800">
                          Personal Information
                        </h2>
                      </div>

                      {/* Profile Photo */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                            {"" ? (
                              <img
                                src={formData.image}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <Camera className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 max-w-md">
                          <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            htmlFor="doctorName"
                          >
                            Profile Photo URL
                          </label>
                          <Field
                            id="image"
                            name="image"
                            type="url"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Enter photo URL"
                          />
                          <div className="text-red-500 text-xs mt-1">
                            <ErrorMessage name="image" />
                          </div>
                        </div>
                      </div>

                      {/* Name and Basic Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Name */}
                        <div className="lg:col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <div className="flex">
                            <select
                              name="title"
                              className="px-3 py-3 border border-gray-300 rounded-l-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="Dr.">Dr.</option>
                              <option value="Mr.">Mr.</option>
                              <option value="Ms.">Ms.</option>
                            </select>
                            <Field
                              type="text"
                              id="doctorName"
                              name="doctorName"
                              className="flex-1 px-4 py-3 border-l-0 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter full name"
                            />
                          </div>
                          <div className="text-red-500 text-xs mt-1">
                            <ErrorMessage name="doctorName" />
                          </div>
                        </div>

                        {/* Phone */}
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            htmlFor="phone"
                          >
                            <Phone className="inline h-4 w-4 mr-1" />
                            Phone Number
                          </label>
                          <Field
                            type="tel"
                            id="phone"
                            name="phoneNumber"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="10-digit phone number"
                            maxLength="10"
                          />
                          <div className="text-red-500 text-xs mt-1">
                            <ErrorMessage name="phoneNumber" />
                          </div>
                        </div>

                        {/* Email */}
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            htmlFor="email"
                          >
                            <Mail className="inline h-4 w-4 mr-1" />
                            Email Address
                          </label>
                          <Field
                            type="email"
                            name="email"
                            disabled
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                            placeholder="Email address"
                          />
                        </div>

                        {/* Gender */}
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            htmlFor="gender"
                          >
                            Gender
                          </label>
                          <Field
                            as="select"
                            name="gender"
                            id="gender"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 
                            focus:border-transparent"
                          >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </Field>
                          <div className="text-red-500 text-xs mt-1">
                            <ErrorMessage name="gender" />
                          </div>
                        </div>
                      </div>

                      {/* Address Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-blue-600" />
                          Address Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="lg:col-span-2">
                            <label
                              className="block text-sm font-medium text-gray-700 mb-2"
                              htmlFor="locality"
                            >
                              Colony/Street/Locality
                            </label>
                            <Field
                              type="text"
                              id="locality"
                              name="locality"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter locality"
                            />
                            <div className="text-red-500 text-xs mt-1">
                              <ErrorMessage name="locality" />
                            </div>
                          </div>
                          <div>
                            <label
                              className="block text-sm font-medium text-gray-700 mb-2"
                              htmlFor="city"
                            >
                              City
                            </label>
                            <Field
                              type="text"
                              id="city"
                              name="city"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter city"
                            />
                            <div className="text-red-500 text-xs mt-1">
                              <ErrorMessage name="city" />
                            </div>
                          </div>
                          <div>
                            <label
                              className="block text-sm font-medium text-gray-700 mb-2"
                              htmlFor="state"
                            >
                              State
                            </label>
                            <Field
                              type="text"
                              id="state"
                              name="state"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter state"
                            />
                            <div className="text-red-500 text-xs mt-1">
                              <ErrorMessage name="state" />
                            </div>
                          </div>
                          <div>
                            <label
                              className="block text-sm font-medium text-gray-700 mb-2"
                              htmlFor="pincode"
                            >
                              Pincode
                            </label>
                            <Field
                              type="text"
                              id="pincode"
                              name="pincode"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="6-digit pincode"
                              maxLength="6"
                            />
                            <div className="text-red-500 text-xs mt-1">
                              <ErrorMessage name="pincode" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Professional Information Section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
                        <GraduationCap className="h-6 w-6 text-blue-600" />
                        <h2 className="text-xl font-semibold text-gray-800">
                          Professional Information
                        </h2>
                      </div>

                      {/* Specialization */}
                      <div className="max-w-md">
                        <label
                          className="block text-sm font-medium text-gray-700 mb-2"
                          htmlFor="specialization"
                        >
                          Specialization
                        </label>
                        <Field
                          as="select"
                          id="specialization"
                          name="specialization"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select specialization</option>
                          {specialist.map((item, idx) => (
                            <option key={idx} value={item}>
                              {item}
                            </option>
                          ))}
                        </Field>
                        <div className="text-red-500 text-xs mt-1">
                          <ErrorMessage name="specialization" />
                        </div>
                      </div>

                      {/* Qualifications */}
                      <FieldArray name="qualifications">
                        {({ push, remove, form }) => (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-medium text-gray-800">
                                Qualifications
                              </h3>
                              <button
                                type="button"
                                onClick={() =>
                                  form.values.qualifications.length < 4 &&
                                  push({
                                    qualification: "",
                                    college: "",
                                    completionYear: "",
                                  })
                                }
                                disabled={
                                  form.values.qualifications.length >= 4
                                }
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                              >
                                <Plus className="h-4 w-4" />
                                Add Qualification
                              </button>
                            </div>

                            {form.values.qualifications.map((qual, index) => (
                              <div
                                key={index}
                                className="bg-gray-50 rounded-xl p-6 space-y-4 border border-gray-200"
                              >
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-gray-800">
                                    Qualification {index + 1}
                                  </h4>
                                  {form.values.qualifications.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => remove(index)}
                                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Qualification
                                    </label>
                                    <Field
                                      name={`qualifications[${index}].qualification`}
                                      placeholder="e.g., MBBS, MD"
                                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <ErrorMessage
                                      name={`qualifications[${index}].qualification`}
                                      component="p"
                                      className="text-red-500 text-xs mt-1"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      College/University
                                    </label>
                                    <Field
                                      name={`qualifications[${index}].college`}
                                      placeholder="College name"
                                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <ErrorMessage
                                      name={`qualifications[${index}].college`}
                                      component="p"
                                      className="text-red-500 text-xs mt-1"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Completion Year
                                    </label>
                                    <Field
                                      as="select"
                                      name={`qualifications[${index}].completionYear`}
                                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                      <option value="">Select year</option>
                                      {years.map((year) => (
                                        <option key={year} value={year}>
                                          {year}
                                        </option>
                                      ))}
                                    </Field>
                                    <ErrorMessage
                                      name={`qualifications[${index}].completionYear`}
                                      component="p"
                                      className="text-red-500 text-xs mt-1"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </FieldArray>
                    </div>

                    {/* Practice Information Section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
                        <Building className="h-6 w-6 text-blue-600" />
                        <h2 className="text-xl font-semibold text-gray-800">
                          Practice Information
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            htmlFor="clinic"
                          >
                            <Building className="inline h-4 w-4 mr-1" />
                            Clinic Name
                          </label>
                          <Field
                            type="text"
                            name="clinic"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter clinic name"
                          />
                          <ErrorMessage
                            name={"clinic"}
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>

                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            htmlFor="fees"
                          >
                            <IndianRupee className="inline h-4 w-4 mr-1" />
                            Consultation Fees (₹)
                          </label>
                          <Field
                            type="number"
                            name="fees"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter fees"
                            min="0"
                          />
                          <ErrorMessage
                            name={"fees"}
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>

                        <div>
                          <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            htmlFor="experience"
                          >
                            <Clock className="inline h-4 w-4 mr-1" />
                            Experience (Years)
                          </label>
                          <Field
                            type="number"
                            name="experience"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Years of experience"
                            min="0"
                          />
                          <ErrorMessage
                            name={"experience"}
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center pt-8">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none min-w-32"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Saving...
                          </div>
                        ) : (
                          "Save Profile"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default DoctorPersonalInfo;
