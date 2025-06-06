"use client";

import {
  ChatHeader,
  ChatInput,
  ChatMessageList,
  ChatRoomsList,
} from "@/components/chat";
import { Button } from "@/components/ui";
import { useChatMessages, useChatRooms, useWebSocket } from "@/hooks";
import { chatService } from "@/services";
import { ChatRoom, Message, MessageType } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
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
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

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

  // Simulate typing indicators (in a real app, this would come from WebSocket)
  useEffect(() => {
    if (!currentChatRoom) return;

    // Randomly show typing indicators for demonstration purposes
    const typingInterval = setInterval(() => {
      const shouldShowTyping = Math.random() > 0.7; // 30% chance

      if (shouldShowTyping && currentChatRoom.members.length > 1) {
        // Get a random member that isn't the current user
        const otherMembers = currentChatRoom.members.filter(
          (member) => member.user_id !== currentUserId
        );

        if (otherMembers.length > 0) {
          const randomMember =
            otherMembers[Math.floor(Math.random() * otherMembers.length)];
          setTypingUsers([randomMember.name]);

          // Clear typing indicator after a few seconds
          setTimeout(() => {
            setTypingUsers([]);
          }, 3000);
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(typingInterval);
  }, [currentChatRoom, currentUserId]);

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
    <div className="flex h-screen w-full overflow-hidden">
      {/* Chat rooms sidebar */}
      <div className="w-80 flex flex-col h-full border-r border-slate-200">
        <div className="p-3 border-b flex items-center justify-between shrink-0">
          <h2 className="font-semibold text-slate-800">Conversations</h2>
          <Button
            size="sm"
            onClick={() => router.push("/chat")}
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
            activeChatRoomId={roomId}
            isLoading={isLoadingRooms}
          />
        </div>
      </div>
      {/* Chat area - fixed height, no scroll on container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {isLoadingRoom ? (
          <div className="flex items-center justify-center flex-grow">
            <div className="animate-spin h-8 w-8 border-4 border-primary-500 rounded-full border-t-transparent"></div>
          </div>
        ) : currentChatRoom ? (
          <>
            <ChatHeader
              chatRoom={currentChatRoom}
              onlineMembers={onlineMembers}
              onMembersUpdated={() => {
                // Refetch the current chat room to get updated members list
                const fetchChatRoom = async () => {
                  try {
                    const response = await chatService.getChatRoomById(roomId);
                    if (response.success) {
                      setCurrentChatRoom(response.data);
                    }
                  } catch (error) {
                    console.error("Error fetching updated chat room:", error);
                  }
                };
                fetchChatRoom();
              }}
            />
            {/* Only the message list should scroll */}
            <div className="flex-1 overflow-hidden">
              <ChatMessageList
                messages={messages}
                currentUserId={currentUserId}
                isLoading={isLoadingMessages}
                loadMoreMessages={loadMoreMessages}
                typingUsers={typingUsers}
              />
            </div>
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
      </div>
    </div>
  );
}
