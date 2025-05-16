import React from "react";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionButton?: React.ReactNode;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionButton,
}: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-10 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-gray-700 font-medium text-xl mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mb-4">{description}</p>
      {actionButton}
    </div>
  );
}
