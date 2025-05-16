import { useAuth } from "@/contexts/auth/AuthContext";
import Image from "next/image";

interface UserProfileHeaderProps {
  onLogout: () => void;
}

export default function UserProfileHeader({
  onLogout,
}: UserProfileHeaderProps) {
  const { user, userDetails } = useAuth();

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
          {userDetails?.avatarUrl ? (
            <Image
              src={userDetails.avatarUrl}
              alt="User avatar"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white text-indigo-600 font-bold">
              {(userDetails?.fullName || user || "?").charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <span className="ml-2 font-bold text-lg text-black">
          {userDetails?.fullName || user || "User"}
        </span>
      </div>
      <button
        onClick={onLogout}
        className="text-white hover:text-gray-200 transition-colors"
        title="Logout"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      </button>
    </div>
  );
}
