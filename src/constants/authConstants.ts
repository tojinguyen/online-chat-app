// API URL
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// LocalStorage keys
export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
};
