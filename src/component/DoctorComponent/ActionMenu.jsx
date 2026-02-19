import { BsThreeDotsVertical } from "react-icons/bs";
import React, { useRef } from "react";
import useOutsideClick from "../../hooks/useClickOutside";

const ActionMenu = ({
  onView = () => {},
  onReschedule = () => {},
  onCancelAppointment = () => {},
  markAsCompleted = () => {},
  appointment = {},
  isOpen,
  toggle,
}) => {
  const menuRef = useRef(null);

  // Close on outside click
  useOutsideClick(menuRef, () => {
    if (isOpen) toggle();
  });

  const handleCancelClick = () => {
    onCancelAppointment(appointment);
    toggle();
  };

  const handleViewClick = () => {
    onView(appointment);
    toggle();
  };

  const handleRescheduleClick = () => {
    onReschedule(appointment);
    toggle();
  };

  const handleMarkCompletedClick = () => {
    markAsCompleted(appointment);
    toggle();
  };

  // Don't show cancel option if appointment is already cancelled or completed
  const canCancel = appointment.status !== "CANCELLED" && appointment.status !== "COMPLETED";
  const canReschedule = appointment.status !== "CANCELLED" && appointment.status !== "COMPLETED";

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={toggle}
        className="text-lg hover:text-indigo-600 transition p-2 rounded-full hover:bg-gray-100"
        aria-label="More options"
      >
        <BsThreeDotsVertical />
      </button>

      {isOpen && (
        <div className="origin-bottom-right absolute bottom-full right-0 mb-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            <button
              onClick={handleViewClick}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left transition-colors"
            >
              View Details
            </button>
            
            {canReschedule && (
              <button
                onClick={handleRescheduleClick}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left transition-colors"
              >
                Reschedule
              </button>
            )}

            {appointment.status !== "COMPLETED" && appointment.status !== "CANCELLED" && (
              <button
                onClick={handleMarkCompletedClick}
                className="block w-full px-4 py-2 text-sm text-emerald-400 hover:bg-emerald-50 text-left transition-colors"
              >
                Mark As Completed
              </button>
            )}

            {canCancel && (
              <>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={handleCancelClick}
                  className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left transition-colors"
                >
                  Cancel Appointment
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;