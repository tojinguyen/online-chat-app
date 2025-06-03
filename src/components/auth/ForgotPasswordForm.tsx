"use client";

// filepath: d:\WEB\PROJECTS\online-chat-app\src\components\auth\ForgotPasswordForm.tsx
import { AUTH_CONSTANTS } from "@/constants";
import { authService } from "@/services/auth-service";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Alert, Button, Input } from "../ui";

export const ForgotPasswordForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("toainguyenjob@gmail.com"); // Default email
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate
    if (!email) {
      setError("Email is required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(AUTH_CONSTANTS.ERROR_MESSAGES.INVALID_EMAIL);
      return;
    }
    try {
      setIsLoading(true);

      // Call the forgot password service
      const response = await authService.forgotPassword({ email });

      if (response.success) {
        setSuccess(`Password reset instructions have been sent to ${email}`);
      } else {
        setError(
          response.message ||
            "Failed to send reset instructions. Please try again."
        );
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setError("Failed to send reset instructions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess(null)}
        />
      )}{" "}
      <div className="text-sm text-gray-600 mb-4">
        Enter your email address and we&apos;ll send you instructions to reset
        your password.
      </div>
      <Input
        label="Email"
        type="email"
        id="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
        leftIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
            />
          </svg>
        }
      />
      <Button type="submit" fullWidth isLoading={isLoading}>
        Send Reset Instructions
      </Button>
      <Button
        type="button"
        variant="ghost"
        fullWidth
        onClick={() => router.push(AUTH_CONSTANTS.ROUTES.LOGIN)}
      >
        Back to Login
      </Button>
    </form>
  );
};
