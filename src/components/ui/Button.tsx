import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-semibold hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] border border-cyan-400/30',
    secondary: 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700/60 shadow-sm',
    outline: 'bg-slate-900/50 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/10 hover:border-cyan-400',
    danger: 'bg-rose-950/60 text-rose-300 border border-rose-800/50 hover:bg-rose-900/70',
    ghost: 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3.5 text-base rounded-xl gap-2.5 font-bold'
  };

  return (
    <button
      className={`inline-flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
