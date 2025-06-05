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

    if (requireAuth && !isAuthenticated) {
      // User not authenticated but route requires auth
      router.push(AUTH_CONSTANTS.ROUTES.LOGIN);
    } else if (!requireAuth && isAuthenticated) {
      // User is authenticated but route is for non-authenticated users (like login page)
      router.push(AUTH_CONSTANTS.ROUTES.DASHBOARD);
    }
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
};
