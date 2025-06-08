export const API_CONSTANTS = {
  BASE_URL: "http://localhost:80",
  API_BASE_PATH: "/api/v1",
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  TIMEOUT: 15000, // 15 seconds
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
  },
};
