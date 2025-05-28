import React from "react";
import Image from "next/image";

interface AvatarProps {
  name: string;
  avatarUrl?: string;
}

const Avatar: React.FC<AvatarProps> = ({ name, avatarUrl }) => {
  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate a consistent background color based on the name
  const getBackgroundColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    const index = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name}
        width={32}
        height={32}
        className="rounded-full object-cover"
      />
    );
  }

  return (
    <div
      className={`${getBackgroundColor(
        name
      )} w-full h-full rounded-full flex items-center justify-center text-white font-medium text-sm`}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar; 