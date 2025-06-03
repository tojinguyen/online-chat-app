"use client";

import { ChatRoom } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { Avatar } from "../ui";

interface ChatRoomsListProps {
  chatRooms: ChatRoom[];
  activeChatRoomId?: string;
  isLoading: boolean;
}

export const ChatRoomsList = ({
  chatRooms = [], // Provide default empty array
  activeChatRoomId,
  isLoading,
}: ChatRoomsListProps) => {
  const router = useRouter();

  const handleSelectChatRoom = (roomId: string) => {
    router.push(`/chat/${roomId}`);
  };

  // Helper to get display info for a chat room
  const getChatRoomDisplayInfo = (chatRoom: ChatRoom) => {
    // For private chats, get the other user's info
    if (
      chatRoom.type === "PRIVATE" &&
      chatRoom.members &&
      chatRoom.members.length > 1
    ) {
      // In a real app, you would get the current user ID from authentication context
      const currentUserId = "current-user-id"; // Replace with actual implementation
      const otherMember = chatRoom.members.find(
        (member) => member.user_id !== currentUserId
      );

      if (otherMember) {
        return {
          name: otherMember.name,
          avatar: otherMember.avatar_url,
        };
      }
    }

    // For group chats or fallback
    return {
      name: chatRoom.name,
      avatar: "", // Could use a default group avatar
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin h-5 w-5 border-2 border-primary-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!chatRooms || chatRooms.length === 0) {
    return (
      <div className="p-4 text-center text-slate-500">No conversations yet</div>
    );
  }

  return (
    <ul className="divide-y divide-slate-100">
      {" "}
      {chatRooms.map((chatRoom) => {
        const { name, avatar } = getChatRoomDisplayInfo(chatRoom);
        const isActive = chatRoom.id === activeChatRoomId;
        const lastMessage = chatRoom.last_message;

        return (
          <li key={chatRoom.id}>
            <button
              onClick={() => handleSelectChatRoom(chatRoom.id)}
              className={`w-full p-3 flex items-center hover:bg-slate-50 ${
                isActive ? "bg-primary-50" : ""
              }`}
            >
              <Avatar src={avatar} alt={name} size="md" />
              <div className="ml-3 flex-1 text-left overflow-hidden">
                <div className="font-medium text-slate-800 truncate">
                  {name}
                </div>
                {lastMessage && (
                  <>
                    <div className="text-sm text-slate-500 truncate">
                      {lastMessage.content}
                    </div>
                    <div className="text-xs text-slate-400">
                      {formatDistanceToNow(new Date(lastMessage.created_at), {
                        addSuffix: true,
                      })}
                    </div>
                  </>
                )}
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
};
