"use client";

import MessageList from "@/components/messages/MessageList";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { id: string; name: string; status: string }[]
  >([]);
  const [activeTab, setActiveTab] = useState("chats"); // 'chats' or 'friends'
  const [searching, setSearching] = useState(false);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState(""); // Add state for message input

  // Sample data (to be replaced with actual API calls)
  const conversations = [
    {
      id: "1",
      name: "Chat Group 1",
      lastMessage: "Hello there!",
      time: "10:30 AM",
    },
    {
      id: "2",
      name: "Chat Group 2",
      lastMessage: "Meeting at 2pm",
      time: "09:15 AM",
    },
  ];

  const friends = [
    { id: "3", name: "John Doe", status: "online" },
    { id: "4", name: "Jane Smith", status: "offline" },
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

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearching(true);
    // Mock search results - replace with actual API call
    setTimeout(() => {
      if (searchQuery.trim()) {
        const results = [
          { id: "5", name: "Tim Search", status: "online" },
          { id: "6", name: "Sarah Query", status: "offline" },
        ].filter((f) =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
      setSearching(false);
    }, 500);
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

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                {user.charAt(0).toUpperCase()}
              </div>
              <span className="ml-2 font-medium">{user}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700"
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
              className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-2 top-2.5 text-gray-400"
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
            <button type="submit" className="hidden">
              Search
            </button>
          </form>
        </div>

        {searchQuery && (
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-700 mb-2">Search Results</h3>
            {searching ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500" />
              </div>
            ) : (
              <>
                {searchResults.length > 0 ? (
                  <ul className="space-y-2">
                    {searchResults.map((result) => (
                      <li
                        key={result.id}
                        className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">
                          {result.name.charAt(0)}
                        </div>
                        <span className="ml-2">{result.name}</span>
                        <span
                          className={`ml-auto w-2 h-2 rounded-full ${
                            result.status === "online"
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-800 text-sm text-center">
                    No users found
                  </p>
                )}
              </>
            )}
          </div>
        )}

        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-3 font-medium text-sm ${
              activeTab === "chats"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("chats")}
          >
            Chats
          </button>
          <button
            className={`flex-1 py-3 font-medium text-sm ${
              activeTab === "friends"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("friends")}
          >
            Friends
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === "chats" ? (
            <div className="p-2">
              {conversations.map((chat) => (
                <div
                  key={chat.id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedChat === chat.id ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setSelectedChat(chat.id)}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                    {chat.name.charAt(0)}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        {chat.name}
                      </span>
                      <span className="text-xs text-gray-700">{chat.time}</span>
                    </div>
                    <p className="text-sm text-gray-800 truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedChat === friend.id ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setSelectedChat(friend.id)}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                    {friend.name.charAt(0)}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        {friend.name}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          friend.status === "online"
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></span>
                    </div>
                    <p className="text-sm text-gray-800">{friend.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                {(
                  conversations.find((c) => c.id === selectedChat) ||
                  friends.find((f) => f.id === selectedChat)
                )?.name.charAt(0)}
              </div>
              <div className="ml-3">
                <h2 className="font-medium text-lg">
                  {
                    (
                      conversations.find((c) => c.id === selectedChat) ||
                      friends.find((f) => f.id === selectedChat)
                    )?.name
                  }
                </h2>
                <p className="text-sm text-gray-800">
                  {friends.find((f) => f.id === selectedChat)?.status ===
                  "online"
                    ? "Online"
                    : "Offline"}
                </p>
              </div>
            </div>

            <MessageList messages={messages} />

            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-md p-2 h-10 mr-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900" // Added text-gray-900 for better visibility
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <button
                  className="bg-indigo-500 text-white px-4 h-10 rounded-md hover:bg-indigo-600 flex items-center justify-center"
                  onClick={handleSendMessage}
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
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-300 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                Select a chat to start messaging
              </h3>
              <p className="mt-1 text-gray-800">
                Choose a conversation from the sidebar
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
