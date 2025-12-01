import React, { useRef, useState } from 'react';
import { Upload, FileText, Check, AlertCircle, Shield, Award, Building, User, X, Eye, Download } from 'lucide-react';

const DocumentsStep = ({ data = {}, updateData, onSubmit }) => {
  console.log(data);
  // Transform array data into object format
  const transformedData = Array.isArray(data) ? data.reduce((acc, doc) => {
    if (doc && doc.fileName) {
      acc[doc.fileName] = {
        fileData: doc.fileData,
        fileType: doc.fileType,
        name: doc.fileName // store the fileName as name for consistency
      };
    }
    return acc;
  }, {}) : data;

  // Use transformed data throughout the component
  const documentData = transformedData;
  console.log(documentData)
  const [draggedOver, setDraggedOver] = useState(null);
  const [focusedDoc, setFocusedDoc] = useState(null);

  // Handle form submission when next is clicked
  const handleFormSubmit = (e) => {
    e?.preventDefault();
    if (typeof onSubmit === 'function') {
      // Pass the current data to parent
      onSubmit(documentData);
    }
  };

  const fileInputRefs = {
    medicalLicense: useRef(null),
    boardCertificate: useRef(null),
    malpracticeInsurance: useRef(null),
    cv: useRef(null),
  };

  const handleFileUpload = (docType, file) => {
    if (file && file.size <= 10 * 1024 * 1024) { // 10MB limit
      updateData({ [docType]: file });
    }
  };

  const removeFile = (docType) => {
    updateData({ [docType]: undefined });
    if (fileInputRefs[docType].current) {
      fileInputRefs[docType].current.value = '';
    }
  };

  const handleDragOver = (e, docType) => {
    e.preventDefault();
    setDraggedOver(docType);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDraggedOver(null);
  };

  const handleDrop = (e, docType) => {
    e.preventDefault();
    setDraggedOver(null);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(docType, file);
    }
  };

  const getDocumentIcon = (type) => {
    const icons = {
      medicalLicense: Shield,
      boardCertificate: Award,
      malpracticeInsurance: Building,
      cv: User,
    };
    return icons[type] || FileText;
  };

  const getDocumentColor = (type) => {
    const colors = {
      medicalLicense: 'blue',
      boardCertificate: 'emerald',
      malpracticeInsurance: 'purple',
      cv: 'orange',
    };
    return colors[type] || 'gray';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const DocumentUpload = ({ 
    type, 
    title, 
    description, 
    required = false, 
    acceptedFormats = '.pdf,.jpg,.jpeg,' 
  }) => {
    console.log(type);
    console.log(documentData)
    const file = documentData[type];
    console.log(documentData[type]);
    // Check if file exists - it could be a File object or a string/object representing an uploaded document
     const hasFile = file && (
      file instanceof File || 
      (typeof file === 'object' && file !== null && (file.fileData || file.name)) || 
      typeof file === 'string'
    );
    console.log(hasFile);
    const IconComponent = getDocumentIcon(type);
    const color = getDocumentColor(type);
    const isDragged = draggedOver === type;
    const isFocused = focusedDoc === type;
    
    // Get file name and size - handle both File objects and previously uploaded file data
    const getFileName = () => {
      if (!file) return '';
      if (file instanceof File) return file.name;
      if (file.name) return file.name;
      if (typeof file === 'string') return file.split('/').pop() || file;
      return 'Document uploaded';
    };
    
    const getFileSize = () => {
      if (!file) return 0;
      if (file instanceof File) return file.size;
      if (file.size) return file.size;
      return 0;
    };

    return (
      <div 
        className={`group relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border 
          border-white/20 transition-all duration-300 transform hover:scale-[1.02] ${
          isDragged ? 'scale-105 shadow-2xl ring-2 ring-blue-400' : ''
        } ${
          isFocused ? 'shadow-2xl transform scale-105' : ''
        }`}
        onDragOver={(e) => handleDragOver(e, type)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, type)}
        onMouseEnter={() => setFocusedDoc(type)}
        onMouseLeave={() => setFocusedDoc(null)}
      >
        {/* Animated background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br opacity-5 ${
          color === 'blue' ? 'from-blue-400 to-blue-600' :
          color === 'emerald' ? 'from-emerald-400 to-emerald-600' :
          color === 'purple' ? 'from-purple-400 to-purple-600' :
          'from-orange-400 to-orange-600'
        } transition-opacity duration-300 group-hover:opacity-10`}></div>

        <div className="relative text-center">
          {/* Document Icon */}
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            {console.log(hasFile)}
            {hasFile ? (
              <div className={`relative w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 group-hover:rotate-0 transition-all duration-300`}>
                <Check className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <Check className="w-3 h-3 text-white" />
                </div>
              </div>
            ) : (
              <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${
                color === 'blue' ? 'from-blue-400 to-blue-600' :
                color === 'emerald' ? 'from-emerald-400 to-emerald-600' :
                color === 'purple' ? 'from-purple-400 to-purple-600' :
                'from-orange-400 to-orange-600'
              } rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 group-hover:rotate-0 transition-all duration-300`}>
                <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            )}
          </div>

          {/* Title and Description */}
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
            {title}
            {required && <span className="text-red-500 ml-1">*</span>}
          </h3>
          <p className="text-slate-600 text-sm sm:text-base mb-4 sm:mb-6 px-2">{description}</p>

          {/* File Upload State */}
          {hasFile ? (
            <div className="space-y-4">
              {/* File Info Card */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 sm:p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center min-w-0">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base font-medium text-green-900 truncate">
                      {getFileName()}
                    </span>
                  </div>
                  {getFileSize() > 0 && (
                    <span className="text-xs sm:text-sm text-green-600 ml-2 flex-shrink-0">
                      {formatFileSize(getFileSize())}
                    </span>
                  )}
                </div>
                
                {/* File Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-green-700">
                    <Check className="w-3 h-3 mr-1" />
                    <span className="text-xs sm:text-sm">Uploaded successfully</span>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      type="button"
                      className="p-1 text-green-600 hover:text-green-800 transition-colors"
                      title="View file"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRefs[type].current?.click()}
                  className={`flex-1 px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-r ${
                    color === 'blue' ? 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' :
                    color === 'emerald' ? 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700' :
                    color === 'purple' ? 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700' :
                    'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                  } text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base flex items-center justify-center`}
                >
                  <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Replace
                </button>
                <button
                  type="button"
                  onClick={() => removeFile(type)}
                  className="px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base flex items-center justify-center"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Drag and Drop Area */}
              <div className={`border-2 border-dashed rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 ${
                isDragged 
                  ? `border-${color}-400 bg-${color}-50` 
                  : `border-slate-300 hover:border-${color}-400 hover:bg-${color}-50`
              }`}>
                <div className="text-center">
                  <Upload className={`w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 ${
                    isDragged ? `text-${color}-500` : 'text-slate-400'
                  } transition-colors`} />
                  <p className="text-slate-600 text-sm sm:text-base mb-2">
                    <span className="font-semibold">Drag and drop</span> your file here
                  </p>
                  <p className="text-slate-500 text-xs sm:text-sm">or</p>
                </div>
              </div>

              {/* Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRefs[type].current?.click()}
                className={`w-full px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r ${
                  color === 'blue' ? 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' :
                  color === 'emerald' ? 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700' :
                  color === 'purple' ? 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700' :
                  'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                } text-white rounded-xl sm:rounded-2xl font-semibold transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base flex items-center justify-center`}
              >
                <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Choose File
              </button>
            </div>
          )}

          {/* File Input */}
          <input
            ref={fileInputRefs[type]}
            type="file"
            accept={acceptedFormats}
            onChange={(e) => handleFileUpload(type, e.target.files?.[0] || null)}
            className="hidden"
          />

          {/* File Format Info */}
          <div className="mt-4 text-xs sm:text-sm text-slate-500 bg-slate-50 rounded-lg p-2">
            <p>PDF, DOC, DOCX, JPG, PNG • Max 10MB</p>
          </div>
        </div>
      </div>
    );
  };

  const uploadedCount = Object.values(documentData).filter(file => 
    file && (file instanceof File || (typeof file === 'object' && file !== null) || typeof file === 'string')
  ).length;
  const requiredCount = 3; // medicalLicense, boardCertificate, malpracticeInsurance
  const totalCount = 4;

  return (
    <form onSubmit={handleFormSubmit} data-formik-form>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-100 p-3 sm:p-6">
        <div className="max-w-6xl mx-auto">
        {/* Modern Header */}
        <div className="text-center mb-8 sm:mb-12 relative">
          <div className="absolute -top-4 sm:-top-6 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-1 bg-gradient-to-r from-purple-500
           to-pink-500 rounded-full animate-pulse"></div>
          
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500
           to-pink-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          
          <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text 
          text-transparent mb-2 sm:mb-3 leading-tight">
            Document Upload
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-medium px-2">
            Upload your professional documents for verification
          </p>
          
          {/* Upload Progress Ring */}
          <div className="flex justify-center mt-4 sm:mt-6">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32" cy="32" r="28"
                  stroke="currentColor" strokeWidth="4"
                  fill="none"
                  className="text-slate-200"
                />
                <circle
                  cx="32" cy="32" r="28"
                  stroke="currentColor" strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${(uploadedCount / totalCount) * 175.929} 175.929`}
                  className="text-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-slate-700">
                  {uploadedCount}/{totalCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Document Upload Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
          <DocumentUpload
            type="medicalLicense"
            title="Medical License"
            description="Upload your current medical license document"
            required={true}
          />

          <DocumentUpload
            type="boardCertificate"
            title="Board Certificate"
            description="Upload your board certification document"
            required={true}
          />

          <DocumentUpload
            type="malpracticeInsurance"
            title="Malpractice Insurance"
            description="Upload proof of current malpractice insurance"
            required={true}
          />

          <DocumentUpload
            type="cv"
            title="Curriculum Vitae"
            description="Upload your current CV or professional resume"
            required={false}
          />
        </div>

        {/* Upload Status Dashboard */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl border border-white/20 mb-6 sm:mb-8">
          <div className="flex items-center mb-4 sm:mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800">Upload Progress</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[
              { key: 'medicalLicense', label: 'Medical License', required: true, icon: Shield, color: 'blue' },
              { key: 'boardCertificate', label: 'Board Certificate', required: true, icon: Award, color: 'emerald' },
              { key: 'malpracticeInsurance', label: 'Malpractice Insurance', required: true, icon: Building, color: 'purple' },
              { key: 'cv', label: 'CV/Resume', required: false, icon: User, color: 'orange' }
            ].map(({ key, label, required, icon: Icon, color }) => {
              const hasDoc = documentData[key] && (documentData[key] instanceof File 
              || (typeof documentData[key] === 'object' && documentData[key] !== null) || typeof documentData[key] === 'string');
              return (
                <div key={key} className={`flex items-center justify-between p-3 sm:p-4 rounded-xl ${
                  hasDoc
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
                    : 'bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200'
                }`}>
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                      hasDoc
                        ? 'bg-gradient-to-r from-green-500 to-green-600'
                        : `bg-gradient-to-r from-${color}-400 to-${color}-600`
                    }`}>
                      {hasDoc ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <Icon className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className={`font-medium text-sm sm:text-base ${
                      hasDoc ? 'text-green-900' : 'text-slate-700'
                    }`}>
                      {label}
                      {required && <span className="text-red-500 ml-1">*</span>}
                    </span>
                  </div>
                  <span className={`text-xs sm:text-sm font-semibold px-2 py-1 rounded-lg ${
                    hasDoc
                      ? 'text-green-700 bg-green-100' 
                      : required 
                      ? 'text-orange-700 bg-orange-100' 
                      : 'text-slate-600 bg-slate-100'
                  }`}>
                    {hasDoc ? 'Uploaded' : required ? 'Required' : 'Optional'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress Summary */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-xs font-bold">{uploadedCount}</span>
                </div>
                <span className="text-blue-900 font-semibold text-sm sm:text-base">
                  {uploadedCount} of {totalCount} documents uploaded
                </span>
              </div>
              {uploadedCount >= requiredCount && (
                <div className="flex items-center text-green-600">
                  <Check className="w-4 h-4 mr-1" />
                  <span className="text-xs sm:text-sm font-medium">Ready to proceed</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Document Requirements */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl border border-amber-200 mb-6 sm:mb-8">
          <div className="flex items-start">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center mr-3 mt-1 flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-amber-900 mb-3">Document Requirements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-amber-800 text-sm sm:text-base">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-amber-600 mr-2 flex-shrink-0" />
                  <span>Clear and legible documents</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-amber-600 mr-2 flex-shrink-0" />
                  <span>Current and not expired</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-amber-600 mr-2 flex-shrink-0" />
                  <span>Maximum 10MB per file</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-amber-600 mr-2 flex-shrink-0" />
                  <span>PDF format preferred</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Process Info */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl border border-indigo-200">
          <div className="flex items-start">
            <Shield className="w-8 h-8 text-indigo-600 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-indigo-900 mb-2">Verification Process</h3>
              <p className="text-indigo-800 text-sm sm:text-base">
                All uploaded documents undergo thorough verification by our credentialing team. 
                This process typically takes 2-3 business days. You'll receive email notifications 
                about the status of your document verification and any additional requirements.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile spacing */}
        <div className="h-20 sm:h-8"></div>
      </div>
    </div>
    {/* Hidden submit button that DoctorOnboarding can find and click */}
    <button type="submit" className="sr-only" aria-hidden="true">Submit</button>
    </form>
  );
};

export default DocumentsStep;