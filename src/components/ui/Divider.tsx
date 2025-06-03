import { LabelHTMLAttributes } from "react";

interface DividerProps extends LabelHTMLAttributes<HTMLDivElement> {
  text?: string;
  variant?: "light" | "dark";
}

export const Divider = ({
  text,
  variant = "light",
  className = "",
  ...props
}: DividerProps) => {
  const variantClasses = {
    light: "bg-slate-200",
    dark: "bg-slate-300",
  };

  if (!text) {
    return (
      <div
        className={`h-px ${variantClasses[variant]} w-full my-5 ${className}`}
        {...props}
      />
    );
  }

  return (
    <div className={`relative w-full my-6 ${className}`} {...props}>
      <div className="absolute inset-0 flex items-center">
        <div className={`w-full h-px ${variantClasses[variant]}`}></div>
      </div>
      <div className="relative flex justify-center">
        <span className="px-4 text-sm font-medium text-slate-500 bg-white">
          {text}
        </span>
      </div>
    </div>
  );
};
