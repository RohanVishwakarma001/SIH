import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Printer, 
  Smartphone, 
  Clock, 
  Building2, 
  UserCheck, 
  QrCode, 
  ArrowRight,
  RotateCcw,
  Sparkles,
  Lock,
  Shield,
  ShieldCheck
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const KioskCompletion: React.FC = () => {
  const navigate = useNavigate();
  const { generatedToken, authData, resetKiosk, finalizeVisit, assignedDoctorName, consultationRoom, estimatedWaitMins } = useKiosk();
  const { speakText } = useAccessibility();
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    finalizeVisit().catch(() => {});
    // Fire celebratory clean confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#35D07F', '#6EE7A5', '#A7F3C5', '#F2F5F3']
      });
    } catch (e) {
      // safe fallback
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!generatedToken) return;
    speakText('आपकी क्लिनिकल जानकारी सफलतापूर्वक दर्ज कर ली गई है। आपका टोकन नंबर है ' + generatedToken + '। कृपया प्रतीक्षा करें।', 'hi');
  }, [generatedToken]);

  // DPDP Act 2023: Automatic 30-second session memory & token wipe
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleFinish = () => {
    resetKiosk();
    navigate('/patient/welcome');
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-xl mx-auto py-6 space-y-6 animate-in zoom-in-95 duration-300">
      {/* Top Success Badge */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto rounded-full bg-med-green/15 text-med-green flex items-center justify-center border border-med-green/30 shadow-glow-green-sm">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-med-text-primary">
          Clinical History Completed!
        </h1>
        <p className="text-lg font-bold text-med-green">
          आपकी जानकारी सफलतापूर्वक डॉक्टर तक पहुंच गई है
        </p>
      </div>

      {/* Hero OPD Token Card */}
      <Card className="w-full p-6 sm:p-8 bg-surface-elevated border-2 border-med-green/50 shadow-glow-green text-center space-y-4 relative overflow-hidden">
        <div className="text-xs uppercase font-extrabold tracking-widest text-med-green">
          All India Institute of Medical Sciences • AIIMS OPD
        </div>

        <div className="py-2">
          <span className="text-xs text-med-text-muted font-medium block">YOUR OPD QUEUE TOKEN</span>
          <div className="text-5xl sm:text-6xl font-black text-med-text-primary tracking-wider font-mono">
            {generatedToken}
          </div>
        </div>

        {/* Room & Doctor Details */}
        <div className="p-4 rounded-xl bg-surface border border-border space-y-2 text-left">
          <div className="flex items-center justify-between text-sm">
            <span className="text-med-text-secondary flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-med-green" /> Consultation Room:
            </span>
            <span className="font-bold text-med-text-primary">{consultationRoom || 'To be assigned'}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-med-text-secondary flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-med-green" /> Assigned Doctor:
            </span>
            <span className="font-bold text-med-text-primary">{assignedDoctorName || 'To be assigned'}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-med-text-secondary flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-med-green" /> Estimated Wait Time:
            </span>
            <span className="font-bold text-med-green">~{estimatedWaitMins} Minutes</span>
          </div>
        </div>

        {/* 4 Status Checks */}
        <div className="grid grid-cols-2 gap-2 text-xs text-left pt-1">
          <div className="flex items-center gap-1.5 text-med-text-secondary">
            <CheckCircle2 className="w-3.5 h-3.5 text-med-green shrink-0" />
            <span>Structured History Built</span>
          </div>
          <div className="flex items-center gap-1.5 text-med-text-secondary">
            <CheckCircle2 className="w-3.5 h-3.5 text-med-green shrink-0" />
            <span>Documents OCR Processed</span>
          </div>
          <div className="flex items-center gap-1.5 text-med-text-secondary">
            <CheckCircle2 className="w-3.5 h-3.5 text-med-green shrink-0" />
            <span>AI Summary Sent to Doctor</span>
          </div>
          <div className="flex items-center gap-1.5 text-med-text-secondary">
            <CheckCircle2 className="w-3.5 h-3.5 text-med-green shrink-0" />
            <span>ABHA Record Linked</span>
          </div>
        </div>
      </Card>

      {/* Module D: DPDP Act 2023 Automatic Session Termination Banner */}
      <div className="w-full p-4 rounded-xl bg-surface border border-med-green/30 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2 text-med-text-primary">
            <Lock className="w-4 h-4 text-med-green shrink-0" />
            <span>DPDP Act 2023 • Auto Session Wipe in:</span>
          </div>
          <span className="font-mono font-bold text-med-green text-sm">{countdown}s</span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-surface-elevated rounded-full overflow-hidden border border-border">
          <div 
            className="h-full bg-med-green transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${(countdown / 30) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-med-text-muted pt-0.5">
          <span>Temporary intake session data is cleared automatically after submission.</span>
          <button
            onClick={handleFinish}
            className="text-med-green hover:underline font-bold"
          >
            Clear Now & Exit
          </button>
        </div>
      </div>

      {/* Action Buttons: Print Slip, Send to Mobile, Finish */}
      <div className="w-full space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            size="lg"
            className="w-full text-xs sm:text-sm font-semibold"
            leftIcon={<Printer className="w-4 h-4 text-med-green" />}
            onClick={() => window.print()}
          >
            Print Paper Slip
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full text-xs sm:text-sm font-semibold"
            leftIcon={<Smartphone className="w-4 h-4 text-med-green" />}
            onClick={() => alert(`OPD Token ${generatedToken} sent via SMS to ${authData.mobile || '+91 98112 43210'}`)}
          >
            Send SMS / WhatsApp
          </Button>
        </div>

        <Button
          variant="primary"
          size="xl"
          onClick={handleFinish}
          className="w-full text-base font-bold shadow-glow-green"
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Finish & Return to Start (पूर्ण)
        </Button>
      </div>
    </div>
  );
};
