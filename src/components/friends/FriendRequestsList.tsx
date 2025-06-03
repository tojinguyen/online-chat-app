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
        <div className="text-red-500 mb-4">{error}</div>
      </div>
    );
  }

  if (isLoading && friendRequests.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
        <p className="mt-2 text-gray-600">Loading friend requests...</p>
      </div>
    );
  }

  if (friendRequests.length === 0) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-medium text-gray-700">
          No pending friend requests
        </h3>
        <p className="text-gray-500 mt-2">
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
          className="p-4 flex items-center justify-between hover:bg-gray-50"
        >
          <div className="flex items-center space-x-3">
            {" "}
            <Avatar
              src={request.avatar_url}
              alt={request.requester_name}
              size="md"
            />
            <div>
              <h3 className="font-medium text-gray-900">
                {request.requester_name}
              </h3>
              <p className="text-sm text-gray-500">
                Sent{" "}
                {formatDistanceToNow(new Date(request.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              color="danger"
              onClick={() => handleReject(request.id)}
              disabled={processingIds[request.id]}
            >
              {processingIds[request.id] ? "Processing..." : "Decline"}
            </Button>
            <Button
              onClick={() => handleAccept(request.id)}
              disabled={processingIds[request.id]}
            >
              {processingIds[request.id] ? "Processing..." : "Accept"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
