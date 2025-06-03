"use client";

import { Button, Input } from "@/components/ui";
import { userService } from "@/services";
import { AlertCircle, CheckCircle, Search, UserPlus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface AddFriendProps {
  onSuccess: () => void;
}

export const AddFriend: React.FC<AddFriendProps> = ({ onSuccess }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<
    Array<{ id: string; name: string; email: string; avatar_url: string }>
  >([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      setError(null);
      const response = await userService.searchUsers({
        query: searchQuery,
        page: 1,
        limit: 5,
      });

      if (response.success) {
        setSearchResults(response.data.users);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to search for users");
      console.error("Error searching users:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFriend = async (userId: string) => {
    try {
      setIsSubmitting(true);
      setSelectedUserId(userId);
      setError(null);
      setSuccess(null);

      const response = await userService.sendFriendRequest({
        friendId: userId,
      });

      if (response.success) {
        setSuccess("Friend request sent successfully!");
        setSearchQuery("");
        setSearchResults([]);
        onSuccess();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to send friend request");
      console.error("Error sending friend request:", err);
    } finally {
      setIsSubmitting(false);
      setSelectedUserId(null);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-5 text-gray-800 flex items-center">
        <UserPlus size={20} className="mr-2 text-blue-500" />
        Find Friends
      </h2>
      <div className="flex gap-3 mb-5">
        <Input
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 shadow-sm"
          leftIcon={<Search size={18} className="text-gray-400" />}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
          className="px-5 shadow-sm hover:shadow transition-shadow"
        >
          {isSearching ? (
            <>
              <span className="animate-spin inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
              Searching...
            </>
          ) : (
            "Search"
          )}
        </Button>
      </div>
      {error && (
        <div className="mb-5 p-4 bg-red-50 text-red-700 rounded-md flex items-center border border-red-200">
          <AlertCircle size={18} className="mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="mb-5 p-4 bg-green-50 text-green-700 rounded-md flex items-center border border-green-200">
          <CheckCircle size={18} className="mr-2 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {searchResults.length > 0 && (
        <div className="mt-5 border rounded-lg divide-y overflow-hidden shadow-sm">
          {searchResults.map((user) => (
            <div
              key={user.id}
              className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                  {user.avatar_url ? (
                    <Image
                      src={user.avatar_url}
                      alt={user.name}
                      className="h-full w-full object-cover"
                      width={48}
                      height={48}
                    />
                  ) : (
                    <span className="text-gray-500 text-lg font-semibold">
                      {user.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddFriend(user.id)}
                disabled={isSubmitting && selectedUserId === user.id}
                className="px-4 hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                {isSubmitting && selectedUserId === user.id ? (
                  <>
                    <span className="animate-spin inline-block h-3 w-3 border-2 border-current border-t-transparent rounded-full mr-2"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <UserPlus size={16} className="mr-2 text-blue-500" />
                    Add Friend
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      )}
      {searchQuery && !isSearching && searchResults.length === 0 && (
        <div className="text-center p-6 text-gray-500 bg-gray-50 rounded-lg border border-gray-200 mt-4">
          <Search size={24} className="mx-auto mb-2 text-gray-400" />
          <p>
            No users found matching &quot;
            <span className="font-medium">{searchQuery}</span>
            &quot;
          </p>
        </div>
      )}
    </div>
  );
};
