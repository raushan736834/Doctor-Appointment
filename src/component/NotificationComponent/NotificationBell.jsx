import React, { useState } from 'react';
import { useNotifications } from './NotificationContext';
import ConnectionStatus from './ConnectionStatus';

const NotificationBell = () => {
  const { unreadCount, connected, connectSocket } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    // Connect socket if not already connected when bell is clicked
    if (!connected) {
      connectSocket();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative flex items-center space-x-4">
      <button
        onClick={handleClick}
        className={`relative p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
          connected 
            ? 'text-indigo-700 hover:text-indigo-400' 
            : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        {!connected && (
          <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full"></span>
        )}
      </button>
    </div>
  );
};

export default NotificationBell;
