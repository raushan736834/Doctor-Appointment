import { BsThreeDotsVertical } from "react-icons/bs";
import React, { useRef } from "react";
import useOutsideClick from "../../hooks/useClickOutside";

const ActionMenu = ({
  onView = () => {},
  onReschedule = () => {},
  onSendReminder = () => {},
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

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={toggle}
        className="text-lg hover:text-indigo-600 transition"
      >
        <BsThreeDotsVertical />
      </button>

      {isOpen && (
        <div className="origin-bottom-right absolute bottom-full right-0 mb-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            <button
              onClick={() => {
                onView(appointment);
                toggle();
              }}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
            >
              View Details
            </button>
            <button
              onClick={() => {
                onReschedule(appointment);
                toggle();
              }}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
            >
              Reschedule
            </button>
            <button
              onClick={() => {
                onSendReminder(appointment);
                toggle();
              }}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
            >
              Cancel Appointment
            </button>
            <button
              onClick={() => {
                markAsCompleted(appointment);
                toggle();
              }}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
            >
              Mark As Completed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
