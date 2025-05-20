// src/services/messageService.ts
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
        limit,
      },
    };
  }
}

// Send a message to a conversation
export async function sendMessage(
  conversationId: string,
  content: string
): Promise<ApiResponse<Message>> {
  try {
    // In a real app, this would be a POST request to your API
    // For demo purposes, create a fake response
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(300); // Simulate network delay

    const newMessage: Message = {
      id: `msg_new_${Date.now()}`,
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
      data: newMessage,
    };
  } catch (error) {
    console.error("Error sending message:", error);
    return {
      success: false,
      message: "Failed to send message",
      data: {} as Message,
    };
  }
}
