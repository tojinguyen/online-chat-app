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
}

export interface VerifyEmailRegisterRequestDto {
  email: string;
  password: string;
  fullName: string;
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
    const response = await axios.post<ApiResponse<{ message: string }>>(
      `${API_URL}/auth/register`,
      data
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Registration failed");
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
  const response = await fetch(`${API_URL}/auth/verify-register-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Email verification failed");
  }

  const apiResponse: ApiResponse<AuthenticationResponse> =
    await response.json();

  if (!apiResponse.success) {
    throw new Error(apiResponse.message || "Email verification failed");
  }

  return apiResponse.data;
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
): Promise<VerifyTokenResponse> => {
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

    const apiResponse: ApiResponse<VerifyTokenResponse> = await response.json();

    if (!apiResponse.success) {
      throw new Error(apiResponse.message || "Token verification failed");
    }

    return apiResponse.data;
  } catch (error) {
    console.error("Error verifying token:", error);
    return { valid: false, userId: "", email: "", fullName: "", role: "" };
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
