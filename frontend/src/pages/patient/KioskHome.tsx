import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Clock, 
  Mic, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  Stethoscope
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const KioskHome: React.FC = () => {
  const navigate = useNavigate();
  const { authData, estimatedWaitMins, department, initializeInterview } = useKiosk();

  const isAyush = department === 'ayush';

  useEffect(() => {
    initializeInterview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-center max-w-2xl mx-auto py-6 space-y-8 animate-in fade-in duration-300">
      {/* Personalized Welcome */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-med-green/10 border border-med-green/30 text-med-green text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Namaste, {authData.name}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-med-text-primary tracking-tight">
          Let's Prepare Your Medical History
        </h1>

        <p className="text-lg sm:text-xl font-bold text-med-green">
          डॉक्टर से मिलने से पहले अपनी बीमारी की जानकारी तैयार करें
        </p>

        <p className="text-sm text-med-text-secondary max-w-lg mx-auto">
          Answering a few simple questions now will help your doctor review your past records and diagnose you much faster.
        </p>
      </div>

      {/* 3 Simple Steps Card */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="p-4 bg-surface-elevated border-border flex flex-col items-center text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-med-green/10 text-med-green flex items-center justify-center font-bold">
            <Mic className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-med-text-primary">1. Voice or Touch</div>
          <p className="text-xs text-med-text-secondary">
            {isAyush ? 'Clinical & Dashavidha Pariksha questions' : 'Answer simple clinical questions in your language'}
          </p>
        </Card>

        <Card className="p-4 bg-surface-elevated border-border flex flex-col items-center text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-med-green/10 text-med-green flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-med-text-primary">2. Scan Prescriptions</div>
          <p className="text-xs text-med-text-secondary">
            Upload previous hospital slips or lab reports using camera
          </p>
        </Card>

        <Card className="p-4 bg-surface-elevated border-border flex flex-col items-center text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-med-green/10 text-med-green flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-med-text-primary">3. Doctor Token</div>
          <p className="text-xs text-med-text-secondary">
            Get your OPD token and walk directly to your designated doctor room
          </p>
        </Card>
      </div>

      {/* Completion Time Indicator */}
      <div className="w-full p-4 rounded-xl bg-surface border border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-med-green" />
          <div>
            <div className="text-xs text-med-text-secondary font-medium">Estimated Completion Time</div>
            <div className="text-sm font-bold text-med-text-primary">Under 3 Minutes (~2.5 mins average)</div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs px-2.5 py-1 rounded-full bg-surface-elevated text-med-green border border-border font-semibold">
            ~{estimatedWaitMins}m Saved in OPD
          </span>
        </div>
      </div>

      {/* Primary CTA */}
      <div className="w-full max-w-md pt-2">
        <Button
          variant="primary"
          size="xl"
          onClick={() => navigate('/patient/interview')}
          className="w-full text-lg font-bold shadow-glow-green"
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          Start Clinical Interview / शुरू करें
        </Button>
      </div>
    </div>
  );
};
