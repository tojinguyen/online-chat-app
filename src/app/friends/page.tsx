import FriendRequests from "@/components/friends/FriendRequests";
import FriendsList from "@/components/friends/FriendsList";
import UserSearch from "@/components/friends/UserSearch";
import { useAuth } from "@/contexts/auth/AuthContext";
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Friends</h1>

      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "friends"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("friends")}
          >
            My Friends
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "requests"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("requests")}
          >
            Friend Requests
          </button>
          <button
            className={`px-4 py-2 font-medium ${
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

      {activeTab === "friends" && <FriendsList />}

      {activeTab === "requests" && (
        <FriendRequests onRequestAction={() => setActiveTab("friends")} />
      )}

      {activeTab === "add" && <UserSearch onSendRequest={() => {}} />}
    </div>
  );
}
