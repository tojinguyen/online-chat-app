"use client";

import { LoadingScreen } from "@/components/ui";
import { AUTH_CONSTANTS } from "@/constants";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, isLoading, autoLogin } = useAuthContext();

  useEffect(() => {
    // Track if the component is mounted to prevent state updates after unmount
    let isMounted = true;

    const checkAuthAndRedirect = async () => {
      if (isLoading) return; // Don't do anything while loading

      try {
        if (isAuthenticated) {
          // User is already authenticated, redirect to dashboard
          console.log("Home: Already authenticated, redirecting to dashboard");
          window.location.href = AUTH_CONSTANTS.ROUTES.DASHBOARD;
        } else {
          // Try to auto login
          console.log("Home: Attempting auto-login");
          const result = await autoLogin();

          // Check if component is still mounted before updating state
          if (!isMounted) return;

          if (result.success) {
            // Auto login successful, redirect to dashboard after a small delay
            // to ensure state is properly updated
            console.log(
              "Home: Auto-login successful, redirecting to dashboard"
            );
            setTimeout(() => {
              window.location.href = AUTH_CONSTANTS.ROUTES.DASHBOARD;
            }, 100);
          } else {
            // Auto login failed, redirect to login
            console.log("Home: Auto-login failed, redirecting to login");
            window.location.href = AUTH_CONSTANTS.ROUTES.LOGIN;
          }
        }
      } catch (error) {
        console.error("Home: Error during auth check", error);
        if (isMounted) {
          window.location.href = AUTH_CONSTANTS.ROUTES.LOGIN;
        }
      }
    };

    // Wait a small amount of time before checking auth to ensure everything is initialized
    const timeoutId = setTimeout(checkAuthAndRedirect, 100);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [isAuthenticated, isLoading, autoLogin]);

  // Show loading screen while checking authentication
  return <LoadingScreen message="Preparing your experience..." />;
}
