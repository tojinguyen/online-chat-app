import { AUTH_CONSTANTS } from "@/constants";
import {
  ActiveUsersListPayload,
  ChatMessageReceivePayload,
  ChatMessageSendPayload,
  ChatRoom,
  ErrorPayload,
  JoinRoomPayload,
  JoinSuccessPayload,
  LeaveRoomPayload,
  Message,
  MessageType,
  ReadReceiptPayload,
  SocketMessage,
  SocketMessageType,
  TypingPayload,
  UserEventPayload,
} from "@/types";

type MessageHandler = (message: Message) => void;
type ChatRoomUpdateHandler = (chatRoom: ChatRoom) => void;
type ConnectionStatusHandler = (isConnected: boolean) => void;
type UserEventHandler = (event: UserEventPayload) => void;
type ActiveUsersHandler = (users: ActiveUsersListPayload) => void;
type TypingHandler = (typing: TypingPayload) => void;
type ErrorHandler = (error: ErrorPayload) => void;
type JoinSuccessHandler = (success: JoinSuccessPayload) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private messageHandlers: MessageHandler[] = [];
  private chatRoomUpdateHandlers: ChatRoomUpdateHandler[] = [];
  private connectionStatusHandlers: ConnectionStatusHandler[] = [];
  private userEventHandlers: UserEventHandler[] = [];
  private activeUsersHandlers: ActiveUsersHandler[] = [];
  private typingHandlers: TypingHandler[] = [];
  private errorHandlers: ErrorHandler[] = [];
  private joinSuccessHandlers: JoinSuccessHandler[] = [];
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
      const wsUrl = `ws://localhost:8080/api/v1/ws?token=${token}`;
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
  sendMessage(
    chatRoomId: string,
    content: string,
    mimeType?: string,
    tempMessageId?: string
  ) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const payload: ChatMessageSendPayload = {
        chat_room_id: chatRoomId,
        content,
        ...(mimeType && { mime_type: mimeType }),
        ...(tempMessageId && { temp_message_id: tempMessageId }),
      };

      const message: SocketMessage<ChatMessageSendPayload> = {
        type: SocketMessageType.SEND_MESSAGE,
        data: payload,
      };

      this.socket.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected");
    }
  }

  // Join a chat room
  joinChatRoom(chatRoomId: string) {
    console.log("joinChatRoom called with chatRoomId:", chatRoomId); // Debug log
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const payload: JoinRoomPayload = {
        chat_room_id: chatRoomId,
      };

      const message: SocketMessage<JoinRoomPayload> = {
        type: SocketMessageType.JOIN_ROOM,
        data: payload,
      };

      console.log("Sending JOIN_ROOM message:", JSON.stringify(message)); // Debug log
      this.socket.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected");
    }
  }

  // Leave a chat room
  leaveChatRoom(chatRoomId: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const payload: LeaveRoomPayload = {
        chat_room_id: chatRoomId,
      };

      const message: SocketMessage<LeaveRoomPayload> = {
        type: SocketMessageType.LEAVE_ROOM,
        data: payload,
      };

      this.socket.send(JSON.stringify(message));
    }
  }

  // Send typing indicator
  sendTyping(chatRoomId: string, isTyping: boolean) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const payload: TypingPayload = {
        chat_room_id: chatRoomId,
        is_typing: isTyping,
      };

      const message: SocketMessage<TypingPayload> = {
        type: SocketMessageType.TYPING,
        data: payload,
      };

      this.socket.send(JSON.stringify(message));
    }
  }

  // Send read receipt
  sendReadReceipt(chatRoomId: string, messageId: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const payload: ReadReceiptPayload = {
        chat_room_id: chatRoomId,
        message_id: messageId,
      };

      const message: SocketMessage<ReadReceiptPayload> = {
        type: SocketMessageType.READ_RECEIPT,
        data: payload,
      };

      this.socket.send(JSON.stringify(message));
    }
  }

  // Send ping to keep connection alive
  sendPing() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message: SocketMessage = {
        type: SocketMessageType.PING,
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

  // Register a handler for user events (join/leave)
  onUserEvent(handler: UserEventHandler) {
    this.userEventHandlers.push(handler);
    return () => {
      this.userEventHandlers = this.userEventHandlers.filter(
        (h) => h !== handler
      );
    };
  }

  // Register a handler for active users list
  onActiveUsers(handler: ActiveUsersHandler) {
    this.activeUsersHandlers.push(handler);
    return () => {
      this.activeUsersHandlers = this.activeUsersHandlers.filter(
        (h) => h !== handler
      );
    };
  }

  // Register a handler for typing indicators
  onTyping(handler: TypingHandler) {
    this.typingHandlers.push(handler);
    return () => {
      this.typingHandlers = this.typingHandlers.filter((h) => h !== handler);
    };
  }

  // Register a handler for errors
  onError(handler: ErrorHandler) {
    this.errorHandlers.push(handler);
    return () => {
      this.errorHandlers = this.errorHandlers.filter((h) => h !== handler);
    };
  }

  // Register a handler for join success
  onJoinSuccess(handler: JoinSuccessHandler) {
    this.joinSuccessHandlers.push(handler);
    return () => {
      this.joinSuccessHandlers = this.joinSuccessHandlers.filter(
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
    console.log("WebSocket message received:", event.data);

    try {
      const socketMessage: SocketMessage = JSON.parse(event.data);
      console.log("Parsed message data:", socketMessage);

      switch (socketMessage.type) {
        case SocketMessageType.NEW_MESSAGE:
          console.log("Processing NEW_MESSAGE:", socketMessage.data);
          // Convert the payload to Message format for backward compatibility
          if (socketMessage.data) {
            const payload = socketMessage.data as ChatMessageReceivePayload;
            const message: Message = {
              id: payload.message_id,
              chat_room_id: payload.chat_room_id,
              sender_id: socketMessage.sender_id || "",
              sender_name: payload.sender_name || "",
              avatar_url: payload.avatar_url || "",
              content: payload.content,
              type: MessageType.TEXT, // Default to TEXT, backend should provide this
              mime_type: payload.mime_type,
              created_at: new Date().toISOString(),
            };
            this.notifyMessageHandlers(message);
          }
          break;

        case SocketMessageType.CHAT_ROOM_UPDATE:
          console.log("Processing CHAT_ROOM_UPDATE:", socketMessage.data);
          this.notifyChatRoomUpdateHandlers(socketMessage.data as ChatRoom);
          break;

        case SocketMessageType.JOIN_SUCCESS:
          console.log("Processing JOIN_SUCCESS:", socketMessage.data);
          if (socketMessage.data) {
            this.notifyJoinSuccessHandlers(
              socketMessage.data as JoinSuccessPayload
            );
          }
          break;

        case SocketMessageType.JOIN_ERROR:
        case SocketMessageType.ERROR:
          console.log("Processing ERROR:", socketMessage.data);
          if (socketMessage.data) {
            this.notifyErrorHandlers(socketMessage.data as ErrorPayload);
          }
          break;

        case SocketMessageType.USER_JOINED:
        case SocketMessageType.USER_LEFT:
          console.log(`Processing ${socketMessage.type}:`, socketMessage.data);
          if (socketMessage.data) {
            this.notifyUserEventHandlers(
              socketMessage.data as UserEventPayload
            );
          }
          break;

        case SocketMessageType.USERS:
          console.log("Processing USERS:", socketMessage.data);
          if (socketMessage.data) {
            this.notifyActiveUsersHandlers(
              socketMessage.data as ActiveUsersListPayload
            );
          }
          break;

        case SocketMessageType.TYPING:
          console.log("Processing TYPING:", socketMessage.data);
          if (socketMessage.data) {
            this.notifyTypingHandlers(socketMessage.data as TypingPayload);
          }
          break;

        case SocketMessageType.PONG:
          console.log("Received PONG");
          // Handle pong response
          break;

        default:
          console.log(
            "Unknown message type received:",
            socketMessage.type,
            "Full data:",
            socketMessage
          );
      }
    } catch (error) {
      console.error(
        "Error parsing WebSocket message:",
        error,
        "Raw message:",
        event.data
      );
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

  // Notify all user event handlers
  private notifyUserEventHandlers(event: UserEventPayload) {
    this.userEventHandlers.forEach((handler) => handler(event));
  }

  // Notify all active users handlers
  private notifyActiveUsersHandlers(users: ActiveUsersListPayload) {
    this.activeUsersHandlers.forEach((handler) => handler(users));
  }

  // Notify all typing handlers
  private notifyTypingHandlers(typing: TypingPayload) {
    this.typingHandlers.forEach((handler) => handler(typing));
  }

  // Notify all error handlers
  private notifyErrorHandlers(error: ErrorPayload) {
    this.errorHandlers.forEach((handler) => handler(error));
  }

  // Notify all join success handlers
  private notifyJoinSuccessHandlers(success: JoinSuccessPayload) {
    this.joinSuccessHandlers.forEach((handler) => handler(success));
  }
}

// Create a singleton instance
export const webSocketService = new WebSocketService();
