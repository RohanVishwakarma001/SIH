import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  CheckCircle2, 
  Edit3, 
  ZoomIn, 
  RotateCw, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Calendar,
  User,
  Plus,
  AlertTriangle,
  Activity,
  Pill,
  ShieldAlert
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const KioskDocumentReview: React.FC = () => {
  const navigate = useNavigate();
  const { activeOcrDoc, updateExtractedEntity } = useKiosk();

  const doc = activeOcrDoc;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const handleStartEdit = (id: string, currentValue: string) => {
    setEditingId(id);
    setEditValue(currentValue);
  };

  const handleSaveEdit = (id: string) => {
    if (!doc) return;
    updateExtractedEntity(doc.id, id, editValue);
    setEditingId(null);
  };

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center max-w-xl mx-auto py-16 gap-3 text-med-text-secondary text-sm">
        <FileText className="w-8 h-8 text-med-text-muted" />
        <p>No document has been uploaded yet.</p>
        <Button variant="primary" size="sm" onClick={() => navigate('/patient/documents')}>
          Upload a Document
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-5xl w-full mx-auto py-4 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-border text-xs font-semibold text-med-text-secondary mb-1">
            <CheckCircle2 className="w-4 h-4 text-med-green" />
            <span>Step 5 of 6 • दस्तावेज़ सत्यापन (Review OCR)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-med-text-primary">
            Review Extracted Medical Information
          </h1>
          <p className="text-xs text-med-text-secondary mt-0.5">
            Verify the medications and diagnoses extracted by AI before sending them to the doctor.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/patient/timeline')}
          className="font-bold shadow-glow-green"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Confirm & View Timeline / पुष्टि करें
        </Button>
      </div>

      {/* Module B Intelligence Alerts: Out-of-Range Lab Values & Drug-Drug Interactions */}
      {((doc.drugInteractions && doc.drugInteractions.length > 0) || (doc.abnormalLabFindings && doc.abnormalLabFindings.length > 0)) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Drug Interactions Banner */}
          {doc.drugInteractions && doc.drugInteractions.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Potential Drug-Drug Interaction Flagged</span>
              </div>
              {doc.drugInteractions.map((ddi, i) => (
                <div key={i} className="text-xs space-y-1 bg-surface/50 p-2.5 rounded-lg border border-amber-500/20">
                  <div className="font-semibold text-med-text-primary flex items-center justify-between">
                    <span>{ddi.drug1} + {ddi.drug2}</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">{ddi.severity}</span>
                  </div>
                  <p className="text-med-text-secondary">{ddi.clinicalEffect}</p>
                  <p className="text-amber-300 font-medium">Rec: {ddi.recommendation}</p>
                </div>
              ))}
            </div>
          )}

          {/* Abnormal Out-of-Range Lab Values */}
          {doc.abnormalLabFindings && doc.abnormalLabFindings.length > 0 && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 space-y-2">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                <Activity className="w-4 h-4" />
                <span>Abnormal Out-of-Range Lab Findings</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {doc.abnormalLabFindings.map((lab, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-surface/50 border border-red-500/20 text-xs">
                    <div>
                      <div className="font-bold text-med-text-primary">{lab.testName}</div>
                      <div className="text-[11px] text-med-text-muted">Ref Range: {lab.referenceRange}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-red-400">{lab.value}</span>
                      <span className="ml-2 px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-bold text-[10px] uppercase">{lab.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Split Layout: Original Scanned Document vs Extracted Entities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Original Document View (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-med-text-secondary px-1">
            <span>Original Scanned Document</span>
            <div className="flex items-center gap-2">
              <button className="p-1 rounded bg-surface hover:bg-surface-elevated text-med-text-secondary">
                <ZoomIn className="w-4 h-4" />
              </button>
              <button className="p-1 rounded bg-surface hover:bg-surface-elevated text-med-text-secondary">
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <Card className="p-5 bg-surface-elevated border-border rounded-xl space-y-4 font-mono text-xs">
            {/* Header of Prescription */}
            <div className="border-b border-border pb-3">
              <div className="font-bold text-sm text-med-text-primary uppercase tracking-wide">
                {doc.facility}
              </div>
              <div className="text-med-text-secondary flex items-center justify-between mt-1 text-[11px]">
                <span>Date: {doc.date}</span>
                <span>OPD Slip #88219</span>
              </div>
              <div className="text-med-green text-[11px] font-semibold mt-0.5">
                Consultant: {doc.doctorName}
              </div>
            </div>

            {/* Body of Prescription with dynamic bounding highlights */}
            <div className="space-y-3 pt-1 text-med-text-primary leading-relaxed">
              {/* Document Image/Thumbnail if available */}
              {doc.thumbnail && (doc.thumbnail.startsWith('data:image') || doc.thumbnail.startsWith('http') || doc.thumbnail.startsWith('/')) && (
                <div className="rounded-lg overflow-hidden border border-border max-h-48 mb-2 bg-black/30 flex items-center justify-center">
                  <img src={doc.thumbnail} alt={doc.title} className="max-h-48 object-contain w-full" />
                </div>
              )}

              {/* Detected Diagnosis */}
              {doc.entities.filter(e => e.category === 'diagnosis').length > 0 ? (
                <div className="p-2.5 rounded bg-surface border border-med-green/30 relative">
                  <span className="text-[10px] uppercase font-bold text-med-green block mb-1">
                    Detected Diagnosis
                  </span>
                  {doc.entities.filter(e => e.category === 'diagnosis').map((e, idx) => (
                    <div key={idx} className="font-semibold text-sm text-med-text-primary">{e.value}</div>
                  ))}
                </div>
              ) : null}

              {/* Surgical & Procedure History */}
              {(doc.procedureHistory?.length || doc.entities.filter(e => e.category === 'procedure').length > 0) ? (
                <div className="p-2.5 rounded bg-surface border border-blue-500/30 relative">
                  <span className="text-[10px] uppercase font-bold text-blue-400 block mb-1">
                    Past Procedure & Surgical History
                  </span>
                  {doc.procedureHistory?.map((proc, idx) => (
                    <div key={idx} className="font-semibold text-xs text-med-text-primary">• {proc}</div>
                  )) || doc.entities.filter(e => e.category === 'procedure').map((e, idx) => (
                    <div key={idx} className="font-semibold text-xs text-med-text-primary">• {e.value}</div>
                  ))}
                </div>
              ) : null}

              {/* Prescribed Medications */}
              {doc.entities.filter(e => e.category === 'medication').length > 0 ? (
                <div className="p-2.5 rounded bg-surface border border-med-green/30 relative space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-med-green block">
                    Rx (Prescribed Medications)
                  </span>
                  <div className="space-y-1.5">
                    {doc.entities.filter(e => e.category === 'medication').map((e, idx) => (
                      <div key={idx} className="flex justify-between items-center font-semibold text-xs text-med-text-primary">
                        <span>{idx + 1}. {e.value} {e.dosage ? `(${e.dosage})` : ''}</span>
                        {e.frequency && <span className="text-med-green font-mono text-[11px]">{e.frequency}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Labs / Clinical observations */}
              {doc.entities.filter(e => e.category !== 'diagnosis' && e.category !== 'medication').length > 0 ? (
                <div className="p-2.5 rounded bg-surface border border-border text-[11px] text-med-text-secondary space-y-1">
                  <span className="text-[10px] uppercase font-bold text-med-text-muted block">
                    Clinical Observations / Labs
                  </span>
                  {doc.entities.filter(e => e.category !== 'diagnosis' && e.category !== 'medication').map((e, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span>{e.value}</span>
                      {e.dosage && <span className="text-med-text-muted font-mono">{e.dosage}</span>}
                    </div>
                  ))}
                </div>
              ) : null}

              {doc.entities.length === 0 && (
                <div className="p-3 text-center text-med-text-muted text-xs">
                  No entities extracted from this document yet.
                </div>
              )}
            </div>

            {/* OCR Confidence Tag */}
            <div className="pt-2 border-t border-border flex items-center justify-between text-[11px]">
              <span className="text-med-text-muted">OCR Confidence Score:</span>
              <span className="text-med-green font-bold">{doc.confidenceScore}% High Accuracy</span>
            </div>
          </Card>
        </div>

        {/* Right Column: Extracted Entities List with Edit Option (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-med-text-secondary px-1">
            <span className="flex items-center gap-1.5 text-med-green">
              <Sparkles className="w-3.5 h-3.5" />
              Extracted Medical Entities ({doc.entities.length})
            </span>
            <span className="text-xs text-med-text-muted">Tap to edit any mistake</span>
          </div>

          <div className="space-y-2.5">
            {doc.entities.map(entity => {
              const isEditing = editingId === entity.id;

              return (
                <Card
                  key={entity.id}
                  className="p-4 bg-surface border-border hover:border-med-green/40 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={
                          entity.category === 'medication' ? 'green' : 
                          entity.category === 'diagnosis' ? 'attention' : 
                          entity.category === 'procedure' ? 'normal' : 'normal'
                        }
                        size="sm"
                      >
                        {entity.category === 'procedure' ? 'PROCEDURE / SURGERY' : entity.category.toUpperCase()}
                      </Badge>
                      {entity.isAbnormal && (
                        <Badge variant="urgent" size="sm">OUT OF RANGE</Badge>
                      )}
                      <span className="text-[11px] text-med-text-muted font-mono">
                        {entity.confidence}% confidence
                      </span>
                    </div>

                    {isEditing ? (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          className="px-3 py-1.5 rounded-lg bg-surface-elevated border border-med-green text-sm text-med-text-primary outline-none flex-1"
                        />
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleSaveEdit(entity.id)}
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-base text-med-text-primary">
                            {entity.value}
                          </div>
                          {entity.dosage && (
                            <div className="text-xs text-med-text-secondary">
                              Dose: {entity.dosage} • Frequency: {entity.frequency}
                            </div>
                          )}
                          {entity.referenceRange && (
                            <div className="text-xs text-med-text-muted mt-0.5">
                              Reference Range: <span className="font-mono text-med-text-secondary">{entity.referenceRange}</span>
                              {entity.unit && ` (${entity.unit})`}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {!isEditing && (
                    <button
                      onClick={() => handleStartEdit(entity.id, entity.value)}
                      className="p-2 rounded-lg bg-surface-elevated hover:bg-surface-hover border border-border text-med-text-secondary hover:text-med-green transition-all"
                      title="Edit this entity"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </Card>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated border border-border/70 flex items-center justify-between">
            <div className="text-xs text-med-text-secondary">
              Need to add another prescription or report?
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/patient/documents')}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Scan Another Document
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
