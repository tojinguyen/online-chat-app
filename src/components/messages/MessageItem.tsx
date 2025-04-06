import React from "react";

interface MessageItemProps {
  id: string;
  content: string;
  time: string;
  isMine: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ content, time, isMine }) => {
  return (
    <div className={`mb-4 flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs md:max-w-md p-3 rounded-lg ${
          isMine
            ? "bg-indigo-500 text-white rounded-br-none"
            : "bg-white text-gray-900 rounded-bl-none shadow-md"
        }`}
      >
        <p className="font-medium">{content}</p>
        <span
          className={`text-xs block mt-1 ${
            isMine ? "text-white" : "text-gray-700"
          }`}
        >
          {time}
        </span>
      </div>
    </div>
  );
};

export default MessageItem;
