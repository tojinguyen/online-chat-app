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
        <div className="text-red-500 mb-4 rounded-md bg-red-50 p-4 border border-red-200">
          {error}
        </div>
        <Button onClick={onFriendRemoved} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  if (isLoading && friends.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
        <p className="mt-3 text-gray-600 font-medium">Loading friends...</p>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="p-10 text-center">
        <div className="bg-gray-50 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700">No friends yet</h3>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
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
          className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center space-x-4">
            <Avatar
              src={friend.avatar_url}
              alt={friend.name}
              size="md"
              className="border-2 border-white shadow-sm"
            />
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {friend.name}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">{friend.email}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="ghost"
              color="danger"
              onClick={() => handleRemoveFriend(friend.id)}
              disabled={removingFriendId === friend.id}
              className="hover:bg-red-50"
            >
              {removingFriendId === friend.id ? (
                <>
                  <span className="animate-pulse mr-2">●</span>
                  Removing...
                </>
              ) : (
                "Remove"
              )}
            </Button>
            <Button
              variant="outline"
              className="px-5 hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              Message
            </Button>
          </div>
        </div>
      ))}

      {hasMore && (
        <div className="p-6 text-center">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={isLoading}
            className="px-6 py-2.5 font-medium hover:bg-gray-50 transition-colors"
          >
            {isLoading ? (
              <>
                <span className="animate-spin inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
