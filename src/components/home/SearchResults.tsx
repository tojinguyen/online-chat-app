import { UserItem } from "@/services/profileService";
import Avatar from "./Avatar";

interface SearchResultsProps {
  searchQuery: string;
  searchResults: UserItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  searching: boolean;
  onClearSearch: () => void;
  onPageChange: (page: number) => void;
}

export default function SearchResults({
  searchQuery,
  searchResults,
  totalCount,
  currentPage,
  totalPages,
  searching,
  onClearSearch,
  onPageChange,
}: SearchResultsProps) {
  if (!searchQuery) return null;

  return (
    <div className="p-4 border-b border-gray-200 bg-white max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-800 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-indigo-500 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
          Search Results{" "}
          {totalCount > 0 && (
            <span className="text-indigo-500 ml-1">({totalCount})</span>
          )}
        </h3>
        {searchQuery.length > 0 && (
          <button
            onClick={onClearSearch}
            className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {searching ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent mb-3" />
          <p className="text-gray-600 font-medium">Searching...</p>
        </div>
      ) : (
        <>
          {searchResults.length > 0 ? (
            <>
              <ul className="space-y-2 mb-4">
                {searchResults.map((result) => (
                  <li
                    key={result.id}
                    className="flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 hover:shadow-sm"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm">
                      <Avatar
                        name={result.name}
                        avatarUrl={result.avatar_url}
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-800">
                          {result.name}
                        </span>
                        <span className="ml-2 px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-md">
                          User
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          ID: {result.id.substring(0, 8)}
                        </span>
                        <div className="flex space-x-1">
                          <button className="bg-white border border-gray-200 hover:border-gray-300 text-gray-600 text-xs py-1 px-2 rounded-md transition-colors flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                            </svg>
                            Message
                          </button>
                          <button className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs py-1 px-2 rounded-md transition-colors flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                            </svg>
                            Add Friend
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-2">
                  <p className="text-xs text-gray-500">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * 10 + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * 10, totalCount)}
                    </span>{" "}
                    of <span className="font-medium">{totalCount}</span> results
                  </p>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => onPageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`p-1.5 rounded-md text-sm font-medium transition-colors ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <span className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-700 font-medium rounded-md">
                      {currentPage}
                    </span>
                    <button
                      onClick={() => onPageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`p-1.5 rounded-md text-sm font-medium transition-colors ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">
                No users found matching &quot;{searchQuery}&quot;
              </p>
              <p className="text-gray-500 text-sm mt-1 mb-3">
                Try a different search term
              </p>
              <button
                onClick={onClearSearch}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
              >
                Clear search
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
