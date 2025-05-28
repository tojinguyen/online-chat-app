"use client";

// Avatar import removed (unused)
import ChatSection from "@/components/home/ChatSection";
import ConversationList from "@/components/home/ConversationList";
import EmptyState from "@/components/home/EmptyState";
import FriendListSection from "@/components/home/FriendListSection";
import SearchBar from "@/components/home/SearchBar";
import SearchResults from "@/components/home/SearchResults";
import TabNavigation from "@/components/home/TabNavigation";
import UserProfileHeader from "@/components/home/UserProfileHeader";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Friend, getFriends } from "@/services/friendService";
import {
  getChatRooms,
  getMessages,
  getPrivateChatRoom,
  Message,
} from "@/services/messageService";
import { searchUsers, UserItem } from "@/services/profileService";
import socketService, {
  ChatMessagePayload,
  SocketMessageType,
} from "@/services/socketService";
import {
  getUploadSignature,
  isAudioFile,
  isImageFile,
  isVideoFile,
  uploadFileToCloudinary,
} from "@/services/uploadService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Extended Friend type with status field
interface FriendWithStatus extends Friend {
  status: "online" | "offline";
}

interface Conversation {
  id: string;
  name: string;
  avatarUrl?: string;
  time?: string;
  lastMessage?: string;
  unreadCount?: number;
}

export default function HomePage() {
  const { user, logout, userDetails } = useAuth();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserItem[]>([]);
  const [activeTab, setActiveTab] = useState("chats"); // 'chats' or 'friends'
  const [searching, setSearching] = useState(false);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState(""); // Add state for message input
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [friends, setFriends] = useState<FriendWithStatus[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [friendsPage, setFriendsPage] = useState(1);
  const [friendsLimit] = useState(10);
  const [friendsTotalPages, setFriendsTotalPages] = useState(1);
  const [friendsTotalCount, setFriendsTotalCount] = useState(0);
  const [friendsError, setFriendsError] = useState<string | null>(null);

  // Messages state
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  // Chat rooms state
  const [chatRooms, setChatRooms] = useState<Conversation[]>([]);
  const [loadingChatRooms, setLoadingChatRooms] = useState(false);
  const [chatRoomsPage, setChatRoomsPage] = useState(1);
  const [chatRoomsLimit] = useState(10);
  const [chatRoomsTotalPages, setChatRoomsTotalPages] = useState(1);
  // This total count is used for display purposes in the UI when needed
  const [chatRoomsTotalCount, setChatRoomsTotalCount] = useState(0);
  const [chatRoomsError, setChatRoomsError] = useState<string | null>(null);

  // Load chat rooms from API
  const loadChatRooms = async () => {
    setLoadingChatRooms(true);
    setChatRoomsError(null);
    try {
      const response = await getChatRooms(chatRoomsPage, chatRoomsLimit);
      if (response.success) {
        // Convert API ChatRoom objects to Conversation objects for UI
        const conversationsFromChatRooms: Conversation[] = response.data.map(
          (chatRoom) => {
            let lastMessageStr = "";
            if (
              typeof chatRoom.last_message === "object" &&
              chatRoom.last_message !== null
            ) {
              // Ép kiểu tạm thời để lấy content nếu có
              const msgObj = chatRoom.last_message as { content?: string };
              lastMessageStr = msgObj.content || JSON.stringify(msgObj);
            } else if (typeof chatRoom.last_message === "string") {
              lastMessageStr = chatRoom.last_message;
            }
            return {
              id: chatRoom.id,
              name: chatRoom.name,
              avatarUrl: chatRoom.avatar_url,
              time: chatRoom.last_activity_time,
              lastMessage: lastMessageStr,
              unreadCount: chatRoom.unread_count,
            };
          }
        );

        setChatRooms(conversationsFromChatRooms);

        // Set pagination data if available in API response
        if (response.meta) {
          setChatRoomsTotalPages(response.meta.total_pages || 1);
          // Store total count in case we need it for UI display later
          const totalCount = response.meta.total_count || 0;
          setChatRoomsTotalCount(totalCount);
        }

        console.log("Loaded chat rooms:", conversationsFromChatRooms);
      } else {
        console.error("Failed to load chat rooms:", response.message);
        setChatRoomsError(`Failed to load chat rooms: ${response.message}`);
      }
    } catch (error) {
      console.error("Error loading chat rooms:", error);
      setChatRoomsError("Error loading chat rooms. Please try again later.");
    } finally {
      setLoadingChatRooms(false);
    }
  };

  // Load friends list from API
  const loadFriends = async () => {
    setLoadingFriends(true);
    setFriendsError(null);
    try {
      const response = await getFriends(friendsPage, friendsLimit);
      if (response.success) {
        // Convert API Friend objects to include status property for UI
        const friendsWithStatus = response.data.map((friend) => ({
          ...friend,
          status:
            Math.random() > 0.5 ? ("online" as const) : ("offline" as const), // Random status for demo
        }));
        setFriends(friendsWithStatus);

        // Set pagination data if available in API response
        if (response.meta) {
          setFriendsTotalPages(response.meta.total_pages || 1);
          setFriendsTotalCount(response.meta.total_count || 0);
        }

        console.log("Loaded friends:", friendsWithStatus);
      } else {
        console.error("Failed to load friends:", response.message);
        setFriendsError(`Failed to load friends: ${response.message}`);
      }
    } catch (error) {
      console.error("Error loading friends:", error);
      setFriendsError("Error loading friends. Please try again later.");
    } finally {
      setLoadingFriends(false);
    }
  };

  // Load messages for a chat
  const loadMessages = async (chatId: string) => {
    setLoadingMessages(true);
    setMessagesError(null);
    try {
      const response = await getMessages(chatId);
      if (response.success) {
        setMessages(response.data.messages);
        console.log("Loaded messages:", response.data.messages);
      } else {
        console.error("Failed to load messages:", response.message);
        setMessagesError(`Failed to load messages: ${response.message}`);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      setMessagesError("Error loading messages. Please try again later.");
    } finally {
      setLoadingMessages(false);
    }
  };

  // Initialize and clean up socket connection when user logs in/out
  useEffect(() => {
    if (user) {
      // Initialize socket connection when component mounts and user is logged in
      socketService.connect();

      // Đăng ký lắng nghe tin nhắn mới từ socket
      const messageHandler = socketService.onMessage((socketMessage) => {
        // Chỉ xử lý tin nhắn nếu là tin nhắn chat và thuộc về cuộc trò chuyện đang mở
        if (
          socketMessage.type === SocketMessageType.CHAT &&
          selectedChat &&
          socketMessage.chat_room_id === selectedChat
        ) {
          // Trích xuất dữ liệu từ data property theo đúng cấu trúc ChatMessagePayload
          const messageData =
            socketMessage.data as unknown as ChatMessagePayload;

          const newMessage: Message = {
            id: messageData.message_id || `msg_${Date.now()}`,
            conversationId: socketMessage.chat_room_id || "",
            sender_id: socketMessage.sender_id,
            sender_name: socketMessage.sender_id, // Use sender_id as fallback for name
            content: messageData.content,
            timestamp: new Date(socketMessage.timestamp).toISOString(),
            isMine: socketMessage.sender_id === localStorage.getItem("userId"),
          };

          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      });

      return () => {
        // Hủy đăng ký lắng nghe và ngắt kết nối socket khi unmount
        messageHandler();
        socketService.disconnect();
      };
    }

    return () => {
      socketService.disconnect();
    };
  }, [user, selectedChat]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/auth");
    } else {
      // Load friends when the component mounts
      loadFriends();
      loadChatRooms(); // Load chat rooms when the component mounts
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router]);

  // Reload friends when tab changes to friends
  useEffect(() => {
    if (activeTab === "friends" && user) {
      loadFriends();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user]);

  // Khi currentPage thay đổi (và KHÁC 1), tự động tìm kiếm lại (chuyển trang)
  useEffect(() => {
    if (searchQuery && currentPage !== 1) {
      (async () => {
        setSearching(true);
        try {
          const response = await searchUsers(
            searchQuery.trim(),
            currentPage,
            10
          );
          if (response.success) {
            setSearchResults(response.data.users);
            const calculatedTotalPages = Math.ceil(
              response.data.total_count / response.data.limit
            );
            setTotalPages(calculatedTotalPages);
            setTotalCount(response.data.total_count);
          } else {
            setSearchResults([]);
          }
        } catch {
          setSearchResults([]);
        } finally {
          setSearching(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Khi search mới (submit form), luôn gọi API và reset về trang 1
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearching(true);
    try {
      const response = await searchUsers(searchQuery.trim(), 1, 10);
      if (response.success) {
        setSearchResults(response.data.users);
        const calculatedTotalPages = Math.ceil(
          response.data.total_count / response.data.limit
        );
        setTotalPages(calculatedTotalPages);
        setTotalCount(response.data.total_count);
      } else {
        setSearchResults([]);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  // Handle friend selection to open a private chat
  const handleFriendSelect = async (friendId: string) => {
    try {
      // Get or create private chat room with this friend
      const response = await getPrivateChatRoom(friendId);

      if (response.success) {
        const chatRoom = response.data.chatRoom;

        // Switch to chats tab
        setActiveTab("chats");

        // Select the chat
        setSelectedChat(chatRoom.id);

        // Trực tiếp gọi joinChatRoom tại đây
        socketService.joinChatRoom(chatRoom.id);

        // Load chat rooms to refresh the list
        loadChatRooms();
      } else {
        console.error("Failed to get private chat room:", response.message);
        // You can show an error message here
      }
    } catch (error) {
      console.error("Error selecting friend for chat:", error);
      // You can show an error message here
    }
  };

  // Load messages when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat);

      // Join the chat room via socket when a chat is selected
      socketService.joinChatRoom(selectedChat);

      // Clean up function - leave the chat room when the selection changes
      return () => {
        if (selectedChat) {
          socketService.leaveChatRoom(selectedChat);
        }
      };
    } else {
      // Clear messages when no chat is selected
      setMessages([]);
    }
  }, [selectedChat]);

  const handleLogout = () => {
    // Disconnect WebSocket before logging out
    socketService.disconnect();
    logout();
    router.push("/auth");
  };

  const handleSendMessage = () => {
    if (messageText.trim() && selectedChat) {
      try {
        // Gửi tin nhắn qua socket thay vì qua API
        socketService.sendMessage(selectedChat, messageText);

        // Tạo tin nhắn tạm thời để hiển thị ngay trong UI
        const tempMessage: Message = {
          id: `temp_${Date.now()}`,
          conversationId: selectedChat,
          sender_id: userDetails?.userId || "current_user",
          sender_name: userDetails?.fullName || "You", // Use fullName from userDetails
          content: messageText,
          timestamp: new Date().toISOString(),
          isMine: true,
        };

        // Thêm tin nhắn tạm thời vào đầu danh sách và đảm bảo state được cập nhật
        setMessages((prevMessages) => {
          const newMessages = [tempMessage, ...prevMessages];
          console.log("Updated messages:", newMessages); // Debug log
          return newMessages;
        });

        // Xóa nội dung tin nhắn sau khi gửi
        setMessageText("");
      } catch (error) {
        console.error("Error sending message:", error);
        setMessagesError("Failed to send message. Please try again.");
      }
    }
  };

  const handleFileUpload = (files: FileList) => {
    if (!selectedChat) {
      console.error("No chat selected for file upload");
      return;
    }

    Array.from(files).forEach(async (file) => {
      console.log("File to upload:", {
        name: file.name,
        size: file.size,
        type: file.type,
        chatId: selectedChat,
      });

      // Create a temporary message for the file with loading indicator
      const tempId = `temp_file_${Date.now()}_${Math.random()}`;
      const tempMessage: Message = {
        id: tempId,
        conversationId: selectedChat,
        sender_id: userDetails?.userId || "current_user",
        sender_name: "You",
        content: `📎 Uploading: ${file.name} (${(
          file.size /
          1024 /
          1024
        ).toFixed(2)} MB)...`,
        timestamp: new Date().toISOString(),
        isMine: true,
      };

      // Add the temporary message to the chat
      setMessages((prevMessages) => [...prevMessages, tempMessage]);

      try {
        // 1. Detect resource type based on file type
        let resourceType = "auto"; // Default to auto
        if (isImageFile(file)) {
          resourceType = "image";
        } else if (isVideoFile(file)) {
          resourceType = "video";
        } else if (isAudioFile(file)) {
          resourceType = "raw"; // Audio files are typically uploaded as raw in Cloudinary
        } else {
          resourceType = "raw"; // Other files (documents, etc.) are uploaded as raw
        }

        // 2. Get upload signature from our API with detected resource type
        const signatureResponse = await getUploadSignature(resourceType);
        const signatureData = signatureResponse.data;

        // 3. Upload the file to Cloudinary
        const uploadResult = await uploadFileToCloudinary(file, signatureData);

        // 4. Prepare the message content based on file type
        let messageContent = "";

        if (isImageFile(file)) {
          // For images, create a message with image display
          messageContent = `[IMG:${uploadResult.secure_url}]`;
        } else if (isVideoFile(file)) {
          // For videos, create a message with video player
          messageContent = `[VIDEO:${uploadResult.secure_url}]`;
        } else if (isAudioFile(file)) {
          // For audio, create a message with audio player
          messageContent = `[AUDIO:${uploadResult.secure_url}]`;
        } else {
          // For other files, create a message with download link
          messageContent = `[FILE:${uploadResult.secure_url}]${file.name}`;
        }

        // 5. Send the message with file reference via socket
        socketService.sendMessage(selectedChat, messageContent);

        // 6. Update the temporary message with the uploaded file information
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === tempId
              ? {
                  ...msg,
                  content: `📎 Uploaded: ${file.name} (${(
                    file.size /
                    1024 /
                    1024
                  ).toFixed(2)} MB)`,
                }
              : msg
          )
        );
      } catch (error) {
        console.error("File upload failed:", error);
        setMessagesError("Failed to upload file. Please try again.");

        // Update the temporary message to show the error
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === tempId
              ? {
                  ...msg,
                  content: `❌ Upload failed: ${file.name}. Please try again.`,
                }
              : msg
          )
        );
      }
    });
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    handleSearch({
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>);
  };

  const handleFriendsPageChange = (page: number) => {
    setFriendsPage(page);
    loadFriends();
  };

  const handleChatRoomsPageChange = (page: number) => {
    setChatRoomsPage(page);
    loadChatRooms();
  };

  // Removed unused renderAvatar function

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <UserProfileHeader onLogout={handleLogout} />
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
        />
        {searchQuery && (
          <SearchResults
            searchQuery={searchQuery}
            searching={searching}
            searchResults={searchResults}
            totalCount={totalCount}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onClearSearch={handleClearSearch}
          />
        )}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {activeTab === "chats" ? (
            <ConversationList
              conversations={chatRooms}
              selectedChat={selectedChat}
              onSelectChat={(id) => {
                // If the same chat is clicked again, reload messages and join room
                if (id === selectedChat) {
                  loadMessages(id);
                  // Gọi join room mỗi lần click vào một phòng chat
                  socketService.joinChatRoom(id);
                } else {
                  setSelectedChat(id);
                }
              }}
              loading={loadingChatRooms}
              error={chatRoomsError}
              onRetry={loadChatRooms}
              onPageChange={handleChatRoomsPageChange}
              totalPages={chatRoomsTotalPages}
              currentPage={chatRoomsPage}
              totalCount={chatRoomsTotalCount}
            />
          ) : (
            <FriendListSection
              friends={friends}
              loadingFriends={loadingFriends}
              friendsError={friendsError}
              friendsTotalCount={friendsTotalCount}
              friendsTotalPages={friendsTotalPages}
              friendsPage={friendsPage}
              friendsLimit={friendsLimit}
              selectedChat={selectedChat}
              onSelectChat={(id) => {
                // If we're clicking on a friend that has already been selected for chat,
                // reload the chat messages and join room again
                if (id === selectedChat) {
                  loadMessages(id);
                  // Gọi join room mỗi lần click vào bạn bè để chat
                  socketService.joinChatRoom(id);
                } else {
                  handleFriendSelect(id);
                }
              }}
              onClearError={() => setFriendsError(null)}
              onRefresh={loadFriends}
              onPageChange={handleFriendsPageChange}
            />
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <ChatSection
            selectedChat={selectedChat}
            chatName={selectedChat ? `Chat ${selectedChat}` : ""}
            messages={messages}
            messageText={messageText}
            setMessageText={setMessageText}
            onSendMessage={handleSendMessage}
            onFileUpload={handleFileUpload}
            isLoading={loadingMessages}
            error={messagesError}
          />
        ) : (
          <EmptyState
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            }
            title="No Chat Selected"
            description="Select a conversation from the list or search for a user to start chatting."
            actionButton={
              <button
                onClick={() => setActiveTab("chats")}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Browse Conversations
              </button>
            }
          />
        )}
      </div>
    </div>
  );
}
