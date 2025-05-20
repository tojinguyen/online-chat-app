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
import { getMessages, Message, sendMessage } from "@/services/messageService";
import { searchUsers, UserItem } from "@/services/profileService";
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
}

export default function HomePage() {
  const { user, logout } = useAuth();
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

  const [conversations] = useState<Conversation[]>([]);

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

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/auth");
    } else {
      // Load friends when the component mounts
      loadFriends();
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

  // Load messages when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat);
    } else {
      // Clear messages when no chat is selected
      setMessages([]);
    }
  }, [selectedChat]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearching(true);

    try {
      // Use the updated search users function
      const response = await searchUsers(searchQuery.trim(), currentPage, 10);

      if (response.success) {
        setSearchResults(response.data.users);
        // Calculate total pages based on total_count and limit
        const calculatedTotalPages = Math.ceil(
          response.data.total_count / response.data.limit
        );
        setTotalPages(calculatedTotalPages);
        setCurrentPage(response.data.page);
        setTotalCount(response.data.total_count);
      } else {
        console.error("Search failed:", response.message);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  const handleSendMessage = async () => {
    if (messageText.trim() && selectedChat) {
      // Call the API to send the message
      const response = await sendMessage(selectedChat, messageText);

      if (response.success) {
        // Add the new message to the list
        setMessages((prevMessages) => [...prevMessages, response.data]);
        setMessageText(""); // Clear input after sending
      } else {
        console.error("Failed to send message:", response.message);
        // Optionally show an error toast here
      }
    }
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
        <div className="flex-1 overflow-y-auto">
          {activeTab === "chats" ? (
            <ConversationList
              conversations={conversations}
              selectedChat={selectedChat}
              onSelectChat={(id) => setSelectedChat(id)}
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
              onSelectChat={(id) => setSelectedChat(id)}
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
