import { Message } from "@/services/messageService";
import Avatar from "./Avatar";
import MessageContent from "./MessageContent";

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  return (
    <div
      className={`flex mb-4 ${
        message.isMine ? "justify-end" : "justify-start"
      }`}
    >
      {!message.isMine && (
        <div className="w-8 h-8 rounded-full overflow-hidden mr-2 mt-1">
          <Avatar name={message.sender} avatarUrl={undefined} />
        </div>
      )}
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          message.isMine
            ? "bg-indigo-600 text-white"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        <div className="flex justify-between items-center mb-1">
          <span
            className={`text-xs font-medium ${
              message.isMine ? "text-indigo-200" : "text-gray-500"
            }`}
          >
            {message.isMine ? "You" : message.sender}
          </span>
          <span
            className={`text-xs ${
              message.isMine ? "text-indigo-200" : "text-gray-500"
            } ml-2`}
          >
            {message.time}
          </span>
        </div>
        <MessageContent message={message} />
      </div>
    </div>
  );
}
