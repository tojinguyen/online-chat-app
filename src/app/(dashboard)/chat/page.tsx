"use client";

import { ChatRoomsList, EmptyChatState, NewChatForm } from "@/components/chat";
import { Button } from "@/components/ui";
import { useChatRooms } from "@/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ChatPage() {
  const router = useRouter();
  const { chatRooms, isLoading, refreshChatRooms, error } = useChatRooms();
  const [showNewChatForm, setShowNewChatForm] = useState(false);

  console.log("Chat Rooms:", chatRooms);
  console.log("Is Loading:", isLoading);
  console.log("Error:", error);

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
    <div className="flex h-screen flex-col">
      {/* Debug panel */}
      <div className="p-2 bg-gray-100 text-xs font-mono overflow-auto max-h-64 border-b">
        <div>
          <strong>Chat Rooms:</strong> {chatRooms ? chatRooms.length : 0} rooms
        </div>
        <div>
          <strong>Loading:</strong> {isLoading ? "Yes" : "No"}
        </div>
        <div>
          <strong>Error:</strong> {error || "None"}
        </div>
        <div className="mt-1">
          <button
            onClick={() => refreshChatRooms()}
            className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
          >
            Refresh Chat Rooms
          </button>
        </div>

        {chatRooms && chatRooms.length > 0 && (
          <div className="mt-2 border-t pt-2">
            <div>
              <strong>Chat Room Details:</strong>
            </div>
            <div className="max-h-32 overflow-y-auto">
              {chatRooms.map((room) => (
                <div key={room.id} className="mt-1 border p-1 rounded">
                  ID: {room.id}, Name: {room.name}, Type: {room.type}, Members:{" "}
                  {room.member_count}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
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
            <ChatRoomsList
              chatRooms={chatRooms}
              isLoading={isLoading}
              activeChatRoomId={undefined}
            />
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
    </div>
  );
}
