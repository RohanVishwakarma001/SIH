import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ScanLine,
  CheckCircle2,
  Loader2,
  FileText,
  Clock,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { Card } from '../../components/ui/Card';
import { Progress } from '../../components/ui/Progress';
import { Button } from '../../components/ui/Button';

export const KioskOCRProcessing: React.FC = () => {
  const navigate = useNavigate();
  const { ocrProgress, isOcrProcessing, activeOcrDoc, ocrError } = useKiosk();

  // No auto-navigation timer: the patient explicitly reviews progress and clicks to proceed

  if (ocrError) {
    return (
      <div className="flex flex-col items-center justify-center max-w-xl mx-auto py-8 space-y-6 animate-in fade-in duration-300">
        <Card className="w-full p-8 bg-surface-elevated border-red-500/40 text-center space-y-4">
          <AlertTriangle className="w-10 h-10 mx-auto text-red-400" />
          <h2 className="text-xl font-black text-med-text-primary">Document Upload Failed</h2>
          <p className="text-sm text-med-text-secondary">{ocrError}</p>
          <Button variant="primary" size="lg" onClick={() => navigate('/patient/documents')} className="font-bold">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center max-w-xl mx-auto py-8 space-y-6 animate-in fade-in duration-300">
      <Card className="w-full p-8 bg-surface-elevated border-border text-center space-y-6 relative overflow-hidden shadow-surface">
        {/* Animated Scanner Preview Box */}
        <div className="relative w-full h-52 bg-surface rounded-xl border border-border flex items-center justify-center overflow-hidden">
          {/* Subtle Scanning laser beam */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-med-green to-transparent animate-scan shadow-glow-green" />

          {/* Paper Outline Mockup */}
          <div className="w-3/4 h-5/6 bg-surface-elevated rounded-lg border border-border p-4 flex flex-col justify-between opacity-85">
            <div className="flex items-center justify-between border-b border-border/80 pb-2">
              <div className="w-24 h-2.5 bg-med-green/30 rounded" />
              <div className="w-12 h-2.5 bg-med-text-muted/40 rounded" />
            </div>
            <div className="space-y-2 py-2">
              <div className="w-5/6 h-2 bg-med-text-muted/20 rounded" />
              <div className="w-4/6 h-2 bg-med-text-muted/20 rounded" />
              <div className="w-3/6 h-2 bg-med-text-muted/20 rounded" />
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border/80">
              <div className="w-16 h-2 bg-med-green/40 rounded" />
              <div className="w-20 h-2 bg-med-text-muted/30 rounded" />
            </div>
          </div>
        </div>

        {/* Processing State Description */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-med-green/10 text-med-green text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            MediKiosk Document Intelligence OCR
          </div>

          <h2 className="text-2xl font-black text-med-text-primary">
            {ocrProgress < 40 && "Scanning Optical Document..."}
            {ocrProgress >= 40 && ocrProgress < 75 && "Reading Clinical Text..."}
            {ocrProgress >= 75 && ocrProgress < 100 && "Extracting Medications & Diagnoses..."}
            {ocrProgress >= 100 && "Chronological Timeline Ready!"}
          </h2>

          <p className="text-xs text-med-text-secondary">
            AI is analyzing medical entities, drug strengths, and test dates.
          </p>
        </div>

        {/* Live Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-med-green flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Processing Pipeline
            </span>
            <span className="text-med-text-muted">{ocrProgress}%</span>
          </div>
          <Progress value={ocrProgress} color="green" size="md" />
        </div>

        {/* Processing Checkpoints */}
        <div className="grid grid-cols-2 gap-2 text-left text-xs pt-2">
          <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
            ocrProgress >= 30 ? 'bg-surface border-med-green/30 text-med-green' : 'bg-surface/50 border-border text-med-text-muted'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>High-Res Scan</span>
          </div>

          <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
            ocrProgress >= 65 ? 'bg-surface border-med-green/30 text-med-green' : 'bg-surface/50 border-border text-med-text-muted'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>OCR Parsing</span>
          </div>

          <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
            ocrProgress >= 85 ? 'bg-surface border-med-green/30 text-med-green' : 'bg-surface/50 border-border text-med-text-muted'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Drug & Dose NER</span>
          </div>

          <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
            ocrProgress >= 100 ? 'bg-surface border-med-green/30 text-med-green' : 'bg-surface/50 border-border text-med-text-muted'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Timeline Synced</span>
          </div>
        </div>

        {/* Proceed button if ready */}
        {ocrProgress >= 100 && (
          <Button
            variant="primary"
            size="lg"
            className="w-full font-bold shadow-glow-green"
            onClick={() => navigate('/patient/doc-review')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Review Extracted Information / समीक्षा करें
          </Button>
        )}
      </Card>
    </div>
  );
};
