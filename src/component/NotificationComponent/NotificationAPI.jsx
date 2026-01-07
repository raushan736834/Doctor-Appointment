import axiosInstance from "../../config/axiosConfig";

// Notification API functions using your axios instance
export const notificationAPI = {
  // Get all notifications for a user
  getUserNotifications: async (userEmail) => {
    try {
      const response = await axiosInstance.get(`/api/notifications/user/${userEmail}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user notifications:", error);
      throw error;
    }
  },

  // Get unread count for a user
  getUnreadCount: async (userEmail) => {
    try {
      const response = await axiosInstance.get(
        `/api/notifications/user/${userEmail}/unread-count`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      throw error;
    }
  },

  // Mark a single notification as read
  markAsRead: async (notificationId) => {
    try {
      await axiosInstance.put(`/api/notifications/${notificationId}/read`);
      return true;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  // Mark all notifications as read for a user
  markAllAsRead: async (userEmail) => {
    try {
      await axiosInstance.put(`/api/notifications/user/${userEmail}/mark-all-read`);
      return true;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  },

  // Delete a notification
  deleteNotification: async (notificationId) => {
    try {
      await axiosInstance.delete(`/api/notifications/${notificationId}`);
      return true;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },

  // Get notifications with pagination
  getNotificationsPaginated: async (userEmail, page = 0, size = 20) => {
    try {
      const response = await axiosInstance.get(
        `/api/notifications/user/${userEmail}/paginated`,
        {
          params: { page, size },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching paginated notifications:", error);
      throw error;
    }
  },
};

// Auth-related notification functions
export const authNotificationAPI = {
  // Check if user has notification permissions
  hasNotificationPermission: () => {
    return Notification.permission === "granted";
  },

  // Request browser notification permission
  requestNotificationPermission: async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return false;
  },

  // Note: getUserInfoForSocket and handleSocketAuthError were removed
  // because they used hooks inside object methods, which violates React's Rules of Hooks.
  // If you need these functions, they should be implemented as custom hooks or
  // accept the auth context as a parameter instead.
};
