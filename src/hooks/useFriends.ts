import { userService } from "@/services";
import { Friend } from "@/types";
import { useCallback, useEffect, useState } from "react";

export const useFriends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  const fetchFriends = useCallback(async (pageNum: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await userService.getFriends(pageNum, limit);

      if (response.success) {
        if (pageNum === 1) {
          setFriends(response.data);
        } else {
          setFriends((prev) => [...prev, ...response.data]);
        }

        // Since we don't have total_count in the response, we'll use the length of the friends array
        setTotalCount(response.data.length);
        setHasMore(response.data.length === limit);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to fetch friends");
      console.error("Error fetching friends:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const loadMoreFriends = () => {
    if (hasMore && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchFriends(nextPage);
    }
  };

  const refreshFriends = () => {
    setPage(1);
    fetchFriends(1);
  };

  return {
    friends,
    isLoading,
    error,
    totalCount,
    hasMore,
    loadMoreFriends,
    refreshFriends,
  };
};
