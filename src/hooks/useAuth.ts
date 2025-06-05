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
          // First set authentication state based on token presence
          const userInfo = authService.getUserInfo();
          if (userInfo) {
            setUser(userInfo);
            setIsAuthenticated(true);
          }

          // Then verify the token with the server (but don't wait for the result to show UI)
          authService
            .verifyToken()
            .then((response) => {
              if (!response.success) {
                // Only if verification explicitly fails, try refresh
                authService
                  .refreshToken()
                  .then((refreshResponse) => {
                    if (!refreshResponse.success) {
                      // Only if refresh explicitly fails, log out
                      authService.logout();
                      setUser(null);
                      setIsAuthenticated(false);
                    }
                  })
                  .catch((error) => {
                    console.error("Token refresh failed", error);
                  });
              }
            })
            .catch((error) => {
              console.error("Token verification failed", error);
            });
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
        // Immediately set the user and authentication state
        const userInfo = authService.getUserInfo();
        setUser(userInfo);
        setIsAuthenticated(true);

        // Use window.location for navigation instead of router to force a full page refresh
        // This ensures we get a clean start with the new authentication state
        window.location.href = AUTH_CONSTANTS.ROUTES.DASHBOARD;
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
        // Get user info from localStorage
        const userInfo = authService.getUserInfo();

        if (userInfo) {
          // Set auth state optimistically based on token presence
          setUser(userInfo);
          setIsAuthenticated(true);

          // Trigger token verification in the background but don't wait for it
          authService
            .verifyToken()
            .then((response) => {
              if (!response.success) {
                // Only try refresh if verification fails
                return authService.refreshToken();
              }
              return response;
            })
            .then((finalResponse) => {
              if (!finalResponse.success) {
                // Only if both verify and refresh fail, log out - but not now, on next page load
                console.log(
                  "Token validation failed but keeping session active for now"
                );
              }
            })
            .catch((error) => {
              console.error("Background token validation error:", error);
            });

          // Return success immediately without waiting
          return { success: true };
        }
      }

      // No valid token or user info
      return { success: false, message: "No active session found." };
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
