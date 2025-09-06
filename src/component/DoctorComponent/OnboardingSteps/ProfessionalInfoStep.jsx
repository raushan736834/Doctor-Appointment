// import React, { useState } from 'react';
// import { Plus, X } from 'lucide-react';

// const specializations = [
//   'Family Medicine', 'Internal Medicine', 'Pediatrics', 'Cardiology', 'Dermatology',
//   'Emergency Medicine', 'Endocrinology', 'Gastroenterology', 'Neurology', 'Oncology',
//   'Orthopedics', 'Psychiatry', 'Radiology', 'Surgery', 'Urology', 'Gynecology',
//   'Ophthalmology', 'Otolaryngology', 'Anesthesiology', 'Pathology'
// ];

// const ProfessionalInfoStep = ({ data, updateData }) => {
//   const [newCertification, setNewCertification] = useState('');

//   const handleInputChange = (field, value) => {
//     updateData({ [field]: value });
//   };

//   const addCertification = () => {
//     if (newCertification.trim()) {
//       updateData({
//         boardCertifications: [...data.boardCertifications, newCertification.trim()]
//       });
//       setNewCertification('');
//     }
//   };

//   const removeCertification = (index) => {
//     updateData({
//       boardCertifications: data.boardCertifications.filter((_, i) => i !== index)
//     });
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       addCertification();
//     }
//   };

//   return (
//     <div className="space-y-8">
//       <div className="text-center">
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Information</h2>
//         <p className="text-gray-600">Tell us about your medical credentials and experience</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Medical License Number */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Medical License Number *
//           </label>
//           <input
//             type="text"
//             value={data.licenseNumber}
//             onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//             placeholder="Enter your license number"
//             required
//           />
//         </div>

//         {/* Years of Experience */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Years of Experience *
//           </label>
//           <select
//             value={data.yearsOfExperience}
//             onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//             required
//           >
//             <option value="">Select years</option>
//             <option value="1-2">1-2 years</option>
//             <option value="3-5">3-5 years</option>
//             <option value="6-10">6-10 years</option>
//             <option value="11-15">11-15 years</option>
//             <option value="16-20">16-20 years</option>
//             <option value="20+">20+ years</option>
//           </select>
//         </div>

//         {/* Specialization */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Primary Specialization *
//           </label>
//           <select
//             value={data.specialization}
//             onChange={(e) => handleInputChange('specialization', e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//             required
//           >
//             <option value="">Select specialization</option>
//             {specializations.map((spec) => (
//               <option key={spec} value={spec}>{spec}</option>
//             ))}
//           </select>
//         </div>

//         {/* Sub-specialty */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Sub-specialty
//           </label>
//           <input
//             type="text"
//             value={data.subSpecialty}
//             onChange={(e) => handleInputChange('subSpecialty', e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//             placeholder="e.g., Interventional Cardiology"
//           />
//         </div>

//         {/* Current Hospital/Practice */}
//         <div className="md:col-span-2">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Current Hospital/Practice *
//           </label>
//           <input
//             type="text"
//             value={data.currentHospital}
//             onChange={(e) => handleInputChange('currentHospital', e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//             placeholder="Enter your current workplace"
//             required
//           />
//         </div>

//         {/* Board Certifications */}
//         <div className="md:col-span-2">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Board Certifications
//           </label>
          
//           {/* Add new certification */}
//           <div className="flex gap-2 mb-4">
//             <input
//               type="text"
//               value={newCertification}
//               onChange={(e) => setNewCertification(e.target.value)}
//               onKeyPress={handleKeyPress}
//               className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//               placeholder="Add a board certification"
//             />
//             <button
//               type="button"
//               onClick={addCertification}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
//             >
//               <Plus className="w-5 h-5" />
//             </button>
//           </div>

//           {/* List of certifications */}
//           {data.boardCertifications.length > 0 ? (
//             <div className="space-y-2">
//               {data.boardCertifications.map((cert, index) => (
//                 <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border">
//                   <span className="text-gray-900">{cert}</span>
//                   <button
//                     type="button"
//                     onClick={() => removeCertification(index)}
//                     className="text-red-500 hover:text-red-700 transition-colors"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-500 text-sm italic">No certifications added yet</p>
//           )}
//         </div>
//       </div>

//       {/* Additional Information */}
//       <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
//         <h3 className="text-lg font-semibold text-blue-900 mb-2">Important Note</h3>
//         <p className="text-blue-800 text-sm">
//           All professional information will be verified as part of our credentialing process. 
//           Please ensure all details are accurate and up-to-date. You may be asked to provide 
//           supporting documentation in the next steps.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ProfessionalInfoStep;

import React, { useState } from 'react';
import { Plus, X, Briefcase, Award, Building, Clock, Stethoscope, Check, Star, Shield, GraduationCap } from 'lucide-react';

const specializations = [
  'Family Medicine', 'Internal Medicine', 'Pediatrics', 'Cardiology', 'Dermatology',
  'Emergency Medicine', 'Endocrinology', 'Gastroenterology', 'Neurology', 'Oncology',
  'Orthopedics', 'Psychiatry', 'Radiology', 'Surgery', 'Urology', 'Gynecology',
  'Ophthalmology', 'Otolaryngology', 'Anesthesiology', 'Pathology', 'Pulmonology',
  'Rheumatology', 'Infectious Disease', 'Nephrology', 'Critical Care Medicine'
];

const languages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Mandarin',
  'Hindi', 'Arabic', 'Japanese', 'Korean', 'Russian', 'Dutch', 'Swedish'
];

const ProfessionalInfoStep = ({ data = {}, updateData }) => {
  const [newCertification, setNewCertification] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const handleInputChange = (field, value) => {
    updateData({ [field]: value });
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      updateData({
        boardCertifications: [...(data.boardCertifications || []), newCertification.trim()]
      });
      setNewCertification('');
    }
  };

  const removeCertification = (index) => {
    updateData({
      boardCertifications: (data.boardCertifications || []).filter((_, i) => i !== index)
    });
  };

  const addLanguage = () => {
    if (newLanguage && !(data.languages || []).includes(newLanguage)) {
      updateData({
        languages: [...(data.languages || []), newLanguage]
      });
      setNewLanguage('');
    }
  };

  const removeLanguage = (index) => {
    updateData({
      languages: (data.languages || []).filter((_, i) => i !== index)
    });
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  const isFieldValid = (field) => {
    return data[field] && data[field].length > 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-100 p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Modern Header */}
        <div className="text-center mb-8 sm:mb-12 relative">
          <div className="absolute -top-4 sm:-top-6 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full animate-pulse"></div>
          
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          
          <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2 sm:mb-3 leading-tight">
            Professional Information
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-medium px-2">Share your medical credentials and expertise</p>
          
          {/* Progress Indicator */}
          <div className="flex justify-center mt-4 sm:mt-6">
            <div className="flex space-x-1 sm:space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-200 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl sm:shadow-2xl border border-white/20">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2">
            
            {/* Medical License Number */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                <Shield className="w-4 h-4 mr-2 text-blue-500" />
                Medical License Number *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={data.licenseNumber || ''}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  onFocus={() => setFocusedField('licenseNumber')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                    focusedField === 'licenseNumber' 
                      ? 'border-blue-400 ring-2 sm:ring-4 ring-blue-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                      : isFieldValid('licenseNumber')
                      ? 'border-green-300 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  placeholder="Enter your license number"
                  required
                />
                {isFieldValid('licenseNumber') && (
                  <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Years of Experience */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                <Clock className="w-4 h-4 mr-2 text-orange-500" />
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
                      ? 'border-orange-400 ring-2 sm:ring-4 ring-orange-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                      : isFieldValid('yearsOfExperience')
                      ? 'border-green-300 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  required
                >
                  <option value="">Select years</option>
                  <option value="0-1">Less than 1 year</option>
                  <option value="1-2">1-2 years</option>
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

            {/* Primary Specialization */}
            <div className="space-y-2 sm:col-span-2">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                <Stethoscope className="w-4 h-4 mr-2 text-purple-500" />
                Primary Specialization *
              </label>
              <div className="relative">
                <select
                  value={data.specialization || ''}
                  onChange={(e) => handleInputChange('specialization', e.target.value)}
                  onFocus={() => setFocusedField('specialization')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none text-base ${
                    focusedField === 'specialization' 
                      ? 'border-purple-400 ring-2 sm:ring-4 ring-purple-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                      : isFieldValid('specialization')
                      ? 'border-green-300 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  required
                >
                  <option value="">Select your primary specialization</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                {isFieldValid('specialization') && (
                  <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Sub-specialty */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                <Star className="w-4 h-4 mr-2 text-pink-500" />
                Sub-specialty
                <span className="text-xs text-slate-500 ml-1">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={data.subSpecialty || ''}
                  onChange={(e) => handleInputChange('subSpecialty', e.target.value)}
                  onFocus={() => setFocusedField('subSpecialty')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                    focusedField === 'subSpecialty' 
                      ? 'border-pink-400 ring-2 sm:ring-4 ring-pink-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                      : isFieldValid('subSpecialty')
                      ? 'border-green-300 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  placeholder="e.g., Interventional Cardiology"
                />
                {isFieldValid('subSpecialty') && (
                  <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Consultation Fee */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                <Award className="w-4 h-4 mr-2 text-green-500" />
                Consultation Fee (₹) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={data.consultationFee || ''}
                  onChange={(e) => handleInputChange('consultationFee', e.target.value)}
                  onFocus={() => setFocusedField('consultationFee')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                    focusedField === 'consultationFee' 
                      ? 'border-green-400 ring-2 sm:ring-4 ring-green-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                      : isFieldValid('consultationFee')
                      ? 'border-green-300 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  placeholder="500"
                  min="0"
                  required
                />
                {isFieldValid('consultationFee') && (
                  <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Current Hospital/Practice */}
            <div className="sm:col-span-2 space-y-2">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                <Building className="w-4 h-4 mr-2 text-indigo-500" />
                Current Hospital/Practice *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={data.currentHospital || ''}
                  onChange={(e) => handleInputChange('currentHospital', e.target.value)}
                  onFocus={() => setFocusedField('currentHospital')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                    focusedField === 'currentHospital' 
                      ? 'border-indigo-400 ring-2 sm:ring-4 ring-indigo-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                      : isFieldValid('currentHospital')
                      ? 'border-green-300 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  placeholder="Enter your current workplace"
                  required
                />
                {isFieldValid('currentHospital') && (
                  <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Medical Registration Council */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                <GraduationCap className="w-4 h-4 mr-2 text-teal-500" />
                Medical Council *
              </label>
              <div className="relative">
                <select
                  value={data.medicalCouncil || ''}
                  onChange={(e) => handleInputChange('medicalCouncil', e.target.value)}
                  onFocus={() => setFocusedField('medicalCouncil')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none text-base ${
                    focusedField === 'medicalCouncil' 
                      ? 'border-teal-400 ring-2 sm:ring-4 ring-teal-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                      : isFieldValid('medicalCouncil')
                      ? 'border-green-300 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  required
                >
                  <option value="">Select Medical Council</option>
                  <option value="MCI">Medical Council of India (MCI)</option>
                  <option value="NMC">National Medical Commission (NMC)</option>
                  <option value="State Medical Council">State Medical Council</option>
                  <option value="Other">Other</option>
                </select>
                {isFieldValid('medicalCouncil') && (
                  <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Bio/About */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                <Briefcase className="w-4 h-4 mr-2 text-cyan-500" />
                Professional Bio
                <span className="text-xs text-slate-500 ml-1">(Optional)</span>
              </label>
              <div className="relative">
                <textarea
                  value={data.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  onFocus={() => setFocusedField('bio')}
                  onBlur={() => setFocusedField(null)}
                  rows={3}
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base resize-none ${
                    focusedField === 'bio' 
                      ? 'border-cyan-400 ring-2 sm:ring-4 ring-cyan-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                      : isFieldValid('bio')
                      ? 'border-green-300 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  placeholder="Brief description about your expertise and approach to patient care"
                />
                {isFieldValid('bio') && (
                  <Check className="absolute right-3 sm:right-4 top-3 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Languages Spoken */}
            <div className="sm:col-span-2 space-y-4">
              <label className="flex items-center text-sm font-semibold text-slate-700">
                <Award className="w-4 h-4 mr-2 text-rose-500" />
                Languages Spoken
                <span className="text-xs text-slate-500 ml-1">(Optional)</span>
              </label>
              
              <div className="flex gap-2">
                <select
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  className="flex-1 px-1 py-3 sm:px-6 sm:py-4 border-2 border-slate-200 rounded-xl sm:rounded-2xl bg-white/50 backdrop-blur-sm text-base focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                >
                  <option value="">Select a language</option>
                  {languages.filter(lang => !(data.languages || []).includes(lang)).map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addLanguage}
                  disabled={!newLanguage}
                  className="px-3 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl sm:rounded-2xl hover:from-rose-600 hover:to-pink-700 transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  <Plus className="w-3 h-3 sm:w-5 sm:h-5" />
                </button>
              </div>

              {(data.languages || []).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {(data.languages || []).map((lang, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gradient-to-r from-rose-100 to-pink-100 px-3 py-2 rounded-xl border border-rose-200">
                      <span className="text-sm font-medium text-rose-700">{lang}</span>
                      <button
                        type="button"
                        onClick={() => removeLanguage(index)}
                        className="text-rose-500 hover:text-rose-700 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Board Certifications */}
            {/* <div className="sm:col-span-2 space-y-4">
              <label className="flex items-center text-sm font-semibold text-slate-700">
                <Award className="w-4 h-4 mr-2 text-amber-500" />
                Board Certifications
                <span className="text-xs text-slate-500 ml-1">(Optional)</span>
              </label>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, addCertification)}
                  className="flex-1 px-4 py-3 sm:px-6 sm:py-4 border-2 border-slate-200 rounded-xl sm:rounded-2xl bg-white/50 backdrop-blur-sm text-base focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                  placeholder="Add a board certification"
                />
                <button
                  type="button"
                  onClick={addCertification}
                  disabled={!newCertification.trim()}
                  className="px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl sm:rounded-2xl hover:from-amber-600 hover:to-orange-700 transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {(data.boardCertifications || []).length > 0 && (
                <div className="space-y-2">
                  {(data.boardCertifications || []).map((cert, index) => (
                    <div key={index} className="flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 rounded-xl border border-amber-200 shadow-sm">
                      <span className="text-amber-800 font-medium">{cert}</span>
                      <button
                        type="button"
                        onClick={() => removeCertification(index)}
                        className="text-amber-600 hover:text-amber-800 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div> */}
          </div>
        </div>

        {/* Important Note */}
        <div className="mt-6 sm:mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-blue-200 backdrop-blur-sm">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">Verification Process</h3>
              <p className="text-blue-800 text-sm sm:text-base">
                All professional information will be thoroughly verified as part of our credentialing process. 
                Please ensure all details are accurate and current. You may need to provide supporting 
                documentation in subsequent steps.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile spacing */}
        <div className="h-20 sm:h-8"></div>
      </div>
    </div>
  );
};

export default ProfessionalInfoStep;