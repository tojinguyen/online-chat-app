import { API_URL } from "@/constants/authConstants";
import axios from "axios";

// User profile interfaces
export interface UserItem {
  id: string;
  name: string;
  avatar_url: string;
}

export interface ProfileResponse {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

export interface SearchUsersOutput {
  users: UserItem[];
  total_count: number;
  page: number;
  limit: number;
}

export interface ApiResponseWithData<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Search for users by name
 * @param query Name to search for
 * @param page Page number
 * @param limit Number of items per page
 * @returns Promise with search results
 */
export const searchUsers = async (
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<ApiResponseWithData<SearchUsersOutput>> => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Authentication required");
    }

    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append("name", query);
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    const response = await axios.get(
      `${API_URL}/profile/users?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
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
export const getUserProfile = async (
  userId: string
): Promise<ApiResponseWithData<ProfileResponse>> => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await axios.get(`${API_URL}/profile/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};
