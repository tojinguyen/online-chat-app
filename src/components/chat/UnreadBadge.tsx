"use client";

interface UnreadBadgeProps {
  count: number;
}

export const UnreadBadge = ({ count }: UnreadBadgeProps) => {
  if (count <= 0) return null;

  return (
    <div className="bg-primary-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] flex items-center justify-center">
      {count > 99 ? "99+" : count}
    </div>
  );
};
