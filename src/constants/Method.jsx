import api from '../hooks/useAxios';
import { AppointmentStatus } from './slots';

export const cancelAppointment = async (
  appointment, 
  toast, 
  setIsLoading, 
  onSuccess = null, 
  onError = null
) => {
  if (!appointment) {
    console.error('No appointment provided for cancellation');
    return false;
  }

  setIsLoading(true);

  try {
    // Handle refund for online payments
    if (appointment.selectedPayment === "Online Payment") {
      const paymentId = appointment.payment.paymentId;
      const amount = appointment.doctor.consultationFees;
      const refundData = {
        payId: paymentId,
        amount: amount,
      };

      console.log('Processing refund for payment:', paymentId);
      const razorpayResponse = await api.post("api/payment/refund", refundData);
      
      if (!razorpayResponse || razorpayResponse.status !== 200) {
        throw new Error("Payment refund failed");
      }
      
      console.log("Refund processed successfully:", razorpayResponse.data);
    }

    // Cancel the appointment
    const cancelData = {
      status: AppointmentStatus.CANCELLED,
      doneBy: "PATIENT",
      appointmentId: appointment.appointmentId,
    };

    console.log('Cancelling appointment:', appointment.appointmentId);
    const response = await api.put(`appointment/cancel-appointment`, cancelData);

    if (response.status === 200) {
      // Show success toast
      toast({
        position: "top-center",
        title: "Appointment Successfully Cancelled!",
        description: `Your appointment with ${appointment.doctor?.doctorName || 'the doctor'} has been cancelled`,
        status: "success",
        duration: 1500,
        isClosable: true,
        containerStyle: { marginTop: 20, marginRight: 5 },
      });

      // Execute success callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
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
    if (onError && typeof onError === 'function') {
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
  onSuccess = null, 
  onError = null
) => {
  if (!appointment) {
    console.error('No appointment provided for cancellation');
    return false;
  }

  if (!cancelReason || !cancelReason.trim()) {
    console.error('Cancel reason is required');
    return false;
  }

  setIsLoading(true);

  try {
    // Handle refund for paid appointments
    if (appointment.payment === "Online Payment" || appointment.selectedPayment === "Online Payment") {
      const paymentId = appointment.payment?.paymentId || appointment.paymentId;
      const amount = appointment.doctor?.consultationFees || appointment.total?.replace('£', '');
      
      if (paymentId && amount) {
        const refundData = {
          payId: paymentId,
          amount: parseFloat(amount),
        };

        console.log('Processing refund for payment:', paymentId);
        const razorpayResponse = await api.post("api/payment/refund", refundData);
        
        if (!razorpayResponse || razorpayResponse.status !== 200) {
          throw new Error("Payment refund failed");
        }
        
        console.log("Refund processed successfully:", razorpayResponse.data);
      }
    }

    // Cancel the appointment with doctor reason
    const cancelData = {
      status: AppointmentStatus.CANCELLED,
      doneBy: "DOCTOR",
      appointmentId: appointment.appointmentId || appointment.id,
      reason: cancelReason.trim(),
    };

    const response = await api.put(`appointment/cancel-appointment`, cancelData);

    if (response.status === 200) {
      // Show success toast
      toast({
        position: "top-center",
        title: "Appointment Successfully Cancelled!",
        description: `Appointment with ${appointment.fullName || appointment.patientName} has been cancelled. Patient will be notified.`,
        status: "success",
        duration: 2000,
        isClosable: true,
        containerStyle: { marginTop: 20, marginRight: 5 },
      });

      // Execute success callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
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
      description: error.response.data || "Please try again later",
      status: "error",
      duration: 2000,
      isClosable: true,
      containerStyle: { marginTop: 20, marginRight: 5 },
    });

    // Execute error callback if provided
    if (onError && typeof onError === 'function') {
      onError(error, appointment);
    }

    return false;
  } finally {
    setIsLoading(false);
  }
};
