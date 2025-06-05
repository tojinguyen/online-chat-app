import { API_CONSTANTS } from "@/constants";
import { tokenService } from "@/services/token-service";
import { ApiResponse } from "@/types";

const getAuthorizationHeader = (
  tokenType: "access" | "refresh" = "access"
): string => {
  if (typeof window !== "undefined") {
    const token =
      tokenType === "access"
        ? tokenService.getAccessToken()
        : tokenService.getRefreshToken();
    return token ? `Bearer ${token}` : "";
  }
  return "";
};

export const apiClient = {
  get: async <T>(
    endpoint: string,
    requireAuth = true
  ): Promise<ApiResponse<T>> => {
    const headers: HeadersInit = { ...API_CONSTANTS.HEADERS };

    if (requireAuth) {
      const authHeader = getAuthorizationHeader();
      if (authHeader) {
        headers["Authorization"] = authHeader;
      }
    }

    const response = await fetch(`${API_CONSTANTS.BASE_URL}${endpoint}`, {
      method: "GET",
      headers,
    });

    return (await response.json()) as ApiResponse<T>;
  },
  post: async <T, U = Record<string, unknown>>(
    endpoint: string,
    data: U,
    requireAuth = true,
    tokenType: "access" | "refresh" = "access"
  ): Promise<ApiResponse<T>> => {
    const headers: HeadersInit = { ...API_CONSTANTS.HEADERS };

    if (requireAuth) {
      const authHeader = getAuthorizationHeader(tokenType);
      if (authHeader) {
        headers["Authorization"] = authHeader;
      }
    }

    const response = await fetch(`${API_CONSTANTS.BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    return (await response.json()) as ApiResponse<T>;
  },

  postFormData: async <T>(
    endpoint: string,
    formData: FormData,
    requireAuth = true,
    tokenType: "access" | "refresh" = "access"
  ): Promise<ApiResponse<T>> => {
    const headers: HeadersInit = {};

    if (requireAuth) {
      const authHeader = getAuthorizationHeader(tokenType);
      if (authHeader) {
        headers["Authorization"] = authHeader;
      }
    }

    const response = await fetch(`${API_CONSTANTS.BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    });

    return (await response.json()) as ApiResponse<T>;
  },
  put: async <T, U = Record<string, unknown>>(
    endpoint: string,
    data: U,
    requireAuth = true,
    tokenType: "access" | "refresh" = "access"
  ): Promise<ApiResponse<T>> => {
    const headers: HeadersInit = { ...API_CONSTANTS.HEADERS };

    if (requireAuth) {
      const authHeader = getAuthorizationHeader(tokenType);
      if (authHeader) {
        headers["Authorization"] = authHeader;
      }
    }

    const response = await fetch(`${API_CONSTANTS.BASE_URL}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    return (await response.json()) as ApiResponse<T>;
  },

  delete: async <T>(
    endpoint: string,
    requireAuth = true,
    tokenType: "access" | "refresh" = "access"
  ): Promise<ApiResponse<T>> => {
    const headers: HeadersInit = { ...API_CONSTANTS.HEADERS };

    if (requireAuth) {
      const authHeader = getAuthorizationHeader(tokenType);
      if (authHeader) {
        headers["Authorization"] = authHeader;
      }
    }

    const response = await fetch(`${API_CONSTANTS.BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers,
    });

    return (await response.json()) as ApiResponse<T>;
  },
};
