import Avatar from "./Avatar";

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  isMine: boolean;
}

interface ChatSectionProps {
  selectedChat: string | null;
  chatName?: string;
  chatAvatarUrl?: string;
  messages: Message[];
  messageText: string;
  setMessageText: (text: string) => void;
  onSendMessage: () => void;
}

export default function ChatSection({
  selectedChat,
  chatName,
  chatAvatarUrl,
  messages,
  messageText,
  setMessageText,
  onSendMessage,
}: ChatSectionProps) {
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

  return (
    <>
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center p-3">
          <div className="w-12 h-12 rounded-full overflow-hidden shadow">
            <Avatar name={chatName || "Chat"} avatarUrl={chatAvatarUrl} />
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-gray-800">
              {chatName || "Chat"}
            </h3>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
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
                <p>{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-gray-200 bg-white">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 border border-gray-200 rounded-l-lg p-2 focus:outline-none focus:border-indigo-300"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  onSendMessage();
                }
              }}
            />
            <button
              onClick={onSendMessage}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-lg p-2 px-4 transition-colors"
              disabled={!messageText.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
