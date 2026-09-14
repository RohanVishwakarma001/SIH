import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glow' | 'urgent';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  interactive = false,
  ...props
}) => {
  const baseStyles = 'rounded-xl border transition-all duration-200';

  const variantStyles = {
    default: 'bg-surface border-border text-med-text-primary',
    elevated: 'bg-surface-elevated border-border shadow-surface text-med-text-primary',
    glow: 'bg-surface-elevated border-border hover:border-med-green/50 shadow-glow-green-sm text-med-text-primary',
    urgent: 'bg-surface border-med-urgent/60 shadow-glow-urgent text-med-text-primary',
  };

  const interactiveStyles = interactive ? 'hover:border-med-green/60 hover:bg-surface-hover cursor-pointer active:scale-[0.99]' : '';

  return (
    <div
      className={twMerge(
        baseStyles,
        variantStyles[variant],
        interactiveStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
