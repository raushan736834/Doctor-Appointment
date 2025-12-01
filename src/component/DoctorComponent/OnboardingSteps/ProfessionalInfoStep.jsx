import React, { useState } from 'react';
import { Plus, X, Briefcase, Award, Building, Clock, Stethoscope, Check, Star, Shield, GraduationCap } from 'lucide-react';
import { useApiService } from "../../../hooks/useAuthWithAxios";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const specializations = [
  'Ayurveda', 'Cardiologist', 'Dermatologist', 'Ear-Nose-Throat (ENT) Specialist', 'Gastroenterologist',
  'General Physician', 'General Surgeon', 'Gynecologist/Obstetrician', 'Homoeopath', 'Neonatologist',
  'Nephrologist/Renal Specialist', 'Neurologist', 'Ophthalmologist', 'Orthopedist', 'Pediatrician', 'Physiotherapist',
  'Psychiatrist', 'Sexologist', 'Yoga & Naturopathy'
];

const languageKnown = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Mandarin',
  'Hindi', 'Arabic', 'Japanese', 'Korean', 'Russian', 'Dutch', 'Swedish'
];

const ProfessionalInfoSchema = Yup.object({
  medicalLicenseNumber: Yup.string().trim().required('Medical license number is required'),
  yearOfExp: Yup.string().required('Please select years of experience'),
  specialization: Yup.string().required('Please select your primary specialization'),
  subSpeciality: Yup.string().nullable(),
  consultationFees: Yup.number()
    .typeError('Consultation fee must be a number')
    .min(0, 'Consultation fee cannot be negative')
    .required('Consultation fee is required'),
  currentHospital: Yup.string().trim().required('Current hospital/practice is required'),
  medicalCouncil: Yup.string().required('Please select a medical council'),
  bio: Yup.string().nullable(),
  // languageKnown: Yup.array().of(Yup.string()).nullable(),
});

const ProfessionalInfoStep = ({ updateData, data: initialPropsData, onSubmit }) => {
  const [focusedField, setFocusedField] = useState(null);
  const [data, setData] = useState({});
  const [err, setErr] = useState(null);


  const handleInputChange = (field, value) => {
    // Update local state so inputs are controlled reliably
    setData((prev) => ({ ...prev, [field]: value }));
    // Bubble up to parent if provided
    if (typeof updateData === 'function') {
      updateData({ [field]: value });
    }
  };

  const isNonEmpty = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return Boolean(value);
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

        <Formik
          enableReinitialize
          initialValues={{
            // Prefer fetched state if present; otherwise fall back to props data
            medicalLicenseNumber: (data.medicalLicenseNumber ?? (initialPropsData?.medicalLicenseNumber)) || '',
            yearOfExp: (data.yearOfExp ?? (initialPropsData?.yearOfExp)) || '',
            specialization: (data.specialization ?? (initialPropsData?.specialization)) || '',
            subSpeciality: (data.subSpeciality ?? (initialPropsData?.subSpeciality)) || '',
            consultationFees: (data.consultationFees ?? (initialPropsData?.consultationFees)) || '',
            currentHospital: (data.currentHospital ?? (initialPropsData?.currentHospital)) || '',
            medicalCouncil: (data.medicalCouncil ?? (initialPropsData?.medicalCouncil)) || '',
            bio: (data.bio ?? (initialPropsData?.bio)) || '',
            // languageKnown: (data.languageKnown ?? (initialPropsData?.languageKnown)) || [],
          }}
          validationSchema={ProfessionalInfoSchema}
          onSubmit={(values) => {
            if (typeof onSubmit === 'function') {
              onSubmit(values);
            }
          }}
        >
          {({ values, setFieldValue, touched }) => (
            <Form data-formik-form>
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl sm:shadow-2xl border border-white/20">
                <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2">
                  
                  {/* Medical License Number */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                      <Shield className="w-4 h-4 mr-2 text-blue-500" />
                      Medical License Number *
                    </label>
                    <div className="relative">
                      <Field name="medicalLicenseNumber">
                        {({ field, form }) => (
                          <input
                            type="text"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => {
                              form.setFieldValue('medicalLicenseNumber', e.target.value);
                              handleInputChange('medicalLicenseNumber', e.target.value);
                            }}
                            onFocus={() => setFocusedField('medicalLicenseNumber')}
                            onBlur={(e) => { field.onBlur(e); setFocusedField(null); }}
                            className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                              focusedField === 'medicalLicenseNumber' 
                                ? 'border-blue-400 ring-2 sm:ring-4 ring-blue-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                                : isNonEmpty(values.medicalLicenseNumber)
                                ? 'border-green-300 shadow-md'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                            placeholder="Enter your license number"
                            required
                          />
                        )}
                      </Field>
                      {isNonEmpty(values.medicalLicenseNumber) && (
                        <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      )}
                    </div>
                    {touched.medicalLicenseNumber && (
                      <ErrorMessage name="medicalLicenseNumber" render={(msg) => (
                        <div className="text-red-600 text-xs mt-1">{msg}</div>
                      )} />
                    )}
                  </div>
                  
                  {/* Years of Experience */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                      <Clock className="w-4 h-4 mr-2 text-orange-500" />
                      Years of Experience *
                    </label>
                    <div className="relative">
                      <Field name="yearOfExp">
                        {({ field, form }) => (
                          <select
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => {
                              form.setFieldValue('yearOfExp', e.target.value);
                              handleInputChange('yearOfExp', e.target.value);
                            }}
                            onFocus={() => setFocusedField('yearOfExp')}
                            onBlur={(e) => { field.onBlur(e); setFocusedField(null); }}
                            className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none text-base ${
                              focusedField === 'yearOfExp' 
                                ? 'border-orange-400 ring-2 sm:ring-4 ring-orange-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                                : isNonEmpty(values.yearOfExp)
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
                        )}
                      </Field>
                      {isNonEmpty(values.yearOfExp) && (
                        <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      )}
                    </div>
                    {touched.yearOfExp && (
                      <ErrorMessage name="yearOfExp" render={(msg) => (
                        <div className="text-red-600 text-xs mt-1">{msg}</div>
                      )} />
                    )}
                  </div>
                  
                  {/* Primary Specialization */}
                  <div className="space-y-2 sm:col-span-2">
                    <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                      <Stethoscope className="w-4 h-4 mr-2 text-purple-500" />
                      Primary Specialization *
                    </label>
                    <div className="relative">
                      <Field name="specialization">
                        {({ field, form }) => (
                          <select
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => {
                              form.setFieldValue('specialization', e.target.value);
                              handleInputChange('specialization', e.target.value);
                            }}
                            onFocus={() => setFocusedField('specialization')}
                            onBlur={(e) => { field.onBlur(e); setFocusedField(null); }}
                            className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none text-base ${
                              focusedField === 'specialization' 
                                ? 'border-purple-400 ring-2 sm:ring-4 ring-purple-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                                : isNonEmpty(values.specialization)
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
                        )}
                      </Field>
                      {isNonEmpty(values.specialization) && (
                        <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      )}
                    </div>
                    {touched.specialization && (
                      <ErrorMessage name="specialization" render={(msg) => (
                        <div className="text-red-600 text-xs mt-1">{msg}</div>
                      )} />
                    )}
                  </div>
                  
                  {/* Sub-specialty */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                      <Star className="w-4 h-4 mr-2 text-pink-500" />
                      Sub-specialty
                      <span className="text-xs text-slate-500 ml-1">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Field name="subSpeciality">
                        {({ field, form }) => (
                          <input
                            type="text"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => {
                              form.setFieldValue('subSpeciality', e.target.value);
                              handleInputChange('subSpeciality', e.target.value);
                            }}
                            onFocus={() => setFocusedField('subSpeciality')}
                            onBlur={(e) => { field.onBlur(e); setFocusedField(null); }}
                            className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                              focusedField === 'subSpeciality' 
                                ? 'border-pink-400 ring-2 sm:ring-4 ring-pink-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                                : isNonEmpty(values.subSpeciality)
                                ? 'border-green-300 shadow-md'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                            placeholder="e.g., Interventional Cardiology"
                          />
                        )}
                      </Field>
                      {isNonEmpty(values.subSpeciality) && (
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
                      <Field name="consultationFees">
                        {({ field, form }) => (
                          <input
                            type="number"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => {
                              const v = e.target.value;
                              form.setFieldValue('consultationFees', v);
                              handleInputChange('consultationFees', v);
                            }}
                            onFocus={() => setFocusedField('consultationFees')}
                            onBlur={(e) => { field.onBlur(e); setFocusedField(null); }}
                            className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                              focusedField === 'consultationFees' 
                                ? 'border-green-400 ring-2 sm:ring-4 ring-green-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                                : isNonEmpty(values.consultationFees)
                                ? 'border-green-300 shadow-md'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                            placeholder="500"
                            min="0"
                            required
                          />
                        )}
                      </Field>
                      {isNonEmpty(values.consultationFees) && (
                        <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      )}
                    </div>
                    {touched.consultationFees && (
                      <ErrorMessage name="consultationFees" render={(msg) => (
                        <div className="text-red-600 text-xs mt-1">{msg}</div>
                      )} />
                    )}
                  </div>
                  
                  {/* Current Hospital/Practice */}
                  <div className="sm:col-span-2 space-y-2">
                    <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                      <Building className="w-4 h-4 mr-2 text-indigo-500" />
                      Current Hospital/Practice *
                    </label>
                    <div className="relative">
                      <Field name="currentHospital">
                        {({ field, form }) => (
                          <input
                            type="text"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => {
                              form.setFieldValue('currentHospital', e.target.value);
                              handleInputChange('currentHospital', e.target.value);
                            }}
                            onFocus={() => setFocusedField('currentHospital')}
                            onBlur={(e) => { field.onBlur(e); setFocusedField(null); }}
                            className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                              focusedField === 'currentHospital' 
                                ? 'border-indigo-400 ring-2 sm:ring-4 ring-indigo-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                                : isNonEmpty(values.currentHospital)
                                ? 'border-green-300 shadow-md'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                            placeholder="Enter your current workplace"
                            required
                          />
                        )}
                      </Field>
                      {isNonEmpty(values.currentHospital) && (
                        <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      )}
                    </div>
                    {touched.currentHospital && (
                      <ErrorMessage name="currentHospital" render={(msg) => (
                        <div className="text-red-600 text-xs mt-1">{msg}</div>
                      )} />
                    )}
                  </div>
                  
                  {/* Medical Registration Council */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                      <GraduationCap className="w-4 h-4 mr-2 text-teal-500" />
                      Medical Council *
                    </label>
                    <div className="relative">
                      <Field name="medicalCouncil">
                        {({ field, form }) => (
                          <select
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => {
                              form.setFieldValue('medicalCouncil', e.target.value);
                              handleInputChange('medicalCouncil', e.target.value);
                            }}
                            onFocus={() => setFocusedField('medicalCouncil')}
                            onBlur={(e) => { field.onBlur(e); setFocusedField(null); }}
                            className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none text-base ${
                              focusedField === 'medicalCouncil' 
                                ? 'border-teal-400 ring-2 sm:ring-4 ring-teal-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                                : isNonEmpty(values.medicalCouncil)
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
                        )}
                      </Field>
                      {isNonEmpty(values.medicalCouncil) && (
                        <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      )}
                    </div>
                    {touched.medicalCouncil && (
                      <ErrorMessage name="medicalCouncil" render={(msg) => (
                        <div className="text-red-600 text-xs mt-1">{msg}</div>
                      )} />
                    )}
                  </div>
                  
                  {/* Bio/About */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                      <Briefcase className="w-4 h-4 mr-2 text-cyan-500" />
                      Professional Bio
                      <span className="text-xs text-slate-500 ml-1">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Field name="bio">
                        {({ field, form }) => (
                          <textarea
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => {
                              form.setFieldValue('bio', e.target.value);
                              handleInputChange('bio', e.target.value);
                            }}
                            onFocus={() => setFocusedField('bio')}
                            onBlur={(e) => { field.onBlur(e); setFocusedField(null); }}
                            rows={3}
                            className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base resize-none ${
                              focusedField === 'bio' 
                                ? 'border-cyan-400 ring-2 sm:ring-4 ring-cyan-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                                : isNonEmpty(values.bio)
                                ? 'border-green-300 shadow-md'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                            placeholder="Brief description about your expertise and approach to patient care"
                          />
                        )}
                      </Field>
                      {isNonEmpty(values.bio) && (
                        <Check className="absolute right-3 sm:right-4 top-3 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                  
                  {/* Languages Spoken */}
                  {/* <div className="sm:col-span-2 space-y-4">
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
                        {languageKnown.filter(lang => !(values.languageKnown || []).includes(lang)).map((lang) => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          if (!newLanguage) return;
                          if ((values.languageKnown || []).includes(newLanguage)) return;
                          const updated = [...(values.languageKnown || []), newLanguage];
                          setFieldValue('languageKnown', updated);
                          setData((prev) => ({ ...prev, languageKnown: updated }));
                          if (typeof updateData === 'function') {
                            updateData({ languageKnown: updated });
                          }
                          setNewLanguage('');
                        }}
                        disabled={!newLanguage}
                        className="px-3 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl sm:rounded-2xl hover:from-rose-600 hover:to-pink-700 transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                      >
                        <Plus className="w-3 h-3 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                    
                    {(values.languageKnown || []).length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {(values.languageKnown || []).map((lang, index) => (
                          <div key={index} className="flex items-center gap-2 bg-gradient-to-r from-rose-100 to-pink-100 px-3 py-2 rounded-xl border border-rose-200">
                            <span className="text-sm font-medium text-rose-700">{lang}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (values.languageKnown || []).filter((_, i) => i !== index);
                                setFieldValue('languageKnown', updated);
                                setData((prev) => ({ ...prev, languageKnown: updated }));
                                if (typeof updateData === 'function') {
                                  updateData({ languageKnown: updated });
                                }
                              }}
                              className="text-rose-500 hover:text-rose-700 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div> */}
                </div>
              </div>
              <button type="submit" className="hidden">Submit</button>
            </Form>
          )}
        </Formik>

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