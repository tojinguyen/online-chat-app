"use client";

import { ParsedMediaContent } from "@/utils/message-parser";
import Image from "next/image";
import { useState } from "react";

interface MessageMediaProps {
  content: ParsedMediaContent;
  isCurrentUser: boolean;
}

export const MessageMedia = ({ content, isCurrentUser }: MessageMediaProps) => {
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  if (content.type === "text") {
    return <span className="break-words">{content.text}</span>;
  }
  if (content.type === "image") {
    if (imageError || !content.url) {
      return (
        <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
          <svg
            className="w-4 h-4 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <span className="text-red-700 text-sm">Failed to load image</span>
        </div>
      );
    }

    return (
      <div className="mt-2">
        <Image
          src={content.url}
          alt="Shared image"
          width={300}
          height={300}
          className="max-w-full h-auto rounded-lg shadow-sm cursor-pointer hover:opacity-95 transition-opacity"
          style={{ maxHeight: "300px", maxWidth: "100%", objectFit: "contain" }}
          onError={() => setImageError(true)}
          onClick={() => window.open(content.url, "_blank")}
          unoptimized={true}
        />
      </div>
    );
  }

  if (content.type === "video") {
    if (videoError) {
      return (
        <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
          <svg
            className="w-4 h-4 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <span className="text-red-700 text-sm">Failed to load video</span>
        </div>
      );
    }

    return (
      <div className="mt-2">
        <video
          src={content.url}
          controls
          className="max-w-full h-auto rounded-lg shadow-sm"
          style={{ maxHeight: "300px", maxWidth: "100%" }}
          onError={() => setVideoError(true)}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  if (content.type === "file") {
    const getFileIcon = () => {
      const extension = content.filename?.split(".").pop()?.toLowerCase();

      if (["pdf"].includes(extension || "")) {
        return (
          <svg
            className="w-6 h-6 text-red-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        );
      }

      if (["doc", "docx"].includes(extension || "")) {
        return (
          <svg
            className="w-6 h-6 text-blue-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        );
      }

      if (["xls", "xlsx"].includes(extension || "")) {
        return (
          <svg
            className="w-6 h-6 text-green-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        );
      }

      // Default file icon
      return (
        <svg
          className="w-6 h-6 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    };

    return (
      <div className="mt-2">
        <a
          href={content.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-3 p-3 rounded-lg border transition-colors hover:bg-opacity-80 ${
            isCurrentUser
              ? "bg-primary-400 border-primary-300 text-white hover:bg-primary-300"
              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {getFileIcon()}
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-medium truncate ${
                isCurrentUser ? "text-white" : "text-gray-900"
              }`}
            >
              {content.filename || "Unknown file"}
            </p>
            <p
              className={`text-xs ${
                isCurrentUser ? "text-primary-100" : "text-gray-500"
              }`}
            >
              Click to download
            </p>
          </div>
          <svg
            className={`w-4 h-4 ${
              isCurrentUser ? "text-primary-100" : "text-gray-400"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    );
  }

  return null;
};
