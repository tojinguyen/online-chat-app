import { chatService } from "@/services";
import { ChatPaginationParams, ChatRoom } from "@/types";
import { mockChatRooms } from "@/utils/mockData";
import { useCallback, useEffect, useState } from "react";

export const useChatRooms = (initialParams?: ChatPaginationParams) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [params, setParams] = useState<ChatPaginationParams>(
    initialParams || { page: 1, limit: 20 }
  );

  const fetchChatRooms = useCallback(
    async (queryParams?: ChatPaginationParams) => {
      try {
        setIsLoading(true);
        setError(null);

        const currentParams = queryParams || params;
        const response = await chatService.getChatRooms(currentParams);

        if (response.success) {
          console.log("API Response:", response.data);
          setChatRooms(response.data.data);
          setTotalCount(response.data.total_count);
        } else {
          console.warn("API Error, using mock data:", response.message);
          setChatRooms(mockChatRooms);
          setTotalCount(mockChatRooms.length);
          setError(response.message);
        }
      } catch (err) {
        console.error("Error fetching chat rooms, using mock data:", err);
        setChatRooms(mockChatRooms);
        setTotalCount(mockChatRooms.length);
        setError("Failed to fetch chat rooms");
      } finally {
        setIsLoading(false);
      }
    },
    [params]
  );

  useEffect(() => {
    fetchChatRooms();
  }, [fetchChatRooms]);

  const updateParams = (newParams: Partial<ChatPaginationParams>) => {
    setParams((prevParams) => ({
      ...prevParams,
      ...newParams,
    }));
  };

  return {
    chatRooms,
    isLoading,
    error,
    totalCount,
    params,
    updateParams,
    refreshChatRooms: fetchChatRooms,
  };
};
