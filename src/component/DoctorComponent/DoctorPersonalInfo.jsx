import { useState, useRef, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Building,
  IndianRupee,
  Clock,
  Plus,
  Camera,
  TrashIcon,
  Save,
  Briefcase,
} from "lucide-react";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { useApiService } from "../../hooks/useAuthWithAxios";
// Mock hooks for demonstration

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const DoctorPersonalInfo = () => {
  const [activeSection, setActiveSection] = useState("personal");
  const [fetchData, setFetchData] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [isOperatingHoursExpanded, setIsOperatingHoursExpanded] =
    useState(true);
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(60), (val, index) => currentYear - index);
  const api = useApiService();

  const fetchDoctorData = async () => {
    try {
      const response = await api.get("/api/doctors/getDoctorDetails");
      if (response?.success) {
        // Normalize backend shapes to the form components' expected shapes
        const raw = response?.data?.data || {};
        const normalized = { ...raw };

        // If backend returns education wrapped as { doctorEducation: [...] }, unwrap it.
        if (normalized.education && normalized.education.doctorEducation) {
          normalized.education = normalized.education.doctorEducation;
        }

        // Ensure documents is always an object (not undefined or null)
        if (!normalized.documents || typeof normalized.documents !== "object") {
          normalized.documents = {};
        }

        setFetchData(normalized);
      } else {
        setFetchData({});
      }
    } catch (error) {
      console.error("Error fetching doctor data:", error);
      setFetchData({});
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, []);
  console.log(fetchData);

  // Personal Info Form
  const PersonalInfoSection = () => {
    const fileInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(
      fetchData?.personalInfo?.profileImage || ""
    );

    return (
      <Formik
        enableReinitialize={true}
        initialValues={{
          profileImage: fetchData?.personalInfo?.profileImage || "",
          firstName: fetchData?.personalInfo?.firstName || "",
          lastName: fetchData?.personalInfo?.lastName || "",
          phone: fetchData?.personalInfo?.phone || "",
          email: fetchData?.personalInfo?.email || "",
          dob: fetchData?.personalInfo?.dob || "",
          gender: fetchData?.personalInfo?.gender || "",
          address: fetchData?.personalInfo?.address || "",
          city: fetchData?.personalInfo?.city || "",
          state: fetchData?.personalInfo?.state || "",
          pincode: fetchData?.personalInfo?.pincode || "",
        }}
        validationSchema={Yup.object({
          profileImage: Yup.string().required("Profile photo is required"),
          firstName: Yup.string().required("Required"),
          lastName: Yup.string().required("Required"),
          phone: Yup.string()
            .required("Required")
            .matches(/^\d{10}$/, "Phone must be 10 digits"),
          email: Yup.string().email("Invalid email").required("Required"),
          dob: Yup.date().required("Required"),
          gender: Yup.string().required("Required"),
          address: Yup.string().required("Required"),
          city: Yup.string().required("Required"),
          state: Yup.string().required("Required"),
          pincode: Yup.string()
            .required("Required")
            .matches(/^\d{6}$/, "Pincode must be 6 digits"),
        })}
        onSubmit={async (values, actions) => {
          try {
            const response = await api.put(
              "/api/doctors/updatePersonalInfo",
              values
            );
            setSuccessMsg("Personal information updated successfully!");
            setTimeout(() => setSuccessMsg(""), 3000);
          } catch (err) {
            console.error(err);
          } finally {
            actions.setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => {
          const handleFileChange = (event) => {
            const file = event.target.files[0];
            if (file) {
              // Validate file type
              if (!file.type.startsWith("image/")) {
                alert("Please select an image file");
                return;
              }

              // Validate file size (max 5MB)
              if (file.size > 5 * 1024 * 1024) {
                alert("File size should be less than 5MB");
                return;
              }

              const reader = new FileReader();
              reader.onloadend = () => {
                const base64String = reader.result;
                setImagePreview(base64String);
                setFieldValue("profileImage", base64String);
              };
              reader.readAsDataURL(file);
            }
          };

          const handleRemovePhoto = () => {
            setImagePreview("");
            setFieldValue("profileImage", "");
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          };

          return (
            <Form>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-6">
                  <div className="flex items-center gap-3">
                    <User className="h-6 w-6 text-white" />
                    <h2 className="text-2xl font-bold text-white">
                      Personal Information
                    </h2>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  {/* Profile Photo */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                        {imagePreview || values.profileImage ? (
                          <img
                            src={
                              `data:image/jpeg;base64,${imagePreview}` ||
                              `data:image/jpeg;base64,${values.profileImage}`
                            }
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                            <User className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      {(imagePreview || values.profileImage) && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all transform hover:scale-110"
                          title="Remove photo"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Profile Photo
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {(imagePreview || values.profileImage) ? (
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-all font-medium"
                            >
                              <Camera className="h-5 w-5" />
                              <span>Change Photo</span>
                            </button>
                          ) :
                          (<label className="flex items-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg cursor-pointer transition-all font-medium">
                            <Camera className="h-5 w-5" />
                            <span>Choose Photo</span>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>)}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Supported formats: JPG, PNG, GIF (Max 5MB)
                        </p>
                      </div>

                      <input
                        type="hidden"
                        name="profileImage"
                        value={values.profileImage}
                      />
                      <ErrorMessage
                        name="profileImage"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <Field
                        name="firstName"
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter first name"
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <Field
                        name="lastName"
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter last name"
                      />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="inline h-4 w-4 mr-1" />
                        Phone Number
                      </label>
                      <Field
                        name="phone"
                        type="tel"
                        maxLength="10"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="10-digit phone"
                      />
                      <ErrorMessage
                        name="phone"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="inline h-4 w-4 mr-1" />
                        Email
                      </label>
                      <Field
                        name="email"
                        type="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Email address"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <Field
                        name="dob"
                        type="date"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <ErrorMessage
                        name="dob"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="max-w-xs">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <Field
                      as="select"
                      name="gender"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Field>
                    <ErrorMessage
                      name="gender"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      Address Information
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <Field
                        name="address"
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter full address"
                      />
                      <ErrorMessage
                        name="address"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <Field
                          name="city"
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="City"
                        />
                        <ErrorMessage
                          name="city"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <Field
                          name="state"
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="State"
                        />
                        <ErrorMessage
                          name="state"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pincode
                        </label>
                        <Field
                          name="pincode"
                          type="text"
                          maxLength="6"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="6-digit pincode"
                        />
                        <ErrorMessage
                          name="pincode"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Personal Info
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    );
  };

  // Professional Info Section
  const ProfessionalInfoSection = () => (
    <Formik
      enableReinitialize={true}
      initialValues={{
        medicalLicenseNumber:
          fetchData?.professionalInfo?.medicalLicenseNumber || "",
        yearOfExp: fetchData?.professionalInfo?.yearOfExp || "",
        specialization: fetchData?.professionalInfo?.specialization || "",
        subSpeciality: fetchData?.professionalInfo?.subSpeciality || "",
        consultationFees: fetchData?.professionalInfo?.consultationFees || "",
        currentHospital: fetchData?.professionalInfo?.currentHospital || "",
        medicalCouncil: fetchData?.professionalInfo?.medicalCouncil || "",
        languageKnown: fetchData?.professionalInfo?.languageKnown || "",
      }}
      validationSchema={Yup.object({
        medicalLicenseNumber: Yup.string().required("Required"),
        yearOfExp: Yup.string().required("Required"),
        specialization: Yup.string().required("Required"),
        consultationFees: Yup.number()
          .required("Required")
          .positive("Must be positive"),
        currentHospital: Yup.string().required("Required"),
        medicalCouncil: Yup.string().required("Required"),
      })}
      onSubmit={async (values, actions) => {
        try {
          const response = await api.put(
            "/api/doctors/updateProfessionalInfo",
            values
          );
          setSuccessMsg("Professional information updated successfully!");
          setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err) {
          console.error(err);
        } finally {
          actions.setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-6">
              <div className="flex items-center gap-3">
                <Briefcase className="h-6 w-6 text-white" />
                <h2 className="text-2xl font-bold text-white">
                  Professional Information
                </h2>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical License Number
                  </label>
                  <Field
                    name="medicalLicenseNumber"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter license number"
                  />
                  <ErrorMessage
                    name="medicalLicenseNumber"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical Council
                  </label>
                  <Field
                    name="medicalCouncil"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., NMC"
                  />
                  <ErrorMessage
                    name="medicalCouncil"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <Field
                    as="select"
                    name="yearOfExp"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select experience</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-2">1-2 years</option>
                    <option value="2-5">2-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </Field>
                  <ErrorMessage
                    name="yearOfExp"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Hospital
                  </label>
                  <Field
                    name="currentHospital"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Hospital name"
                  />
                  <ErrorMessage
                    name="currentHospital"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization
                  </label>
                  <Field
                    name="specialization"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Cardiology"
                  />
                  <ErrorMessage
                    name="specialization"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub-Speciality
                  </label>
                  <Field
                    name="subSpeciality"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Sub-speciality (optional)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <IndianRupee className="inline h-4 w-4 mr-1" />
                    Consultation Fees (₹)
                  </label>
                  <Field
                    name="consultationFees"
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter fees"
                  />
                  <ErrorMessage
                    name="consultationFees"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages Known
                  </label>
                  <Field
                    name="languageKnown"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., English, Hindi"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Professional Info
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );

  // Education Section
  const EducationSection = () => (
    <Formik
      enableReinitialize={true}
      initialValues={{
        education:
          fetchData?.education?.length > 0
            ? fetchData.education
            : [{ schoolName: "", degreeName: "", completionYear: "" }],
      }}
      validationSchema={Yup.object({
        education: Yup.array()
          .of(
            Yup.object().shape({
              schoolName: Yup.string().required("Required"),
              degreeName: Yup.string().required("Required"),
              completionYear: Yup.number()
                .required("Required")
                .max(currentYear, "Year cannot be in future"),
            })
          )
          .min(1, "At least one education is required"),
      })}
      onSubmit={async (values, actions) => {
        try {
          const response = await api.put(
            "/api/doctors/updateEducation",
            values
          );
          setSuccessMsg("Education information updated successfully!");
          setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err) {
          console.error(err);
        } finally {
          actions.setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, values }) => (
        <Form>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-6">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-6 w-6 text-white" />
                <h2 className="text-2xl font-bold text-white">
                  Education & Qualifications
                </h2>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <FieldArray name="educations">
                {({ push, remove }) => (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-800">
                        Education Details
                      </h3>
                      <button
                        type="button"
                        onClick={() =>
                          push({
                            schoolName: "",
                            degreeName: "",
                            completionYear: "",
                          })
                        }
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        Add Education
                      </button>
                    </div>

                    {values.education.map((edu, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-xl p-6 space-y-4 border border-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-800">
                            Education {index + 1}
                          </h4>
                          {values.education.length > 1 && (
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
                              Degree Name
                            </label>
                            <Field
                              name={`education[${index}].degreeName`}
                              placeholder="e.g., MBBS, MD"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <ErrorMessage
                              name={`education[${index}].degreeName`}
                              component="p"
                              className="text-red-500 text-xs mt-1"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              School/University
                            </label>
                            <Field
                              name={`education[${index}].schoolName`}
                              placeholder="Institution name"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <ErrorMessage
                              name={`education[${index}].schoolName`}
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
                              name={`education[${index}].completionYear`}
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
                              name={`education[${index}].completionYear`}
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

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Education Info
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );

  // Clinic Info Section
  const ClinicInfoSection = () => (
    <Formik
      enableReinitialize={true}
      initialValues={{
        clinicName: fetchData?.clinicInfos?.clinicName || "",
        clinicType: fetchData?.clinicInfos?.clinicType || "",
        clinicPhone: fetchData?.clinicInfos?.clinicPhone || "",
        clinicEmail: fetchData?.clinicInfos?.clinicEmail || "",
        establishedYear: fetchData?.clinicInfos?.establishedYear || "",
        clinicAddress: fetchData?.clinicInfos?.clinicAddress || "",
        clinicCity: fetchData?.clinicInfos?.clinicCity || "",
        clinicState: fetchData?.clinicInfos?.clinicState || "",
        clinicPincode: fetchData?.clinicInfos?.clinicPincode || "",
        consultationDuration:
          fetchData?.clinicInfos?.consultationDuration || "",
        operatingHours: fetchData?.clinicInfos?.operatingHours || [
          {
            days: "MONDAY",
            open: "09:00",
            close: "17:00",
            isClosedToday: false,
          },
          {
            days: "TUESDAY",
            open: "09:00",
            close: "17:00",
            isClosedToday: false,
          },
          {
            days: "WEDNESDAY",
            open: "09:00",
            close: "17:00",
            isClosedToday: false,
          },
          {
            days: "THURSDAY",
            open: "09:00",
            close: "17:00",
            isClosedToday: false,
          },
          {
            days: "FRIDAY",
            open: "09:00",
            close: "17:00",
            isClosedToday: false,
          },
          {
            days: "SATURDAY",
            open: "09:00",
            close: "14:00",
            isClosedToday: false,
          },
          {
            days: "SUNDAY",
            open: "10:00",
            close: "16:00",
            isClosedToday: true,
          },
        ],
      }}
      validationSchema={Yup.object({
        clinicName: Yup.string().required("Required"),
        clinicType: Yup.string().required("Required"),
        clinicPhone: Yup.string()
          .required("Required")
          .matches(/^\d{10}$/, "Phone must be 10 digits"),
        clinicEmail: Yup.string().email("Invalid email").required("Required"),
        establishedYear: Yup.number()
          .required("Required")
          .max(currentYear, "Year cannot be in future"),
        clinicAddress: Yup.string().required("Required"),
        clinicCity: Yup.string().required("Required"),
        clinicState: Yup.string().required("Required"),
        clinicPincode: Yup.string()
          .required("Required")
          .matches(/^\d{6}$/, "Pincode must be 6 digits"),
        consultationDuration: Yup.number().required("Required").positive(),
      })}
      onSubmit={async (values, actions) => {
        try {
          const response = await api.put(
            "/api/doctors/updateClinicInfo",
            values
          );
          setSuccessMsg("Clinic information updated successfully!");
          setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err) {
          console.error(err);
        } finally {
          actions.setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-6">
              <div className="flex items-center gap-3">
                <Building className="h-6 w-6 text-white" />
                <h2 className="text-2xl font-bold text-white">
                  Clinic Information
                </h2>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* Basic Clinic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clinic Name
                  </label>
                  <Field
                    name="clinicName"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter clinic name"
                  />
                  <ErrorMessage
                    name="clinicName"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clinic Type
                  </label>
                  <Field
                    as="select"
                    name="clinicType"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select type</option>
                    <option value="General Clinic">General Clinic</option>
                    <option value="Specialty Clinic">Specialty Clinic</option>
                    <option value="Multi-Specialty Clinic">
                      Multi-Specialty Clinic
                    </option>
                    <option value="Hospital">Hospital</option>
                  </Field>
                  <ErrorMessage
                    name="clinicType"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Clinic Phone
                  </label>
                  <Field
                    name="clinicPhone"
                    type="tel"
                    maxLength="10"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="10-digit phone"
                  />
                  <ErrorMessage
                    name="clinicPhone"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Clinic Email
                  </label>
                  <Field
                    name="clinicEmail"
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="clinic@example.com"
                  />
                  <ErrorMessage
                    name="clinicEmail"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Established Year
                  </label>
                  <Field
                    as="select"
                    name="establishedYear"
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
                    name="establishedYear"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Clinic Address
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <Field
                    name="clinicAddress"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter clinic address"
                  />
                  <ErrorMessage
                    name="clinicAddress"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <Field
                      name="clinicCity"
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City"
                    />
                    <ErrorMessage
                      name="clinicCity"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <Field
                      name="clinicState"
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="State"
                    />
                    <ErrorMessage
                      name="clinicState"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode
                    </label>
                    <Field
                      name="clinicPincode"
                      type="text"
                      maxLength="6"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="6-digit pincode"
                    />
                    <ErrorMessage
                      name="clinicPincode"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Consultation Duration */}
              <div className="max-w-xs">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Consultation Duration (minutes)
                </label>
                <Field
                  name="consultationDuration"
                  type="number"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 30"
                />
                <ErrorMessage
                  name="consultationDuration"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* Operating Hours */}
              <div className="space-y-4 bg-gray-200 px-4 md:px-6 lg:md-8 py-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-800">
                    Operating Hours
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      setIsOperatingHoursExpanded(!isOperatingHoursExpanded)
                    }
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    {isOperatingHoursExpanded ? (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                        Collapse
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19l7-7-7-7"
                          />
                        </svg>
                        Expand
                      </>
                    )}
                  </button>
                </div>
                {isOperatingHoursExpanded && (
                  <FieldArray name="operatingHours">
                    {() => (
                      <div className="space-y-3">
                        {values.operatingHours.map((hour, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Day
                                </label>
                                <input
                                  type="text"
                                  value={hour.days}
                                  disabled
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Opening Time
                                </label>
                                <Field
                                  name={`operatingHours[${index}].open`}
                                  type="time"
                                  disabled={
                                    values.operatingHours[index].isClosedToday
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Closing Time
                                </label>
                                <Field
                                  name={`operatingHours[${index}].close`}
                                  type="time"
                                  disabled={
                                    values.operatingHours[index].isClosedToday
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                />
                              </div>

                              <div className="flex items-center gap-2">
                                <Field
                                  name={`operatingHours[${index}].isClosedToday`}
                                  type="checkbox"
                                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <label className="text-sm font-medium text-gray-700">
                                  Closed
                                </label>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldArray>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Clinic Info
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Success Message */}
        {successMsg && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 text-sm font-medium">{successMsg}</p>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
          <div className="block md:flex md:flex-wrap border-b border-gray-200">
            <button
              onClick={() => setActiveSection("personal")}
              className={`flex-1 min-w-fit px-6 py-4 text-sm font-medium transition-colors ${
                activeSection === "personal"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <User className="inline h-4 w-4 mr-2" />
              Personal Info
            </button>
            <button
              onClick={() => setActiveSection("professional")}
              className={`flex-1 min-w-fit px-6 py-4 text-sm font-medium transition-colors ${
                activeSection === "professional"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <Briefcase className="inline h-4 w-4 mr-2" />
              Professional Info
            </button>
            <button
              onClick={() => setActiveSection("education")}
              className={`flex-1 min-w-fit px-6 py-4 text-sm font-medium transition-colors ${
                activeSection === "education"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <GraduationCap className="inline h-4 w-4 mr-2" />
              Education
            </button>
            <button
              onClick={() => setActiveSection("clinic")}
              className={`flex-1 min-w-fit px-6 py-4 text-sm font-medium transition-colors ${
                activeSection === "clinic"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <Building className="inline h-4 w-4 mr-2" />
              Clinic Info
            </button>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {activeSection === "personal" && <PersonalInfoSection />}
          {activeSection === "professional" && <ProfessionalInfoSection />}
          {activeSection === "education" && <EducationSection />}
          {activeSection === "clinic" && <ClinicInfoSection />}
        </div>
      </div>
    </div>
  );
};

export default DoctorPersonalInfo;
