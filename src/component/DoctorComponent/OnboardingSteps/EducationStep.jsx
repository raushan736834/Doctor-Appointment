// import React from 'react';

// const EducationStep = ({ data, updateData }) => {
//   const handleInputChange = (field, value) => {
//     updateData({ [field]: value });
//   };

//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

//   return (
//     <div className="space-y-8">
//       <div className="text-center">
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">Education & Training</h2>
//         <p className="text-gray-600">Share your academic background and medical training</p>
//       </div>

//       <div className="space-y-8">
//         {/* Medical School */}
//         <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-6 rounded-lg border border-blue-100">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//             <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">1</div>
//             Medical School
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Medical School Name *
//               </label>
//               <input
//                 type="text"
//                 value={data.medicalSchool}
//                 onChange={(e) => handleInputChange('medicalSchool', e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 placeholder="Enter your medical school"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Graduation Year *
//               </label>
//               <select
//                 value={data.graduationYear}
//                 onChange={(e) => handleInputChange('graduationYear', e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 required
//               >
//                 <option value="">Select year</option>
//                 {years.map((year) => (
//                   <option key={year} value={year.toString()}>{year}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Residency */}
//         <div className="bg-gradient-to-r from-teal-50 to-green-50 p-6 rounded-lg border border-teal-100">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//             <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">2</div>
//             Residency Training
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Residency Program *
//               </label>
//               <input
//                 type="text"
//                 value={data.residency}
//                 onChange={(e) => handleInputChange('residency', e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
//                 placeholder="e.g., Internal Medicine at Johns Hopkins"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Completion Year *
//               </label>
//               <select
//                 value={data.residencyYear}
//                 onChange={(e) => handleInputChange('residencyYear', e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
//                 required
//               >
//                 <option value="">Select year</option>
//                 {years.map((year) => (
//                   <option key={year} value={year.toString()}>{year}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Fellowship */}
//         <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-100">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//             <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">3</div>
//             Fellowship Training <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span>
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Fellowship Program
//               </label>
//               <input
//                 type="text"
//                 value={data.fellowship}
//                 onChange={(e) => handleInputChange('fellowship', e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
//                 placeholder="e.g., Cardiology Fellowship at Mayo Clinic"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Completion Year
//               </label>
//               <select
//                 value={data.fellowshipYear}
//                 onChange={(e) => handleInputChange('fellowshipYear', e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
//               >
//                 <option value="">Select year</option>
//                 {years.map((year) => (
//                   <option key={year} value={year.toString()}>{year}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Additional Information */}
//       <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
//         <h3 className="text-lg font-semibold text-amber-900 mb-2">Verification Process</h3>
//         <p className="text-amber-800 text-sm">
//           Your educational credentials will be verified through primary source verification. 
//           This may include contacting your medical school and training programs directly. 
//           Please ensure all information is accurate to avoid delays in the verification process.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default EducationStep;


import React, { useState } from 'react';
import { Plus, X, GraduationCap, Award, Building, Clock, Stethoscope, Check, Star, Shield, BookOpen } from 'lucide-react';

const medicalSpecialties = [
  'Internal Medicine', 'Pediatrics', 'Surgery', 'Obstetrics & Gynecology', 'Psychiatry',
  'Radiology', 'Anesthesiology', 'Emergency Medicine', 'Family Medicine', 'Cardiology',
  'Dermatology', 'Neurology', 'Orthopedics', 'Ophthalmology', 'ENT', 'Urology',
  'Oncology', 'Gastroenterology', 'Pulmonology', 'Nephrology', 'Endocrinology',
  'Rheumatology', 'Pathology', 'General Practice', 'Other'
];

const boardCertifications = [
  'American Board of Internal Medicine', 'American Board of Pediatrics', 
  'American Board of Surgery', 'American Board of Family Medicine',
  'American Board of Psychiatry and Neurology', 'American Board of Radiology',
  'American Board of Anesthesiology', 'American Board of Emergency Medicine',
  'American Board of Obstetrics and Gynecology', 'Royal College of Physicians',
  'Medical Council of India', 'National Medical Commission (NMC)', 'Other International Board'
];

const EducationStep = ({ data = {}, updateData }) => {
  const [showAdditionalSpecializations, setShowAdditionalSpecializations] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleInputChange = (field, value) => {
    updateData({ [field]: value });
  };

  const handleSpecializationChange = (index, field, value) => {
    const specializations = data.additionalSpecializations || [];
    const updated = [...specializations];
    if (!updated[index]) {
      updated[index] = {};
    }
    updated[index][field] = value;
    updateData({ additionalSpecializations: updated });
  };

  const addSpecialization = () => {
    const specializations = data.additionalSpecializations || [];
    updateData({ 
      additionalSpecializations: [...specializations, { specialty: '', institution: '', year: '' }] 
    });
  };

  const removeSpecialization = (index) => {
    const specializations = data.additionalSpecializations || [];
    const updated = specializations.filter((_, i) => i !== index);
    updateData({ additionalSpecializations: updated });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 60 }, (_, i) => currentYear - i);

  const isFieldValid = (field) => {
    return data[field] && data[field].length > 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Modern Header */}
        <div className="text-center mb-8 sm:mb-12 relative">
          <div className="absolute -top-4 sm:-top-6 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          
          <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2 sm:mb-3 leading-tight">
            Medical Education & Credentials
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-medium px-2">Share your complete medical education background and qualifications</p>
          
          {/* Progress Indicator */}
          <div className="flex justify-center mt-4 sm:mt-6">
            <div className="flex space-x-1 sm:space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-200 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* Medical School */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl sm:shadow-2xl border border-white/20">
            <div className="flex items-center mb-6 sm:mb-8">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
                <span className="text-sm sm:text-lg font-bold">1</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-2xl font-bold text-slate-900">Medical School Education</h3>
                <p className="text-slate-600 text-sm sm:text-base mt-1">Your primary medical degree information</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                  <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                  Medical School Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={data.medicalSchool || ''}
                    onChange={(e) => handleInputChange('medicalSchool', e.target.value)}
                    onFocus={() => setFocusedField('medicalSchool')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                      focusedField === 'medicalSchool' 
                        ? 'border-blue-400 ring-2 sm:ring-4 ring-blue-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                        : isFieldValid('medicalSchool')
                        ? 'border-green-300 shadow-md'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    placeholder="e.g., Harvard Medical School, AIIMS New Delhi"
                    required
                  />
                  {isFieldValid('medicalSchool') && (
                    <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  )}
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                  <Award className="w-4 h-4 mr-2 text-purple-500" />
                  Degree Type *
                </label>
                <div className="relative">
                  <select
                    value={data.medicalDegree || ''}
                    onChange={(e) => handleInputChange('medicalDegree', e.target.value)}
                    onFocus={() => setFocusedField('medicalDegree')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none text-base ${
                      focusedField === 'medicalDegree' 
                        ? 'border-purple-400 ring-2 sm:ring-4 ring-purple-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                        : isFieldValid('medicalDegree')
                        ? 'border-green-300 shadow-md'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    required
                  >
                    <option value="">Select degree</option>
                    <option value="MD">MD (Doctor of Medicine)</option>
                    <option value="MBBS">MBBS (Bachelor of Medicine, Bachelor of Surgery)</option>
                    <option value="DO">DO (Doctor of Osteopathic Medicine)</option>
                    <option value="Other">Other Medical Degree</option>
                  </select>
                  {isFieldValid('medicalDegree') && (
                    <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  )}
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                  <Clock className="w-4 h-4 mr-2 text-orange-500" />
                  Graduation Year *
                </label>
                <div className="relative">
                  <select
                    value={data.medicalGraduationYear || ''}
                    onChange={(e) => handleInputChange('medicalGraduationYear', e.target.value)}
                    onFocus={() => setFocusedField('medicalGraduationYear')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none text-base ${
                      focusedField === 'medicalGraduationYear' 
                        ? 'border-orange-400 ring-2 sm:ring-4 ring-orange-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                        : isFieldValid('medicalGraduationYear')
                        ? 'border-green-300 shadow-md'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    required
                  >
                    <option value="">Select year</option>
                    {years.map((year) => (
                      <option key={year} value={year.toString()}>{year}</option>
                    ))}
                  </select>
                  {isFieldValid('medicalGraduationYear') && (
                    <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Residency */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl sm:shadow-2xl border border-white/20">
            <div className="flex items-center mb-6 sm:mb-8">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
                <span className="text-sm sm:text-lg font-bold">2</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-2xl font-bold text-slate-900">Residency Training</h3>
                <p className="text-slate-600 text-sm sm:text-base mt-1">Your specialized medical training program</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
              <div>
                <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                  <Stethoscope className="w-4 h-4 mr-2 text-teal-500" />
                  Primary Specialty *
                </label>
                <div className="relative">
                  <select
                    value={data.primarySpecialty || ''}
                    onChange={(e) => handleInputChange('primarySpecialty', e.target.value)}
                    onFocus={() => setFocusedField('primarySpecialty')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none text-base ${
                      focusedField === 'primarySpecialty' 
                        ? 'border-teal-400 ring-2 sm:ring-4 ring-teal-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                        : isFieldValid('primarySpecialty')
                        ? 'border-green-300 shadow-md'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    required
                  >
                    <option value="">Select specialty</option>
                    {medicalSpecialties.map((specialty) => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                  {isFieldValid('primarySpecialty') && (
                    <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  )}
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                  <Building className="w-4 h-4 mr-2 text-indigo-500" />
                  Residency Institution *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={data.residencyInstitution || ''}
                    onChange={(e) => handleInputChange('residencyInstitution', e.target.value)}
                    onFocus={() => setFocusedField('residencyInstitution')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                      focusedField === 'residencyInstitution' 
                        ? 'border-indigo-400 ring-2 sm:ring-4 ring-indigo-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                        : isFieldValid('residencyInstitution')
                        ? 'border-green-300 shadow-md'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    placeholder="e.g., Johns Hopkins Hospital, AIIMS New Delhi"
                    required
                  />
                  {isFieldValid('residencyInstitution') && (
                    <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  )}
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                  <Clock className="w-4 h-4 mr-2 text-cyan-500" />
                  Completion Year *
                </label>
                <div className="relative">
                  <select
                    value={data.residencyYear || ''}
                    onChange={(e) => handleInputChange('residencyYear', e.target.value)}
                    onFocus={() => setFocusedField('residencyYear')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none text-base ${
                      focusedField === 'residencyYear' 
                        ? 'border-cyan-400 ring-2 sm:ring-4 ring-cyan-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                        : isFieldValid('residencyYear')
                        ? 'border-green-300 shadow-md'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    required
                  >
                    <option value="">Select year</option>
                    {years.map((year) => (
                      <option key={year} value={year.toString()}>{year}</option>
                    ))}
                  </select>
                  {isFieldValid('residencyYear') && (
                    <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  )}
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                  <Star className="w-4 h-4 mr-2 text-amber-500" />
                  Years of Experience *
                </label>
                <div className="relative">
                  <select
                    value={data.yearsOfExperience || ''}
                    onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                    onFocus={() => setFocusedField('yearsOfExperience')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none text-base ${
                      focusedField === 'yearsOfExperience' 
                        ? 'border-amber-400 ring-2 sm:ring-4 ring-amber-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                        : isFieldValid('yearsOfExperience')
                        ? 'border-green-300 shadow-md'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    required
                  >
                    <option value="">Select experience</option>
                    <option value="0-2">0-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="11-15">11-15 years</option>
                    <option value="16-20">16-20 years</option>
                    <option value="20+">20+ years</option>
                  </select>
                  {isFieldValid('yearsOfExperience') && (
                    <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Fellowship/Subspecialty */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl sm:shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
                  <span className="text-sm sm:text-lg font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-2xl font-bold text-slate-900">Fellowship Training</h3>
                  <p className="text-slate-600 text-sm sm:text-base mt-1">Subspecialty training (if applicable)</p>
                </div>
              </div>
              <span className="px-2 sm:px-3 py-1 bg-slate-100 text-slate-600 text-xs sm:text-sm rounded-full font-medium">Optional</span>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
              <div>
                <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                  <Star className="w-4 h-4 mr-2 text-emerald-500" />
                  Fellowship Specialty
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={data.fellowshipSpecialty || ''}
                    onChange={(e) => handleInputChange('fellowshipSpecialty', e.target.value)}
                    onFocus={() => setFocusedField('fellowshipSpecialty')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                      focusedField === 'fellowshipSpecialty' 
                        ? 'border-emerald-400 ring-2 sm:ring-4 ring-emerald-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                        : isFieldValid('fellowshipSpecialty')
                        ? 'border-green-300 shadow-md'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    placeholder="e.g., Interventional Cardiology, Pediatric Surgery"
                  />
                  {isFieldValid('fellowshipSpecialty') && (
                    <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  )}
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                  <Building className="w-4 h-4 mr-2 text-rose-500" />
                  Fellowship Institution
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={data.fellowshipInstitution || ''}
                    onChange={(e) => handleInputChange('fellowshipInstitution', e.target.value)}
                    onFocus={() => setFocusedField('fellowshipInstitution')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                      focusedField === 'fellowshipInstitution' 
                        ? 'border-rose-400 ring-2 sm:ring-4 ring-rose-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                        : isFieldValid('fellowshipInstitution')
                        ? 'border-green-300 shadow-md'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    placeholder="Institution name"
                  />
                  {isFieldValid('fellowshipInstitution') && (
                    <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  )}
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                  <Clock className="w-4 h-4 mr-2 text-violet-500" />
                  Completion Year
                </label>
                <div className="relative">
                  <select
                    value={data.fellowshipYear || ''}
                    onChange={(e) => handleInputChange('fellowshipYear', e.target.value)}
                    onFocus={() => setFocusedField('fellowshipYear')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none text-base ${
                      focusedField === 'fellowshipYear' 
                        ? 'border-violet-400 ring-2 sm:ring-4 ring-violet-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                        : isFieldValid('fellowshipYear')
                        ? 'border-green-300 shadow-md'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <option value="">Select year</option>
                    {years.map((year) => (
                      <option key={year} value={year.toString()}>{year}</option>
                    ))}
                  </select>
                  {isFieldValid('fellowshipYear') && (
                    <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  )}
                </div>
              </div>
            </div>

            {/* Additional Specializations */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base sm:text-lg font-semibold text-slate-900">Additional Specializations</h4>
                <button
                  type="button"
                  onClick={() => setShowAdditionalSpecializations(!showAdditionalSpecializations)}
                  className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center transition-colors"
                >
                  {showAdditionalSpecializations ? 'Hide' : 'Add More'} 
                  <svg className={`w-4 h-4 ml-1 transition-transform ${showAdditionalSpecializations ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {showAdditionalSpecializations && (
                <div className="space-y-4">
                  {(data.additionalSpecializations || []).map((spec, index) => (
                    <div key={index} className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 relative">
                      <button
                        onClick={() => removeSpecialization(index)}
                        className="absolute top-3 right-3 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          value={spec.specialty || ''}
                          onChange={(e) => handleSpecializationChange(index, 'specialty', e.target.value)}
                          className="px-3 py-2 border border-emerald-200 rounded-lg focus:ring-1 focus:ring-emerald-500 text-sm bg-white"
                          placeholder="Specialty name"
                        />
                        <input
                          type="text"
                          value={spec.institution || ''}
                          onChange={(e) => handleSpecializationChange(index, 'institution', e.target.value)}
                          className="px-3 py-2 border border-emerald-200 rounded-lg focus:ring-1 focus:ring-emerald-500 text-sm bg-white"
                          placeholder="Institution"
                        />
                        <select
                          value={spec.year || ''}
                          onChange={(e) => handleSpecializationChange(index, 'year', e.target.value)}
                          className="px-3 py-2 border border-emerald-200 rounded-lg focus:ring-1 focus:ring-emerald-500 text-sm bg-white"
                        >
                          <option value="">Year</option>
                          {years.slice(0, 30).map((year) => (
                            <option key={year} value={year.toString()}>{year}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addSpecialization}
                    className="w-full py-3 border-2 border-dashed border-emerald-300 text-emerald-600 rounded-2xl hover:border-emerald-400 hover:text-emerald-700 transition-colors flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Another Specialization
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Board Certifications & Licenses */}
          {/* <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Board Certifications & Medical License</h3>
                <p className="text-gray-600 mt-1">Professional certifications and licensing information</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Board Certification *
                </label>
                <select
                  value={data.boardCertification || ''}
                  onChange={(e) => handleInputChange('boardCertification', e.target.value)}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                  required
                >
                  <option value="">Select certification</option>
                  {boardCertifications.map((cert) => (
                    <option key={cert} value={cert}>{cert}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Medical License Number *
                </label>
                <input
                  type="text"
                  value={data.medicalLicense || ''}
                  onChange={(e) => handleInputChange('medicalLicense', e.target.value)}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                  placeholder="Enter license number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  License Issuing State/Country *
                </label>
                <input
                  type="text"
                  value={data.licenseState || ''}
                  onChange={(e) => handleInputChange('licenseState', e.target.value)}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                  placeholder="e.g., California, Maharashtra, India"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  License Expiry Date *
                </label>
                <input
                  type="date"
                  value={data.licenseExpiry || ''}
                  onChange={(e) => handleInputChange('licenseExpiry', e.target.value)}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                  required
                />
              </div>
            </div>
          </div> */}

          {/* Verification & Compliance */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-8 shadow-lg">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center mr-6 flex-shrink-0 shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-amber-900 mb-3">Credential Verification Process</h3>
                <div className="text-amber-800 text-sm leading-relaxed space-y-2">
                  <p className="font-medium">📋 <strong>What happens next:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Primary source verification of your medical degree and training</li>
                    <li>Verification of board certifications and medical license status</li>
                    <li>Background check and malpractice insurance verification</li>
                    <li>Review by our medical credentialing committee</li>
                  </ul>
                  <p className="font-medium mt-4">⏱️ <strong>Timeline:</strong> Verification typically takes 5-10 business days</p>
                  <p className="font-medium">✅ <strong>Important:</strong> Ensure all information is accurate to avoid verification delays</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationStep;