"use client";

import { useAuth } from "@/contexts/auth/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SplashScreen() {
  const { user, isLoading, verifyToken, refreshAccessToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken) {
        const isValidToken = await verifyToken(accessToken);

        if (isValidToken) {
          router.push("/home");
        } else {
          const refreshToken = localStorage.getItem("refreshToken");

          if (refreshToken) {
            const refreshSuccess = await refreshAccessToken(refreshToken);

            if (refreshSuccess) {
              router.push("/home");
            } else {
              router.push("/auth");
            }
          } else {
            router.push("/auth");
          }
        }
      } else if (!isLoading) {
        if (user) {
          router.push("/home");
        } else {
          router.push("/auth");
        }
      }

      // Removed unused setIsVerifying call
    };

    if (!isLoading) {
      checkAuthentication();
    }
  }, [user, isLoading, router, verifyToken, refreshAccessToken]);

  // Show a loading screen while checking authentication
  return (
    <div className="flex h-screen items-center justify-center bg-indigo-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-500 mx-auto"></div>
        <h2 className="mt-4 text-xl font-medium text-indigo-900">Loading...</h2>
      </div>
    </div>
  );
}
