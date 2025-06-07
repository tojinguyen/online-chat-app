"use client";

import { Message } from "@/types";
import { parseMessageContent } from "@/utils/message-parser";
import { formatDistanceToNow } from "date-fns";
import { Avatar } from "../ui";
import { MessageMedia } from "./MessageMedia";

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
}

export const ChatMessage = ({ message, isCurrentUser }: ChatMessageProps) => {
  // Safe date parsing to avoid "Invalid time value" errors
  const messageDate = new Date(message.created_at);
  const isValidDate = !isNaN(messageDate.getTime());

  const formattedTime = isValidDate
    ? formatDistanceToNow(messageDate, {
        addSuffix: true,
        includeSeconds: true,
      })
    : "Unknown time";

  const parsedContent = parseMessageContent(message.content);

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
        <div className="space-y-1">
          {parsedContent.map((content, index) => (
            <MessageMedia
              key={`msg-${message.id || "unknown"}-content-${index}-${
                content.type || "text"
              }`}
              content={content}
              isCurrentUser={isCurrentUser}
            />
          ))}
        </div>
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
