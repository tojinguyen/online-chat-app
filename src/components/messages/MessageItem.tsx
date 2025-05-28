import React from "react";
import { Message } from "@/services/messageService";
import Avatar from "../common/Avatar";

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex ${
        message.isMine ? "justify-end" : "justify-start"
      } animate-fade-in`}
    >
      {!message.isMine && (
        <div className="w-8 h-8 rounded-full overflow-hidden mr-2 mt-1">
          <Avatar name={message.sender_name} avatarUrl={message.avatar_url} />
        </div>
      )}
      <div
        className={`max-w-xs md:max-w-md p-3.5 rounded-2xl ${
          message.isMine
            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-none shadow-md"
            : "bg-white text-gray-800 rounded-bl-none shadow-md border border-gray-100"
        }`}
      >
        {!message.isMine && (
          <p className="text-sm font-medium text-gray-600 mb-1">
            {message.sender_name}
          </p>
        )}
        <p className={`font-medium ${message.isMine ? "text-white" : "text-gray-800"}`}>
          {message.content}
        </p>
        <div className="flex items-center justify-end mt-1.5">
          {message.isMine && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 text-indigo-100 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <span
            className={`text-xs ${
              message.isMine ? "text-indigo-100" : "text-gray-500"
            }`}
          >
            {formattedTime}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
