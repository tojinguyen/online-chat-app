export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

export interface UserSearchParams {
  query: string;
  page: number;
  limit: number;
}

export interface UserSearchResult {
  users: UserProfile[];
  page: number;
  limit: number;
  total_count: number;
}

export interface FriendRequest {
  id: string;
  requester_id: string;
  requester_name: string;
  avatar_url: string;
  status: string;
  created_at: string;
}

export interface Friend {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

export interface AddFriendRequest {
  friendId: string;
}
