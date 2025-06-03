import { apiClient } from "@/lib/api";
import {
  ApiResponse,
  ChatPaginationParams,
  ChatRoom,
  ChatRoomCreateRequest,
  ChatRoomMembersRequest,
  Message,
  PaginatedResponse,
} from "@/types";

const CHAT_API_ENDPOINTS = {
  CHAT_ROOMS: "/api/v1/chat-rooms",
  CHAT_ROOM: (id: string) => `/api/v1/chat-rooms/${id}`,
  CHAT_ROOM_MESSAGES: (id: string) => `/api/v1/chat-rooms/${id}/messages`,
  CHAT_ROOM_MEMBERS: (id: string) => `/api/v1/chat-rooms/${id}/members`,
  CHAT_ROOM_MEMBER: (roomId: string, userId: string) =>
    `/api/v1/chat-rooms/${roomId}/members/${userId}`,
  CHAT_ROOM_LEAVE: (id: string) => `/api/v1/chat-rooms/${id}/leave`,
  PRIVATE_CHAT_ROOM: (userId: string) => `/api/v1/chat-rooms/private/${userId}`,
};

export const chatService = {
  // Get all chat rooms for the current user
  getChatRooms: async (
    params?: ChatPaginationParams
  ): Promise<ApiResponse<PaginatedResponse<ChatRoom>>> => {
    const queryParams = params
      ? `?page=${params.page}&limit=${params.limit}`
      : "";
    return await apiClient.get<PaginatedResponse<ChatRoom>>(
      `${CHAT_API_ENDPOINTS.CHAT_ROOMS}${queryParams}`
    );
  },

  // Get a specific chat room by ID
  getChatRoomById: async (roomId: string): Promise<ApiResponse<ChatRoom>> => {
    return await apiClient.get<ChatRoom>(CHAT_API_ENDPOINTS.CHAT_ROOM(roomId));
  },
  // Create a new chat room
  createChatRoom: async (
    data: ChatRoomCreateRequest
  ): Promise<ApiResponse<ChatRoom>> => {
    return await apiClient.post<ChatRoom, ChatRoomCreateRequest>(
      CHAT_API_ENDPOINTS.CHAT_ROOMS,
      data
    );
  },

  // Get or create a private chat room with another user
  getOrCreatePrivateChatRoom: async (
    userId: string
  ): Promise<ApiResponse<ChatRoom>> => {
    return await apiClient.get<ChatRoom>(
      CHAT_API_ENDPOINTS.PRIVATE_CHAT_ROOM(userId)
    );
  },

  // Get messages from a chat room
  getChatRoomMessages: async (
    roomId: string,
    params?: ChatPaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Message>>> => {
    const queryParams = params
      ? `?page=${params.page}&limit=${params.limit}`
      : "";
    return await apiClient.get<PaginatedResponse<Message>>(
      `${CHAT_API_ENDPOINTS.CHAT_ROOM_MESSAGES(roomId)}${queryParams}`
    );
  },
  // Add members to a chat room
  addChatRoomMembers: async (
    roomId: string,
    data: ChatRoomMembersRequest
  ): Promise<ApiResponse<ChatRoom>> => {
    return await apiClient.post<ChatRoom, ChatRoomMembersRequest>(
      CHAT_API_ENDPOINTS.CHAT_ROOM_MEMBERS(roomId),
      data
    );
  },
  // Remove a member from a chat room
  removeChatRoomMember: async (
    roomId: string,
    userId: string
  ): Promise<ApiResponse<Record<string, never>>> => {
    return await apiClient.delete<Record<string, never>>(
      CHAT_API_ENDPOINTS.CHAT_ROOM_MEMBER(roomId, userId)
    );
  },

  // Leave a chat room
  leaveChatRoom: async (
    roomId: string
  ): Promise<ApiResponse<Record<string, never>>> => {
    return await apiClient.post<Record<string, never>>(
      CHAT_API_ENDPOINTS.CHAT_ROOM_LEAVE(roomId),
      {}
    );
  },
};
