import axios from "axios";
import { ApiResponse } from "./authService";

// Base API URL
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// User profile interfaces
export interface UserProfile {
  id: string;
  name: string;
  avatarUrl?: string | null;
}

export interface SearchUsersResponse {
  users: UserProfile[];
  total_count: number;
  page: number;
  limit: number;
}

export interface SearchUsersParams {
  name?: string;
  page?: number;
  limit?: number;
}

/**
 * Search for users based on query parameters
 * @param params Search parameters (name, page, limit)
 * @param token Access token for authentication
 * @returns Promise with search results
 */
export const searchUsers = async (
  params: SearchUsersParams,
  token: string
): Promise<SearchUsersResponse> => {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (params.name) queryParams.append("name", params.name);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const response = await axios.get<ApiResponse<SearchUsersResponse>>(
      `${API_URL}/profile/users?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to search users");
    }

    return response.data.data;
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
};

/**
 * Get user profile by ID
 * @param userId User ID
 * @returns Promise with user profile
 */
export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  try {
    const response = await axios.get<ApiResponse<UserProfile>>(
      `${API_URL}/profile/users/${userId}`
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to get user profile");
    }

    return response.data.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};
