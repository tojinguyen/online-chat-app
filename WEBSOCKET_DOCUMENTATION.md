# WebSocket Service Documentation

This document describes the updated WebSocket service that now matches the backend Go implementation with proper socket message types and payloads.

## Overview

The WebSocket service has been updated to support all the message types and payloads from the backend Go implementation:

### Client -> Server Messages
- `SEND_MESSAGE` - Send chat messages
- `JOIN_ROOM` - Join a chat room
- `LEAVE_ROOM` - Leave a chat room
- `TYPING` - Send typing indicators
- `READ_RECEIPT` - Mark messages as read
- `PING` - Keep connection alive (automatic)

### Server -> Client Messages
- `NEW_MESSAGE` - Receive new chat messages
- `JOIN_SUCCESS` - Successful room join with initial messages
- `JOIN_ERROR` / `ERROR` - Error notifications
- `USER_JOINED` / `USER_LEFT` - User presence updates
- `USERS` - Active users list
- `TYPING` - Typing indicators from other users
- `PONG` - Ping response (automatic)

## Usage Examples

### Basic Setup

```typescript
import { useWebSocketContext } from "@/context/WebSocketContext";

const ChatComponent = () => {
  const {
    isConnected,
    connect,
    disconnect,
    sendMessage,
    sendTyping,
    sendReadReceipt,
    joinRoom,
    leaveRoom,
    onMessage,
    onUserEvent,
    onTyping,
    onError
  } = useWebSocketContext();

  useEffect(() => {
    // Connect to WebSocket
    connect();

    return () => {
      disconnect();
    };
  }, []);
};
```

### Sending Messages

```typescript
// Send a text message
sendMessage("room-123", "Hello everyone!");

// Send a message with media
sendMessage("room-123", "Check this out!", "image/jpeg", "temp-msg-456");
```

### Handling Events

```typescript
useEffect(() => {
  // Listen for new messages
  const unsubscribeMessage = onMessage((message) => {
    console.log("New message:", message);
    setMessages(prev => [...prev, message]);
  });

  // Listen for typing indicators
  const unsubscribeTyping = onTyping((typing) => {
    if (typing.is_typing) {
      setTypingUsers(prev => [...prev, typing.chat_room_id]);
    } else {
      setTypingUsers(prev => prev.filter(id => id !== typing.chat_room_id));
    }
  });

  // Listen for user events
  const unsubscribeUserEvent = onUserEvent((event) => {
    console.log("User event:", event);
    // Handle user join/leave
  });

  // Listen for errors
  const unsubscribeError = onError((error) => {
    console.error("WebSocket error:", error);
    setErrors(prev => [...prev, error.message]);
  });

  return () => {
    unsubscribeMessage();
    unsubscribeTyping();
    unsubscribeUserEvent();
    unsubscribeError();
  };
}, []);
```

### Ping-Pong Connection Monitoring

The WebSocket service automatically maintains connection health using a ping-pong mechanism:

```typescript
import { useWebSocketContext } from "@/context/WebSocketContext";

const HealthMonitor = () => {
  const { configurePingPong, getConnectionHealth } = useWebSocketContext();
  const [health, setHealth] = useState(null);

  useEffect(() => {
    // Update health information every 2 seconds
    const interval = setInterval(() => {
      setHealth(getConnectionHealth());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Configure ping settings (optional)
  const updatePingSettings = () => {
    configurePingPong({
      pingInterval: 30000,  // Send ping every 30 seconds
      pongTimeout: 10000    // Wait 10 seconds for pong response
    });
  };

  return (
    <div>
      <h3>Connection Health</h3>
      {health && (
        <div>
          <p>Status: {health.isHealthy ? 'Healthy' : 'Unhealthy'}</p>
          <p>Last Pong: {health.lastPongReceived}</p>
          <p>Time Since Last Pong: {health.timeSinceLastPong}ms</p>
          <p>Reconnect Attempts: {health.reconnectAttempts}/{health.maxReconnectAttempts}</p>
        </div>
      )}
      <button onClick={updatePingSettings}>Configure Ping Settings</button>
    </div>
  );
};
```

**Default Settings:**
- Ping Interval: 30 seconds
- Pong Timeout: 10 seconds
- Automatic reconnection on connection failure

**Features:**
- Automatic ping sending at configured intervals
- Connection health monitoring via pong responses
- Automatic reconnection when connection is determined dead
- Configurable ping/pong timing
- Real-time connection health status

### Room Management

```typescript
// Join a room
const handleJoinRoom = (roomId: string) => {
  joinRoom(roomId);
};

// Leave a room
const handleLeaveRoom = (roomId: string) => {
  leaveRoom(roomId);
};

// Handle successful join with initial messages
useEffect(() => {
  const unsubscribeJoinSuccess = onJoinSuccess((success) => {
    console.log(`Joined room ${success.chat_room_id} successfully`);
    
    if (success.initial_messages) {
      // Set initial messages in your state
      setMessages(success.initial_messages);
    }
  });

  return unsubscribeJoinSuccess;
}, []);
```

### Typing Indicators

```typescript
const handleTypingStart = (roomId: string) => {
  sendTyping(roomId, true);
};

const handleTypingStop = (roomId: string) => {
  sendTyping(roomId, false);
};

// Auto-stop typing after timeout
useEffect(() => {
  if (isTyping) {
    const timeout = setTimeout(() => {
      handleTypingStop(currentRoomId);
    }, 3000); // Stop typing after 3 seconds

    return () => clearTimeout(timeout);
  }
}, [isTyping, currentRoomId]);
```

### Read Receipts

```typescript
const handleMarkAsRead = (roomId: string, messageId: string) => {
  sendReadReceipt(roomId, messageId);
};

// Auto-mark messages as read when they come into view
useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const messageId = entry.target.getAttribute('data-message-id');
        if (messageId) {
          handleMarkAsRead(currentRoomId, messageId);
        }
      }
    });
  });

  // Observe message elements
  return () => observer.disconnect();
}, []);
```

## Type Definitions

### Socket Message Structure

```typescript
interface SocketMessage<T = unknown> {
  type: SocketMessageType;
  sender_id?: string;
  timestamp?: number;
  data?: T;
}
```

### Payload Types

```typescript
// Client -> Server
interface ChatMessageSendPayload {
  chat_room_id: string;
  content: string;
  mime_type?: string;
  temp_message_id?: string;
}

interface TypingPayload {
  chat_room_id: string;
  is_typing: boolean;
}

interface ReadReceiptPayload {
  chat_room_id: string;
  message_id: string;
}

// Server -> Client
interface ChatMessageReceivePayload {
  chat_room_id: string;
  message_id: string;
  sender_name?: string;
  avatar_url?: string;
  content: string;
  mime_type?: string;
}

interface UserEventPayload {
  chat_room_id: string;
  user_id: string;
  user_name?: string;
  avatar_url?: string;
}

interface ErrorPayload {
  chat_room_id?: string;
  message: string;
  code?: string;
}
```

## Demo

Visit `/demo` to see a working example of all WebSocket functionality including:
- Connection management
- Sending and receiving messages
- Typing indicators
- User presence
- Error handling
- Read receipts

## Migration Notes

If you're updating from the old WebSocket service:

1. **Message Type Changes**: `CHAT` is now `NEW_MESSAGE`
2. **Payload Structure**: All payloads now follow the backend Go structure
3. **New Features**: Typing indicators, read receipts, user presence, and better error handling
4. **Handler Registration**: New handlers for typing, user events, and errors
5. **Message Format**: Messages now use proper payload structures instead of raw data

## Backend Integration

This frontend implementation matches the Go backend socket implementation with:
- Consistent message types and constants
- Matching payload structures
- Proper error handling
- Support for all backend features
