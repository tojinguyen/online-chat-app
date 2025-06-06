"use client";

interface TypingIndicatorProps {
  userName?: string;
}

export const TypingIndicator = ({ userName }: TypingIndicatorProps) => {
  return (
    <div className="flex items-center text-xs text-slate-500 p-2">
      <div className="flex space-x-1 mr-2">
        <div
          className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
      {userName ? `${userName} is typing...` : "Someone is typing..."}
    </div>
  );
};
