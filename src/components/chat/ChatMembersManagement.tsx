"use client";

import { chatService } from "@/services";
import { ChatRoom } from "@/types";
import { useState } from "react";
import { Button } from "../ui";
import { UserSelection } from "./UserSelection";

interface ChatMembersManagementProps {
  chatRoom: ChatRoom;
  onClose: () => void;
  onSuccess: () => void;
}

export const ChatMembersManagement = ({
  chatRoom,
  onClose,
  onSuccess,
}: ChatMembersManagementProps) => {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRemovingMember, setIsRemovingMember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "add">("list");

  // In a real app, you would get the current user ID from an auth context
  const currentUserId = "current-user-id"; // Replace with actual implementation
  const isOwner = chatRoom.members.some(
    (member) => member.user_id === currentUserId && member.role === "OWNER"
  );

  const handleAddMembers = async () => {
    if (selectedUserIds.length === 0) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await chatService.addChatRoomMembers(chatRoom.id, {
        members: selectedUserIds,
      });

      if (response.success) {
        setSelectedUserIds([]);
        setView("list");
        onSuccess();
      } else {
        setError(response.message || "Failed to add members");
      }
    } catch (err) {
      console.error("Error adding members:", err);
      setError("An error occurred while adding members");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      setIsRemovingMember(true);
      setError(null);

      const response = await chatService.removeChatRoomMember(
        chatRoom.id,
        userId
      );

      if (response.success) {
        onSuccess();
      } else {
        setError(response.message || "Failed to remove member");
      }
    } catch (err) {
      console.error("Error removing member:", err);
      setError("An error occurred while removing member");
    } finally {
      setIsRemovingMember(false);
    }
  };

  const handleLeaveChatRoom = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await chatService.leaveChatRoom(chatRoom.id);

      if (response.success) {
        onClose();
        // Navigate away from the chat room
        window.location.href = "/chat";
      } else {
        setError(response.message || "Failed to leave chat room");
      }
    } catch (err) {
      console.error("Error leaving chat room:", err);
      setError("An error occurred while leaving the chat room");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">
        {view === "list" ? "Manage Members" : "Add Members"}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {view === "list" ? (
        <>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-medium">
                Members ({chatRoom.member_count})
              </h3>
              {isOwner && (
                <Button
                  size="sm"
                  onClick={() => setView("add")}
                  disabled={isLoading}
                >
                  Add Members
                </Button>
              )}
            </div>

            <div className="max-h-60 overflow-y-auto border rounded-md divide-y">
              {chatRoom.members.map((member) => (
                <div
                  key={member.user_id}
                  className="flex items-center justify-between p-3 hover:bg-slate-50"
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 mr-3">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-xs text-slate-500">
                        Joined {new Date(member.joined_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {isOwner && member.user_id !== currentUserId && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveMember(member.user_id)}
                      disabled={isRemovingMember}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <Button
              variant="outline"
              color="danger"
              onClick={handleLeaveChatRoom}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Leaving..." : "Leave Chat Room"}
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-4">
            <UserSelection
              selectedUserIds={selectedUserIds}
              onChange={setSelectedUserIds}
            />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setView("list");
                setSelectedUserIds([]);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddMembers}
              disabled={isLoading || selectedUserIds.length === 0}
            >
              {isLoading ? "Adding..." : "Add Members"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
