"use client";

import { WebSocketDemo } from "@/components/demo/WebSocketDemo";
import { WebSocketProvider } from "@/context/WebSocketContext";

export default function DemoPage() {
  return (
    <WebSocketProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        <WebSocketDemo />
      </div>
    </WebSocketProvider>
  );
}
