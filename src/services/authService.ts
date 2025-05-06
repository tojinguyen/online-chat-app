import axios from "axios";

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Auth related DTOs
export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface AuthenticationResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string; // Thêm avatarUrl vào response
}

// For backwards compatibility, keeping the same name but using the new structure
export type LoginResponseDto = AuthenticationResponse;

export interface PasswordResetRequestDto {
  email: string;
}

export interface RegisterRequestDto {
  email: string;
  password: string;
  fullName: string;
  avatar?: File | null; // Thêm trường avatar cho đăng ký
}

export interface VerifyEmailRegisterRequestDto {
  email: string;
  code: string;
}

export interface RefreshTokenResponseDto {
  accessToken: string;
  refreshToken?: string;
}

export interface VerifyTokenResponse {
  valid: boolean;
  userId: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string; // Thêm avatarUrl vào response
}

// Base API URL
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

/**
 * Logout user and blacklist tokens
 */
export const logoutUser = async (
  accessToken: string,
  refreshToken: string
): Promise<void> => {
  try {
    const response = await axios.post<ApiResponse<void>>(
      `${API_URL}/auth/logout`,
      { refreshToken },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Logout failed");
    }

    return;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

/**
 * Login user with email and password
 */
export const loginUser = async (
  data: LoginRequestDto
): Promise<AuthenticationResponse> => {
  try {
    const response = await axios.post<ApiResponse<AuthenticationResponse>>(
      `${API_URL}/auth/login`,
      data
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Login failed");
    }

    return response.data.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

/**
 * Register a new user
 */
export const registerUser = async (
  data: RegisterRequestDto
): Promise<{ message: string }> => {
  try {
    if (data.avatar && !(data.avatar instanceof File)) {
      throw new Error("Avatar must be a File object");
    }

    let response;

    // Sử dụng FormData nếu có avatar
    if (data.avatar) {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("name", data.fullName);
      formData.append("avatar", data.avatar);

      response = await axios.post<ApiResponse<{ message: string }>>(
        `${API_URL}/auth/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    }

    if (!response || !response.data.success) {
      throw new Error(response?.data?.message || "Registration failed");
    }

    return response.data.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

/**
 * Verify email with code during registration
 */
export const verifyEmailRegister = async (
  data: VerifyEmailRegisterRequestDto
): Promise<AuthenticationResponse> => {
  try {
    const response = await axios.post<ApiResponse<AuthenticationResponse>>(
      `${API_URL}/auth/verify-registration-code`,
      data
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Email verification failed");
    }

    return response.data.data;
  } catch (error) {
    console.error("Email verification error:", error);
    throw error;
  }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
  data: PasswordResetRequestDto
): Promise<void> => {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to send reset email");
  }

  const apiResponse: ApiResponse<void> = await response.json();

  if (!apiResponse.success) {
    throw new Error(apiResponse.message || "Failed to send reset email");
  }

  return;
};

/**
 * Reset password with token
 */
export const resetPassword = async (
  token: string,
  password: string
): Promise<void> => {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Password reset failed");
  }

  const apiResponse: ApiResponse<void> = await response.json();

  if (!apiResponse.success) {
    throw new Error(apiResponse.message || "Password reset failed");
  }

  return;
};

/**
 * Verify token
 */
export const verifyUserToken = async (
  token: string
): Promise<AuthenticationResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/verify-token`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Token verification failed");
    }

    const apiResponse: ApiResponse<AuthenticationResponse> =
      await response.json();

    if (!apiResponse.success) {
      throw new Error(apiResponse.message || "Token verification failed");
    }

    return apiResponse.data;
  } catch (error) {
    console.error("Error verifying token:", error);
    return {
      accessToken: "",
      refreshToken: "",
      userId: "",
      email: "",
      fullName: "",
      role: "",
      avatarUrl: "",
    };
  }
};

/**
 * Refresh token
 */
export const refreshToken = async (
  refreshToken: string
): Promise<RefreshTokenResponseDto> => {
  try {
    const response = await axios.post<ApiResponse<RefreshTokenResponseDto>>(
      `${API_URL}/auth/refresh-token`,
      { refreshToken }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Token refresh failed");
    }

    return response.data.data;
  } catch (error) {
    console.error("Token refresh error:", error);
    throw error;
  }
};
