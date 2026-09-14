import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Languages, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  PhoneCall, 
  Activity, 
  ArrowLeft,
  Sun,
  Eye,
  Type
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { SUPPORTED_LANGUAGES } from '../../data/mockData';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

export const PatientLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, triggerEmergencyAlert } = useKiosk();
  const { 
    isAudioMode, 
    toggleAudioMode, 
    isLargeText, 
    toggleLargeText, 
    isHighContrast, 
    toggleHighContrast 
  } = useAccessibility();

  const [isHelpOpen, setIsHelpOpen] = React.useState(false);
  const [isLangOpen, setIsLangOpen] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const canGoBack = location.pathname !== '/patient' && location.pathname !== '/patient/welcome';

  return (
    <div className="min-h-screen flex flex-col bg-background text-med-text-primary selection:bg-med-green/20">
      {/* Top Kiosk Header */}
      <header className="h-20 bg-surface/90 border-b border-border/80 px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        {/* Brand & Hospital Identity */}
        <div className="flex items-center gap-4">
          {canGoBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 rounded-xl bg-surface-elevated hover:bg-surface-hover border border-border text-med-text-secondary hover:text-med-text-primary transition-all flex items-center gap-1.5"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">वापस / Back</span>
            </button>
          )}

          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/patient/welcome')}>
            <div className="w-11 h-11 rounded-xl bg-med-green/10 border border-med-green/30 flex items-center justify-center text-med-green shadow-glow-green-sm">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-med-text-primary">
                  Medi<span className="text-med-green">Kiosk</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-med-green/10 text-med-green border border-med-green/20">
                  OPD Triage AI
                </span>
              </div>
              <p className="text-xs text-med-text-muted">
                AI Clinical History Terminal • Gate 2 OPD
              </p>
            </div>
          </div>
        </div>

        {/* Global Controls: Language, Audio, Accessibility, Help */}
        <div className="flex items-center gap-3">
          {/* Live Clock */}
          <div className="hidden md:flex flex-col text-right mr-2">
            <span className="text-sm font-semibold text-med-text-primary">{currentTime}</span>
            <span className="text-[11px] text-med-text-muted">High-Volume Triage</span>
          </div>

          {/* Language Selector Button */}
          <button
            onClick={() => setIsLangOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-elevated border border-border hover:border-med-green/50 text-med-text-primary text-sm font-medium transition-all"
          >
            <Languages className="w-4 h-4 text-med-green" />
            <span className="font-semibold">{currentLangObj.nativeName}</span>
          </button>

          {/* Audio Guidance Toggle */}
          <button
            onClick={toggleAudioMode}
            className={`p-2.5 rounded-xl border transition-all ${
              isAudioMode
                ? 'bg-med-green/15 text-med-green border-med-green/40 shadow-glow-green-sm'
                : 'bg-surface-elevated text-med-text-muted border-border hover:text-med-text-primary'
            }`}
            title={isAudioMode ? 'Audio Guidance ON' : 'Audio Guidance OFF'}
          >
            {isAudioMode ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Accessibility Quick Menu */}
          <button
            onClick={toggleLargeText}
            className={`p-2.5 rounded-xl border transition-all ${
              isLargeText
                ? 'bg-med-green/15 text-med-green border-med-green/40'
                : 'bg-surface-elevated text-med-text-muted border-border hover:text-med-text-primary'
            }`}
            title="Large Text Mode"
          >
            <Type className="w-5 h-5" />
          </button>

          {/* High Contrast Toggle */}
          <button
            onClick={toggleHighContrast}
            className={`p-2.5 rounded-xl border transition-all ${
              isHighContrast
                ? 'bg-med-green/15 text-med-green border-med-green/40'
                : 'bg-surface-elevated text-med-text-muted border-border hover:text-med-text-primary'
            }`}
            title="High Contrast Mode"
          >
            <Eye className="w-5 h-5" />
          </button>

          {/* Urgent Staff Assistance Button */}
          <button
            onClick={() => setIsHelpOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-elevated border border-med-urgent/40 text-med-urgent hover:bg-med-urgent/10 text-sm font-semibold transition-all shadow-glow-urgent"
          >
            <PhoneCall className="w-4 h-4" />
            <span className="hidden sm:inline">मदद / Staff Help</span>
          </button>
        </div>
      </header>

      {/* Main Kiosk Content Area */}
      <main className="flex-1 flex flex-col justify-center max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Language Modal */}
      <Modal
        isOpen={isLangOpen}
        onClose={() => setIsLangOpen(false)}
        title="Select Language / भाषा चुनें"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SUPPORTED_LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsLangOpen(false);
              }}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                language === lang.code
                  ? 'border-med-green bg-surface-elevated shadow-glow-green-sm text-med-green'
                  : 'border-border bg-surface hover:border-med-green/40 text-med-text-primary'
              }`}
            >
              <div className="text-xl font-bold">{lang.nativeName}</div>
              <div className="text-xs text-med-text-secondary mt-1">{lang.name}</div>
            </button>
          ))}
        </div>
      </Modal>

      {/* Help & Staff Alert Modal */}
      <Modal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="Hospital Staff Assistance / अस्पताल कर्मचारी सहायता"
      >
        <div className="space-y-4">
          <p className="text-sm text-med-text-secondary leading-relaxed">
            If you need physical assistance, cannot read the screen, or feel unwell while at this kiosk, tap the button below. A hospital nursing assistant will immediately come to your kiosk terminal.
          </p>
          <div className="p-4 rounded-xl bg-surface-elevated border border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-med-green/10 text-med-green flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-sm">Kiosk Terminal #01 (OPD Gate 2)</div>
              <div className="text-xs text-med-text-muted">Staff response time: ~60 seconds</div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => {
                triggerEmergencyAlert('Patient summoned staff via help button');
                setIsHelpOpen(false);
                navigate('/patient/red-flag');
              }}
            >
              Alert Nursing Staff Now
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsHelpOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
