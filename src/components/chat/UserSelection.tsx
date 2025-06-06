"use client";

import { Avatar, Input } from "@/components/ui";
import { userService } from "@/services";
import { UserProfile } from "@/types";
import { useEffect, useState } from "react";

interface UserSelectionProps {
  selectedUserIds: string[];
  onChange: (userIds: string[]) => void;
  excludeCurrentUser?: boolean;
}

export const UserSelection = ({
  selectedUserIds,
  onChange,
  excludeCurrentUser = true,
}: UserSelectionProps) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchQuery.trim()) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await userService.searchUsers(searchQuery);

        if (response.success) {
          let fetchedUsers = response.data;

          // Filter out current user if needed
          if (excludeCurrentUser) {
            // In a real app, get current user ID from auth context
            const currentUserId = "current-user-id"; // Replace with actual implementation
            fetchedUsers = fetchedUsers.filter(
              (user) => user.id !== currentUserId
            );
          }

          setUsers(fetchedUsers);
        } else {
          setError(response.message || "Failed to fetch users");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("An error occurred while fetching users");
      } finally {
        setIsLoading(false);
      }
    }; // Debounce search to avoid too many requests
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, excludeCurrentUser]);

  const handleToggleUser = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      onChange(selectedUserIds.filter((id) => id !== userId));
    } else {
      onChange([...selectedUserIds, userId]);
    }
  };

  return (
    <div className="space-y-3">
      <Input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {isLoading && (
        <div className="flex justify-center p-4">
          <div className="animate-spin h-5 w-5 border-2 border-primary-500 rounded-full border-t-transparent"></div>
        </div>
      )}

      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div className="max-h-60 overflow-y-auto border rounded-md">
        {users.length === 0 && !isLoading ? (
          <div className="p-4 text-center text-slate-500">
            {searchQuery ? "No users found" : "Type to search for users"}
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {users.map((user) => (
              <li key={user.id}>
                <label className="flex items-center p-3 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedUserIds.includes(user.id)}
                    onChange={() => handleToggleUser(user.id)}
                    className="mr-3"
                  />
                  <Avatar src={user.avatar_url} alt={user.name} size="sm" />
                  <div className="ml-3">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-slate-500">{user.email}</div>
                  </div>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedUserIds.length > 0 && (
        <div className="mt-2">
          <div className="text-sm font-medium text-slate-700 mb-2">
            Selected ({selectedUserIds.length}):
          </div>{" "}
          <div className="flex flex-wrap gap-2">
            {users
              .filter((user) => selectedUserIds.includes(user.id))
              .map((user) => (
                <div
                  key={user.id}
                  className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full flex items-center text-sm"
                >
                  {user.name}
                  <button
                    onClick={() => handleToggleUser(user.id)}
                    className="ml-1 text-primary-500 hover:text-primary-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
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
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
