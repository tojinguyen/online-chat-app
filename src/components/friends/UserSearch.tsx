"use client";

import { sendFriendRequest } from "@/services/friendService";
import { searchUsers, UserItem } from "@/services/profileService";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface UserSearchProps {
  onSendRequest?: () => void;
}

export default function UserSearch({ onSendRequest }: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await searchUsers(searchQuery, page, 10);
      if (response.success) {
        setUsers(response.data.users);
        setTotalPages(
          Math.ceil(response.data.total_count / response.data.limit)
        );
      }
    } catch (error) {
      console.error("Failed to search users:", error);
      toast.error("Failed to search users");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (searchQuery) {
      const timer = setTimeout(() => {
        handleSearch();
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setUsers([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, page]);

  const handleSendRequest = async (userId: string) => {
    try {
      const response = await sendFriendRequest(userId);
      if (response.success) {
        toast.success("Friend request sent successfully");
        if (onSendRequest) onSendRequest();
      } else {
        toast.error(response.message || "Failed to send friend request");
      }
    } catch (error: unknown) {
      console.error("Failed to send friend request:", error);
      if (error instanceof Error) {
        const errorWithResponse = error as {
          response?: { data?: { message?: string } };
        };
        if (errorWithResponse.response?.data?.message) {
          toast.error(errorWithResponse.response.data.message);
        } else {
          toast.error("Failed to send friend request");
        }
      } else {
        toast.error("Failed to send friend request");
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

  return (
    <div className="w-full">
      <div className="flex mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users by name..."
          className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {users.length > 0 ? (
        <div className="bg-white rounded-lg shadow">
          <ul className="divide-y divide-gray-200">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src={user.avatar_url || "/default-avatar.png"}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="object-cover h-full w-full"
                    />
                  </div>
                  <span className="font-medium">{user.name}</span>
                </div>
                <button
                  onClick={() => handleSendRequest(user.id)}
                  className="text-blue-500 hover:bg-blue-100 px-3 py-1 rounded transition"
                >
                  Add Friend
                </button>
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
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages || totalPages === 0}
                className={`px-3 py-1 rounded ${
                  page === totalPages || totalPages === 0
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-blue-100 hover:bg-blue-200"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : searchQuery ? (
        <p className="text-center text-gray-500 py-4">No users found</p>
      ) : null}
    </div>
  );
}
