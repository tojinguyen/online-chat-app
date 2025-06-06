"use client";

import { ChatMessage } from "@/components/chat";
import { Message, MessageType } from "@/types";

// Demo messages with different media types
const demoMessages: Message[] = [
  {
    id: "1",
    chat_room_id: "demo-room",
    sender_id: "user1",
    sender_name: "Alice Johnson",
    avatar_url:
      "https://ui-avatars.com/api/?name=Alice+Johnson&background=0D8ABC&color=fff",
    content: "Hey everyone! Just wanted to share some updates with you all.",
    type: MessageType.TEXT,
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
  },
  {
    id: "2",
    chat_room_id: "demo-room",
    sender_id: "current-user",
    sender_name: "You",
    avatar_url:
      "https://ui-avatars.com/api/?name=You&background=4CAF50&color=fff",
    content: "[IMG:https://picsum.photos/400/300]",
    type: MessageType.TEXT,
    created_at: new Date(Date.now() - 4 * 60 * 1000).toISOString(), // 4 minutes ago
  },
  {
    id: "3",
    chat_room_id: "demo-room",
    sender_id: "user2",
    sender_name: "Bob Smith",
    avatar_url:
      "https://ui-avatars.com/api/?name=Bob+Smith&background=FFC107&color=fff",
    content:
      "Great photo! Here's a video I recorded yesterday: [VIDEO:https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4]",
    type: MessageType.TEXT,
    created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // 3 minutes ago
  },
  {
    id: "4",
    chat_room_id: "demo-room",
    sender_id: "current-user",
    sender_name: "You",
    avatar_url:
      "https://ui-avatars.com/api/?name=You&background=4CAF50&color=fff",
    content:
      "[FILE:https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf]Sample Document.pdf",
    type: MessageType.TEXT,
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
  },
  {
    id: "5",
    chat_room_id: "demo-room",
    sender_id: "user1",
    sender_name: "Alice Johnson",
    avatar_url:
      "https://ui-avatars.com/api/?name=Alice+Johnson&background=0D8ABC&color=fff",
    content:
      "Thanks for sharing! Here's everything together:\n[IMG:https://picsum.photos/350/250]\n[VIDEO:https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4]\n[FILE:https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf]Project_Report_Final.pdf\nLet me know what you think!",
    type: MessageType.TEXT,
    created_at: new Date(Date.now() - 1 * 60 * 1000).toISOString(), // 1 minute ago
  },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Message Media Demo
            </h1>
            <p className="text-gray-600 mt-1">
              Testing different message types: text, images, videos, and files
            </p>
          </div>

          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {demoMessages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isCurrentUser={message.sender_id === "current-user"}
              />
            ))}
          </div>

          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Supported Format Examples:
            </h3>
            <div className="text-xs text-gray-600 space-y-1">
              <div>
                <code className="bg-gray-100 px-1 rounded">
                  [IMG:https://example.com/image.jpg]
                </code>{" "}
                - For images
              </div>
              <div>
                <code className="bg-gray-100 px-1 rounded">
                  [VIDEO:https://example.com/video.mp4]
                </code>{" "}
                - For videos
              </div>
              <div>
                <code className="bg-gray-100 px-1 rounded">
                  [FILE:https://example.com/document.pdf]Filename.pdf
                </code>{" "}
                - For files
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
