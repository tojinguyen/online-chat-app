import { useWebSocketContext } from "@/context/WebSocketContext";
import { TypingPayload } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseTypingOptions {
  chatRoomId: string;
  typingTimeout?: number; // Duration in milliseconds to show typing indicator
  stopTypingDelay?: number; // Delay in milliseconds to stop typing after user stops typing
  // Optional members list to resolve user IDs to names
  members?: Array<{ user_id: string; name: string }>;
}

interface UseTypingReturn {
  typingUsers: string[]; // List of user names currently typing
  startTyping: () => void;
  stopTyping: () => void;
  isCurrentUserTyping: boolean;
}

export const useTyping = ({
  chatRoomId,
  typingTimeout = 5000, // Increased from 3000 to 5000ms
  stopTypingDelay = 3000, // Increased from 1000 to 3000ms to reduce spam
  members = [],
}: UseTypingOptions): UseTypingReturn => {
  const { sendTyping, onTyping, isConnected } = useWebSocketContext();
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isCurrentUserTyping, setIsCurrentUserTyping] = useState(false);
  // Refs to manage timers
  const stopTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingUsersTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Helper function to resolve user ID to user name
  const resolveUserName = useCallback(
    (userId: string): string => {
      const member = members.find((m) => m.user_id === userId);
      return member ? member.name : `User ${userId.slice(0, 8)}`;
    },
    [members]
  );

  // Clear typing for a specific user after timeout
  const clearUserTyping = useCallback(
    (userNameOrId: string) => {
      setTypingUsers((prev) => prev.filter((name) => name !== userNameOrId));

      // For timeouts, we need to find the userId that maps to this userName
      // This is a bit complex due to the ID->Name mapping, but works for cleanup
      const timeoutEntries = Array.from(
        typingUsersTimeoutRef.current.entries()
      );
      for (const [userId, timeout] of timeoutEntries) {
        const userName = resolveUserName(userId);
        if (userName === userNameOrId) {
          clearTimeout(timeout);
          typingUsersTimeoutRef.current.delete(userId);
          break;
        }
      }
    },
    [resolveUserName]
  ); // Handle incoming typing events from other users
  useEffect(() => {
    if (!chatRoomId || !isConnected) return;
    const unsubscribeTyping = onTyping(
      (typing: TypingPayload, senderId?: string) => {
        // Only handle typing events for the current chat room
        // Check both chat_room_id (if provided) and compare with current chatRoomId
        if (typing.chat_room_id && typing.chat_room_id !== chatRoomId) return;

        // Use user_id from payload, fallback to senderId if available
        const userId = typing.user_id || senderId || `anonymous-${chatRoomId}`;
        const userName = resolveUserName(userId);

        if (typing.is_typing) {
          // Add user to typing list if not already there
          setTypingUsers((prev) => {
            if (!prev.includes(userName)) {
              return [...prev, userName];
            }
            return prev;
          });

          // Clear any existing timeout for this user
          const existingTimeout = typingUsersTimeoutRef.current.get(userId);
          if (existingTimeout) {
            clearTimeout(existingTimeout);
          }

          // Set a timeout to automatically clear typing status
          const timeout = setTimeout(() => {
            clearUserTyping(userName);
          }, typingTimeout);

          typingUsersTimeoutRef.current.set(userId, timeout);
        } else {
          // User stopped typing
          clearUserTyping(userName);
        }
      }
    );

    return unsubscribeTyping;
  }, [
    chatRoomId,
    isConnected,
    onTyping,
    typingTimeout,
    clearUserTyping,
    resolveUserName,
  ]); // Start typing indicator
  const startTyping = useCallback(() => {
    console.log("startTyping called", {
      chatRoomId,
      isConnected,
      isCurrentUserTyping,
    });

    if (!chatRoomId || !isConnected || isCurrentUserTyping) return;

    console.log("Starting typing...");
    setIsCurrentUserTyping(true);
    sendTyping(chatRoomId, true);

    // Clear any existing stop typing timeout
    if (stopTypingTimeoutRef.current) {
      clearTimeout(stopTypingTimeoutRef.current);
    }

    // Set timeout to automatically stop typing
    stopTypingTimeoutRef.current = setTimeout(() => {
      if (chatRoomId && isConnected) {
        setIsCurrentUserTyping(false);
        sendTyping(chatRoomId, false);
        if (stopTypingTimeoutRef.current) {
          clearTimeout(stopTypingTimeoutRef.current);
          stopTypingTimeoutRef.current = null;
        }
      }
    }, stopTypingDelay);
  }, [
    chatRoomId,
    isConnected,
    isCurrentUserTyping,
    sendTyping,
    stopTypingDelay,
  ]);
  // Stop typing indicator
  const stopTyping = useCallback(() => {
    if (!chatRoomId || !isConnected || !isCurrentUserTyping) return;

    setIsCurrentUserTyping(false);
    sendTyping(chatRoomId, false);

    // Clear stop typing timeout
    if (stopTypingTimeoutRef.current) {
      clearTimeout(stopTypingTimeoutRef.current);
      stopTypingTimeoutRef.current = null;
    }
  }, [chatRoomId, isConnected, isCurrentUserTyping, sendTyping]);

  // Cleanup on unmount or when chatRoomId changes
  useEffect(() => {
    // Store current references for cleanup at the time the effect runs
    const currentStopTimeout = stopTypingTimeoutRef.current;
    const currentTypingTimeouts = typingUsersTimeoutRef.current;

    return () => {
      // Clear all timers
      if (currentStopTimeout) {
        clearTimeout(currentStopTimeout);
      }

      currentTypingTimeouts.forEach((timeout) => {
        clearTimeout(timeout);
      });
      currentTypingTimeouts.clear();

      // Send stop typing if currently typing
      if (isCurrentUserTyping && chatRoomId && isConnected) {
        sendTyping(chatRoomId, false);
      }
    };
  }, [chatRoomId, isCurrentUserTyping, isConnected, sendTyping]);

  return {
    typingUsers,
    startTyping,
    stopTyping,
    isCurrentUserTyping,
  };
};
