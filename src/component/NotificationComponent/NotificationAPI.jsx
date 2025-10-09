import { useAuth } from "../GlobalComponent/AuthProvider";
import { useApiService } from "../../hooks/useAuthWithAxios";
// Notification API functions using your axios instance
export const notificationAPI = {
  // Get all notifications for a user
  getUserNotifications: async (userEmail) => {
    const api = useApiService();

    try {
      const response = await api.get(`/api/notifications/user/${userEmail}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user notifications:", error);
      throw error;
    }
  },

  // Get unread count for a user
  getUnreadCount: async (userEmail) => {
    const api = useApiService();

    try {
      const response = await api.get(
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
    const api = useApiService();

    try {
      await api.put(`/api/notifications/${notificationId}/read`);
      return true;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  // Mark all notifications as read for a user
  markAllAsRead: async (userEmail) => {
    const api = useApiService();

    try {
      await api.put(`/api/notifications/user/${userEmail}/mark-all-read`);
      return true;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  },

  // Delete a notification
  deleteNotification: async (notificationId) => {
    const api = useApiService();

    try {
      await api.delete(`/api/notifications/${notificationId}`);
      return true;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },

  // Get notifications with pagination
  getNotificationsPaginated: async (userEmail, page = 0, size = 20) => {
    const api = useApiService();

    try {
      const response = await api.get(
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

  // Get user info for socket connection
  getUserInfoForSocket: () => {
    const { auth } = useAuth();

    const token = auth?.accessToken;
    const refreshToken = auth?.refreshToken;

    if (!token) {
      throw new Error("No authentication token found");
    }

    return { token, refreshToken };
  },

  // Handle socket authentication error
  handleSocketAuthError: () => {
    const { setAuth } = useAuth();
    console.log("Socket authentication failed, clearing tokens...");
    setAuth({});
    window.location.href = "/auth/login";
  },
};
