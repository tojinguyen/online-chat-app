import { Message } from "@/services/messageService";
import React from "react";
import MessageItem from "./MessageItem";

interface MessageDisplayProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function MessageDisplay({
  messages,
  isLoading,
  error,
  messagesEndRef,
}: MessageDisplayProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-full text-red-500">
          <p>{error}</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex justify-center items-center h-full text-gray-500">
          <p>No messages yet. Start a conversation!</p>
        </div>
      ) : (
        [...messages]
          .reverse()
          .map((message) => <MessageItem key={message.id} message={message} />)
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
