"use client";

import { AuthGuard } from "@/components/auth";
import { useAuthContext } from "@/context/AuthContext";
import {
  WebSocketProvider,
  useWebSocketContext,
} from "@/context/WebSocketContext";
import Link from "next/link";
import { useEffect, useState } from "react";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout } = useAuthContext();
  const { isConnected, connect } = useWebSocketContext();

  // Initialize WebSocket connection when dashboard loads
  useEffect(() => {
    console.log("Dashboard: Initializing WebSocket connection");
    connect();
  }, [connect]);

  return (
    <AuthGuard>
      <div className="h-screen flex overflow-hidden bg-slate-50">
        {/* Sidebar - fixed, no scroll */}
        <aside
          className={`${
            isSidebarOpen ? "w-64" : "w-20"
          } bg-white shadow-md transition-all duration-300 flex flex-col h-screen sticky top-0`}
        >
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center">
              <h1
                className={`font-bold text-primary-600 ${
                  isSidebarOpen ? "text-xl" : "hidden"
                }`}
              >
                GoChat
              </h1>
              {/* WebSocket connection indicator */}
              {isSidebarOpen && (
                <div className="ml-2 flex items-center">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      isConnected ? "bg-green-500" : "bg-red-500"
                    }`}
                    title={`WebSocket ${
                      isConnected ? "Connected" : "Disconnected"
                    }`}
                  />
                </div>
              )}
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 rounded-md hover:bg-slate-100 text-slate-500"
            >
              {isSidebarOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>

          <nav className="flex-1 py-4">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/dashboard"
                  className="flex items-center text-slate-700 hover:bg-primary-50 hover:text-primary-700 px-4 py-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  {isSidebarOpen && <span className="ml-3">Dashboard</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/friends"
                  className="flex items-center text-slate-700 hover:bg-primary-50 hover:text-primary-700 px-4 py-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  {isSidebarOpen && <span className="ml-3">Friends</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/chat"
                  className="flex items-center text-slate-700 hover:bg-primary-50 hover:text-primary-700 px-4 py-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                  {isSidebarOpen && <span className="ml-3">Chats</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="flex items-center text-slate-700 hover:bg-primary-50 hover:text-primary-700 px-4 py-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {isSidebarOpen && <span className="ml-3">Profile</span>}
                </Link>
              </li>
            </ul>
          </nav>

          <div className="p-4 border-t border-slate-200">
            <button
              onClick={logout}
              className="flex items-center text-slate-700 hover:text-primary-700 w-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                  clipRule="evenodd"
                />
              </svg>
              {isSidebarOpen && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </aside>

        {/* Main content - adaptive container */}
        <main className="flex-1 h-screen">{children}</main>
      </div>
    </AuthGuard>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WebSocketProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </WebSocketProvider>
  );
}
