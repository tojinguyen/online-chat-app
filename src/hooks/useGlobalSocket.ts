import socketService from "@/services/socketService";
import { useEffect } from "react";

// This hook handles global WebSocket connection management
export function useGlobalSocket() {
  // Initialize socket connection when user logs in
  useEffect(() => {
    // Initialize socket connection (assuming credentials are in localStorage already)
    socketService.connect();

    // Clean up socket connection when component unmounts
    return () => {
      socketService.disconnect();
    };
  }, []);

  // No need to return anything as this hook handles global state
  return null;
}

// Export the socket service directly for manual usage
export default socketService;
