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
  Plus
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { MOCK_DOCUMENTS } from '../../data/mockData';

export const KioskDocumentReview: React.FC = () => {
  const navigate = useNavigate();
  const { activeOcrDoc, updateExtractedEntity } = useKiosk();

  const doc = activeOcrDoc || MOCK_DOCUMENTS[0];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const handleStartEdit = (id: string, currentValue: string) => {
    setEditingId(id);
    setEditValue(currentValue);
  };

  const handleSaveEdit = (id: string) => {
    updateExtractedEntity(doc.id, id, editValue);
    setEditingId(null);
  };

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

            {/* Body of Prescription with simulated bounding highlights */}
            <div className="space-y-3 pt-1 text-med-text-primary leading-relaxed">
              <div className="p-2 rounded bg-surface border border-med-green/30 relative">
                <span className="text-[10px] uppercase font-bold text-med-green block">
                  Detected Diagnosis
                </span>
                <span className="font-semibold text-sm">Essential Hypertension & Dyslipidemia</span>
              </div>

              <div className="p-2 rounded bg-surface border border-med-green/30 relative space-y-1">
                <span className="text-[10px] uppercase font-bold text-med-green block">
                  Rx (Prescribed Medications)
                </span>
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>1. Tab. Telmisartan 40mg</span>
                    <span className="text-med-green">PO OD</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>2. Tab. Atorvastatin 20mg</span>
                    <span className="text-med-green">PO HS</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>3. Tab. Metformin 500mg</span>
                    <span className="text-med-green">PO BD</span>
                  </div>
                </div>
              </div>

              <div className="p-2 rounded bg-surface border border-border text-[11px] text-med-text-secondary">
                Advised: 12-Lead ECG, Lipid profile. Review in 4 weeks.
              </div>
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
                        variant={entity.category === 'medication' ? 'green' : entity.category === 'diagnosis' ? 'attention' : 'normal'}
                        size="sm"
                      >
                        {entity.category.toUpperCase()}
                      </Badge>
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
