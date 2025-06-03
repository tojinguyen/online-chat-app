import { apiClient } from "@/lib/api";
import {
  AddFriendRequest,
  ApiResponse,
  Friend,
  FriendRequest,
  PaginatedResponse,
  UserProfile,
  UserSearchParams,
  UserSearchResult,
} from "@/types";

const USER_API_ENDPOINTS = {
  USERS: "/users",
  USER_PROFILE: (id: string) => `/users/${id}`,
  FRIENDS: "/api/v1/friends",
  FRIEND_REQUESTS: "/api/v1/friends/requests",
  ACCEPT_FRIEND_REQUEST: (requestId: string) =>
    `/api/v1/friends/requests/${requestId}/accept`,
  REJECT_FRIEND_REQUEST: (requestId: string) =>
    `/api/v1/friends/requests/${requestId}/reject`,
  REMOVE_FRIEND: (friendId: string) => `/api/v1/friends/${friendId}`,
};

export const userService = {
  // Search for users by name
  searchUsers: async (
    params: UserSearchParams
  ): Promise<ApiResponse<UserSearchResult>> => {
    const queryParams = `?query=${encodeURIComponent(params.query)}&page=${
      params.page
    }&limit=${params.limit}`;
    return await apiClient.get<UserSearchResult>(
      `${USER_API_ENDPOINTS.USERS}${queryParams}`
    );
  },

  // Get a user's profile
  getUserProfile: async (userId: string): Promise<ApiResponse<UserProfile>> => {
    return await apiClient.get<UserProfile>(
      USER_API_ENDPOINTS.USER_PROFILE(userId)
    );
  },

  // Get the current user's friends
  getFriends: async (
    page: number,
    limit: number
  ): Promise<ApiResponse<PaginatedResponse<Friend>>> => {
    const queryParams = `?page=${page}&limit=${limit}`;
    return await apiClient.get<PaginatedResponse<Friend>>(
      `${USER_API_ENDPOINTS.FRIENDS}${queryParams}`
    );
  },

  // Get pending friend requests
  getFriendRequests: async (): Promise<ApiResponse<FriendRequest[]>> => {
    return await apiClient.get<FriendRequest[]>(
      USER_API_ENDPOINTS.FRIEND_REQUESTS
    );
  },

  // Send a friend request
  sendFriendRequest: async (
    data: AddFriendRequest
  ): Promise<ApiResponse<any>> => {
    return await apiClient.post<any>(USER_API_ENDPOINTS.FRIEND_REQUESTS, data);
  },

  // Accept a friend request
  acceptFriendRequest: async (requestId: string): Promise<ApiResponse<any>> => {
    return await apiClient.post<any>(
      USER_API_ENDPOINTS.ACCEPT_FRIEND_REQUEST(requestId),
      {}
    );
  },

  // Reject a friend request
  rejectFriendRequest: async (requestId: string): Promise<ApiResponse<any>> => {
    return await apiClient.post<any>(
      USER_API_ENDPOINTS.REJECT_FRIEND_REQUEST(requestId),
      {}
    );
  },

  // Remove a friend
  removeFriend: async (friendId: string): Promise<ApiResponse<any>> => {
    return await apiClient.delete<any>(
      USER_API_ENDPOINTS.REMOVE_FRIEND(friendId)
    );
  },
};
