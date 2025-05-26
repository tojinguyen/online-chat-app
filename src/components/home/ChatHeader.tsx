import { ConnectionStatus } from "@/services/socketService";
import OnlineStatus from "../common/OnlineStatus";
import Avatar from "./Avatar";

interface ChatHeaderProps {
  chatName?: string;
  chatAvatarUrl?: string;
  connectionStatus: ConnectionStatus;
  isAnyoneTyping: boolean;
}

export default function ChatHeader({
  chatName,
  chatAvatarUrl,
  connectionStatus,
  isAnyoneTyping,
}: ChatHeaderProps) {
  // Display connection status indicator
  const getConnectionStatusIcon = () => {
    return <OnlineStatus status={connectionStatus} size="sm" />;
  };

  return (
    <div className="border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center p-3">
        <div className="w-12 h-12 rounded-full overflow-hidden shadow">
          <Avatar name={chatName || "Chat"} avatarUrl={chatAvatarUrl} />
        </div>
        <div className="ml-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-800">
              {chatName}
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
  );
}
