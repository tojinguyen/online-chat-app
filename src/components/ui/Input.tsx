import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      fullWidth = false,
      className = "",
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const inputBaseStyle =
      "rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-400 py-2 transition duration-150 ease-in-out";
    const inputSize =
      leftIcon && rightIcon
        ? "px-10"
        : leftIcon
        ? "pl-10 pr-3"
        : rightIcon
        ? "pl-3 pr-10"
        : "px-3";
    const errorStyle = error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "";
    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <div className={`${widthStyle}`}>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`${inputBaseStyle} ${inputSize} ${errorStyle} ${widthStyle} ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
