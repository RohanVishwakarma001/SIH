import React, { useState, useEffect } from 'react';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  Play, 
  Pause, 
  Sparkles, 
  Hand, 
  Volume2, 
  HelpCircle,
  AlertTriangle,
  Activity,
  Heart
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

interface GestureStep {
  label: string;
  hindiLabel: string;
  description: string;
  iconType: 'namaste' | 'chest' | 'heart' | 'medicine' | 'emergency' | 'doctor';
}

const GESTURE_DICTIONARY: Record<string, GestureStep[]> = {
  welcome: [
    { label: 'Welcome / Namaste', hindiLabel: 'नमस्ते / स्वागत है', description: 'Hands pressed together at chest level with gentle bow', iconType: 'namaste' },
    { label: 'AI Healthcare Kiosk', hindiLabel: 'स्वास्थ्य कियोस्क', description: 'Index and middle fingers tap chest then open outwards', iconType: 'doctor' }
  ],
  chest_pain: [
    { label: 'Chest / Heart', hindiLabel: 'छाती / हृदय', description: 'Open right palm touches left substernal chest area', iconType: 'heart' },
    { label: 'Pain / Discomfort', hindiLabel: 'दर्द / भारीपन', description: 'Fingers clench into loose fist over chest with grimace expression', iconType: 'chest' }
  ],
  emergency: [
    { label: 'Alert / Emergency', hindiLabel: 'आपातकाल / तत्काल सहायता', description: 'Both hands wave urgently with wide attentive eyes', iconType: 'emergency' },
    { label: 'Doctor / Nurse Called', hindiLabel: 'डॉक्टर / नर्स', description: 'Thumb touches radial artery pulse point on wrist', iconType: 'doctor' }
  ],
  medications: [
    { label: 'Medicine / Tablet', hindiLabel: 'दवाई / गोली', description: 'Right thumb & index simulate placing tablet on tongue', iconType: 'medicine' },
    { label: 'Prescription / Scan', hindiLabel: 'पर्चा / रिकॉर्ड', description: 'Flat palms mimic holding and reading a medical paper', iconType: 'doctor' }
  ]
};

export const SignLanguageAvatar: React.FC = () => {
  const { isSignAvatarOpen, toggleSignAvatar, avatarSpeechText } = useAccessibility();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeFrame, setActiveFrame] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>('welcome');

  // Detect context from current speech or question text
  useEffect(() => {
    const text = (avatarSpeechText || '').toLowerCase();
    if (text.includes('chest') || text.includes('सीने') || text.includes('दर्द') || text.includes('pain')) {
      setActiveCategory('chest_pain');
    } else if (text.includes('urgent') || text.includes('emergency') || text.includes('गंभीर') || text.includes('चेतावनी')) {
      setActiveCategory('emergency');
    } else if (text.includes('medicine') || text.includes('दवाई') || text.includes('पर्चा') || text.includes('document')) {
      setActiveCategory('medications');
    } else {
      setActiveCategory('welcome');
    }
  }, [avatarSpeechText]);

  // Frame animation timer for gestures
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveFrame(prev => (prev + 1) % 4);
    }, 1100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!isSignAvatarOpen) {
    return null;
  }

  const currentGestures = GESTURE_DICTIONARY[activeCategory] || GESTURE_DICTIONARY.welcome;
  const currentStep = currentGestures[activeFrame % currentGestures.length];

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 shadow-2xl rounded-2xl border-2 border-med-green/40 bg-surface-elevated text-med-text-primary overflow-hidden backdrop-blur-xl ${
        isMinimized ? 'w-64 h-16' : 'w-80 sm:w-96'
      }`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-surface border-b border-border text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-med-green animate-pulse" />
          <span className="font-bold flex items-center gap-1.5 text-med-green">
            <Hand className="w-3.5 h-3.5" />
            ISL Sign Avatar (सांकेतिक भाषा)
          </span>
        </div>
        <div className="flex items-center gap-1 text-med-text-muted">
          <button 
            onClick={() => setIsMinimized(prev => !prev)}
            className="p-1 hover:text-med-text-primary hover:bg-surface-elevated rounded"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
          <button 
            onClick={toggleSignAvatar}
            className="p-1 hover:text-red-400 hover:bg-surface-elevated rounded"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="p-4 space-y-3">
          {/* Animated Avatar Stage */}
          <div className="relative w-full h-44 rounded-xl bg-gradient-to-b from-[#0b1311] to-[#040807] border border-med-green/20 flex flex-col items-center justify-center overflow-hidden">
            {/* Ambient medical glow */}
            <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />

            {/* SVG Animated Sign Language Avatar */}
            <svg viewBox="0 0 200 180" className="w-40 h-40 drop-shadow-[0_0_15px_rgba(53,208,127,0.3)]">
              <defs>
                <linearGradient id="avatarSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffdbac" />
                  <stop offset="100%" stopColor="#e0ac69" />
                </linearGradient>
                <linearGradient id="avatarCoat" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#35D07F" />
                  <stop offset="100%" stopColor="#1E824C" />
                </linearGradient>
              </defs>

              {/* Head & Face */}
              <circle cx="100" cy="45" r="24" fill="url(#avatarSkin)" />
              {/* Hair */}
              <path d="M 76 42 Q 100 20 124 42 Q 100 32 76 42 Z" fill="#2d3436" />
              {/* Eyes */}
              <circle cx="92" cy="44" r="2.5" fill="#2d3436" />
              <circle cx="108" cy="44" r="2.5" fill="#2d3436" />
              {/* Kind Expression / Mouth */}
              <path d="M 94 56 Q 100 60 106 56" stroke="#c0392b" strokeWidth="2" fill="none" strokeLinecap="round" />

              {/* Torso / Clinical Apron */}
              <path d="M 70 78 L 130 78 L 140 160 L 60 160 Z" fill="url(#avatarCoat)" />
              {/* Stethoscope */}
              <path d="M 85 78 Q 100 115 115 78" stroke="#ffffff" strokeWidth="2.5" fill="none" />
              <circle cx="100" cy="115" r="5" fill="#dfe6e9" />

              {/* Left & Right Arms - Keyframe Morphing Hand Gestures */}
              {activeFrame % 2 === 0 ? (
                // Pose A: Namaste / Center Chest Hand Sign
                <g className="transition-all duration-500">
                  <path d="M 70 85 Q 85 110 95 105" stroke="url(#avatarSkin)" strokeWidth="12" strokeLinecap="round" fill="none" />
                  <path d="M 130 85 Q 115 110 105 105" stroke="url(#avatarSkin)" strokeWidth="12" strokeLinecap="round" fill="none" />
                  <circle cx="100" cy="105" r="7" fill="#ffdbac" />
                </g>
              ) : (
                // Pose B: Outward Explanatory ISL Gesture
                <g className="transition-all duration-500">
                  <path d="M 70 85 Q 55 115 48 100" stroke="url(#avatarSkin)" strokeWidth="12" strokeLinecap="round" fill="none" />
                  <path d="M 130 85 Q 145 115 152 100" stroke="url(#avatarSkin)" strokeWidth="12" strokeLinecap="round" fill="none" />
                  <circle cx="46" cy="98" r="7" fill="#ffdbac" />
                  <circle cx="154" cy="98" r="7" fill="#ffdbac" />
                </g>
              )}
            </svg>

            {/* Gesture Badge overlay */}
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-med-green/20 border border-med-green/40 text-[10px] text-med-green font-bold flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              Indian Sign Language (ISL)
            </div>

            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 px-2 py-1 rounded-md text-[10px]">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="hover:text-med-green"
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
              <span className="text-med-text-muted font-mono">{isPlaying ? 'Active' : 'Paused'}</span>
            </div>
          </div>

          {/* Synchronized Subtitles & Meaning */}
          <div className="p-2.5 rounded-xl bg-surface border border-border space-y-1 text-xs">
            <div className="font-bold text-med-green flex items-center justify-between">
              <span>{currentStep.label}</span>
              <span className="text-[10px] text-med-text-muted font-normal">Step {(activeFrame % currentGestures.length) + 1} of {currentGestures.length}</span>
            </div>
            <div className="font-semibold text-med-text-primary text-[11px]">
              {currentStep.hindiLabel}
            </div>
            <p className="text-[11px] text-med-text-secondary leading-snug">
              {currentStep.description}
            </p>
          </div>

          {/* Quick Sign Category Switcher */}
          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto text-[10px]">
            <button
              onClick={() => setActiveCategory('welcome')}
              className={`px-2 py-1 rounded-md border font-semibold shrink-0 transition-all ${
                activeCategory === 'welcome' 
                  ? 'bg-med-green/20 text-med-green border-med-green/40' 
                  : 'bg-surface text-med-text-secondary border-border hover:bg-surface-elevated'
              }`}
            >
              नमस्ते Welcome
            </button>
            <button
              onClick={() => setActiveCategory('chest_pain')}
              className={`px-2 py-1 rounded-md border font-semibold shrink-0 transition-all ${
                activeCategory === 'chest_pain' 
                  ? 'bg-med-green/20 text-med-green border-med-green/40' 
                  : 'bg-surface text-med-text-secondary border-border hover:bg-surface-elevated'
              }`}
            >
              दर्द Pain
            </button>
            <button
              onClick={() => setActiveCategory('medications')}
              className={`px-2 py-1 rounded-md border font-semibold shrink-0 transition-all ${
                activeCategory === 'medications' 
                  ? 'bg-med-green/20 text-med-green border-med-green/40' 
                  : 'bg-surface text-med-text-secondary border-border hover:bg-surface-elevated'
              }`}
            >
              दवाई Rx
            </button>
            <button
              onClick={() => setActiveCategory('emergency')}
              className={`px-2 py-1 rounded-md border font-semibold shrink-0 transition-all ${
                activeCategory === 'emergency' 
                  ? 'bg-red-500/20 text-red-400 border-red-500/40' 
                  : 'bg-surface text-med-text-secondary border-border hover:bg-surface-elevated'
              }`}
            >
              आपातकाल Emergency
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
