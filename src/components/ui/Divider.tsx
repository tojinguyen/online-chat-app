import { LabelHTMLAttributes } from "react";

interface DividerProps extends LabelHTMLAttributes<HTMLDivElement> {
  text?: string;
}

export const Divider = ({ text, className = "", ...props }: DividerProps) => {
  if (!text) {
    return (
      <div className={`h-px bg-gray-300 w-full my-4 ${className}`} {...props} />
    );
  }

  return (
    <div className={`relative w-full my-4 ${className}`} {...props}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-px bg-gray-300"></div>
      </div>
      <div className="relative flex justify-center">
        <span className="px-4 text-sm text-gray-500 bg-white">{text}</span>
      </div>
    </div>
  );
};
