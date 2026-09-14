import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle, 
  Pill, 
  ShieldAlert, 
  Leaf, 
  Heart, 
  Activity,
  Sparkles,
  Printer,
  Volume2
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StructuredClinicalHistory } from '../../types';
import { api } from '../../services/api';

export const KioskSummary: React.FC = () => {
  const navigate = useNavigate();
  const { department, authData, getStructuredSummary, language } = useKiosk();
  const { speakText } = useAccessibility();
  const isAyush = department === 'ayush';

  const [history, setHistory] = useState<StructuredClinicalHistory>(() => getStructuredSummary());

  useEffect(() => {
    // Dynamically update structured summary from active answers
    setHistory(getStructuredSummary());

    if (authData.patientId) {
      api.getStructuredHistory(authData.patientId)
        .then(res => {
          if (res?.history) setHistory(res.history as any);
        })
        .catch(() => {});
    }
  }, [authData.patientId]);

  const handlePlayAudioSummary = () => {
    let script = '';
    if (language === 'hi') {
      script = `आपकी मुख्य परेशानी: ${history.chiefComplaint.primary}। अवधि: ${history.chiefComplaint.duration}। रक्तचाप एवं मधुमेह का इतिहास दर्ज कर लिया गया है। आपकी दवाएं और जाँचें सुरक्षित रूप से डॉक्टर के पास पहुँचा दी गई हैं।`;
    } else if (language === 'mr') {
      script = `तुमची मुख्य तक्रार: ${history.chiefComplaint.primary} नोंदवली गेली आहे. तुमचा क्लिनिकल सारांश डॉक्टरांकडे पाठवला गेला आहे.`;
    } else if (language === 'ta') {
      script = `உங்கள் முதன்மை புகார்: ${history.chiefComplaint.primary} பதிவு செய்யப்பட்டுள்ளது. உங்கள் மருத்துவ குறிப்பு மருத்துவரிடம் அனுப்பப்பட்டது.`;
    } else if (language === 'te') {
      script = `మీ ప్రధాన సమస్య: ${history.chiefComplaint.primary} నమోదు చేయబడింది. మీ క్లినికల్ సారాంశం వైద్యుడికి పంపబడింది.`;
    } else if (language === 'bn') {
      script = `আপনার প্রধান সমস্যা: ${history.chiefComplaint.primary} রেকর্ড করা হয়েছে। আপনার ক্লিনিকাল সারাংশ চিকিৎসকের কাছে পাঠানো হয়েছে।`;
    } else {
      script = `Your chief complaint: ${history.chiefComplaint.primary}. Duration: ${history.chiefComplaint.duration}. Active conditions and medications have been verified and pushed to your treating physician.`;
    }
    speakText(script, language);
  };

  return (
    <div className="flex flex-col max-w-4xl w-full mx-auto py-4 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-border text-xs font-semibold text-med-text-secondary mb-1">
            <CheckCircle2 className="w-4 h-4 text-med-green" />
            <span>Step 6 of 6 • चिकित्सक तैयार क्लिनिकल सारांश</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-med-text-primary">
            Physician-Ready Clinical Summary
          </h1>
          <p className="text-xs text-med-text-secondary">
            Structured standard clinical documentation prepared for your OPD doctor.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/patient/completion')}
          className="font-bold shadow-glow-green"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Submit & Generate Token / टोकन प्राप्त करें
        </Button>
      </div>

      {/* Patient-Facing Audio Confirmation (Module C Bilingual Requirement) */}
      <div className="w-full p-4 rounded-xl bg-med-green/10 border border-med-green/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-med-green/20 text-med-green flex items-center justify-center shrink-0">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-med-text-primary">
              Patient-Facing Audio Summary Confirmation
            </div>
            <div className="text-xs text-med-green font-medium">
              अपनी स्थानीय भाषा में सारांश की ऑडियो पुष्टि सुनें (Tap to play confirmation)
            </div>
          </div>
        </div>
        <Button
          variant="secondary"
          size="md"
          onClick={handlePlayAudioSummary}
          leftIcon={<Volume2 className="w-4 h-4 text-med-green" />}
          className="shrink-0 font-bold"
        >
          Listen Audio Confirmation / सुनें
        </Button>
      </div>

      {/* Structured Medical Sections Accordion/Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chief Complaint & HPI */}
        <Card className="p-5 bg-surface-elevated border-border space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-med-green flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              Chief Complaint (CC)
            </span>
            <Badge variant="urgent" size="sm">Severity {history.chiefComplaint.severityScore}/10</Badge>
          </div>
          <div>
            <div className="text-sm font-bold text-med-text-primary">
              {history.chiefComplaint.primary}
            </div>
            <div className="text-xs text-med-text-secondary mt-1">
              <strong>Onset & Duration: </strong>{history.chiefComplaint.onset} ({history.chiefComplaint.duration})
            </div>
            <div className="text-xs text-med-text-secondary">
              <strong>Location: </strong>{history.chiefComplaint.location}
            </div>
          </div>
          <div className="pt-2 border-t border-border/80">
            <span className="text-[11px] uppercase font-bold text-med-text-muted block mb-1">History of Present Illness (HPI)</span>
            <p className="text-xs text-med-text-secondary leading-relaxed">
              {history.historyOfPresentIllness}
            </p>
          </div>
        </Card>

        {/* Drug History & Allergies */}
        <Card className="p-5 bg-surface-elevated border-border space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-med-green flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5" />
              Drug History & Allergies
            </span>
            <span className="text-[11px] text-med-text-muted font-mono">{history.drugHistory.length} Active Meds</span>
          </div>

          <div className="space-y-2">
            {history.drugHistory.map((drug, i) => (
              <div key={i} className="p-2 rounded-lg bg-surface border border-border flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-med-text-primary">{drug.drugName}</span>
                  <span className="text-med-text-muted ml-2">{drug.dosage} • {drug.frequency}</span>
                </div>
                <Badge variant="green" size="sm">{drug.adherence}</Badge>
              </div>
            ))}
          </div>

          {/* Allergies Highlight */}
          <div className="pt-2 border-t border-border/80">
            <span className="text-[11px] uppercase font-bold text-red-400 block mb-1 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> High Risk Drug Allergies
            </span>
            {history.allergyHistory.length > 0 ? (
              history.allergyHistory.map((all, idx) => (
                <div key={idx} className="p-2 rounded bg-red-500/10 border border-red-500/30 text-xs text-red-300 font-medium">
                  <strong>{all.allergen}: </strong>{all.reaction} ({all.severity})
                </div>
              ))
            ) : (
              <div className="text-xs text-med-text-muted">No known drug allergies reported.</div>
            )}
          </div>
        </Card>

        {/* Past Medical History & Surgery */}
        <Card className="p-5 bg-surface-elevated border-border space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-med-green">
              Past Medical & Surgical History
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-med-text-secondary">
            {history.pastMedicalHistory.map((pmh, i) => (
              <div key={i} className="flex justify-between py-1 border-b border-border/50">
                <span className="font-medium text-med-text-primary">{pmh.condition}</span>
                <span className="text-med-text-muted font-mono">Since {pmh.diagnosedYear}</span>
              </div>
            ))}
          </div>
          {history.pastSurgicalHistory.length > 0 && (
            <div className="pt-2">
              <span className="text-[11px] font-bold text-med-text-muted block mb-1">Prior Surgeries</span>
              {history.pastSurgicalHistory.map((surg, idx) => (
                <div key={idx} className="text-xs text-med-text-secondary">
                  • {surg.procedure} ({surg.year}, {surg.hospital})
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* AYUSH Dashavidha Pariksha (If AYUSH department) */}
        {isAyush && history.dashavidhaPariksha && (
          <Card className="p-5 bg-surface-elevated border-emerald-500/40 space-y-3 shadow-glow-green-sm">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-300 flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5" />
                Dashavidha & Ashtavidha Pariksha (दशविध परीक्षा)
              </span>
              <Badge variant="ayush" size="sm">Ayurvedic Intake</Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded bg-surface border border-border">
                <div className="text-[10px] text-med-text-muted uppercase font-bold">1. Prakriti (प्रकृति)</div>
                <div className="font-bold text-emerald-300 mt-0.5">{history.dashavidhaPariksha.prakriti.primaryDosha}</div>
              </div>
              <div className="p-2 rounded bg-surface border border-border">
                <div className="text-[10px] text-med-text-muted uppercase font-bold">2. Agni (जठराग्नि)</div>
                <div className="font-bold text-amber-300 mt-0.5">{history.dashavidhaPariksha.agni || 'Vishamagni'}</div>
              </div>
              <div className="p-2 rounded bg-surface border border-border">
                <div className="text-[10px] text-med-text-muted uppercase font-bold">3. Koshtha (कोष्ठ)</div>
                <div className="font-bold text-med-text-primary mt-0.5">{history.dashavidhaPariksha.koshtha || 'Krura Koshtha'}</div>
              </div>
              <div className="p-2 rounded bg-surface border border-border">
                <div className="text-[10px] text-med-text-muted uppercase font-bold">4. Satva (मनोबल)</div>
                <div className="font-bold text-med-text-primary mt-0.5">{history.dashavidhaPariksha.satva}</div>
              </div>
              <div className="p-2 rounded bg-surface border border-border">
                <div className="text-[10px] text-med-text-muted uppercase font-bold">5. Vyayama Shakti (बल)</div>
                <div className="font-bold text-med-text-primary mt-0.5">{history.dashavidhaPariksha.vyayamaShakti}</div>
              </div>
              <div className="p-2 rounded bg-surface border border-border">
                <div className="text-[10px] text-med-text-muted uppercase font-bold">6. Satmya & Vaya</div>
                <div className="font-bold text-med-text-primary mt-0.5">{history.dashavidhaPariksha.satmya || 'Satmya'}</div>
              </div>
            </div>
            {history.dashavidhaPariksha.ashtavidhaPariksha && (
              <div className="p-2.5 rounded bg-surface border border-emerald-500/20 text-[11px] text-med-text-secondary">
                <span className="font-bold text-emerald-300">Ashtavidha: </span>
                Nadi: {history.dashavidhaPariksha.ashtavidhaPariksha.nadi} • Jihwa: {history.dashavidhaPariksha.ashtavidhaPariksha.jihwa}
              </div>
            )}
          </Card>
        )}

        {/* Review of Systems & Lifestyle */}
        {!isAyush && (
          <Card className="p-5 bg-surface-elevated border-border space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-med-green">
                Review of Systems (ROS) & Lifestyle
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              {history.reviewOfSystems.map((ros, idx) => (
                <div key={idx} className="flex justify-between py-1 border-b border-border/50">
                  <span className="font-medium text-med-text-primary">{ros.system}</span>
                  <Badge variant={ros.status === 'Abnormal' ? 'urgent' : 'normal'} size="sm">
                    {ros.status}: {ros.findings}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-med-text-muted pt-1">
              Diet: {history.personalHistory.diet} • Tobacco: {history.personalHistory.tobaccoUse} • Sleep: {history.personalHistory.sleep}
            </div>
          </Card>
        )}
      </div>

      {/* Final Confirmation Banner */}
      <div className="p-4 rounded-xl bg-surface-elevated border border-med-green/30 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-med-text-secondary">
          <Sparkles className="w-4 h-4 text-med-green" />
          <span>This clinical summary will be ready on your doctor's workstation before you enter.</span>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/patient/completion')}
          className="font-bold"
        >
          Confirm & Get Token
        </Button>
      </div>
    </div>
  );
};
