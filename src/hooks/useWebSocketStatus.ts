import { useWebSocketContext } from "@/context/WebSocketContext";

/**
 * Hook to get WebSocket connection status in dashboard components
 * This provides a simple way to check if WebSocket is connected
 */
export const useWebSocketStatus = () => {
  const context = useWebSocketContext();
  return {
    isConnected: context.isConnected,
    hasContext: true,
  };
};
