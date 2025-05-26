import ConversationItem from "./ConversationItem";
import PaginationControls from "./PaginationControls";
import { LoadingState, ErrorState, EmptyState } from "./ConversationStates";

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
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (conversations.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="p-3">
      <div className="space-y-2">
        {conversations.map((chat) => (
          <ConversationItem
            key={chat.id}
            chat={chat}
            isSelected={selectedChat === chat.id}
            onSelect={onSelectChat}
          />
        ))}
      </div>
      {onPageChange && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
