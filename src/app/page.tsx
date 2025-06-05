"use client";

import { LoadingScreen } from "@/components/ui";
import { AUTH_CONSTANTS } from "@/constants";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, isLoading, autoLogin } = useAuthContext();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      if (!isLoading) {
        if (isAuthenticated) {
          // User is already authenticated, redirect to dashboard
          window.location.href = AUTH_CONSTANTS.ROUTES.DASHBOARD;
        } else {
          // Try to auto login
          const result = await autoLogin();

          if (result.success) {
            // Auto login successful, redirect to dashboard
            window.location.href = AUTH_CONSTANTS.ROUTES.DASHBOARD;
          } else {
            // Auto login failed, redirect to login
            window.location.href = AUTH_CONSTANTS.ROUTES.LOGIN;
          }
        }
      }
    };

    checkAuthAndRedirect();
  }, [isAuthenticated, isLoading, autoLogin]);

  // Show loading screen while checking authentication
  return <LoadingScreen message="Preparing your experience..." />;
}
