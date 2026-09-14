import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'kiosk-lg' | 'kiosk-choice';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isActive?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  isActive = false,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-med-green/50 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 h-8 gap-1.5',
    md: 'text-sm px-4 py-2 h-10 gap-2',
    lg: 'text-base px-6 py-2.5 h-12 gap-2.5',
    xl: 'text-lg px-8 py-3.5 h-14 gap-3 min-h-[56px]', // Touch target > 48px
  };

  const variantStyles = {
    primary: 'bg-med-green text-background font-semibold hover:bg-med-green-secondary shadow-glow-green-sm active:bg-med-green',
    secondary: 'bg-surface-elevated text-med-text-primary hover:bg-surface-hover border border-border',
    outline: 'border border-border text-med-text-primary hover:bg-surface-elevated hover:border-med-green/50',
    ghost: 'text-med-text-secondary hover:text-med-text-primary hover:bg-surface-elevated',
    danger: 'bg-med-urgent text-white font-semibold hover:bg-med-urgent-dark shadow-glow-urgent',
    'kiosk-lg': 'bg-surface-elevated border-2 border-border hover:border-med-green text-med-text-primary font-semibold text-lg p-5 rounded-xl justify-start text-left hover:bg-surface-hover shadow-surface min-h-[64px]',
    'kiosk-choice': clsx(
      'border-2 text-left p-4 rounded-xl transition-all duration-200 justify-start w-full min-h-[56px]',
      isActive 
        ? 'border-med-green bg-surface-elevated shadow-glow-green-sm text-med-green-soft' 
        : 'border-border bg-surface hover:border-med-green/50 text-med-text-primary hover:bg-surface-elevated'
    )
  };

  return (
    <button
      className={twMerge(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      <span className="truncate">{children}</span>
      {rightIcon && !isLoading && <span className="shrink-0 ml-auto">{rightIcon}</span>}
    </button>
  );
};
