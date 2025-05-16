import Avatar from "./Avatar";

interface Conversation {
  id: string;
  name: string;
  avatarUrl?: string;
  time?: string;
  lastMessage?: string;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedChat: string | null;
  onSelectChat: (id: string) => void;
}

export default function ConversationList({
  conversations,
  selectedChat,
  onSelectChat,
}: ConversationListProps) {
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
          <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm">
            <Avatar name={chat.name} avatarUrl={chat.avatarUrl} />
          </div>
          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between">
              <span
                className={`font-semibold ${
                  selectedChat === chat.id ? "text-indigo-700" : "text-gray-800"
                }`}
              >
                {chat.name}
              </span>
              <span className="text-xs bg-gray-100 text-gray-600 font-medium py-1 px-2 rounded-full">
                {chat.time}
              </span>
            </div>
            <p
              className={`text-sm ${
                selectedChat === chat.id ? "text-indigo-600" : "text-gray-600"
              } truncate mt-1`}
            >
              {chat.lastMessage}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
