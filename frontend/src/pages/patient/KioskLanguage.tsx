import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Languages, Volume2, ArrowRight, Check } from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { SUPPORTED_LANGUAGES } from '../../data/mockData';
import { LanguageCode } from '../../types';
import { Button } from '../../components/ui/Button';

export const KioskLanguage: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useKiosk();
  const { speakText } = useAccessibility();

  const handleLanguageClick = (langCode: LanguageCode, audioPrompt: string) => {
    setLanguage(langCode);
    speakText(audioPrompt, langCode);
  };

  const handleContinue = () => {
    navigate('/patient/login');
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-3xl mx-auto py-6 space-y-8 animate-in fade-in duration-300">
      {/* Step Indicator & Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-border text-xs font-semibold text-med-text-secondary">
          <Languages className="w-4 h-4 text-med-green" />
          <span>Step 1 of 6 • भाषा चयन</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-med-text-primary tracking-tight">
          Choose Your Language
        </h1>
        <p className="text-xl sm:text-2xl font-bold text-med-green">
          अपनी पसंदीदा भाषा चुनें
        </p>
        <p className="text-sm text-med-text-secondary">
          The entire interview, audio instructions, and questions will adapt to your choice.
        </p>
      </div>

      {/* Language Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {SUPPORTED_LANGUAGES.map(lang => {
          const isSelected = language === lang.code;

          return (
            <button
              key={lang.code}
              onClick={() => handleLanguageClick(lang.code, lang.audioPrompt)}
              className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col justify-between min-h-[110px] group ${
                isSelected
                  ? 'border-med-green bg-surface-elevated shadow-glow-green-sm scale-[1.02]'
                  : 'border-border bg-surface hover:border-med-green/50 hover:bg-surface-elevated'
              }`}
            >
              <div className="flex items-start justify-between w-full">
                <div>
                  <div className="text-2xl font-black text-med-text-primary group-hover:text-med-green transition-colors">
                    {lang.nativeName}
                  </div>
                  <div className="text-xs text-med-text-secondary font-medium mt-0.5">
                    {lang.name}
                  </div>
                </div>

                {isSelected ? (
                  <div className="w-7 h-7 rounded-full bg-med-green text-background flex items-center justify-center font-bold">
                    <Check className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-med-text-muted group-hover:text-med-green">
                    <Volume2 className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-med-text-muted mt-3">
                <Volume2 className="w-3 h-3 text-med-green" />
                <span className="truncate">{lang.audioPrompt}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Continue CTA */}
      <div className="w-full max-w-md pt-4">
        <Button
          variant="primary"
          size="xl"
          className="w-full text-lg font-bold shadow-glow-green"
          onClick={handleContinue}
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          {language === 'hi' ? 'आगे बढ़ें / Continue' : 'Continue to Check-In'}
        </Button>
      </div>
    </div>
  );
};
