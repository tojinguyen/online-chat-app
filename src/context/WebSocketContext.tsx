"use client";

import { webSocketService } from "@/services";
import {
  ActiveUsersListPayload,
  ErrorPayload,
  JoinSuccessPayload,
  Message,
  TypingPayload,
  UserEventPayload,
} from "@/types";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type WebSocketContextType = {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (
    chatRoomId: string,
    content: string,
    mimeType?: string,
    tempMessageId?: string
  ) => void;
  sendTyping: (chatRoomId: string, isTyping: boolean) => void;
  sendReadReceipt: (chatRoomId: string, messageId: string) => void;
  sendPing: () => void;
  configurePingPong: (options: {
    pingInterval?: number;
    pongTimeout?: number;
  }) => void;
  getConnectionHealth: () => {
    isConnected: boolean;
    isHealthy: boolean;
    lastPongReceived: string;
    timeSinceLastPong: number;
    pingInterval: number;
    pongTimeout: number;
    reconnectAttempts: number;
    maxReconnectAttempts: number;
  };
  joinRoom: (chatRoomId: string) => void;
  leaveRoom: (chatRoomId: string) => void;
  onMessage: (handler: (message: Message) => void) => () => void;
  onUserEvent: (handler: (event: UserEventPayload) => void) => () => void;
  onActiveUsers: (
    handler: (users: ActiveUsersListPayload) => void
  ) => () => void;
  onTyping: (handler: (typing: TypingPayload) => void) => () => void;
  onError: (handler: (error: ErrorPayload) => void) => () => void;
  onJoinSuccess: (handler: (success: JoinSuccessPayload) => void) => () => void;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize connection status listener
    const unsubscribeConnection = webSocketService.onConnectionStatus(
      (connected) => {
        setIsConnected(connected);
      }
    );

    return () => {
      unsubscribeConnection();
    };
  }, []);

  const connect = () => {
    webSocketService.connect();
  };

  const disconnect = () => {
    webSocketService.disconnect();
  };
  const sendMessage = (
    chatRoomId: string,
    content: string,
    mimeType?: string,
    tempMessageId?: string
  ) => {
    webSocketService.sendMessage(chatRoomId, content, mimeType, tempMessageId);
  };

  const sendTyping = (chatRoomId: string, isTyping: boolean) => {
    webSocketService.sendTyping(chatRoomId, isTyping);
  };

  const sendReadReceipt = (chatRoomId: string, messageId: string) => {
    webSocketService.sendReadReceipt(chatRoomId, messageId);
  };

  const sendPing = () => {
    webSocketService.sendPing();
  };

  const joinRoom = (chatRoomId: string) => {
    webSocketService.joinChatRoom(chatRoomId);
  };

  const leaveRoom = (chatRoomId: string) => {
    webSocketService.leaveChatRoom(chatRoomId);
  };
  const onMessage = (handler: (message: Message) => void) => {
    return webSocketService.onMessage(handler);
  };

  const onUserEvent = (handler: (event: UserEventPayload) => void) => {
    return webSocketService.onUserEvent(handler);
  };

  const onActiveUsers = (handler: (users: ActiveUsersListPayload) => void) => {
    return webSocketService.onActiveUsers(handler);
  };

  const onTyping = (handler: (typing: TypingPayload) => void) => {
    return webSocketService.onTyping(handler);
  };

  const onError = (handler: (error: ErrorPayload) => void) => {
    return webSocketService.onError(handler);
  };
  const onJoinSuccess = (handler: (success: JoinSuccessPayload) => void) => {
    return webSocketService.onJoinSuccess(handler);
  };

  const configurePingPong = (options: {
    pingInterval?: number;
    pongTimeout?: number;
  }) => {
    webSocketService.configurePingPong(options);
  };

  const getConnectionHealth = () => {
    return webSocketService.getConnectionHealth();
  };

  const value: WebSocketContextType = {
    isConnected,
    connect,
    disconnect,
    sendMessage,
    sendTyping,
    sendReadReceipt,
    sendPing,
    configurePingPong,
    getConnectionHealth,
    joinRoom,
    leaveRoom,
    onMessage,
    onUserEvent,
    onActiveUsers,
    onTyping,
    onError,
    onJoinSuccess,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider"
    );
  }
  return context;
};
