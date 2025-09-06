import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, User, Briefcase, GraduationCap, Clock, FileText, Shield } from 'lucide-react';

import ProfessionalInfoStep from './OnboardingSteps/ProfessionalInfoStep';
import EducationStep from './OnboardingSteps/EducationStep';
import AvailabilityStep from './OnboardingSteps/AvailabilityStep';
import DocumentsStep from './OnboardingSteps/DocumentsStep';
import ReviewStep from './OnboardingSteps/ReviewStep';
import PersonalInfoStep from './OnboardingSteps/PersonalInfoStep';

const steps = [
  { id: 1, title: 'Personal Info', icon: User, description: 'Basic information' },
  { id: 2, title: 'Professional', icon: Briefcase, description: 'Medical credentials' },
  { id: 3, title: 'Education', icon: GraduationCap, description: 'Academic background' },
  { id: 4, title: 'Clinic Info', icon: Clock, description: 'Clinic preferences' },
  { id: 5, title: 'Documents', icon: FileText, description: 'Upload certificates' },
  { id: 6, title: 'Review', icon: Shield, description: 'Final review' },
];

const DoctorOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [doctorData, setDoctorData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      profilePhoto: '',
    },
    professionalInfo: {
      licenseNumber: '',
      specialization: '',
      subSpecialty: '',
      yearsOfExperience: '',
      currentHospital: '',
      boardCertifications: [],
    },
    education: {
      medicalSchool: '',
      graduationYear: '',
      residency: '',
      residencyYear: '',
      fellowship: '',
      fellowshipYear: '',
    },
    availability: {
      workingDays: [],
      startTime: '',
      endTime: '',
      consultationDuration: '',
      timeZone: '',
    },
    documents: {},
    agreements: {
      termsAccepted: false,
      privacyAccepted: false,
      backgroundCheck: false,
    },
  });

  const updateDoctorData = (section, data) => {
    setDoctorData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep data={doctorData.personalInfo} updateData={(data) => updateDoctorData('personalInfo', data)} />;
      case 2:
        return <ProfessionalInfoStep data={doctorData.professionalInfo} updateData={(data) => updateDoctorData('professionalInfo', data)} />;
      case 3:
        return <EducationStep data={doctorData.education} updateData={(data) => updateDoctorData('education', data)} />;
      case 4:
        return <AvailabilityStep data={doctorData.availability} updateData={(data) => updateDoctorData('availability', data)} />;
      case 5:
        return <DocumentsStep data={doctorData.documents} updateData={(data) => updateDoctorData('documents', data)} />;
      case 6:
        return <ReviewStep doctorData={doctorData} updateData={updateDoctorData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to HeyDoctor</h1>
          <p className="text-xl text-gray-600">Join our network of healthcare professionals</p>
        </div>

        {/* Progress Steps - Mobile View */}
        <div className="mb-8 block sm:hidden">
          <div className="flex justify-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-3">
                {/* {currentStep > 1 && (
                  <span className="text-sm text-gray-500">Step {currentStep - 1}</span>
                )} */}
                <button
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-600 text-white shadow-lg scale-110"
                >
                  {steps[currentStep - 1].icon && React.createElement(steps[currentStep - 1].icon, { className: "w-6 h-6" })}
                </button>
                {/* {currentStep < steps.length && (
                  <span className="text-sm text-gray-500">Step {currentStep + 1}</span>
                )} */}
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
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>
            
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center group">
                <button
                  onClick={() => goToStep(step.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep === step.id
                      ? 'bg-blue-600 text-white shadow-lg scale-110'
                      : currentStep > step.id
                      ? 'bg-green-500 text-white shadow-md hover:scale-105'
                      : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </button>
                <div className="mt-2 text-center">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
                  }`}>
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
          <div className="p-8">
            {renderStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="px-8 py-6 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <div className="flex justify-between items-center">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center px-3 sm:px-6 py-3 rounded-lg font-medium transition-all duration-200  ${
                  currentStep === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-white hover:bg-blue-700 bg-blue-600'
                }`}
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                <span className='hidden sm:block'>Previous</span>
              </button>

              <div className="text-sm text-gray-500">
                Step {currentStep} of {steps.length}
              </div>

              {currentStep === steps.length ? (
                <button
                  onClick={() => {
                    alert('Application submitted successfully!');
                  }}
                  className="flex items-center px-3 sm:px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <span className='hidden sm:block'>Submit Application</span>
                  <Check className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="flex items-center px-3 sm:px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <span className='hidden sm:block'>Next</span>
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
