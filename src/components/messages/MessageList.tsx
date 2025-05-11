import React from "react";
import MessageItem from "./MessageItem";

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  isMine: boolean;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
      <div className="space-y-3">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageItem
              key={message.id}
              id={message.id}
              content={message.content}
              time={message.time}
              isMine={message.isMine}
            />
          ))
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 text-center">No messages yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList;
