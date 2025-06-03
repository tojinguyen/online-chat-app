import { userService } from "@/services";
import { FriendRequest } from "@/types";
import { useCallback, useEffect, useState } from "react";

export const useFriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFriendRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await userService.getFriendRequests();

      if (response.success) {
        setFriendRequests(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to fetch friend requests");
      console.error("Error fetching friend requests:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFriendRequests();
  }, [fetchFriendRequests]);

  const acceptFriendRequest = async (requestId: string) => {
    try {
      setIsLoading(true);
      const response = await userService.acceptFriendRequest(requestId);

      if (response.success) {
        // Remove the accepted request from the list
        setFriendRequests((prev) => prev.filter((req) => req.id !== requestId));
        return true;
      } else {
        setError(response.message);
        return false;
      }
    } catch (err) {
      setError("Failed to accept friend request");
      console.error("Error accepting friend request:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const rejectFriendRequest = async (requestId: string) => {
    try {
      setIsLoading(true);
      const response = await userService.rejectFriendRequest(requestId);

      if (response.success) {
        // Remove the rejected request from the list
        setFriendRequests((prev) => prev.filter((req) => req.id !== requestId));
        return true;
      } else {
        setError(response.message);
        return false;
      }
    } catch (err) {
      setError("Failed to reject friend request");
      console.error("Error rejecting friend request:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    friendRequests,
    isLoading,
    error,
    refreshFriendRequests: fetchFriendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
  };
};
