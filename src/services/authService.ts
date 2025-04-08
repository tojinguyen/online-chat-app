import axios from "axios";

// Auth related DTOs
export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
}

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
 * Login user with email and password
 */
export const loginUser = async (
  data: LoginRequestDto
): Promise<LoginResponseDto> => {
  try {
    const response = await axios.post<LoginResponseDto>(
      `${API_URL}/auth/login`,
      data
    );
    return response.data;
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
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
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
): Promise<LoginResponseDto> => {
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

  return response.json();
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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Token verification failed");
    }

    return await response.json();
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
    const response = await axios.post<RefreshTokenResponseDto>(
      `${API_URL}/auth/refresh-token`,
      { refreshToken }
    );
    return response.data;
  } catch (error) {
    console.error("Token refresh error:", error);
    throw error;
  }
};
