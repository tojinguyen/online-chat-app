"use client";

import { useAuth } from "@/contexts/auth/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SplashScreen() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If auth state is determined (not loading)
    if (!isLoading) {
      if (user) {
        // User is authenticated, redirect to home
        router.push("/home");
      } else {
        // User is not authenticated, redirect to login
        router.push("/auth");
      }
    }
  }, [user, isLoading, router]);

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
