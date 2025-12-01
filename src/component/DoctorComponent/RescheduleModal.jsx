import { useState } from "react";
import { Edit3, Loader2, X } from 'lucide-react';
import { useToast } from "@chakra-ui/react";
import AppointmentForm from "../UserComponent/AppointmentForm";
import { useApiService } from "../../hooks/useAuthWithAxios";
const RescheduleModal = ({ selectedAppointment, onClose, onRescheduleSuccess }) => {
  const [newData, setNewData] = useState({ id: "", date: "", time: "" });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const api = useApiService();

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

  const handleRescheduleApi = async ({ appointmentId, newDate, newTime }) => {
    setNewData({ id: appointmentId, date: newDate, time: newTime });
  };
  
  const confirmRescheduleAppointment = async () => {
    console.log(newData)
    if (!newData.date || !newData.time) {
      alert("Please select both date and time slot");
      return;
    }
    console.log("set")
    setIsLoading(true);
    try {
      const data = {
        appointmentId: newData.id,
        newDate: newData.date,
        newTimeSlot: newData.time
      };

      const response = await api.put('appointment/reschedule-appointment', data);
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
        
        // Create updated appointment object
        const updatedAppointment = {
          ...selectedAppointment,
          date: newData.date,
          time: newData.time,
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
                  with Dr. {selectedAppointment?.doctor?.firstName} {selectedAppointment?.doctor?.lastName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
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
              <span className="font-semibold">Date:</span> {formatDate(selectedAppointment.date)}
              <span className="mx-3">•</span>
              <span className="font-semibold">Time:</span> {selectedAppointment?.time}
            </p>
          </div>

          {/* New Appointment Selection */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Select New Date & Time</h4>
            <AppointmentForm
              id={selectedAppointment?.doctor?.doctorId}
              isReschedule={true}
              appointmentId={selectedAppointment.appointmentId}
              onSelectionChange={handleRescheduleApi}
              onClose={onClose}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmRescheduleAppointment}
              disabled={isLoading || !newData.date || !newData.time}
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