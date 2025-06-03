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
    <div className="flex min-h-screen">
      {/* Left side with illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 p-12 flex-col justify-between">
        <div className="animate-fade-in">
          <div className="text-white text-3xl font-bold">GoChat</div>
          <p className="text-primary-100 mt-2 text-lg">
            Connect with friends and the world around you.
          </p>
        </div>
        <div className="relative h-96 animate-pulse-slow">
          <Image
            src="/chat-illustration.png"
            alt="Chat Illustration"
            fill
            className="object-contain drop-shadow-xl"
          />
        </div>
        <div className="text-primary-200 text-sm">
          © {new Date().getFullYear()} GoChat. All rights reserved.
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md animate-slide-up">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
            {subtitle && (
              <p className="mt-3 text-slate-500 text-lg">{subtitle}</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-card p-8">{children}</div>

          {linkText && linkHref && (
            <div className="text-center mt-6">
              <Link
                href={linkHref}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
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
