import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'blue' | 'purple' | 'emerald' | 'amber' | 'slate';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  size = 'md',
  className = ''
}) => {
  const variantStyles = {
    cyan: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/50 shadow-[0_0_10px_rgba(6,182,212,0.15)]',
    blue: 'bg-blue-950/80 text-blue-300 border-blue-800/50 shadow-[0_0_10px_rgba(59,130,246,0.15)]',
    purple: 'bg-purple-950/80 text-purple-300 border-purple-800/50 shadow-[0_0_10px_rgba(168,85,247,0.15)]',
    emerald: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50 shadow-[0_0_10px_rgba(16,185,129,0.15)]',
    amber: 'bg-amber-950/80 text-amber-300 border-amber-800/50 shadow-[0_0_10px_rgba(245,158,11,0.15)]',
    slate: 'bg-slate-800/80 text-slate-300 border-slate-700/50'
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md font-mono ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
};
