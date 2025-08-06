import useClickOutside from "../..//hooks/useClickOutside";
import React, { useEffect, useRef } from "react";
import { CgCloseO } from "react-icons/cg";

const Popup = ({
  show,
  title,
  message,
  onClose,
  autoDismiss = true,
  duration = 2000,
  handleCancelAppointment,
  handleRescheduleAppointment,
}) => {
  const ref = useRef();
  
  useClickOutside(ref, () => {
    console.log("Clicked");
    onClose()
  });
  useEffect(() => {
    if (show && autoDismiss) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, autoDismiss, duration, onClose]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
    >
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6 text-center"  ref={ref}>
        <div className="justify-end flex cursor-pointer" onClick={onClose}>
          <CgCloseO />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600">{message}</p>
        <div className="items-center justify-center flex gap-3">
          <button
            onClick={handleRescheduleAppointment}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Back
          </button>
          <button
            onClick={handleCancelAppointment}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Cancel Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
