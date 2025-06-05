import { AUTH_CONSTANTS } from "@/constants";
import { authService } from "@/services/auth-service";
import { User } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);

        // Check if user is authenticated based on token presence
        const hasToken = authService.isAuthenticated();

        if (hasToken) {
          // Verify the token with the server
          const response = await authService.verifyToken();

          if (response.success) {
            // Token is valid, update user info
            const userInfo = authService.getUserInfo();
            setUser(userInfo);
            setIsAuthenticated(true);
          } else {
            // Token verification failed, try refresh token
            const refreshResponse = await authService.refreshToken();

            if (refreshResponse.success) {
              // Refresh successful, update user info
              const userInfo = authService.getUserInfo();
              setUser(userInfo);
              setIsAuthenticated(true);
            } else {
              // Refresh failed, clear auth state
              authService.logout();
              setUser(null);
              setIsAuthenticated(false);
            }
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Authentication check failed", error);
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });

      if (response.success) {
        setUser(authService.getUserInfo());
        setIsAuthenticated(true);
        router.push(AUTH_CONSTANTS.ROUTES.DASHBOARD);
        return { success: true };
      }

      return { success: false, message: response.message };
    } catch (error) {
      console.error("Login failed", error);
      return { success: false, message: "Login failed. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    router.push(AUTH_CONSTANTS.ROUTES.LOGIN);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    avatar: File
  ) => {
    setIsLoading(true);
    try {
      const response = await authService.register({
        name,
        email,
        password,
        avatar,
      });

      if (response.success) {
        router.push("/verify-email");
        return { success: true };
      }

      return { success: false, message: response.message };
    } catch (error) {
      console.error("Registration failed", error);
      return {
        success: false,
        message: "Registration failed. Please try again.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const autoLogin = async () => {
    setIsLoading(true);
    try {
      // Check if we have a token
      if (authService.isAuthenticated()) {
        // Verify the token with the server
        const response = await authService.verifyToken();

        if (response.success) {
          // Token is valid, set user and authentication state
          setUser(authService.getUserInfo());
          setIsAuthenticated(true);
          return { success: true };
        } else {
          // Token verification failed, try refresh token
          const refreshResponse = await authService.refreshToken();

          if (refreshResponse.success) {
            // Refresh successful, set user and authentication state
            setUser(authService.getUserInfo());
            setIsAuthenticated(true);
            return { success: true };
          } else {
            // Refresh failed, clear auth state
            authService.logout();
            setUser(null);
            setIsAuthenticated(false);
            return {
              success: false,
              message: "Session expired. Please login again.",
            };
          }
        }
      } else {
        return { success: false, message: "No active session found." };
      }
    } catch (error) {
      console.error("Auto login failed", error);
      authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      return { success: false, message: "Login failed. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
    autoLogin,
  };
};
