import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  color?: string;
  className?: string;
}

export default function Badge({ children, color, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={color ? { backgroundColor: `${color}15`, color: color } : {}}
    >
      {children}
    </span>
  );
}
