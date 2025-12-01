import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  User,
  Briefcase,
  GraduationCap,
  Clock,
  FileText,
  Shield,
} from "lucide-react";
import { useApiService } from "../../hooks/useAuthWithAxios";
import { useNavigate } from "react-router-dom";
import PersonalInfoStep from "./OnboardingSteps/PersonalInfoStep";
import ProfessionalInfoStep from "./OnboardingSteps/ProfessionalInfoStep";
import EducationStep from "./OnboardingSteps/EducationStep";
import AvailabilityStep from "./OnboardingSteps/AvailabilityStep";
import DocumentsStep from "./OnboardingSteps/DocumentsStep";
import ReviewStep from "./OnboardingSteps/ReviewStep";

const steps = [
  {
    id: 1,
    title: "Personal Info",
    icon: User,
    description: "Basic information",
  },
  {
    id: 2,
    title: "Professional",
    icon: Briefcase,
    description: "Medical credentials",
  },
  {
    id: 3,
    title: "Education",
    icon: GraduationCap,
    description: "Academic background",
  },
  {
    id: 4,
    title: "Clinic Info",
    icon: Clock,
    description: "Clinic preferences",
  },
  {
    id: 5,
    title: "Documents",
    icon: FileText,
    description: "Upload certificates",
  },
  { id: 6, title: "Review", icon: Shield, description: "Final review" },
];

const DoctorOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [doctorData, setDoctorData] = useState({});
  const [reviewValidation, setReviewValidation] = useState({
    allAgreementsAccepted: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const api = useApiService();
  const navigate = useNavigate();

  const updateDoctorData = (section, data) => {
    setDoctorData((prev) => {
      if (data === null || data === undefined) {
        return prev;
      }

      // If data signals skip without payload, keep existing section untouched
      if (
        typeof data === "object" &&
        !Array.isArray(data) &&
        Object.keys(data).length === 1 &&
        data.__skipApi
      ) {
        return prev;
      }

      let nextSectionValue;

      if (Array.isArray(data)) {
        nextSectionValue = data;
      } else if (Array.isArray(data?.doctorEducation)) {
        nextSectionValue = data.doctorEducation;
      } else if (Array.isArray(prev[section])) {
        // Preserve array type when existing section is an array
        nextSectionValue = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
          ? data.items
          : prev[section];
      } else {
        nextSectionValue = {
          ...(prev[section] || {}),
          ...data,
        };
      }

      return {
        ...prev,
        [section]: nextSectionValue,
      };
    });
  };

  useEffect(() => {
    fetchDoctorData();
  }, []);

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

        setDoctorData(normalized);
      } else {
        setDoctorData({});
      }
    } catch (error) {
      console.error("Error fetching doctor data:", error);
      setDoctorData({});
    }
  };

  const handleStepSubmit = async (stepData) => {
    const getCurrentSectionKey = (step) => {
      switch (step) {
        case 1:
          return "personalInfo";
        case 2:
          return "professionalInfo";
        case 3:
          return "education";
        case 4:
          return "clinicInfos";
        case 5:
          return "documents";
        case 6:
          return "review";
        default:
          return "";
      }
    };

    try {
      // If child indicated to skip API (no changes), update state and advance
      if (stepData && stepData.__skipApi) {
        // Still update the local state to ensure consistency
        const sectionKey = getCurrentSectionKey(currentStep);
        if (sectionKey) {
          updateDoctorData(sectionKey, stepData);
        }
        setCurrentStep((s) => s + 1);
        return;
      }

      let endpoint = "";
      let requestData;
      let sectionKey = "";

      switch (currentStep) {
        case 1:
          endpoint = "api/doctors/personalDetails";
          sectionKey = "personalInfo";
          // For personal info step, handle multipart form data
          requestData = new FormData();
          // Create a copy of stepData without the profilePhoto
          const doctorObj = { ...stepData };
          delete doctorObj.profilePhoto;
          // Append the doctor data as JSON string
          requestData.append("doctor", JSON.stringify(doctorObj));

          // Append the profile image if exists
          if (stepData.profilePhoto instanceof File) {
            requestData.append("profileImage", stepData.profilePhoto);
          }
          break;
        case 2:
          endpoint = "api/doctors/professional";
          sectionKey = "professionalInfo";
          requestData = stepData;
          break;
        case 3:
          endpoint = "api/doctors/education";
          sectionKey = "education";
          requestData =
            stepData && Array.isArray(stepData.doctorEducation)
              ? stepData.doctorEducation
              : Array.isArray(stepData)
              ? stepData
              : stepData?.doctorEducation || stepData;
          break;
        case 4:
          endpoint = "api/doctors/clinicInfo";
          sectionKey = "clinicInfos";
          requestData = stepData;
          break;
        case 5:
          endpoint = "api/doctors/documents";
          sectionKey = "documents";

          requestData = new FormData();

          // Explicit keys expected by backend
          const requiredDocs = [
            "medicalLicense",
            "boardCertificate",
            "malpracticeInsurance",
          ];
          const optionalDocs = ["cv"];

          // Append required docs (even if missing, send empty placeholder)
          requiredDocs.forEach((key) => {
            const file = stepData[key];
            if (file instanceof File) {
              requestData.append(key, file, key);
            } else {
              // send empty placeholder to prevent MissingServletRequestPartException
              requestData.append(key, new Blob([]), "");
            }
          });

          // Append optional docs only if present
          optionalDocs.forEach((key) => {
            const file = stepData[key];
            if (file instanceof File) {
              requestData.append(key, file, key);
            }
          });
          break;
        case 6:
          endpoint = "api/doctors/review";
          sectionKey = "review";
        default:
          break;
      }

      if (endpoint) {
        const config =
          currentStep === 1 || currentStep === 5
            ? {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Accept: "application/json",
                },
              }
            : {};
        let response = null;
        if (currentStep === 6) {
          response = await api.get(endpoint, config);
        } else {
          response = await api.put(endpoint, requestData, config);
        }

        if (response.success) {
          // Update the doctor data in state with the correct section key
          // Education step returns an array under `doctorEducation` -> store it as an array
          if (sectionKey === "education") {
            // If stepData contains doctorEducation array, use it; otherwise fall back to stepData
            const edu =
              stepData && stepData.doctorEducation
                ? stepData.doctorEducation
                : stepData;
            setDoctorData((prev) => ({ ...prev, education: edu }));
          } else {
            updateDoctorData(sectionKey, stepData);
          }

          // Move to next step
          setCurrentStep(currentStep + 1);
        } else {
          console.error("Failed to submit data:", response);
          // You might want to show an error message to the user here
          throw new Error("Failed to submit data");
        }
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const nextStep = () => {
    // Find and trigger form submission
    const currentForm = document.querySelector("form");
    if (currentForm) {
      // Create and dispatch a submit event
      const submitEvent = new Event("submit", {
        cancelable: true,
        bubbles: true,
      });
      currentForm.dispatchEvent(submitEvent);
    } else {
      // If no form is found, move to next step directly
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const navigateToStep = (stepNumber) => {
    if (stepNumber >= 1 && stepNumber <= steps.length) {
      setCurrentStep(stepNumber);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            data={doctorData.personalInfo}
            updateData={(data) => updateDoctorData("personalInfo", data)}
            onSubmit={handleStepSubmit}
          />
        );
      case 2:
        return (
          <ProfessionalInfoStep
            data={doctorData.professionalInfo}
            updateData={(data) => updateDoctorData("professionalInfo", data)}
            onSubmit={handleStepSubmit}
          />
        );
      case 3:
        return (
          <EducationStep
            key={currentStep}
            data={doctorData.education}
            updateData={(data) => updateDoctorData("education", data)}
            onSubmit={handleStepSubmit}
          />
        );
      case 4:
        return (
          <AvailabilityStep
            data={doctorData.clinicInfos}
            updateData={(data) => updateDoctorData("availability", data)}
            onSubmit={handleStepSubmit}
          />
        );
      case 5:
        return (
          <DocumentsStep
            key={currentStep}
            data={doctorData.documents}
            updateData={(data) => updateDoctorData("documents", data)}
            onSubmit={handleStepSubmit}
          />
        );

      case 6:
        return (
          <ReviewStep
            doctorData={doctorData}
            updateData={updateDoctorData}
            onNavigateToStep={navigateToStep}
            onValidationChange={setReviewValidation}
          />
        );
      default:
        return null;
    }
  };

  // Check if all agreements are accepted and required documents are uploaded
  const requiredDocuments = [
    { key: "medicalLicense", label: "Medical License" },
    { key: "boardCertificate", label: "Board Certificate" },
    { key: "malpracticeInsurance", label: "Malpractice Insurance" },
  ];

  const allRequiredDocsUploaded = requiredDocuments.every(
    (doc) => doctorData.documents && doctorData.documents[doc.key]
  );

  // Use reviewValidation state from ReviewStep instead of doctorData.agreements
  const canSubmitApplication = reviewValidation.allAgreementsAccepted;

  const handleSubmitApplication = async () => {
    if (!canSubmitApplication) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Submit the application using GET request to review endpoint
      const response = await api.get("api/doctors/review");

      if (response.success) {
        // Update doctor data with the response if needed
        if (response.data) {
          updateDoctorData("review", response.data);
        }

        // Show success message
       navigate("/doctor/afterReview",{ state : {doctor : doctorData}});

        // Refresh doctor data to get updated status
        await fetchDoctorData();
      } else {
        setSubmitError(
          response.error || "Failed to submit application. Please try again."
        );
        console.error("Failed to submit application:", response);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "An error occurred while submitting your application. Please try again.";
      setSubmitError(errorMessage);
      console.error("Error submitting application:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to HeyDoctor
          </h1>
          <p className="text-xl text-gray-600">
            Join our network of healthcare professionals
          </p>
        </div>

        {/* Progress Steps - Mobile View */}
        <div className="mb-8 block sm:hidden">
          <div className="flex justify-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-600 text-white shadow-lg scale-110">
                  {steps[currentStep - 1].icon &&
                    React.createElement(steps[currentStep - 1].icon, {
                      className: "w-6 h-6",
                    })}
                </div>
              </div>
              <div className="mt-3 text-center">
                <p className="text-lg font-medium text-gray-900">
                  {steps[currentStep - 1].title}
                </p>
                <p className="text-sm text-gray-600">
                  {steps[currentStep - 1].description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps - Desktop View */}
        <div className="mb-8 hidden sm:block">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
              <div
                className="h-full bg-blue-600 transition-all duration-500 ease-out"
                style={{
                  width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>

            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center group">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep === step.id
                      ? "bg-blue-600 text-white shadow-lg scale-110"
                      : currentStep > step.id
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step.id ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-8">{renderStep()}</div>

          {/* Navigation Buttons */}
          <div className="px-8 py-6 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <div className="flex justify-between items-center">
              {/* Show Previous button only if not on review step */}
              {currentStep !== steps.length ? (
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center px-3 sm:px-6 py-3 rounded-lg font-medium transition-all duration-200  ${
                    currentStep === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-white hover:bg-blue-700 bg-blue-600"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  <span className="hidden sm:block">Previous</span>
                </button>
              ) : (
                <div></div> // Empty div to maintain layout spacing
              )}

              <div className="text-sm text-gray-500">
                Step {currentStep} of {steps.length}
              </div>

              {currentStep === steps.length ? (
                <div className="flex flex-col items-end">
                  <button
                    type="button"
                    onClick={handleSubmitApplication}
                    disabled={!canSubmitApplication || isSubmitting}
                    className={`flex items-center px-3 sm:px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-md ${
                      canSubmitApplication && !isSubmitting
                        ? "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg cursor-pointer"
                        : "bg-gray-400 text-gray-200 cursor-not-allowed opacity-60"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="hidden sm:block">Submitting...</span>
                        <div className="w-5 h-5 ml-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:block">
                          Submit Application
                        </span>
                        <Check className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                  {submitError && (
                    <p className="text-red-600 text-xs mt-2 text-right max-w-xs">
                      {submitError}
                    </p>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center px-3 sm:px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <span className="hidden sm:block">Next</span>
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorOnboarding;
