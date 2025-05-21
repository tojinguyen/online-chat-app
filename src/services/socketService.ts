import { API_URL, AUTH_STORAGE_KEYS } from "@/constants/authConstants";
import { io, Socket } from "socket.io-client";

// Define event types for socket communication
export interface SocketMessage {
  conversationId: string;
  content: string;
  id: string;
  senderId: string;
  senderName: string;
  timestamp: string;
}

// Status types for connection state
export type ConnectionStatus = "connected" | "disconnected" | "connecting";

// Event handler type definitions
type MessageHandler = (message: SocketMessage) => void;
type StatusChangeHandler = (status: string, userId: string) => void;
type TypingHandler = (data: {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}) => void;
type ConnectionStatusHandler = (status: ConnectionStatus) => void;

class SocketService {
  private socket: Socket | null = null;
  private messageHandlers: MessageHandler[] = [];
  private statusChangeHandlers: StatusChangeHandler[] = [];
  private typingHandlers: TypingHandler[] = [];
  private connectionStatusHandlers: ConnectionStatusHandler[] = [];
  private connectionStatus: ConnectionStatus = "disconnected";
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000; // 3 seconds
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  // Connect to the WebSocket server
  connect(): void {
    try {
      if (this.socket) {
        // If a socket connection exists, disconnect it first
        this.disconnect();
      }

      // Get the authentication token
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
          : null;

      if (!token) {
        console.error("No authentication token available");
        return;
      }

      this.updateConnectionStatus("connecting");

      // Create a new socket connection with the websocket path and authentication
      this.socket = io(`${API_URL}`, {
        path: "/ws",
        auth: {
          token,
        },
        transports: ["websocket"],
        reconnection: false, // We'll handle reconnection manually
      });

      // Set up event listeners
      this.setupEventListeners();
    } catch (error) {
      console.error("Socket connection error:", error);
      this.handleConnectionError();
    }
  }

  // Set up socket event listeners
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Connection established successfully
    this.socket.on("connect", () => {
      console.log("WebSocket connected successfully");
      this.reconnectAttempts = 0;
      this.updateConnectionStatus("connected");
    });

    // Connection error
    this.socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      this.handleConnectionError();
    });

    // Disconnected from server
    this.socket.on("disconnect", (reason) => {
      console.log("WebSocket disconnected:", reason);
      this.updateConnectionStatus("disconnected");

      // Attempt reconnection if not client-initiated disconnect
      if (reason !== "io client disconnect") {
        this.attemptReconnect();
      }
    });

    // New message received
    this.socket.on("message", (data: SocketMessage) => {
      console.log("New message received:", data);
      this.messageHandlers.forEach((handler) => handler(data));
    });

    // User status change (online/offline)
    this.socket.on(
      "status_change",
      (data: { userId: string; status: string }) => {
        console.log("User status changed:", data);
        this.statusChangeHandlers.forEach((handler) =>
          handler(data.status, data.userId)
        );
      }
    );

    // Typing indicator
    this.socket.on(
      "typing",
      (data: { conversationId: string; userId: string; isTyping: boolean }) => {
        this.typingHandlers.forEach((handler) => handler(data));
      }
    );

    // Error messages from server
    this.socket.on("error", (error: unknown) => {
      console.error("Server error:", error);
    });
  }

  // Handle connection errors
  private handleConnectionError(): void {
    this.updateConnectionStatus("disconnected");
    this.attemptReconnect();
  }

  // Attempt to reconnect with exponential backoff
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Maximum reconnection attempts reached");
      return;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    const delay =
      this.reconnectInterval * Math.pow(1.5, this.reconnectAttempts);
    console.log(`Attempting to reconnect in ${delay}ms...`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  // Update connection status and notify handlers
  private updateConnectionStatus(status: ConnectionStatus): void {
    this.connectionStatus = status;
    this.connectionStatusHandlers.forEach((handler) => handler(status));
  }

  // Disconnect from the WebSocket server
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.updateConnectionStatus("disconnected");
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  // Send a chat message
  sendMessage(conversationId: string, content: string): void {
    if (!this.socket || !this.isConnected()) {
      console.error("Cannot send message: Socket not connected");
      return;
    }

    this.socket.emit("message", {
      conversationId,
      content,
    });
  }

  // Send typing indicator
  sendTypingStatus(conversationId: string, isTyping: boolean): void {
    if (!this.socket || !this.isConnected()) return;

    this.socket.emit("typing", {
      conversationId,
      isTyping,
    });
  }

  // Join a specific chat room
  joinChatRoom(conversationId: string): void {
    if (!this.socket || !this.isConnected()) {
      console.error("Cannot join room: Socket not connected");
      return;
    }

    this.socket.emit("join_room", { conversationId });
  }

  // Leave a specific chat room
  leaveChatRoom(conversationId: string): void {
    if (!this.socket || !this.isConnected()) return;

    this.socket.emit("leave_room", { conversationId });
  }

  // Check if socket is connected
  isConnected(): boolean {
    return !!this.socket?.connected;
  }

  // Get current connection status
  getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  // Event listeners
  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    };
  }

  onStatusChange(handler: StatusChangeHandler): () => void {
    this.statusChangeHandlers.push(handler);
    return () => {
      this.statusChangeHandlers = this.statusChangeHandlers.filter(
        (h) => h !== handler
      );
    };
  }

  onTyping(handler: TypingHandler): () => void {
    this.typingHandlers.push(handler);
    return () => {
      this.typingHandlers = this.typingHandlers.filter((h) => h !== handler);
    };
  }

  onConnectionStatusChange(handler: ConnectionStatusHandler): () => void {
    this.connectionStatusHandlers.push(handler);
    return () => {
      this.connectionStatusHandlers = this.connectionStatusHandlers.filter(
        (h) => h !== handler
      );
    };
  }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService;
