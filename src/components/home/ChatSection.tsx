import { useSocket } from "@/hooks/useSocket";
import { Message } from "@/services/messageService";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import OnlineStatus from "../common/OnlineStatus";
import Avatar from "./Avatar";

// Define a typing extension for the window object
interface WindowWithTypingTimer extends Window {
  typingTimeout?: NodeJS.Timeout;
}

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

  // Reference for file input
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Display connection status indicator
  const getConnectionStatusIcon = () => {
    return <OnlineStatus status={connectionStatus} size="sm" />;
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && onFileUpload) {
      onFileUpload(files);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-10 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 className="text-gray-700 font-medium text-xl mb-2">
          No chat selected
        </h3>
        <p className="text-gray-500 max-w-md">
          Select a conversation from the sidebar or search for someone to start
          chatting
        </p>
      </div>
    );
  }

  // Get typing indicators for this conversation
  const isAnyoneTyping = Object.values(typingUsers).some(
    (isTyping) => isTyping
  );

  return (
    <>
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center p-3">
          <div className="w-12 h-12 rounded-full overflow-hidden shadow">
            <Avatar name={chatName || "Chat"} avatarUrl={chatAvatarUrl} />
          </div>
          <div className="ml-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-800">
                {chatName || "Chat"}
              </h3>
              {getConnectionStatusIcon()}
            </div>
            <p className="text-xs text-gray-500">
              {connectionStatus === "connected"
                ? isAnyoneTyping
                  ? "Typing..."
                  : "Online"
                : connectionStatus === "connecting"
                ? "Connecting..."
                : "Offline"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-full text-red-500">
              <p>{error}</p>
            </div>
          ) : allMessages.length === 0 ? (
            <div className="flex justify-center items-center h-full text-gray-500">
              <p>No messages yet. Start a conversation!</p>
            </div>
          ) : (
            [...allMessages].reverse().map((message) => (
              <div
                key={message.id}
                className={`flex mb-4 ${
                  message.isMine ? "justify-end" : "justify-start"
                }`}
              >
                {!message.isMine && (
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-2 mt-1">
                    <Avatar name={message.sender} avatarUrl={undefined} />
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    message.isMine
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span
                      className={`text-xs font-medium ${
                        message.isMine ? "text-indigo-200" : "text-gray-500"
                      }`}
                    >
                      {message.isMine ? "You" : message.sender}
                    </span>
                    <span
                      className={`text-xs ${
                        message.isMine ? "text-indigo-200" : "text-gray-500"
                      } ml-2`}
                    >
                      {message.time}
                    </span>
                  </div>
                  {message.content.startsWith("[IMG:") ? (
                    // Display image
                    <div className="mt-1">
                      <Image
                        src={message.content.substring(
                          5,
                          message.content.length - 1
                        )}
                        alt="Shared image"
                        className="max-w-full rounded-md"
                        width={300}
                        height={300}
                        style={{ maxHeight: "300px", objectFit: "contain" }}
                      />
                    </div>
                  ) : message.content.startsWith("[VIDEO:") ? (
                    // Display video
                    <div className="mt-1">
                      <video
                        src={message.content.substring(
                          7,
                          message.content.length - 1
                        )}
                        controls
                        className="max-w-full rounded-md"
                        style={{ maxHeight: "300px" }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : message.content.startsWith("[AUDIO:") ? (
                    // Display audio
                    <div className="mt-1">
                      <audio
                        src={message.content.substring(
                          7,
                          message.content.length - 1
                        )}
                        controls
                        className="max-w-full"
                      >
                        Your browser does not support the audio tag.
                      </audio>
                    </div>
                  ) : message.content.startsWith("[FILE:") ? (
                    // Display file link
                    <div className="mt-1">
                      <a
                        href={message.content.substring(
                          6,
                          message.content.indexOf("]")
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center ${
                          message.isMine ? "text-white" : "text-blue-600"
                        } hover:underline`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        {message.content.substring(
                          message.content.indexOf("]") + 1
                        )}
                      </a>
                    </div>
                  ) : (
                    // Regular text message
                    <p
                      className={`font-medium text-base ${
                        message.isMine ? "text-white" : "text-black"
                      }`}
                    >
                      {message.content}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 border-t border-gray-200 bg-white">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.bmp,.webp,.mp4,.avi,.mov,.wmv,.flv,.webm,.mkv,.mp3,.wav,.ogg,.aac"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="flex items-center gap-2">
            {/* File upload button */}
            <button
              onClick={triggerFileUpload}
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              title="Upload file"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </button>

            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-indigo-300 font-medium text-black placeholder-gray-400"
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
                // Trigger typing indicator when user types
                if (selectedChat) {
                  // Use debounce technique to manage typing status
                  const handleTyping = () => {
                    sendTypingStatus(true);

                    // Create a timeout to set typing status to false after inactivity
                    const typingTimer = setTimeout(() => {
                      sendTypingStatus(false);
                    }, 2000);

                    // Clear previous timeout if it exists on window object
                    if ((window as WindowWithTypingTimer).typingTimeout) {
                      clearTimeout(
                        (window as WindowWithTypingTimer).typingTimeout
                      );
                    }

                    // Store the new timeout on window object
                    (window as WindowWithTypingTimer).typingTimeout =
                      typingTimer;
                  };

                  handleTyping();
                }
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  onSendMessage();
                  // Stop typing indicator when message is sent
                  sendTypingStatus(false);
                }
              }}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              data-form-type="other"
              data-lpignore="true"
            />
            <button
              onClick={() => {
                onSendMessage();
                // Stop typing indicator when message is sent
                sendTypingStatus(false);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-2 px-4 transition-colors"
              disabled={!messageText.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
