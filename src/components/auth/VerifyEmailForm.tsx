"use client";

// filepath: d:\WEB\PROJECTS\online-chat-app\src\components\auth\VerifyEmailForm.tsx
import { AUTH_CONSTANTS } from "@/constants";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Alert, Button } from "../ui";

export const VerifyEmailForm = () => {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace - move to previous input
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split("");
      setCode(newCode);

      // Focus the last input
      const lastInput = document.getElementById("code-5");
      if (lastInput) {
        (lastInput as HTMLInputElement).focus();
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const verificationCode = code.join("");

    // Validate
    if (verificationCode.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }
    try {
      setIsLoading(true);

      // Here we would normally call the verification service
      // For example: await authService.verifyRegistration({ code: verificationCode });

      // For now, just redirect to login after a delay
      setTimeout(() => {
        router.push(AUTH_CONSTANTS.ROUTES.LOGIN);
      }, 1500);
    } catch (error) {
      console.error("Verification error:", error);
      setError("Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}{" "}
      <div className="text-sm text-gray-600 mb-4">
        We&apos;ve sent a 6-digit verification code to your email. Enter the
        code below to verify your account.
      </div>
      <div className="flex justify-center space-x-2 sm:space-x-4">
        {code.map((digit, index) => (
          <input
            key={index}
            id={`code-${index}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-semibold border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        ))}
      </div>
      <Button type="submit" fullWidth isLoading={isLoading}>
        Verify Email
      </Button>
      <div className="text-center">
        <button
          type="button"
          className="text-blue-600 hover:text-blue-800 text-sm"
          onClick={() => {}}
        >
          Didn&apos;t receive a code? Resend
        </button>
      </div>
    </form>
  );
};
