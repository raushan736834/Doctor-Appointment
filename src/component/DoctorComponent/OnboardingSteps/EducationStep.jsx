import React, { useState } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { GraduationCap, Award, Building, Clock, Stethoscope, Check, Star, BookOpen, Plus } from 'lucide-react';

const validationSchema = Yup.object().shape({
  medicalSchool: Yup.string()
    .required('Medical school name is required')
    .min(3, 'Medical school name must be at least 3 characters'),
  medicalDegree: Yup.string()
    .required('Degree type is required'),
  medicalGraduationYear: Yup.string()
    .required('Graduation year is required'),
  primarySpecialty: Yup.string()
    .required('Primary specialty is required'),
  residencyInstitution: Yup.string()
    .required('Residency institution is required')
    .min(3, 'Institution name must be at least 3 characters'),
  residencyYear: Yup.string()
    .required('Residency completion year is required'),
  yearsOfExperience: Yup.string()
    .required('Years of experience is required'),
  fellowshipSpecialty: Yup.string(),
  fellowshipInstitution: Yup.string(),
  fellowshipYear: Yup.string(),
  additionalSpecializations: Yup.array().of(
    Yup.object().shape({
      specialty: Yup.string().required('Specialty is required'),
      institution: Yup.string().required('Institution is required'),
      year: Yup.string().required('Year is required')
    })
  )
});

const medicalSpecialties = [
  'Internal Medicine', 'Pediatrics', 'Surgery', 'Obstetrics & Gynecology', 'Psychiatry',
  'Radiology', 'Anesthesiology', 'Emergency Medicine', 'Family Medicine', 'Cardiology',
  'Dermatology', 'Neurology', 'Orthopedics', 'Ophthalmology', 'ENT', 'Urology',
  'Oncology', 'Gastroenterology', 'Pulmonology', 'Nephrology', 'Endocrinology',
  'Rheumatology', 'Pathology', 'General Practice', 'Other'
];


const EducationStep = ({ data: initialData = {}, onSubmit }) => {
  const [showAdditionalSpecializations, setShowAdditionalSpecializations] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 60 }, (_, i) => currentYear - i);

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      if (onSubmit) {
        await onSubmit(values);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 p-3 sm:p-6">
      <Formik
        initialValues={{
          medicalSchool: initialData?.medicalSchool || '',
          medicalDegree: initialData?.medicalDegree || '',
          medicalGraduationYear: initialData?.medicalGraduationYear || '',
          primarySpecialty: initialData?.primarySpecialty || '',
          residencyInstitution: initialData?.residencyInstitution || '',
          residencyYear: initialData?.residencyYear || '',
          yearsOfExperience: initialData?.yearsOfExperience || '',
          fellowshipSpecialty: initialData?.fellowshipSpecialty || '',
          fellowshipInstitution: initialData?.fellowshipInstitution || '',
          fellowshipYear: initialData?.fellowshipYear || '',
          additionalSpecializations: initialData?.additionalSpecializations || []
        }}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ values, errors, touched, setFieldValue, setFieldTouched }) => (
          <Form className="max-w-4xl mx-auto">
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
                  <Field name="medicalSchool">
                    {({ field, meta }) => (
                      <div>
                        <input
                          type="text"
                          {...field}
                          onFocus={() => setFocusedField('medicalSchool')}
                          onBlur={(e) => {
                            field.onBlur(e);
                            setFocusedField(null);
                          }}
                          className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                            focusedField === 'medicalSchool' 
                              ? 'border-blue-400 ring-2 sm:ring-4 ring-blue-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                              : meta.touched && !meta.error
                              ? 'border-green-300 shadow-md'
                              : meta.touched && meta.error
                              ? 'border-red-300'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                          placeholder="e.g., Harvard Medical School, AIIMS New Delhi"
                        />
                        {meta.touched && meta.error && (
                          <div className="mt-1 text-sm text-red-500">{meta.error}</div>
                        )}
                      </div>
                    )}
                  </Field>
                  {touched.medicalSchool && !errors.medicalSchool && (
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
                  <Field name="medicalDegree">
                    {({ field, meta }) => (
                      <div>
                        <select
                          {...field}
                          onFocus={() => setFocusedField('medicalDegree')}
                          onBlur={(e) => {
                            field.onBlur(e);
                            setFocusedField(null);
                          }}
                          className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none text-base ${
                            focusedField === 'medicalDegree' 
                              ? 'border-purple-400 ring-2 sm:ring-4 ring-purple-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                              : meta.touched && !meta.error
                              ? 'border-green-300 shadow-md'
                              : meta.touched && meta.error
                              ? 'border-red-300'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <option value="">Select degree</option>
                          <option value="MD">MD (Doctor of Medicine)</option>
                          <option value="MBBS">MBBS (Bachelor of Medicine, Bachelor of Surgery)</option>
                          <option value="DO">DO (Doctor of Osteopathic Medicine)</option>
                          <option value="Other">Other Medical Degree</option>
                        </select>
                        {meta.touched && meta.error && (
                          <div className="mt-1 text-sm text-red-500">{meta.error}</div>
                        )}
                      </div>
                    )}
                  </Field>
                  {touched.medicalDegree && !errors.medicalDegree && (
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
                  <Field name="medicalGraduationYear">
                    {({ field, meta }) => (
                      <div>
                        <select
                          {...field}
                          onFocus={() => setFocusedField('medicalGraduationYear')}
                          onBlur={(e) => {
                            field.onBlur(e);
                            setFocusedField(null);
                          }}
                          className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none text-base ${
                            focusedField === 'medicalGraduationYear' 
                              ? 'border-orange-400 ring-2 sm:ring-4 ring-orange-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                              : meta.touched && !meta.error
                              ? 'border-green-300 shadow-md'
                              : meta.touched && meta.error
                              ? 'border-red-300'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <option value="">Select year</option>
                          {years.map((year) => (
                            <option key={year} value={year.toString()}>{year}</option>
                          ))}
                        </select>
                        {meta.touched && meta.error && (
                          <div className="mt-1 text-sm text-red-500">{meta.error}</div>
                        )}
                      </div>
                    )}
                  </Field>
                  {touched.medicalGraduationYear && !errors.medicalGraduationYear && (
                    <Check className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Residency */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl sm:shadow-2xl border border-white/20">
            <div className="flex items-center mb-6 sm:mb-8">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl sm:rounded-2xl flex 
              items-center justify-center mr-3 sm:mr-4 shadow-lg">
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
                  <Field name="primarySpecialty">
                    {({ field, meta }) => (
                      <div>
                        <select
                          {...field}
                          onFocus={() => setFocusedField('primarySpecialty')}
                          onBlur={(e) => {
                            field.onBlur(e);
                            setFocusedField(null);
                          }}
                          className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none text-base ${
                            focusedField === 'primarySpecialty' 
                              ? 'border-teal-400 ring-2 sm:ring-4 ring-teal-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                              : meta.touched && !meta.error
                              ? 'border-green-300 shadow-md'
                              : meta.touched && meta.error
                              ? 'border-red-300'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <option value="">Select specialty</option>
                          {medicalSpecialties.map((specialty) => (
                            <option key={specialty} value={specialty}>{specialty}</option>
                          ))}
                        </select>
                        {meta.touched && meta.error && (
                          <div className="mt-1 text-sm text-red-500">{meta.error}</div>
                        )}
                      </div>
                    )}
                  </Field>
                  {touched.primarySpecialty && !errors.primarySpecialty && (
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
                  <Field name="residencyInstitution">
                    {({ field, meta }) => (
                      <input
                        type="text"
                        {...field}
                        onFocus={() => setFocusedField('residencyInstitution')}
                        onBlur={(e) => {
                          field.onBlur(e);
                          setFocusedField(null);
                        }}
                        className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                          focusedField === 'residencyInstitution' 
                            ? 'border-indigo-400 ring-2 sm:ring-4 ring-indigo-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                            : meta.touched && !meta.error
                            ? 'border-green-300 shadow-md'
                            : meta.touched && meta.error
                            ? 'border-red-300'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        placeholder="e.g., Johns Hopkins Hospital, AIIMS New Delhi"
                      />
                    )}
                  </Field>
                  {touched.residencyInstitution && !errors.residencyInstitution && (
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
                  <Field name="residencyYear">
                    {({ field, meta }) => (
                      <div>
                        <select
                          {...field}
                          onFocus={() => setFocusedField('residencyYear')}
                          onBlur={(e) => {
                            field.onBlur(e);
                            setFocusedField(null);
                          }}
                          className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none text-base ${
                            focusedField === 'residencyYear' 
                              ? 'border-cyan-400 ring-2 sm:ring-4 ring-cyan-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                              : meta.touched && !meta.error
                              ? 'border-green-300 shadow-md'
                              : meta.touched && meta.error
                              ? 'border-red-300'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <option value="">Select year</option>
                          {years.map((year) => (
                            <option key={year} value={year.toString()}>{year}</option>
                          ))}
                        </select>
                        {meta.touched && meta.error && (
                          <div className="mt-1 text-sm text-red-500">{meta.error}</div>
                        )}
                      </div>
                    )}
                  </Field>
                  {touched.residencyYear && !errors.residencyYear && (
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
                  <Field name="yearsOfExperience">
                    {({ field, meta }) => (
                      <div>
                        <select
                          {...field}
                          onFocus={() => setFocusedField('yearsOfExperience')}
                          onBlur={(e) => {
                            field.onBlur(e);
                            setFocusedField(null);
                          }}
                          className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none text-base ${
                            focusedField === 'yearsOfExperience' 
                              ? 'border-amber-400 ring-2 sm:ring-4 ring-amber-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                              : meta.touched && !meta.error
                              ? 'border-green-300 shadow-md'
                              : meta.touched && meta.error
                              ? 'border-red-300'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <option value="">Select experience</option>
                          <option value="0-2">0-2 years</option>
                          <option value="3-5">3-5 years</option>
                          <option value="6-10">6-10 years</option>
                          <option value="11-15">11-15 years</option>
                          <option value="16-20">16-20 years</option>
                          <option value="20+">20+ years</option>
                        </select>
                        {meta.touched && meta.error && (
                          <div className="mt-1 text-sm text-red-500">{meta.error}</div>
                        )}
                      </div>
                    )}
                  </Field>
                  {touched.yearsOfExperience && !errors.yearsOfExperience && (
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
                  <Field name="fellowshipSpecialty">
                    {({ field, meta }) => (
                      <input
                        type="text"
                        {...field}
                        onFocus={() => setFocusedField('fellowshipSpecialty')}
                        onBlur={(e) => {
                          field.onBlur(e);
                          setFocusedField(null);
                        }}
                        className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                          focusedField === 'fellowshipSpecialty' 
                            ? 'border-emerald-400 ring-2 sm:ring-4 ring-emerald-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                            : meta.touched && !meta.error
                            ? 'border-green-300 shadow-md'
                            : meta.touched && meta.error
                            ? 'border-red-300'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        placeholder="e.g., Interventional Cardiology, Pediatric Surgery"
                      />
                    )}
                  </Field>
                  {touched.fellowshipSpecialty && !errors.fellowshipSpecialty && (
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
                  <Field name="fellowshipInstitution">
                    {({ field, meta }) => (
                      <input
                        type="text"
                        {...field}
                        onFocus={() => setFocusedField('fellowshipInstitution')}
                        onBlur={(e) => {
                          field.onBlur(e);
                          setFocusedField(null);
                        }}
                        className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm text-base ${
                          focusedField === 'fellowshipInstitution' 
                            ? 'border-rose-400 ring-2 sm:ring-4 ring-rose-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                            : meta.touched && !meta.error
                            ? 'border-green-300 shadow-md'
                            : meta.touched && meta.error
                            ? 'border-red-300'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        placeholder="Institution name"
                      />
                    )}
                  </Field>
                  {touched.fellowshipInstitution && !errors.fellowshipInstitution && (
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
                  <Field name="fellowshipYear">
                    {({ field, meta }) => (
                      <div>
                        <select
                          {...field}
                          onFocus={() => setFocusedField('fellowshipYear')}
                          onBlur={(e) => {
                            field.onBlur(e);
                            setFocusedField(null);
                          }}
                          className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none text-base ${
                            focusedField === 'fellowshipYear' 
                              ? 'border-violet-400 ring-2 sm:ring-4 ring-violet-100 shadow-lg transform scale-[1.02] sm:scale-105' 
                              : meta.touched && !meta.error
                              ? 'border-green-300 shadow-md'
                              : meta.touched && meta.error
                              ? 'border-red-300'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <option value="">Select year</option>
                          {years.map((year) => (
                            <option key={year} value={year.toString()}>{year}</option>
                          ))}
                        </select>
                        {meta.touched && meta.error && (
                          <div className="mt-1 text-sm text-red-500">{meta.error}</div>
                        )}
                      </div>
                    )}
                  </Field>
                    </div>
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
                  <FieldArray name="additionalSpecializations">
                    {({ push, remove }) => (
                      <div>
                        {values.additionalSpecializations.map((_, index) => (
                          <div key={index} className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 relative mb-4">
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="absolute top-3 right-3 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <Field name={`additionalSpecializations.${index}.specialty`}>
                                {({ field, meta }) => (
                                  <div>
                                    <input
                                      {...field}
                                      type="text"
                                      className="px-3 py-2 w-full border border-emerald-200 rounded-lg focus:ring-1 focus:ring-emerald-500 text-sm bg-white"
                                      placeholder="Specialty name"
                                    />
                                    {meta.touched && meta.error && (
                                      <div className="mt-1 text-xs text-red-500">{meta.error}</div>
                                    )}
                                  </div>
                                )}
                              </Field>
                              <Field name={`additionalSpecializations.${index}.institution`}>
                                {({ field, meta }) => (
                                  <div>
                                    <input
                                      {...field}
                                      type="text"
                                      className="px-3 py-2 w-full border border-emerald-200 rounded-lg focus:ring-1 focus:ring-emerald-500 text-sm bg-white"
                                      placeholder="Institution"
                                    />
                                    {meta.touched && meta.error && (
                                      <div className="mt-1 text-xs text-red-500">{meta.error}</div>
                                    )}
                                  </div>
                                )}
                              </Field>
                              <Field name={`additionalSpecializations.${index}.year`}>
                                {({ field, meta }) => (
                                  <div>
                                    <select
                                      {...field}
                                      className="px-3 py-2 w-full border border-emerald-200 rounded-lg focus:ring-1 focus:ring-emerald-500 text-sm bg-white"
                                    >
                                      <option value="">Year</option>
                                      {years.slice(0, 30).map((year) => (
                                        <option key={year} value={year.toString()}>{year}</option>
                                      ))}
                                    </select>
                                    {meta.touched && meta.error && (
                                      <div className="mt-1 text-xs text-red-500">{meta.error}</div>
                                    )}
                                  </div>
                                )}
                              </Field>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push({ specialty: '', institution: '', year: '' })}
                          className="w-full py-3 border-2 border-dashed border-emerald-300 text-emerald-600 rounded-2xl hover:border-emerald-400 hover:text-emerald-700 transition-colors flex items-center justify-center"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add Another Specialization
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>
              )}
            </div>
          </div>

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
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EducationStep;