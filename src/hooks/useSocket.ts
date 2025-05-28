import { useAuth } from "@/contexts/auth/AuthContext";
import { Message } from "@/services/messageService";
import socketService, {
  ChatMessagePayload,
  ConnectionStatus,
} from "@/services/socketService";
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
      if (conversationId && socketMsg.chat_room_id === conversationId) {
        const chatData = socketMsg.data as unknown as ChatMessagePayload;
        const newMessage: Message = {
          id: chatData?.message_id || `socket_${Date.now()}`,
          conversationId: socketMsg.chat_room_id || "",
          sender_id: socketMsg.sender_id,
          sender_name: socketMsg.sender_id, // Use sender_id as fallback for sender_name since it's not available in SocketMessage
          content: chatData?.content || "",
          timestamp: new Date(socketMsg.timestamp).toISOString(), // Convert number timestamp to ISO string
          isMine: socketMsg.sender_id === user,
        };

        setMessages((prev) => [...prev, newMessage]);
      }
    });

    // Handle typing indicators
    const unsubTyping = socketService.onTyping((data) => {
      if (conversationId && data.chat_room_id === conversationId) {
        setTypingUsers((prev) => ({
          ...prev,
          [data.sender_id]: data.is_typing,
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
