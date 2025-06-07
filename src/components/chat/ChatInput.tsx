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
    <form onSubmit={handleSubmit} className="border-t p-3 bg-white shrink-0">
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
        <div className="mb-2 p-2 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between text-sm text-blue-700">
            <span>Uploading file...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2 mt-1">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* File upload button */}
        <Button
          type="button"
          onClick={triggerFileUpload}
          disabled={isUploading}
          className="h-10 px-3"
          variant="outline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Button>

        <div className="flex-1 relative">
          <textarea
            className="w-full border rounded-lg p-3 pr-10 resize-none h-16 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
            placeholder="Type a message..."
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
          />
        </div>

        <Button
          type="submit"
          disabled={!message.trim() || isUploading}
          className="h-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </Button>
      </div>
    </form>
  );
};
