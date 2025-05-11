import React from "react";

interface MessageItemProps {
  id: string;
  content: string;
  time: string;
  isMine: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ content, time, isMine }) => {
  return (
    <div
      className={`flex ${
        isMine ? "justify-end" : "justify-start"
      } animate-fade-in`}
    >
      <div
        className={`max-w-xs md:max-w-md p-3.5 rounded-2xl ${
          isMine
            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-none shadow-md"
            : "bg-white text-gray-800 rounded-bl-none shadow-md border border-gray-100"
        }`}
      >
        <p className={`font-medium ${isMine ? "text-white" : "text-gray-800"}`}>
          {content}
        </p>
        <div className="flex items-center justify-end mt-1.5">
          {isMine && (
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
              isMine ? "text-indigo-100" : "text-gray-500"
            }`}
          >
            {time}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
