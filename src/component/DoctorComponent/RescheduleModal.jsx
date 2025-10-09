import React, { useState } from "react";
import { Edit3 } from 'lucide-react';
import { useToast } from "@chakra-ui/react";
import AppointmentForm from "../UserComponent/AppointmentForm";
import { useAuth } from "../GlobalComponent/AuthProvider";
import { AppointmentStatus } from "../../constants/slots";
import { useApiService } from "../../hooks/useAuthWithAxios";


const RescheduleModal = ({
  selectedAppointment,
  onClose,
  onRescheduleSuccess,
}) => {
  const [newData, setNewData] = useState({
    id: "",
    date: "",
    time: "",
    period: "",
  });

  const { setIsLoading } = useAuth();
  const api = useApiService();
  const toast = useToast();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!selectedAppointment) return null;

  const handleRescheduleApi = async ({
    appointmentId,
    newDate,
    newTime,
    newPeriod,
  }) => {
    setNewData({
      id: appointmentId,
      date: newDate,
      time: newTime,
      period: newPeriod,
    });
  };

  const confirmRescheduleAppointment = async () => {
    setIsLoading(true);
    try {
      const data = {
        appointmentId: newData.id,
        date: newData.date,
        time: newData.time,
        period: newData.period,
        status: AppointmentStatus.RESCHEDULED,
      };

      console.log(data);
      const response = await api.put(
        `appointment/reschedule-appointment`,
        data
      );

      if (response.status === 200) {
        toast({
          position: "top-center",
          title: "Appointment Rescheduled successfully!",
          status: "success",
          duration: 1500,
          isClosable: true,
          containerStyle: { marginTop: 20, marginRight: 5 },
        });

        // Close modal and refresh appointments
        if (onRescheduleSuccess) {
          await onRescheduleSuccess();
        }
      } else {
        toast({
          position: "top-center",
          title: "Appointment Rescheduling Fails!",
          status: "error",
          duration: 1500,
          isClosable: true,
          containerStyle: { marginTop: 20, marginRight: 5 },
        });
      }
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      toast({
        position: "top-center",
        title: "Error rescheduling appointment",
        description: "Please try again later",
        status: "error",
        duration: 1500,
        isClosable: true,
        containerStyle: { marginTop: 20, marginRight: 5 },
      });
    } finally {
      onClose();
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2">
  <div className="bg-white/90 backdrop-blur-xl rounded-3xl max-w-md w-full p-4 shadow-2xl border border-white/20
   max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-2">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full 
          flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <Edit3 className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            Reschedule Appointment
          </h3>
          <p className="text-gray-600">
            Reschedule your appointment with {selectedAppointment.doctor.doctorName}
            <span className="font-semibold text-gray-800">
              {selectedAppointment?.doctor.name}
            </span>
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-2">
          <p className="text-sm text-blue-800">
            <strong>Current:</strong>{" "}
            {selectedAppointment && formatDate(selectedAppointment.date)} at{" "}
            {selectedAppointment?.time}
          </p>
        </div>
        <AppointmentForm
          id={
            selectedAppointment.doctorId || selectedAppointment.doctor?.id
          }
          specialization={
            selectedAppointment.doctor?.specialization ||
            selectedAppointment.specialization
          }
          isReschedule={true}
          appointmentId={selectedAppointment.appointmentId}
          onSelectionChange={handleRescheduleApi}
          onClose={onClose}
        />

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 bg-white border-gray-200 text-gray-700 
            rounded-xl font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmRescheduleAppointment}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-blue-500/40 transition-all"
          >
            Reschedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleModal;
