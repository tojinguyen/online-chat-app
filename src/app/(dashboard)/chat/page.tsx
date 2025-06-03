"use client";

import { ChatRoomsList, EmptyChatState, NewChatForm } from "@/components/chat";
import { Button } from "@/components/ui";
import { useChatRooms } from "@/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ChatPage() {
  const router = useRouter();
  const { chatRooms, isLoading, refreshChatRooms } = useChatRooms();
  const [showNewChatForm, setShowNewChatForm] = useState(false);

  const handleCreateChat = () => {
    setShowNewChatForm(true);
  };

  const handleCancelNewChat = () => {
    setShowNewChatForm(false);
  };

  const handleChatCreated = (chatRoomId: string) => {
    setShowNewChatForm(false);
    refreshChatRooms();
    router.push(`/chat/${chatRoomId}`);
  };

  return (
    <div className="flex h-screen">
      <div className="w-80 h-full flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Conversations</h2>
          <Button
            size="sm"
            onClick={handleCreateChat}
            aria-label="New chat"
            title="New chat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ChatRoomsList chatRooms={chatRooms} isLoading={isLoading} />
        </div>
      </div>
      <div className="flex-1">
        {showNewChatForm ? (
          <div className="p-6">
            <NewChatForm
              onCancel={handleCancelNewChat}
              onSuccess={handleChatCreated}
            />
          </div>
        ) : (
          <EmptyChatState onCreateChat={handleCreateChat} />
        )}
      </div>
    </div>
  );
}
