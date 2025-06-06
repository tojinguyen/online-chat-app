"use client";

import { FormEvent, KeyboardEvent, useState } from "react";
import { Button } from "../ui";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isConnected: boolean;
}

export const ChatInput = ({ onSendMessage, isConnected }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && isConnected) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="border-t p-3 bg-white shrink-0">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          {" "}
          <textarea
            className="w-full border rounded-lg p-3 pr-10 resize-none h-16 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
            placeholder={
              isConnected ? "Type a message..." : "Connecting to chat..."
            }
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            disabled={!isConnected}
          />
          {!isConnected && (
            <div className="absolute right-3 bottom-3">
              <div className="animate-pulse flex space-x-1">
                <div className="h-2 w-2 bg-slate-300 rounded-full"></div>
                <div className="h-2 w-2 bg-slate-300 rounded-full"></div>
                <div className="h-2 w-2 bg-slate-300 rounded-full"></div>
              </div>
            </div>
          )}
        </div>
        <Button
          type="submit"
          disabled={!message.trim() || !isConnected}
          className="h-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </Button>
      </div>
    </form>
  );
};
