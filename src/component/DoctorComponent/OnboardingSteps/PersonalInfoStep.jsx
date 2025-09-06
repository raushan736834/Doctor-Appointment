// import React, { useState } from 'react';
// import { Camera, Upload } from 'lucide-react';

// const PersonalInfoStep = ({ data, updateData }) => {
//   const [photoPreview, setPhotoPreview] = useState(null);

//   const handleInputChange = (field, value) => {
//     updateData({ [field]: value });
//   };

//   const handlePhotoUpload = (event) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const result = e.target?.result;
//         setPhotoPreview(result);
//         updateData({ profilePhoto: result });
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div className="space-y-8">
//       <div className="text-center">
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
//         <p className="text-gray-600">Let's start with your basic information</p>
//       </div>

//       {/* Profile Photo Upload */}
//       <div className="flex justify-center">
//         <div className="relative">
//           <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-white shadow-lg overflow-hidden">
//             {photoPreview || data.profilePhoto ? (
//               <img
//                 src={photoPreview || data.profilePhoto}
//                 alt="Profile"
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-teal-400">
//                 <Camera className="w-12 h-12 text-white" />
//               </div>
//             )}
//           </div>
//           <label className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
//             <Upload className="w-5 h-5 text-white" />
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handlePhotoUpload}
//               className="hidden"
//             />
//           </label>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* First Name */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             First Name *
//           </label>
//           <input
//             type="text"
//             value={data.firstName}
//             onChange={(e) => handleInputChange('firstName', e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//             placeholder="Enter your first name"
//             required
//           />
//         </div>

//         {/* Last Name */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Last Name *
//           </label>
//           <input
//             type="text"
//             value={data.lastName}
//             onChange={(e) => handleInputChange('lastName', e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//             placeholder="Enter your last name"
//             required
//           />
//         </div>

//         {/* Email */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Email Address *
//           </label>
//           <input
//             type="email"
//             value={data.email}
//             onChange={(e) => handleInputChange('email', e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//             placeholder="your.email@example.com"
//             required
//           />
//         </div>

//         {/* Phone */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Phone Number *
//           </label>
//           <input
//             type="tel"
//             value={data.phone}
//             onChange={(e) => handleInputChange('phone', e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//             placeholder="+1 (555) 123-4567"
//             required
//           />
//         </div>

//         {/* Date of Birth */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Date of Birth *
//           </label>
//           <input
//             type="date"
//             value={data.dateOfBirth}
//             onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//             required
//           />
//         </div>

//         {/* Gender */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Gender *
//           </label>
//           <select
//             value={data.gender}
//             onChange={(e) => handleInputChange('gender', e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//             required
//           >
//             <option value="">Select gender</option>
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//             <option value="other">Other</option>
//             <option value="prefer-not-to-say">Prefer not to say</option>
//           </select>
//         </div>

//         {/* Address */}
//         <div className="md:col-span-2">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Street Address *
//           </label>
//           <input
//             type="text"
//             value={data.address}
//             onChange={(e) => handleInputChange('address', e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//             placeholder="123 Main Street, Apt 4B"
//             required
//           />
//         </div>

//         {/* City */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             City *
//           </label>
//           <input
//             type="text"
//             value={data.city}
//             onChange={(e) => handleInputChange('city', e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//             placeholder="Enter your city"
//             required
//           />
//         </div>

//         {/* State */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             State *
//           </label>
//           <input
//             type="text"
//             value={data.state}
//             onChange={(e) => handleInputChange('state', e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//             placeholder="Enter your state"
//             required
//           />
//         </div>

//         {/* Zip Code */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             PinCode *
//           </label>
//           <input
//             type="text"
//             value={data.zipCode}
//             onChange={(e) => handleInputChange('zipCode', e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//             placeholder="12345"
//             required
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PersonalInfoStep;

import React, { useState, useRef } from 'react';
import { Camera, Upload, User, Mail, Phone, Calendar, MapPin, Edit3, Check } from 'lucide-react';

const PersonalInfoStep = ({ data = {}, updateData }) => {
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    updateData({ [field]: value });
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      // Simulate upload delay for better UX
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          setPhotoPreview(result);
          updateData({ profilePhoto: result });
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      }, 800);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const isFieldValid = (field) => {
    return data[field] && data[field].length > 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Mobile-Optimized Animated Header */}
        <div className="text-center mb-8 sm:mb-12 relative">
          <div className="absolute -top-4 sm:-top-6 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          
          <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2 sm:mb-3 leading-tight">
            Personal Information
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-medium px-2">Tell us about yourself to get started</p>
          
          {/* Progress Indicator */}
          <div className="flex justify-center mt-4 sm:mt-6">
            <div className="flex space-x-1 sm:space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-200 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>

        {/* Mobile-Optimized Profile Photo Section */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="relative group">
            <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-1 shadow-xl sm:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-white">
                {photoPreview || data.profilePhoto ? (
                  <img
                    src={photoPreview || data.profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                    <Camera className="w-10 h-10 sm:w-16 sm:h-16 text-slate-400" />
                  </div>
                )}
                
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-2xl sm:rounded-3xl">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 sm:border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={triggerFileInput}
              className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center cursor-pointer hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg transform hover:scale-110 group-hover:rotate-12"
            >
              <Edit3 className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Mobile-Optimized Form Fields */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl sm:shadow-2xl border border-white/20">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2">
            
            {/* First Name */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                <User className="w-4 h-4 mr-2 text-blue-500" />
                First Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={data.firstName || ''}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  onFocus={() => setFocusedField('firstName')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                    focusedField === 'firstName' 
                      ? 'border-blue-400 ring-2 sm:ring-4 ring-blue-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                      : isFieldValid('firstName')
                      ? 'border-green-300 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  placeholder="Enter your first name"
                  required
                />
                {isFieldValid('firstName') && (
                  <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                <User className="w-4 h-4 mr-2 text-blue-500" />
                Last Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={data.lastName || ''}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  onFocus={() => setFocusedField('lastName')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                    focusedField === 'lastName' 
                      ? 'border-blue-400 ring-2 sm:ring-4 ring-blue-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                      : isFieldValid('lastName')
                      ? 'border-green-300 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  placeholder="Enter your last name"
                  required
                />
                {isFieldValid('lastName') && (
                  <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2 sm:col-span-2">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                <Mail className="w-4 h-4 mr-2 text-purple-500" />
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={data.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                    focusedField === 'email' 
                      ? 'border-purple-400 ring-2 sm:ring-4 ring-purple-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                      : isFieldValid('email')
                      ? 'border-green-300 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  placeholder="your.email@example.com"
                  required
                />
                {isFieldValid('email') && (
                  <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                <Phone className="w-4 h-4 mr-2 text-green-500" />
                Phone Number *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={data.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                    focusedField === 'phone' 
                      ? 'border-green-400 ring-2 sm:ring-4 ring-green-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                      : isFieldValid('phone')
                      ? 'border-green-300 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  placeholder="+1 (555) 123-4567"
                  required
                />
                {isFieldValid('phone') && (
                  <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                Date of Birth *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={data.dateOfBirth || ''}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  onFocus={() => setFocusedField('dateOfBirth')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                    focusedField === 'dateOfBirth' 
                      ? 'border-orange-400 ring-2 sm:ring-4 ring-orange-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                      : isFieldValid('dateOfBirth')
                      ? 'border-green-300 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  required
                />
                {isFieldValid('dateOfBirth') && (
                  <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2 sm:col-span-2">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                <User className="w-4 h-4 mr-2 text-pink-500" />
                Gender *
              </label>
              <div className="relative">
                <select
                  value={data.gender || ''}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  onFocus={() => setFocusedField('gender')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none text-base ${
                    focusedField === 'gender' 
                      ? 'border-pink-400 ring-2 sm:ring-4 ring-pink-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                      : isFieldValid('gender')
                      ? 'border-green-300 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
                {isFieldValid('gender') && (
                  <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Address */}
            <div className="sm:col-span-2 space-y-2">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                <MapPin className="w-4 h-4 mr-2 text-red-500" />
                Street Address *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={data.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  onFocus={() => setFocusedField('address')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                    focusedField === 'address' 
                      ? 'border-red-400 ring-2 sm:ring-4 ring-red-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                      : isFieldValid('address')
                      ? 'border-green-300 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  placeholder="123 Main Street, Apt 4B"
                  required
                />
                {isFieldValid('address') && (
                  <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                City *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={data.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  onFocus={() => setFocusedField('city')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                    focusedField === 'city' 
                      ? 'border-indigo-400 ring-2 sm:ring-4 ring-indigo-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                      : isFieldValid('city')
                      ? 'border-green-300 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  placeholder="Enter your city"
                  required
                />
                {isFieldValid('city') && (
                  <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* State */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                <MapPin className="w-4 h-4 mr-2 text-teal-500" />
                State *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={data.state || ''}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  onFocus={() => setFocusedField('state')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                    focusedField === 'state' 
                      ? 'border-teal-400 ring-2 sm:ring-4 ring-teal-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                      : isFieldValid('state')
                      ? 'border-green-300 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  placeholder="Enter your state"
                  required
                />
                {isFieldValid('state') && (
                  <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* PinCode */}
            <div className="space-y-2 sm:col-span-2">
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                <MapPin className="w-4 h-4 mr-2 text-cyan-500" />
                PinCode *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={data.zipCode || ''}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  onFocus={() => setFocusedField('zipCode')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                    focusedField === 'zipCode' 
                      ? 'border-cyan-400 ring-2 sm:ring-4 ring-cyan-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                      : isFieldValid('zipCode')
                      ? 'border-green-300 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  placeholder="12345"
                  required
                />
                {isFieldValid('zipCode') && (
                  <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile-Optimized Completion Status */}
        <div className="mt-6 sm:mt-8 text-center">
          <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
            <div className="flex space-x-1 mr-2 sm:mr-3">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors duration-300 ${
                    isFieldValid(['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender', 'address', 'city'][i])
                      ? 'bg-green-400'
                      : 'bg-slate-200'
                  }`}
                ></div>
              ))}
            </div>
            <span className="text-xs sm:text-sm font-medium text-slate-600">
              {Object.values(data).filter(Boolean).length}/8 completed
            </span>
          </div>
        </div>

        {/* Mobile spacing for navigation */}
        <div className="h-20 sm:h-8"></div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;