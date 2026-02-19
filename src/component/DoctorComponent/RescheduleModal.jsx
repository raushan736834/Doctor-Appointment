import { useState, useEffect, useRef } from "react";
import { Edit3, Loader2, X } from 'lucide-react';
import { useToast } from "@chakra-ui/react";
import AppointmentForm from "../UserComponent/AppointmentForm";
import { useApiService, useAuthWithAxios } from "../../hooks/useAuthWithAxios";
const RescheduleModal = ({ selectedAppointment, onClose, onRescheduleSuccess, rescheduledBy }) => {
  const [newData, setNewData] = useState({ id: "", slotId: "", slotTime: "", slotDate: "", displayTime: "" });
  console.log(selectedAppointment)
  const {user} = useAuthWithAxios();
  const doctorId = user?.doctorId || selectedAppointment?.doctorId;
  console.log(user)
  console.log(doctorId);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const api = useApiService();
  const previousSlotIdRef = useRef(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!selectedAppointment) return null;

  // Unlock slot when component unmounts (modal closes or navigates away) or when slotId changes
  useEffect(() => {
    // Capture current slotId in closure for cleanup
    const slotIdToUnlock = newData.slotId;
    
    // Update ref for tracking
    previousSlotIdRef.current = slotIdToUnlock;
    
    // Cleanup: unlock the slot that was current when this effect ran
    // - When slotId changes: unlocks the previous slotId (before change)
    // - When component unmounts: unlocks the current slotId
    return () => {
      if (slotIdToUnlock) {
        api.post("/api/slots/unlock", { slotId: slotIdToUnlock }).catch(console.error);
      }
    };
  }, [newData.slotId, api]);

  const unlockSlot = async (slotId) => {
    if (!slotId) return;
    try {
      await api.post("/api/slots/unlock", { slotId });
    } catch (error) {
      console.error("Error unlocking slot:", error);
    }
  };

  const handleSlotSelect = async (slot) => {
    try {
      const response = await api.post("/api/slots/lock", {
        slotId: slot.slotId
      });

      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      toast({
        title: "Slot already taken",
        status: "error",
        position: "top-right",
      });
      return false;
    }
  };

  const handleRescheduleApi = async ({ appointmentId, slotId, slotTime, slotDate, displayTime }) => {
    // Unlock previous slot if user is changing to a different slot
    if (newData.slotId && newData.slotId !== slotId) {
      await unlockSlot(newData.slotId);
    }

    // Lock the slot when user selects a time
    const lockSuccess = await handleSlotSelect({
      slotId,
      slotDate,
      slotTime,
      displayTime
    });
    
    // Only update state if slot lock was successful
    if (lockSuccess) {
      setNewData({
        id: appointmentId,
        slotId: slotId,
        slotTime: slotTime,
        slotDate: slotDate,
        displayTime: displayTime,
        rescheduledBy: rescheduledBy
      });
    }
  };
  
  const confirmRescheduleAppointment = async () => {
    console.log(newData)
    if (!newData.slotId) {
      alert("Please select a time slot");
      return;
    }
    setIsLoading(true);
    try {
      const data = {
        appointmentId: newData.id,
        newSlotId: newData.slotId,
        rescheduledBy: newData.rescheduledBy
      };

      const response = await api.put('appointment/common/reschedule-appointment', data);
      console.log(response);
      if (response.success) {
        toast({
          position: "top-right",
          title: "Appointment Reschedule successfully",
          status: "success",
          duration: 1000,
          isClosable: true,
          containerStyle: { marginTop: 20, marginRight: 5 },
        });
        
        // Create updated appointment object with new date and time from selected slot
        const updatedAppointment = {
          ...selectedAppointment,
          appointmentDate: newData.slotDate, // New date in YYYY-MM-DD format
          appointmentTime: newData.displayTime || newData.slotTime, // Display time (12-hour format) or fallback to 24-hour
          status: "RESCHEDULED"
        };
        
        if (onRescheduleSuccess) {
          await onRescheduleSuccess(updatedAppointment);
        }
        onClose();
      }
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      alert("Error rescheduling appointment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center">
                <Edit3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  Reschedule Appointment
                </h3>
                <p className="text-blue-100 mt-1">
                  with Dr. {selectedAppointment?.doctorName} 
                </p>
              </div>
            </div>
            <button
              onClick={async () => {
                // Unlock slot when closing modal via X button
                if (newData.slotId) {
                  await unlockSlot(newData.slotId);
                }
                onClose();
              }}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Current Appointment Info */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-blue-900 mb-1">Current Appointment</p>
            <p className="text-blue-800">
              <span className="font-semibold">Date:</span> {formatDate(selectedAppointment?.appointmentDate)}
              <span className="mx-3">•</span>
              <span className="font-semibold">Time:</span> {selectedAppointment?.appointmentTime}
            </p>
          </div>

          {/* New Appointment Selection */}
         { console.log(selectedAppointment)}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Select New Date & Time</h4>
            <AppointmentForm
              id={doctorId}
              isReschedule={true}
              appointmentId={selectedAppointment.appointmentId}
              onSelectionChange={handleRescheduleApi}
              onClose={onClose}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            <button
              onClick={async () => {
                // Unlock slot when canceling/closing modal
                if (newData.slotId) {
                  await unlockSlot(newData.slotId);
                }
                onClose();
              }}
              disabled={isLoading}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmRescheduleAppointment}
              disabled={isLoading || !newData.slotId}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Rescheduling...
                </>
              ) : (
                'Confirm Reschedule'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default RescheduleModal;