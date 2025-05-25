import { AUTH_STORAGE_KEYS } from "@/constants/authConstants";
import socketService from "@/services/socketService";
import { useEffect } from "react";

// This hook handles global WebSocket connection management
export function useGlobalSocket() {
  // Initialize socket connection when user logs in
  useEffect(() => {
    // Kiểm tra token trước khi khởi tạo kết nối socket
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);

    if (token) {
      console.log("Token found, initializing socket connection");
      // Initialize socket connection (với token từ localStorage)
      socketService.connect();
    } else {
      console.log("No token found, skipping socket connection");
    }

    // Clean up socket connection when component unmounts
    return () => {
      console.log("Cleaning up socket connection");
      socketService.disconnect();
    };
  }, []);

  // No need to return anything as this hook handles global state
  return null;
}

// Export the socket service directly for manual usage
export default socketService;
