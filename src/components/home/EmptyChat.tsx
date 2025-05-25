interface EmptyChatProps {
  selectedChat: string | null;
}

export default function EmptyChat({ selectedChat }: EmptyChatProps) {
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

  return null;
}
