import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  isLargeText: boolean;
  isHighContrast: boolean;
  isAudioMode: boolean;
  isSpeaking: boolean;
  toggleLargeText: () => void;
  toggleHighContrast: () => void;
  toggleAudioMode: () => void;
  speakText: (text: string, langCode?: string) => void;
  stopSpeaking: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLargeText, setIsLargeText] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isAudioMode, setIsAudioMode] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (isLargeText) {
      document.body.classList.add('mode-large-text');
    } else {
      document.body.classList.remove('mode-large-text');
    }
  }, [isLargeText]);

  useEffect(() => {
    if (isHighContrast) {
      document.body.classList.add('mode-high-contrast');
    } else {
      document.body.classList.remove('mode-high-contrast');
    }
  }, [isHighContrast]);

  const toggleLargeText = () => setIsLargeText(prev => !prev);
  const toggleHighContrast = () => setIsHighContrast(prev => !prev);
  const toggleAudioMode = () => {
    setIsAudioMode(prev => {
      if (prev) {
        stopSpeaking();
      }
      return !prev;
    });
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const speakText = (text: string, langCode: string = 'en') => {
    if (!isAudioMode) return;
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Map language code to BCP 47
    const langMap: Record<string, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      mr: 'mr-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      bn: 'bn-IN'
    };

    utterance.lang = langMap[langCode] || 'en-IN';
    utterance.rate = 0.95; // slightly slower for clinical clarity

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        isLargeText,
        isHighContrast,
        isAudioMode,
        isSpeaking,
        toggleLargeText,
        toggleHighContrast,
        toggleAudioMode,
        speakText,
        stopSpeaking
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
