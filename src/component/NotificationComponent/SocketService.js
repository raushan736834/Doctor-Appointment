import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscription = null;
    this.userEmail = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(userEmail, onNotificationReceived, accessToken) {
    if (this.client) {
      this.disconnect();
    }

    this.userEmail = userEmail;

    // WebSocket URL - update based on your backend configuration
    const url = "http://localhost:8080/ws";

    // Create STOMP client
    this.client = new Client({
      // Use SockJS for better browser compatibility
      webSocketFactory: () => new SockJS(url),
      
      // Connection headers (JWT authentication)
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
        userEmail: userEmail,
      },
          
      // Reconnect configuration
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      
      // Connection callback
      onConnect: (frame) => {
        this.connected = true;
        this.reconnectAttempts = 0;

        // Subscribe to user-specific notification queue
        this.subscription = this.client.subscribe(
          `/user/queue/notifications`,
          (message) => {
            try {
              const notification = JSON.parse(message.body);
              onNotificationReceived(notification);
            } catch (error) {
              console.error('Error parsing notification:', error);
            }
          },
          {
            // Subscription headers if needed
            id: `sub-${userEmail}`,
          }
        );
      },

      // Disconnection callback
      onDisconnect: (frame) => {
        this.connected = false;
        if (this.subscription) {
          this.subscription.unsubscribe();
          this.subscription = null;
        }
      },

      // Error callback
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers['message']);
        console.error('Details:', frame.body);
        this.connected = false;

        // Handle authentication errors
        if (frame.headers['message']?.includes('Authentication') || 
            frame.headers['message']?.includes('Unauthorized')) {
          console.log('WebSocket authentication failed, token may be expired');
          // Trigger token refresh or logout
        }

        // Implement reconnect logic
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
        }
      },

      // Web socket close callback
      onWebSocketClose: (event) => {
        console.log('WebSocket connection closed:', event.reason || 'Unknown reason');
        this.connected = false;
      },

      // Web socket error callback
      onWebSocketError: (error) => {
        console.error('WebSocket error:', error);
        this.connected = false;
      },
    });

    // Activate the client
    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      // Unsubscribe before disconnecting
      if (this.subscription) {
        this.subscription.unsubscribe();
        this.subscription = null;
      }

      // Deactivate the client
      this.client.deactivate();
      this.client = null;
      this.connected = false;
      this.userEmail = null;
    }
  }

  isConnected() {
    return this.connected && this.client && this.client.connected;
  }

  // Method to manually send messages (if needed)
  send(destination, body, headers = {}) {
    if (this.client && this.connected) {
      this.client.publish({
        destination,
        body: JSON.stringify(body),
        headers,
      });
    } else {
      console.warn('Cannot send message: WebSocket not connected');
    }
  }

  // Get connection state
  getState() {
    if (!this.client) return 'DISCONNECTED';
    return this.client.state;
  }
}

export default new WebSocketService();
