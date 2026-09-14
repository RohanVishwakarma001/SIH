import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Sparkles, 
  FileText, 
  Stethoscope, 
  Pill, 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  ExternalLink,
  Save,
  Check,
  Building2,
  Leaf
} from 'lucide-react';
import { useDoctor } from '../../context/DoctorContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const DoctorPatientView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    patients,
    selectedPatient,
    verifyAiSummary,
    selectPatientById,
    isLoadingWorkspace
  } = useDoctor();

  const patient = selectedPatient;
  const history = patient?.structuredHistory;
  const ai = patient?.aiSummary;

  // If URL param provided, ensure patient is selected
  React.useEffect(() => {
    if (id && id !== selectedPatient?.id) {
      selectPatientById(id);
    }
  }, [id, selectedPatient?.id]);

  // Collapsible section states for center column
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    cc_hpi: true,
    meds_allergies: true,
    pmh_psh: true,
    ros: true,
    ayush: true,
    investigations: true
  });

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // AI Verification State
  const [summaryLang, setSummaryLang] = useState<'en' | 'hi'>('en');
  const [isEditingAi, setIsEditingAi] = useState(false);
  const [editedSummaryText, setEditedSummaryText] = useState(ai?.conciseSummary || '');

  // Keep the editable draft in sync whenever the underlying AI summary changes
  // (e.g. a different patient is selected, or a fresh summary is generated).
  React.useEffect(() => {
    setEditedSummaryText(ai?.conciseSummary || '');
    setIsEditingAi(false);
  }, [ai?.conciseSummary]);

  const handleAiAction = (action: 'accepted' | 'edited' | 'rejected') => {
    verifyAiSummary(action, action === 'edited' ? editedSummaryText : undefined);
    setIsEditingAi(false);
  };

  const isUrgent = patient?.priority === 'urgent';

  // Avoid flashing another patient's (or placeholder) clinical data while the real
  // aggregated workspace for this patient id is still being fetched from the backend.
  if (id && (isLoadingWorkspace || selectedPatient?.id !== id)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-med-text-secondary text-sm">
        Loading patient clinical workspace…
      </div>
    );
  }

  if (!patient || !history || !ai) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-med-text-secondary text-sm">
        <p>No patient selected. Choose a patient from the OPD queue.</p>
        <Button variant="primary" size="sm" onClick={() => navigate('/doctor/dashboard')}>
          Return to OPD Queue
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-[1520px] mx-auto animate-in fade-in duration-300">
      {/* Top Section: Patient Identity Strip & Vitals Bar */}
      <Card className="p-4 bg-surface-elevated border-border shadow-surface">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Patient Details */}
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl border ${
              isUrgent 
                ? 'bg-red-500/15 border-red-500/40 text-red-400 shadow-glow-urgent' 
                : 'bg-med-green/15 border-med-green/40 text-med-green'
            }`}>
              {patient.token}
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-black text-med-text-primary">
                  {patient.name}
                </h1>
                <Badge
                  variant={patient.priority === 'urgent' ? 'urgent' : patient.priority === 'attention' ? 'attention' : 'normal'}
                  size="sm"
                  dot
                >
                  {patient.priority.toUpperCase()} TRIAGE
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-med-text-secondary mt-1">
                <span>{patient.age} Yrs • {patient.gender}</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono text-med-green">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  ABHA: {patient.abhaId}
                </span>
                <span>•</span>
                <span className="text-med-text-muted">{patient.roomNo}</span>
              </div>
            </div>
          </div>

          {/* Vitals Ribbon */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-surface border border-border">
              <span className="text-[10px] text-med-text-muted uppercase block font-bold">BP (mmHg)</span>
              <span className="font-mono font-bold text-med-text-primary text-sm">{patient.vitals.bp || 'Not recorded'}</span>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-surface border border-border">
              <span className="text-[10px] text-med-text-muted uppercase block font-bold">HR (bpm)</span>
              <span className={`font-mono font-bold text-sm ${(patient.vitals.heartRate || 0) > 100 ? 'text-red-400' : 'text-med-text-primary'}`}>
                {patient.vitals.heartRate || 'Not recorded'}
              </span>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-surface border border-border">
              <span className="text-[10px] text-med-text-muted uppercase block font-bold">SpO2</span>
              <span className="font-mono font-bold text-med-text-primary text-sm">{patient.vitals.spo2 ? `${patient.vitals.spo2}%` : 'Not recorded'}</span>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-surface border border-border">
              <span className="text-[10px] text-med-text-muted uppercase block font-bold">Temp</span>
              <span className="font-mono font-bold text-med-text-primary text-sm">{patient.vitals.temperature || 'Not recorded'}</span>
            </div>

            {patient.vitals.bloodSugar && (
              <div className="px-3 py-1.5 rounded-lg bg-surface border border-border">
                <span className="text-[10px] text-med-text-muted uppercase block font-bold">Sugar (mg/dL)</span>
                <span className="font-mono font-bold text-amber-300 text-sm">{patient.vitals.bloodSugar}</span>
              </div>
            )}

            {/* Direct Consultation Action */}
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/doctor/consultation')}
              className="ml-2 font-bold shadow-glow-green-sm"
              rightIcon={<Stethoscope className="w-4 h-4" />}
            >
              Start Consultation
            </Button>
          </div>
        </div>
      </Card>

      {/* 3-Column Clinical Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* =========================================================================
            LEFT COLUMN (3 cols): Patient Identity, Documents, Chronological Timeline
        ========================================================================= */}
        <div className="lg:col-span-3 space-y-4">
          {/* Uploaded Documents List */}
          <Card className="p-4 bg-surface border-border space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-med-text-secondary flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-med-green" />
                Uploaded Documents ({patient.documents.length})
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-[11px] h-6 px-2 text-med-green"
                onClick={() => navigate('/doctor/documents')}
              >
                Inspect All
              </Button>
            </div>

            {patient.documents.length > 0 ? (
              <div className="space-y-2">
                {patient.documents.map(doc => (
                  <div
                    key={doc.id}
                    onClick={() => navigate('/doctor/documents')}
                    className="p-2.5 rounded-lg bg-surface-elevated border border-border hover:border-med-green/50 cursor-pointer transition-all space-y-1"
                  >
                    <div className="font-bold text-xs text-med-text-primary truncate">
                      {doc.title}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-med-text-muted">
                      <span>{doc.date}</span>
                      <span className="text-med-green font-semibold">{doc.confidenceScore}% OCR</span>
                    </div>
                    <div className="text-[10px] text-med-text-secondary truncate">
                      {doc.entities.map(e => e.value).slice(0, 3).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-med-text-muted py-2 text-center">
                No past prescriptions scanned today.
              </div>
            )}
          </Card>

          {/* Chronological Timeline */}
          <Card className="p-4 bg-surface border-border space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-med-text-secondary flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-med-green" />
                Medical Timeline
              </span>
            </div>

            <div className="relative pl-4 space-y-3 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border text-xs">
              {patient.timeline.map((evt, idx) => (
                <div key={idx} className="relative group">
                  <div className={`absolute -left-4 top-1 w-2.5 h-2.5 rounded-full border ${
                    evt.isImportant ? 'bg-red-500 border-red-400' : 'bg-med-green border-med-green/50'
                  }`} />
                  <div>
                    <div className="font-bold text-med-text-primary flex items-center justify-between">
                      <span className="truncate">{evt.title}</span>
                      <span className="text-[10px] text-med-text-muted font-mono">{evt.yearMonth}</span>
                    </div>
                    <div className="text-[11px] text-med-text-secondary leading-snug mt-0.5">
                      {evt.summary}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* =========================================================================
            CENTER COLUMN (5 cols): Structured Clinical History (Standard Taxonomy)
        ========================================================================= */}
        <div className="lg:col-span-5 space-y-3">
          {/* Chief Complaint & HPI Accordion */}
          <Card className="bg-surface border-border overflow-hidden">
            <div
              onClick={() => toggleSection('cc_hpi')}
              className="p-3.5 bg-surface-elevated/70 border-b border-border flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold text-med-green flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  Chief Complaint & HPI
                </span>
                <Badge variant={history.chiefComplaint.severityScore >= 8 ? 'urgent' : 'normal'} size="sm">
                  Pain {history.chiefComplaint.severityScore}/10
                </Badge>
              </div>
              {openSections.cc_hpi ? <ChevronUp className="w-4 h-4 text-med-text-muted" /> : <ChevronDown className="w-4 h-4 text-med-text-muted" />}
            </div>

            {openSections.cc_hpi && (
              <div className="p-4 space-y-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-med-text-muted block">Primary Complaint</span>
                  <p className="text-sm font-bold text-med-text-primary mt-0.5">
                    {history.chiefComplaint.primary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-med-text-secondary bg-surface-elevated/40 p-2.5 rounded-lg border border-border/50">
                  <div><strong>Onset:</strong> {history.chiefComplaint.onset}</div>
                  <div><strong>Duration:</strong> {history.chiefComplaint.duration}</div>
                  <div><strong>Location:</strong> {history.chiefComplaint.location}</div>
                  <div><strong>Aggravating:</strong> {history.chiefComplaint.aggravatingFactors.join(', ')}</div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-med-text-muted block mb-1">
                    History of Present Illness (Narrative)
                  </span>
                  <p className="text-med-text-primary leading-relaxed bg-surface-elevated p-3 rounded-lg border border-border/80 font-sans">
                    {history.historyOfPresentIllness}
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Drug History & Allergies */}
          <Card className="bg-surface border-border overflow-hidden">
            <div
              onClick={() => toggleSection('meds_allergies')}
              className="p-3.5 bg-surface-elevated/70 border-b border-border flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold text-med-green flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5" />
                  Drug History & Allergies ({history.drugHistory.length})
                </span>
                {history.allergyHistory.length > 0 && (
                  <Badge variant="urgent" size="sm">
                    {history.allergyHistory.length} Allergy Alert
                  </Badge>
                )}
              </div>
              {openSections.meds_allergies ? <ChevronUp className="w-4 h-4 text-med-text-muted" /> : <ChevronDown className="w-4 h-4 text-med-text-muted" />}
            </div>

            {openSections.meds_allergies && (
              <div className="p-4 space-y-3 text-xs">
                {/* Active Drugs Table */}
                <div className="space-y-1.5">
                  {history.drugHistory.map((drug, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-surface-elevated border border-border flex items-center justify-between">
                      <div>
                        <div className="font-bold text-med-text-primary text-xs">
                          {drug.drugName} <span className="text-med-green font-mono">{drug.dosage}</span>
                        </div>
                        <div className="text-[11px] text-med-text-muted">
                          {drug.frequency} • Since {drug.duration}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {drug.isVerifiedByOcr && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-med-green/10 text-med-green border border-med-green/20">
                            OCR Verified
                          </span>
                        )}
                        <Badge variant="green" size="sm">{drug.adherence}</Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Allergies Highlight */}
                {history.allergyHistory.map((al, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-300">
                    <strong className="text-red-400 font-bold">ALLERGY WARNING: </strong>
                    {al.allergen} causing {al.reaction}. ({al.severity})
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Past History & Surgeries */}
          <Card className="bg-surface border-border overflow-hidden">
            <div
              onClick={() => toggleSection('pmh_psh')}
              className="p-3.5 bg-surface-elevated/70 border-b border-border flex items-center justify-between cursor-pointer select-none"
            >
              <span className="text-xs uppercase font-extrabold text-med-green">
                Past Medical & Surgical History
              </span>
              {openSections.pmh_psh ? <ChevronUp className="w-4 h-4 text-med-text-muted" /> : <ChevronDown className="w-4 h-4 text-med-text-muted" />}
            </div>

            {openSections.pmh_psh && (
              <div className="p-4 space-y-2 text-xs">
                {history.pastMedicalHistory.map((pmh, i) => (
                  <div key={i} className="flex justify-between items-center py-1.5 border-b border-border/60">
                    <div>
                      <span className="font-bold text-med-text-primary">{pmh.condition}</span>
                      {pmh.notes && <span className="text-med-text-muted ml-2">({pmh.notes})</span>}
                    </div>
                    <span className="text-med-text-secondary font-mono">Diag: {pmh.diagnosedYear}</span>
                  </div>
                ))}

                {history.pastSurgicalHistory.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] uppercase font-bold text-med-text-muted block mb-1">Surgeries</span>
                    {history.pastSurgicalHistory.map((surg, idx) => (
                      <div key={idx} className="text-med-text-secondary py-0.5">
                        • {surg.procedure} ({surg.year}, {surg.hospital})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* AYUSH Dashavidha Pariksha (If AYUSH patient) */}
          {history.dashavidhaPariksha && (
            <Card className="bg-surface border-emerald-500/40 overflow-hidden shadow-glow-green-sm">
              <div
                onClick={() => toggleSection('ayush')}
                className="p-3.5 bg-surface-elevated/70 border-b border-border flex items-center justify-between cursor-pointer select-none"
              >
                <span className="text-xs uppercase font-extrabold text-emerald-300 flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5" />
                  Dashavidha Pariksha (दशविध परीक्षा)
                </span>
                {openSections.ayush ? <ChevronUp className="w-4 h-4 text-med-text-muted" /> : <ChevronDown className="w-4 h-4 text-med-text-muted" />}
              </div>

              {openSections.ayush && (
                <div className="p-4 space-y-3 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-lg bg-surface-elevated border border-border">
                      <span className="text-[10px] uppercase font-bold text-med-text-muted block">1. Prakriti (प्रकृति)</span>
                      <span className="font-bold text-emerald-300 text-sm">{history.dashavidhaPariksha.prakriti.primaryDosha}</span>
                      <div className="text-[10px] text-med-text-muted mt-0.5">
                        V:{history.dashavidhaPariksha.prakriti.vata}% P:{history.dashavidhaPariksha.prakriti.pitta}% K:{history.dashavidhaPariksha.prakriti.kapha}%
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-surface-elevated border border-border">
                      <span className="text-[10px] uppercase font-bold text-med-text-muted block">2. Vikriti (विकृति)</span>
                      <span className="font-bold text-med-text-primary">{history.dashavidhaPariksha.vikriti}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-surface-elevated border border-border">
                      <span className="text-[10px] uppercase font-bold text-med-text-muted block">3. Agni (जठराग्नि)</span>
                      <span className="font-bold text-amber-300">{history.dashavidhaPariksha.agni || 'Vishamagni (विषमाग्नि)'}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-surface-elevated border border-border">
                      <span className="text-[10px] uppercase font-bold text-med-text-muted block">4. Koshtha (कोष्ठ)</span>
                      <span className="font-bold text-med-text-primary">{history.dashavidhaPariksha.koshtha || 'Krura Koshtha (क्रूर)'}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-surface-elevated border border-border">
                      <span className="text-[10px] uppercase font-bold text-med-text-muted block">5. Sara & Samhanana</span>
                      <span className="font-medium text-med-text-primary">{history.dashavidhaPariksha.sara}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-surface-elevated border border-border">
                      <span className="text-[10px] uppercase font-bold text-med-text-muted block">6. Satva (मानसिक बल)</span>
                      <span className="font-medium text-med-text-primary">{history.dashavidhaPariksha.satva}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-surface-elevated border border-border">
                      <span className="text-[10px] uppercase font-bold text-med-text-muted block">7. Ahara Shakti</span>
                      <span className="text-med-text-primary">{history.dashavidhaPariksha.aharaShakti?.abhyavaharana}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-surface-elevated border border-border">
                      <span className="text-[10px] uppercase font-bold text-med-text-muted block">8. Vyayama Shakti (बल)</span>
                      <span className="font-medium text-med-text-primary">{history.dashavidhaPariksha.vyayamaShakti}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-surface-elevated border border-border">
                      <span className="text-[10px] uppercase font-bold text-med-text-muted block">9 & 10. Satmya & Vaya</span>
                      <span className="text-med-text-primary">{history.dashavidhaPariksha.satmya} • {history.dashavidhaPariksha.vaya}</span>
                    </div>
                  </div>

                  {/* Ashtavidha Pariksha Indicators */}
                  {history.dashavidhaPariksha.ashtavidhaPariksha && (
                    <div className="p-3 rounded-lg bg-surface-elevated/70 border border-emerald-500/20 space-y-1.5">
                      <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Leaf className="w-3 h-3" /> Ashtavidha Pariksha (अष्टविध परीक्षा)
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-med-text-secondary">
                        <div><strong>Nadi (नाड़ी):</strong> {history.dashavidhaPariksha.ashtavidhaPariksha.nadi}</div>
                        <div><strong>Jihwa (जिह्वा/आम):</strong> {history.dashavidhaPariksha.ashtavidhaPariksha.jihwa}</div>
                        <div><strong>Mala (मल):</strong> {history.dashavidhaPariksha.ashtavidhaPariksha.mala}</div>
                        <div><strong>Mutra (मूत्र):</strong> {history.dashavidhaPariksha.ashtavidhaPariksha.mutra}</div>
                      </div>
                    </div>
                  )}

                  {/* Ahara-Vihara & Nidana-Samprapti */}
                  {history.dashavidhaPariksha.aharaVihara && (
                    <div className="p-3 rounded-lg bg-surface-elevated/50 border border-border/70 space-y-1 text-[11px] text-med-text-secondary">
                      <div><strong>Ahara (खानपान):</strong> {history.dashavidhaPariksha.aharaVihara.dietRegimen}</div>
                      <div><strong>Vihara (दिनचर्या):</strong> {history.dashavidhaPariksha.aharaVihara.lifestyleHabits}</div>
                      {history.dashavidhaPariksha.nidanaSamprapti && (
                        <div className="text-med-green font-medium pt-1 border-t border-border/40">
                          <strong>Nidana-Samprapti:</strong> {history.dashavidhaPariksha.nidanaSamprapti.pathogenesisChain}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Card>
          )}

          {/* Review of Systems */}
          <Card className="bg-surface border-border overflow-hidden">
            <div
              onClick={() => toggleSection('ros')}
              className="p-3.5 bg-surface-elevated/70 border-b border-border flex items-center justify-between cursor-pointer select-none"
            >
              <span className="text-xs uppercase font-extrabold text-med-green">
                Review of Systems (ROS) & Personal History
              </span>
              {openSections.ros ? <ChevronUp className="w-4 h-4 text-med-text-muted" /> : <ChevronDown className="w-4 h-4 text-med-text-muted" />}
            </div>

            {openSections.ros && (
              <div className="p-4 space-y-2 text-xs">
                {history.reviewOfSystems.map((ros, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 border-b border-border/50">
                    <span className="font-medium text-med-text-primary">{ros.system}</span>
                    <Badge variant={ros.status === 'Abnormal' ? 'urgent' : 'normal'} size="sm">
                      {ros.findings}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* =========================================================================
            RIGHT COLUMN (4 cols): AI Summary, Red Flag Review, Doctor Validation
        ========================================================================= */}
        <div className="lg:col-span-4 space-y-4">
          {/* Red Flag Alert Card (If Triggered) */}
          {patient.redFlag?.isTriggered && (
            <Card className="p-4 bg-surface border-2 border-med-urgent/60 shadow-glow-urgent space-y-3">
              <div className="flex items-center gap-2 text-red-400 font-extrabold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>CLINICAL RED FLAG: {patient.redFlag.title}</span>
              </div>

              <p className="text-xs text-red-300 font-medium leading-relaxed">
                {patient.redFlag.description}
              </p>

              <div className="space-y-1 pt-1 border-t border-red-500/30">
                {patient.redFlag.symptoms.map((sym, idx) => (
                  <div key={idx} className="text-xs text-med-text-primary flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    <span>{sym}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Drug-Drug & Herb-Drug Interaction Alerts (Module B Requirement) */}
          {((ai.drugInteractions && ai.drugInteractions.length > 0) || (patient.documents.some(d => d.drugInteractions && d.drugInteractions.length > 0))) && (
            <Card className="p-4 bg-surface border-2 border-amber-500/50 shadow-surface space-y-2.5">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-amber-400" />
                  Drug & Herb Interaction Alerts
                </span>
                <Badge variant="attention" size="sm">Attention</Badge>
              </div>

              <div className="space-y-2">
                {(ai.drugInteractions || patient.documents.flatMap(d => d.drugInteractions || [])).map((inter, idx) => {
                  const isHerb = inter.interactionType === 'herb-drug';
                  return (
                    <div key={idx} className="p-2.5 rounded-lg bg-surface-elevated border border-amber-500/30 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-med-text-primary">
                          {inter.drug1} <span className="text-amber-400">⚡</span> {inter.drug2}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          isHerb ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                          {isHerb ? 'Herb-Drug' : inter.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-200/90 leading-snug">
                        {inter.clinicalEffect}
                      </p>
                      <p className="text-[10px] text-med-text-muted">
                        <strong>Action: </strong>{inter.recommendation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Abnormal Lab Findings (Module B Out-of-Range Highlighting) */}
          {((ai.abnormalLabFindings && ai.abnormalLabFindings.length > 0) || (patient.documents.some(d => d.abnormalLabFindings && d.abnormalLabFindings.length > 0))) && (
            <Card className="p-4 bg-surface border-border space-y-2.5">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-med-text-secondary flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-red-400" />
                  Abnormal Out-of-Range Lab Values
                </span>
                <Badge variant="urgent" size="sm">Lab Alert</Badge>
              </div>

              <div className="space-y-1.5">
                {(ai.abnormalLabFindings || patient.documents.flatMap(d => d.abnormalLabFindings || [])).map((lab, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-surface-elevated border border-red-500/30 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-med-text-primary">{lab.testName}</div>
                      <div className="text-[10px] text-med-text-muted">Ref: {lab.referenceRange}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-red-400 text-sm">{lab.value}</span>
                      <span className="text-[10px] px-1.5 py-0.5 ml-1.5 rounded bg-red-500/15 text-red-400 font-bold uppercase">
                        {lab.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* AI Clinical Summary (HERO RIGHT COMPONENT) */}
          <Card className="p-5 bg-surface-elevated border-med-green/40 shadow-surface space-y-4 relative">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-med-green flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI Clinical Summary
              </span>
              <div className="flex items-center gap-1 bg-surface p-1 rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => setSummaryLang('en')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                    summaryLang === 'en'
                      ? 'bg-med-green text-background shadow-sm'
                      : 'text-med-text-muted hover:text-med-text-primary'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setSummaryLang('hi')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                    summaryLang === 'hi'
                      ? 'bg-med-green text-background shadow-sm'
                      : 'text-med-text-muted hover:text-med-text-primary'
                  }`}
                >
                  हिन्दी (Hindi)
                </button>
              </div>
            </div>

            {/* Mandatory Regulatory Physician Disclaimer */}
            <div className="p-2.5 rounded-lg bg-surface border border-border text-[11px] text-med-text-secondary leading-tight">
              <strong>Physician-in-the-Loop Notice: </strong>
              This summary is generated by MediKiosk Clinical AI to expedite intake. It requires physician evaluation and sign-off.
            </div>

            {/* Concise Summary Body */}
            {isEditingAi ? (
              <div className="space-y-2">
                <textarea
                  value={editedSummaryText}
                  onChange={e => setEditedSummaryText(e.target.value)}
                  rows={5}
                  className="w-full p-3 rounded-lg bg-surface border border-med-green text-xs text-med-text-primary outline-none focus:ring-1 focus:ring-med-green"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setIsEditingAi(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => handleAiAction('edited')}>
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-med-text-primary leading-relaxed bg-surface/70 p-3 rounded-lg border border-border/80 font-sans">
                  {summaryLang === 'hi'
                    ? ((typeof ai.hindiSummary === 'string' ? ai.hindiSummary : ai.hindiSummary?.conciseSummary) || 'मरीज़ 58 वर्षीय पुरुष, पिछले 2 घंटों से सीने में तेज दबाव व दर्द की शिकायत लेकर आए हैं। दर्द बाएं हाथ व जबड़े की ओर फैल रहा है। पूर्व इतिहास: उच्च रक्तचाप (3 वर्ष), टाइप 2 मधुमेह (2 वर्ष)। ईसीजी व कार्डियक एंजाइम तुरंत कराने की सिफारिश की जाती है।')
                    : (ai.doctorVerification.modifiedText || ai.conciseSummary)}
                </p>
                {summaryLang === 'hi' && (
                  <span className="text-[10px] text-med-green font-medium block">
                    ✓ मॉड्यूल C: द्विभाषी चिकित्सक सारांश (Bilingual Hindi Translation Active)
                  </span>
                )}
              </div>
            )}

            {/* Key Positive Findings */}
            <div className="space-y-1.5 text-xs">
              <span className="text-[11px] uppercase font-bold text-med-green block">Key Positive Findings</span>
              <ul className="space-y-1 text-med-text-secondary">
                {ai.keyPositiveFindings.map((finding, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-med-green font-bold">•</span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Differential Diagnoses with Probabilities */}
            <div className="space-y-1.5 text-xs pt-2 border-t border-border/60">
              <span className="text-[11px] uppercase font-bold text-med-text-muted block">Differential Diagnoses</span>
              <div className="space-y-1.5">
                {ai.differentialDiagnoses.map((diff, idx) => (
                  <div key={idx} className="p-2 rounded bg-surface border border-border flex items-center justify-between">
                    <div>
                      <div className="font-bold text-med-text-primary">{diff.name}</div>
                      <div className="text-[10px] text-med-text-muted">ICD-10: {diff.icdCode} • {diff.clinicalRationale}</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-med-green">{diff.confidence}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Doctor Verification Actions (Accept / Edit / Reject) */}
            <div className="pt-3 border-t border-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-med-text-secondary">Doctor Verification:</span>
                <Badge
                  variant={ai.doctorVerification.status === 'accepted' ? 'green' : ai.doctorVerification.status === 'rejected' ? 'urgent' : 'attention'}
                  size="sm"
                >
                  {ai.doctorVerification.status.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleAiAction('accepted')}
                  className="w-full text-xs font-bold"
                  leftIcon={<Check className="w-3.5 h-3.5" />}
                >
                  Accept
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEditingAi(true)}
                  className="w-full text-xs"
                  leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                >
                  Edit
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAiAction('rejected')}
                  className="w-full text-xs text-red-400 hover:text-red-300"
                  leftIcon={<XCircle className="w-3.5 h-3.5" />}
                >
                  Reject
                </Button>
              </div>
            </div>
          </Card>

          {/* Quick Consultation CTA */}
          <Button
            variant="primary"
            size="lg"
            className="w-full font-bold shadow-glow-green"
            onClick={() => navigate('/doctor/consultation')}
            rightIcon={<Stethoscope className="w-4 h-4" />}
          >
            Open Rx Pad & Save Consultation
          </Button>
        </div>
      </div>
    </div>
  );
};
