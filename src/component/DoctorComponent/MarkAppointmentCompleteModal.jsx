import React, { useState } from "react";
import { CheckCircle, X, AlertCircle } from "lucide-react";

const MarkAppointmentCompleteModal = ({ 
  isOpen,
  onClose,
  onConfirm,
  appointment,
  isLoading = false,
}) => {  
  const handleConfirm = async () => {
    try {
      if (!appointment) {
        alert("No appointment details found");
        return;
      }

      await onConfirm();
    } catch (error) {
      console.error("Error in handleConfirm:", error);
      alert("Failed to mark appointment as completed. Please try again.");
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
        {/* Decorative top bar */}
        <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"></div>
        
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-200">
              <CheckCircle className="w-9 h-9 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Complete Appointment?
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
              Confirm that this appointment has been successfully completed
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 space-y-4">
          {/* Info card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-blue-900 text-sm mb-1">
                  Patient Notification
                </p>
                <p className="text-blue-700 text-sm leading-relaxed">
                  The patient will receive an instant notification confirming the completion of their appointment.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleClose}
              className="flex-1 px-5 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Confirming...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Mark Complete</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkAppointmentCompleteModal;