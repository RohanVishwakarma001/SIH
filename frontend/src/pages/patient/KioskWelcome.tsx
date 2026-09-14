import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Stethoscope, 
  HeartPulse, 
  Bone, 
  Leaf, 
  Baby, 
  Headphones, 
  Clock, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  User
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { DEPARTMENTS } from '../../data/mockData';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const KioskWelcome: React.FC = () => {
  const navigate = useNavigate();
  const { department, setDepartment, language } = useKiosk();
  const { speakText } = useAccessibility();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Stethoscope': return <Stethoscope className="w-6 h-6 text-med-green" />;
      case 'HeartPulse': return <HeartPulse className="w-6 h-6 text-red-400" />;
      case 'Bone': return <Bone className="w-6 h-6 text-amber-400" />;
      case 'Leaf': return <Leaf className="w-6 h-6 text-emerald-400" />;
      case 'Baby': return <Baby className="w-6 h-6 text-cyan-400" />;
      case 'Headphones': return <Headphones className="w-6 h-6 text-indigo-400" />;
      default: return <Stethoscope className="w-6 h-6 text-med-green" />;
    }
  };

  const handleDeptSelect = (deptId: any) => {
    setDepartment(deptId);
    if (language === 'hi') {
      speakText('विभाग चुना गया है। कृपया आगे बढ़ें।', 'hi');
    } else {
      speakText('Department selected. Please proceed.', 'en');
    }
    navigate('/patient/language');
  };

  return (
    <div className="flex flex-col items-center justify-center py-4 sm:py-6 space-y-8 animate-in fade-in duration-300">
      {/* Welcome Hero Banner */}
      <div className="text-center space-y-3 max-w-3xl">
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-med-green/10 border border-med-green/30 text-med-green text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>All India Institute of Ayurveda • Ministry of Ayush</span>
          <span className="text-med-text-muted hidden sm:inline">•</span>
          <span className="text-emerald-300 hidden sm:inline">Problem Statement 4</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-med-text-primary">
          Medi<span className="text-med-green">Kiosk</span> Clinical Intake Platform
        </h1>

        <p className="text-base sm:text-lg text-med-text-secondary leading-relaxed">
          डॉक्टर से मिलने से पहले अपनी बीमारी की पूरी जानकारी, पुरानी पर्चियां एवं आयुष दशविध परीक्षा दर्ज करें।
          <br className="hidden sm:inline" />
          <span className="text-med-text-muted text-sm sm:text-base">
            Autonomous multimodal intake resolving the 2–5 minute OPD bottleneck across 4,000–10,000 daily patients.
          </span>
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 text-xs text-med-text-muted">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-med-green" />
            <span>Dual Voice & Touch Input</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-med-green" />
            <span>ABDM / ABHA FHIR Interoperability</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-med-green" />
            <span>Dashavidha & Ashtavidha Pariksha</span>
          </div>
        </div>
      </div>

      {/* Department Selection Grid */}
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-bold text-med-text-primary flex items-center gap-2">
            Select Consultation Department / विभाग चुनें
          </h2>
          <span className="text-xs text-med-text-muted">Touch any card to begin</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEPARTMENTS.map(dept => {
            const isSelected = department === dept.id;
            const isAyush = dept.id === 'ayush';

            return (
              <Card
                key={dept.id}
                interactive
                onClick={() => handleDeptSelect(dept.id)}
                className={`p-5 flex flex-col justify-between transition-all duration-200 border-2 ${
                  isSelected
                    ? 'border-med-green bg-surface-elevated shadow-glow-green'
                    : isAyush
                    ? 'border-emerald-500/30 hover:border-emerald-400 bg-surface'
                    : 'border-border hover:border-med-green/50 bg-surface'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-surface-elevated border border-border flex items-center justify-center">
                      {getIcon(dept.icon)}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-elevated text-med-text-secondary border border-border">
                      <Clock className="w-3.5 h-3.5 text-med-green" />
                      <span>~{dept.avgWaitMins}m wait</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-med-text-primary flex items-center gap-2">
                      {dept.name}
                      {isAyush && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                          AYUSH
                        </span>
                      )}
                    </h3>
                    {dept.nativeName && (
                      <p className="text-sm font-semibold text-med-green mt-0.5">
                        {dept.nativeName}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-med-text-secondary leading-relaxed">
                    {dept.description}
                  </p>
                </div>

                <div className="pt-4 mt-2 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-med-green group">
                  <span>शुरू करें / Tap to Start</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Patient Personal Portal Link (Module 3.2 Specification) */}
      <div className="w-full max-w-2xl p-4 rounded-2xl bg-surface-elevated border border-med-green/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-surface">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-med-green/20 text-med-green flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-med-text-primary">Personal Patient Portal & Health Records</div>
            <div className="text-xs text-med-text-secondary">Have an account? Login with personal ID & password to store medical records and manage consent.</div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/patient/portal/login')}
          className="shrink-0 font-bold border-med-green/40 hover:bg-med-green/10 text-med-text-primary"
        >
          Patient Login / पोर्टल प्रवेश
        </Button>
      </div>

      {/* Quick Start Action */}
      <div className="w-full max-w-md pt-2">
        <Button
          variant="primary"
          size="xl"
          className="w-full text-base font-bold shadow-glow-green"
          onClick={() => handleDeptSelect('general')}
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          General OPD Intake (सामान्य ओपीडी)
        </Button>
      </div>
    </div>
  );
};
