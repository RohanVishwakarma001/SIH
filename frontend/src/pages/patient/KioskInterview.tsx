import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Volume2, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Leaf,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { CLINICAL_QUESTIONS, AYUSH_PARIKSHA_QUESTIONS } from '../../data/mockData';
import { VoiceWaveform } from '../../components/ui/VoiceWaveform';
import { Button } from '../../components/ui/Button';
import { Progress } from '../../components/ui/Progress';
import { Card } from '../../components/ui/Card';

export const KioskInterview: React.FC = () => {
  const navigate = useNavigate();
  const { 
    language, 
    department, 
    activeQuestionIndex, 
    answers, 
    selectOption, 
    toggleMultiOption, 
    nextQuestion,
    prevQuestion,
    finishInterview,
    startVoiceListening,
    stopVoiceListening, 
    isListening, 
    isAiProcessing, 
    voiceTranscript,
    isRedFlagTriggered
  } = useKiosk();

  const { speakText } = useAccessibility();

  // Combine standard questions with AYUSH questions if AYUSH department selected
  const allQuestions = department === 'ayush' 
    ? [...CLINICAL_QUESTIONS, ...AYUSH_PARIKSHA_QUESTIONS]
    : CLINICAL_QUESTIONS;

  const currentQ = allQuestions[activeQuestionIndex] || allQuestions[0];
  const progressPercent = Math.round(((activeQuestionIndex + 1) / allQuestions.length) * 100);

  const nativeQuestionText = currentQ.nativeQuestion?.[language] || currentQ.question;
  const currentAnswer = answers[currentQ.id];

  // Keep state active without forced auto-navigation
  // Red flag notifications will display on-screen with explicit user choice
  const [showRedFlagBanner, setShowRedFlagBanner] = useState<boolean>(false);

  useEffect(() => {
    if (isRedFlagTriggered) {
      setShowRedFlagBanner(true);
    }
  }, [isRedFlagTriggered]);

  // Speak question aloud when step changes
  useEffect(() => {
    speakText(nativeQuestionText, language);
  }, [activeQuestionIndex, language]);

  const handleRepeatQuestion = () => {
    speakText(nativeQuestionText, language);
  };

  const handleNext = () => {
    if (activeQuestionIndex >= allQuestions.length - 1) {
      // Completed all questions, proceed to document upload
      finishInterview().catch(() => {});
      navigate('/patient/documents');
    } else {
      nextQuestion();
    }
  };

  const isCurrentAnswerValid = () => {
    if (!currentAnswer) return false;
    if (Array.isArray(currentAnswer)) return currentAnswer.length > 0;
    return true;
  };

  return (
    <div className="flex flex-col max-w-3xl w-full mx-auto py-2 sm:py-4 space-y-6 animate-in fade-in duration-300">
      {/* Top Progress & Stepper */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
          <div className="flex items-center gap-2">
            <span className="text-med-green">
              Question {activeQuestionIndex + 1} of {allQuestions.length}
            </span>
            {currentQ.isAyushOnly && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1">
                <Leaf className="w-3 h-3" /> Dashavidha Pariksha
              </span>
            )}
          </div>
          <span className="text-med-text-muted">{progressPercent}% Completed</span>
        </div>
        <Progress value={progressPercent} color="green" size="md" />
      </div>

      {/* Immediate Clinical Red Flag Notification (User-Controlled) */}
      {showRedFlagBanner && (
        <div className="p-4 rounded-xl bg-red-500/10 border-2 border-red-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-red-400">
                Critical Red Flag Symptom Detected / तत्काल ध्यान दें
              </div>
              <div className="text-xs text-med-text-secondary">
                Your response indicates symptoms that require immediate clinical priority review.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <Button
              variant="danger"
              size="sm"
              onClick={() => navigate('/patient/red-flag')}
              className="text-xs font-bold"
            >
              Go to Priority Triage
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowRedFlagBanner(false)}
              className="text-xs"
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* AI Assistant Question Card (HERO ELEMENT) */}
      <Card className="p-6 sm:p-8 bg-surface-elevated border-border shadow-surface relative overflow-hidden">
        {/* Subtle background ambient pulse */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-med-green/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start gap-4 sm:gap-5">
          {/* AI Avatar with pulse ring */}
          <div className="relative shrink-0">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
              isListening
                ? 'bg-red-500/20 text-red-400 border-red-500 shadow-glow-urgent'
                : isAiProcessing
                ? 'bg-med-green/20 text-med-green border-med-green animate-spin'
                : 'bg-med-green/10 text-med-green border-med-green/40 shadow-glow-green-sm'
            }`}>
              {isAiProcessing ? (
                <Loader2 className="w-7 h-7" />
              ) : (
                <Bot className="w-7 h-7" />
              )}
            </div>
            {isListening && (
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border border-black"></span>
              </span>
            )}
          </div>

          {/* Question Text in Selected Language + Subtext */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-med-green flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {currentQ.ayushDimension 
                  ? `Ayurvedic Dimension: ${currentQ.ayushDimension}`
                  : 'MediKiosk Clinical AI'}
              </span>

              {/* Repeat Audio Button */}
              <button
                onClick={handleRepeatQuestion}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface border border-border text-med-text-secondary hover:text-med-green hover:border-med-green/40 text-xs font-semibold transition-all"
                title="Repeat question in voice"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>सुनें / Repeat</span>
              </button>
            </div>

            {/* Native Question Headline */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-med-text-primary tracking-tight leading-snug">
              {nativeQuestionText}
            </h2>

            {/* English Secondary Translation if non-English */}
            {language !== 'en' && (
              <p className="text-xs sm:text-sm text-med-text-secondary italic">
                "{currentQ.question}"
              </p>
            )}

            <p className="text-xs text-med-text-muted pt-1">
              {currentQ.subtext}
            </p>
          </div>
        </div>

        {/* Live Voice Interaction Centerpiece */}
        <div className="mt-6 pt-5 border-t border-border/80 flex flex-col sm:flex-row items-center gap-4">
          {/* Prominent Voice Mic Button */}
          <button
            onClick={isListening ? stopVoiceListening : startVoiceListening}
            className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2.5 transition-all text-sm ${
              isListening
                ? 'bg-red-500 text-white shadow-glow-urgent'
                : 'bg-med-green text-background hover:bg-med-green-secondary shadow-glow-green-sm'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 animate-pulse" />
                <span>सुन रहा हूँ... / Stop</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>बोलकर उत्तर दें / Tap to Speak</span>
              </>
            )}
          </button>

          {/* Animated Waveform & Status */}
          <div className="flex-1 w-full flex items-center justify-center">
            <VoiceWaveform 
              isListening={isListening} 
              isAiProcessing={isAiProcessing} 
              className="w-full" 
            />
          </div>
        </div>

        {/* Real-time speech transcript or AI thinking text */}
        {(voiceTranscript || isListening || isAiProcessing) && (
          <div className="mt-3 p-3 rounded-xl bg-surface border border-med-green/30 text-xs flex items-center gap-2">
            {isAiProcessing ? (
              <span className="text-med-green font-semibold animate-pulse flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Understanding symptom correlation and clinical taxonomy...
              </span>
            ) : (
              <span className="text-med-text-primary">
                <strong className="text-med-green font-mono">Recognized: </strong>
                "{voiceTranscript || 'Listening to your voice...'}"
              </span>
            )}
          </div>
        )}
      </Card>

      {/* Touch-Based Answer Options (Large Touch Targets > 56px) */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-med-text-secondary flex items-center justify-between px-1">
          <span>Or Tap Your Answer / अथवा नीचे विकल्प स्पर्श करें:</span>
          {currentQ.inputType === 'multi_choice' && (
            <span className="text-med-green font-semibold">Multiple selection allowed</span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQ.options?.map(option => {
            const isMulti = currentQ.inputType === 'multi_choice';
            const isSelected = isMulti 
              ? Array.isArray(currentAnswer) && currentAnswer.includes(option.id)
              : currentAnswer === option.id;

            return (
              <button
                key={option.id}
                onClick={() => {
                  if (isMulti) {
                    toggleMultiOption(currentQ.id, option.id, option.isRedFlag);
                  } else {
                    selectOption(currentQ.id, option.id, option.isRedFlag);
                  }
                }}
                className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3.5 min-h-[64px] ${
                  isSelected
                    ? 'border-med-green bg-surface-elevated shadow-glow-green-sm text-med-green'
                    : option.isRedFlag
                    ? 'border-border/80 bg-surface hover:border-red-500/50 hover:bg-surface-elevated'
                    : 'border-border bg-surface hover:border-med-green/40 hover:bg-surface-elevated'
                }`}
              >
                {/* Checkbox / Radio indicator */}
                <div className={`w-5 h-5 rounded-${isMulti ? 'md' : 'full'} flex items-center justify-center shrink-0 mt-0.5 border transition-all ${
                  isSelected 
                    ? 'bg-med-green text-background border-med-green' 
                    : 'border-border bg-surface-elevated'
                }`}>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div className="flex-1">
                  <div className="font-bold text-base text-med-text-primary flex items-center gap-2">
                    {option.nativeLabel || option.label}
                    {option.isRedFlag && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-bold">
                        Alert
                      </span>
                    )}
                  </div>

                  {option.nativeLabel && (
                    <div className="text-xs text-med-text-secondary mt-0.5">
                      {option.label}
                    </div>
                  )}

                  {option.sublabel && (
                    <div className="text-xs text-med-text-muted mt-1 leading-snug">
                      {option.sublabel}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls: Back & Next */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          variant="secondary"
          size="lg"
          onClick={prevQuestion}
          disabled={activeQuestionIndex === 0}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Previous / पिछला
        </Button>

        <Button
          variant="primary"
          size="lg"
          onClick={handleNext}
          disabled={!isCurrentAnswerValid()}
          className="px-8 font-bold shadow-glow-green"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {activeQuestionIndex >= allQuestions.length - 1 
            ? 'Proceed to Documents / आगे बढ़ें' 
            : 'Next Question / अगला प्रश्न'}
        </Button>
      </div>
    </div>
  );
};
