"use client";

import { Avatar, Button } from "@/components/ui";
import { userService } from "@/services";
import { Friend } from "@/types";
import { useState } from "react";

interface FriendsListProps {
  friends: Friend[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  onFriendRemoved: () => void;
}

export const FriendsList: React.FC<FriendsListProps> = ({
  friends,
  isLoading,
  error,
  hasMore,
  loadMore,
  onFriendRemoved,
}) => {
  const [removingFriendId, setRemovingFriendId] = useState<string | null>(null);

  const handleRemoveFriend = async (friendId: string) => {
    try {
      setRemovingFriendId(friendId);
      const response = await userService.removeFriend(friendId);

      if (response.success) {
        onFriendRemoved();
      } else {
        console.error("Failed to remove friend:", response.message);
      }
    } catch (error) {
      console.error("Error removing friend:", error);
    } finally {
      setRemovingFriendId(null);
    }
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={onFriendRemoved}>Retry</Button>
      </div>
    );
  }

  if (isLoading && friends.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
        <p className="mt-2 text-gray-600">Loading friends...</p>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-medium text-gray-700">No friends yet</h3>
        <p className="text-gray-500 mt-2">
          Send a friend request to connect with others
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {friends.map((friend) => (
        <div
          key={friend.id}
          className="p-4 flex items-center justify-between hover:bg-gray-50"
        >
          <div className="flex items-center space-x-3">
            {" "}
            <Avatar src={friend.avatar_url} alt={friend.name} size="md" />
            <div>
              <h3 className="font-medium text-gray-900">{friend.name}</h3>
              <p className="text-sm text-gray-500">{friend.email}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              color="danger"
              onClick={() => handleRemoveFriend(friend.id)}
              disabled={removingFriendId === friend.id}
            >
              {removingFriendId === friend.id ? "Removing..." : "Remove"}
            </Button>
            <Button variant="outline">Message</Button>
          </div>
        </div>
      ))}

      {hasMore && (
        <div className="p-4 text-center">
          <Button variant="outline" onClick={loadMore} disabled={isLoading}>
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
};
