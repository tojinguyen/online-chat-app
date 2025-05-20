// src/services/messageService.ts
import { API_URL, AUTH_STORAGE_KEYS } from "@/constants/authConstants";
import axios from "axios";
import { ApiResponse } from "./authService"; // Assuming this type is defined in authService

// Define Message type for the app
export interface Message {
  id: string;
  conversationId: string;
  sender: string;
  content: string;
  time: string;
  isMine: boolean;
}

// Define ChatRoom type based on the API specification
export interface ChatRoom {
  id: string;
  name: string;
  avatar_url?: string;
  last_message?: string;
  last_activity_time?: string;
  unread_count?: number;
}

export interface ChatRoomsResponse {
  success: boolean;
  message: string;
  data: ChatRoom[];
  meta?: {
    page?: number;
    limit?: number;
    total_pages?: number;
    total_count?: number;
  };
}

// Get all chat rooms for the current user
export async function getChatRooms(
  page: number = 1,
  limit: number = 10
): Promise<ChatRoomsResponse> {
  try {
    console.log("Fetching chat rooms...");
    console.log("Page:", page);
    console.log("Limit:", limit);
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    const response = await axios.get(`${API_URL}/chat-rooms`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      message: "Chat rooms retrieved successfully",
      data: response.data.data,
      meta: response.data.meta,
    };
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    return {
      success: false,
      message: "Failed to fetch chat rooms",
      data: [],
    };
  }
}

// Get messages for a conversation
export async function getMessages(
  conversationId: string,
  page: number = 1,
  limit: number = 20
): Promise<
  ApiResponse<{
    messages: Message[];
    total_count: number;
    page: number;
    limit: number;
  }>
> {
  try {
    // In a real app, this would be a fetch call to your API
    // For demo purposes, generating fake messages
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(500); // Simulate network delay

    // Generate mock data
    const totalMessages = 30;
    const mockMessages: Message[] = Array.from({
      length: Math.min(limit, totalMessages),
    }).map((_, index) => {
      const messageIndex = (page - 1) * limit + index;
      const isMine = messageIndex % 3 === 0;

      return {
        id: `msg_${conversationId}_${messageIndex}`,
        conversationId,
        sender: isMine ? "You" : `User ${(messageIndex % 5) + 1}`,
        content: `This is message ${
          messageIndex + 1
        } for conversation ${conversationId}`,
        time: new Date(Date.now() - messageIndex * 3600000).toLocaleTimeString(
          [],
          { hour: "2-digit", minute: "2-digit" }
        ),
        isMine,
      };
    });
    return {
      success: true,
      message: "Messages retrieved successfully",
      data: {
        messages: mockMessages,
        total_count: totalMessages,
        page,
        limit,
      },
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return {
      success: false,
      message: "Failed to fetch messages",
      data: {
        messages: [],
        total_count: 0,
        page: 1,
        limit: 20,
      },
    };
  }
}

// Send a message to a conversation
export async function sendMessage(
  conversationId: string,
  content: string
): Promise<ApiResponse<{ message: Message }>> {
  try {
    // In a real app, this would be a fetch call to your API
    // For demo purposes, generating a fake response
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(300); // Simulate network delay

    // Create mock message
    const mockMessage: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      sender: "You",
      content,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMine: true,
    };

    return {
      success: true,
      message: "Message sent successfully",
      data: {
        message: mockMessage,
      },
    };

    /* This would be the actual API call in a real application:
    const response = await axios.post(
      `${API_URL}/conversations/${conversationId}/messages`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return {
      success: true,
      message: "Message sent successfully",
      data: {
        message: response.data.message,
      },
    };
    */
  } catch (error) {
    console.error("Error sending message:", error);
    return {
      success: false,
      message: "Failed to send message",
      data: {
        message: {} as Message,
      },
    };
  }
}
