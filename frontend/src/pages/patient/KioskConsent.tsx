import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Volume2, 
  Check, 
  Lock, 
  FileText, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const KioskConsent: React.FC = () => {
  const navigate = useNavigate();
  const { setHasConsented, language } = useKiosk();
  const { speakText } = useAccessibility();

  const [consentAi, setConsentAi] = useState(true);
  const [consentDoctorShare, setConsentDoctorShare] = useState(true);
  const [consentAbha, setConsentAbha] = useState(true);

  const handleAudioExplanation = () => {
    if (language === 'hi') {
      speakText('यह सहमति पत्र आपको यह बताता है कि आपकी बीमारी की जानकारी केवल आपके परामर्श डॉक्टर के साथ साझा की जाएगी। यह प्रणाली पूरी तरह सुरक्षित है और आपके डेटा की गोपनीयता बनाए रखती है।', 'hi');
    } else {
      speakText('This consent explains that your medical responses and uploaded documents will be processed securely and shared only with your treating doctor to speed up your OPD consultation.', 'en');
    }
  };

  const handleGiveConsent = () => {
    setHasConsented(true, { consentAi, consentDoctorShare, consentAbha });
    navigate('/patient/home');
  };

  const allSelected = consentAi && consentDoctorShare && consentAbha;

  return (
    <div className="flex flex-col items-center justify-center max-w-2xl mx-auto py-6 space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-border text-xs font-semibold text-med-text-secondary">
          <ShieldCheck className="w-4 h-4 text-med-green" />
          <span>Step 3 of 6 • सहमति एवं गोपनीयता (Consent)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-med-text-primary">
          Informed Patient Consent
        </h1>
        <p className="text-lg font-bold text-med-green">
          मरीज़ सहमति एवं डेटा सुरक्षा
        </p>
      </div>

      {/* Audio Guidance Card */}
      <div className="w-full p-4 rounded-xl bg-med-green/10 border border-med-green/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-med-green/20 text-med-green flex items-center justify-center shrink-0">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-med-text-primary">Listen to Audio Explanation</div>
            <div className="text-xs text-med-green font-medium">सहमति नियम आवाज़ में सुनें (Tap to listen)</div>
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleAudioExplanation}
          leftIcon={<Volume2 className="w-4 h-4 text-med-green" />}
        >
          Play Audio
        </Button>
      </div>

      {/* Consent Clauses */}
      <Card className="w-full p-6 space-y-4 bg-surface-elevated border-border">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface border border-border hover:border-med-green/40 transition-colors cursor-pointer" onClick={() => setConsentAi(!consentAi)}>
          <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${consentAi ? 'bg-med-green text-background' : 'border border-border bg-surface-elevated'}`}>
            {consentAi && <Check className="w-4 h-4 font-bold stroke-[3]" />}
          </div>
          <div className="text-sm">
            <div className="font-bold text-med-text-primary">1. AI-Guided Clinical Intake / एआई क्लिनिकल प्रश्नोत्तरी</div>
            <div className="text-xs text-med-text-secondary mt-0.5 leading-relaxed">
              I consent to answer medical history questions via voice or touch assisted by MediKiosk clinical AI.
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface border border-border hover:border-med-green/40 transition-colors cursor-pointer" onClick={() => setConsentDoctorShare(!consentDoctorShare)}>
          <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${consentDoctorShare ? 'bg-med-green text-background' : 'border border-border bg-surface-elevated'}`}>
            {consentDoctorShare && <Check className="w-4 h-4 font-bold stroke-[3]" />}
          </div>
          <div className="text-sm">
            <div className="font-bold text-med-text-primary">2. Physician Triage Sharing / डॉक्टर के साथ साझाकरण</div>
            <div className="text-xs text-med-text-secondary mt-0.5 leading-relaxed">
              My clinical summary, red-flag symptoms, and scanned prescription timeline will be shared directly with my assigned OPD doctor.
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface border border-border hover:border-med-green/40 transition-colors cursor-pointer" onClick={() => setConsentAbha(!consentAbha)}>
          <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${consentAbha ? 'bg-med-green text-background' : 'border border-border bg-surface-elevated'}`}>
            {consentAbha && <Check className="w-4 h-4 font-bold stroke-[3]" />}
          </div>
          <div className="text-sm">
            <div className="font-bold text-med-text-primary">3. ABDM Health Record Integration / आभा स्वास्थ्य रिकॉर्ड</div>
            <div className="text-xs text-med-text-secondary mt-0.5 leading-relaxed">
              Allow MediKiosk to link this OPD visit token to my Ayushman Bharat Health Account (ABHA).
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-surface border border-border/70 flex items-center gap-2 text-xs text-med-text-muted">
          <Lock className="w-4 h-4 text-med-green shrink-0" />
          <span>Compliant with Indian Digital Personal Data Protection (DPDP) Act 2023 & ABDM standards.</span>
        </div>
      </Card>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Button
          variant="primary"
          size="xl"
          disabled={!allSelected}
          onClick={handleGiveConsent}
          className="flex-1 text-base font-bold shadow-glow-green"
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          Give Consent / सहमति दें एवं शुरू करें
        </Button>

        <Button
          variant="secondary"
          size="xl"
          onClick={() => navigate('/patient/welcome')}
          className="sm:w-36 text-sm"
        >
          Decline / अस्वीकार
        </Button>
      </div>
    </div>
  );
};
