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
  is_private?: boolean;
  participants?: { id: string; name: string; avatar_url?: string }[];
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
// Get or create a private chat room with a friend
export async function getPrivateChatRoom(
  userId: string
): Promise<ApiResponse<{ chatRoom: ChatRoom }>> {
  try {
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    const response = await axios.get(
      `${API_URL}/chat-rooms/private/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      message: "Private chat room retrieved successfully",
      data: {
        chatRoom: response.data.data,
      },
    };
  } catch (error) {
    console.error("Error getting private chat room:", error);
    // Xử lý lỗi từ Axios có type an toàn hơn
    const axiosError = error as { response?: { data?: { message?: string } } };
    const errorMessage =
      axiosError?.response?.data?.message || "Failed to get private chat room";
    return {
      success: false,
      message: errorMessage,
      data: {
        chatRoom: {} as ChatRoom,
      },
    };
  }
}

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
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    const response = await axios.get(
      `${API_URL}/chat-rooms/${conversationId}/messages`,
      {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.success) {
      // Transform the API response to match our Message type
      const messagesData = Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];
      // Lấy thông tin người dùng hiện tại từ localStorage
      const currentUser = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
      const currentUserId = currentUser ? JSON.parse(currentUser).userId : null;
      console.log("Current user ID:", currentUserId);

      const messages: Message[] = messagesData.map(
        (msg: {
          id: string;
          content: string;
          created_at: string;
          sender_id: string;
          sender_name: string;
          avatar_url?: string;
          type: string;
          mime_type: string;
          chat_room_id: string;
        }) => {
          // So sánh chi tiết ID
          console.log(`Comparing message ${msg.id}:`);
          console.log(
            `- Message sender_id: "${
              msg.sender_id
            }" (type: ${typeof msg.sender_id})`
          );
          console.log(
            `- Current user ID: "${currentUserId}" (type: ${typeof currentUserId})`
          );
          console.log(`- Are they equal?: ${msg.sender_id === currentUserId}`);

          return {
            id: msg.id,
            conversationId,
            sender: msg.sender_name,
            content: msg.content,
            time: new Date(msg.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isMine: msg.sender_id === currentUserId, // So sánh sender_id với ID người dùng hiện tại
          };
        }
      );
      return {
        success: true,
        message: "Messages retrieved successfully",
        data: {
          messages,
          total_count: response.data.meta?.total_count || messages.length,
          page: response.data.meta?.page || page,
          limit: response.data.meta?.limit || limit,
        },
      };
    } // Fallback to mock data if API call fails or for development
    console.log("Using mock message data for development");

    // Generate mock data
    const totalMessages = 30;
    const mockMessages: Message[] = Array.from({
      length: Math.min(limit, totalMessages),
    }).map((_, index) => {
      const messageIndex = (page - 1) * limit + index;
      const isMine = messageIndex % 3 === 0; // Mock alternating messages

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
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    const response = await axios.post(
      `${API_URL}/chat-rooms/${conversationId}/messages`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.success) {
      // Transform API response to match our Message type
      const messageData =
        Array.isArray(response.data.data) && response.data.data.length > 0
          ? response.data.data[0]
          : response.data.data; // Lấy thông tin người dùng hiện tại từ localStorage
      const currentUser = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
      const currentUserId = currentUser ? JSON.parse(currentUser).userId : null;

      console.log("Send Message - Current user ID:", currentUserId);
      console.log(
        `Send Message - Message sender_id: "${
          messageData.sender_id
        }" (type: ${typeof messageData.sender_id})`
      );
      console.log(
        `Send Message - Current user ID: "${currentUserId}" (type: ${typeof currentUserId})`
      );
      console.log(
        `Send Message - Are they equal?: ${
          messageData.sender_id === currentUserId
        }`
      );

      const message: Message = {
        id: messageData.id,
        conversationId,
        sender: messageData.sender_name || "You", // Use sender_name from API or fallback to "You"
        content: messageData.content,
        time: new Date(messageData.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMine: messageData.sender_id === currentUserId, // So sánh sender_id với ID người dùng hiện tại
      };

      // Note: We don't need to emit via socket here since the server will broadcast
      // the message back to all clients including the sender after receiving HTTP request

      return {
        success: true,
        message: "Message sent successfully",
        data: {
          message,
        },
      };
    } // Fallback to mock data if API call fails
    console.log("Using mock message data for development");

    const mockMessage: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      sender: "You",
      content,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMine: true, // Luôn đặt isMine = true cho tin nhắn giả lập do người dùng gửi
    };
    return {
      success: true,
      message: "Message sent successfully",
      data: {
        message: mockMessage,
      },
    };
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
