import Image from "next/image";
import { HTMLAttributes } from "react";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt: string;
  size?: AvatarSize;
  status?: "online" | "offline" | "away" | "busy";
  square?: boolean;
}

export const Avatar = ({
  src,
  alt,
  size = "md",
  status,
  square = false,
  className = "",
  ...props
}: AvatarProps) => {
  const sizeStyles: Record<AvatarSize, string> = {
    xs: "h-8 w-8",
    sm: "h-10 w-10",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-20 w-20",
  };

  const statusSizeStyles: Record<AvatarSize, string> = {
    xs: "h-2 w-2",
    sm: "h-2.5 w-2.5",
    md: "h-3 w-3",
    lg: "h-4 w-4",
    xl: "h-5 w-5",
  };

  const borderRadius = square ? "rounded-md" : "rounded-full";

  const statusColors = {
    online: "bg-green-500",
    offline: "bg-slate-400",
    away: "bg-amber-500",
    busy: "bg-red-500",
  };

  const getFallbackInitials = () => {
    return alt
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div
      className={`relative inline-flex ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {src ? (
        <div className={`${sizeStyles[size]} overflow-hidden ${borderRadius}`}>
          <Image
            src={src}
            alt={alt}
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <div
          className={`${sizeStyles[size]} ${borderRadius} flex items-center justify-center bg-primary-100 text-primary-700 font-medium`}
        >
          {getFallbackInitials()}
        </div>
      )}

      {status && (
        <span
          className={`absolute bottom-0 right-0 block ${statusSizeStyles[size]} ${statusColors[status]} ${borderRadius} ring-2 ring-white`}
        />
      )}
    </div>
  );
};
