import { chatService } from "@/services";
import { ChatPaginationParams, Message } from "@/types";
import { useCallback, useEffect, useState } from "react";

export const useChatMessages = (
  chatRoomId: string,
  initialParams?: ChatPaginationParams
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [params, setParams] = useState<ChatPaginationParams>(
    initialParams || { page: 1, limit: 20 }
  );

  const fetchMessages = useCallback(
    async (queryParams?: ChatPaginationParams) => {
      if (!chatRoomId) return;

      try {
        setIsLoading(true);
        setError(null);

        const currentParams = queryParams || params;
        const response = await chatService.getChatRoomMessages(
          chatRoomId,
          currentParams
        );

        if (response.success) {
          // Sort messages by creation date
          const sortedMessages = [...response.data].sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          );

          if (currentParams.page === 1) {
            setMessages(sortedMessages);
          } else {
            // Prepend older messages
            setMessages((prev) => [...sortedMessages, ...prev]);
          }

          setTotalCount(response.data.length);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError("Failed to fetch messages");
        console.error("Error fetching messages:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [chatRoomId, params]
  );

  useEffect(() => {
    if (chatRoomId) {
      // Reset state when chat room changes
      setMessages([]);
      setTotalCount(0);
      setParams({ page: 1, limit: 20 });

      // Use inline function to avoid dependency on fetchMessages
      const loadInitialMessages = async () => {
        try {
          setIsLoading(true);
          setError(null);

          const initialParams = { page: 1, limit: 20 };
          const response = await chatService.getChatRoomMessages(
            chatRoomId,
            initialParams
          );

          if (response.success) {
            // Sort messages by creation date
            const sortedMessages = [...response.data].sort(
              (a, b) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
            );

            setMessages(sortedMessages);
            setTotalCount(response.data.length);
          } else {
            setError(response.message);
          }
        } catch (err) {
          setError("Failed to fetch messages");
          console.error("Error fetching messages:", err);
        } finally {
          setIsLoading(false);
        }
      };

      loadInitialMessages();
    }
  }, [chatRoomId]); // Only depend on chatRoomId

  const loadMoreMessages = () => {
    if (messages.length < totalCount && !isLoading) {
      const newParams = {
        ...params,
        page: params.page + 1,
      };
      setParams(newParams);
      fetchMessages(newParams);
    }
  };

  const addMessage = (message: Message) => {
    // Check if message already exists
    if (!messages.some((m) => m.id === message.id)) {
      setMessages((prev) => [...prev, message]);
    }
  };

  return {
    messages,
    isLoading,
    error,
    totalCount,
    loadMoreMessages,
    refreshMessages: () => fetchMessages({ page: 1, limit: params.limit }),
    addMessage,
  };
};
