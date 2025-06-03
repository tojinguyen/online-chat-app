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

export const authService = {
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post<LoginResponse>(
      AUTH_CONSTANTS.API_ENDPOINTS.LOGIN,
      data,
      false
    );

    if (response.success) {
      localStorage.setItem(
        AUTH_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN,
        response.data.accessToken
      );
      localStorage.setItem(
        AUTH_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN,
        response.data.refreshToken
      );
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
    return await apiClient.post<RegisterResponse>(
      AUTH_CONSTANTS.API_ENDPOINTS.VERIFY,
      data,
      false
    );
  },

  logout: (): void => {
    localStorage.removeItem(AUTH_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(AUTH_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(AUTH_CONSTANTS.STORAGE_KEYS.USER_INFO);
  },

  refreshToken: async (): Promise<ApiResponse<LoginResponse>> => {
    const refreshToken = localStorage.getItem(
      AUTH_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN
    );

    if (!refreshToken) {
      return {
        success: false,
        message: "No refresh token available",
        data: {} as LoginResponse,
      };
    }

    const response = await apiClient.post<LoginResponse>(
      AUTH_CONSTANTS.API_ENDPOINTS.REFRESH,
      {},
      true
    );

    if (response.success) {
      localStorage.setItem(
        AUTH_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN,
        response.data.accessToken
      );
      localStorage.setItem(
        AUTH_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN,
        response.data.refreshToken
      );
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

    const token = localStorage.getItem(
      AUTH_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN
    );
    return !!token;
  },

  getUserInfo: () => {
    if (typeof window === "undefined") return null;

    const userInfo = localStorage.getItem(
      AUTH_CONSTANTS.STORAGE_KEYS.USER_INFO
    );
    return userInfo ? JSON.parse(userInfo) : null;
  },
};
