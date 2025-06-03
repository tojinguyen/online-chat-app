"use client";

import { Button, Input } from "@/components/ui";
import { userService } from "@/services";
import { AlertCircle, Search, UserPlus } from "lucide-react";
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
      <h2 className="text-lg font-semibold mb-4">Find Friends</h2>
      <div className="flex gap-2 mb-4">
        {" "}
        <Input
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
          leftIcon={<Search size={18} />}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
        >
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertCircle size={16} className="mr-2" />
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
          {success}
        </div>
      )}
      {searchResults.length > 0 && (
        <div className="mt-4 border rounded-md divide-y">
          {searchResults.map((user) => (
            <div
              key={user.id}
              className="p-3 flex justify-between items-center hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {" "}
                  {user.avatar_url ? (
                    <Image
                      src={user.avatar_url}
                      alt={user.name}
                      className="h-full w-full object-cover"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <span className="text-gray-500">{user.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddFriend(user.id)}
                disabled={isSubmitting && selectedUserId === user.id}
              >
                {isSubmitting && selectedUserId === user.id ? (
                  "Sending..."
                ) : (
                  <>
                    <UserPlus size={16} className="mr-1" />
                    Add
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      )}{" "}
      {searchQuery && !isSearching && searchResults.length === 0 && (
        <div className="text-center p-4 text-gray-500">
          No users found matching &quot;{searchQuery}&quot;
        </div>
      )}
    </div>
  );
};
