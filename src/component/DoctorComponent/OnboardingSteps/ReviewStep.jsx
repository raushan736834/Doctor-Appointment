// // import React from 'react';
// // import { User, Briefcase, GraduationCap, Clock, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

// // const ReviewStep = ({ doctorData, updateData }) => {
// //   const handleAgreementChange = (field, value) => {
// //     updateData('agreements', { [field]: value });
// //   };

// //   const InfoSection = ({ icon: Icon, title, children, iconColor = 'text-blue-600' }) => (
// //     <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
// //       <div className="flex items-center mb-4">
// //         <Icon className={`w-6 h-6 ${iconColor} mr-3`} />
// //         <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
// //       </div>
// //       {children}
// //     </div>
// //   );

// //   const InfoRow = ({ label, value }) => (
// //     <div className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
// //       <span className="text-gray-600 font-medium">{label}:</span>
// //       <span className="text-gray-900">{value || 'Not provided'}</span>
// //     </div>
// //   );

// //   const requiredDocuments = [
// //     { key: 'medicalLicense', label: 'Medical License' },
// //     { key: 'boardCertificate', label: 'Board Certificate' },
// //     { key: 'malpracticeInsurance', label: 'Malpractice Insurance' }
// //   ];

// //   const allRequiredDocsUploaded = requiredDocuments.every(
// //     doc => doctorData.documents[doc.key]
// //   );

// //   const allAgreementsAccepted = Object.values(doctorData.agreements).every(Boolean);

// //   return (
// //     <div className="space-y-8">
// //       <div className="text-center">
// //         <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Application</h2>
// //         <p className="text-gray-600">Please review all information before submitting</p>
// //       </div>

// //       <div className="space-y-6">
// //         {/* Personal Information */}
// //         <InfoSection icon={User} title="Personal Information">
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
// //             <div className="space-y-2">
// //               <InfoRow label="Name" value={`${doctorData.personalInfo.firstName} ${doctorData.personalInfo.lastName}`} />
// //               <InfoRow label="Email" value={doctorData.personalInfo.email} />
// //               <InfoRow label="Phone" value={doctorData.personalInfo.phone} />
// //               <InfoRow label="Date of Birth" value={doctorData.personalInfo.dateOfBirth} />
// //             </div>
// //             <div className="space-y-2">
// //               <InfoRow label="Gender" value={doctorData.personalInfo.gender} />
// //               <InfoRow label="Address" value={doctorData.personalInfo.address} />
// //               <InfoRow label="City, State ZIP" value={`${doctorData.personalInfo.city}, ${doctorData.personalInfo.state} ${doctorData.personalInfo.zipCode}`} />
// //             </div>
// //           </div>
// //         </InfoSection>

// //         {/* Professional Information */}
// //         <InfoSection icon={Briefcase} title="Professional Information" iconColor="text-teal-600">
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
// //             <div className="space-y-2">
// //               <InfoRow label="License Number" value={doctorData.professionalInfo.licenseNumber} />
// //               <InfoRow label="Specialization" value={doctorData.professionalInfo.specialization} />
// //               <InfoRow label="Sub-specialty" value={doctorData.professionalInfo.subSpecialty} />
// //             </div>
// //             <div className="space-y-2">
// //               <InfoRow label="Years of Experience" value={doctorData.professionalInfo.yearsOfExperience} />
// //               <InfoRow label="Current Hospital" value={doctorData.professionalInfo.currentHospital} />
// //             </div>
// //           </div>
// //           {doctorData.professionalInfo.boardCertifications.length > 0 && (
// //             <div className="mt-4">
// //               <span className="text-gray-600 font-medium">Board Certifications:</span>
// //               <ul className="mt-2 list-disc list-inside text-gray-900 space-y-1">
// //                 {doctorData.professionalInfo.boardCertifications.map((cert, index) => (
// //                   <li key={index}>{cert}</li>
// //                 ))}
// //               </ul>
// //             </div>
// //           )}
// //         </InfoSection>

// //         {/* Education */}
// //         <InfoSection icon={GraduationCap} title="Education & Training" iconColor="text-purple-600">
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
// //             <div className="space-y-2">
// //               <InfoRow label="Medical School" value={doctorData.education.medicalSchool} />
// //               <InfoRow label="Graduation Year" value={doctorData.education.graduationYear} />
// //               <InfoRow label="Residency" value={doctorData.education.residency} />
// //             </div>
// //             <div className="space-y-2">
// //               <InfoRow label="Residency Year" value={doctorData.education.residencyYear} />
// //               <InfoRow label="Fellowship" value={doctorData.education.fellowship} />
// //               <InfoRow label="Fellowship Year" value={doctorData.education.fellowshipYear} />
// //             </div>
// //           </div>
// //         </InfoSection>

// //         {/* Availability */}
// //         <InfoSection icon={Clock} title="Availability" iconColor="text-green-600">
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
// //             <div className="space-y-2">
// //               <InfoRow label="Working Days" value={doctorData.availability.workingDays.join(', ')} />
// //               <InfoRow label="Working Hours" value={`${doctorData.availability.startTime} - ${doctorData.availability.endTime}`} />
// //             </div>
// //             <div className="space-y-2">
// //               <InfoRow label="Consultation Duration" value={`${doctorData.availability.consultationDuration} minutes`} />
// //               <InfoRow label="Time Zone" value={doctorData.availability.timeZone} />
// //             </div>
// //           </div>
// //         </InfoSection>

// //         {/* Documents Status */}
// //         <InfoSection icon={FileText} title="Documents" iconColor="text-orange-600">
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //             {[
// //               { key: 'medicalLicense', label: 'Medical License', required: true },
// //               { key: 'boardCertificate', label: 'Board Certificate', required: true },
// //               { key: 'malpracticeInsurance', label: 'Malpractice Insurance', required: true },
// //               { key: 'cv', label: 'CV/Resume', required: false }
// //             ].map(({ key, label, required }) => (
// //               <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
// //                 <span className="font-medium text-gray-900">
// //                   {label} {required && <span className="text-red-500">*</span>}
// //                 </span>
// //                 <div className="flex items-center">
// //                   {doctorData.documents[key] ? (
// //                     <div className="flex items-center text-green-600">
// //                       <CheckCircle className="w-5 h-5 mr-1" />
// //                       <span className="text-sm">Uploaded</span>
// //                     </div>
// //                   ) : (
// //                     <div className="flex items-center text-gray-500">
// //                       <span className="text-sm">{required ? 'Required' : 'Optional'}</span>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </InfoSection>

// //         {/* Terms and Agreements */}
// //         <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
// //           <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
// //             <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
// //             Terms and Agreements
// //           </h3>
// //           <div className="space-y-4">
// //             <label className="flex items-start">
// //               <input
// //                 type="checkbox"
// //                 checked={doctorData.agreements.termsAccepted}
// //                 onChange={(e) => handleAgreementChange('termsAccepted', e.target.checked)}
// //                 className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3 mt-0.5"
// //               />
// //               <span className="text-gray-900">
// //                 I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and 
// //                 understand the requirements for providing medical services through this platform.
// //               </span>
// //             </label>
            
// //             <label className="flex items-start">
// //               <input
// //                 type="checkbox"
// //                 checked={doctorData.agreements.privacyAccepted}
// //                 onChange={(e) => handleAgreementChange('privacyAccepted', e.target.checked)}
// //                 className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3 mt-0.5"
// //               />
// //               <span className="text-gray-900">
// //                 I acknowledge that I have read and agree to the <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> and 
// //                 consent to the processing of my personal and professional data.
// //               </span>
// //             </label>
            
// //             <label className="flex items-start">
// //               <input
// //                 type="checkbox"
// //                 checked={doctorData.agreements.backgroundCheck}
// //                 onChange={(e) => handleAgreementChange('backgroundCheck', e.target.checked)}
// //                 className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3 mt-0.5"
// //               />
// //               <span className="text-gray-900">
// //                 I consent to background verification and credential checking as part of the onboarding process.
// //               </span>
// //             </label>
// //           </div>
// //         </div>

// //         {/* Submission Status */}
// //         <div className={`p-6 rounded-lg border ${
// //           allRequiredDocsUploaded && allAgreementsAccepted 
// //             ? 'bg-green-50 border-green-200' 
// //             : 'bg-amber-50 border-amber-200'
// //         }`}>
// //           <div className="flex items-start">
// //             {allRequiredDocsUploaded && allAgreementsAccepted ? (
// //               <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
// //             ) : (
// //               <AlertTriangle className="w-6 h-6 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
// //             )}
// //             <div>
// //               <h3 className={`text-lg font-semibold mb-2 ${
// //                 allRequiredDocsUploaded && allAgreementsAccepted ? 'text-green-900' : 'text-amber-900'
// //               }`}>
// //                 {allRequiredDocsUploaded && allAgreementsAccepted 
// //                   ? 'Ready to Submit!' 
// //                   : 'Application Incomplete'
// //                 }
// //               </h3>
// //               <div className={`text-sm ${
// //                 allRequiredDocsUploaded && allAgreementsAccepted ? 'text-green-800' : 'text-amber-800'
// //               }`}>
// //                 {!allRequiredDocsUploaded && <p className="mb-2">Please upload all required documents before submitting.</p>}
// //                 {!allAgreementsAccepted && <p className="mb-2">Please accept all terms and agreements to proceed.</p>}
// //                 {allRequiredDocsUploaded && allAgreementsAccepted && (
// //                   <p>Your application is complete and ready for submission. Once submitted, our team will review your credentials and contact you within 3-5 business days.</p>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ReviewStep;

// import React, { useState } from 'react';
// import { User, Briefcase, GraduationCap, Clock, FileText, CheckCircle, AlertTriangle, Eye, ChevronDown, ChevronRight } from 'lucide-react';

// const ReviewStep = ({ doctorData, updateData }) => {
//   const [expandedSections, setExpandedSections] = useState({});
//   const [focusedAgreement, setFocusedAgreement] = useState(null);

//   const handleAgreementChange = (field, value) => {
//     updateData('agreements', { [field]: value });
//   };

//   const toggleSection = (sectionKey) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [sectionKey]: !prev[sectionKey]
//     }));
//   };

//   const InfoSection = ({ icon: Icon, title, children, iconColor = 'from-blue-500 to-blue-600', sectionKey, defaultExpanded = true }) => {
//     const isExpanded = expandedSections[sectionKey] !== undefined ? expandedSections[sectionKey] : defaultExpanded;
    
//     return (
//       <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/20 overflow-hidden transform 
//       hover:scale-[1.01] transition-all duration-300">
//         <div 
//           className="cursor-pointer"
//           onClick={() => toggleSection(sectionKey)}
//         >
//           <div className="p-4 sm:p-6 border-b border-white/10">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${iconColor} rounded-xl sm:rounded-2xl flex items-center justify-center 
//                 shadow-lg mr-3 sm:mr-4 transform hover:rotate-12 transition-transform duration-300`}>
//                   <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
//                 </div>
//                 <h3 className="text-lg sm:text-xl font-bold text-slate-800">{title}</h3>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                 {isExpanded ? (
//                   <ChevronDown className="w-5 h-5 text-slate-600 transition-transform duration-300" />
//                 ) : (
//                   <ChevronRight className="w-5 h-5 text-slate-600 transition-transform duration-300" />
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
//           <div className="p-4 sm:p-6">
//             {children}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const InfoRow = ({ label, value, accent = 'blue' }) => {
//     const accentColors = {
//       blue: 'text-blue-600',
//       purple: 'text-purple-600',
//       green: 'text-green-600',
//       orange: 'text-orange-600'
//     };

//     return (
//       <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-slate-100/50 last:border-b-0 group 
//       hover:bg-slate-50/50 rounded-lg px-2 -mx-2 transition-all duration-200">
//         <span className={`font-semibold ${accentColors[accent]} text-sm mb-1 sm:mb-0`}>{label}:</span>
//         <span className="text-slate-700 font-medium text-sm sm:text-right flex-1 sm:max-w-xs break-words">
//           {value || <span className="text-slate-400">Not provided</span>}
//         </span>
//       </div>
//     );
//   };

//   const requiredDocuments = [
//     { key: 'medicalLicense', label: 'Medical License' },
//     { key: 'boardCertificate', label: 'Board Certificate' },
//     { key: 'malpracticeInsurance', label: 'Malpractice Insurance' }
//   ];

//   const allRequiredDocsUploaded = requiredDocuments.every(
//     doc => doctorData.documents[doc.key]
//   );

//   const allAgreementsAccepted = Object.values(doctorData.agreements).every(Boolean);

//   const completionPercentage = Math.round(
//     ((Object.values(doctorData.agreements).filter(Boolean).length / 3) + 
//      (allRequiredDocsUploaded ? 1 : 0)) / 2 * 100
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-3 sm:p-6">
//       <div className="max-w-5xl mx-auto">
//         {/* Mobile-Optimized Animated Header */}
//         <div className="text-center mb-8 sm:mb-12 relative">
//           <div className="absolute -top-4 sm:-top-6 left-1/2 transform -translate-x-1/2 w-20 sm:w-32 h-1 
//           bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          
//           <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-blue-600 
//           rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
//             <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
//           </div>
          
//           <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2 sm:mb-3 leading-tight">
//             Review Your Application
//           </h2>
//           <p className="text-slate-600 text-base sm:text-lg font-medium px-2">Verify all information before submission</p>
          
//           {/* Completion Progress */}
//           <div className="flex justify-center mt-6 sm:mt-8">
//             <div className="bg-white/80 backdrop-blur-sm rounded-full p-4 shadow-lg">
//               <div className="relative w-16 h-16 sm:w-20 sm:h-20">
//                 <svg className="transform -rotate-90 w-full h-full">
//                   <circle
//                     cx="50%"
//                     cy="50%"
//                     r="28"
//                     stroke="rgb(226 232 240)"
//                     strokeWidth="4"
//                     fill="none"
//                   />
//                   <circle
//                     cx="50%"
//                     cy="50%"
//                     r="28"
//                     stroke="url(#gradient)"
//                     strokeWidth="4"
//                     fill="none"
//                     strokeDasharray={`${2 * Math.PI * 28}`}
//                     strokeDashoffset={`${2 * Math.PI * 28 * (1 - completionPercentage / 100)}`}
//                     className="transition-all duration-1000 ease-out"
//                   />
//                   <defs>
//                     <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                       <stop offset="0%" stopColor="rgb(34 197 94)" />
//                       <stop offset="100%" stopColor="rgb(59 130 246)" />
//                     </linearGradient>
//                   </defs>
//                 </svg>
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <span className="text-sm sm:text-base font-bold text-slate-700">{completionPercentage}%</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="space-y-6 sm:space-y-8">
//           {/* Personal Information */}
//           <InfoSection 
//             icon={User} 
//             title="Personal Information" 
//             iconColor="from-blue-500 to-purple-600"
//             sectionKey="personal"
//           >
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="space-y-1">
//                 <InfoRow label="Full Name" value={`${doctorData.personalInfo.firstName} ${doctorData.personalInfo.lastName}`} accent="blue" />
//                 <InfoRow label="Email Address" value={doctorData.personalInfo.email} accent="blue" />
//                 <InfoRow label="Phone Number" value={doctorData.personalInfo.phone} accent="blue" />
//                 <InfoRow label="Date of Birth" value={doctorData.personalInfo.dateOfBirth} accent="blue" />
//               </div>
//               <div className="space-y-1">
//                 <InfoRow label="Gender" value={doctorData.personalInfo.gender} accent="blue" />
//                 <InfoRow label="Street Address" value={doctorData.personalInfo.address} accent="blue" />
//                 <InfoRow label="Location" value={`${doctorData.personalInfo.city}, ${doctorData.personalInfo.state} ${doctorData.personalInfo.zipCode}`} accent="blue" />
//               </div>
//             </div>
//           </InfoSection>

//           {/* Professional Information */}
//           <InfoSection 
//             icon={Briefcase} 
//             title="Professional Information" 
//             iconColor="from-teal-500 to-cyan-600"
//             sectionKey="professional"
//           >
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="space-y-1">
//                 <InfoRow label="License Number" value={doctorData.professionalInfo.licenseNumber} accent="purple" />
//                 <InfoRow label="Specialization" value={doctorData.professionalInfo.specialization} accent="purple" />
//                 <InfoRow label="Sub-specialty" value={doctorData.professionalInfo.subSpecialty} accent="purple" />
//               </div>
//               <div className="space-y-1">
//                 <InfoRow label="Years of Experience" value={doctorData.professionalInfo.yearsOfExperience} accent="purple" />
//                 <InfoRow label="Current Hospital" value={doctorData.professionalInfo.currentHospital} accent="purple" />
//               </div>
//             </div>
//             {doctorData.professionalInfo.boardCertifications?.length > 0 && (
//               <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
//                 <span className="font-semibold text-purple-700 text-sm block mb-2">Board Certifications:</span>
//                 <div className="flex flex-wrap gap-2">
//                   {doctorData.professionalInfo.boardCertifications.map((cert, index) => (
//                     <span key={index} className="px-3 py-1 bg-white/80 text-purple-700 text-sm rounded-full border border-purple-200 shadow-sm">
//                       {cert}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </InfoSection>

//           {/* Education */}
//           <InfoSection 
//             icon={GraduationCap} 
//             title="Education & Training" 
//             iconColor="from-purple-500 to-pink-600"
//             sectionKey="education"
//           >
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="space-y-1">
//                 <InfoRow label="Medical School" value={doctorData.education.medicalSchool} accent="green" />
//                 <InfoRow label="Graduation Year" value={doctorData.education.graduationYear} accent="green" />
//                 <InfoRow label="Residency Program" value={doctorData.education.residency} accent="green" />
//               </div>
//               <div className="space-y-1">
//                 <InfoRow label="Residency Year" value={doctorData.education.residencyYear} accent="green" />
//                 <InfoRow label="Fellowship" value={doctorData.education.fellowship} accent="green" />
//                 <InfoRow label="Fellowship Year" value={doctorData.education.fellowshipYear} accent="green" />
//               </div>
//             </div>
//           </InfoSection>

//           {/* Availability */}
//           <InfoSection 
//             icon={Clock} 
//             title="Availability" 
//             iconColor="from-green-500 to-emerald-600"
//             sectionKey="availability"
//           >
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="space-y-1">
//                 <InfoRow label="Working Days" value={doctorData.availability.workingDays?.join(', ')} accent="orange" />
//                 <InfoRow label="Working Hours" value={`${doctorData.availability.startTime} - ${doctorData.availability.endTime}`} accent="orange" />
//               </div>
//               <div className="space-y-1">
//                 <InfoRow label="Consultation Duration" value={`${doctorData.availability.consultationDuration} minutes`} accent="orange" />
//                 <InfoRow label="Time Zone" value={doctorData.availability.timeZone} accent="orange" />
//               </div>
//             </div>
//           </InfoSection>

//           {/* Documents Status */}
//           <InfoSection 
//             icon={FileText} 
//             title="Documents" 
//             iconColor="from-orange-500 to-red-600"
//             sectionKey="documents"
//           >
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {[
//                 { key: 'medicalLicense', label: 'Medical License', required: true },
//                 { key: 'boardCertificate', label: 'Board Certificate', required: true },
//                 { key: 'malpracticeInsurance', label: 'Malpractice Insurance', required: true },
//                 { key: 'cv', label: 'CV/Resume', required: false }
//               ].map(({ key, label, required }) => (
//                 <div key={key} className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 shadow-sm
//                  hover:shadow-md transition-shadow duration-200">
//                   <div className="flex items-center justify-between">
//                     <span className="font-semibold text-slate-700 text-sm">
//                       {label}
//                       {required && <span className="text-red-500 ml-1">*</span>}
//                     </span>
//                     <div className="flex items-center">
//                       {doctorData.documents[key] ? (
//                         <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full">
//                           <CheckCircle className="w-4 h-4 mr-1" />
//                           <span className="text-xs font-medium">Uploaded</span>
//                         </div>
//                       ) : (
//                         <div className="flex items-center text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
//                           <span className="text-xs font-medium">{required ? 'Required' : 'Optional'}</span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </InfoSection>

//           {/* Terms and Agreements */}
//           <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/20 p-4 sm:p-6">
//             <div className="flex items-center mb-6">
//               <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl
//                flex items-center justify-center shadow-lg mr-3 sm:mr-4">
//                 <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
//               </div>
//               <h3 className="text-lg sm:text-xl font-bold text-slate-800">Terms and Agreements</h3>
//             </div>
//             <div className="space-y-4 sm:space-y-6">
//               {[
//                 {
//                   key: 'termsAccepted',
//                   text: (
//                     <span>
//                       I agree to the <a href="#" className="text-blue-600 hover:text-blue-700 underline font-medium">Terms of Service</a> and 
//                       understand the requirements for providing medical services through this platform.
//                     </span>
//                   )
//                 },
//                 {
//                   key: 'privacyAccepted',
//                   text: (
//                     <span>
//                       I acknowledge that I have read and agree to the <a href="#" className="text-blue-600 hover:text-blue-700 underline font-medium">Privacy Policy</a> and 
//                       consent to the processing of my personal and professional data.
//                     </span>
//                   )
//                 },
//                 {
//                   key: 'backgroundCheck',
//                   text: 'I consent to background verification and credential checking as part of the onboarding process.'
//                 }
//               ].map(({ key, text }) => (
//                 <label 
//                   key={key} 
//                   className={`flex items-start p-4 rounded-xl transition-all duration-200 cursor-pointer hover:bg-slate-50/50 ${
//                     focusedAgreement === key ? 'bg-blue-50/50 ring-2 ring-blue-200' : ''
//                   }`}
//                   onFocus={() => setFocusedAgreement(key)}
//                   onBlur={() => setFocusedAgreement(null)}
//                 >
//                   <div className="relative">
//                     <input
//                       type="checkbox"
//                       checked={doctorData.agreements[key] || false}
//                       onChange={(e) => handleAgreementChange(key, e.target.checked)}
//                       className="w-5 h-5 text-blue-600 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500
//                        focus:border-blue-500 mr-3 mt-0.5 transition-colors duration-200"
//                     />
//                     {doctorData.agreements[key] && (
//                       <CheckCircle className="absolute -top-0.5 -left-0.5 w-6 h-6 text-green-500 pointer-events-none" />
//                     )}
//                   </div>
//                   <span className="text-slate-700 text-sm leading-relaxed flex-1">
//                     {text}
//                   </span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Submission Status */}
//           <div className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 shadow-xl sm:shadow-2xl ${
//             allRequiredDocsUploaded && allAgreementsAccepted 
//               ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
//               : 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200'
//           }`}>
//             <div className="flex items-start">
//               <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 shadow-lg ${
//                 allRequiredDocsUploaded && allAgreementsAccepted 
//                   ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
//                   : 'bg-gradient-to-r from-amber-500 to-orange-600'
//               }`}>
//                 {allRequiredDocsUploaded && allAgreementsAccepted ? (
//                   <CheckCircle className="w-6 h-6 text-white" />
//                 ) : (
//                   <AlertTriangle className="w-6 h-6 text-white" />
//                 )}
//               </div>
//               <div className="flex-1">
//                 <h3 className={`text-xl sm:text-2xl font-bold mb-2 sm:mb-3 ${
//                   allRequiredDocsUploaded && allAgreementsAccepted ? 'text-green-900' : 'text-amber-900'
//                 }`}>
//                   {allRequiredDocsUploaded && allAgreementsAccepted 
//                     ? '🎉 Ready to Submit!' 
//                     : '⚠️ Application Incomplete'
//                   }
//                 </h3>
//                 <div className={`text-sm sm:text-base leading-relaxed ${
//                   allRequiredDocsUploaded && allAgreementsAccepted ? 'text-green-800' : 'text-amber-800'
//                 }`}>
//                   {!allRequiredDocsUploaded && <p className="mb-2">• Please upload all required documents before submitting.</p>}
//                   {!allAgreementsAccepted && <p className="mb-2">• Please accept all terms and agreements to proceed.</p>}
//                   {allRequiredDocsUploaded && allAgreementsAccepted && (
//                     <p className="leading-relaxed">
//                       <strong>Excellent!</strong> Your application is complete and ready for submission. 
//                       Once submitted, our team will review your credentials and contact you within 3-5 business days with next steps.
//                     </p>
//                   )}
//                 </div>
                
//                 {allRequiredDocsUploaded && allAgreementsAccepted && (
//                   <div className="mt-4 flex flex-wrap gap-2">
//                     {['📋 Complete Profile', '📄 All Documents', '✅ Terms Accepted'].map((item, index) => (
//                       <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
//                         {item}
//                       </span>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Mobile spacing for navigation */}
//         <div className="h-20 sm:h-8"></div>
//       </div>
//     </div>
//   );
// };

// export default ReviewStep;
import React,{useState} from 'react';

import { User, Briefcase, GraduationCap, Clock, FileText,Shield, Check, AlertTriangle,Edit, ChevronLeft, ChevronRight } from 'lucide-react';

const ReviewStep = ({ doctorData, updateData, onNavigateToStep }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const [focusedAgreement, setFocusedAgreement] = useState(null);

  const handleAgreementChange = (field, value) => {
    updateData('agreements', { [field]: value });
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const InfoSection = ({ icon: Icon, title, children, iconColor = 'from-blue-500 to-blue-600', sectionKey, defaultExpanded = true, editStep }) => {
    const isExpanded = expandedSections[sectionKey] !== undefined ? expandedSections[sectionKey] : defaultExpanded;
    
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/20 overflow-hidden transform 
      hover:scale-[1.01] transition-all duration-300">
        <div className="p-4 sm:p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center cursor-pointer flex-1"
              onClick={() => toggleSection(sectionKey)}
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${iconColor} rounded-xl sm:rounded-2xl flex items-center justify-center 
              shadow-lg mr-3 sm:mr-4 transform hover:rotate-12 transition-transform duration-300`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800">{title}</h3>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              {editStep && onNavigateToStep && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateToStep(editStep);
                  }}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs sm:text-sm 
                  font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg 
                  transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-1"
                >
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
              )}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div 
                  className="cursor-pointer p-1"
                  onClick={() => toggleSection(sectionKey)}
                >
                  {isExpanded ? (
                    <ChevronLeft className="w-5 h-5 text-slate-600 transition-transform duration-300 rotate-90" />

                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-600 transition-transform duration-300" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="p-4 sm:p-6">
            {children}
          </div>
        </div>
      </div>
    );
  };

  const InfoRow = ({ label, value, accent = 'blue' }) => {
    const accentColors = {
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      green: 'text-green-600',
      orange: 'text-orange-600'
    };

    return (
      <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-slate-100/50 last:border-b-0 group 
      hover:bg-slate-50/50 rounded-lg px-2 -mx-2 transition-all duration-200">
        <span className={`font-semibold ${accentColors[accent]} text-sm mb-1 sm:mb-0`}>{label}:</span>
        <span className="text-slate-700 font-medium text-sm sm:text-right flex-1 sm:max-w-xs break-words">
          {value || <span className="text-slate-400">Not provided</span>}
        </span>
      </div>
    );
  };

  const requiredDocuments = [
    { key: 'medicalLicense', label: 'Medical License' },
    { key: 'boardCertificate', label: 'Board Certificate' },
    { key: 'malpracticeInsurance', label: 'Malpractice Insurance' }
  ];

  const allRequiredDocsUploaded = requiredDocuments.every(
    doc => doctorData.documents && doctorData.documents[doc.key]
  );

  const allAgreementsAccepted = doctorData.agreements && Object.values(doctorData.agreements).every(Boolean);

  const completionPercentage = Math.round(
    ((doctorData.agreements ? Object.values(doctorData.agreements).filter(Boolean).length : 0) / 3 + 
     (allRequiredDocsUploaded ? 1 : 0)) / 2 * 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-3 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 relative">
          <div className="absolute -top-4 sm:-top-6 left-1/2 transform -translate-x-1/2 w-20 sm:w-32 h-1 
          bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-blue-600 
          rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          
          <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2 sm:mb-3 leading-tight">
            Review Your Application
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-medium px-2">Verify all information before submission</p>
          
          {/* Completion Progress */}
          <div className="flex justify-center mt-6 sm:mt-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-4 shadow-lg">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                <svg className="transform -rotate-90 w-full h-full">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="28"
                    stroke="rgb(226 232 240)"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="28"
                    stroke="url(#gradient)"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - completionPercentage / 100)}`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgb(34 197 94)" />
                      <stop offset="100%" stopColor="rgb(59 130 246)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm sm:text-base font-bold text-slate-700">{completionPercentage}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* Personal Information */}
          <InfoSection 
            icon={User} 
            title="Personal Information" 
            iconColor="from-blue-500 to-purple-600"
            sectionKey="personal"
            editStep={1}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-1">
                <InfoRow label="Full Name" value={`${doctorData.personalInfo?.firstName || ''} ${doctorData.personalInfo?.lastName || ''}`} accent="blue" />
                <InfoRow label="Email Address" value={doctorData.personalInfo?.email || 'Not provided'} accent="blue" />
                <InfoRow label="Phone Number" value={doctorData.personalInfo?.phone || 'Not provided'} accent="blue" />
                <InfoRow label="Date of Birth" value={doctorData.personalInfo?.dateOfBirth || 'Not provided'} accent="blue" />
              </div>
              <div className="space-y-1">
                <InfoRow label="Gender" value={doctorData.personalInfo?.gender || 'Not provided'} accent="blue" />
                <InfoRow label="Street Address" value={doctorData.personalInfo?.address || 'Not provided'} accent="blue" />
                <InfoRow label="Location" value={`${doctorData.personalInfo?.city || ''}, ${doctorData.personalInfo?.state || ''} ${doctorData.personalInfo?.zipCode || ''}`} accent="blue" />
              </div>
            </div>
          </InfoSection>

          {/* Professional Information */}
          <InfoSection 
            icon={Briefcase} 
            title="Professional Information" 
            iconColor="from-teal-500 to-cyan-600"
            sectionKey="professional"
            editStep={2}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-1">
                <InfoRow label="License Number" value={doctorData.professionalInfo?.licenseNumber || 'Not provided'} accent="purple" />
                <InfoRow label="Specialization" value={doctorData.professionalInfo?.specialization || 'Not provided'} accent="purple" />
                <InfoRow label="Sub-specialty" value={doctorData.professionalInfo?.subSpecialty || 'Not provided'} accent="purple" />
              </div>
              <div className="space-y-1">
                <InfoRow label="Years of Experience" value={doctorData.professionalInfo?.yearsOfExperience || 'Not provided'} accent="purple" />
                <InfoRow label="Current Hospital" value={doctorData.professionalInfo?.currentHospital || 'Not provided'} accent="purple" />
              </div>
            </div>
            {doctorData.professionalInfo?.boardCertifications?.length > 0 && (
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                <span className="font-semibold text-purple-700 text-sm block mb-2">Board Certifications:</span>
                <div className="flex flex-wrap gap-2">
                  {doctorData.professionalInfo?.boardCertifications?.map((cert, index) => (
                    <span key={index} className="px-3 py-1 bg-white/80 text-purple-700 text-sm rounded-full border border-purple-200 shadow-sm">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </InfoSection>

          {/* Education */}
          <InfoSection 
            icon={GraduationCap} 
            title="Education & Training" 
            iconColor="from-purple-500 to-pink-600"
            sectionKey="education"
            editStep={3}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-1">
                <InfoRow label="Medical School" value={doctorData.education?.medicalSchool || 'Not provided'} accent="green" />
                <InfoRow label="Graduation Year" value={doctorData.education?.graduationYear || 'Not provided'} accent="green" />
                <InfoRow label="Residency Program" value={doctorData.education?.residency || 'Not provided'} accent="green" />
              </div>
              <div className="space-y-1">
                <InfoRow label="Residency Year" value={doctorData.education?.residencyYear || 'Not provided'} accent="green" />
                <InfoRow label="Fellowship" value={doctorData.education?.fellowship || 'Not provided'} accent="green" />
                <InfoRow label="Fellowship Year" value={doctorData.education?.fellowshipYear || 'Not provided'} accent="green" />
              </div>
            </div>
          </InfoSection>

          {/* Availability */}
          <InfoSection 
            icon={Clock} 
            title="Availability" 
            iconColor="from-green-500 to-emerald-600"
            sectionKey="availability"
            editStep={4}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-1">
                <InfoRow label="Working Days" value={doctorData.availability?.workingDays?.join(', ') || 'Not provided'} accent="orange" />
                <InfoRow label="Working Hours" value={`${doctorData.availability?.startTime || 'Not provided'} - ${doctorData.availability?.endTime || 'Not provided'}`} accent="orange" />
              </div>
              <div className="space-y-1">
                <InfoRow label="Consultation Duration" value={`${doctorData.availability?.consultationDuration || 'Not provided'} minutes`} accent="orange" />
                <InfoRow label="Time Zone" value={doctorData.availability?.timeZone || 'Not provided'} accent="orange" />
              </div>
            </div>
          </InfoSection>

          {/* Documents Status */}
          <InfoSection 
            icon={FileText} 
            title="Documents" 
            iconColor="from-orange-500 to-red-600"
            sectionKey="documents"
            editStep={5}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'medicalLicense', label: 'Medical License', required: true },
                { key: 'boardCertificate', label: 'Board Certificate', required: true },
                { key: 'malpracticeInsurance', label: 'Malpractice Insurance', required: true },
                { key: 'cv', label: 'CV/Resume', required: false }
              ].map(({ key, label, required }) => (
                <div key={key} className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 shadow-sm
                 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 text-sm">
                      {label}
                      {required && <span className="text-red-500 ml-1">*</span>}
                    </span>
                    <div className="flex items-center">
                      {doctorData.documents?.[key] ? (
                        <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          <Check className="w-4 h-4 mr-1" />
                          <span className="text-xs font-medium">Uploaded</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                          <span className="text-xs font-medium">{required ? 'Required' : 'Optional'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </InfoSection>

          {/* Terms and Agreements */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/20 p-4 sm:p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl
               flex items-center justify-center shadow-lg mr-3 sm:mr-4">
                <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800">Terms and Agreements</h3>
            </div>
            <div className="space-y-4 sm:space-y-6">
              {[
                {
                  key: 'termsAccepted',
                  text: (
                    <span>
                      I agree to the <a href="#" className="text-blue-600 hover:text-blue-700 underline font-medium">Terms of Service</a> and 
                      understand the requirements for providing medical services through this platform.
                    </span>
                  )
                },
                {
                  key: 'privacyAccepted',
                  text: (
                    <span>
                      I acknowledge that I have read and agree to the <a href="#" className="text-blue-600 hover:text-blue-700 underline font-medium">Privacy Policy</a> and 
                      consent to the processing of my personal and professional data.
                    </span>
                  )
                },
                {
                  key: 'backgroundCheck',
                  text: 'I consent to background verification and credential checking as part of the onboarding process.'
                }
              ].map(({ key, text }) => (
                <label 
                  key={key} 
                  className={`flex items-start p-4 rounded-xl transition-all duration-200 cursor-pointer hover:bg-slate-50/50 ${
                    focusedAgreement === key ? 'bg-blue-50/50 ring-2 ring-blue-200' : ''
                  }`}
                  onFocus={() => setFocusedAgreement(key)}
                  onBlur={() => setFocusedAgreement(null)}
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={doctorData.agreements?.[key] || false}
                      onChange={(e) => handleAgreementChange(key, e.target.checked)}
                      className="w-5 h-5 text-blue-600 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500
                       focus:border-blue-500 mr-3 mt-0.5 transition-colors duration-200"
                    />
                    {doctorData.agreements?.[key] && (
                      <Check className="absolute -top-0.5 -left-0.5 w-6 h-6 text-green-500 pointer-events-none" />
                    )}
                  </div>
                  <span className="text-slate-700 text-sm leading-relaxed flex-1">
                    {text}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Submission Status */}
          <div className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 shadow-xl sm:shadow-2xl ${
            allRequiredDocsUploaded && allAgreementsAccepted 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
              : 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200'
          }`}>
            <div className="flex items-start">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 shadow-lg ${
                allRequiredDocsUploaded && allAgreementsAccepted 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                  : 'bg-gradient-to-r from-amber-500 to-orange-600'
              }`}>
                {allRequiredDocsUploaded && allAgreementsAccepted ? (
                  <Check className="w-6 h-6 text-white" />
                ) : (
                  <FileText className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h3 className={`text-xl sm:text-2xl font-bold mb-2 sm:mb-3 ${
                  allRequiredDocsUploaded && allAgreementsAccepted ? 'text-green-900' : 'text-amber-900'
                }`}>
                  {allRequiredDocsUploaded && allAgreementsAccepted 
                    ? 'Ready to Submit!' 
                    : 'Application Incomplete'
                  }
                </h3>
                <div className={`text-sm sm:text-base leading-relaxed ${
                  allRequiredDocsUploaded && allAgreementsAccepted ? 'text-green-800' : 'text-amber-800'
                }`}>
                  {!allRequiredDocsUploaded && <p className="mb-2">Please upload all required documents before submitting.</p>}
                  {!allAgreementsAccepted && <p className="mb-2">Please accept all terms and agreements to proceed.</p>}
                  {allRequiredDocsUploaded && allAgreementsAccepted && (
                    <p className="leading-relaxed">
                      Your application is complete and ready for submission. 
                      Once submitted, our team will review your credentials and contact you within 3-5 business days with next steps.
                    </p>
                  )}
                </div>
                
                {allRequiredDocsUploaded && allAgreementsAccepted && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['Complete Profile', 'All Documents', 'Terms Accepted'].map((item, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile spacing for navigation */}
        <div className="h-20 sm:h-8"></div>
      </div>
    </div>
  );
};
export default ReviewStep;