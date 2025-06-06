"use client";

export default function DashboardPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 overflow-y-auto h-screen">
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  );
}
