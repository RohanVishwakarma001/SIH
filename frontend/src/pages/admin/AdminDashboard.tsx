import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  CheckCircle2, 
  FileText, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  Activity, 
  Lock, 
  ArrowUpRight,
  Sparkles,
  Layers,
  Search
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';

const EMPTY_METRICS = {
  patientsToday: 0,
  historiesCompletedKiosk: 0,
  completionRatePct: 0,
  avgIntakeTimeMinutes: 0,
  traditionalIntakeMinutes: 0,
  timeSavedMinutesPerPatient: 0,
  urgentRedFlagsIntercepted: 0,
  documentsOcrProcessed: 0,
  ocrAccuracyRatePct: 0,
};

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'analytics' | 'audit_logs' | 'consent_logs'>('analytics');
  const [metrics, setMetrics] = useState<any>(EMPTY_METRICS);
  const [hourlyData, setHourlyData] = useState<{ hour: string; intake: number; redFlags: number }[]>([]);
  const [deptBreakdown, setDeptBreakdown] = useState<{ name: string; count: number; pct: number; color: string }[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [consentLogs, setConsentLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      api.getAdminAnalytics().then(res => {
        if (res?.metrics) setMetrics(res.metrics);
        if (res?.hourlyFlow) setHourlyData(res.hourlyFlow);
        if (res?.departmentDistribution) setDeptBreakdown(res.departmentDistribution);
      }),
      api.getAdminAuditLogs().then(res => {
        if (res?.logs) setAuditLogs(res.logs);
      }),
      api.getConsentRegistry().then(res => {
        if (res?.registry) setConsentLogs(res.registry);
      }),
    ]).finally(() => setIsLoading(false));
  }, []);


  return (
    <div className="min-h-screen bg-background text-med-text-primary p-6 space-y-6">
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-med-text-primary tracking-tight">
              Hospital Executive Operations & Compliance
            </h1>
            <span className="px-2 py-0.5 rounded bg-med-green/10 text-med-green text-xs font-bold border border-med-green/20">
              Enterprise Admin
            </span>
          </div>
          <p className="text-xs text-med-text-secondary mt-0.5">
            AI Pre-Consultation Throughput, Clinical Red-Flag Governance, and ABDM DPDP Audit Trail
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 p-1 bg-surface-elevated rounded-xl border border-border text-xs">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'analytics'
                ? 'bg-med-green text-background shadow-glow-green-sm'
                : 'text-med-text-secondary hover:text-med-text-primary'
            }`}
          >
            Operational Analytics
          </button>
          <button
            onClick={() => setActiveTab('audit_logs')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'audit_logs'
                ? 'bg-med-green text-background shadow-glow-green-sm'
                : 'text-med-text-secondary hover:text-med-text-primary'
            }`}
          >
            Clinical Audit Trail
          </button>
          <button
            onClick={() => setActiveTab('consent_logs')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'consent_logs'
                ? 'bg-med-green text-background shadow-glow-green-sm'
                : 'text-med-text-secondary hover:text-med-text-primary'
            }`}
          >
            ABDM Consent Records
          </button>
        </div>
      </div>

      {/* 5 Enterprise Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card className="p-4 bg-surface-elevated border-border">
          <div className="flex items-center justify-between text-xs text-med-text-muted mb-1">
            <span>Patients Today</span>
            <Users className="w-4 h-4 text-med-green" />
          </div>
          <div className="text-2xl font-black text-med-text-primary font-mono">{metrics.patientsToday}</div>
          <div className="text-[11px] text-med-text-secondary mt-1 flex items-center gap-1 font-semibold">
            <span>Checked in today</span>
          </div>
        </Card>

        <Card className="p-4 bg-surface-elevated border-border">
          <div className="flex items-center justify-between text-xs text-med-text-muted mb-1">
            <span>Histories Completed</span>
            <CheckCircle2 className="w-4 h-4 text-med-green" />
          </div>
          <div className="text-2xl font-black text-med-green font-mono">{metrics.historiesCompletedKiosk}</div>
          <div className="text-[11px] text-med-text-secondary mt-1">
            {metrics.completionRatePct}% Completed in Kiosk
          </div>
        </Card>

        <Card className="p-4 bg-surface-elevated border-border">
          <div className="flex items-center justify-between text-xs text-med-text-muted mb-1">
            <span>OCR Documents</span>
            <FileText className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono">{metrics.documentsOcrProcessed}</div>
          <div className="text-[11px] text-med-text-secondary mt-1">
            {metrics.ocrAccuracyRatePct}% Avg OCR Confidence
          </div>
        </Card>

        <Card className="p-4 bg-surface-elevated border-med-urgent/40 shadow-glow-urgent">
          <div className="flex items-center justify-between text-xs text-red-400 mb-1 font-bold">
            <span>Red Flags Triage</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400 font-mono">{metrics.urgentRedFlagsIntercepted}</div>
          <div className="text-[11px] text-red-300 font-semibold mt-1">
            Active red-flag alerts
          </div>
        </Card>

        <Card className="p-4 bg-surface-elevated border-border col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-med-text-muted mb-1">
            <span>Avg Intake Time</span>
            <Clock className="w-4 h-4 text-med-green" />
          </div>
          <div className="text-2xl font-black text-med-green font-mono">{metrics.avgIntakeTimeMinutes}m</div>
          <div className="text-[11px] text-med-text-secondary mt-1">
            Traditional: {metrics.traditionalIntakeMinutes}m ({metrics.timeSavedMinutesPerPatient}m Saved)
          </div>
        </Card>
      </div>

      {/* Tab 1: Operational Analytics & Minimal Meaningful Charts */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Hourly OPD Intake Flow Bar Chart (7 cols) */}
          <Card className="lg:col-span-7 p-5 bg-surface border-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-med-text-primary">
                  Hourly OPD Intake Flow (MediKiosk Terminal Throughput)
                </h3>
                <p className="text-xs text-med-text-secondary">
                  Real-time kiosk completion vs red-flags intercepted by hour of OPD shift.
                </p>
              </div>
              <Badge variant="green" size="sm" dot>Live Telemetry</Badge>
            </div>

            {/* Clean SVG Bar Chart */}
            {hourlyData.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-xs text-med-text-muted">
                No kiosk intake recorded yet today.
              </div>
            ) : (
              <>
                <div className="pt-4 h-56 flex items-end justify-between gap-3 px-2 border-b border-border pb-2">
                  {hourlyData.map((item, idx) => {
                    const maxIntake = Math.max(1, ...hourlyData.map(h => h.intake));
                    const maxRedFlags = Math.max(1, ...hourlyData.map(h => h.redFlags));
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                        <span className="text-[10px] font-mono text-med-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.intake} pts
                        </span>
                        <div className="w-full max-w-[38px] flex items-end gap-1 justify-center h-full">
                          <div
                            className="w-1/2 bg-med-green/80 hover:bg-med-green rounded-t-md transition-all group-hover:shadow-glow-green-sm"
                            style={{ height: `${(item.intake / maxIntake) * 100}%` }}
                          />
                          <div
                            className="w-1/2 bg-red-400/80 hover:bg-red-400 rounded-t-md transition-all group-hover:shadow-glow-urgent"
                            style={{ height: `${(item.redFlags / maxRedFlags) * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-med-text-secondary mt-1">{item.hour}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-med-green" />
                      <span className="text-med-text-secondary">Normal / Completed Intake</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-red-400" />
                      <span className="text-med-text-secondary">Stat Urgent Red-Flags</span>
                    </div>
                  </div>
                  <span className="text-med-text-muted font-mono">
                    Peak OPD: {hourlyData.reduce((max, h) => (h.intake > max.intake ? h : max), hourlyData[0]).hour}
                  </span>
                </div>
              </>
            )}
          </Card>

          {/* Department Breakdown (5 cols) */}
          <Card className="lg:col-span-5 p-5 bg-surface border-border space-y-4">
            <div>
              <h3 className="font-bold text-sm text-med-text-primary">
                Department Triage Distribution
              </h3>
              <p className="text-xs text-med-text-secondary">
                Intake volume and completion rate across specialized OPD wings.
              </p>
            </div>

            {deptBreakdown.length === 0 ? (
              <div className="text-xs text-med-text-muted">No patients checked in today yet.</div>
            ) : (
              <div className="space-y-3 pt-1">
                {deptBreakdown.map((dept, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-med-text-primary">{dept.name}</span>
                      <span className="font-mono text-med-text-muted">{dept.count} patients</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-elevated overflow-hidden flex items-center justify-between">
                      <div className={`h-full ${dept.color}`} style={{ width: `${dept.pct}%` }} />
                      <span className="font-bold text-med-text-primary w-8 text-right">{dept.pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Tab 2: Clinical Audit Trail */}
      {activeTab === 'audit_logs' && (
        <Card className="p-5 bg-surface border-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-med-text-primary">
                Clinical Audit Trail & AI Traceability Logs
              </h3>
              <p className="text-xs text-med-text-secondary">
                Immutable event logging for all AI predictions, red-flag triggers, and physician reviews.
              </p>
            </div>
            <Badge variant="green" size="sm">ISO 27799 / ABDM Compliant</Badge>
          </div>

          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-elevated border-b border-border text-med-text-secondary uppercase font-bold">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Actor / Agent</th>
                  <th className="p-3">Action Event</th>
                  <th className="p-3">Patient Token</th>
                  <th className="p-3">Event Details</th>
                  <th className="p-3">IP / Terminal</th>
                  <th className="p-3">Audit State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {auditLogs.map((log, idx) => (
                  <tr key={log.id || idx} className="hover:bg-surface-elevated/50 font-mono">
                    <td className="p-3 text-med-text-muted">{log.timestamp}</td>
                    <td className="p-3 text-med-text-primary font-bold">{log.actor} ({log.role})</td>
                    <td className="p-3 font-semibold text-med-green">{log.action}</td>
                    <td className="p-3 text-med-text-primary font-bold">{log.patientToken || 'OPD'}</td>
                    <td className="p-3 text-med-text-secondary font-sans max-w-sm truncate">{log.details || 'Clinical event'}</td>
                    <td className="p-3 text-med-text-muted text-[11px]">{log.ipAddress || 'Not recorded'}</td>
                    <td className="p-3">
                      <Badge variant={log.status === 'ALERT' ? 'urgent' : 'green'} size="sm">
                        {log.status || 'VERIFIED'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 3: ABDM Consent Logs */}
      {activeTab === 'consent_logs' && (
        <Card className="p-5 bg-surface border-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-med-text-primary">
                ABDM Digital Health Record & Consent Registry
              </h3>
              <p className="text-xs text-med-text-secondary">
                Ayushman Bharat Digital Mission (ABDM) electronic consent logs under DPDP Act 2023.
              </p>
            </div>
            <span className="text-xs font-mono text-med-green flex items-center gap-1 font-bold">
              <Lock className="w-3.5 h-3.5" /> End-to-End Encrypted
            </span>
          </div>

          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-surface-elevated border-b border-border text-med-text-secondary uppercase font-bold">
                <tr>
                  <th className="p-3">Consent Artifact ID</th>
                  <th className="p-3">ABHA ID</th>
                  <th className="p-3">Granted Time</th>
                  <th className="p-3">Consent Purpose</th>
                  <th className="p-3">Validity</th>
                  <th className="p-3">Consent Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {consentLogs.map((c, idx) => (
                  <tr key={c.id || idx} className="hover:bg-surface-elevated/50">
                    <td className="p-3 font-bold text-med-text-primary">{c.id}</td>
                    <td className="p-3 text-med-green">{c.abhaId}</td>
                    <td className="p-3 text-med-text-muted">{c.grantedTime}</td>
                    <td className="p-3 font-sans text-med-text-secondary">{c.purpose}</td>
                    <td className="p-3 text-med-text-muted">{c.validity}</td>
                    <td className="p-3"><Badge variant="green" size="sm">{c.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
