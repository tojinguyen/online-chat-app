"use client";

import { LoadingScreen } from "@/components/ui";
import { AUTH_CONSTANTS } from "@/constants";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
}

/**
 * AuthGuard component to protect routes that require authentication
 * @param children - The content to render if authentication check passes
 * @param requireAuth - Whether authentication is required (default: true)
 */
export const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    // Skip the check if still loading
    if (isLoading) return;

    // Add a small delay to ensure state is fully updated before redirecting
    const timeoutId = setTimeout(() => {
      if (requireAuth && !isAuthenticated) {
        // User not authenticated but route requires auth
        console.log("AuthGuard: Redirecting to login - not authenticated");
        router.replace(AUTH_CONSTANTS.ROUTES.LOGIN);
      } else if (!requireAuth && isAuthenticated) {
        // User is authenticated but route is for non-authenticated users (like login page)
        console.log(
          "AuthGuard: Redirecting to dashboard - already authenticated"
        );
        router.replace(AUTH_CONSTANTS.ROUTES.DASHBOARD);
      }
    }, 50); // Small delay

    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, isLoading, requireAuth, router]);

  // Show loading state if still checking authentication
  if (isLoading) {
    return <LoadingScreen message="Checking authentication status..." />;
  }

  // If authentication check passes, render children
  if ((requireAuth && isAuthenticated) || (!requireAuth && !isAuthenticated)) {
    return <>{children}</>;
  }

  // Continue to render loading screen during redirect to avoid flashing content
  return <LoadingScreen message="Redirecting..." />;
  return <LoadingScreen message="Redirecting..." />;
};
