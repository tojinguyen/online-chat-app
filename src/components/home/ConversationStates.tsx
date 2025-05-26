interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading conversations..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent mb-3" />
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  );
}

interface ErrorStateProps {
  error: string;
  onRetry?: () => Promise<void>;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
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

export function EmptyState() {
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