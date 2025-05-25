import { useSocket } from "@/hooks/useSocket";
import { Message } from "@/services/messageService";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import EmptyChat from "./EmptyChat";
import MessageDisplay from "./MessageDisplay";

interface ChatSectionProps {
  selectedChat: string | null;
  chatName?: string;
  chatAvatarUrl?: string;
  messages: Message[];
  messageText: string;
  setMessageText: (text: string) => void;
  onSendMessage: () => void;
  onFileUpload?: (files: FileList) => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function ChatSection({
  selectedChat,
  chatName,
  chatAvatarUrl,
  messages: initialMessages,
  messageText,
  setMessageText,
  onSendMessage,
  onFileUpload,
  isLoading = false,
  error: initialError = null,
}: ChatSectionProps) {
  // State to combine initial and socket messages
  const [allMessages, setAllMessages] = useState<Message[]>(initialMessages);
  const [error, setError] = useState<string | null>(initialError);

  // Reference to scroll to the latest message
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Connect to socket for real-time updates when chat is selected
  const {
    messages: socketMessages,
    connectionStatus,
    typingUsers,
    sendTypingStatus,
  } = useSocket(selectedChat || undefined);

  // Combine API-loaded messages with real-time socket messages
  useEffect(() => {
    setAllMessages([...initialMessages, ...socketMessages]);
  }, [initialMessages, socketMessages]);

  // Update error state when props change
  useEffect(() => {
    setError(initialError);
  }, [initialError]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle typing indicator
  useEffect(() => {
    // Cleanup function
    return () => {
      if (selectedChat) sendTypingStatus(false);
    };
  }, [selectedChat, sendTypingStatus]);

  // Display empty state if no chat is selected
  if (!selectedChat) {
    return <EmptyChat selectedChat={selectedChat} />;
  }

  // Get typing indicators for this conversation
  const isAnyoneTyping = Object.values(typingUsers).some(
    (isTyping) => isTyping
  );

  return (
    <>
      <ChatHeader
        chatName={chatName}
        chatAvatarUrl={chatAvatarUrl}
        connectionStatus={connectionStatus}
        isAnyoneTyping={isAnyoneTyping}
      />

      <div className="flex-1 flex flex-col">
        <MessageDisplay
          messages={allMessages}
          isLoading={isLoading}
          error={error}
          messagesEndRef={messagesEndRef}
        />

        <ChatInput
          messageText={messageText}
          setMessageText={setMessageText}
          onSendMessage={onSendMessage}
          onFileUpload={onFileUpload}
          selectedChat={selectedChat}
          sendTypingStatus={sendTypingStatus}
        />
      </div>
    </>
  );
}
