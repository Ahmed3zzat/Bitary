// components/EmptyState/EmptyState.tsx
import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  actions?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  icon,
  actions,
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
      <div className="mx-auto flex flex-col items-center justify-center">
        {icon && (
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-50 mb-4">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">{description}</p>
        {actions && <div className="mt-4">{actions}</div>}
      </div>
    </div>
  );
}