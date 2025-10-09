import React, { useState } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { GraduationCap, Award, Building, Clock, Stethoscope, Check, Star, BookOpen } from 'lucide-react';

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

const EducationStepNew = ({ data: initialData = {}, onSubmit }) => {
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
        {({ values, errors, touched }) => (
          <Form className="max-w-4xl mx-auto space-y-6">
            {/* Medical School Section */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Medical School</h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field name="medicalSchool">
                    {({ field, meta }) => (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Medical School Name *
                        </label>
                        <input
                          type="text"
                          {...field}
                          onFocus={() => setFocusedField('medicalSchool')}
                          onBlur={(e) => {
                            field.onBlur(e);
                            setFocusedField(null);
                          }}
                          className={`w-full px-4 py-3 border-2 rounded-xl ${
                            meta.touched && meta.error
                              ? 'border-red-300'
                              : meta.touched && !meta.error
                              ? 'border-green-300'
                              : 'border-slate-200'
                          }`}
                          placeholder="e.g., Harvard Medical School"
                        />
                        {meta.touched && meta.error && (
                          <div className="mt-1 text-sm text-red-500">{meta.error}</div>
                        )}
                      </div>
                    )}
                  </Field>
                </div>

                <div>
                  <Field name="medicalDegree">
                    {({ field, meta }) => (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Degree Type *
                        </label>
                        <select
                          {...field}
                          onFocus={() => setFocusedField('medicalDegree')}
                          onBlur={(e) => {
                            field.onBlur(e);
                            setFocusedField(null);
                          }}
                          className={`w-full px-4 py-3 border-2 rounded-xl ${
                            meta.touched && meta.error
                              ? 'border-red-300'
                              : meta.touched && !meta.error
                              ? 'border-green-300'
                              : 'border-slate-200'
                          }`}
                        >
                          <option value="">Select degree</option>
                          <option value="MD">MD (Doctor of Medicine)</option>
                          <option value="MBBS">MBBS</option>
                          <option value="DO">DO (Doctor of Osteopathic Medicine)</option>
                        </select>
                        {meta.touched && meta.error && (
                          <div className="mt-1 text-sm text-red-500">{meta.error}</div>
                        )}
                      </div>
                    )}
                  </Field>
                </div>

                <div>
                  <Field name="medicalGraduationYear">
                    {({ field, meta }) => (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Graduation Year *
                        </label>
                        <select
                          {...field}
                          onFocus={() => setFocusedField('medicalGraduationYear')}
                          onBlur={(e) => {
                            field.onBlur(e);
                            setFocusedField(null);
                          }}
                          className={`w-full px-4 py-3 border-2 rounded-xl ${
                            meta.touched && meta.error
                              ? 'border-red-300'
                              : meta.touched && !meta.error
                              ? 'border-green-300'
                              : 'border-slate-200'
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

            {/* Residency Section */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Residency Training</h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Field name="primarySpecialty">
                    {({ field, meta }) => (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Primary Specialty *
                        </label>
                        <select
                          {...field}
                          onFocus={() => setFocusedField('primarySpecialty')}
                          onBlur={(e) => {
                            field.onBlur(e);
                            setFocusedField(null);
                          }}
                          className={`w-full px-4 py-3 border-2 rounded-xl ${
                            meta.touched && meta.error
                              ? 'border-red-300'
                              : meta.touched && !meta.error
                              ? 'border-green-300'
                              : 'border-slate-200'
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
                </div>

                <div>
                  <Field name="residencyInstitution">
                    {({ field, meta }) => (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Residency Institution *
                        </label>
                        <input
                          type="text"
                          {...field}
                          onFocus={() => setFocusedField('residencyInstitution')}
                          onBlur={(e) => {
                            field.onBlur(e);
                            setFocusedField(null);
                          }}
                          className={`w-full px-4 py-3 border-2 rounded-xl ${
                            meta.touched && meta.error
                              ? 'border-red-300'
                              : meta.touched && !meta.error
                              ? 'border-green-300'
                              : 'border-slate-200'
                          }`}
                          placeholder="Institution name"
                        />
                        {meta.touched && meta.error && (
                          <div className="mt-1 text-sm text-red-500">{meta.error}</div>
                        )}
                      </div>
                    )}
                  </Field>
                </div>

                <div>
                  <Field name="residencyYear">
                    {({ field, meta }) => (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Completion Year *
                        </label>
                        <select
                          {...field}
                          onFocus={() => setFocusedField('residencyYear')}
                          onBlur={(e) => {
                            field.onBlur(e);
                            setFocusedField(null);
                          }}
                          className={`w-full px-4 py-3 border-2 rounded-xl ${
                            meta.touched && meta.error
                              ? 'border-red-300'
                              : meta.touched && !meta.error
                              ? 'border-green-300'
                              : 'border-slate-200'
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

                <div>
                  <Field name="yearsOfExperience">
                    {({ field, meta }) => (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Years of Experience *
                        </label>
                        <select
                          {...field}
                          onFocus={() => setFocusedField('yearsOfExperience')}
                          onBlur={(e) => {
                            field.onBlur(e);
                            setFocusedField(null);
                          }}
                          className={`w-full px-4 py-3 border-2 rounded-xl ${
                            meta.touched && meta.error
                              ? 'border-red-300'
                              : meta.touched && !meta.error
                              ? 'border-green-300'
                              : 'border-slate-200'
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
                </div>
              </div>
            </div>

            {/* Fellowship Section */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-900">Fellowship Training</h3>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full">Optional</span>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Field name="fellowshipSpecialty">
                    {({ field, meta }) => (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Fellowship Specialty
                        </label>
                        <input
                          type="text"
                          {...field}
                          onFocus={() => setFocusedField('fellowshipSpecialty')}
                          onBlur={(e) => {
                            field.onBlur(e);
                            setFocusedField(null);
                          }}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl"
                          placeholder="e.g., Cardiology"
                        />
                      </div>
                    )}
                  </Field>
                </div>

                <div>
                  <Field name="fellowshipInstitution">
                    {({ field, meta }) => (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Fellowship Institution
                        </label>
                        <input
                          type="text"
                          {...field}
                          onFocus={() => setFocusedField('fellowshipInstitution')}
                          onBlur={(e) => {
                            field.onBlur(e);
                            setFocusedField(null);
                          }}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl"
                          placeholder="Institution name"
                        />
                      </div>
                    )}
                  </Field>
                </div>

                <div>
                  <Field name="fellowshipYear">
                    {({ field, meta }) => (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Completion Year
                        </label>
                        <select
                          {...field}
                          onFocus={() => setFocusedField('fellowshipYear')}
                          onBlur={(e) => {
                            field.onBlur(e);
                            setFocusedField(null);
                          }}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl"
                        >
                          <option value="">Select year</option>
                          {years.map((year) => (
                            <option key={year} value={year.toString()}>{year}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </Field>
                </div>
              </div>
            </div>

            {/* Additional Specializations */}
            {showAdditionalSpecializations && (
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-slate-900">Additional Specializations</h3>
                  <button
                    type="button"
                    onClick={() => setShowAdditionalSpecializations(false)}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Hide
                  </button>
                </div>

                <FieldArray name="additionalSpecializations">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      {values.additionalSpecializations.map((_, index) => (
                        <div key={index} className="relative p-4 bg-slate-50 rounded-xl">
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="absolute right-2 top-2 text-red-500"
                          >
                            Remove
                          </button>
                          
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <Field name={`additionalSpecializations.${index}.specialty`}>
                              {({ field, meta }) => (
                                <div>
                                  <input
                                    {...field}
                                    type="text"
                                    className={`w-full px-4 py-3 border-2 rounded-xl ${
                                      meta.touched && meta.error
                                        ? 'border-red-300'
                                        : 'border-slate-200'
                                    }`}
                                    placeholder="Specialty"
                                  />
                                  {meta.touched && meta.error && (
                                    <div className="mt-1 text-sm text-red-500">{meta.error}</div>
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
                                    className={`w-full px-4 py-3 border-2 rounded-xl ${
                                      meta.touched && meta.error
                                        ? 'border-red-300'
                                        : 'border-slate-200'
                                    }`}
                                    placeholder="Institution"
                                  />
                                  {meta.touched && meta.error && (
                                    <div className="mt-1 text-sm text-red-500">{meta.error}</div>
                                  )}
                                </div>
                              )}
                            </Field>

                            <Field name={`additionalSpecializations.${index}.year`}>
                              {({ field, meta }) => (
                                <div>
                                  <select
                                    {...field}
                                    className={`w-full px-4 py-3 border-2 rounded-xl ${
                                      meta.touched && meta.error
                                        ? 'border-red-300'
                                        : 'border-slate-200'
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
                      ))}

                      <button
                        type="button"
                        onClick={() => push({ specialty: '', institution: '', year: '' })}
                        className="w-full p-3 mt-4 border-2 border-dashed border-slate-300 text-slate-600 rounded-xl hover:border-slate-400 hover:text-slate-700"
                      >
                        Add Another Specialization
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>
            )}

            {!showAdditionalSpecializations && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowAdditionalSpecializations(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add Additional Specializations
                </button>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-200"
              >
                Save and Continue
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EducationStepNew;