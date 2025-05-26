import Avatar from "./Avatar";

interface Conversation {
  id: string;
  name: string;
  avatarUrl?: string;
  time?: string;
  lastMessage?: string;
  unreadCount?: number;
}

interface ConversationItemProps {
  chat: Conversation;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function ConversationItem({ chat, isSelected, onSelect }: ConversationItemProps) {
  return (
    <div
      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected
          ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 shadow-sm"
          : "hover:bg-indigo-50/70"
      }`}
      onClick={() => onSelect(chat.id)}
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
              isSelected ? "text-indigo-700" : "text-gray-800"
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
              isSelected ? "text-indigo-600" : "text-gray-600"
            } truncate mt-1`}
          >
            {chat.lastMessage}
          </p>
        )}
      </div>
    </div>
  );
} 