"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Button } from "../ui";

interface ChatInputProps {
  onSendMessage: (content: string, mimeType?: string) => void;
  onStartTyping?: () => void;
  onStopTyping?: () => void;
}

export const ChatInput = ({
  onSendMessage,
  onStartTyping,
  onStopTyping,
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const TYPING_TIMEOUT = 3000; // Increased from 1000 to 3000ms to reduce server spam

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");

      // Stop typing when message is sent
      if (isTyping) {
        setIsTyping(false);
        onStopTyping?.();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setMessage(newValue);

    console.log("Input changed:", { newValue, isTyping });

    // Handle typing indicators
    if (newValue.trim() && !isTyping) {
      // Start typing
      console.log("Starting typing from ChatInput");
      setIsTyping(true);
      onStartTyping?.();
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    if (newValue.trim()) {
      typingTimeoutRef.current = setTimeout(() => {
        console.log("Stopping typing from timeout");
        setIsTyping(false);
        onStopTyping?.();
      }, TYPING_TIMEOUT);
    } else {
      // If input is empty, stop typing immediately
      console.log("Stopping typing immediately (empty input)");
      setIsTyping(false);
      onStopTyping?.();
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Stop typing when component unmounts or loses focus
  useEffect(() => {
    return () => {
      if (isTyping) {
        onStopTyping?.();
      }
    };
  }, [isTyping, onStopTyping]);
  return (
    <form onSubmit={handleSubmit} className="border-t p-3 bg-white shrink-0">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            className="w-full border rounded-lg p-3 pr-10 resize-none h-16 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
            placeholder="Type a message..."
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              // Stop typing when input loses focus
              if (isTyping) {
                setIsTyping(false);
                onStopTyping?.();
              }
            }}
          />
        </div>
        <Button type="submit" disabled={!message.trim()} className="h-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </Button>{" "}
      </div>
    </form>
  );
};
