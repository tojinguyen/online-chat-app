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
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          id={message.id}
          content={message.content}
          time={message.time}
          isMine={message.isMine}
        />
      ))}
    </div>
  );
};

export default MessageList;
