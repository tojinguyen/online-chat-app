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

        // Check if user is authenticated
        const isAuth = authService.isAuthenticated();
        setIsAuthenticated(isAuth);

        if (isAuth) {
          // Get user info from local storage
          const userInfo = authService.getUserInfo();
          setUser(userInfo);
        }
      } catch (error) {
        console.error("Authentication check failed", error);
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

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
  };
};
