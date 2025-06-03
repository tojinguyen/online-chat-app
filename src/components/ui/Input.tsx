import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helpText?: string;
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
      helpText,
      ...props
    },
    ref
  ) => {
    const inputBaseStyle =
      "rounded-lg shadow-input border-2 border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-400 focus:ring-opacity-30 text-slate-800 placeholder-slate-400 py-2.5 transition-all duration-200 ease-in-out";
    const inputSize =
      leftIcon && rightIcon
        ? "px-10"
        : leftIcon
        ? "pl-10 pr-3"
        : rightIcon
        ? "pl-3 pr-10"
        : "px-3";
    const errorStyle = error
      ? "border-red-400 focus:border-red-500 focus:ring-red-400 focus:ring-opacity-30"
      : "";
    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <div className={`${widthStyle} mb-4`}>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`${inputBaseStyle} ${inputSize} ${errorStyle} ${widthStyle} ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
              {rightIcon}
            </div>
          )}
        </div>
        {helpText && !error && (
          <p className="mt-1.5 text-sm text-slate-500">{helpText}</p>
        )}
        {error && (
          <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
