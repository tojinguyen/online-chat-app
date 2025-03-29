"use client";

import { useAuth } from "@/contexts/auth/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  // Sử dụng useEffect để redirect nếu chưa đăng nhập
  useEffect(() => {
    if (!user) {
      router.push("/auth"); // Điều hướng đến trang đăng nhập nếu chưa đăng nhập
    }
  }, [user, router]);

  // Nếu chưa có người dùng, không hiển thị gì trong khi đang chuyển hướng
  if (!user) {
    return null;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome, {user}!</h1>
        <p className="text-lg">You are now logged in.</p>
      </div>
    </div>
  );
}
