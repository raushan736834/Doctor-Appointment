// src/components/RescheduleModal.jsx
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import AppointmentForm from "../UserComponent/AppointmentForm";
import api from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";

const RescheduleModal = ({
  rescheduleAppointment,
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
  const toast = useToast();

  if (!rescheduleAppointment) return null;

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
        onClose();
        if (onRescheduleSuccess) {
          onRescheduleSuccess();
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
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <AppointmentForm
          id={
            rescheduleAppointment.doctorId ||
            rescheduleAppointment.doctor?.id
          }
          specialization={
            rescheduleAppointment.doctor?.specialization ||
            rescheduleAppointment.specialization
          }
          isReschedule={true}
          appointmentId={rescheduleAppointment.appointmentId}
          onSelectionChange={handleRescheduleApi}
          onClose={onClose}
        />
        <div className="flex justify-center gap-x-4">
          <button
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={confirmRescheduleAppointment}
          >
            Confirm Reschedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleModal;