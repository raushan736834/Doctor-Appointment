import React, { useState, useEffect } from 'react';

const NotificationToast = ({ notification, onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!isVisible) return null;

  const getToastColor = (type) => {
    switch (type) {
      case 'APPOINTMENT_CANCELLED':
        return 'bg-red-500 border-red-600';
      case 'APPOINTMENT_RESCHEDULED':
        return 'bg-yellow-500 border-yellow-600';
      default:
        return 'bg-blue-500 border-blue-600';
    }
  };

  const getToastIcon = (type) => {
    switch (type) {
      case 'APPOINTMENT_CANCELLED':
        return (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'APPOINTMENT_RESCHEDULED':
        return (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`max-w-sm w-full ${getToastColor(notification.type)} 
                  text-white p-4 rounded-lg shadow-lg border-l-4 z-50 transform transition-all duration-300 
                  ${isClosing ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getToastIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{notification.title}</h4>
          <p className="text-sm mt-1 opacity-90 leading-relaxed">{notification.message}</p>
          {notification.appointmentId && (
            <button 
              className="text-sm underline opacity-90 hover:opacity-100 mt-2"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Navigate to appointment:', notification.appointmentId);
              }}
            >
              View Details
            </button>
          )}
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-white hover:text-gray-200 focus:outline-none transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="mt-3">
        <div className="bg-white bg-opacity-20 rounded-full h-1">
          <div 
            className="bg-white h-1 rounded-full"
            style={{
              animation: `shrink ${duration}ms linear forwards`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;