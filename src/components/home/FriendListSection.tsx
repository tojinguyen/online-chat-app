import { Friend as BaseFriend } from "@/services/friendService";
import socketService from "@/services/socketService";
import { useEffect, useState } from "react";
import OnlineStatus from "../common/OnlineStatus";
import Avatar from "./Avatar";

// Extended Friend type with status field
interface Friend extends BaseFriend {
  status: "online" | "offline";
}

interface FriendListSectionProps {
  friends: Friend[];
  selectedChat: string | null;
  onSelectChat: (id: string) => void;
  loadingFriends: boolean;
  friendsError: string | null;
  onClearError: () => void;
  onRefresh: () => void;
  friendsPage: number;
  friendsTotalPages: number;
  friendsTotalCount: number;
  friendsLimit: number;
  onPageChange: (page: number) => void;
}

export default function FriendListSection({
  friends,
  selectedChat,
  onSelectChat,
  loadingFriends,
  friendsError,
  onClearError,
  onRefresh,
  friendsPage,
  friendsTotalPages,
  friendsTotalCount,
  friendsLimit,
  onPageChange,
}: FriendListSectionProps) {
  // Keep track of real-time status updates
  const [friendStatuses, setFriendStatuses] = useState<Record<string, string>>(
    {}
  );

  // Listen for status changes from socket
  useEffect(() => {
    // Set up listener for status changes
    const unsubscribe = socketService.onStatusChange((status, userId) => {
      setFriendStatuses((prev) => ({
        ...prev,
        [userId]: status,
      }));
    });

    // Clean up on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  // Get the most current status (combines initial status with real-time updates)
  const getFriendStatus = (friend: Friend) => {
    return friendStatuses[friend.id] || friend.status;
  };

  if (loadingFriends) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent mb-3" />
        <p className="text-gray-600 font-medium">Loading friends...</p>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
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
              strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="text-gray-600 font-medium">No friends yet</h3>
        <p className="text-gray-500 text-sm mt-1">
          Start adding friends to chat with
        </p>
      </div>
    );
  }

  return (
    <div className="p-3">
      {/* Friends list header with refresh button */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-700 font-medium">
          Friends ({friendsTotalCount || friends.length})
        </h3>
        <button
          onClick={onRefresh}
          className="text-indigo-600 hover:text-indigo-800 transition-colors p-1 rounded-full hover:bg-indigo-50"
          disabled={loadingFriends}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Error message */}
      {friendsError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-600">{friendsError}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={onClearError}
                  className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none"
                >
                  <svg
                    className="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedChat === friend.id
                ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 shadow-sm"
                : "hover:bg-indigo-50/70"
            }`}
            onClick={() => onSelectChat(friend.id)}
          >
            {" "}
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm">
                <Avatar name={friend.name} avatarUrl={friend.avatar_url} />
              </div>{" "}
              <div className="absolute bottom-0 right-0">
                <OnlineStatus
                  status={getFriendStatus(friend) as "online" | "offline"}
                  size="sm"
                />
              </div>
            </div>
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <span
                  className={`font-semibold ${
                    selectedChat === friend.id
                      ? "text-indigo-700"
                      : "text-gray-800"
                  }`}
                >
                  {friend.name}
                </span>
                <button className="text-xs bg-indigo-100 text-indigo-600 hover:bg-indigo-200 py-1 px-2 rounded-full transition-colors">
                  Message
                </button>
              </div>
              <p className="text-sm text-gray-500">{friend.email}</p>
              <p
                className={`text-sm ${
                  selectedChat === friend.id
                    ? "text-indigo-600"
                    : "text-gray-600"
                } capitalize mt-1`}
              >
                {getFriendStatus(friend)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      {friendsTotalPages > 1 && (
        <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-2">
          <p className="text-xs text-gray-500">
            Showing{" "}
            <span className="font-medium">
              {(friendsPage - 1) * friendsLimit + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(friendsPage * friendsLimit, friendsTotalCount)}
            </span>{" "}
            of <span className="font-medium">{friendsTotalCount}</span> friends
          </p>
          <div className="flex space-x-1">
            <button
              onClick={() => onPageChange(friendsPage - 1)}
              disabled={friendsPage === 1}
              className={`p-1.5 rounded-md text-sm font-medium transition-colors ${
                friendsPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <span className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-700 font-medium rounded-md">
              {friendsPage}
            </span>
            <button
              onClick={() => onPageChange(friendsPage + 1)}
              disabled={friendsPage === friendsTotalPages}
              className={`p-1.5 rounded-md text-sm font-medium transition-colors ${
                friendsPage === friendsTotalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
