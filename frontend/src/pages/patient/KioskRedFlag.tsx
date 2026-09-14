import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  PhoneCall, 
  CheckCircle2, 
  Clock, 
  HeartHandshake, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const KioskRedFlag: React.FC = () => {
  const navigate = useNavigate();
  const { redFlagAlert, dismissEmergencyAlert, generatedToken, triggerEmergencyAlert } = useKiosk();
  const { speakText } = useAccessibility();

  const [staffCalled, setStaffCalled] = useState(false);

  const handleCallStaff = () => {
    setStaffCalled(true);
    triggerEmergencyAlert(redFlagAlert?.description || 'Patient requested immediate staff assistance from red-flag screen');
    speakText('अस्पताल के नर्सिंग स्टाफ को अलर्ट भेज दिया गया है। कृपया अपनी कुर्सी पर बैठे रहें।', 'hi');
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-2xl mx-auto py-6 space-y-6 animate-in zoom-in-95 duration-300">
      {/* Red Flag Header Card */}
      <Card className="w-full p-6 sm:p-8 bg-surface-elevated border-med-urgent/50 shadow-glow-urgent text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/40 text-red-400 flex items-center justify-center">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 text-xs font-extrabold uppercase tracking-widest">
            Urgent Clinical Priority • तत्काल ध्यान दें
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-med-text-primary pt-2">
            Urgent Medical Attention Required
          </h1>
          <p className="text-lg font-bold text-red-400">
            आपकी स्वास्थ्य सुरक्षा के लिए प्राथमिकता अलर्ट
          </p>
        </div>

        <p className="text-sm text-med-text-secondary max-w-lg mx-auto leading-relaxed">
          Your responses indicate symptoms that require prompt physician review. 
          <br />
          <strong>Please remain seated at this terminal.</strong> Hospital triage staff has been notified.
        </p>

        {/* Symptoms Summary */}
        <div className="p-4 rounded-xl bg-surface border border-border text-left space-y-2">
          <div className="text-xs font-bold text-med-text-secondary uppercase tracking-wider">
            Critical Symptoms Flagged:
          </div>
          <ul className="space-y-1.5 text-xs sm:text-sm text-med-text-primary">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <span>Severe acute chest heaviness / radiating pain</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <span>Cold sweating (diaphoresis) / breathlessness</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <span>Elevated clinical risk profile</span>
            </li>
          </ul>
        </div>

        {/* Token and Staff notification status */}
        <div className="p-4 rounded-xl bg-surface border border-med-urgent/40 flex items-center justify-between">
          <div className="text-left">
            <div className="text-xs text-med-text-muted">Emergency OPD Priority Token</div>
            <div className="text-2xl font-black text-red-400 font-mono tracking-wider">
              {generatedToken || 'Pending'} (STAT)
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 font-bold border border-red-500/30 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              Triage Nurse Dispatched
            </span>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Button
            variant="danger"
            size="xl"
            onClick={handleCallStaff}
            className="flex-1 text-base font-bold shadow-glow-urgent"
            leftIcon={<PhoneCall className="w-5 h-5" />}
          >
            {staffCalled ? 'Staff Alert Resent (Done)' : 'Call Hospital Staff Now / कर्मचारी बुलाएं'}
          </Button>

          <Button
            variant="secondary"
            size="xl"
            onClick={() => {
              dismissEmergencyAlert();
              navigate('/patient/documents');
            }}
            className="text-xs sm:text-sm text-med-text-secondary"
          >
            Continue with Document Scan
          </Button>
        </div>
      </Card>
    </div>
  );
};
