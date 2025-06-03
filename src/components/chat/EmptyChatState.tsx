"use client";

import Image from "next/image";
import { Button } from "../ui";

interface EmptyChatStateProps {
  onCreateChat?: () => void;
}

export const EmptyChatState = ({ onCreateChat }: EmptyChatStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-white">
      <div className="max-w-md text-center">
        <div className="mb-6">
          <Image
            src="/chat-illustration.png"
            alt="Chat illustration"
            width={240}
            height={240}
            className="mx-auto"
          />
        </div>
        <h2 className="text-xl font-semibold mb-2 text-slate-800">
          Start a conversation
        </h2>
        <p className="text-slate-500 mb-6">
          Select a chat from the sidebar or start a new conversation with your
          friends.
        </p>
        {onCreateChat && (
          <Button onClick={onCreateChat} className="mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            New Conversation
          </Button>
        )}
      </div>
    </div>
  );
};
