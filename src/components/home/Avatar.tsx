import Image from "next/image";

interface AvatarProps {
  name?: string;
  avatarUrl?: string | null;
}

export default function Avatar({ name, avatarUrl }: AvatarProps) {
  // Safely handle undefined/null name
  const safeName = name || "Unknown";

  if (avatarUrl && avatarUrl !== "" && !avatarUrl.includes("null")) {
    return (
      <Image
        src={avatarUrl}
        alt={`${safeName}'s avatar`}
        width={40}
        height={40}
        className="w-full h-full object-cover rounded-full"
      />
    );
  } else {
    // Avatar placeholder with gradient background
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
        {safeName.charAt(0).toUpperCase()}
      </div>
    );
  }
}
