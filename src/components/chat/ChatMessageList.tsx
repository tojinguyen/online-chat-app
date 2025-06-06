"use client";

import { Message } from "@/types";
import { useEffect, useRef, useState } from "react";
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
  const isUserScrolled = useRef(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [hasNewMessagesBelow, setHasNewMessagesBelow] = useState(false);

  // Function to check if user is near the bottom of the chat
  const isNearBottom = () => {
    if (!messageContainerRef.current) return false;
    const { scrollTop, scrollHeight, clientHeight } =
      messageContainerRef.current;
    return scrollHeight - scrollTop - clientHeight < 100;
  };

  // Function to scroll to bottom
  const scrollToBottom = (behavior: "smooth" | "instant" = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const hasNewMessages = messages.length > prevMessagesLength.current;
    const isInitialLoad =
      prevMessagesLength.current === 0 && messages.length > 0;

    // Auto-scroll in these cases:
    // 1. Initial load of messages
    // 2. New messages added and user is near bottom or hasn't manually scrolled
    // 3. User sent a message (we assume the last message is from current user if it's new)
    const lastMessage = messages[messages.length - 1];
    const isOwnMessage = lastMessage?.sender_id === currentUserId;

    if (isInitialLoad) {
      // On initial load, scroll to bottom instantly
      setTimeout(() => scrollToBottom("instant"), 100);
      isUserScrolled.current = false;
      setShowScrollButton(false);
      setHasNewMessagesBelow(false);
    } else if (hasNewMessages) {
      if (isOwnMessage) {
        // Always scroll for own messages
        scrollToBottom();
        isUserScrolled.current = false;
        setShowScrollButton(false);
        setHasNewMessagesBelow(false);
      } else if (!isUserScrolled.current || isNearBottom()) {
        // Scroll for other's messages only if user hasn't manually scrolled or is near bottom
        scrollToBottom();
        setHasNewMessagesBelow(false);
      } else {
        // User is scrolled up and there are new messages below
        setHasNewMessagesBelow(true);
      }
    }

    prevMessagesLength.current = messages.length;
  }, [messages, currentUserId]);

  // Auto-scroll when typing indicator appears
  useEffect(() => {
    if (typingUsers.length > 0 && (!isUserScrolled.current || isNearBottom())) {
      scrollToBottom();
    }
  }, [typingUsers]); // Handle scroll to load more messages and track user scroll behavior
  const handleScroll = () => {
    if (messageContainerRef.current) {
      const { scrollTop } = messageContainerRef.current;

      // Load more messages when scrolled to top
      if (scrollTop === 0 && !isLoading) {
        loadMoreMessages();
      }

      // Track if user has manually scrolled away from bottom
      const nearBottom = isNearBottom();
      if (nearBottom) {
        isUserScrolled.current = false;
        setShowScrollButton(false);
        setHasNewMessagesBelow(false);
      } else {
        isUserScrolled.current = true;
        setShowScrollButton(true);
      }
    }
  };
  // Show scroll-to-bottom button if there are new messages below and user has scrolled up
  useEffect(() => {
    if (messages.length > 0 && isUserScrolled.current) {
      const hasNewMessages = messages.length > prevMessagesLength.current;
      const lastMessage = messages[messages.length - 1];
      const isOwnMessage = lastMessage?.sender_id === currentUserId;

      if (hasNewMessages && !isOwnMessage) {
        setHasNewMessagesBelow(true);
      }
    }
  }, [messages, currentUserId]);

  return (
    <div className="relative h-full">
      <div
        ref={messageContainerRef}
        className="flex flex-col p-4 bg-white h-full overflow-y-auto"
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

        {typingUsers.length > 0 && (
          <TypingIndicator userName={typingUsers[0]} />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={() => {
            scrollToBottom();
            setShowScrollButton(false);
            setHasNewMessagesBelow(false);
          }}
          className={`absolute bottom-4 right-4 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 z-10 ${
            hasNewMessagesBelow
              ? "bg-primary-500 text-white animate-pulse"
              : "bg-white text-slate-600 border border-slate-200"
          }`}
          aria-label="Scroll to bottom"
          title={
            hasNewMessagesBelow ? "New messages below" : "Scroll to bottom"
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          {hasNewMessagesBelow && (
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></div>
          )}
        </button>
      )}
    </div>
  );
};
