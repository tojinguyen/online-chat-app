"use client";
import FriendRequests from "@/components/friends/FriendRequests";
import FriendsList from "@/components/friends/FriendsList";
import UserSearch from "@/components/friends/UserSearch";
import { useAuth } from "@/contexts/auth/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState("friends"); // friends, requests, add
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link
            href="/home"
            className="flex items-center text-blue-500 hover:text-blue-700 mr-4 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back to Messages
          </Link>
          <h1 className="text-2xl font-bold flex-grow">Friends</h1>
        </div>

        <div className="mb-6 bg-white rounded-lg shadow-sm">
          <div className="flex border-b">
            <button
              className={`px-4 py-3 font-medium ${
                activeTab === "friends"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("friends")}
            >
              My Friends
            </button>
            <button
              className={`px-4 py-3 font-medium ${
                activeTab === "requests"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("requests")}
            >
              Friend Requests
            </button>
            <button
              className={`px-4 py-3 font-medium ${
                activeTab === "add"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("add")}
            >
              Add Friends
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {activeTab === "friends" && <FriendsList />}

          {activeTab === "requests" && (
            <FriendRequests onRequestAction={() => setActiveTab("friends")} />
          )}

          {activeTab === "add" && <UserSearch onSendRequest={() => {}} />}
        </div>
      </div>
    </div>
  );
}
