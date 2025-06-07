"use client";

import { Button, Card, Input } from "@/components/ui";
import { useWebSocketContext } from "@/context/WebSocketContext";
import {
  ActiveUsersListPayload,
  ErrorPayload,
  JoinSuccessPayload,
  Message,
  MessageType,
  TypingPayload,
  UserEventPayload,
} from "@/types";
import Image from "next/image";
import { useEffect, useState } from "react";

export const WebSocketDemo = () => {
  const {
    isConnected,
    connect,
    disconnect,
    sendMessage,
    sendTyping,
    sendReadReceipt,
    sendPing,
    configurePingPong,
    getConnectionHealth,
    joinRoom,
    leaveRoom,
    onMessage,
    onUserEvent,
    onActiveUsers,
    onTyping,
    onError,
    onJoinSuccess,
  } = useWebSocketContext();
  const [chatRoomId, setChatRoomId] = useState("demo-room-123");
  const [messageContent, setMessageContent] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<UserEventPayload[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionHealth, setConnectionHealth] = useState<{
    isConnected: boolean;
    isHealthy: boolean;
    lastPongReceived: string;
    timeSinceLastPong: number;
    pingInterval: number;
    pongTimeout: number;
    reconnectAttempts: number;
    maxReconnectAttempts: number;
  } | null>(null);
  const [pingInterval, setPingInterval] = useState(30000);
  const [pongTimeout, setPongTimeout] = useState(10000);

  useEffect(() => {
    // Register all the event handlers
    const unsubscribeMessage = onMessage((message: Message) => {
      console.log("Received message:", message);
      setMessages((prev) => [...prev, message]);
    });

    const unsubscribeUserEvent = onUserEvent((event: UserEventPayload) => {
      console.log("User event:", event);
      // Handle user join/leave events
    });

    const unsubscribeActiveUsers = onActiveUsers(
      (usersList: ActiveUsersListPayload) => {
        console.log("Active users:", usersList);
        setUsers(usersList.users);
      }
    );

    const unsubscribeTyping = onTyping((typing: TypingPayload) => {
      console.log("Typing event:", typing);
      if (typing.is_typing) {
        setTypingUsers((prev) => [...prev, typing.chat_room_id]);
      } else {
        setTypingUsers((prev) =>
          prev.filter((id) => id !== typing.chat_room_id)
        );
      }
    });

    const unsubscribeError = onError((error: ErrorPayload) => {
      console.error("WebSocket error:", error);
      setErrors((prev) => [...prev, error.message]);
    });

    const unsubscribeJoinSuccess = onJoinSuccess(
      (success: JoinSuccessPayload) => {
        console.log("Join success:", success);
        if (success.initial_messages) {
          // Convert ChatMessageReceivePayload to Message format
          const initialMessages: Message[] = success.initial_messages.map(
            (msg) => ({
              id: msg.message_id,
              chat_room_id: msg.chat_room_id,
              sender_id: "", // Will be populated by backend
              sender_name: msg.sender_name || "",
              avatar_url: msg.avatar_url || "",
              content: msg.content,
              type: MessageType.TEXT, // Default type
              mime_type: msg.mime_type,
              created_at: new Date().toISOString(),
            })
          );
          setMessages(initialMessages);
        }
      }
    );

    return () => {
      unsubscribeMessage();
      unsubscribeUserEvent();
      unsubscribeActiveUsers();
      unsubscribeTyping();
      unsubscribeError();
      unsubscribeJoinSuccess();
    };
  }, [onMessage, onUserEvent, onActiveUsers, onTyping, onError, onJoinSuccess]);

  // Update connection health periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionHealth(getConnectionHealth());
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [getConnectionHealth]);

  const handleSendMessage = () => {
    if (messageContent.trim() && chatRoomId) {
      sendMessage(chatRoomId, messageContent.trim());
      setMessageContent("");
    }
  };

  const handleJoinRoom = () => {
    if (chatRoomId) {
      joinRoom(chatRoomId);
    }
  };

  const handleLeaveRoom = () => {
    if (chatRoomId) {
      leaveRoom(chatRoomId);
    }
  };

  const handleTypingStart = () => {
    if (!isTyping && chatRoomId) {
      setIsTyping(true);
      sendTyping(chatRoomId, true);
    }
  };

  const handleTypingStop = () => {
    if (isTyping && chatRoomId) {
      setIsTyping(false);
      sendTyping(chatRoomId, false);
    }
  };
  const handleMarkAsRead = (messageId: string) => {
    if (chatRoomId) {
      sendReadReceipt(chatRoomId, messageId);
    }
  };

  const handleUpdatePingConfig = () => {
    configurePingPong({
      pingInterval,
      pongTimeout,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">WebSocket Demo</h1>
        {/* Connection Status */}
        <div className="mb-4">
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isConnected
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full mr-2 ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            {isConnected ? "Connected" : "Disconnected"}
          </div>
        </div>{" "}
        {/* Connection Controls */}
        <div className="flex gap-2 mb-4">
          <Button onClick={connect} disabled={isConnected}>
            Connect
          </Button>{" "}
          <Button
            onClick={disconnect}
            disabled={!isConnected}
            variant="secondary"
          >
            Disconnect
          </Button>
          <Button onClick={sendPing} disabled={!isConnected}>
            Send Ping
          </Button>
        </div>
        {/* Connection Health */}
        {connectionHealth && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-medium mb-2">Connection Health</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={
                    connectionHealth.isHealthy
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {connectionHealth.isHealthy ? "Healthy" : "Unhealthy"}
                </span>
              </div>
              <div>
                <span className="font-medium">Last Pong:</span>{" "}
                <span className="text-gray-600">
                  {new Date(
                    connectionHealth.lastPongReceived
                  ).toLocaleTimeString()}
                </span>
              </div>
              <div>
                <span className="font-medium">Time Since Last Pong:</span>{" "}
                <span className="text-gray-600">
                  {Math.round(connectionHealth.timeSinceLastPong / 1000)}s
                </span>
              </div>
              <div>
                <span className="font-medium">Reconnect Attempts:</span>{" "}
                <span className="text-gray-600">
                  {connectionHealth.reconnectAttempts}/
                  {connectionHealth.maxReconnectAttempts}
                </span>
              </div>
            </div>
          </div>
        )}
        {/* Ping Configuration */}
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h3 className="text-lg font-medium mb-2">Ping-Pong Configuration</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Ping Interval (ms)
              </label>
              <Input
                type="number"
                value={pingInterval}
                onChange={(e) => setPingInterval(Number(e.target.value))}
                min={5000}
                max={120000}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Pong Timeout (ms)
              </label>
              <Input
                type="number"
                value={pongTimeout}
                onChange={(e) => setPongTimeout(Number(e.target.value))}
                min={1000}
                max={30000}
              />
            </div>
          </div>
          <Button onClick={handleUpdatePingConfig} className="mt-2" size="sm">
            Update Configuration
          </Button>
          <p className="text-xs text-gray-600 mt-2">
            Current: Ping every {connectionHealth?.pingInterval || 30000}ms,
            Timeout after {connectionHealth?.pongTimeout || 10000}ms
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Chat Room Controls</h2>

        {/* Room Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Chat Room ID
            </label>
            <Input
              value={chatRoomId}
              onChange={(e) => setChatRoomId(e.target.value)}
              placeholder="Enter chat room ID"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleJoinRoom}
              disabled={!isConnected || !chatRoomId}
            >
              Join Room
            </Button>
            <Button
              onClick={handleLeaveRoom}
              disabled={!isConnected || !chatRoomId}
            >
              Leave Room
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Send Message</h2>

        <div className="space-y-4">
          <div>
            <Input
              value={messageContent}
              onChange={(e) => {
                setMessageContent(e.target.value);
                handleTypingStart();
              }}
              onBlur={handleTypingStop}
              placeholder="Type your message..."
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!isConnected || !messageContent.trim() || !chatRoomId}
          >
            Send Message
          </Button>
        </div>
      </Card>

      {/* Messages */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Messages ({messages.length})
        </h2>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{message.sender_name}</span>
                <div className="flex gap-2">
                  <span className="text-xs text-gray-500">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleMarkAsRead(message.id)}
                    disabled={!isConnected}
                  >
                    Mark Read
                  </Button>
                </div>
              </div>
              <p className="text-gray-800">{message.content}</p>
            </div>
          ))}

          {messages.length === 0 && (
            <p className="text-gray-500 text-center py-8">No messages yet</p>
          )}
        </div>
      </Card>

      {/* Active Users */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Active Users ({users.length})
        </h2>

        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.user_id}
              className="flex items-center gap-3 p-2 bg-gray-50 rounded"
            >
              {" "}
              {user.avatar_url && (
                <Image
                  src={user.avatar_url}
                  alt={user.user_name || "User"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <span>{user.user_name || user.user_id}</span>
            </div>
          ))}

          {users.length === 0 && (
            <p className="text-gray-500">No active users</p>
          )}
        </div>
      </Card>

      {/* Typing Indicators */}
      {typingUsers.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Typing Indicators</h2>
          <div className="space-y-1">
            {typingUsers.map((roomId) => (
              <p key={roomId} className="text-gray-600">
                Someone is typing in room: {roomId}
              </p>
            ))}
          </div>
        </Card>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <Card className="p-6 border-red-200">
          <h2 className="text-xl font-semibold mb-4 text-red-800">Errors</h2>
          <div className="space-y-2">
            {errors.map((error, index) => (
              <div key={index} className="p-2 bg-red-50 text-red-800 rounded">
                {error}
              </div>
            ))}{" "}
            <Button onClick={() => setErrors([])} variant="secondary" size="sm">
              Clear Errors
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
