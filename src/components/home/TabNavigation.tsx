import { useRouter } from "next/navigation";

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TabNavigation({
  activeTab,
  setActiveTab,
}: TabNavigationProps) {
  const router = useRouter();

  return (
    <div className="flex border-b border-gray-200 bg-gray-50">
      <button
        className={`flex-1 py-3.5 font-semibold text-sm transition-colors flex items-center justify-center ${
          activeTab === "chats"
            ? "text-indigo-600 border-b-2 border-indigo-600 bg-white"
            : "text-gray-600 hover:text-indigo-500"
        }`}
        onClick={() => setActiveTab("chats")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1.5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
            clipRule="evenodd"
          />
        </svg>
        Chats
      </button>
      <button
        className={`flex-1 py-3.5 font-semibold text-sm transition-colors flex items-center justify-center ${
          activeTab === "friends"
            ? "text-indigo-600 border-b-2 border-indigo-600 bg-white"
            : "text-gray-600 hover:text-indigo-500"
        }`}
        onClick={() => setActiveTab("friends")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1.5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
        Friends
      </button>
      <button
        className="flex-1 py-3.5 font-semibold text-sm text-gray-600 hover:text-indigo-500 transition-colors flex items-center justify-center"
        onClick={() => router.push("/friends")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1.5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
        </svg>
        Settings
      </button>
    </div>
  );
}
