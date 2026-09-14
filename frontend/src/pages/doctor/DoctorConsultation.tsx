import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Stethoscope, 
  Pill, 
  FileText, 
  Save, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  Printer, 
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { useDoctor } from '../../context/DoctorContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { apiClient } from '../../lib/api-client';

export const DoctorConsultation: React.FC = () => {
  const navigate = useNavigate();
  const { 
    selectedPatient, 
    consultationNote, 
    updateConsultationNote, 
    addPrescriptionItem, 
    removePrescriptionItem, 
    saveAndPushToAbha, 
    isSavingConsultation, 
    isConsultationSaved,
    resetConsultation
  } = useDoctor();

  const history = selectedPatient.structuredHistory;
  const ai = selectedPatient.aiSummary;

  // New medication draft input
  const [newMedName, setNewMedName] = useState('');
  const [newMedDose, setNewMedDose] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('OD');
  const [newMedDuration, setNewMedDuration] = useState('14 days');
  const [newMedInstructions, setNewMedInstructions] = useState('After food');

  const handleAddMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName) return;
    addPrescriptionItem({
      medicine: newMedName,
      dosage: newMedDose || '1 tab',
      frequency: newMedFreq,
      duration: newMedDuration,
      instructions: newMedInstructions
    });
    setNewMedName('');
    setNewMedDose('');
  };

  const handleSave = async () => {
    await saveAndPushToAbha();
  };

  return (
    <div className="space-y-4 max-w-[1520px] mx-auto animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-elevated p-4 rounded-xl border border-border">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/doctor/patient/${selectedPatient.id}`)}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-med-text-primary">
                Active Consultation: {selectedPatient.name}
              </h1>
              <Badge variant={selectedPatient.priority === 'urgent' ? 'urgent' : 'normal'} size="sm">
                Token {selectedPatient.token}
              </Badge>
            </div>
            <p className="text-xs text-med-text-secondary">
              ABHA: {selectedPatient.abhaId} • {selectedPatient.roomNo} • {apiClient.getUserName() || 'Doctor'}
            </p>
          </div>
        </div>

        {/* Save & Print CTAs */}
        <div className="flex items-center gap-2">
          {isConsultationSaved ? (
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1.5 rounded-lg bg-med-green/15 text-med-green font-bold border border-med-green/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Saved & Pushed to ABHA
              </span>
              <Button
                variant="secondary"
                size="md"
                onClick={() => window.print()}
                leftIcon={<Printer className="w-4 h-4" />}
              >
                Print Prescription
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  resetConsultation();
                  navigate('/doctor/dashboard');
                }}
              >
                Next Patient in Queue
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="lg"
              isLoading={isSavingConsultation}
              onClick={handleSave}
              className="font-bold shadow-glow-green"
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Consultation & Push to ABHA
            </Button>
          )}
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* =========================================================
            COLUMN 1 (3 cols): Patient History Snapshot
        ========================================================= */}
        <div className="lg:col-span-3 space-y-3">
          <Card className="p-4 bg-surface border-border space-y-3">
            <div className="text-xs uppercase font-extrabold text-med-green border-b border-border pb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Patient History Summary
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-med-text-muted block">Chief Complaint</span>
                <p className="font-bold text-med-text-primary text-xs mt-0.5">
                  {history.chiefComplaint.primary}
                </p>
                <div className="text-med-text-secondary text-[11px]">
                  Duration: {history.chiefComplaint.duration}
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <span className="text-[10px] uppercase font-bold text-med-text-muted block">Vitals at Kiosk</span>
                <div className="grid grid-cols-2 gap-1.5 pt-1 font-mono text-[11px]">
                  <div className="p-1.5 rounded bg-surface-elevated">BP: {selectedPatient.vitals.bp}</div>
                  <div className="p-1.5 rounded bg-surface-elevated">HR: {selectedPatient.vitals.heartRate} bpm</div>
                  <div className="p-1.5 rounded bg-surface-elevated">SpO2: {selectedPatient.vitals.spo2}%</div>
                  <div className="p-1.5 rounded bg-surface-elevated">BMI: {selectedPatient.vitals.bmi}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <span className="text-[10px] uppercase font-bold text-med-text-muted block">Past Conditions</span>
                <ul className="space-y-0.5 pt-1 text-[11px] text-med-text-secondary">
                  {history.pastMedicalHistory.map((pmh, i) => (
                    <li key={i}>• {pmh.condition} ({pmh.diagnosedYear})</li>
                  ))}
                </ul>
              </div>

              {history.allergyHistory.length > 0 && (
                <div className="pt-2 border-t border-border">
                  <span className="text-[10px] uppercase font-bold text-red-400 block">Severe Allergies</span>
                  <div className="text-[11px] text-red-300 font-semibold mt-0.5">
                    {history.allergyHistory.map(a => `${a.allergen} (${a.reaction})`).join(', ')}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* =========================================================
            COLUMN 2 (4 cols): AI Clinical Summary & Findings
        ========================================================= */}
        <div className="lg:col-span-4 space-y-3">
          <Card className="p-4 bg-surface border-border space-y-3">
            <div className="text-xs uppercase font-extrabold text-med-green border-b border-border pb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AI Clinical Summary (Triage)
            </div>

            <p className="text-xs text-med-text-primary leading-relaxed bg-surface-elevated p-3 rounded-lg border border-border">
              {ai.conciseSummary}
            </p>

            <div className="space-y-1.5 text-xs">
              <span className="text-[10px] uppercase font-bold text-med-green block">AI Differential Diagnoses</span>
              {ai.differentialDiagnoses.map((diff, i) => (
                <div
                  key={i}
                  onClick={() => {
                    updateConsultationNote({
                      provisionalDiagnosis: diff.name,
                      icdCode: diff.icdCode
                    });
                  }}
                  className="p-2 rounded-lg bg-surface-elevated border border-border hover:border-med-green cursor-pointer transition-all flex items-center justify-between"
                  title="Click to copy to diagnosis"
                >
                  <div>
                    <div className="font-bold text-med-text-primary text-xs">{diff.name}</div>
                    <div className="text-[10px] text-med-text-muted">ICD-10: {diff.icdCode}</div>
                  </div>
                  <span className="text-xs font-mono font-bold text-med-green">{diff.confidence}%</span>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 text-xs pt-2 border-t border-border">
              <span className="text-[10px] uppercase font-bold text-med-text-muted block">Recommended Investigations</span>
              <ul className="space-y-1 text-xs text-med-text-secondary">
                {ai.recommendedInvestigations.map((inv, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="text-med-green font-bold">✓</span>
                    <span>{inv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>

        {/* =========================================================
            COLUMN 3 (5 cols): Doctor Consultation Notes & Rx Pad
        ========================================================= */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5 bg-surface-elevated border-border shadow-surface space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-xs uppercase font-extrabold text-med-green flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5" />
                Doctor Consultation Workspace
              </span>
              <span className="text-[10px] text-med-green font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> ABDM FHIR R4
              </span>
            </div>

            {/* Diagnosis & ICD-10 */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-bold text-med-text-secondary">Provisional Diagnosis</label>
                <input
                  type="text"
                  value={consultationNote.provisionalDiagnosis}
                  onChange={e => updateConsultationNote({ provisionalDiagnosis: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-xs text-med-text-primary outline-none focus:border-med-green"
                  placeholder="e.g. Acute Coronary Syndrome"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-med-text-secondary">ICD-10 Code</label>
                <input
                  type="text"
                  value={consultationNote.icdCode}
                  onChange={e => updateConsultationNote({ icdCode: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-xs font-mono text-med-green outline-none focus:border-med-green"
                  placeholder="I21.9"
                />
              </div>
            </div>

            {/* Prescriptions Pad (Rx) */}
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-med-text-primary flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-med-green" />
                  E-Prescription Pad ({consultationNote.prescriptions.length} items)
                </span>
              </div>

              {/* Existing medicines list */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {consultationNote.prescriptions.map((rx, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-surface border border-border flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-med-text-primary">{rx.medicine} {rx.dosage}</div>
                      <div className="text-[11px] text-med-text-muted">{rx.frequency} • {rx.duration} • {rx.instructions}</div>
                    </div>
                    <button
                      onClick={() => removePrescriptionItem(idx)}
                      className="p-1 rounded text-med-text-muted hover:text-red-400 hover:bg-surface-elevated"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add medication input line */}
              <form onSubmit={handleAddMed} className="p-2.5 rounded-lg bg-surface/60 border border-border/80 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Medicine Name (e.g. Tab. Sorbitrate)"
                    value={newMedName}
                    onChange={e => setNewMedName(e.target.value)}
                    className="h-8 px-2 rounded bg-surface border border-border text-med-text-primary outline-none focus:border-med-green"
                  />
                  <input
                    type="text"
                    placeholder="Strength (e.g. 5mg)"
                    value={newMedDose}
                    onChange={e => setNewMedDose(e.target.value)}
                    className="h-8 px-2 rounded bg-surface border border-border text-med-text-primary outline-none focus:border-med-green"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={newMedFreq}
                    onChange={e => setNewMedFreq(e.target.value)}
                    className="h-8 px-2 rounded bg-surface border border-border text-med-text-primary outline-none"
                  >
                    <option value="OD">OD (Once daily)</option>
                    <option value="BD">BD (Twice daily)</option>
                    <option value="TDS">TDS (Thrice daily)</option>
                    <option value="STAT">STAT (Immediately)</option>
                    <option value="SOS">SOS (As needed)</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Duration"
                    value={newMedDuration}
                    onChange={e => setNewMedDuration(e.target.value)}
                    className="h-8 px-2 rounded bg-surface border border-border text-med-text-primary outline-none"
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    size="sm"
                    className="h-8 text-xs font-semibold"
                    leftIcon={<Plus className="w-3.5 h-3.5 text-med-green" />}
                  >
                    Add Rx
                  </Button>
                </div>
              </form>
            </div>

            {/* Doctor Clinical Notes */}
            <div className="space-y-1 pt-2 border-t border-border">
              <label className="text-xs font-bold text-med-text-secondary">
                Physician Consultation & Advice Notes
              </label>
              <textarea
                rows={3}
                value={consultationNote.clinicalNotes}
                onChange={e => updateConsultationNote({ clinicalNotes: e.target.value })}
                className="w-full p-2.5 rounded-lg bg-surface border border-border text-xs text-med-text-primary outline-none focus:border-med-green leading-relaxed"
                placeholder="Enter clinical examination findings and advice..."
              />
            </div>

            {/* Follow-up Days */}
            <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
              <span className="font-bold text-med-text-secondary">Follow-Up In:</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={consultationNote.followUpDays}
                  onChange={e => updateConsultationNote({ followUpDays: Number(e.target.value) })}
                  className="w-16 h-8 px-2 text-center rounded bg-surface border border-border text-med-text-primary font-mono font-bold"
                />
                <span className="text-med-text-muted">Days</span>
              </div>
            </div>

            {/* Primary Save Button */}
            <Button
              variant="primary"
              size="xl"
              isLoading={isSavingConsultation}
              onClick={handleSave}
              className="w-full font-bold shadow-glow-green"
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Consultation & Push to ABHA
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
