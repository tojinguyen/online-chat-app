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
  onLoadMore?: () => Promise<void>;
  hasMore?: boolean;
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
  onLoadMore,
  hasMore = false,
}: ChatSectionProps) {
  // State to combine initial and socket messages
  const [allMessages, setAllMessages] = useState<Message[]>(initialMessages);
  const [error, setError] = useState<string | null>(initialError);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [oldScrollHeight, setOldScrollHeight] = useState(0);

  // Reference to scroll to the latest message
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Connect to socket for real-time updates when chat is selected
  const {
    messages: socketMessages,
    connectionStatus,
    typingUsers,
    sendTypingStatus,
  } = useSocket(selectedChat || undefined);

  // Combine API-loaded messages with real-time socket messages
  useEffect(() => {
    // Create a map to deduplicate messages by ID
    const messageMap = new Map<string, Message>();

    // Add initial messages first
    initialMessages.forEach((message) => {
      messageMap.set(message.id, message);
    });

    // Add socket messages, which will overwrite any duplicates
    socketMessages.forEach((message) => {
      messageMap.set(message.id, message);
    });

    // Convert back to array
    setAllMessages(Array.from(messageMap.values()));
  }, [initialMessages, socketMessages]);

  // Update error state when props change
  useEffect(() => {
    setError(initialError);
  }, [initialError]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (!isLoadingMore) {
      scrollToBottom();
    } else {
      // Maintain scroll position when loading more messages
      if (messagesContainerRef.current) {
        const newScrollHeight = messagesContainerRef.current.scrollHeight;
        const scrollDiff = newScrollHeight - oldScrollHeight;
        messagesContainerRef.current.scrollTop = scrollDiff;
      }
    }
  }, [allMessages, isLoadingMore, oldScrollHeight]);

  // Initial scroll to bottom when component mounts or chat changes
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle scroll to load more messages
  const handleScroll = async () => {
    if (
      !messagesContainerRef.current ||
      !onLoadMore ||
      isLoadingMore ||
      !hasMore
    )
      return;

    const { scrollTop } = messagesContainerRef.current;
    if (scrollTop === 0) {
      // Store current scroll height before loading more messages
      setOldScrollHeight(messagesContainerRef.current.scrollHeight);
      setIsLoadingMore(true);
      try {
        await onLoadMore();
      } finally {
        setIsLoadingMore(false);
      }
    }
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
    <div className="h-screen flex flex-col">
      <ChatHeader
        chatName={chatName}
        chatAvatarUrl={chatAvatarUrl}
        connectionStatus={connectionStatus}
        isAnyoneTyping={isAnyoneTyping}
      />

      <div className="flex-1 flex flex-col min-h-0">
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto relative"
        >
          <MessageDisplay
            messages={allMessages}
            isLoading={isLoading}
            error={error}
            messagesEndRef={messagesEndRef}
            isLoadingMore={isLoadingMore}
          />
        </div>

        <ChatInput
          messageText={messageText}
          setMessageText={setMessageText}
          onSendMessage={onSendMessage}
          onFileUpload={onFileUpload}
          selectedChat={selectedChat}
          sendTypingStatus={sendTypingStatus}
        />
      </div>
    </div>
  );
}
