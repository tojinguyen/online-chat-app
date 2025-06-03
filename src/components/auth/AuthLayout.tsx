import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  linkText?: string;
  linkHref?: string;
}

export const AuthLayout = ({
  children,
  title,
  subtitle,
  linkText,
  linkHref,
}: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side with illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 p-12 flex-col justify-between">
        <div>
          <div className="text-white text-3xl font-bold">GoChat</div>
          <p className="text-blue-200 mt-2">
            Connect with friends and the world around you.
          </p>
        </div>
        <div className="relative h-96">
          <Image
            src="/chat-illustration.svg"
            alt="Chat Illustration"
            fill
            className="object-contain"
          />
        </div>
        <div className="text-blue-200 text-sm">
          © {new Date().getFullYear()} GoChat. All rights reserved.
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
          </div>

          {children}

          {linkText && linkHref && (
            <div className="text-center mt-6">
              <Link
                href={linkHref}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                {linkText}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
