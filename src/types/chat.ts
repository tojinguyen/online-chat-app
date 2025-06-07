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
  role?: string; // "OWNER", "MEMBER", etc.
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
  unread_count?: number;
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

// Socket Message Types - matching backend Go constants
export enum SocketMessageType {
  // Client -> Server messages
  SEND_MESSAGE = "SEND_MESSAGE",
  JOIN_ROOM = "JOIN_ROOM",
  LEAVE_ROOM = "LEAVE_ROOM",
  TYPING = "TYPING",
  READ_RECEIPT = "READ_RECEIPT",
  PING = "PING",

  // Server -> Client messages
  USERS = "USERS",
  JOIN_SUCCESS = "JOIN_SUCCESS",
  JOIN_ERROR = "JOIN_ERROR",
  USER_JOINED = "USER_JOINED",
  USER_LEFT = "USER_LEFT",
  ERROR = "ERROR",
  PONG = "PONG",
  NEW_MESSAGE = "NEW_MESSAGE",
  CHAT_ROOM_UPDATE = "CHAT_ROOM_UPDATE", // Keep existing for compatibility
}

// Base socket message structure
export interface SocketMessage<T = unknown> {
  type: SocketMessageType;
  sender_id?: string;
  timestamp?: number;
  data?: T;
}

// Client -> Server Payloads
export interface ChatMessageSendPayload {
  chat_room_id: string;
  content: string;
  mime_type?: string;
  temp_message_id?: string;
}

export interface JoinRoomPayload {
  chat_room_id: string;
}

export interface LeaveRoomPayload {
  chat_room_id: string;
}

export interface TypingPayload {
  chat_room_id: string;
  is_typing: boolean;
}

export interface ReadReceiptPayload {
  chat_room_id: string;
  message_id: string;
}

// Server -> Client Payloads
export interface ChatMessageReceivePayload {
  chat_room_id: string;
  message_id: string;
  sender_name?: string;
  avatar_url?: string;
  content: string;
  mime_type?: string;
}

export interface UserEventPayload {
  chat_room_id: string;
  user_id: string;
  user_name?: string;
  avatar_url?: string;
}

export interface ActiveUsersListPayload {
  chat_room_id: string;
  users: UserEventPayload[];
}

export interface JoinSuccessPayload {
  chat_room_id: string;
  status: string;
  initial_messages?: ChatMessageReceivePayload[];
}

export interface ErrorPayload {
  chat_room_id?: string;
  message: string;
  code?: string;
}
