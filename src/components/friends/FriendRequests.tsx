import {
  acceptFriendRequest,
  FriendRequest,
  getFriendRequests,
  rejectFriendRequest,
} from "@/services/friendService";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface FriendRequestsProps {
  onRequestAction?: () => void;
}

export default function FriendRequests({
  onRequestAction,
}: FriendRequestsProps) {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFriendRequests = async () => {
    setLoading(true);
    try {
      const response = await getFriendRequests();
      if (response.success) {
        setRequests(response.data);
      } else {
        toast.error(response.message || "Failed to load friend requests");
      }
    } catch (error) {
      console.error("Failed to load friend requests:", error);
      toast.error("Failed to load friend requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFriendRequests();
  }, []);

  const handleAccept = async (requestId: string) => {
    try {
      const response = await acceptFriendRequest(requestId);
      if (response.success) {
        toast.success("Friend request accepted");
        // Remove the request from the list
        setRequests((prev) => prev.filter((req) => req.id !== requestId));
        if (onRequestAction) onRequestAction();
      } else {
        toast.error(response.message || "Failed to accept request");
      }
    } catch (error: any) {
      console.error("Failed to accept friend request:", error);
      toast.error(error.response?.data?.message || "Failed to accept request");
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const response = await rejectFriendRequest(requestId);
      if (response.success) {
        toast.success("Friend request rejected");
        // Remove the request from the list
        setRequests((prev) => prev.filter((req) => req.id !== requestId));
        if (onRequestAction) onRequestAction();
      } else {
        toast.error(response.message || "Failed to reject request");
      }
    } catch (error: any) {
      console.error("Failed to reject friend request:", error);
      toast.error(error.response?.data?.message || "Failed to reject request");
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading friend requests...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <h3 className="font-semibold text-lg p-4 border-b">Friend Requests</h3>

      {requests.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {requests.map((request) => (
            <li key={request.id} className="p-4">
              <div className="flex items-center mb-2">
                <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                  <Image
                    src={request.avatar_url || "/default-avatar.png"}
                    alt={request.requester_name}
                    width={40}
                    height={40}
                    className="object-cover h-full w-full"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{request.requester_name}</p>
                  <p className="text-sm text-gray-500">
                    Sent on {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => handleReject(request.id)}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition"
                >
                  Decline
                </button>
                <button
                  onClick={() => handleAccept(request.id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Accept
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 py-6">No friend requests</p>
      )}
    </div>
  );
}
