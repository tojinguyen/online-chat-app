import React, { useEffect, useRef } from "react";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col">
      <div className="space-y-3 flex flex-col flex-1">
        {messages.length > 0 ? (
          <>
            {[...messages].reverse().map((message) => (
              <MessageItem
                key={message.id}
                id={message.id}
                content={message.content}
                time={message.time}
                isMine={message.isMine}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
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
