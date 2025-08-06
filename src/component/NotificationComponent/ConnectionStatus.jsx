
import React from 'react';
import { useNotifications } from './NotificationContext';

const ConnectionStatus = () => {
  const { connected, reconnect } = useNotifications();

  if (connected) {
    return (
      <div className="flex items-center space-x-2 text-green-600 text-sm">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span>Connected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-red-600 text-sm">
      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
      <span>Disconnected</span>
      <button
        onClick={reconnect}
        className="text-blue-600 hover:text-blue-800 text-xs underline"
      >
        Reconnect
      </button>
    </div>
  );
};

export default ConnectionStatus;
