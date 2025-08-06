import React, { useState } from "react";
import { FiX, FiAlertTriangle } from "react-icons/fi";

const CancelReasonModal = ({
  isOpen,
  onClose,
  onConfirm,
  appointment,
  isLoading = false,
}) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const predefinedReasons = [
    "Medical Emergency",
    "Doctor Unavailable",
    "Equipment Malfunction",
    "Patient Rescheduled",
    "Administrative Issue",
    "Weather/Transportation",
    "Other",
  ];

  const handleConfirm = async () => {
    try {
      // Get the final reason based on selection
      const finalReason =
        selectedReason === "Other" ? customReason : selectedReason;

      // Validation
      if (!finalReason?.trim()) {
        alert("Please select or enter a reason for cancellation");
        return;
      }

      if (selectedReason === "Other" && customReason.trim().length < 10) {
        alert("Please provide a more detailed reason (at least 10 characters)");
        return;
      }

      if (!appointment) {
        alert("No appointment details found");
        return;
      }

      // Call the parent's onConfirm with the reason
      await onConfirm(finalReason);
      
      // Close the modal after successful confirmation
      handleClose();
    } catch (error) {
      console.error("Error in handleConfirm:", error);
      alert("Failed to cancel appointment. Please try again.");
    } finally{
      handleClose();
    }

  };

  const handleClose = () => {
    setSelectedReason("");
    setCustomReason("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <FiAlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Cancel Appointment
              </h3>
              <p className="text-sm text-gray-500">
                {appointment?.name} - {appointment?.doctor?.doctorName}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-2 space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Please select a reason for cancelling this appointment:
            </p>

            <div className="space-y-2">
              {predefinedReasons.map((reason) => (
                <label
                  key={reason}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-gray-700">{reason}</span>
                </label>
              ))}
            </div>

            {/* Custom reason input */}
            {selectedReason === "Other" && (
              <div className="mt-4">
                <textarea
                  placeholder="Please specify the reason..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  rows="3"
                  disabled={isLoading}
                />
              </div>
            )}
          </div>

          {/* Warning message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <FiAlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Important:</p>
                <p>
                  The patient will be notified immediately about this
                  cancellation.
                  {appointment?.payment === "Paid" &&
                    " Any payments will be refunded automatically."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 pt-0">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            disabled={isLoading}
          >
            Keep Appointment
          </button>
          <button
            onClick={handleConfirm}
            disabled={
              isLoading ||
              !selectedReason ||
              (selectedReason === "Other" && !customReason.trim())
            }
            className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Cancelling...</span>
              </>
            ) : (
              <span>Cancel Appointment</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelReasonModal;
