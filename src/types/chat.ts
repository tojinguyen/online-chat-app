export enum ChatRoomType {
  PRIVATE = "PRIVATE",
  GROUP = "GROUP",
}

export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  FILE = "FILE",
}

export interface ChatMember {
  user_id: string;
  name: string;
  avatar_url: string;
  joined_at: string;
}

export interface Message {
  id: string;
  chat_room_id: string;
  sender_id: string;
  sender_name: string;
  avatar_url: string;
  content: string;
  type: MessageType;
  mime_type?: string;
  created_at: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: ChatRoomType;
  created_at: string;
  member_count: number;
  members: ChatMember[];
  last_message?: Message;
}

export interface ChatRoomCreateRequest {
  name: string;
  type: ChatRoomType;
  members: string[];
}

export interface ChatRoomMembersRequest {
  members: string[];
}

export interface ChatPaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total_count: number;
}
