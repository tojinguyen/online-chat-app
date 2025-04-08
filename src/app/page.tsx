"use client";

import { AUTH_STORAGE_KEYS } from "@/constants/authConstants";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SplashScreen() {
  const { isLoading, verifyToken, refreshAccessToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      const accessToken = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
      if (accessToken) {
        const isValidToken = await verifyToken(accessToken);
        if (isValidToken) {
          router.push("/home");
        } else {
          const refreshToken = localStorage.getItem(
            AUTH_STORAGE_KEYS.REFRESH_TOKEN
          );
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
      } else {
        router.push("/auth");
      }
    };

    if (!isLoading) {
      checkAuthentication();
    }
  }, [isLoading, router, refreshAccessToken, verifyToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 max-w-sm w-full bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-5">
          Loading...
        </h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    </div>
  );
}
