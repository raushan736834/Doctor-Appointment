import React,{useState, useEffect} from 'react';

import { User, Briefcase, GraduationCap, Clock, FileText,Shield, Check, AlertTriangle,Edit, ChevronLeft, ChevronRight } from 'lucide-react';

const ReviewStep = ({ doctorData, updateData, onNavigateToStep, onValidationChange }) => {
  console.log(doctorData);
  const [expandedSections, setExpandedSections] = useState({});
  const [focusedAgreement, setFocusedAgreement] = useState(null);
  
  // Local state to track agreement checkboxes
  const [agreements, setAgreements] = useState({
    termsAccepted: doctorData?.agreements?.termsAccepted || false,
    privacyAccepted: doctorData?.agreements?.privacyAccepted || false,
    backgroundCheck: doctorData?.agreements?.backgroundCheck || false,
  });

  const handleAgreementChange = (field, value) => {
    const updatedAgreements = {
      ...agreements,
      [field]: value
    };
    setAgreements(updatedAgreements);
    updateData('agreements', { [field]: value });
  };

  // Notify parent when agreements change
  useEffect(() => {
    if (onValidationChange) {
      const allAgreementsAccepted = Object.values(agreements).every(Boolean);
      onValidationChange({ allAgreementsAccepted });
    }
  }, [agreements, onValidationChange]);

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const InfoSection = ({ icon: Icon, title, children, iconColor = 'from-blue-500 to-blue-600', sectionKey, defaultExpanded = true, editStep, maxHeight = 'max-h-96' }) => {
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
        
        <div className={`transition-all duration-500 ease-in-out ${isExpanded ? `${maxHeight} opacity-100` : 'max-h-0 opacity-0'} overflow-y-auto`}>
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

  // Format operating hours for display
  const formatOperatingHours = (operatingHours) => {
    if (!operatingHours) return 'Not provided';
    
    const dayLabels = {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',
      MONDAY: 'Monday',
      TUESDAY: 'Tuesday',
      WEDNESDAY: 'Wednesday',
      THURSDAY: 'Thursday',
      FRIDAY: 'Friday',
      SATURDAY: 'Saturday',
      SUNDAY: 'Sunday'
    };

    const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    let hoursArray = [];

    // If it's an array (from backend)
    if (Array.isArray(operatingHours)) {
      hoursArray = operatingHours.map((day) => ({
        day: dayLabels[day.days] || day.days,
        open: day.open,
        close: day.close,
        isClosedToday: day.isClosedToday
      }));
    } 
    // If it's an object (from form)
    else if (typeof operatingHours === 'object') {
      hoursArray = dayOrder.map((dayKey) => {
        const hours = operatingHours[dayKey];
        if (!hours) return null;
        return {
          day: dayLabels[dayKey] || dayKey.charAt(0).toUpperCase() + dayKey.slice(1),
          open: hours.open,
          close: hours.close,
          isClosedToday: hours.isClosedToday
        };
      }).filter(Boolean);
    }

    if (hoursArray.length === 0) return 'Not provided';

    return hoursArray.map((item) => {
      if (item.isClosedToday) {
        return `${item.day}: Closed`;
      }
      return `${item.day}: ${item.open || 'N/A'} - ${item.close || 'N/A'}`;
    }).join(', ');
  };

  // Component to display operating hours in a structured format
  const OperatingHoursDisplay = ({ operatingHours, splitColumn }) => {
    if (!operatingHours) return <span className="text-slate-400">Not provided</span>;
    
    const dayLabels = {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',
      MONDAY: 'Monday',
      TUESDAY: 'Tuesday',
      WEDNESDAY: 'Wednesday',
      THURSDAY: 'Thursday',
      FRIDAY: 'Friday',
      SATURDAY: 'Saturday',
      SUNDAY: 'Sunday'
    };

    const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    let hoursArray = [];

    // If it's an array (from backend)
    if (Array.isArray(operatingHours)) {
      hoursArray = operatingHours.map((day) => ({
        day: dayLabels[day.days] || day.days,
        open: day.open,
        close: day.close,
        isClosedToday: day.isClosedToday
      }));
    } 
    // If it's an object (from form)
    else if (typeof operatingHours === 'object') {
      hoursArray = dayOrder.map((dayKey) => {
        const hours = operatingHours[dayKey];
        if (!hours) return null;
        return {
          day: dayLabels[dayKey] || dayKey.charAt(0).toUpperCase() + dayKey.slice(1),
          open: hours.open,
          close: hours.close,
          isClosedToday: hours.isClosedToday
        };
      }).filter(Boolean);
    }

    if (hoursArray.length === 0) return <span className="text-slate-400">Not provided</span>;

    // Split the array if splitColumn prop is provided
    let displayArray = hoursArray;
    if (splitColumn) {
      const midPoint = Math.ceil(hoursArray.length / 2);
      displayArray = splitColumn === 'left' 
        ? hoursArray.slice(0, midPoint)
        : hoursArray.slice(midPoint);
    }

    return (
      <div className="space-y-2">
        {displayArray.map((item, index) => (
          <div key={index} className="text-sm">
            <span className="font-medium text-slate-700">{item.day}:</span>{' '}
            {item.isClosedToday ? (
              <span className="text-slate-500 italic">Closed</span>
            ) : (
              <span className="text-slate-700">
                {item.open || 'N/A'} - {item.close || 'N/A'}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Normalize documents data - handle both array and object formats
  const normalizeDocuments = (documents) => {
    if (!documents) return {};
    
    // If it's an array (from backend - doctorDocument or doctorDocuments)
    if (Array.isArray(documents)) {
      const normalized = {};
      documents.forEach((doc) => {
        if (!doc) return;
        
        // Try to match by documentType first (most reliable)
        if (doc.documentType) {
          const docType = doc.documentType.toLowerCase().replace(/\s+/g, '');
          let key = '';
          
          if (docType.includes('medicallicense') || docType.includes('license')) {
            key = 'medicalLicense';
          } else if (docType.includes('boardcertificate') || docType.includes('board')) {
            key = 'boardCertificate';
          } else if (docType.includes('malpractice') || docType.includes('insurance')) {
            key = 'malpracticeInsurance';
          } else if (docType.includes('cv') || docType.includes('resume')) {
            key = 'cv';
          } else {
            key = docType;
          }
          
          if (key) {
            normalized[key] = {
              fileName: doc.fileName,
              fileData: doc.fileData,
              fileType: doc.fileType,
              fileUrl: doc.fileUrl || doc.filePath || doc.url,
              uploadedAt: doc.uploadedAt,
              ...doc
            };
          }
        } else if (doc.fileName) {
          // Map fileName to document key
          const fileName = doc.fileName.toLowerCase();
          let key = '';
          
          if (fileName.includes('medical') || fileName.includes('license')) {
            key = 'medicalLicense';
          } else if (fileName.includes('board') || fileName.includes('certificate')) {
            key = 'boardCertificate';
          } else if (fileName.includes('malpractice') || fileName.includes('insurance')) {
            key = 'malpracticeInsurance';
          } else if (fileName.includes('cv') || fileName.includes('resume')) {
            key = 'cv';
          }
          
          if (key) {
            normalized[key] = {
              fileName: doc.fileName,
              fileData: doc.fileData,
              fileType: doc.fileType,
              fileUrl: doc.fileUrl || doc.filePath || doc.url,
              uploadedAt: doc.uploadedAt,
              ...doc
            };
          }
        }
      });
      return normalized;
    }
    
    // If it's already an object, return as is (but ensure it has the right structure)
    const result = {};
    Object.keys(documents).forEach((key) => {
      const doc = documents[key];
      if (doc) {
        result[key] = typeof doc === 'object' ? {
          fileName: doc.fileName || doc.name || key,
          fileData: doc.fileData,
          fileType: doc.fileType,
          fileUrl: doc.fileUrl || doc.filePath || doc.url,
          uploadedAt: doc.uploadedAt,
          ...doc
        } : doc;
      }
    });
    return result;
  };

  const normalizedDocuments = normalizeDocuments(
    doctorData.documents || doctorData.doctorDocument || doctorData.doctorDocuments
  );

  const requiredDocuments = [
    { key: 'medicalLicense', label: 'Medical License' },
    { key: 'boardCertificate', label: 'Board Certificate' },
    { key: 'malpracticeInsurance', label: 'Malpractice Insurance' }
  ];

  const allRequiredDocsUploaded = requiredDocuments.every(
    doc => {
      const docData = normalizedDocuments[doc.key];
      return docData && (
        docData instanceof File || 
        (typeof docData === 'object' && docData !== null) || 
        typeof docData === 'string' ||
        docData.fileName ||
        docData.fileData
      );
    }
  );

  const allAgreementsAccepted = Object.values(agreements).every(Boolean);

  const completionPercentage = Math.round(
    ((Object.values(agreements).filter(Boolean).length) / 3 + 
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
                <InfoRow label="Date of Birth" value={doctorData.personalInfo?.dob || 'Not provided'} accent="blue" />
              </div>
              <div className="space-y-1">
                <InfoRow label="Gender" value={doctorData.personalInfo?.gender || 'Not provided'} accent="blue" />
                <InfoRow label="Street Address" value={doctorData.personalInfo?.address || 'Not provided'} accent="blue" />
                <InfoRow label="Location" value={`${doctorData.personalInfo?.city || ''}, ${doctorData.personalInfo?.state || ''}, ${doctorData.personalInfo?.pincode || ''}`} accent="blue" />
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
                <InfoRow label="License Number" value={doctorData.professionalInfo?.medicalLicenseNumber || 'Not provided'} accent="purple" />
                <InfoRow label="Specialization" value={doctorData.professionalInfo?.specialization || 'Not provided'} accent="purple" />
                <InfoRow label="Sub-specialty" value={doctorData.professionalInfo?.subSpeciality || 'Not provided'} accent="purple" />
                <InfoRow label="Medical Council" value={doctorData.professionalInfo?.medicalCouncil || 'Not provided'} accent="purple" />
                <InfoRow label="Bio" value={doctorData.professionalInfo?.bio || 'Not provided'} accent="purple" />
              </div>
              <div className="space-y-1">
                <InfoRow label="Years of Experience" value={doctorData.professionalInfo?.yearOfExp || 'Not provided'} accent="purple" />
                <InfoRow label="Current Hospital" value={doctorData.professionalInfo?.currentHospital || 'Not provided'} accent="purple" />
                <InfoRow label="Consultation Fees" value={`₹ ${doctorData.professionalInfo?.consultationFees || 'Not provided'}`} accent="purple" />
                <InfoRow label="Languages Known" value={`${doctorData.professionalInfo?.languageKnown || 'Not provided'}`} accent="purple" />
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Medical School */}
              <div className="space-y-1">
                <InfoRow label="Medical School" value={doctorData.education[0]?.schoolName || 'Not provided'} accent="green" />
                <InfoRow label="Completion Year" value={doctorData.education[0]?.completionYear || 'Not provided'} accent="green" />
                <InfoRow label="Degree Type" value={doctorData.education[0]?.degreeName || 'Not provided'} accent="green" />
              </div>
              {/*Residency School */}
              <div className="space-y-1">
                <InfoRow label="Residency Institution" value={doctorData.education[1]?.schoolName || 'Not provided'} accent="green" />
                <InfoRow label="Completion Year" value={doctorData.education[1]?.completionYear || 'Not provided'} accent="green" />
                <InfoRow label="Primary Speciality" value={doctorData.education[1]?.degreeName || 'Not provided'} accent="green" />
              </div>
              {/*FellowShip Training */}
              <div className="space-y-1">
                <InfoRow label="Fellowship Institution" value={doctorData.education[2]?.completionYear || 'Not provided'} accent="green" />
                <InfoRow label="Completion Year" value={doctorData.education[2]?.schooleName || 'Not provided'} accent="green" />
                <InfoRow label="Fellowship Speciality" value={doctorData.education[2]?.degreeName || 'Not provided'} accent="green" />
              </div>
            </div>
          </InfoSection>

          {/* Availability */}
          <InfoSection 
            icon={Clock} 
            title="Clinic Infomation" 
            iconColor="from-green-500 to-emerald-600"
            sectionKey="availability"
            editStep={4}
            maxHeight="max-h-[600px]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-1">
                <InfoRow label="Clinic Name" value={doctorData.clinicInfos?.clinicName || 'Not provided'} accent='orange' />
                <InfoRow label="Clinic Type" value={doctorData.clinicInfos?.clinicType || 'Not provided'} accent='orange' />
                <InfoRow label="Clinic Email" value={doctorData.clinicInfos?.clinicEmail || 'Not provided'} accent="orange" />
                <InfoRow label="Clinic Address" value={doctorData.clinicInfos?.clinicAddress || 'Not provided'} accent="orange" />
                <InfoRow label="Clinic State" value={doctorData.clinicInfos?.clinicState || 'Not provided'} accent="orange" />
                <InfoRow label="Consulatation Duration" value={`${doctorData.clinicInfos?.consultationDuration || 'Not provided'} minutes`} accent="orange" />
              </div>
              <div className="space-y-1">
                <InfoRow label="Established Year" value={doctorData.clinicInfos?.establishedYear || 'Not provided'} accent='orange' />
                <InfoRow label="Clinic Phone" value={doctorData.clinicInfos?.clinicPhone || 'Not provided'} accent='orange' />
                <InfoRow label="Clinic Address" value={doctorData.clinicInfos?.clinicAddress || 'Not provided'} accent="orange" />
                <InfoRow label="Clinic City" value={doctorData.clinicInfos?.clinicCity || 'Not provided'} accent="orange" />
                <InfoRow label="Clinic Pincode" value={doctorData.availability?.clinicPincode || 'Not provided'} accent="orange" />
              </div>
            </div>
            {/* Operating Hours - Full Width with Two Columns */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
                <span className="font-semibold text-orange-600 text-sm mb-2 sm:mb-0">Operating Hours:</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <OperatingHoursDisplay operatingHours={doctorData.clinicInfos?.operatingHours} splitColumn="left" />
                <OperatingHoursDisplay operatingHours={doctorData.clinicInfos?.operatingHours} splitColumn="right" />
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
              ].map(({ key, label, required }) => {
                const docData = normalizedDocuments[key];
                const hasDocument = docData && (
                  docData instanceof File || 
                  (typeof docData === 'object' && docData !== null) || 
                  typeof docData === 'string' ||
                  docData.fileName ||
                  docData.fileData
                );
                
                const getFileName = () => {
                  if (!docData) return '';
                  if (docData instanceof File) return docData.name;
                  if (docData.fileName) return docData.fileName;
                  if (typeof docData === 'string') return docData.split('/').pop() || docData;
                  return 'Document uploaded';
                };

                return (
                  <div key={key} className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 shadow-sm
                   hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-700 text-sm">
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                      </span>
                      <div className="flex items-center">
                        {hasDocument ? (
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
                    {hasDocument && (
                      <div className="mt-2 pt-2 border-t border-slate-200">
                        <div className="flex items-center text-xs text-slate-600">
                          <FileText className="w-3 h-3 mr-1" />
                          <span className="truncate">{getFileName()}</span>
                        </div>
                        {docData.fileType && (
                          <div className="text-xs text-slate-500 mt-1">
                            Type: {docData.fileType}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
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
                      checked={agreements[key] || false}
                      onChange={(e) => handleAgreementChange(key, e.target.checked)}
                      className="w-5 h-5 text-blue-600 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500
                       focus:border-blue-500 mr-3 mt-0.5 transition-colors duration-200"
                    />
                    {agreements[key] && (
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