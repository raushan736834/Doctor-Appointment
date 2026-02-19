export const cancelAppointment = async (
  appointment,
  toast,
  setIsLoading,
  api,
  onSuccess = null,
  onError = null
) => {
  if (!appointment) {
    console.error("No appointment provided for cancellation");
    return false;
  }

  setIsLoading(true);

  try {
    // Cancel the appointment
    const cancelData = {
      cancelledBy: "PATIENT",
      appointmentId: appointment.appointmentId,
    };

    console.log("Cancelling appointment:", appointment.appointmentId);
    console.log("Cancel data:", cancelData)
    const response = await api.put(
      `appointment/common/cancel-appointment`,
      cancelData
    );
    console.log(response);
    if (response?.success) {
      // Show success toast
      toast({
        position: "top-center",
        title: "Appointment Successfully Cancelled!",
        description: `Your appointment with ${
          appointment.doctor?.doctorName || "the doctor"
        } has been cancelled`,
        status: "success",
        duration: 1500,
        isClosable: true,
        containerStyle: { marginTop: 20, marginRight: 5 },
      });

      // Execute success callback if provided
      if (onSuccess && typeof onSuccess === "function") {
        onSuccess(appointment);
      }

      return true;
    } else {
      throw new Error("Appointment cancellation failed");
    }
  } catch (error) {
    console.error("Error cancelling appointment:", error);

    // Show error toast
    toast({
      position: "top-center",
      title: "Appointment Cancellation Failed",
      description: error.message || "Please try again later",
      status: "error",
      duration: 1500,
      isClosable: true,
      containerStyle: { marginTop: 20, marginRight: 5 },
    });

    // Execute error callback if provided
    if (onError && typeof onError === "function") {
      onError(error, appointment);
    }

    return false;
  } finally {
    setIsLoading(false);
  }
};

export const cancelAppointmentByDoctor = async (
  appointment,
  cancelReason,
  toast,
  setIsLoading,
  api,
  onSuccess = null,
  onError = null
) => {
  if (!appointment) {
    console.error("No appointment provided for cancellation");
    return false;
  }

  if (!cancelReason || !cancelReason.trim()) {
    console.error("Cancel reason is required");
    return false;
  }

  setIsLoading(true);

  try {
    // Cancel the appointment with doctor reason
    const cancelData = {
      cancelledBy: "DOCTOR",
      appointmentId: appointment.appointmentId || appointment.id,
      reason: cancelReason.trim(),
    };

    const response = await api.put(
      `appointment/common/cancel-appointment`,
      cancelData
    );

    if (response?.success) {
      // Show success toast
      toast({
        position: "top-center",
        title: "Appointment Successfully Cancelled!",
        description: `Appointment with ${
          appointment.fullName || appointment.patientName
        } has been cancelled. Patient will be notified.`,
        status: "success",
        duration: 2000,
        isClosable: true,
        containerStyle: { marginTop: 20, marginRight: 5 },
      });

      // Execute success callback if provided
      if (onSuccess && typeof onSuccess === "function") {
        onSuccess(appointment, cancelReason);
      }

      return true;
    } else {
      throw new Error("Appointment cancellation failed");
    }
  } catch (error) {
    console.error("Error cancelling appointment:", error);

    // Show error toast
    toast({
      position: "top-center",
      title: "Appointment Cancellation Failed",
      description: error.response?.data || "Please try again later",
      status: "error",
      duration: 2000,
      isClosable: true,
      containerStyle: { marginTop: 20, marginRight: 5 },
    });

    // Execute error callback if provided
    if (onError && typeof onError === "function") {
      onError(error, appointment);
    }

    return false;
  } finally {
    setIsLoading(false);
  }
};

export const markAppointmentAsCompleted = async (
  appointment,
  toast,
  setIsLoading,
  api,
  onSuccess = null,
  onError = null
) => {
  if (!appointment) {
    console.error("No appointment provided for completion");
    return false;
  }
  setIsLoading(true);

  try {
    const response = await api.get(`/appointment/doctor/mark-complete/${appointment.appointmentId}`);
    if(response.success){
      toast({
        position: "top-center",
        title: "Appointment Successfully Marked as Completed!",
        description: `Appointment with ${appointment.fullName || appointment.patientName} has been marked as completed.`,
        status: "success",
        duration: 2000,
        isClosable: true,
        containerStyle: { marginTop: 20, marginRight: 5 },
      });
      if(onSuccess && typeof onSuccess === "function"){
        onSuccess(appointment);
      }
      return true;
    } else {
      throw new Error("Appointment completion failed");
    }
  } catch (error) {
    console.error("Error marking appointment as completed:", error);
    toast({
      position: "top-center",
      title: "Appointment Completion Failed",
      description: error.response?.data || "Please try again later",
      status: "error",
      duration: 1500,
      isClosable: true,
      containerStyle: { marginTop: 20, marginRight: 5 },
    });

    // Execute error callback if provided
    if (onError && typeof onError === "function") {
      onError(error, appointment);
    }

    return false;
  } finally {
    setIsLoading(false);
  }
}