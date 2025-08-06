import React, { useState, useEffect } from 'react';
import { useNotifications } from './NotificationContext';
import NotificationToast from './NotificationToast';

const ToastContainer = () => {
  const { notifications } = useNotifications();
  const [activeToasts, setActiveToasts] = useState([]);

  useEffect(() => {
    const latestNotification = notifications[0];
    if (latestNotification && !latestNotification.read) {
      const isAlreadyShown = activeToasts.some(toast => toast.id === latestNotification.id);
      if (!isAlreadyShown) {
        setActiveToasts(prev => [...prev, latestNotification]);
      }
    }
  }, [notifications, activeToasts]);

  const removeToast = (notificationId) => {
    setActiveToasts(prev => prev.filter(toast => toast.id !== notificationId));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {activeToasts.map((notification, index) => (
        <div
          key={notification.id}
          style={{ 
            transform: `translateY(${index * 10}px)`,
            zIndex: 1000 - index 
          }}
        >
          <NotificationToast
            notification={notification}
            onClose={() => removeToast(notification.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;