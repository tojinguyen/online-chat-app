import { useAuth } from "@/contexts/auth/AuthContext";
import { Message } from "@/services/messageService";
import socketService, { ConnectionStatus } from "@/services/socketService";
import { useCallback, useEffect, useState } from "react";

export function useSocket(conversationId?: string) {
  const { user } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    socketService.getConnectionStatus()
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});

  // Connect to the socket server
  useEffect(() => {
    if (!user) return;

    // Connect to the socket if not already connected
    if (socketService.getConnectionStatus() === "disconnected") {
      socketService.connect();
    }

    // Join a specific conversation if ID is provided
    if (conversationId) {
      socketService.joinChatRoom(conversationId);
    }

    // Clean up on unmount
    return () => {
      if (conversationId) {
        socketService.leaveChatRoom(conversationId);
      }
    };
  }, [user, conversationId]);

  // Set up event listeners
  useEffect(() => {
    if (!user) return;

    // Handle connection status changes
    const unsubConnectionStatus = socketService.onConnectionStatusChange(
      (status) => setConnectionStatus(status)
    );

    // Handle incoming messages
    const unsubMessage = socketService.onMessage((socketMsg) => {
      if (conversationId && socketMsg.conversationId === conversationId) {
        const newMessage: Message = {
          id: socketMsg.id,
          conversationId: socketMsg.conversationId,
          sender: socketMsg.senderName,
          content: socketMsg.content,
          time: new Date(socketMsg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isMine: socketMsg.senderId === user,
        };

        setMessages((prev) => [...prev, newMessage]);
      }
    });

    // Handle typing indicators
    const unsubTyping = socketService.onTyping((data) => {
      if (conversationId && data.conversationId === conversationId) {
        setTypingUsers((prev) => ({
          ...prev,
          [data.userId]: data.isTyping,
        }));
      }
    });

    // Clean up event listeners on unmount
    return () => {
      unsubConnectionStatus();
      unsubMessage();
      unsubTyping();
    };
  }, [user, conversationId]);

  // Send a new message
  const sendMessage = useCallback(
    (content: string) => {
      if (!conversationId) return;
      socketService.sendMessage(conversationId, content);
    },
    [conversationId]
  );

  // Send typing status
  const sendTypingStatus = useCallback(
    (isTyping: boolean) => {
      if (!conversationId) return;
      socketService.sendTypingStatus(conversationId, isTyping);
    },
    [conversationId]
  );

  // Disconnect from the socket server
  const disconnect = useCallback(() => {
    socketService.disconnect();
  }, []);

  return {
    connectionStatus,
    messages,
    typingUsers,
    sendMessage,
    sendTypingStatus,
    disconnect,
    isConnected: connectionStatus === "connected",
  };
}
