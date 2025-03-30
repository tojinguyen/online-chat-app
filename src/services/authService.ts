// Auth related DTOs
export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  fullName: string;
  role: string;
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

// Base API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Login user with email and password
 */
export const loginUser = async (
  data: LoginRequestDto
): Promise<LoginResponseDto> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  return response.json();
};

/**
 * Register a new user
 */
export const registerUser = async (data: RegisterRequestDto): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Registration failed");
  }

  return;
};

/**
 * Verify email with code during registration
 */
export const verifyEmailRegister = async (
  data: VerifyEmailRegisterRequestDto
): Promise<LoginResponseDto> => {
  const response = await fetch(`${API_BASE_URL}/auth/verify-register`, {
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
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
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
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
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
