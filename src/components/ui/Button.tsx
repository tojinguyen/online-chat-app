import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "font-medium rounded-md focus:outline-none transition-colors duration-200 flex items-center justify-center";

  const variantStyles = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50",
    outline:
      "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50",
    link: "bg-transparent text-blue-600 hover:underline p-0 h-auto focus:ring-0",
  };

  const sizeStyles = {
    sm: "text-sm px-3 py-2",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3",
  };

  const widthStyle = fullWidth ? "w-full" : "";
  const loadingStyle = isLoading ? "opacity-70 cursor-not-allowed" : "";
  const disabledStyle = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${loadingStyle} ${disabledStyle} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
          Loading...
        </div>
      ) : (
        <div className="flex items-center justify-center">
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </div>
      )}
    </button>
  );
};
