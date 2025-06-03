"use client";

import { Avatar, Button } from "@/components/ui";
import { FriendRequest } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

interface FriendRequestsListProps {
  friendRequests: FriendRequest[];
  isLoading: boolean;
  error: string | null;
  onAccept: (requestId: string) => Promise<void>;
  onReject: (requestId: string) => Promise<void>;
}

export const FriendRequestsList: React.FC<FriendRequestsListProps> = ({
  friendRequests,
  isLoading,
  error,
  onAccept,
  onReject,
}) => {
  const [processingIds, setProcessingIds] = useState<Record<string, boolean>>(
    {}
  );

  const handleAccept = async (requestId: string) => {
    try {
      setProcessingIds((prev) => ({ ...prev, [requestId]: true }));
      await onAccept(requestId);
    } finally {
      setProcessingIds((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      setProcessingIds((prev) => ({ ...prev, [requestId]: true }));
      await onReject(requestId);
    } finally {
      setProcessingIds((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4 rounded-md bg-red-50 p-4 border border-red-200">
          {error}
        </div>
      </div>
    );
  }

  if (isLoading && friendRequests.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
        <p className="mt-3 text-gray-600 font-medium">
          Loading friend requests...
        </p>
      </div>
    );
  }

  if (friendRequests.length === 0) {
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
        <h3 className="text-xl font-semibold text-gray-700">
          No pending friend requests
        </h3>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          When someone sends you a friend request, it will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {friendRequests.map((request) => (
        <div
          key={request.id}
          className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center space-x-4">
            <Avatar
              src={request.avatar_url}
              alt={request.requester_name}
              size="md"
              className="border-2 border-white shadow-sm"
            />
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {request.requester_name}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                Sent{" "}
                {formatDistanceToNow(new Date(request.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              color="danger"
              onClick={() => handleReject(request.id)}
              disabled={processingIds[request.id]}
              className="px-4 hover:bg-red-50"
            >
              {processingIds[request.id] ? (
                <>
                  <span className="animate-pulse mr-2">●</span>
                  Processing...
                </>
              ) : (
                "Decline"
              )}
            </Button>
            <Button
              onClick={() => handleAccept(request.id)}
              disabled={processingIds[request.id]}
              className="px-5 shadow-sm hover:shadow"
            >
              {processingIds[request.id] ? (
                <>
                  <span className="animate-pulse mr-2">●</span>
                  Processing...
                </>
              ) : (
                "Accept"
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
