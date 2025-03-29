"use client";

import {
  LoginResponseDto,
  loginUser,
  registerUser,
} from "@/services/authService";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load token từ localStorage khi trang được mở
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data: LoginResponseDto = await loginUser({ email, password });

      // Lưu token vào localStorage
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", email);

      setUser(email);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Re-throw để xử lý lỗi ở component UI
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      // Call the registerUser API function
      const registerResponse = await registerUser({ email, password, name });

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

      return registerResponse;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error; // Re-throw for handling in UI components
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
