import { useAuth } from "../GlobalComponent/AuthProvider";
import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect(userEmail, onNotificationReceived) {
    if (this.socket) {
      this.disconnect();
    }

    // Get the access token for authentication
    const { auth } = useAuth();
    const accessToken = auth?.accessToken;

    const isProd = process.env.NODE_ENV === "production";
    
    // const url = import.meta.env.VITE_BASE_URL
    const url = "http://localhost:8081";

    // Connect to Socket.io server with authentication
    this.socket = io(url, {
      transports: ["websocket", "polling"],
      upgrade: true,
      rememberUpgrade: true,
      timeout: 20000,
      forceNew: true,
      auth: {
        token: accessToken,
        userEmail: userEmail,
      },
      query: {
        userEmail: userEmail,
      },
    });

    // Connection events
    this.socket.on("connect", () => {
      console.log("Connected to Socket.io server:", this.socket.id);
      this.connected = true;

      // Join user-specific room
      this.socket.emit("join", userEmail);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Disconnected from Socket.io server:", reason);
      this.connected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket.io connection error:", error);
      this.connected = false;

      // Handle authentication errors
      if (error.message === "Authentication failed") {
        console.log("Socket authentication failed, token may be expired");
        // You could trigger a token refresh here if needed
      }
    });

    // Listen for notifications
    this.socket.on("notification", (notification) => {
      console.log("Received notification:", notification);
      onNotificationReceived(notification);
    });

    // Handle reconnection
    this.socket.on("reconnect", (attemptNumber) => {
      console.log(
        "Reconnected to Socket.io server after",
        attemptNumber,
        "attempts"
      );
      this.connected = true;
      // Rejoin user room after reconnection
      this.socket.emit("join", userEmail);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  isConnected() {
    return this.connected && this.socket && this.socket.connected;
  }

  // Method to manually emit events (if needed)
  emit(event, data) {
    if (this.socket && this.connected) {
      this.socket.emit(event, data);
    }
  }
}

export default new SocketService();
