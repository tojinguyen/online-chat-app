import { Friend, getFriends, removeFriend } from "@/services/friendService";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function FriendsList() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const loadFriends = async () => {
    setLoading(true);
    try {
      const response = await getFriends(page, limit);
      if (response.success) {
        setFriends(response.data);
        // Since the API response doesn't include total pages info in the example,
        // we'll assume there are more pages if we get a full page of results
        if (response.data.length === limit) {
          setTotalPages(page + 1); // At least one more page
        } else {
          setTotalPages(page); // This is the last page
        }
      } else {
        toast.error(response.message || "Failed to load friends");
      }
    } catch (error) {
      console.error("Failed to load friends:", error);
      toast.error("Failed to load friends list");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const handleRemoveFriend = async (friendId: string) => {
    try {
      const response = await removeFriend(friendId);
      if (response.success) {
        toast.success("Friend removed successfully");
        // Remove the friend from the list
        setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
      } else {
        toast.error(response.message || "Failed to remove friend");
      }
    } catch (error: unknown) {
      console.error("Failed to remove friend:", error);
      if (error instanceof Error) {
        const errorWithResponse = error as {
          response?: { data?: { message?: string } };
        };
        if (errorWithResponse.response?.data?.message) {
          toast.error(errorWithResponse.response.data.message);
        } else {
          toast.error("Failed to remove friend");
        }
      } else {
        toast.error("Failed to remove friend");
      }
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  if (loading && friends.length === 0) {
    return <div className="text-center py-4">Loading friends...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <h3 className="font-semibold text-lg p-4 border-b">Friends</h3>

      {friends.length > 0 ? (
        <div>
          <ul className="divide-y divide-gray-200">
            {friends.map((friend) => (
              <li
                key={friend.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src={friend.avatar_url || "/default-avatar.png"}
                      alt={friend.name}
                      width={40}
                      height={40}
                      className="object-cover h-full w-full"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{friend.name}</p>
                    <p className="text-sm text-gray-500">{friend.email}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleRemoveFriend(friend.id)}
                    className="text-red-500 hover:bg-red-50 px-3 py-1 rounded transition"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="flex justify-between p-4 border-t">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className={`px-3 py-1 rounded ${
                  page === 1
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-blue-100 hover:bg-blue-200"
                }`}
              >
                Previous
              </button>
              <span>Page {page}</span>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className={`px-3 py-1 rounded ${
                  page === totalPages
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-blue-100 hover:bg-blue-200"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-6">No friends yet</p>
      )}
    </div>
  );
}
