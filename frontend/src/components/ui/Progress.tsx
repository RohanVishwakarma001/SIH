import React from 'react';

interface ProgressProps {
  value: number; // 0 to 100
  className?: string;
  color?: 'green' | 'urgent' | 'amber';
  size?: 'sm' | 'md' | 'lg';
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  className = '',
  color = 'green',
  size = 'md'
}) => {
  const clamped = Math.min(Math.max(value, 0), 100);

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  const colorStyles = {
    green: 'bg-med-green shadow-glow-green-sm',
    urgent: 'bg-med-urgent shadow-glow-urgent',
    amber: 'bg-amber-400'
  };

  return (
    <div className={`w-full bg-surface-elevated rounded-full overflow-hidden border border-border/50 ${sizeStyles[size]} ${className}`}>
      <div
        className={`h-full transition-all duration-300 rounded-full ${colorStyles[color]}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};
