import React from 'react';
import { clsx } from 'clsx';

interface VoiceWaveformProps {
  isListening?: boolean;
  isAiProcessing?: boolean;
  isSpeaking?: boolean;
  className?: string;
  barCount?: number;
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
  isListening = false,
  isAiProcessing = false,
  isSpeaking = false,
  className = '',
  barCount = 18
}) => {
  const isActive = isListening || isSpeaking;

  return (
    <div className={clsx('flex items-center justify-center gap-1.5 h-14 px-4 py-2 bg-surface/80 rounded-xl border border-border/80 backdrop-blur-sm', className)}>
      {Array.from({ length: barCount }).map((_, i) => {
        // Compute pseudo-random organic height variation
        const minHeight = 6;
        const animationDelay = (i * 0.08) % 0.8;
        const animationClass = `wave-animation-${(i % 7) + 1}`;

        return (
          <span
            key={i}
            className={clsx(
              'w-1 rounded-full transition-all duration-150',
              isActive
                ? clsx('bg-med-green shadow-glow-green-sm', animationClass)
                : isAiProcessing
                ? 'bg-med-green/40 h-4 animate-pulse'
                : 'bg-med-text-muted/40 h-2'
            )}
            style={{
              animationDelay: `${animationDelay}s`,
              minHeight: `${minHeight}px`
            }}
          />
        );
      })}
    </div>
  );
};
