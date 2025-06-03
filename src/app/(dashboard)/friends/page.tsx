"use client";

import { AddFriend } from "@/components/friends/AddFriend";
import { FriendRequestsList } from "@/components/friends/FriendRequestsList";
import { FriendsList } from "@/components/friends/FriendsList";
import { Card } from "@/components/ui";
import { useFriendRequests, useFriends } from "@/hooks";
import { useState } from "react";

export default function FriendsPage() {
  const {
    friends,
    isLoading: friendsLoading,
    error: friendsError,
    totalCount,
    hasMore,
    loadMoreFriends,
    refreshFriends,
  } = useFriends();

  const {
    friendRequests,
    isLoading: requestsLoading,
    error: requestsError,
    refreshFriendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
  } = useFriendRequests();

  const [activeTab, setActiveTab] = useState<"all" | "requests">("all");

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Friends</h1>

      <div className="flex mb-8 space-x-4">
        <Card className="flex-1 shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="p-5">
            <AddFriend onSuccess={refreshFriends} />
          </div>
        </Card>
      </div>

      <div className="tabs mb-6 border-b border-gray-200">
        <button
          className={`tab tab-lg tab-bordered relative px-6 py-3 font-medium text-lg transition-colors duration-200 ${
            activeTab === "all"
              ? "tab-active text-blue-600 border-blue-600"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Friends
          <span className="ml-2 px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            {totalCount}
          </span>
        </button>
        <button
          className={`tab tab-lg tab-bordered relative px-6 py-3 font-medium text-lg transition-colors duration-200 ${
            activeTab === "requests"
              ? "tab-active text-blue-600 border-blue-600"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          }`}
          onClick={() => setActiveTab("requests")}
        >
          Friend Requests{" "}
          {friendRequests.length > 0 && (
            <span className="ml-2 px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {friendRequests.length}
            </span>
          )}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
        {activeTab === "all" ? (
          <FriendsList
            friends={friends}
            isLoading={friendsLoading}
            error={friendsError}
            hasMore={hasMore}
            loadMore={loadMoreFriends}
            onFriendRemoved={refreshFriends}
          />
        ) : (
          <FriendRequestsList
            friendRequests={friendRequests}
            isLoading={requestsLoading}
            error={requestsError}
            onAccept={async (id) => {
              const success = await acceptFriendRequest(id);
              if (success) {
                refreshFriendRequests();
                refreshFriends();
              }
            }}
            onReject={async (id) => {
              const success = await rejectFriendRequest(id);
              if (success) {
                refreshFriendRequests();
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
