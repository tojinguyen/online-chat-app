"use client";

import { AUTH_STORAGE_KEYS } from "@/constants/authConstants";
import {
  LoginResponseDto,
  loginUser,
  refreshToken as refreshUserToken,
  registerUser,
  VerifyTokenResponse,
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
}

interface AuthContextType {
  user: string | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
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
      const data: LoginResponseDto = await loginUser({ email, password });

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
        })
      );

      console.log("Login successful:", data);

      setUser(email);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Re-throw để xử lý lỗi ở component UI
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    try {
      // Call the registerUser API function
      await registerUser({
        email,
        password,
        fullName,
      });

      // After successful registration, log the user in
      try {
        await login(email, password);
      } catch (loginError) {
        console.error("Auto login after registration failed:", loginError);
        // Registration was successful, but auto-login failed
        // We can either throw an error or handle it differently
        throw new Error(
          "Registration successful but login failed. Please try logging in manually."
        );
      }

      // Registration successful, no need to return a value
      return;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error; // Re-throw for handling in UI components
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);

    setUser(null);
    setIsAuthenticated(false);
  };

  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      console.log("Verifying token:", token);
      const response: VerifyTokenResponse = await verifyUserToken(token);

      if (response.valid) {
        setUser(response.email);
        setUserDetails({
          userId: response.userId,
          email: response.email,
          fullName: response.fullName,
          role: response.role,
        });
        setIsAuthenticated(true);

        // Store user details in localStorage
        localStorage.setItem(AUTH_STORAGE_KEYS.USER, response.email);
        localStorage.setItem(
          AUTH_STORAGE_KEYS.USER,
          JSON.stringify({
            userId: response.userId,
            email: response.email,
            fullName: response.fullName,
            role: response.role,
          })
        );

        return true;
      }
      return false;
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
