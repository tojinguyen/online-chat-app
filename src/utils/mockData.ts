import { ChatRoom, ChatRoomType, MessageType } from "@/types";

// Mock data for testing UI when API is not available
export const mockChatRooms: ChatRoom[] = [
  {
    id: "room1",
    name: "Development Team",
    type: ChatRoomType.GROUP,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    member_count: 5,
    members: [
      {
        user_id: "user1",
        name: "John Doe",
        avatar_url:
          "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff",
        joined_at: new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        role: "OWNER",
      },
      {
        user_id: "user2",
        name: "Jane Smith",
        avatar_url:
          "https://ui-avatars.com/api/?name=Jane+Smith&background=FFC107&color=fff",
        joined_at: new Date(
          Date.now() - 28 * 24 * 60 * 60 * 1000
        ).toISOString(),
        role: "MEMBER",
      },
      {
        user_id: "current-user-id",
        name: "You",
        avatar_url:
          "https://ui-avatars.com/api/?name=You&background=4CAF50&color=fff",
        joined_at: new Date(
          Date.now() - 25 * 24 * 60 * 60 * 1000
        ).toISOString(),
        role: "MEMBER",
      },
    ],
    last_message: {
      id: "msg1",
      chat_room_id: "room1",
      sender_id: "user2",
      sender_name: "Jane Smith",
      avatar_url:
        "https://ui-avatars.com/api/?name=Jane+Smith&background=FFC107&color=fff",
      content: "When is our next meeting?",
      type: MessageType.TEXT,
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    },
    unread_count: 3,
  },
  {
    id: "room2",
    name: "Jane Smith",
    type: ChatRoomType.PRIVATE,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    member_count: 2,
    members: [
      {
        user_id: "current-user-id",
        name: "You",
        avatar_url:
          "https://ui-avatars.com/api/?name=You&background=4CAF50&color=fff",
        joined_at: new Date(
          Date.now() - 14 * 24 * 60 * 60 * 1000
        ).toISOString(),
        role: "MEMBER",
      },
      {
        user_id: "user2",
        name: "Jane Smith",
        avatar_url:
          "https://ui-avatars.com/api/?name=Jane+Smith&background=FFC107&color=fff",
        joined_at: new Date(
          Date.now() - 14 * 24 * 60 * 60 * 1000
        ).toISOString(),
        role: "MEMBER",
      },
    ],
    last_message: {
      id: "msg2",
      chat_room_id: "room2",
      sender_id: "current-user-id",
      sender_name: "You",
      avatar_url:
        "https://ui-avatars.com/api/?name=You&background=4CAF50&color=fff",
      content: "Let me know when you're free to discuss the project",
      type: MessageType.TEXT,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
    unread_count: 0,
  },
  {
    id: "room3",
    name: "Marketing Campaign",
    type: ChatRoomType.GROUP,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    member_count: 4,
    members: [
      {
        user_id: "user3",
        name: "Bob Johnson",
        avatar_url:
          "https://ui-avatars.com/api/?name=Bob+Johnson&background=673AB7&color=fff",
        joined_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        role: "OWNER",
      },
      {
        user_id: "current-user-id",
        name: "You",
        avatar_url:
          "https://ui-avatars.com/api/?name=You&background=4CAF50&color=fff",
        joined_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        role: "MEMBER",
      },
    ],
    last_message: {
      id: "msg3",
      chat_room_id: "room3",
      sender_id: "user3",
      sender_name: "Bob Johnson",
      avatar_url:
        "https://ui-avatars.com/api/?name=Bob+Johnson&background=673AB7&color=fff",
      content:
        "[IMG:https://res.cloudinary.com/durc9hj8m/image/upload/v1748444457/chat_files/197aaf8d-920c-4db4-a79a-e4419433e88e.jpg]\n[VIDEO:https://res.cloudinary.com/durc9hj8m/video/upload/v1748444471/chat_files/6a1962d1-a891-4aa8-8011-42fe38012084.mp4]\n[FILE:https://res.cloudinary.com/durc9hj8m/image/upload/v1748444643/chat_files/8e391be4-9d3b-42bc-8795-386b0a31aa48.pdf]UNITY_DEV_NGUYEN_VAN_TOAI.pdf",
      type: MessageType.TEXT,
      created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    },
    unread_count: 1,
  },
];
