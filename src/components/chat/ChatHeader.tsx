"use client";

import { ChatRoom } from "@/types";
import { Avatar } from "../ui";

interface ChatHeaderProps {
  chatRoom: ChatRoom;
  onlineMembers?: string[];
}

export const ChatHeader = ({
  chatRoom,
  onlineMembers = [],
}: ChatHeaderProps) => {
  // In a real app, you would get the current user ID from authentication context
  const currentUserId = "current-user-id"; // Replace with actual implementation

  // For private chats, get the other user's name
  const otherMember =
    chatRoom.type === "PRIVATE"
      ? chatRoom.members.find((member) => member.user_id !== currentUserId)
      : null;

  const displayName = otherMember ? otherMember.name : chatRoom.name;

  const avatarUrl = otherMember?.avatar_url || "";

  const isOnline = otherMember
    ? onlineMembers.includes(otherMember.user_id)
    : chatRoom.members.some((member) => onlineMembers.includes(member.user_id));

  return (
    <div className="p-4 border-b bg-white shadow-sm flex items-center justify-between">
      <div className="flex items-center">
        <div className="relative">
          <Avatar src={avatarUrl} alt={displayName} size="md" />
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
          )}
        </div>
        <div className="ml-3">
          <h3 className="font-semibold text-slate-800">{displayName}</h3>
          <div className="text-xs text-slate-500">
            {chatRoom.type === "GROUP"
              ? `${chatRoom.member_count} members`
              : isOnline
              ? "Online"
              : "Offline"}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {chatRoom.type === "GROUP" && (
          <button className="text-slate-500 hover:text-primary-500 p-2 rounded-full hover:bg-slate-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
            </svg>
          </button>
        )}
        <button className="text-slate-500 hover:text-primary-500 p-2 rounded-full hover:bg-slate-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
