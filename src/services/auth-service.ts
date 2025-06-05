import { AUTH_CONSTANTS } from "@/constants";
import { apiClient } from "@/lib/api";
import {
  ApiResponse,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  VerifyRegistrationRequest,
} from "@/types";
import { tokenService } from "./token-service";

export const authService = {
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post<LoginResponse, LoginRequest>(
      AUTH_CONSTANTS.API_ENDPOINTS.LOGIN,
      data,
      false
    );

    if (response.success) {
      // Store tokens using the token service
      tokenService.setAccessToken(response.data.accessToken);
      tokenService.setRefreshToken(response.data.refreshToken);

      // Store user info
      localStorage.setItem(
        AUTH_CONSTANTS.STORAGE_KEYS.USER_INFO,
        JSON.stringify({
          userId: response.data.userId,
          fullName: response.data.fullName,
          email: response.data.email,
          avatarUrl: response.data.avatarUrl,
          role: response.data.role,
        })
      );
    }

    return response;
  },

  register: async (
    data: RegisterRequest
  ): Promise<ApiResponse<RegisterResponse>> => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("avatar", data.avatar);

    return await apiClient.postFormData<RegisterResponse>(
      AUTH_CONSTANTS.API_ENDPOINTS.REGISTER,
      formData,
      false
    );
  },
  verifyRegistration: async (
    data: VerifyRegistrationRequest
  ): Promise<ApiResponse<RegisterResponse>> => {
    return await apiClient.post<RegisterResponse, VerifyRegistrationRequest>(
      AUTH_CONSTANTS.API_ENDPOINTS.VERIFY,
      data,
      false
    );
  },

  logout: (): void => {
    // Clear tokens using the token service
    tokenService.clearTokens();

    // Clear user info
    localStorage.removeItem(AUTH_CONSTANTS.STORAGE_KEYS.USER_INFO);
  },

  refreshToken: async (): Promise<ApiResponse<LoginResponse>> => {
    const refreshToken = tokenService.getRefreshToken();

    if (!refreshToken) {
      return {
        success: false,
        message: "No refresh token available",
        data: {} as LoginResponse,
      };
    }

    // Use apiClient with refresh token type
    try {
      const response = await apiClient.post<
        LoginResponse,
        Record<string, never>
      >(AUTH_CONSTANTS.API_ENDPOINTS.REFRESH, {}, true, "refresh");

      if (response.success) {
        // Store tokens using the token service
        tokenService.setAccessToken(response.data.accessToken);
        tokenService.setRefreshToken(response.data.refreshToken);

        // Store user info
        localStorage.setItem(
          AUTH_CONSTANTS.STORAGE_KEYS.USER_INFO,
          JSON.stringify({
            userId: response.data.userId,
            fullName: response.data.fullName,
            email: response.data.email,
            avatarUrl: response.data.avatarUrl,
            role: response.data.role,
          })
        );
      }

      return response;
    } catch (error) {
      console.error("Token refresh failed", error);
      return {
        success: false,
        message: "Failed to refresh token",
        data: {} as LoginResponse,
      };
    }
  },
  forgotPassword: async (
    email: ForgotPasswordRequest
  ): Promise<ApiResponse<Record<string, never>>> => {
    // This is a mock implementation since it's not in your API
    console.log(`Sending password reset email to: ${email.email}`);

    return {
      success: true,
      message: "Password reset link sent to your email",
      data: {},
    };
  },

  resetPassword: async (
    resetData: ResetPasswordRequest
  ): Promise<ApiResponse<Record<string, never>>> => {
    // This is a mock implementation since it's not in your API
    console.log(`Resetting password with token: ${resetData.token}`);

    return {
      success: true,
      message: "Password reset successfully",
      data: {},
    };
  },

  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false;

    // Use token service to check if access token exists
    return tokenService.hasAccessToken();
  },

  getUserInfo: () => {
    if (typeof window === "undefined") return null;

    const userInfo = localStorage.getItem(
      AUTH_CONSTANTS.STORAGE_KEYS.USER_INFO
    );
    return userInfo ? JSON.parse(userInfo) : null;
  },

  verifyToken: async (): Promise<ApiResponse<LoginResponse>> => {
    const token = tokenService.getAccessToken();

    if (!token) {
      return {
        success: false,
        message: "No access token available",
        data: {} as LoginResponse,
      };
    }

    try {
      // Call the verify endpoint with the access token
      const response = await apiClient.get<LoginResponse>(
        AUTH_CONSTANTS.API_ENDPOINTS.VERIFY,
        true
      );

      // If successful, update local storage with the latest user data if provided
      if (response.success && response.data) {
        // Update tokens if new ones are provided
        if (response.data.accessToken) {
          tokenService.setAccessToken(response.data.accessToken);
        }
        if (response.data.refreshToken) {
          tokenService.setRefreshToken(response.data.refreshToken);
        }

        // Update user info if provided
        localStorage.setItem(
          AUTH_CONSTANTS.STORAGE_KEYS.USER_INFO,
          JSON.stringify({
            userId: response.data.userId,
            fullName: response.data.fullName,
            email: response.data.email,
            avatarUrl: response.data.avatarUrl,
            role: response.data.role,
          })
        );
      }

      return response;
    } catch (error) {
      console.error("Token verification failed", error);

      // Try refreshing the token if verification fails
      try {
        const refreshResponse = await authService.refreshToken();
        if (refreshResponse.success) {
          return refreshResponse;
        } else {
          return {
            success: false,
            message: "Token verification and refresh failed",
            data: {} as LoginResponse,
          };
        }
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        return {
          success: false,
          message: "Failed to verify and refresh token",
          data: {} as LoginResponse,
        };
      }
    }
  },
};
