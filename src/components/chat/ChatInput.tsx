"use client";

import { uploadService } from "@/services";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Button } from "../ui";

interface ChatInputProps {
  onSendMessage: (content: string, mimeType?: string) => void;
  onStartTyping?: () => void;
  onStopTyping?: () => void;
}

export const ChatInput = ({
  onSendMessage,
  onStartTyping,
  onStopTyping,
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const TYPING_TIMEOUT = 3000; // Increased from 1000 to 3000ms to reduce server spam

  // File upload handler
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/webm",
      "video/ogg",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a valid file type (images, videos, or PDF).");
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert("File size must be less than 10MB.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Determine resource type for Cloudinary
      let resourceType = "auto";
      if (file.type.startsWith("image/")) {
        resourceType = "image";
      } else if (file.type.startsWith("video/")) {
        resourceType = "video";
      } else {
        resourceType = "raw"; // For PDFs
      }

      // Get upload signature
      const signatureResponse = await uploadService.getUploadSignature(
        resourceType
      );
      if (!signatureResponse.success) {
        throw new Error("Failed to get upload signature");
      }
      const { signature, api_key, cloud_name, timestamp, public_id, folder } =
        signatureResponse.data;

      // Get upload signature
      setUploadProgress(10);

      // Upload to Cloudinary with progress tracking
      setUploadProgress(30); // Start progress
      const fileUrl = await uploadService.uploadToCloudinary(
        file,
        signature,
        api_key,
        cloud_name,
        timestamp,
        public_id,
        folder,
        resourceType
      );
      setUploadProgress(100); // Complete progress      // Brief delay to show completion
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Format the message content based on file type and send as message
      let messageContent = "";
      if (file.type.startsWith("image/")) {
        messageContent = `[IMG:${fileUrl}]`;
      } else if (file.type.startsWith("video/")) {
        messageContent = `[VIDEO:${fileUrl}]`;
      } else {
        // For PDFs and other files
        messageContent = `[FILE:${fileUrl}]${file.name}`;
      }

      // Send the formatted message content with MIME type
      onSendMessage(messageContent, file.type);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");

      // Stop typing when message is sent
      if (isTyping) {
        setIsTyping(false);
        onStopTyping?.();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setMessage(newValue);

    console.log("Input changed:", { newValue, isTyping });

    // Handle typing indicators
    if (newValue.trim() && !isTyping) {
      // Start typing
      console.log("Starting typing from ChatInput");
      setIsTyping(true);
      onStartTyping?.();
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    if (newValue.trim()) {
      typingTimeoutRef.current = setTimeout(() => {
        console.log("Stopping typing from timeout");
        setIsTyping(false);
        onStopTyping?.();
      }, TYPING_TIMEOUT);
    } else {
      // If input is empty, stop typing immediately
      console.log("Stopping typing immediately (empty input)");
      setIsTyping(false);
      onStopTyping?.();
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Stop typing when component unmounts or loses focus
  useEffect(() => {
    return () => {
      if (isTyping) {
        onStopTyping?.();
      }
    };
  }, [isTyping, onStopTyping]);
  return (
    <div className="border-t bg-gradient-to-r from-white to-slate-50 p-4 shrink-0">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,.pdf"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Upload progress indicator */}
      {isUploading && (
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 animate-fade-in">
          <div className="flex items-center justify-between text-sm font-medium text-blue-800">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Uploading file...</span>
            </div>
            <span className="text-blue-700">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2.5 mt-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-end gap-3">
          {/* File upload button */}
          <div className="relative group">
            <Button
              type="button"
              onClick={triggerFileUpload}
              disabled={isUploading}
              variant="ghost"
              size="md"
              className="h-12 w-12 rounded-full bg-white border-2 border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 shadow-input group-hover:shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-colors duration-200 ${
                  isUploading
                    ? "text-slate-400"
                    : "text-slate-600 group-hover:text-primary-600"
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Attach file
            </div>
          </div>

          {/* Message input container */}
          <div className="flex-1 relative">
            <div className="relative bg-white rounded-2xl border-2 border-slate-200 focus-within:border-primary-400 focus-within:shadow-lg transition-all duration-200 shadow-input">
              <textarea
                className="w-full bg-transparent rounded-2xl px-4 py-3 pr-12 resize-none min-h-[48px] max-h-32 focus:outline-none placeholder-slate-400 text-slate-700 leading-relaxed"
                placeholder="Type your message..."
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  // Stop typing when input loses focus
                  if (isTyping) {
                    setIsTyping(false);
                    onStopTyping?.();
                  }
                }}
                disabled={isUploading}
                rows={1}
                style={{
                  height: "auto",
                  minHeight: "48px",
                }}
                onInput={(e) => {
                  e.currentTarget.style.height = "auto";
                  e.currentTarget.style.height =
                    Math.min(e.currentTarget.scrollHeight, 128) + "px";
                }}
              />

              {/* Send button inside input */}
              <div className="absolute right-2 bottom-2">
                <Button
                  type="submit"
                  disabled={!message.trim() || isUploading}
                  size="sm"
                  className={`h-8 w-8 rounded-full p-0 transition-all duration-200 ${
                    message.trim() && !isUploading
                      ? "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl scale-100"
                      : "bg-slate-300 scale-90"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform duration-200 ${
                      message.trim() ? "rotate-0" : "rotate-45"
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </Button>
              </div>
            </div>

            {/* Typing indicator */}
            {isTyping && (
              <div className="absolute -top-6 left-4 text-xs text-slate-500 animate-fade-in">
                Typing...
              </div>
            )}
          </div>
        </div>

        {/* Quick actions hint */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span>Press Enter to send, Shift+Enter for new line</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Supports:</span>
            <div className="flex gap-1">
              <span className="px-1.5 py-0.5 bg-slate-100 rounded text-xs">
                Images
              </span>
              <span className="px-1.5 py-0.5 bg-slate-100 rounded text-xs">
                Videos
              </span>
              <span className="px-1.5 py-0.5 bg-slate-100 rounded text-xs">
                PDFs
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
