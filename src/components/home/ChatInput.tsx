import React, { useRef } from "react";

// Define a typing extension for the window object
interface WindowWithTypingTimer extends Window {
  typingTimeout?: NodeJS.Timeout;
}

interface ChatInputProps {
  messageText: string;
  setMessageText: (text: string) => void;
  onSendMessage: () => void;
  onFileUpload?: (files: FileList) => void;
  selectedChat: string | null;
  sendTypingStatus: (isTyping: boolean) => void;
}

export default function ChatInput({
  messageText,
  setMessageText,
  onSendMessage,
  onFileUpload,
  selectedChat,
  sendTypingStatus,
}: ChatInputProps) {
  // Reference for file input
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
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
        </button>{" "}
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
                  clearTimeout((window as WindowWithTypingTimer).typingTimeout);
                }

                // Store the new timeout on window object
                (window as WindowWithTypingTimer).typingTimeout = typingTimer;
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
          autoComplete="new-password"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          data-form-type="other"
          data-lpignore="true"
          data-1p-ignore="true"
          name="message"
          role="textbox"
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
  );
}
