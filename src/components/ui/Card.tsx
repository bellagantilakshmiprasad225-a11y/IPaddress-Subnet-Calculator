import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  glow?: 'cyan' | 'blue' | 'none';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = true,
  glow = 'none',
  className = '',
  ...props
}) => {
  const glowStyles = {
    cyan: 'hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]',
    blue: 'hover:border-blue-500/40 hover:shadow-[0_0_25px_rgba(59,130,246,0.2)]',
    none: ''
  };

  return (
    <div
      className={`glass-panel rounded-2xl p-6 relative overflow-hidden transition-all duration-300 ${
        hoverable ? 'glass-panel-hover' : ''
      } ${glowStyles[glow]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
