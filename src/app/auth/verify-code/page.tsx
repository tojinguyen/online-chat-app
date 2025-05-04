"use client";

import { useAuth } from "@/contexts/auth/AuthContext";
import { verifyEmailRegister } from "@/services/authService";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyRegisterCode() {
  const router = useRouter();
  const { login } = useAuth();
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    email: "",
    password: "",
    fullName: "",
    hasAvatar: false,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    // Get registration data from session storage
    const storedData = sessionStorage.getItem("registrationData");
    if (!storedData) {
      router.push("/auth/register");
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);
      setRegistrationData(parsedData);

      // Nếu có avatar preview, lấy từ sessionStorage
      const avatarPreview = sessionStorage.getItem("avatarPreview");
      if (avatarPreview) {
        setPreviewUrl(avatarPreview);

        // Tạo file từ Blob URL (cần thêm phần xử lý này)
        // fetch(avatarPreview)
        //   .then((res) => res.blob())
        //   .then((blob) => {
        //     const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
        //     setAvatar(file);
        //   })
        //   .catch((err) => console.error("Error fetching avatar:", err));
      }
    } catch (error) {
      console.error("Failed to parse registration data:", error);
      router.push("/auth/register");
    }
  }, [router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Call verify API
      await verifyEmailRegister({
        email: registrationData.email,
        code: verificationCode,
      });

      // Login the user automatically
      await login(registrationData.email, registrationData.password);

      // Clean up session storage
      sessionStorage.removeItem("registrationData");
      sessionStorage.removeItem("avatarPreview");

      // Redirect to home
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "Failed to verify account");
      } else {
        setError("Failed to verify account");
      }
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      // Không cần gửi lại avatar trong phần resend code
      await verifyEmailRegister({
        email: registrationData.email,
        code: verificationCode,
      });

      setError("");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "Failed to resend verification code");
      } else {
        setError("Failed to resend verification code");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter the verification code sent to {registrationData.email}
          </p>
        </div>

        {previewUrl && (
          <div className="flex justify-center mt-4">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center relative">
              <Image
                src={previewUrl}
                alt="Avatar preview"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleVerify}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="verification-code" className="sr-only">
                Verification Code
              </label>
              <input
                id="verification-code"
                name="code"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center mt-2">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                "Verify Account"
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleResendCode}
            className="text-indigo-600 hover:text-indigo-500 text-sm"
          >
            Didn&apos;t receive a code? Resend
          </button>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Need to change your information?
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/auth/register"
              className="w-full flex justify-center py-2 px-4 border border-indigo-600 rounded-md shadow-sm text-sm font-medium text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
