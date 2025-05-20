import Avatar from "./Avatar";

interface Conversation {
  id: string;
  name: string;
  avatarUrl?: string;
  time?: string;
  lastMessage?: string;
  unreadCount?: number;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedChat: string | null;
  onSelectChat: (id: string) => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => Promise<void>;
  onPageChange?: (page: number) => void;
  totalPages?: number;
  currentPage?: number;
  totalCount?: number;
}

export default function ConversationList({
  conversations,
  selectedChat,
  onSelectChat,
  loading = false,
  error = null,
  onRetry,
  onPageChange,
  totalPages = 1,
  currentPage = 1,
  totalCount = 0,
}: ConversationListProps) {
  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent mb-3" />
        <p className="text-gray-600 font-medium">Loading conversations...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4">
        <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-gray-700 font-medium text-center mb-2">
          Error Loading Conversations
        </h3>
        <p className="text-gray-500 text-sm text-center mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  // Empty state
  if (conversations.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-400"
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
        <h3 className="text-gray-600 font-medium">No conversations yet</h3>
        <p className="text-gray-500 text-sm mt-1">
          Start chatting with your friends
        </p>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="space-y-2">
        {conversations.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedChat === chat.id
                ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 shadow-sm"
                : "hover:bg-indigo-50/70"
            }`}
            onClick={() => onSelectChat(chat.id)}
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm">
                <Avatar name={chat.name} avatarUrl={chat.avatarUrl} />
              </div>
              {chat.unreadCount && chat.unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
                </span>
              )}
            </div>
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <span
                  className={`font-semibold ${
                    selectedChat === chat.id
                      ? "text-indigo-700"
                      : "text-gray-800"
                  }`}
                >
                  {chat.name}
                </span>
                {chat.time && (
                  <span className="text-xs bg-gray-100 text-gray-600 font-medium py-1 px-2 rounded-full">
                    {chat.time}
                  </span>
                )}
              </div>
              {chat.lastMessage && (
                <p
                  className={`text-sm ${
                    selectedChat === chat.id
                      ? "text-indigo-600"
                      : "text-gray-600"
                  } truncate mt-1`}
                >
                  {chat.lastMessage}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>{" "}
      {/* Pagination controls */}
      {totalPages > 1 && onPageChange && (
        <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-4">
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-500">
              {totalCount > 0 ? `${totalCount} conversations` : ""}
            </span>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-1.5 rounded-md text-sm font-medium transition-colors ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <span className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-700 font-medium rounded-md">
              {currentPage}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-1.5 rounded-md text-sm font-medium transition-colors ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
