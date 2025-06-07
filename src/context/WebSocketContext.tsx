"use client";

import { webSocketService } from "@/services";
import { Message } from "@/types";
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
  sendMessage: (chatRoomId: string, content: string, type?: string) => void;
  joinRoom: (chatRoomId: string) => void;
  leaveRoom: (chatRoomId: string) => void;
  onMessage: (handler: (message: Message) => void) => () => void;
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
    type: string = "TEXT"
  ) => {
    webSocketService.sendMessage(chatRoomId, content, type);
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

  const value: WebSocketContextType = {
    isConnected,
    connect,
    disconnect,
    sendMessage,
    joinRoom,
    leaveRoom,
    onMessage,
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
