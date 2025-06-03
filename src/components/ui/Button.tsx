import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "gradient";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  rounded?: boolean;
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  rounded = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "font-medium focus:outline-none transition-all duration-200 flex items-center justify-center shadow-button";

  const variantStyles = {
    primary:
      "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50",
    secondary:
      "bg-secondary-500 text-white hover:bg-secondary-600 active:bg-secondary-700 focus:ring-2 focus:ring-secondary-400 focus:ring-opacity-50",
    outline:
      "bg-transparent border-2 border-primary-500 text-primary-600 hover:bg-primary-50 active:bg-primary-100 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-40",
    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-30 shadow-none",
    link: "bg-transparent text-primary-600 hover:text-primary-700 underline-offset-2 hover:underline p-0 h-auto focus:ring-0 shadow-none",
    gradient:
      "text-white bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 active:from-primary-800 active:to-secondary-700 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50",
  };

  const sizeStyles = {
    xs: "text-xs px-2.5 py-1.5 rounded",
    sm: "text-sm px-3 py-2 rounded-md",
    md: "text-base px-4 py-2.5 rounded-lg",
    lg: "text-lg px-6 py-3 rounded-xl",
  };

  const roundedStyle = rounded ? "rounded-full" : "";
  const widthStyle = fullWidth ? "w-full" : "";
  const loadingStyle = isLoading ? "opacity-80 cursor-not-allowed" : "";
  const disabledStyle = disabled ? "opacity-60 cursor-not-allowed" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${roundedStyle} ${widthStyle} ${loadingStyle} ${disabledStyle} ${className}`}
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
          <span>{children}</span>
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </div>
      )}
    </button>
  );
};
