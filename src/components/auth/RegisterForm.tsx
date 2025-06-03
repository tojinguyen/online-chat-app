"use client";

// filepath: d:\WEB\PROJECTS\online-chat-app\src\components\auth\RegisterForm.tsx
import { AUTH_CONSTANTS } from "@/constants";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { Alert, Button, Divider, Input, PasswordInput } from "../ui";

export const RegisterForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible((prev) => !prev);
  };

  const validateForm = (): boolean => {
    // Name validation
    if (
      !formData.name ||
      formData.name.length < AUTH_CONSTANTS.FORM_VALIDATION.NAME_MIN_LENGTH
    ) {
      setError(AUTH_CONSTANTS.ERROR_MESSAGES.NAME_TOO_SHORT);
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      setError(AUTH_CONSTANTS.ERROR_MESSAGES.INVALID_EMAIL);
      return false;
    }

    // Password validation
    if (
      !formData.password ||
      formData.password.length <
        AUTH_CONSTANTS.FORM_VALIDATION.PASSWORD_MIN_LENGTH
    ) {
      setError(AUTH_CONSTANTS.ERROR_MESSAGES.PASSWORD_TOO_SHORT);
      return false;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      setError(AUTH_CONSTANTS.ERROR_MESSAGES.PASSWORD_MISMATCH);
      return false;
    }

    // Avatar validation
    if (!avatar) {
      setError("Please upload an avatar image");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true); // Here we would normally call the register service
      // For now, just redirect to verification page after a delay to simulate registration
      setTimeout(() => {
        router.push("/verify-email");
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {/* Avatar Upload */}
      <div className="flex flex-col items-center mb-4">
        <div className="relative w-24 h-24 mb-2">
          {" "}
          {avatarPreview ? (
            <Image
              src={avatarPreview}
              alt="Avatar Preview"
              className="rounded-full object-cover border-2 border-blue-500"
              width={96}
              height={96}
              priority
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </div>
          )}
        </div>
        <label
          htmlFor="avatar-upload"
          className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
        >
          {avatarPreview ? "Change avatar" : "Upload avatar"}
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </label>
      </div>

      <Input
        label="Full Name"
        type="text"
        id="name"
        name="name"
        placeholder="Enter your full name"
        value={formData.name}
        onChange={handleChange}
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
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        }
      />

      <Input
        label="Email"
        type="email"
        id="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
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

      <PasswordInput
        label="Password"
        id="password"
        name="password"
        placeholder="Create a password"
        value={formData.password}
        onChange={handleChange}
        fullWidth
        required
        togglePassword={togglePasswordVisibility}
        isPasswordVisible={isPasswordVisible}
      />

      <PasswordInput
        label="Confirm Password"
        id="confirmPassword"
        name="confirmPassword"
        placeholder="Confirm your password"
        value={formData.confirmPassword}
        onChange={handleChange}
        fullWidth
        required
        togglePassword={toggleConfirmPasswordVisibility}
        isPasswordVisible={isConfirmPasswordVisible}
      />

      <Button type="submit" fullWidth isLoading={isLoading}>
        Create Account
      </Button>

      <Divider text="OR" />

      <Button
        type="button"
        variant="outline"
        fullWidth
        onClick={() => {}}
        leftIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="currentColor"
            className="bi bi-google"
            viewBox="0 0 16 16"
          >
            <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
          </svg>
        }
      >
        Sign up with Google
      </Button>
    </form>
  );
};
