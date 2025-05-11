import { API_URL } from "@/constants/authConstants";
import axios from "axios";

export interface Friend {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

export interface FriendRequest {
  id: string;
  requester_id: string;
  requester_name: string;
  avatar_url: string;
  status: string;
  created_at: string;
}

export interface FriendsResponse {
  success: boolean;
  message: string;
  data: Friend[];
}

export interface FriendRequestsResponse {
  success: boolean;
  message: string;
  data: FriendRequest[];
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

// Get friends list with pagination
export const getFriends = async (
  page: number,
  limit: number
): Promise<FriendsResponse> => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(
    `${API_URL}/friends?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Get friend requests
export const getFriendRequests = async (): Promise<FriendRequestsResponse> => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(`${API_URL}/friends/requests`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Send friend request
export const sendFriendRequest = async (
  friendId: string
): Promise<ApiResponse> => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.post(
    `${API_URL}/friends/requests`,
    { friendId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Accept friend request
export const acceptFriendRequest = async (
  requestId: string
): Promise<ApiResponse> => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.post(
    `${API_URL}/friends/requests/${requestId}/accept`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Reject friend request
export const rejectFriendRequest = async (
  requestId: string
): Promise<ApiResponse> => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.post(
    `${API_URL}/friends/requests/${requestId}/reject`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Remove friend
export const removeFriend = async (friendId: string): Promise<ApiResponse> => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.delete(`${API_URL}/friends/${friendId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
