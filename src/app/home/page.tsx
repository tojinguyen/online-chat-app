"use client";

import Avatar from "@/components/home/Avatar";
import ChatSection from "@/components/home/ChatSection";
import ConversationList from "@/components/home/ConversationList";
import EmptyState from "@/components/home/EmptyState";
import FriendListSection from "@/components/home/FriendListSection";
import SearchBar from "@/components/home/SearchBar";
import SearchResults from "@/components/home/SearchResults";
import TabNavigation from "@/components/home/TabNavigation";
import UserProfileHeader from "@/components/home/UserProfileHeader";
import { useAuth } from "@/contexts/auth/AuthContext";
import { BaseFriend, getFriends, getFriends } from "@/services/friendService";
import { searchUsers, UserItem } from "@/services/profileService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Extended Friend type with status field
interface Friend extends BaseFriend {
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
  const { user, userDetails, logout } = useAuth();
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
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [friendsPage, setFriendsPage] = useState(1);
  const [friendsLimit] = useState(10);
  const [friendsTotalPages, setFriendsTotalPages] = useState(1);
  const [friendsTotalCount, setFriendsTotalCount] = useState(0);
  const [friendsError, setFriendsError] = useState<string | null>(null);

  const [conversations] = useState<Conversation[]>([]);

  const messages = [
    {
      id: "1",
      sender: "You",
      content: "Hey there!",
      time: "10:30 AM",
      isMine: true,
    },
    {
      id: "2",
      sender: "John Doe",
      content: "Hi! How are you?",
      time: "10:31 AM",
      isMine: false,
    },
    {
      id: "3",
      sender: "John Doe",
      content: "What are you doing?",
      time: "10:32 AM",
      isMine: false,
    },
    {
      id: "4",
      sender: "You",
      content: "Just working on my chat app",
      time: "10:33 AM",
      isMine: true,
    },
  ];

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

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Here you would typically send the message to your backend
      console.log("Sending message:", messageText);
      setMessageText(""); // Clear input after sending
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

  // For backward compatibility until all components are updated
  const renderAvatar = (name: string, avatarUrl?: string | null) => {
    return <Avatar name={name} avatarUrl={avatarUrl} />;
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <UserProfileHeader
          user={user}
          userDetails={userDetails}
          handleLogout={handleLogout}
        />
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
        {searchQuery && (
          <SearchResults
            searchQuery={searchQuery}
            searching={searching}
            searchResults={searchResults}
            totalCount={totalCount}
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            handleClearSearch={handleClearSearch}
          />
        )}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 overflow-y-auto">
          {activeTab === "chats" ? (
            <ConversationList
              conversations={conversations}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              renderAvatar={renderAvatar}
            />
          ) : (
            <FriendListSection
              friends={friends}
              loadingFriends={loadingFriends}
              friendsError={friendsError}
              friendsTotalCount={friendsTotalCount}
              friendsTotalPages={friendsTotalPages}
              friendsPage={friendsPage}
              setFriendsPage={setFriendsPage}
              loadFriends={loadFriends}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              renderAvatar={renderAvatar}
            />
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <ChatSection
            selectedChat={selectedChat}
            conversations={conversations}
            friends={friends}
            messages={messages}
            messageText={messageText}
            setMessageText={setMessageText}
            handleSendMessage={handleSendMessage}
            renderAvatar={renderAvatar}
          />
        ) : (
          <EmptyState setActiveTab={setActiveTab} />
        )}
      </div>
    </div>
  );
}
