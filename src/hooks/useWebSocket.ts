import { webSocketService } from "@/services";
import { Message } from "@/types";
import { useEffect, useRef, useState } from "react";

export const useWebSocket = (chatRoomId?: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesRef = useRef<Message[]>(messages);

  // Update the ref whenever messages change
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    // Connect to WebSocket if not already connected
    webSocketService.connect();

    // Cleanup on unmount - but don't disconnect as other components might be using it
    return () => {
      // webSocketService.disconnect(); // Commented out to maintain global connection
    };
  }, []);

  useEffect(() => {
    // Join the specified chat room
    console.log(
      "useWebSocket effect - chatRoomId:",
      chatRoomId,
      "isConnected:",
      isConnected
    ); // Debug log
    if (chatRoomId && isConnected) {
      console.log("Calling joinChatRoom with:", chatRoomId); // Debug log
      webSocketService.joinChatRoom(chatRoomId);

      // Leave the chat room when unmounting or changing rooms
      return () => {
        webSocketService.leaveChatRoom(chatRoomId);
      };
    }
  }, [chatRoomId, isConnected]);

  useEffect(() => {
    // Handle new messages
    const unsubscribeMessage = webSocketService.onMessage((message) => {
      if (chatRoomId && message.chat_room_id === chatRoomId) {
        setMessages((prev) => {
          // Check if message already exists
          if (!prev.some((m) => m.id === message.id)) {
            return [...prev, message];
          }
          return prev;
        });
      }
    });

    // Handle connection status changes
    const unsubscribeConnection = webSocketService.onConnectionStatus(
      (connected) => {
        setIsConnected(connected);

        // Re-join the room if we reconnect
        if (connected && chatRoomId) {
          webSocketService.joinChatRoom(chatRoomId);
        }
      }
    );

    // Cleanup subscriptions
    return () => {
      unsubscribeMessage();
      unsubscribeConnection();
    };
  }, [chatRoomId]);

  const sendMessage = (content: string, type: string = "TEXT") => {
    if (chatRoomId) {
      webSocketService.sendMessage(chatRoomId, content, type);
    }
  };

  return {
    isConnected,
    messages,
    sendMessage,
  };
};
