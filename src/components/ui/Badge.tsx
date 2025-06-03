import { HTMLAttributes, ReactNode } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
}

export const Badge = ({
  children,
  variant = "primary",
  size = "md",
  rounded = false,
  className = "",
  ...props
}: BadgeProps) => {
  const variantStyles = {
    primary: "bg-primary-100 text-primary-800",
    secondary: "bg-slate-100 text-slate-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    error: "bg-red-100 text-red-800",
    info: "bg-sky-100 text-sky-800",
  };

  const sizeStyles = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "text-base px-3 py-1",
  };

  const roundedStyle = rounded ? "rounded-full" : "rounded-md";

  return (
    <span
      className={`inline-flex items-center font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${roundedStyle} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
