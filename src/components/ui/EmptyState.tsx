import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ 
  icon: Icon, 
  title, 
  message, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-4">
        <Icon size={40} />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="text-slate-500 max-w-xs mt-2">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn btn-primary mt-6"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
