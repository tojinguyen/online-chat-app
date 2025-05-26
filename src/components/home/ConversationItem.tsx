import Avatar from "./Avatar";

export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  FILE = "FILE"
}

interface Conversation {
  id: string;
  name: string;
  avatarUrl?: string;
  time?: string;
  lastMessage?: string;
  lastMessageType?: MessageType;
  lastMessageSender?: {
    id: string;
    name: string;
    isCurrentUser?: boolean;
  };
  unreadCount?: number;
}

interface ConversationItemProps {
  chat: Conversation;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function getMessagePreview(chat: Conversation): string {
  if (!chat.lastMessage) return '';
  
  const messageType = chat.lastMessageType || MessageType.TEXT;
  
  if (messageType === MessageType.TEXT) return chat.lastMessage;

  const messageTypes: Record<Exclude<MessageType, MessageType.TEXT>, string> = {
    [MessageType.IMAGE]: 'ảnh',
    [MessageType.VIDEO]: 'video',
    [MessageType.AUDIO]: 'âm thanh',
    [MessageType.FILE]: 'file'
  };

  const typeText = messageTypes[messageType];
  
  if (chat.lastMessageSender?.isCurrentUser) {
    return `Bạn đã gửi một ${typeText}`;
  }
  
  if (chat.lastMessageSender) {
    return `${chat.lastMessageSender.name} đã gửi một ${typeText}`;
  }

  return chat.lastMessage;
}

export default function ConversationItem({ chat, isSelected, onSelect }: ConversationItemProps) {
  const messagePreview = getMessagePreview(chat);

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
        {messagePreview && (
          <p
            className={`text-sm ${
              isSelected ? "text-indigo-600" : "text-gray-600"
            } truncate mt-1`}
          >
            {messagePreview}
          </p>
        )}
      </div>
    </div>
  );
} 