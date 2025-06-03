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
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Friends</h1>

      <div className="flex mb-6 space-x-4">
        <Card className="flex-1">
          <div className="p-4">
            <AddFriend onSuccess={refreshFriends} />
          </div>
        </Card>
      </div>

      <div className="tabs mb-4">
        <button
          className={`tab tab-lg tab-bordered ${
            activeTab === "all" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Friends ({totalCount})
        </button>
        <button
          className={`tab tab-lg tab-bordered ${
            activeTab === "requests" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("requests")}
        >
          Friend Requests{" "}
          {friendRequests.length > 0 && `(${friendRequests.length})`}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
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
