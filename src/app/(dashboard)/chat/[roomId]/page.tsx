"use client";

import {
  ChatHeader,
  ChatInput,
  ChatMessageList,
  ChatRoomsList,
} from "@/components/chat";
import { useChatMessages, useChatRooms, useWebSocket } from "@/hooks";
import { chatService } from "@/services";
import { ChatRoom, Message, MessageType } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChatRoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;

  const { chatRooms, isLoading: isLoadingRooms } = useChatRooms();
  const {
    messages,
    isLoading: isLoadingMessages,
    loadMoreMessages,
    addMessage,
  } = useChatMessages(roomId);

  const {
    isConnected,
    sendMessage,
    messages: wsMessages,
  } = useWebSocket(roomId);

  const [currentChatRoom, setCurrentChatRoom] = useState<ChatRoom | null>(null);
  const [isLoadingRoom, setIsLoadingRoom] = useState(true);
  const [onlineMembers, setOnlineMembers] = useState<string[]>([]);

  // In a real app, this would come from an authentication context
  const currentUserId = "current-user-id"; // Replace with actual implementation

  // Add WebSocket messages to the chat
  useEffect(() => {
    if (wsMessages.length > 0) {
      wsMessages.forEach((message) => {
        addMessage(message);
      });
    }
  }, [wsMessages, addMessage]);

  // Fetch current chat room details
  useEffect(() => {
    const fetchChatRoom = async () => {
      if (!roomId) return;

      try {
        setIsLoadingRoom(true);
        const response = await chatService.getChatRoomById(roomId);

        if (response.success) {
          setCurrentChatRoom(response.data);

          // In a real application, you would get online members from a presence service
          // For now, let's simulate some random online members
          const randomMembers = response.data.members
            .filter(() => Math.random() > 0.5)
            .map((member) => member.user_id);
          setOnlineMembers(randomMembers);
        } else {
          console.error("Failed to fetch chat room:", response.message);
        }
      } catch (error) {
        console.error("Error fetching chat room:", error);
      } finally {
        setIsLoadingRoom(false);
      }
    };

    fetchChatRoom();
  }, [roomId]);

  // Handle sending a new message
  const handleSendMessage = (content: string) => {
    if (content.trim() && isConnected) {
      sendMessage(content);

      // Optimistic update
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        chat_room_id: roomId,
        sender_id: currentUserId,
        sender_name: "You", // In a real app, get the current user's name
        avatar_url: "", // In a real app, get the current user's avatar
        content: content,
        type: "TEXT" as MessageType,
        created_at: new Date().toISOString(),
      };

      addMessage(tempMessage);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Chat rooms sidebar */}
      <div className="w-80 h-full">
        <div className="h-full overflow-y-auto">
          <ChatRoomsList
            chatRooms={chatRooms}
            activeChatRoomId={roomId}
            isLoading={isLoadingRooms}
          />
        </div>
      </div>
      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {isLoadingRoom ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin h-8 w-8 border-4 border-primary-500 rounded-full border-t-transparent"></div>
          </div>
        ) : currentChatRoom ? (
          <>
            <ChatHeader
              chatRoom={currentChatRoom}
              onlineMembers={onlineMembers}
            />

            <ChatMessageList
              messages={messages}
              currentUserId={currentUserId}
              isLoading={isLoadingMessages}
              loadMoreMessages={loadMoreMessages}
            />

            <ChatInput
              onSendMessage={handleSendMessage}
              isConnected={isConnected}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            Chat room not found
          </div>
        )}
      </div>{" "}
    </div>
  );
}
