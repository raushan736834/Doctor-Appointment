import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { notificationAPI, authNotificationAPI } from './NotificationAPI';
import SocketService from './SocketService';
import { useAuth } from '../GlobalComponent/AuthProvider';

const NotificationContext = createContext();

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.read).length
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };
    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => 
          n.id === action.payload ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };
    case 'MARK_ALL_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
      };
    case 'SET_CONNECTION_STATUS':
      return {
        ...state,
        connected: action.payload
      };
    default:
      return state;
  }
};

export const NotificationProvider = ({ children, userEmail }) => {
  const { accessToken } = useAuth();
  const [state, dispatch] = useReducer(notificationReducer, {
    notifications: [],
    unreadCount: 0,
    connected: false
  });

  useEffect(() => {
    if (userEmail && accessToken) {
      // Fetch existing notifications
      fetchNotifications(userEmail);
      
      // Connect to WebSocket with STOMP
      SocketService.connect(userEmail, (notification) => {
        dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
        // Show browser notification if permission granted
        showBrowserNotification(notification);
      }, accessToken);

      // Monitor connection status
      const checkConnection = setInterval(() => {
        dispatch({ 
          type: 'SET_CONNECTION_STATUS', 
          payload: SocketService.isConnected() 
        });
      }, 1000);

      return () => {
        clearInterval(checkConnection);
        SocketService.disconnect();
      };
    }
  }, [userEmail, accessToken]);

  const fetchNotifications = async (userEmail) => {
    try {
      const notifications = await notificationAPI.getUserNotifications(userEmail);
      dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications?.data });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Handle authentication errors
      if (error.response?.status === 401) {
        console.log('Authentication failed, redirecting to login...');
        // The axios interceptor will handle token refresh automatically
      }
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      dispatch({ type: 'MARK_AS_READ', payload: notificationId });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Handle authentication errors
      if (error.response?.status === 401) {
        console.log('Authentication failed, please login again');
      }
    }
  };

  const markAllAsRead = async (userEmail) => {
    try {
      await notificationAPI.markAllAsRead(userEmail);
      dispatch({ type: 'MARK_ALL_READ' });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Handle authentication errors
      if (error.response?.status === 401) {
        console.log('Authentication failed, please login again');
      }
    }
  };

  const showBrowserNotification = (notification) => {
    if (authNotificationAPI.hasNotificationPermission()) {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/notification-icon.png',
        tag: `notification-${notification.id}`,
        requireInteraction: false,
        silent: false
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        browserNotification.close();
      }, 5000);

      // Handle click on browser notification
      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();
        // You can add navigation logic here
      };
    }
  };

  const requestNotificationPermission = async () => {
    return await authNotificationAPI.requestNotificationPermission();
  };

  const reconnect = () => {
    if (userEmail && accessToken) {
      SocketService.disconnect();
      setTimeout(() => {
        try {
          SocketService.connect(userEmail, (notification) => {
            dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
            showBrowserNotification(notification);
          }, accessToken);
        } catch (error) {
          console.error('Cannot reconnect: WebSocket error', error);
        }
      }, 1000);
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications: state.notifications,
      unreadCount: state.unreadCount,
      connected: state.connected,
      markAsRead,
      markAllAsRead,
      requestNotificationPermission,
      reconnect,
      refreshNotifications: () => fetchNotifications(userEmail)
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

