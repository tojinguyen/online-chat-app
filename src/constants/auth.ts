export const AUTH_CONSTANTS = {
  STORAGE_KEYS: {
    ACCESS_TOKEN: "chat_app_access_token",
    REFRESH_TOKEN: "chat_app_refresh_token",
    USER_INFO: "chat_app_user_info",
  },
  API_ENDPOINTS: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    VERIFY: "/api/v1/auth/verify-token",
    REFRESH: "/api/v1/auth/refresh-token",
  },
  ROUTES: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    DASHBOARD: "/dashboard",
    CHAT: "/chat",
    PROFILE: "/profile",
  },
  FORM_VALIDATION: {
    NAME_MIN_LENGTH: 3,
    NAME_MAX_LENGTH: 50,
    PASSWORD_MIN_LENGTH: 6,
    PASSWORD_MAX_LENGTH: 255,
    EMAIL_MAX_LENGTH: 255,
  },
  ERROR_MESSAGES: {
    REQUIRED_FIELD: "This field is required",
    INVALID_EMAIL: "Please enter a valid email address",
    PASSWORD_TOO_SHORT: "Password must be at least 6 characters",
    PASSWORD_MISMATCH: "Passwords do not match",
    NAME_TOO_SHORT: "Name must be at least 3 characters",
  },
};
