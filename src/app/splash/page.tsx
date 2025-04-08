"use client";

import { AUTH_STORAGE_KEYS } from "@/constants/authConstants";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SplashScreen() {
  const { verifyToken, refreshAccessToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Check if we have tokens
        const accessToken = localStorage.getItem(
          AUTH_STORAGE_KEYS.ACCESS_TOKEN
        );
        const refreshTokenStr = localStorage.getItem(
          AUTH_STORAGE_KEYS.REFRESH_TOKEN
        );

        let isValid = false;

        // First try with access token
        if (accessToken) {
          isValid = await verifyToken(accessToken);
        }

        // If access token invalid, try refresh token
        if (!isValid && refreshTokenStr) {
          const refreshSuccess = await refreshAccessToken(refreshTokenStr);
          if (refreshSuccess) {
            const newAccessToken = localStorage.getItem(
              AUTH_STORAGE_KEYS.ACCESS_TOKEN
            );
            if (newAccessToken) {
              isValid = await verifyToken(newAccessToken);
            }
          }
        }

        // Navigate based on authentication status
        if (isValid) {
          router.replace("/dashboard"); // Or your authenticated home route
        } else {
          router.replace("/login");
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, [verifyToken, refreshAccessToken, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Online Chat App</h1>
        {isLoading && <p className="text-lg font-medium mb-2">Loading...</p>}
        <p className="text-muted-foreground">Starting your experience...</p>
      </div>
    </div>
  );
}
