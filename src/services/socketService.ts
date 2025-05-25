import { API_URL, AUTH_STORAGE_KEYS } from "@/constants/authConstants";

// Define socket message types
export enum SocketMessageType {
  // Client messages
  CHAT = "CHAT", // Send chat message
  JOIN = "JOIN", // Join chat room
  LEAVE = "LEAVE", // Leave chat room
  TYPING = "TYPING", // Typing indicator
  READ_RECEIPT = "READ_RECEIPT", // Mark as read

  // Server messages
  USERS = "USERS", // User list
  JOIN_SUCCESS = "JOIN_SUCCESS", // Join room success
  JOIN_ERROR = "JOIN_ERROR", // Join room error
  USER_JOINED = "USER_JOINED", // User joined notification
  USER_LEFT = "USER_LEFT", // User left notification
  ERROR = "ERROR", // Error notification

  // Legacy support
  STATUS_CHANGE = "status_change",
  PONG = "pong",
}

// Define event types for socket communication based on server structure
export interface SocketMessage {
  type: SocketMessageType;
  chat_room_id?: string;
  sender_id: string;
  timestamp: number;
  data?: Record<string, unknown>; // Raw JSON data from server
}

// Payload interfaces matching server structure
export interface ChatMessagePayload {
  content: string;
  message_id?: string;
  mime_type?: string;
}

export interface JoinPayload {
  room_id: string;
}

export interface LeavePayload {
  reason?: string;
}

export interface TypingPayload {
  is_typing: boolean;
}

export interface ReadReceiptPayload {
  message_id: string;
}

export interface UsersPayload {
  user_ids: string[];
}

export interface JoinSuccessPayload {
  room_id: string;
  status: string;
}

export interface UserEventPayload {
  user_id: string;
  user_name?: string;
}

export interface ErrorPayload {
  message: string;
}

// Legacy interface for backward compatibility with existing components
export interface LegacySocketMessage {
  conversationId: string;
  content: string;
  id: string;
  senderId: string;
  senderName: string;
  timestamp: string;
}

// User data interface
export interface UserInfo {
  id: string;
  name: string;
  status: string;
}

// Status types for connection state
export type ConnectionStatus = "connected" | "disconnected" | "connecting";

// Event handler type definitions
type MessageHandler = (message: SocketMessage) => void;
type StatusChangeHandler = (status: string, userId: string) => void;
type TypingHandler = (data: {
  chat_room_id: string;
  sender_id: string;
  is_typing: boolean;
}) => void;
type ConnectionStatusHandler = (status: ConnectionStatus) => void;
type UsersListHandler = (users: UsersPayload) => void;
type JoinRoomHandler = (
  status: boolean,
  message: string,
  roomId?: string
) => void;
type UserJoinLeaveHandler = (userId: string, chatRoomId: string) => void;
type ReadReceiptHandler = (data: {
  chat_room_id: string;
  message_id: string;
  sender_id: string;
}) => void;

class SocketService {
  private socket: WebSocket | null = null;
  private messageHandlers: MessageHandler[] = [];
  private statusChangeHandlers: StatusChangeHandler[] = [];
  private typingHandlers: TypingHandler[] = [];
  private connectionStatusHandlers: ConnectionStatusHandler[] = [];
  private usersListHandlers: UsersListHandler[] = [];
  private joinRoomHandlers: JoinRoomHandler[] = [];
  private userJoinLeaveHandlers: UserJoinLeaveHandler[] = [];
  private readReceiptHandlers: ReadReceiptHandler[] = [];
  private connectionStatus: ConnectionStatus = "disconnected";
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000; // 3 seconds
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private pingInterval: ReturnType<typeof setInterval> | null = null;

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

      // Format WebSocket URL (ws:// or wss://)
      const wsProtocol = API_URL.startsWith("https") ? "wss" : "ws";
      const baseUrl = API_URL.replace(/^https?:\/\//, "").replace(
        "/api/v1",
        ""
      );
      // Không thể trực tiếp thêm Authorization header trong WebSocket
      // Sử dụng URL query parameter có tên 'token' để chuyển token này
      const wsUrl = `${wsProtocol}://${baseUrl}/api/v1/ws?token=${encodeURIComponent(
        token
      )}`;

      console.log("Connecting to WebSocket server at:", wsUrl);

      // Create a new WebSocket connection
      this.socket = new WebSocket(wsUrl);

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
    this.socket.onopen = () => {
      console.log("WebSocket connected successfully");
      this.reconnectAttempts = 0;
      this.updateConnectionStatus("connected");

      // Set up ping interval to keep connection alive
      this.setupPingInterval();
    };

    // Connection error
    this.socket.onerror = (event) => {
      console.error("WebSocket connection error:", event);
      this.handleConnectionError();
    };

    // Disconnected from server
    this.socket.onclose = (event) => {
      console.log("WebSocket disconnected:", event.reason);
      this.updateConnectionStatus("disconnected");

      // Clear ping interval
      if (this.pingInterval) {
        clearInterval(this.pingInterval);
        this.pingInterval = null;
      }

      // Attempt reconnection if not client-initiated disconnect
      if (event.code !== 1000) {
        this.attemptReconnect();
      }
    };

    // Message received
    this.socket.onmessage = (event) => {
      try {
        const data: SocketMessage = JSON.parse(event.data);

        // Handle different message types
        switch (data.type) {
          case SocketMessageType.CHAT:
            console.log("New message received:", data);
            this.messageHandlers.forEach((handler) => handler(data));
            break;

          case SocketMessageType.STATUS_CHANGE: // Legacy support
            console.log("User status changed:", data);
            if (data.data) {
              const legacyData = data.data as Record<string, unknown>;
              this.statusChangeHandlers.forEach((handler) =>
                handler(
                  legacyData?.status as string,
                  legacyData?.userId as string
                )
              );
            }
            break;

          case SocketMessageType.TYPING:
            console.log("Typing indicator received:", data);
            if (data.data && data.chat_room_id && data.sender_id) {
              const typingData = data.data as unknown as TypingPayload;
              this.typingHandlers.forEach((handler) =>
                handler({
                  chat_room_id: data.chat_room_id!,
                  sender_id: data.sender_id,
                  is_typing: typingData.is_typing,
                })
              );
            }
            break;

          case SocketMessageType.ERROR:
            console.error("Server error:", data);
            if (data.data) {
              const errorData = data.data as unknown as ErrorPayload;
              console.error("Error message:", errorData.message);
            }
            break;

          case SocketMessageType.PONG: // Legacy ping/pong
            // Handle pong message (keep-alive response)
            break;

          case SocketMessageType.USERS:
            console.log("Users list received:", data);
            if (data.data) {
              const usersData = data.data as unknown as UsersPayload;
              this.usersListHandlers.forEach((handler) => handler(usersData));
            }
            break;

          case SocketMessageType.JOIN_SUCCESS:
            console.log("Join room success:", data);
            if (data.data) {
              const joinData = data.data as unknown as JoinSuccessPayload;
              this.joinRoomHandlers.forEach((handler) =>
                handler(true, "Join room success", joinData.room_id)
              );
            }
            break;

          case SocketMessageType.JOIN_ERROR:
            console.error("Join room error:", data);
            if (data.data) {
              const errorData = data.data as unknown as ErrorPayload;
              this.joinRoomHandlers.forEach((handler) =>
                handler(false, errorData.message || "Join room error")
              );
            }
            break;

          case SocketMessageType.USER_JOINED:
            console.log("User joined:", data);
            if (data.data && data.chat_room_id) {
              const userEventData = data.data as unknown as UserEventPayload;
              this.userJoinLeaveHandlers.forEach((handler) =>
                handler(userEventData.user_id, data.chat_room_id!)
              );
            }
            break;

          case SocketMessageType.USER_LEFT:
            console.log("User left:", data);
            if (data.data && data.chat_room_id) {
              const userEventData = data.data as unknown as UserEventPayload;
              this.userJoinLeaveHandlers.forEach((handler) =>
                handler(userEventData.user_id, data.chat_room_id!)
              );
            }
            break;

          case SocketMessageType.READ_RECEIPT:
            console.log("Read receipt:", data);
            if (data.data && data.chat_room_id) {
              const receiptData = data.data as unknown as ReadReceiptPayload;
              this.readReceiptHandlers.forEach((handler) =>
                handler({
                  chat_room_id: data.chat_room_id!,
                  message_id: receiptData.message_id,
                  sender_id: data.sender_id,
                })
              );
            }
            break;

          default:
            console.log("Unknown message type received:", data);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error, event.data);
      }
    };
  }

  // Set up ping interval to keep connection alive
  private setupPingInterval(): void {
    // Clear existing interval if any
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    // Send ping every 30 seconds to keep the connection alive
    this.pingInterval = setInterval(() => {
      if (this.isConnected()) {
        this.sendRaw({ type: "ping" });
      }
    }, 30000);
  }

  // Helper function to send raw data through WebSocket
  private sendRaw(data: Record<string, unknown>): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    try {
      this.socket.send(JSON.stringify(data));
    } catch (error) {
      console.error("Error sending data:", error);
    }
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
      this.socket.close(1000, "Client initiated disconnect");
      this.socket = null;
      this.updateConnectionStatus("disconnected");
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  // Check if socket is connected
  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }

  // Get current connection status
  getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  // Send a chat message
  sendMessage(conversationId: string, content: string): void {
    if (!this.isConnected()) {
      console.error("Cannot send message: Socket not connected");
      return;
    }

    // Gửi dữ liệu theo đúng cấu trúc SocketMessage với ChatMessagePayload
    this.sendRaw({
      type: SocketMessageType.CHAT,
      chat_room_id: conversationId,
      sender_id: localStorage.getItem("userId") || "",
      timestamp: Date.now(),
      data: {
        content: content,
        mime_type: "text/plain",
      },
    });
  }

  // Send typing indicator
  sendTypingStatus(conversationId: string, isTyping: boolean): void {
    if (!this.isConnected()) return;

    // Gửi dữ liệu theo đúng cấu trúc SocketMessage với TypingPayload
    this.sendRaw({
      type: SocketMessageType.TYPING,
      chat_room_id: conversationId,
      sender_id: localStorage.getItem("userId") || "",
      timestamp: Date.now(),
      data: {
        is_typing: isTyping,
      },
    });
  }

  // Join a specific chat room
  joinChatRoom(conversationId: string): void {
    console.log("Joining chat room:", conversationId);
    if (!this.isConnected()) {
      console.error("Cannot join room: Socket not connected");
      return;
    }

    // Gửi dữ liệu theo đúng cấu trúc SocketMessage với JoinPayload
    this.sendRaw({
      type: SocketMessageType.JOIN,
      chat_room_id: conversationId,
      sender_id: localStorage.getItem("userId") || "",
      timestamp: Date.now(),
      data: {
        room_id: conversationId,
      },
    });
  }

  // Leave a specific chat room
  leaveChatRoom(conversationId: string, reason: string = "User left"): void {
    if (!this.isConnected()) return;

    // Gửi dữ liệu theo đúng cấu trúc SocketMessage với LeavePayload
    this.sendRaw({
      type: SocketMessageType.LEAVE,
      chat_room_id: conversationId,
      sender_id: localStorage.getItem("userId") || "",
      timestamp: Date.now(),
      data: {
        reason: reason,
      },
    });
  }

  // Send read receipt
  sendReadReceipt(conversationId: string, messageId: string): void {
    if (!this.isConnected()) return;

    // Gửi dữ liệu theo đúng cấu trúc SocketMessage với ReadReceiptPayload
    this.sendRaw({
      type: SocketMessageType.READ_RECEIPT,
      chat_room_id: conversationId,
      sender_id: localStorage.getItem("userId") || "",
      timestamp: Date.now(),
      data: {
        message_id: messageId,
      },
    });
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

  onUsersList(handler: UsersListHandler): () => void {
    this.usersListHandlers.push(handler);
    return () => {
      this.usersListHandlers = this.usersListHandlers.filter(
        (h) => h !== handler
      );
    };
  }

  onJoinRoom(handler: JoinRoomHandler): () => void {
    this.joinRoomHandlers.push(handler);
    return () => {
      this.joinRoomHandlers = this.joinRoomHandlers.filter(
        (h) => h !== handler
      );
    };
  }

  onUserJoinLeave(handler: UserJoinLeaveHandler): () => void {
    this.userJoinLeaveHandlers.push(handler);
    return () => {
      this.userJoinLeaveHandlers = this.userJoinLeaveHandlers.filter(
        (h) => h !== handler
      );
    };
  }

  onReadReceipt(handler: ReadReceiptHandler): () => void {
    this.readReceiptHandlers.push(handler);
    return () => {
      this.readReceiptHandlers = this.readReceiptHandlers.filter(
        (h) => h !== handler
      );
    };
  }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService;
