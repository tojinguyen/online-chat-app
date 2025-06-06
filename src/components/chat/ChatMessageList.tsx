"use client";

import { Message } from "@/types";
import { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";

interface ChatMessageListProps {
  messages: Message[];
  currentUserId: string;
  isLoading: boolean;
  loadMoreMessages: () => void;
  typingUsers?: string[]; // New prop for users who are typing
}

export const ChatMessageList = ({
  messages,
  currentUserId,
  isLoading,
  loadMoreMessages,
  typingUsers = [],
}: ChatMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(messages.length);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    // Only auto-scroll if we're already at the bottom or a new message was added
    const shouldAutoScroll =
      messages.length > prevMessagesLength.current &&
      messageContainerRef.current &&
      messageContainerRef.current.scrollHeight -
        messageContainerRef.current.scrollTop -
        messageContainerRef.current.clientHeight <
        100;

    prevMessagesLength.current = messages.length;

    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle scroll to load more messages
  const handleScroll = () => {
    if (messageContainerRef.current) {
      const { scrollTop } = messageContainerRef.current;
      if (scrollTop === 0 && !isLoading) {
        loadMoreMessages();
      }
    }
  };

  return (
    <div
      ref={messageContainerRef}
      className="flex-1 overflow-y-auto p-4 bg-white"
      onScroll={handleScroll}
    >
      {isLoading && (
        <div className="flex justify-center my-2">
          <div className="animate-spin h-5 w-5 border-2 border-primary-500 rounded-full border-t-transparent"></div>
        </div>
      )}

      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          isCurrentUser={message.sender_id === currentUserId}
        />
      ))}

      {typingUsers.length > 0 && <TypingIndicator userName={typingUsers[0]} />}

      <div ref={messagesEndRef} />
    </div>
  );
};
