"use client";

import MessageList from "@/components/messages/MessageList";
import { useAuth } from "@/contexts/auth/AuthContext";
import { searchUsers, UserItem } from "@/services/profileService";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

  // Sample data (to be replaced with actual API calls)
  const conversations = [
    {
      id: "1",
      name: "Chat Group 1",
      lastMessage: "Hello there!",
      time: "10:30 AM",
      avatarUrl: null,
    },
    {
      id: "2",
      name: "Chat Group 2",
      lastMessage: "Meeting at 2pm",
      time: "09:15 AM",
      avatarUrl: null,
    },
  ];

  const friends = [
    { id: "3", name: "John Doe", status: "online", avatarUrl: null },
    { id: "4", name: "Jane Smith", status: "offline", avatarUrl: null },
  ];

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

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/auth");
    }
  }, [user, router]);

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

  // Render avatar with improved styling
  const renderAvatar = (name: string, avatarUrl?: string | null) => {
    if (avatarUrl) {
      return (
        <Image
          src={avatarUrl}
          alt={`${name}'s avatar`}
          width={40}
          height={40}
          className="w-full h-full object-cover rounded-full"
        />
      );
    } else {
      // Updated avatar placeholder with gradient background
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
          {name.charAt(0).toUpperCase()}
        </div>
      );
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                {userDetails?.avatarUrl ? (
                  <Image
                    src={userDetails.avatarUrl}
                    alt="User avatar"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white text-indigo-600 font-bold">
                    {(userDetails?.fullName || user).charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="ml-2 font-semibold text-lg">
                {userDetails?.fullName || user}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-200 transition-colors"
              title="Logout"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full p-2 pl-8 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-gray-800 font-medium placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-2 top-2.5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <button
              type="submit"
              className="absolute right-2 top-2 text-indigo-600 hover:text-indigo-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </form>
        </div>

        {searchQuery && (
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-indigo-500 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                Search Results{" "}
                {totalCount > 0 && (
                  <span className="text-indigo-500 ml-1">({totalCount})</span>
                )}
              </h3>
              {searchQuery.length > 0 && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {searching ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent mb-3" />
                <p className="text-gray-600 font-medium">Searching...</p>
              </div>
            ) : (
              <>
                {searchResults.length > 0 ? (
                  <>
                    <ul className="space-y-2 mb-4">
                      {searchResults.map((result) => (
                        <li
                          key={result.id}
                          className="flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 hover:shadow-sm"
                        >
                          <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm">
                            {renderAvatar(result.name, result.avatar_url)}
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex items-center">
                              <span className="font-semibold text-gray-800">
                                {result.name}
                              </span>
                              <span className="ml-2 px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-md">
                                User
                              </span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-gray-500 flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3 mr-1"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                ID: {result.id.substring(0, 8)}
                              </span>
                              <div className="flex space-x-1">
                                <button className="bg-white border border-gray-200 hover:border-gray-300 text-gray-600 text-xs py-1 px-2 rounded-md transition-colors flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3 mr-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                                  </svg>
                                  Message
                                </button>
                                <button className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs py-1 px-2 rounded-md transition-colors flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3 mr-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                                  </svg>
                                  Add Friend
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Pagination controls with improved styling */}
                    {totalPages > 1 && (
                      <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-2">
                        <p className="text-xs text-gray-500">
                          Showing{" "}
                          <span className="font-medium">
                            {(currentPage - 1) * 10 + 1}
                          </span>{" "}
                          to{" "}
                          <span className="font-medium">
                            {Math.min(currentPage * 10, totalCount)}
                          </span>{" "}
                          of <span className="font-medium">{totalCount}</span>{" "}
                          results
                        </p>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => {
                              if (currentPage > 1) {
                                setCurrentPage(currentPage - 1);
                                handleSearch({
                                  preventDefault: () => {},
                                } as React.FormEvent<HTMLFormElement>);
                              }
                            }}
                            disabled={currentPage === 1}
                            className={`p-1.5 rounded-md text-sm font-medium transition-colors ${
                              currentPage === 1
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <span className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-700 font-medium rounded-md">
                            {currentPage}
                          </span>
                          <button
                            onClick={() => {
                              if (currentPage < totalPages) {
                                setCurrentPage(currentPage + 1);
                                handleSearch({
                                  preventDefault: () => {},
                                } as React.FormEvent<HTMLFormElement>);
                              }
                            }}
                            disabled={currentPage === totalPages}
                            className={`p-1.5 rounded-md text-sm font-medium transition-colors ${
                              currentPage === totalPages
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600 font-medium">
                      No users found matching &quot;{searchQuery}&quot;
                    </p>
                    <p className="text-gray-500 text-sm mt-1 mb-3">
                      Try a different search term
                    </p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            className={`flex-1 py-3.5 font-semibold text-sm transition-colors flex items-center justify-center ${
              activeTab === "chats"
                ? "text-indigo-600 border-b-2 border-indigo-600 bg-white"
                : "text-gray-600 hover:text-indigo-500"
            }`}
            onClick={() => setActiveTab("chats")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
            Chats
          </button>
          <button
            className={`flex-1 py-3.5 font-semibold text-sm transition-colors flex items-center justify-center ${
              activeTab === "friends"
                ? "text-indigo-600 border-b-2 border-indigo-600 bg-white"
                : "text-gray-600 hover:text-indigo-500"
            }`}
            onClick={() => setActiveTab("friends")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            Friends
          </button>
          <button
            className="flex-1 py-3.5 font-semibold text-sm text-gray-600 hover:text-indigo-500 transition-colors flex items-center justify-center"
            onClick={() => router.push("/friends")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
            </svg>
            Settings
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === "chats" ? (
            <div className="p-3">
              {conversations.length > 0 ? (
                <div className="space-y-2">
                  {conversations.map((chat) => (
                    <div
                      key={chat.id}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedChat === chat.id
                          ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 shadow-sm"
                          : "hover:bg-indigo-50/70"
                      }`}
                      onClick={() => setSelectedChat(chat.id)}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm">
                        {renderAvatar(chat.name, chat.avatarUrl)}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-semibold ${
                              selectedChat === chat.id
                                ? "text-indigo-700"
                                : "text-gray-800"
                            }`}
                          >
                            {chat.name}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-600 font-medium py-1 px-2 rounded-full">
                            {chat.time}
                          </span>
                        </div>
                        <p
                          className={`text-sm ${
                            selectedChat === chat.id
                              ? "text-indigo-600"
                              : "text-gray-600"
                          } truncate mt-1`}
                        >
                          {chat.lastMessage}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-gray-600 font-medium">
                    No conversations yet
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Start chatting with your friends
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3">
              {friends.length > 0 ? (
                <div className="space-y-2">
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedChat === friend.id
                          ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 shadow-sm"
                          : "hover:bg-indigo-50/70"
                      }`}
                      onClick={() => setSelectedChat(friend.id)}
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm">
                          {renderAvatar(friend.name, friend.avatarUrl)}
                        </div>
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                            friend.status === "online"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        ></span>
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-semibold ${
                              selectedChat === friend.id
                                ? "text-indigo-700"
                                : "text-gray-800"
                            }`}
                          >
                            {friend.name}
                          </span>
                          <button className="text-xs bg-indigo-100 text-indigo-600 hover:bg-indigo-200 py-1 px-2 rounded-full transition-colors">
                            Message
                          </button>
                        </div>
                        <p
                          className={`text-sm ${
                            selectedChat === friend.id
                              ? "text-indigo-600"
                              : "text-gray-600"
                          } capitalize mt-1`}
                        >
                          {friend.status === "online" ? (
                            <span className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                              Active now
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1"></span>
                              Offline
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-gray-600 font-medium">No friends yet</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Start adding friends to chat with
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="border-b border-gray-200 bg-white shadow-sm">
              <div className="flex items-center p-3">
                <div className="w-12 h-12 rounded-full overflow-hidden shadow">
                  {renderAvatar(
                    conversations.find((c) => c.id === selectedChat)?.name ||
                      friends.find((f) => f.id === selectedChat)?.name ||
                      "",
                    conversations.find((c) => c.id === selectedChat)
                      ?.avatarUrl ||
                      friends.find((f) => f.id === selectedChat)?.avatarUrl
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <h2 className="font-semibold text-lg text-gray-800">
                    {
                      (
                        conversations.find((c) => c.id === selectedChat) ||
                        friends.find((f) => f.id === selectedChat)
                      )?.name
                    }
                  </h2>
                  <p className="text-sm text-gray-600">
                    {friends.find((f) => f.id === selectedChat)?.status ===
                    "online" ? (
                      <span className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                        Online now
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1"></span>
                        Last seen 2 hours ago
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <button className="text-gray-500 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </button>
                  <button className="text-gray-500 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                  </button>
                  <button className="text-gray-500 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between px-4 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 text-xs font-medium text-indigo-700">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  End-to-end encrypted
                </div>
                <button className="text-indigo-600 hover:text-indigo-800">
                  View Info
                </button>
              </div>
            </div>

            <MessageList messages={messages} />

            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-end">
                <div className="flex items-center mr-2">
                  <button className="text-gray-500 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button className="text-gray-500 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button className="text-gray-500 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                  </button>
                </div>
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full border border-gray-300 rounded-full py-3 px-4 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent text-gray-800 font-medium"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-2 rounded-full hover:opacity-90 transition-opacity flex items-center justify-center"
                    onClick={handleSendMessage}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2 text-center">
                <span className="hover:text-indigo-600 cursor-pointer">
                  Press Enter to send
                </span>{" "}
                •{" "}
                <span className="hover:text-indigo-600 cursor-pointer">
                  Shift+Enter for new line
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center p-8 max-w-sm bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-28 h-28 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-100/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-14 w-14 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Welcome to Chat App
              </h3>
              <p className="text-gray-600 mb-6 max-w-xs mx-auto">
                Select a conversation from the sidebar or start a new chat with
                your friends
              </p>
              <div className="flex space-x-3 justify-center">
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                  onClick={() => setActiveTab("chats")}
                >
                  My Chats
                </button>
                <button
                  className="bg-white text-indigo-600 border border-indigo-200 px-4 py-2 rounded-md font-medium hover:bg-indigo-50 transition-colors"
                  onClick={() => setActiveTab("friends")}
                >
                  View Friends
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
