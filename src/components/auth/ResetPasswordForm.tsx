"use client";

// filepath: d:\WEB\PROJECTS\online-chat-app\src\components\auth\ResetPasswordForm.tsx
import { AUTH_CONSTANTS } from "@/constants";
import { authService } from "@/services/auth-service";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { Alert, Button, PasswordInput } from "../ui";

export const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Use token in the resetPassword function
  const resetToken = searchParams.get("token") || "";

  const [password, setPassword] = useState("toai20102002"); // Default password
  const [confirmPassword, setConfirmPassword] = useState("toai20102002"); // Default confirm password
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    if (!password) {
      setError("Password is required");
      return;
    }

    if (password.length < AUTH_CONSTANTS.FORM_VALIDATION.PASSWORD_MIN_LENGTH) {
      setError(AUTH_CONSTANTS.ERROR_MESSAGES.PASSWORD_TOO_SHORT);
      return;
    }

    if (password !== confirmPassword) {
      setError(AUTH_CONSTANTS.ERROR_MESSAGES.PASSWORD_MISMATCH);
      return;
    }
    try {
      setIsLoading(true);

      // Call the reset password service
      const response = await authService.resetPassword({
        token: resetToken,
        password,
        confirmPassword,
      });

      if (response.success) {
        router.push(AUTH_CONSTANTS.ROUTES.LOGIN);
      } else {
        setError(
          response.message || "Failed to reset password. Please try again."
        );
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      <div className="text-sm text-gray-600 mb-4">
        Enter your new password below.
      </div>

      <PasswordInput
        label="New Password"
        id="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
        togglePassword={togglePasswordVisibility}
        isPasswordVisible={isPasswordVisible}
      />

      <PasswordInput
        label="Confirm New Password"
        id="confirmPassword"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
        required
        togglePassword={toggleConfirmPasswordVisibility}
        isPasswordVisible={isConfirmPasswordVisible}
      />

      <Button type="submit" fullWidth isLoading={isLoading}>
        Reset Password
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
