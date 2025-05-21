import { ConnectionStatus } from "@/services/socketService";
import React from "react";

interface OnlineStatusProps {
  status: "online" | "offline" | ConnectionStatus;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const OnlineStatus: React.FC<OnlineStatusProps> = ({
  status,
  size = "md",
  showLabel = false,
}) => {
  // Determine the size based on the prop
  const sizeClass = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  }[size];

  // Determine the color based on status
  const getStatusColor = () => {
    switch (status) {
      case "online":
      case "connected":
        return "bg-green-500";
      case "connecting":
        return "bg-yellow-500 animate-pulse";
      case "offline":
      case "disconnected":
      default:
        return "bg-gray-400";
    }
  };

  // Determine the label text based on status
  const getLabel = () => {
    switch (status) {
      case "online":
      case "connected":
        return "Online";
      case "connecting":
        return "Connecting...";
      case "offline":
      case "disconnected":
      default:
        return "Offline";
    }
  };

  return (
    <div className="flex items-center">
      <span
        className={`${sizeClass} rounded-full ${getStatusColor()} border-2 border-white`}
      ></span>
      {showLabel && (
        <span className="ml-1 text-xs text-gray-600">{getLabel()}</span>
      )}
    </div>
  );
};

export default OnlineStatus;
