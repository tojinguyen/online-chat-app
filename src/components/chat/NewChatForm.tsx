"use client";

import { chatService } from "@/services";
import { ChatRoomType } from "@/types";
import { useState } from "react";
import { Button, Input } from "../ui";

interface NewChatFormProps {
  onCancel: () => void;
  onSuccess: (chatRoomId: string) => void;
}

export const NewChatForm = ({ onCancel, onSuccess }: NewChatFormProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<ChatRoomType>(ChatRoomType.GROUP);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // In a real app, you would fetch users to select from
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  const handleCreateChatRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() && type === ChatRoomType.GROUP) {
      setError("Group name is required");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await chatService.createChatRoom({
        name: name.trim(),
        type,
        members: selectedMemberIds,
      });

      if (response.success) {
        onSuccess(response.data.id);
      } else {
        setError(response.message || "Failed to create chat room");
      }
    } catch (error) {
      console.error("Error creating chat room:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Create New Conversation</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleCreateChatRoom}>
        <div className="mb-4">
          <div className="flex space-x-4 mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={type === ChatRoomType.GROUP}
                onChange={() => setType(ChatRoomType.GROUP)}
                className="mr-2"
              />
              Group Chat
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={type === ChatRoomType.PRIVATE}
                onChange={() => setType(ChatRoomType.PRIVATE)}
                className="mr-2"
              />
              Private Chat
            </label>
          </div>

          {type === ChatRoomType.GROUP && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Group Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter group name"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Select Members
            </label>
            <div className="text-sm text-slate-500 italic mb-2">
              In a real app, this would be a user selection component
            </div>
            <div className="flex flex-wrap gap-2">
              {["user1", "user2", "user3"].map((userId) => (
                <label
                  key={userId}
                  className="flex items-center p-2 border rounded-md"
                >
                  <input
                    type="checkbox"
                    checked={selectedMemberIds.includes(userId)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMemberIds([...selectedMemberIds, userId]);
                      } else {
                        setSelectedMemberIds(
                          selectedMemberIds.filter((id) => id !== userId)
                        );
                      }
                    }}
                    className="mr-2"
                  />
                  User {userId}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              isLoading ||
              (type === ChatRoomType.GROUP && !name.trim()) ||
              selectedMemberIds.length === 0
            }
          >
            {isLoading ? "Creating..." : "Create Chat"}
          </Button>
        </div>
      </form>
    </div>
  );
};
