import { InputHTMLAttributes, forwardRef } from "react";

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  togglePassword: () => void;
  isPasswordVisible: boolean;
  helpText?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label,
      error,
      fullWidth = false,
      className = "",
      togglePassword,
      isPasswordVisible,
      helpText,
      ...props
    },
    ref
  ) => {
    const inputBaseStyle =
      "rounded-lg shadow-input border-2 border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-400 focus:ring-opacity-30 text-slate-800 placeholder-slate-400 py-2.5 pr-10 pl-3 transition-all duration-200 ease-in-out";
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
          <input
            ref={ref}
            type={isPasswordVisible ? "text" : "password"}
            className={`${inputBaseStyle} ${errorStyle} ${widthStyle} ${className}`}
            {...props}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              onClick={togglePassword}
              className="text-slate-500 hover:text-slate-700 focus:outline-none focus:text-slate-700"
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            >
              {isPasswordVisible ? (
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
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
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
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              )}
            </button>
          </div>
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

PasswordInput.displayName = "PasswordInput";
