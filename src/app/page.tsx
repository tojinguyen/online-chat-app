"use client";

import { AUTH_STORAGE_KEYS } from "@/constants/authConstants";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SplashScreen() {
  const { verifyToken, refreshAccessToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Skip if already redirected to prevent loops
    if (hasRedirected.current) return;

    const checkAuthentication = async () => {
      try {
        // Only access localStorage in the browser environment
        let accessToken = null;
        let refreshTokenStr = null;

        // Check if window is defined (client-side)
        if (typeof window !== "undefined") {
          accessToken = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
          refreshTokenStr = localStorage.getItem(
            AUTH_STORAGE_KEYS.REFRESH_TOKEN
          );
          console.log("Access Token:", accessToken);
          console.log("Refresh Token:", refreshTokenStr);
        }

        let isValid = false;

        // First try with access token - only if it appears to be valid
        if (
          accessToken &&
          accessToken !== "undefined" &&
          accessToken.length > 10
        ) {
          console.log("Verifying access token...");
          try {
            isValid = await verifyToken(accessToken);
            console.log("Access token verification result:", isValid);
          } catch (err) {
            console.error("Access token verification failed:", err);
          }
        } else {
          console.log("No valid access token available");
        }

        // If access token invalid, try refresh token - only if it appears to be valid
        if (
          !isValid &&
          refreshTokenStr &&
          refreshTokenStr !== "undefined" &&
          refreshTokenStr.length > 10
        ) {
          console.log("Attempting to refresh token...");
          try {
            const refreshSuccess = await refreshAccessToken(refreshTokenStr);
            console.log("Refresh token result:", refreshSuccess);

            if (refreshSuccess) {
              const newAccessToken = localStorage.getItem(
                AUTH_STORAGE_KEYS.ACCESS_TOKEN
              );
              console.log(
                "New access token after refresh:",
                newAccessToken ? "exists" : "undefined"
              );

              if (
                newAccessToken &&
                newAccessToken !== "undefined" &&
                newAccessToken.length > 10
              ) {
                isValid = await verifyToken(newAccessToken);
                console.log("New token verification result:", isValid);
              }
            }
          } catch (refreshErr) {
            console.error("Refresh token process failed:", refreshErr);
          }
        } else if (!isValid) {
          console.log(
            "No valid refresh token available or access token is already valid"
          );
        }

        // Navigate based on authentication status
        console.log("Final authentication status:", isValid);
        if (isValid) {
          console.log("Redirecting to home page");
          hasRedirected.current = true;
          router.replace("/home", { scroll: false });
        } else {
          console.log("Redirecting to auth page");
          hasRedirected.current = true;
          router.replace("/auth", { scroll: false });
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        hasRedirected.current = true;
        router.replace("/auth", { scroll: false });
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
