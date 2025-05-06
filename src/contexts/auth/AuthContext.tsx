"use client";

import { AUTH_STORAGE_KEYS } from "@/constants/authConstants";
import {
  AuthenticationResponse,
  loginUser,
  logoutUser,
  refreshToken as refreshUserToken,
  registerUser,
  verifyUserToken,
} from "@/services/authService";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface UserDetails {
  userId: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string; // Thêm trường avatarUrl cho user details
}

interface AuthContextType {
  user: string | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    avatar: File // Thay đổi từ File | null | undefined thành bắt buộc
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  verifyToken: (token: string) => Promise<boolean>;
  refreshAccessToken: (refreshToken: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load token từ localStorage khi trang được mở
  useEffect(() => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
    setIsLoading(false); // Set loading to false after checking authentication
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data: AuthenticationResponse = await loginUser({ email, password });

      // Lưu token vào localStorage
      localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
      localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
      localStorage.setItem(
        AUTH_STORAGE_KEYS.USER,
        JSON.stringify({
          userId: data.userId,
          email: data.email,
          fullName: data.fullName,
          role: data.role,
          avatarUrl: data.avatarUrl, // Lưu avatarUrl
        })
      );

      console.log("Login successful:", data);

      setUser(email);
      setUserDetails({
        userId: data.userId,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
        avatarUrl: data.avatarUrl, // Cập nhật userDetails với avatarUrl
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Re-throw để xử lý lỗi ở component UI
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
    avatar: File // Thay đổi từ File | null | undefined thành bắt buộc
  ) => {
    try {
      // Call the registerUser API function
      await registerUser({
        email,
        password,
        fullName,
        avatar,
      });
      return;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error; // Re-throw for handling in UI components
    }
  };

  const logout = async () => {
    try {
      // Get tokens from localStorage
      const accessToken = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
      const refreshToken = localStorage.getItem(
        AUTH_STORAGE_KEYS.REFRESH_TOKEN
      );

      localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(AUTH_STORAGE_KEYS.USER);

      // Update state
      setUser(null);
      setIsAuthenticated(false);

      // Call API to blacklist tokens if they exist
      if (accessToken && refreshToken) {
        await logoutUser(accessToken, refreshToken);
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
    }
  };

  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      const response: AuthenticationResponse = await verifyUserToken(token);

      setUser(response.email);
      setUserDetails({
        userId: response.userId,
        email: response.email,
        fullName: response.fullName,
        role: response.role,
        avatarUrl: response.avatarUrl, // Thêm avatarUrl
      });
      setIsAuthenticated(true);

      // Store user details in localStorage
      localStorage.setItem(
        AUTH_STORAGE_KEYS.USER,
        JSON.stringify({
          userId: response.userId,
          email: response.email,
          fullName: response.fullName,
          role: response.role,
          avatarUrl: response.avatarUrl, // Thêm avatarUrl
        })
      );

      return true;
    } catch (error) {
      console.error("Token verification failed:", error);
      return false;
    }
  };

  const refreshAccessToken = async (
    refreshTokenStr: string
  ): Promise<boolean> => {
    try {
      const response = await refreshUserToken(refreshTokenStr);
      if (response && response.accessToken) {
        // Save new tokens
        localStorage.setItem(
          AUTH_STORAGE_KEYS.ACCESS_TOKEN,
          response.accessToken
        );
        if (response.refreshToken) {
          localStorage.setItem(
            AUTH_STORAGE_KEYS.REFRESH_TOKEN,
            response.refreshToken
          );
        }

        // If user info is in response, update it
        const storedUser = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
        if (storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userDetails,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated,
        verifyToken,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
