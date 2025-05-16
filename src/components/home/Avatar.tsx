import Image from "next/image";

interface AvatarProps {
  name: string;
  avatarUrl?: string | null;
}

export default function Avatar({ name, avatarUrl }: AvatarProps) {
  if (avatarUrl && avatarUrl !== "" && !avatarUrl.includes("null")) {
    return (
      <Image
        src={avatarUrl}
        alt={`${name}'s avatar`}
        width={40}
        height={40}
        className="w-full h-full object-cover rounded-full"
      />
    );
  } else {
    // Avatar placeholder with gradient background
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }
}
