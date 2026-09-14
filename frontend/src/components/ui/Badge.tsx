import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'normal' | 'attention' | 'urgent' | 'green' | 'neutral' | 'ayush';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'neutral',
  size = 'md',
  dot = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full border leading-none tracking-wide select-none';

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  };

  const variantStyles = {
    normal: 'bg-surface-elevated text-med-text-secondary border-border',
    attention: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    urgent: 'bg-red-500/15 text-red-400 border-red-500/40 font-semibold',
    green: 'bg-med-green/10 text-med-green border-med-green/30 font-medium',
    neutral: 'bg-surface-elevated text-med-text-muted border-border',
    ayush: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  };

  const dotColors = {
    normal: 'bg-med-text-muted',
    attention: 'bg-amber-400',
    urgent: 'bg-red-500 animate-pulse',
    green: 'bg-med-green',
    neutral: 'bg-med-text-muted',
    ayush: 'bg-emerald-400',
  };

  return (
    <span
      className={twMerge(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {children}
    </span>
  );
};
