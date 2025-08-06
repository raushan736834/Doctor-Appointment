import api from '../../hooks/useAxios';

// Notification API functions using your axios instance
export const notificationAPI = {
  // Get all notifications for a user
  getUserNotifications: async (userEmail) => {
    try {
      const response = await api.get(`/api/notifications/user/${userEmail}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      throw error;
    }
  },

  // Get unread count for a user
  getUnreadCount: async (userEmail) => {
    try {
      const response = await api.get(`/api/notifications/user/${userEmail}/unread-count`);
      return response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },

  // Mark a single notification as read
  markAsRead: async (notificationId) => {
    try {
      await api.put(`/api/notifications/${notificationId}/read`);
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read for a user
  markAllAsRead: async (userEmail) => {
    try {
      await api.put(`/api/notifications/user/${userEmail}/mark-all-read`);
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Delete a notification
  deleteNotification: async (notificationId) => {
    try {
      await api.delete(`/api/notifications/${notificationId}`);
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Get notifications with pagination
  getNotificationsPaginated: async (userEmail, page = 0, size = 20) => {
    try {
      const response = await api.get(`/api/notifications/user/${userEmail}/paginated`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching paginated notifications:', error);
      throw error;
    }
  }
};

// Auth-related notification functions
export const authNotificationAPI = {
  // Check if user has notification permissions
  hasNotificationPermission: () => {
    return Notification.permission === 'granted';
  },

  // Request browser notification permission
  requestNotificationPermission: async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  },

  // Get user info for socket connection
  getUserInfoForSocket: () => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    return { token, refreshToken };
  },

  // Handle socket authentication error
  handleSocketAuthError: () => {
    console.log('Socket authentication failed, clearing tokens...');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/auth/login';
  }
};

