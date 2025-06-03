import { AUTH_CONSTANTS } from "@/constants";
import { ChatRoom, Message } from "@/types";

type MessageHandler = (message: Message) => void;
type ChatRoomUpdateHandler = (chatRoom: ChatRoom) => void;
type ConnectionStatusHandler = (isConnected: boolean) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private messageHandlers: MessageHandler[] = [];
  private chatRoomUpdateHandlers: ChatRoomUpdateHandler[] = [];
  private connectionStatusHandlers: ConnectionStatusHandler[] = [];
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000; // Start with 2 seconds

  constructor() {}

  // Connect to the WebSocket server
  connect() {
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    try {
      const token = localStorage.getItem(
        AUTH_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN
      );

      if (!token) {
        console.error("No token found for WebSocket connection");
        return;
      } // Using wss protocol for secure WebSocket connection
      const wsUrl = `wss://localhost:8080/api/v1/ws?token=${token}`;
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error("WebSocket connection error:", error);
      this.notifyConnectionStatus(false);
    }
  }

  // Disconnect from the WebSocket server
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.reconnectAttempts = 0;
  }

  // Send a message through the WebSocket
  sendMessage(chatRoomId: string, content: string, type: string = "TEXT") {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message = {
        type: "SEND_MESSAGE",
        data: {
          chat_room_id: chatRoomId,
          content,
          message_type: type,
        },
      };

      this.socket.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected");
    }
  }

  // Join a chat room
  joinChatRoom(chatRoomId: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message = {
        type: "JOIN_ROOM",
        data: {
          chat_room_id: chatRoomId,
        },
      };

      this.socket.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected");
    }
  }

  // Leave a chat room
  leaveChatRoom(chatRoomId: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message = {
        type: "LEAVE_ROOM",
        data: {
          chat_room_id: chatRoomId,
        },
      };

      this.socket.send(JSON.stringify(message));
    }
  }

  // Register a handler for incoming messages
  onMessage(handler: MessageHandler) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    };
  }

  // Register a handler for chat room updates
  onChatRoomUpdate(handler: ChatRoomUpdateHandler) {
    this.chatRoomUpdateHandlers.push(handler);
    return () => {
      this.chatRoomUpdateHandlers = this.chatRoomUpdateHandlers.filter(
        (h) => h !== handler
      );
    };
  }

  // Register a handler for connection status changes
  onConnectionStatus(handler: ConnectionStatusHandler) {
    this.connectionStatusHandlers.push(handler);
    return () => {
      this.connectionStatusHandlers = this.connectionStatusHandlers.filter(
        (h) => h !== handler
      );
    };
  }
  // Handle WebSocket open event
  private handleOpen() {
    console.log("WebSocket connection established");
    this.reconnectAttempts = 0;
    this.notifyConnectionStatus(true);
  }

  // Handle WebSocket message event
  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "NEW_MESSAGE":
          this.notifyMessageHandlers(data.data as Message);
          break;
        case "CHAT_ROOM_UPDATE":
          this.notifyChatRoomUpdateHandlers(data.data as ChatRoom);
          break;
        default:
          console.log("Unknown message type:", data.type);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  }

  // Handle WebSocket close event
  private handleClose(event: CloseEvent) {
    console.log("WebSocket connection closed:", event.code, event.reason);
    this.notifyConnectionStatus(false);

    // Try to reconnect if not closed intentionally
    if (event.code !== 1000) {
      this.tryReconnect();
    }
  } // Handle WebSocket error event
  private handleError() {
    console.error("WebSocket error occurred");
    this.notifyConnectionStatus(false);
  }

  // Try to reconnect to the WebSocket server
  private tryReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("Max reconnect attempts reached");
      return;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    const delay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts);

    console.log(
      `Attempting to reconnect in ${delay}ms (attempt ${
        this.reconnectAttempts + 1
      }/${this.maxReconnectAttempts})`
    );

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  // Notify all message handlers
  private notifyMessageHandlers(message: Message) {
    this.messageHandlers.forEach((handler) => handler(message));
  }

  // Notify all chat room update handlers
  private notifyChatRoomUpdateHandlers(chatRoom: ChatRoom) {
    this.chatRoomUpdateHandlers.forEach((handler) => handler(chatRoom));
  }

  // Notify all connection status handlers
  private notifyConnectionStatus(isConnected: boolean) {
    this.connectionStatusHandlers.forEach((handler) => handler(isConnected));
  }
}

// Create a singleton instance
export const webSocketService = new WebSocketService();
