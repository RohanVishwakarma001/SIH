import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ArrowRight, 
  Search, 
  Filter, 
  Sparkles,
  TrendingUp,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useDoctor } from '../../context/DoctorContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';

export const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    patients,
    selectPatientById,
    filterPriority,
    setFilterPriority,
    searchQuery,
    isLoadingQueue,
    queueError,
    refreshQueue
  } = useDoctor();

  const [metrics, setMetrics] = useState<{ todaysTotalOpd: number; completedHistoriesCount: number; completionRatePct: number; avgIntakeMinutes: number; timeSavedMinutesPerPatient: number } | null>(null);

  useEffect(() => {
    api.getDoctorDashboard()
      .then((res: any) => setMetrics(res))
      .catch(() => {});
  }, []);

  const filteredPatients = patients.filter(p => {
    if (filterPriority !== 'all' && p.priority !== filterPriority) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.token.toLowerCase().includes(q) ||
        p.abhaId.toLowerCase().includes(q) ||
        p.chiefComplaintShort.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const urgentPatients = patients.filter(p => p.priority === 'urgent');
  const waitingPatients = patients.filter(p => p.queueStatus === 'waiting');
  const completedPatients = patients.filter(p => p.queueStatus === 'completed');

  const handleOpenPatient = (patientId: string) => {
    selectPatientById(patientId);
    navigate(`/doctor/patient/${patientId}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-med-text-primary tracking-tight">
            OPD Clinical Queue & Triage
          </h1>
          <p className="text-xs text-med-text-secondary mt-0.5">
            High-Volume AI Triage Monitor
          </p>
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-elevated border border-border text-xs">
          <span className="w-2 h-2 rounded-full bg-med-green animate-pulse" />
          <span className="font-semibold text-med-green">AI Intake Kiosks Active</span>
        </div>
      </div>

      {/* OPD KPI Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card className="p-4 bg-surface-elevated border-border">
          <div className="flex items-center justify-between text-xs text-med-text-muted mb-1">
            <span>Today's Total OPD</span>
            <Users className="w-4 h-4 text-med-green" />
          </div>
          <div className="text-2xl font-black text-med-text-primary font-mono">{metrics?.todaysTotalOpd ?? '—'}</div>
          <div className="text-[11px] text-med-text-secondary mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-med-green" />
            <span>Checked in today</span>
          </div>
        </Card>

        <Card className="p-4 bg-surface-elevated border-border">
          <div className="flex items-center justify-between text-xs text-med-text-muted mb-1">
            <span>Waiting Patients</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">{waitingPatients.length}</div>
          <div className="text-[11px] text-med-text-secondary mt-1">In OPD waiting lobby</div>
        </Card>

        <Card className="p-4 bg-surface-elevated border-border">
          <div className="flex items-center justify-between text-xs text-med-text-muted mb-1">
            <span>Histories Completed</span>
            <CheckCircle2 className="w-4 h-4 text-med-green" />
          </div>
          <div className="text-2xl font-black text-med-green font-mono">{metrics?.completedHistoriesCount ?? '—'}</div>
          <div className="text-[11px] text-med-green font-semibold mt-1">{metrics ? `${metrics.completionRatePct}% Kiosk Intake` : '—'}</div>
        </Card>

        <Card className="p-4 bg-surface-elevated border-med-urgent/40 shadow-glow-urgent">
          <div className="flex items-center justify-between text-xs text-red-400 mb-1 font-bold">
            <span>Urgent Red Flags</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400 font-mono">{urgentPatients.length}</div>
          <div className="text-[11px] text-red-300 font-semibold mt-1">Priority Triage Dispatch</div>
        </Card>

        <Card className="p-4 bg-surface-elevated border-border col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-med-text-muted mb-1">
            <span>Avg History Intake</span>
            <Sparkles className="w-4 h-4 text-med-green" />
          </div>
          <div className="text-2xl font-black text-med-green font-mono">{metrics ? `${metrics.avgIntakeMinutes}m` : '—'}</div>
          <div className="text-[11px] text-med-text-secondary mt-1">{metrics ? `Saved ${metrics.timeSavedMinutesPerPatient} min/pt` : '—'}</div>
        </Card>
      </div>

      {/* Filter Tabs & Patient Queue Table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 p-1 bg-surface-elevated rounded-xl border border-border text-xs">
            <button
              onClick={() => setFilterPriority('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterPriority === 'all'
                  ? 'bg-med-green text-background shadow-glow-green-sm'
                  : 'text-med-text-secondary hover:text-med-text-primary'
              }`}
            >
              All Queue ({patients.length})
            </button>

            <button
              onClick={() => setFilterPriority('urgent')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                filterPriority === 'urgent'
                  ? 'bg-red-500 text-white shadow-glow-urgent'
                  : 'text-red-400 hover:bg-red-500/10'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Urgent Priority ({urgentPatients.length})</span>
            </button>

            <button
              onClick={() => setFilterPriority('attention')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterPriority === 'attention'
                  ? 'bg-amber-400 text-background'
                  : 'text-amber-400 hover:bg-amber-400/10'
              }`}
            >
              Attention Needed
            </button>

            <button
              onClick={() => setFilterPriority('normal')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterPriority === 'normal'
                  ? 'bg-surface text-med-text-primary'
                  : 'text-med-text-secondary hover:text-med-text-primary'
              }`}
            >
              Normal
            </button>
          </div>

          <span className="text-xs text-med-text-muted">
            Click any patient row to open clinical workspace
          </span>
        </div>

        {/* Dense Clinical Workstation Queue Table */}
        <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-surface">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-elevated text-med-text-secondary font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Token</th>
                <th className="py-3 px-4">Patient Identity</th>
                <th className="py-3 px-4">Age/Sex</th>
                <th className="py-3 px-4">Chief Complaint</th>
                <th className="py-3 px-4">Triage Priority</th>
                <th className="py-3 px-4">History Status</th>
                <th className="py-3 px-4">Docs</th>
                <th className="py-3 px-4">Wait Time</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoadingQueue && patients.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-med-text-muted">
                    Loading OPD queue…
                  </td>
                </tr>
              )}

              {!isLoadingQueue && queueError && (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-red-400">
                    <div className="flex flex-col items-center gap-2">
                      <span>{queueError}</span>
                      <Button variant="secondary" size="sm" onClick={() => refreshQueue()}>
                        Retry
                      </Button>
                    </div>
                  </td>
                </tr>
              )}

              {!isLoadingQueue && !queueError && filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-med-text-muted">
                    No patients currently match this filter.
                  </td>
                </tr>
              )}

              {filteredPatients.map(patient => {
                const isUrgent = patient.priority === 'urgent';

                return (
                  <tr
                    key={patient.id}
                    onClick={() => handleOpenPatient(patient.id)}
                    className={`cursor-pointer transition-colors ${
                      isUrgent
                        ? 'bg-red-500/5 hover:bg-red-500/10 border-l-4 border-l-red-500'
                        : 'hover:bg-surface-elevated/70'
                    }`}
                  >
                    {/* Token */}
                    <td className="py-3 px-4 font-mono font-black text-sm text-med-text-primary">
                      <span className={isUrgent ? 'text-red-400' : 'text-med-green'}>
                        {patient.token}
                      </span>
                    </td>

                    {/* Patient Name & ABHA */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-med-text-primary text-sm">
                        {patient.name}
                      </div>
                      <div className="text-[11px] text-med-text-muted flex items-center gap-1 font-mono">
                        <ShieldCheck className="w-3 h-3 text-med-green" />
                        {patient.abhaId}
                      </div>
                    </td>

                    {/* Age/Gender */}
                    <td className="py-3 px-4 text-med-text-secondary">
                      {patient.age}y / {patient.gender === 'Male' ? 'M' : 'F'}
                    </td>

                    {/* Chief Complaint */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="truncate text-med-text-primary font-medium" title={patient.chiefComplaintShort}>
                        {patient.chiefComplaintShort}
                      </div>
                    </td>

                    {/* Triage Priority */}
                    <td className="py-3 px-4">
                      <Badge
                        variant={patient.priority === 'urgent' ? 'urgent' : patient.priority === 'attention' ? 'attention' : 'normal'}
                        size="sm"
                        dot
                      >
                        {patient.priority.toUpperCase()}
                      </Badge>
                    </td>

                    {/* History Status */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-med-green/10 text-med-green border border-med-green/20 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" />
                        AI Ready
                      </span>
                    </td>

                    {/* Documents */}
                    <td className="py-3 px-4">
                      {patient.documents.length > 0 ? (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-med-text-secondary">
                          <FileText className="w-3.5 h-3.5 text-med-green" />
                          {patient.documents.length} OCR
                        </span>
                      ) : (
                        <span className="text-med-text-muted">-</span>
                      )}
                    </td>

                    {/* Wait Time */}
                    <td className="py-3 px-4 font-mono text-med-text-muted">
                      {patient.waitTimeMinutes}m
                    </td>

                    {/* Action Button */}
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant={isUrgent ? 'danger' : 'secondary'}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenPatient(patient.id);
                        }}
                        rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                      >
                        {isUrgent ? 'Stat Review' : 'Open'}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
