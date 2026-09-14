import React from 'react';
import { clsx } from 'clsx';

interface TabItem {
  id: string;
  label: React.ReactNode;
  badge?: string | number;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  size = 'md'
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3.5 py-1.5',
    lg: 'text-base px-5 py-2.5'
  };

  return (
    <div className={clsx('flex items-center gap-1.5 p-1 bg-surface-elevated rounded-xl border border-border overflow-x-auto select-none', className)}>
      {tabs.map(tab => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'flex items-center gap-2 font-medium rounded-lg transition-all duration-150 whitespace-nowrap',
              sizeStyles[size],
              isActive
                ? 'bg-med-green text-background shadow-glow-green-sm font-semibold'
                : 'text-med-text-secondary hover:text-med-text-primary hover:bg-surface'
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={clsx(
                  'text-[11px] px-1.5 py-0.5 rounded-full font-bold',
                  isActive ? 'bg-background/20 text-background' : 'bg-surface text-med-text-muted'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
