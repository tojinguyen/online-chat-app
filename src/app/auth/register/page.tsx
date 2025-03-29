"use client";

import AuthForm from "@/app/components/auth/AuthForm";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();

  const handleRegister = (email: string, password: string) => {
    login(email, password); // Giả sử đăng ký thành công và tự động đăng nhập
    router.push("/"); // Điều hướng đến trang chính
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
        <AuthForm onSubmit={handleRegister} buttonText="Register" />
      </div>
    </div>
  );
}
