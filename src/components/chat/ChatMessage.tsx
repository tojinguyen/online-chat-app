"use client";

import { Message } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Avatar } from "../ui";

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
}

export const ChatMessage = ({ message, isCurrentUser }: ChatMessageProps) => {
  const formattedTime = formatDistanceToNow(new Date(message.created_at), {
    addSuffix: true,
    includeSeconds: true,
  });

  return (
    <div
      className={`flex mb-4 ${isCurrentUser ? "justify-end" : "justify-start"}`}
    >
      {!isCurrentUser && (
        <div className="mr-2 flex-shrink-0">
          <Avatar
            src={message.avatar_url}
            alt={message.sender_name}
            size="sm"
          />
        </div>
      )}
      <div
        className={`max-w-[70%] ${
          isCurrentUser
            ? "bg-primary-500 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl"
            : "bg-slate-100 text-slate-800 rounded-tl-xl rounded-tr-xl rounded-br-xl"
        } px-4 py-2 shadow-sm`}
      >
        {!isCurrentUser && (
          <div className="text-xs font-medium text-slate-600 mb-1">
            {message.sender_name}
          </div>
        )}
        <div className="break-words">{message.content}</div>
        <div
          className={`text-xs mt-1 ${
            isCurrentUser ? "text-primary-100" : "text-slate-500"
          }`}
        >
          {formattedTime}
        </div>
      </div>
    </div>
  );
};
