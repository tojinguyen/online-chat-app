// Example of how to use the updated SocketService in a React component

import { Message, socketMessageToMessage } from "@/services/messageService";
import socketService, {
  SocketMessage,
  SocketMessageType,
} from "@/services/socketService";
import React, { useEffect, useState } from "react";

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to socket when component mounts
    socketService.connect();

    // Set up event listeners
    const unsubscribeConnection = socketService.onConnectionStatusChange(
      (status) => {
        setIsConnected(status === "connected");
        console.log("Connection status:", status);
      }
    );

    const unsubscribeMessage = socketService.onMessage(
      (socketMessage: SocketMessage) => {
        // Handle incoming chat messages
        if (socketMessage.type === SocketMessageType.CHAT) {
          const message = socketMessageToMessage(socketMessage);
          if (message) {
            setMessages((prevMessages) => [...prevMessages, message]);
          }
        }
      }
    );

    const unsubscribeTyping = socketService.onTyping((data) => {
      console.log(
        `User ${data.sender_id} is ${
          data.is_typing ? "typing" : "stopped typing"
        } in room ${data.chat_room_id}`
      );
      // Handle typing indicator
    });

    const unsubscribeJoinRoom = socketService.onJoinRoom(
      (success, message, roomId) => {
        if (success) {
          console.log(`Successfully joined room: ${roomId}`);
          setCurrentRoom(roomId || "");
        } else {
          console.error(`Failed to join room: ${message}`);
        }
      }
    );

    const unsubscribeUserJoinLeave = socketService.onUserJoinLeave(
      (userId, chatRoomId) => {
        console.log(`User ${userId} activity in room ${chatRoomId}`);
      }
    );

    const unsubscribeReadReceipt = socketService.onReadReceipt((data) => {
      console.log(
        `Read receipt: message ${data.message_id} read by ${data.sender_id} in room ${data.chat_room_id}`
      );
    });

    // Cleanup on unmount
    return () => {
      unsubscribeConnection();
      unsubscribeMessage();
      unsubscribeTyping();
      unsubscribeJoinRoom();
      unsubscribeUserJoinLeave();
      unsubscribeReadReceipt();
      socketService.disconnect();
    };
  }, []);

  const handleJoinRoom = (roomId: string) => {
    if (isConnected) {
      socketService.joinChatRoom(roomId);
    }
  };

  const handleSendMessage = (content: string) => {
    if (isConnected && currentRoom) {
      socketService.sendMessage(currentRoom, content);
    }
  };

  const handleSendTyping = (isTyping: boolean) => {
    if (isConnected && currentRoom) {
      socketService.sendTypingStatus(currentRoom, isTyping);
    }
  };

  const handleSendReadReceipt = (messageId: string) => {
    if (isConnected && currentRoom) {
      socketService.sendReadReceipt(currentRoom, messageId);
    }
  };

  return (
    <div className="chat-component">
      <div className="connection-status">
        Status: {isConnected ? "Connected" : "Disconnected"}
      </div>

      <div className="room-controls">
        <input
          type="text"
          placeholder="Room ID"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleJoinRoom(e.currentTarget.value);
            }
          }}
        />
        <button onClick={() => handleJoinRoom("room-123")}>
          Join Room 123
        </button>
      </div>

      <div className="messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.isMine ? "own" : "other"}`}
          >
            <span className="sender">{message.sender}</span>
            <span className="content">{message.content}</span>
            <span className="time">{message.time}</span>
            {!message.isMine && (
              <button onClick={() => handleSendReadReceipt(message.id)}>
                Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="message-input">
        <input
          type="text"
          placeholder="Type a message..."
          onFocus={() => handleSendTyping(true)}
          onBlur={() => handleSendTyping(false)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage(e.currentTarget.value);
              e.currentTarget.value = "";
            }
          }}
        />
      </div>
    </div>
  );
};

export default ChatComponent;
