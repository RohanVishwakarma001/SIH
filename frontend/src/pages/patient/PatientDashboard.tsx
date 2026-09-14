import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  ShieldCheck,
  FileText,
  UploadCloud,
  Clock,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Pill,
  Activity,
  Sparkles,
  LogOut,
  QrCode,
  Leaf,
  Eye,
  ShieldAlert,
  Edit3,
  RefreshCw
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { api, ApiError } from '../../services/api';
import { apiClient } from '../../lib/api-client';

type TabKey = 'records' | 'put_data' | 'timeline' | 'consent';

export const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabKey>('records');

  // Real data loaded from the backend — no mock/demo fallback content.
  const [profile, setProfile] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [drugInteractions, setDrugInteractions] = useState<any[]>([]);
  const [records, setRecords] = useState<{ timeline: any[]; summaries: any[]; consultations: any[] }>({
    timeline: [],
    summaries: [],
    consultations: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocType, setNewDocType] = useState<'PRESCRIPTION' | 'LAB_REPORT' | 'DISCHARGE_SUMMARY'>('PRESCRIPTION');
  const [newDocFacility, setNewDocFacility] = useState('');
  const [newDocDoctor, setNewDocDoctor] = useState('');
  const [newDocFile, setNewDocFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [editAllergy, setEditAllergy] = useState('');
  const [editCondition, setEditCondition] = useState('');
  const [editMedication, setEditMedication] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSavingField, setIsSavingField] = useState(false);

  const [consentAi, setConsentAi] = useState(true);
  const [consentDoctorShare, setConsentDoctorShare] = useState(true);
  const [consentAbha, setConsentAbha] = useState(true);

  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);

  const loadDashboard = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [profileRes, docsRes, recordsRes] = await Promise.all([
        api.getPatientPortalProfile(),
        api.getPatientPortalDocuments(),
        api.getPatientPortalRecords()
      ]);
      setProfile(profileRes);
      setDocuments(docsRes?.documents || []);
      setDrugInteractions(docsRes?.drugInteractions || []);
      setRecords({
        timeline: recordsRes?.timeline || [],
        summaries: recordsRes?.summaries || [],
        consultations: recordsRes?.consultations || []
      });
      if (profileRes?.activeConsent) {
        setConsentAi(Boolean(profileRes.activeConsent.consentAi));
        setConsentDoctorShare(Boolean(profileRes.activeConsent.consentDoctorShare));
        setConsentAbha(Boolean(profileRes.activeConsent.consentAbha));
      }
    } catch (err: any) {
      if (err instanceof ApiError && err.statusCode === 401) {
        apiClient.clearSession();
        navigate('/patient/portal/login');
        return;
      }
      setLoadError(err instanceof ApiError ? err.message : 'Unable to load your health records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!apiClient.getToken()) {
      navigate('/patient/portal/login');
      return;
    }
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showSaveSuccess = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const persistProfileUpdate = async (patch: {
    chronicConditions?: any[];
    allergies?: any[];
    medications?: any[];
  }, successMsg: string) => {
    setIsSavingField(true);
    setSaveError(null);
    try {
      await api.updatePatientPortalProfile(patch);
      await loadDashboard();
      showSaveSuccess(successMsg);
    } catch (err: any) {
      setSaveError(err instanceof ApiError ? err.message : 'Could not save this update. Please try again.');
    } finally {
      setIsSavingField(false);
    }
  };

  const handleAddCondition = () => {
    if (!editCondition.trim() || !profile) return;
    const updated = [
      ...(profile.clinicalData?.pastMedicalHistory || []),
      { condition: editCondition.trim(), diagnosedYear: String(new Date().getFullYear()) }
    ];
    setEditCondition('');
    persistProfileUpdate({ chronicConditions: updated }, 'Health condition added to your medical records');
  };

  const handleAddAllergy = () => {
    if (!editAllergy.trim() || !profile) return;
    const updated = [
      ...(profile.clinicalData?.drugAllergies || []),
      { allergen: editAllergy.trim(), reaction: 'Reported by patient', severity: 'Not yet clinically assessed' }
    ];
    setEditAllergy('');
    persistProfileUpdate({ allergies: updated }, 'Allergy profile updated');
  };

  const handleAddMedication = () => {
    if (!editMedication.trim() || !profile) return;
    const updated = [
      ...(profile.clinicalData?.dailyMedications || []),
      { drugName: editMedication.trim(), dosage: 'As prescribed', frequency: '-', adherence: 'Self-reported' }
    ];
    setEditMedication('');
    persistProfileUpdate({ medications: updated }, 'Medication added to your profile');
  };

  const handleStoreDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim() || !newDocFile) return;

    setIsUploading(true);
    setUploadError(null);
    try {
      await api.storePatientPortalDocument({
        title: newDocTitle.trim(),
        documentType: newDocType,
        facility: newDocFacility.trim() || undefined,
        doctorName: newDocDoctor.trim() || undefined,
        file: newDocFile
      });
      setIsUploadModalOpen(false);
      setNewDocTitle('');
      setNewDocFacility('');
      setNewDocDoctor('');
      setNewDocFile(null);
      showSaveSuccess('Medical document uploaded and queued for digitization.');
      await loadDashboard();
    } catch (err: any) {
      setUploadError(err instanceof ApiError ? err.message : 'Could not upload this document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFastTrackKiosk = () => navigate('/patient/home');

  const handleSignOut = () => {
    apiClient.clearSession();
    navigate('/patient/portal/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-med-text-secondary text-sm">
        Loading your health dashboard…
      </div>
    );
  }

  if (loadError || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-med-text-secondary text-sm p-6 text-center">
        <AlertTriangle className="w-8 h-8 text-red-400" />
        <p>{loadError || 'Unable to load your profile.'}</p>
        <Button variant="primary" size="sm" onClick={loadDashboard} leftIcon={<RefreshCw className="w-4 h-4" />}>
          Retry
        </Button>
      </div>
    );
  }

  const clinicalData = profile.clinicalData || {
    pastMedicalHistory: [],
    pastSurgicalHistory: [],
    drugAllergies: [],
    dailyMedications: [],
    ayushConstitution: null
  };

  return (
    <div className="min-h-screen bg-background text-med-text-primary p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Navbar */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-med-green/15 border border-med-green/30 flex items-center justify-center text-med-green shadow-glow-green-sm">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-med-text-primary">
                {profile.name}
              </h1>
              <Badge variant={profile.abhaVerified ? 'green' : 'attention'} size="sm">
                {profile.abhaVerified ? 'ABHA Verified' : 'ABHA Unverified'}
              </Badge>
            </div>
            <p className="text-xs text-med-text-secondary">
              Personal Health Dashboard{profile.abhaId ? ` • ABHA ID: ` : ''}
              {profile.abhaId && <span className="font-mono text-med-green">{profile.abhaId}</span>}
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="primary"
            size="md"
            onClick={handleFastTrackKiosk}
            className="font-bold shadow-glow-green text-xs sm:text-sm"
            leftIcon={<Activity className="w-4 h-4" />}
          >
            Start Today's OPD Intake / कियोस्क शुरू करें
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() => setIsUploadModalOpen(true)}
            className="text-xs sm:text-sm font-semibold"
            leftIcon={<UploadCloud className="w-4 h-4 text-med-green" />}
          >
            Store Medical Record
          </Button>

          <button
            onClick={handleSignOut}
            className="p-2.5 rounded-xl bg-surface-elevated border border-border text-med-text-muted hover:text-red-400 hover:border-red-500/30 transition-all"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Success / error alert banners */}
      {saveSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-med-green/15 border border-med-green/40 text-xs text-med-green font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}
      {saveError && (
        <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-xs text-red-300 font-bold flex items-center gap-2 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Hero ABHA Card & Vitals Ribbon */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 bg-gradient-to-br from-surface-elevated to-surface border-2 border-med-green/30 relative overflow-hidden space-y-4 shadow-surface">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-bold uppercase tracking-widest text-med-green flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Ayushman Bharat Digital Health Card
            </div>
            <QrCode className="w-6 h-6 text-med-green/80" />
          </div>

          <div className="space-y-1">
            <div className="font-extrabold text-lg text-med-text-primary">
              {profile.name}
            </div>
            <div className="text-xs text-med-text-secondary font-mono">
              ABHA: {profile.abhaId || 'Not linked yet'}
            </div>
            {profile.abhaAddress && (
              <div className="text-xs text-med-text-muted">
                ABHA Address: <span className="text-med-green">{profile.abhaAddress}</span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-med-text-secondary">
            <span>{profile.age || '—'} Yrs • {profile.gender || 'Not specified'}</span>
            <span className="font-mono">{profile.phone || 'No phone on file'}</span>
          </div>
        </Card>

        {/* Current Vitals & Health Metrics */}
        <Card className="lg:col-span-2 p-5 bg-surface-elevated border-border space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-med-green flex items-center gap-1.5">
              <Activity className="w-4 h-4" />
              Clinical Vitals & Physiological Baseline
            </span>
            <span className="text-xs text-med-text-muted">Last verified at OPD check-in</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-surface border border-border text-center">
              <span className="text-[10px] uppercase font-bold text-med-text-muted block">Blood Pressure</span>
              <span className="text-base font-mono font-black text-med-text-primary mt-0.5 block">{profile.vitals?.bp || 'Not recorded'}</span>
            </div>

            <div className="p-3 rounded-xl bg-surface border border-border text-center">
              <span className="text-[10px] uppercase font-bold text-med-text-muted block">Heart Rate</span>
              <span className="text-base font-mono font-black text-med-text-primary mt-0.5 block">{profile.vitals?.heartRate ? `${profile.vitals.heartRate} bpm` : 'Not recorded'}</span>
            </div>

            <div className="p-3 rounded-xl bg-surface border border-border text-center">
              <span className="text-[10px] uppercase font-bold text-med-text-muted block">Oxygen SpO2</span>
              <span className="text-base font-mono font-black text-med-text-primary mt-0.5 block">{profile.vitals?.spo2 ? `${profile.vitals.spo2}%` : 'Not recorded'}</span>
            </div>

            <div className="p-3 rounded-xl bg-surface border border-border text-center">
              <span className="text-[10px] uppercase font-bold text-med-text-muted block">Temperature</span>
              <span className="text-base font-mono font-black text-med-text-primary mt-0.5 block">{profile.vitals?.temperature || 'Not recorded'}</span>
            </div>

            <div className="p-3 rounded-xl bg-surface border border-border text-center">
              <span className="text-[10px] uppercase font-bold text-med-text-muted block">Blood Sugar</span>
              <span className="text-base font-mono font-black text-med-text-primary mt-0.5 block">{profile.vitals?.bloodSugar ? `${profile.vitals.bloodSugar} mg/dL` : 'Not recorded'}</span>
            </div>
          </div>
          <p className="text-[11px] text-med-text-muted pt-1">
            Vitals are captured during your next OPD kiosk check-in and will appear here automatically.
          </p>
        </Card>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('records')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'records'
              ? 'bg-med-green text-background shadow-glow-green-sm'
              : 'text-med-text-secondary hover:text-med-text-primary hover:bg-surface'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Stored Medical Records ({documents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('put_data')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'put_data'
              ? 'bg-med-green text-background shadow-glow-green-sm'
              : 'text-med-text-secondary hover:text-med-text-primary hover:bg-surface'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Put Clinical Data / स्वास्थ्य विवरण दर्ज करें</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'timeline'
              ? 'bg-med-green text-background shadow-glow-green-sm'
              : 'text-med-text-secondary hover:text-med-text-primary hover:bg-surface'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Medical Timeline & Journey</span>
        </button>

        <button
          onClick={() => setActiveTab('consent')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'consent'
              ? 'bg-med-green text-background shadow-glow-green-sm'
              : 'text-med-text-secondary hover:text-med-text-primary hover:bg-surface'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Consent & DPDP Act Privacy</span>
        </button>
      </div>

      {/* TAB CONTENT 1: STORE MEDICAL RECORDS */}
      {activeTab === 'records' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {drugInteractions.length > 0 && (
            <div className="p-4 rounded-xl bg-red-500/10 border-2 border-red-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-red-300">
                    Potential Drug Interaction{drugInteractions.length > 1 ? 's' : ''} Detected
                  </div>
                  <div className="text-xs text-med-text-secondary">
                    {drugInteractions[0].drug1} + {drugInteractions[0].drug2}: {drugInteractions[0].clinicalEffect}
                  </div>
                </div>
              </div>
              <Badge variant="urgent" size="sm">{drugInteractions.length} Interaction{drugInteractions.length > 1 ? 's' : ''}</Badge>
            </div>
          )}

          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-med-text-muted text-sm border border-dashed border-border rounded-xl">
              <FileText className="w-8 h-8" />
              <p>No medical records stored yet.</p>
              <Button variant="secondary" size="sm" onClick={() => setIsUploadModalOpen(true)} leftIcon={<UploadCloud className="w-4 h-4" />}>
                Store Your First Medical Record
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <Card
                  key={doc.id}
                  className="p-5 bg-surface-elevated border-border hover:border-med-green/40 transition-all space-y-4 cursor-pointer"
                  onClick={() => setSelectedDoc(doc)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-med-green">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-med-text-primary line-clamp-1">
                          {doc.title}
                        </h3>
                        <div className="text-xs text-med-text-muted flex items-center gap-2 mt-0.5">
                          <span className="font-mono">{doc.date}</span>
                          <span>•</span>
                          <span>{doc.facility}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="green" size="sm">{String(doc.documentType || '').replace('_', ' ')}</Badge>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase font-bold text-med-text-muted block">Extracted Clinical Entities:</span>
                    {doc.entities.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {doc.entities.slice(0, 4).map((ent: any, i: number) => (
                          <span key={i} className="text-[11px] px-2 py-0.5 rounded border font-medium bg-surface border-border text-med-text-secondary">
                            {ent.value}
                          </span>
                        ))}
                        {doc.entities.length > 4 && (
                          <span className="text-[11px] px-2 py-0.5 rounded bg-surface border border-border text-med-text-muted">
                            +{doc.entities.length - 4} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[11px] text-med-text-muted">Digitization in progress…</span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-med-green font-semibold">
                    <span>{doc.confidenceScore ? `OCR Accuracy: ${doc.confidenceScore}%` : 'Pending OCR'}</span>
                    <span className="flex items-center gap-1 hover:underline">
                      <Eye className="w-3.5 h-3.5" /> View Extracted Document →
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 2: "PUT DATA" HEALTH PROFILE */}
      {activeTab === 'put_data' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-4 rounded-xl bg-surface-elevated border border-med-green/30 flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-base text-med-text-primary">
                Put Clinical & Personal Health Data
              </h2>
              <p className="text-xs text-med-text-secondary">
                Directly add or update your medical background, active medications, and drug allergies.
              </p>
            </div>
            <Badge variant="green" size="md">Self-Service Intake</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Chronic Conditions */}
            <Card className="p-5 bg-surface-elevated border-border space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-med-green flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  Chronic Medical Conditions (पूर्व बीमारियां)
                </span>
                <span className="text-xs font-mono text-med-text-muted">{clinicalData.pastMedicalHistory.length} active</span>
              </div>

              <div className="space-y-2">
                {clinicalData.pastMedicalHistory.length === 0 && (
                  <p className="text-xs text-med-text-muted">No chronic conditions recorded yet.</p>
                )}
                {clinicalData.pastMedicalHistory.map((cond: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-surface border border-border flex items-center justify-between text-xs">
                    <span className="font-bold text-med-text-primary">{cond.condition}</span>
                    <span className="text-med-text-muted font-mono">Since {cond.diagnosedYear}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <input
                  type="text"
                  value={editCondition}
                  onChange={e => setEditCondition(e.target.value)}
                  placeholder="e.g. Asthma, Thyroid, Arthritis"
                  className="flex-1 h-9 px-3 bg-surface rounded-lg border border-border text-xs text-med-text-primary outline-none focus:border-med-green"
                />
                <Button variant="secondary" size="sm" isLoading={isSavingField} onClick={handleAddCondition} className="text-xs font-semibold">
                  <Plus className="w-3.5 h-3.5" /> Add
                </Button>
              </div>
            </Card>

            {/* Drug Allergies */}
            <Card className="p-5 bg-surface-elevated border-border space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-red-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  Drug & Substance Allergies (दवा एलर्जी)
                </span>
                {clinicalData.drugAllergies.length > 0 && <Badge variant="urgent" size="sm">High Risk</Badge>}
              </div>

              <div className="space-y-2">
                {clinicalData.drugAllergies.length === 0 && (
                  <p className="text-xs text-med-text-muted">No known drug allergies recorded yet.</p>
                )}
                {clinicalData.drugAllergies.map((all: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-red-300">{all.allergen}</span>
                      <span className="text-med-text-muted block text-[11px]">{all.reaction}</span>
                    </div>
                    <span className="text-red-400 font-bold text-[10px] uppercase">{all.severity}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <input
                  type="text"
                  value={editAllergy}
                  onChange={e => setEditAllergy(e.target.value)}
                  placeholder="e.g. Sulfa drugs, Aspirin, Ibuprofen"
                  className="flex-1 h-9 px-3 bg-surface rounded-lg border border-border text-xs text-med-text-primary outline-none focus:border-med-green"
                />
                <Button variant="secondary" size="sm" isLoading={isSavingField} onClick={handleAddAllergy} className="text-xs font-semibold">
                  <Plus className="w-3.5 h-3.5" /> Add
                </Button>
              </div>
            </Card>

            {/* Daily Medications */}
            <Card className="p-5 bg-surface-elevated border-border space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-med-green flex items-center gap-1.5">
                  <Pill className="w-4 h-4" />
                  Active Daily Medications (नियमित दवाएं)
                </span>
                <span className="text-xs font-mono text-med-text-muted">{clinicalData.dailyMedications.length} meds</span>
              </div>

              <div className="space-y-2">
                {clinicalData.dailyMedications.length === 0 && (
                  <p className="text-xs text-med-text-muted">No active medications recorded yet.</p>
                )}
                {clinicalData.dailyMedications.map((med: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-surface border border-border flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-med-text-primary">{med.drugName}</span>
                      <span className="text-med-text-muted ml-2">{med.dosage} • {med.frequency}</span>
                    </div>
                    <Badge variant="green" size="sm">{med.adherence}</Badge>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <input
                  type="text"
                  value={editMedication}
                  onChange={e => setEditMedication(e.target.value)}
                  placeholder="e.g. Pantoprazole 40mg OD"
                  className="flex-1 h-9 px-3 bg-surface rounded-lg border border-border text-xs text-med-text-primary outline-none focus:border-med-green"
                />
                <Button variant="secondary" size="sm" isLoading={isSavingField} onClick={handleAddMedication} className="text-xs font-semibold">
                  <Plus className="w-3.5 h-3.5" /> Add
                </Button>
              </div>
            </Card>

            {/* AYUSH Constitutional Assessment */}
            <Card className="p-5 bg-surface-elevated border-emerald-500/30 space-y-4 shadow-glow-green-sm">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <Leaf className="w-4 h-4" />
                  Ayurvedic Profile (दशविध परीक्षा एवं प्रकृति)
                </span>
                <Badge variant="ayush" size="sm">Ministry of Ayush</Badge>
              </div>

              {clinicalData.ayushConstitution ? (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded bg-surface border border-border">
                    <div className="text-[10px] text-med-text-muted uppercase font-bold">Prakriti (प्रकृति)</div>
                    <div className="font-bold text-emerald-300 mt-0.5">{clinicalData.ayushConstitution.primaryDosha}</div>
                  </div>
                  <div className="p-2.5 rounded bg-surface border border-border">
                    <div className="text-[10px] text-med-text-muted uppercase font-bold">Agni / Jatharagni (अग्नि)</div>
                    <div className="font-bold text-med-text-primary mt-0.5">{clinicalData.ayushConstitution.aharaShaktiJarana}</div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-med-text-muted">
                  Not yet assessed. Complete an AYUSH kiosk intake to populate your Dashavidha Pariksha constitution here.
                </p>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: MEDICAL TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="p-4 rounded-xl bg-surface-elevated border border-border flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-base text-med-text-primary">
                Chronological Medical Timeline
              </h2>
              <p className="text-xs text-med-text-secondary">
                Consolidated view of all hospital visits, surgeries, and digitized prescriptions across providers.
              </p>
            </div>
            <Badge variant="green" size="sm">FHIR R4 Structured</Badge>
          </div>

          {records.timeline.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-med-text-muted text-sm border border-dashed border-border rounded-xl">
              <Clock className="w-8 h-8" />
              <p>No timeline events recorded yet.</p>
            </div>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {records.timeline.map((event: any, idx: number) => (
                <div key={idx} className="relative space-y-1.5">
                  <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 ${
                    event.isImportant ? 'bg-red-500 border-background shadow-glow-urgent' : 'bg-med-green border-background'
                  }`} />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-med-green">{event.date}</span>
                    <Badge variant={event.isImportant ? 'urgent' : 'normal'} size="sm">{event.badgeText}</Badge>
                  </div>
                  <Card className="p-4 bg-surface-elevated border-border space-y-1">
                    <h4 className="font-bold text-sm text-med-text-primary">{event.title}</h4>
                    <p className="text-xs text-med-text-secondary">{event.summary}</p>
                    <div className="text-[11px] text-med-text-muted font-medium pt-1">
                      Facility: {event.facility}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 4: CONSENT & DPDP ACT PRIVACY */}
      {activeTab === 'consent' && (
        <div className="space-y-4 animate-in fade-in duration-300 max-w-3xl mx-auto">
          <Card className="p-6 bg-surface-elevated border-border space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-med-green/15 text-med-green flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-med-text-primary">
                    Digital Personal Data Protection Act (DPDP Act 2023) Consent
                  </h3>
                  <p className="text-xs text-med-text-secondary">
                    You have complete ownership of your health records. Consent is granular and revocable at any time.
                  </p>
                </div>
              </div>
              <Badge variant={profile.activeConsent?.status === 'ACTIVE' ? 'green' : 'attention'} size="sm">
                {profile.activeConsent?.status || 'NOT SET'}
              </Badge>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-surface border border-border flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-med-text-primary text-sm">AI Clinical Intake & Summarization</div>
                  <div className="text-med-text-secondary leading-relaxed">
                    Allows MediKiosk clinical AI to transcribe your voice, parse prescriptions via OCR, and generate draft summaries for your doctor.
                  </div>
                </div>
                <button
                  onClick={() => setConsentAi(!consentAi)}
                  className={`w-12 h-7 rounded-full p-1 transition-all shrink-0 ${consentAi ? 'bg-med-green' : 'bg-border'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-all ${consentAi ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-med-text-primary text-sm">OPD Doctor Clinical Workspace Access</div>
                  <div className="text-med-text-secondary leading-relaxed">
                    Authorizes your assigned OPD consultant to view your structured history, digitized documents, and abnormal lab highlights.
                  </div>
                </div>
                <button
                  onClick={() => setConsentDoctorShare(!consentDoctorShare)}
                  className={`w-12 h-7 rounded-full p-1 transition-all shrink-0 ${consentDoctorShare ? 'bg-med-green' : 'bg-border'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-all ${consentDoctorShare ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-med-text-primary text-sm">ABHA Personal Health Record (PHR) Linking</div>
                  <div className="text-med-text-secondary leading-relaxed">
                    Synchronizes today's consultation note and prescription back into your ABHA health locker once ABDM gateway integration is live.
                  </div>
                </div>
                <button
                  onClick={() => setConsentAbha(!consentAbha)}
                  className={`w-12 h-7 rounded-full p-1 transition-all shrink-0 ${consentAbha ? 'bg-med-green' : 'bg-border'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-all ${consentAbha ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <p className="text-[11px] text-med-text-muted pt-2 border-t border-border">
              Your consent record from kiosk check-in is shown above. These toggles reflect your current-session preference;
              formal consent capture with an audit trail happens at kiosk check-in and in the consent registry.
            </p>
          </Card>
        </div>
      )}

      {/* Upload New Medical Record Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => { setIsUploadModalOpen(false); setUploadError(null); }}
        title="Store Physical Medical Document (दस्तावेज़ जोड़ें)"
      >
        <form onSubmit={handleStoreDocument} className="space-y-4">
          {uploadError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
              {uploadError}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-med-text-secondary">Document Title / शीर्षक</label>
            <input
              type="text"
              required
              value={newDocTitle}
              onChange={e => setNewDocTitle(e.target.value)}
              placeholder="e.g. Cardiology Discharge Summary"
              className="w-full h-10 px-3 bg-surface rounded-xl border border-border text-sm text-med-text-primary outline-none focus:border-med-green"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-med-text-secondary">Document Type</label>
              <select
                value={newDocType}
                onChange={e => setNewDocType(e.target.value as any)}
                className="w-full h-10 px-3 bg-surface rounded-xl border border-border text-xs text-med-text-primary outline-none focus:border-med-green"
              >
                <option value="PRESCRIPTION">Prescription (पर्चा)</option>
                <option value="LAB_REPORT">Lab Report (जांच रिपोर्ट)</option>
                <option value="DISCHARGE_SUMMARY">Discharge Summary</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-med-text-secondary">Hospital / Facility</label>
              <input
                type="text"
                value={newDocFacility}
                onChange={e => setNewDocFacility(e.target.value)}
                placeholder="e.g. City Hospital"
                className="w-full h-10 px-3 bg-surface rounded-xl border border-border text-xs text-med-text-primary outline-none focus:border-med-green"
              />
            </div>
          </div>

          <label className="p-6 rounded-xl border-2 border-dashed border-border hover:border-med-green/50 text-center space-y-2 bg-surface cursor-pointer block">
            <input
              type="file"
              required
              accept="image/*,application/pdf"
              className="hidden"
              onChange={e => setNewDocFile(e.target.files?.[0] || null)}
            />
            <UploadCloud className="w-8 h-8 mx-auto text-med-green" />
            <div className="text-xs font-bold text-med-text-primary">
              {newDocFile ? newDocFile.name : 'Click to select a document file'}
            </div>
            <div className="text-[11px] text-med-text-muted">
              Supports JPEG, PNG, or PDF up to 15MB • Automatic OCR extraction
            </div>
          </label>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="secondary" size="md" type="button" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" isLoading={isUploading} disabled={!newDocFile}>
              Digitize & Store Document
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Document Details Modal */}
      {selectedDoc && (
        <Modal
          isOpen={Boolean(selectedDoc)}
          onClose={() => setSelectedDoc(null)}
          title={`Document Details: ${selectedDoc.title}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-surface border border-border flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-med-text-primary">{selectedDoc.facility}</div>
                <div className="text-med-text-muted">Date: {selectedDoc.date} • Doctor: {selectedDoc.doctorName}</div>
              </div>
              <Badge variant="green" size="sm">{String(selectedDoc.documentType || '').replace('_', ' ')}</Badge>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-med-text-muted uppercase text-[11px]">Extracted Medical Entities:</span>
              {selectedDoc.entities.length === 0 ? (
                <p className="text-med-text-muted">Digitization is still in progress for this document.</p>
              ) : (
                <div className="space-y-1">
                  {selectedDoc.entities.map((e: any, idx: number) => (
                    <div key={idx} className="p-2 rounded-lg bg-surface border border-border flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-med-green mr-2">[{e.category}]</span>
                        <span className="font-semibold text-med-text-primary">{e.value}</span>
                      </div>
                      <span className="text-[11px] font-mono text-med-text-muted">{e.confidence}% confidence</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="secondary" size="sm" onClick={() => setSelectedDoc(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
