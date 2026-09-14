import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft, 
  Calendar, 
  Building2, 
  User, 
  ShieldCheck, 
  Download,
  Check,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { useDoctor } from '../../context/DoctorContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const DoctorDocumentViewer: React.FC = () => {
  const navigate = useNavigate();
  const { selectedPatient } = useDoctor();

  const documents = selectedPatient?.documents || [];
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);

  const currentDoc = documents.find(d => d.id === selectedDocId) || documents[0];

  useEffect(() => {
    if (!selectedDocId && documents.length > 0) {
      setSelectedDocId(documents[0].id);
    }
  }, [documents, selectedDocId]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  if (!selectedPatient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-med-text-secondary text-sm">
        <p>No patient selected.</p>
        <Button variant="primary" size="sm" onClick={() => navigate('/doctor/dashboard')}>
          Return to OPD Queue
        </Button>
      </div>
    );
  }

  if (!currentDoc) {
    return (
      <div className="space-y-4 max-w-7xl mx-auto animate-in fade-in duration-300">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(`/doctor/patient/${selectedPatient.id}`)}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Patient
        </Button>
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-2 text-med-text-secondary text-sm">
          <FileText className="w-8 h-8 text-med-text-muted" />
          <p>{selectedPatient.name} has no digitized documents yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/doctor/patient/${selectedPatient.id}`)}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Patient
          </Button>
          <div>
            <h1 className="text-xl font-black text-med-text-primary">
              Clinical Document Intelligence Workspace
            </h1>
            <p className="text-xs text-med-text-secondary">
              Patient: {selectedPatient.name} ({selectedPatient.token}) • Optical Character Recognition & Entity Verification
            </p>
          </div>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-2 p-1 bg-surface-elevated rounded-xl border border-border">
          <Button variant="ghost" size="sm" onClick={handleZoomOut} title="Zoom Out">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs font-mono font-bold text-med-text-primary px-2">{zoomLevel}%</span>
          <Button variant="ghost" size="sm" onClick={handleZoomIn} title="Zoom In">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <span className="text-border">|</span>
          <Button variant="ghost" size="sm" onClick={handleRotate} title="Rotate 90deg">
            <RotateCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Document Selector Column (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="text-xs font-bold text-med-text-secondary uppercase tracking-wider px-1">
            Available Documents ({documents.length})
          </div>

          <div className="space-y-2">
            {documents.map(doc => (
              <Card
                key={doc.id}
                interactive
                onClick={() => setSelectedDocId(doc.id)}
                className={`p-3 text-left transition-all ${
                  selectedDocId === doc.id
                    ? 'border-med-green bg-surface-elevated shadow-glow-green-sm'
                    : 'border-border bg-surface'
                }`}
              >
                <div className="font-bold text-xs text-med-text-primary truncate">
                  {doc.title}
                </div>
                <div className="flex items-center justify-between text-[11px] text-med-text-secondary mt-1">
                  <span>{doc.date}</span>
                  <Badge variant="green" size="sm">{doc.confidenceScore}%</Badge>
                </div>
              </Card>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-surface border border-border text-xs space-y-2">
            <div className="font-bold text-med-green flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              OCR Intelligence Model
            </div>
            <p className="text-[11px] text-med-text-secondary leading-snug">
              Trained on Indian physician handwriting, standardized abbreviations (OD/BD/TDS/HS), and common pharmacy brands.
            </p>
          </div>
        </div>

        {/* High-Resolution Document Canvas (5 cols) */}
        <div className="lg:col-span-5 space-y-2">
          <div className="text-xs font-bold text-med-text-secondary flex items-center justify-between px-1">
            <span>High-Resolution Document Preview</span>
            <span className="text-med-green font-mono">{currentDoc.confidenceScore}% Confidence</span>
          </div>

          <Card className="p-6 bg-surface-elevated border-border rounded-xl min-h-[500px] flex flex-col justify-between overflow-hidden relative shadow-surface">
            <div 
              className="space-y-4 transition-transform duration-200"
              style={{ 
                transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'top center'
              }}
            >
              {/* Simulated Paper Slip */}
              <div className="border-b-2 border-border pb-3">
                <div className="text-sm font-black text-med-text-primary uppercase tracking-wide">
                  {currentDoc.facility}
                </div>
                <div className="text-xs text-med-text-muted mt-0.5">
                  Date: {currentDoc.date} • Consultant: {currentDoc.doctorName}
                </div>
              </div>

              {/* Extracted medications, derived from this document's real entities */}
              {currentDoc.entities.some(e => e.category === 'medication') && (
                <div className="p-3 rounded-lg bg-surface border border-med-green/40 space-y-2 text-xs">
                  <div className="text-[10px] uppercase font-bold text-med-green flex items-center justify-between">
                    <span>Extracted Medications</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-med-green" />
                  </div>
                  <div className="font-mono text-med-text-primary space-y-1">
                    {currentDoc.entities.filter(e => e.category === 'medication').map((e, i) => (
                      <div key={i}>{e.value}{e.dosage ? ` (${e.dosage})` : ''}{e.frequency ? ` ${e.frequency}` : ''}</div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 rounded-lg bg-surface border border-border text-xs text-med-text-secondary leading-relaxed font-mono">
                {currentDoc.rawOcrText}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-med-text-muted">
              <span>Page 1 of 1</span>
              <span>Scanned via MediKiosk Terminal 01</span>
            </div>
          </Card>
        </div>

        {/* Extracted Clinical Entities & Confidence Inspector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          {/* Drug Interactions Banner */}
          {currentDoc.drugInteractions && currentDoc.drugInteractions.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 space-y-1.5 animate-in fade-in">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Potential Drug-Drug Interaction</span>
              </div>
              {currentDoc.drugInteractions.map((ddi, i) => (
                <div key={i} className="text-[11px] bg-surface/60 p-2 rounded border border-amber-500/20">
                  <div className="font-bold text-med-text-primary flex justify-between">
                    <span>{ddi.drug1} + {ddi.drug2}</span>
                    <span className="text-amber-400">{ddi.severity}</span>
                  </div>
                  <div className="text-med-text-secondary mt-0.5">{ddi.clinicalEffect}</div>
                  <div className="text-amber-300 font-medium mt-0.5">Rec: {ddi.recommendation}</div>
                </div>
              ))}
            </div>
          )}

          {/* Abnormal Lab Findings */}
          {currentDoc.abnormalLabFindings && currentDoc.abnormalLabFindings.length > 0 && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/40 space-y-1.5 animate-in fade-in">
              <div className="flex items-center gap-1.5 text-red-400 font-bold text-xs">
                <Activity className="w-3.5 h-3.5" />
                <span>Out-of-Range Lab Highlights</span>
              </div>
              <div className="space-y-1">
                {currentDoc.abnormalLabFindings.map((lab, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-1.5 rounded bg-surface/60 border border-red-500/20">
                    <div>
                      <div className="font-semibold text-med-text-primary text-[11px]">{lab.testName}</div>
                      <div className="text-[10px] text-med-text-muted">Ref: {lab.referenceRange}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-red-400 text-xs">{lab.value}</span>
                      <span className="ml-1.5 px-1 py-0.2 rounded bg-red-500/20 text-red-300 text-[9px] font-bold">{lab.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs font-bold text-med-text-secondary uppercase tracking-wider px-1">
            Extracted Clinical Entities ({currentDoc.entities.length})
          </div>

          <div className="space-y-2">
            {currentDoc.entities.map(ent => (
              <Card
                key={ent.id}
                className="p-3.5 bg-surface border-border hover:border-med-green/40 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <Badge
                    variant={ent.category === 'medication' ? 'green' : ent.category === 'diagnosis' ? 'attention' : 'normal'}
                    size="sm"
                  >
                    {ent.category.toUpperCase()}
                  </Badge>
                  <span className="text-xs font-mono font-bold text-med-green">
                    {ent.confidence}%
                  </span>
                </div>

                <div className="font-bold text-sm text-med-text-primary">
                  {ent.value}
                </div>

                {ent.dosage && (
                  <div className="text-xs text-med-text-secondary">
                    Dosage: {ent.dosage} • Frequency: {ent.frequency}
                  </div>
                )}

                <div className="pt-1 flex items-center justify-between text-[11px] text-med-text-muted border-t border-border/50">
                  <span>Status: Verified</span>
                  <Check className="w-3.5 h-3.5 text-med-green" />
                </div>
              </Card>
            ))}
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full font-bold shadow-glow-green"
            onClick={() => navigate('/doctor/consultation')}
          >
            Import to Active Consultation
          </Button>
        </div>
      </div>
    </div>
  );
};
