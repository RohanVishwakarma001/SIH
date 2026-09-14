import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Camera, 
  UploadCloud, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  FileCheck,
  Clock
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const KioskDocuments: React.FC = () => {
  const navigate = useNavigate();
  const { simulateDocUpload, isOcrProcessing } = useKiosk();
  const [selectedType, setSelectedType] = useState<'prescription' | 'lab_report' | 'discharge_summary'>('prescription');

  const handleUploadAndScan = async (type: 'prescription' | 'lab_report' | 'discharge_summary') => {
    setSelectedType(type);
    navigate('/patient/ocr-processing');
    await simulateDocUpload(type);
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-2xl mx-auto py-6 space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-border text-xs font-semibold text-med-text-secondary">
          <FileText className="w-4 h-4 text-med-green" />
          <span>Step 4 of 6 • दस्तावेज़ अपलोड (Documents)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-med-text-primary">
          Scan Previous Prescriptions or Reports
        </h1>
        <p className="text-sm text-med-text-secondary">
          Our AI OCR will automatically extract past diagnoses, daily medications, and lab values into your medical timeline.
        </p>
      </div>

      {/* Document Types Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        <button
          onClick={() => handleUploadAndScan('prescription')}
          className="p-5 rounded-xl border-2 border-border bg-surface hover:border-med-green hover:bg-surface-elevated text-left transition-all group flex flex-col justify-between min-h-[140px]"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-med-green/10 text-med-green flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-med-green/10 text-med-green font-semibold">
              Fast OCR
            </span>
          </div>
          <div>
            <div className="font-bold text-base text-med-text-primary group-hover:text-med-green transition-colors">
              Doctor Prescription / पर्ची
            </div>
            <div className="text-xs text-med-text-muted mt-1">
              Extracts daily medicines, dosages, and doctor notes
            </div>
          </div>
        </button>

        <button
          onClick={() => handleUploadAndScan('lab_report')}
          className="p-5 rounded-xl border-2 border-border bg-surface hover:border-med-green hover:bg-surface-elevated text-left transition-all group flex flex-col justify-between min-h-[140px]"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-semibold">
              Lab Tests
            </span>
          </div>
          <div>
            <div className="font-bold text-base text-med-text-primary group-hover:text-cyan-400 transition-colors">
              Lab Report / जांच रिपोर्ट
            </div>
            <div className="text-xs text-med-text-muted mt-1">
              Extracts Blood tests, HbA1c, CBC, Lipid & Thyroid levels
            </div>
          </div>
        </button>
      </div>

      {/* Optical Scanner Camera Action */}
      <Card className="w-full p-6 bg-surface-elevated border-border text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-med-green/10 text-med-green flex items-center justify-center border border-med-green/30">
          <Camera className="w-7 h-7" />
        </div>
        <div>
          <div className="text-base font-bold text-med-text-primary">
            Kiosk Optical Scanner Terminal
          </div>
          <div className="text-xs text-med-text-secondary mt-1 max-w-md mx-auto">
            Place your physical paper slip directly under the scanning tray or tap below to scan demonstration prescription.
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={() => handleUploadAndScan('prescription')}
          className="w-full max-w-sm mx-auto font-bold shadow-glow-green"
          leftIcon={<Camera className="w-4 h-4" />}
        >
          Scan Prescription Now / पर्चा स्कैन करें
        </Button>
      </Card>

      {/* Skip Option */}
      <div className="w-full flex justify-between items-center pt-2">
        <span className="text-xs text-med-text-muted">
          Don't have documents with you today?
        </span>
        <Button
          variant="ghost"
          size="md"
          onClick={() => navigate('/patient/timeline')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Skip & View Timeline (छोड़ें)
        </Button>
      </div>
    </div>
  );
};
