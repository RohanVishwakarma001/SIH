import React, { useState } from 'react';
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
  Check
} from 'lucide-react';
import { useDoctor } from '../../context/DoctorContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { MOCK_DOCUMENTS } from '../../data/mockData';

export const DoctorDocumentViewer: React.FC = () => {
  const navigate = useNavigate();
  const { selectedPatient } = useDoctor();

  const documents = selectedPatient.documents.length > 0 ? selectedPatient.documents : MOCK_DOCUMENTS;
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0].id);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);

  const currentDoc = documents.find(d => d.id === selectedDocId) || documents[0];

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

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

              {/* High-fidelity text box with bounding indicators */}
              <div className="p-3 rounded-lg bg-surface border border-med-green/40 space-y-2 text-xs">
                <div className="text-[10px] uppercase font-bold text-med-green flex items-center justify-between">
                  <span>Extracted Bounding Box 1 (Rx)</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-med-green" />
                </div>
                <div className="font-mono text-med-text-primary space-y-1">
                  <div>Tab. Telmisartan 40mg PO OD (Hypertension)</div>
                  <div>Tab. Atorvastatin 20mg PO HS (Dyslipidemia)</div>
                  <div>Tab. Metformin 500mg PO BD (T2DM)</div>
                </div>
              </div>

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
