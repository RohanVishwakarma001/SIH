import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Activity, 
  Users, 
  UserCheck, 
  FileText, 
  Stethoscope, 
  AlertTriangle, 
  BarChart3, 
  Clock, 
  Search, 
  ShieldCheck, 
  Bell,
  ChevronRight,
  LogOut,
  Layers
} from 'lucide-react';
import { useDoctor } from '../../context/DoctorContext';
import { Badge } from '../../components/ui/Badge';
import { api } from '../../services/api';
import { apiClient } from '../../lib/api-client';

export const DoctorLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { patients, selectedPatient, searchQuery, setSearchQuery } = useDoctor();

  const urgentCount = patients.filter(p => p.priority === 'urgent').length;
  const waitingCount = patients.filter(p => p.queueStatus === 'waiting').length;

  const doctorName = apiClient.getUserName() || 'Doctor';
  const initials = doctorName.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();

  const [shiftMetrics, setShiftMetrics] = useState<{ todaysTotalOpd: number; completedHistoriesCount: number; completionRatePct: number; avgIntakeMinutes: number } | null>(null);

  useEffect(() => {
    api.getDoctorDashboard()
      .then((res: any) => setShiftMetrics(res))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex bg-background text-med-text-primary font-sans antialiased">
      {/* Left Navigation Sidebar (Clinical Workstation style) */}
      <aside className="w-64 bg-surface border-r border-border flex flex-col shrink-0 sticky top-0 h-screen select-none z-30">
        {/* Brand */}
        <div className="h-16 px-5 border-b border-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-med-green/10 border border-med-green/30 flex items-center justify-center text-med-green shadow-glow-green-sm">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-med-text-primary">
              Medi<span className="text-med-green">Kiosk</span>
            </div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-med-text-muted">
              Clinical Workstation v2.4
            </div>
          </div>
        </div>

        {/* Doctor Identity Strip */}
        <div className="p-4 border-b border-border bg-surface-elevated/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-med-green/20 border border-med-green/40 flex items-center justify-center font-bold text-med-green text-sm">
              {initials || 'DR'}
            </div>
            <div className="overflow-hidden">
              <div className="font-bold text-xs truncate text-med-text-primary">{doctorName}</div>
              <div className="flex items-center gap-1 text-[10px] text-med-green mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-med-green" />
                <span>On Duty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <NavLink
            to="/doctor/dashboard"
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-med-green text-background shadow-glow-green-sm font-bold'
                  : 'text-med-text-secondary hover:text-med-text-primary hover:bg-surface-elevated'
              }`
            }
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4" />
              <span>OPD Queue / Triage</span>
            </div>
            <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-background/20 font-mono font-bold">
              {waitingCount}
            </span>
          </NavLink>

          <NavLink
            to={`/doctor/patient/${selectedPatient.id}`}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-med-green text-background shadow-glow-green-sm font-bold'
                  : 'text-med-text-secondary hover:text-med-text-primary hover:bg-surface-elevated'
              }`
            }
          >
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-4 h-4" />
              <span>Active Patient View</span>
            </div>
            {urgentCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </NavLink>

          <NavLink
            to="/doctor/documents"
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-med-green text-background shadow-glow-green-sm font-bold'
                  : 'text-med-text-secondary hover:text-med-text-primary hover:bg-surface-elevated'
              }`
            }
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4" />
              <span>Document Workspace</span>
            </div>
            <span className="text-[11px] text-med-text-muted">OCR</span>
          </NavLink>

          <NavLink
            to="/doctor/consultation"
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-med-green text-background shadow-glow-green-sm font-bold'
                  : 'text-med-text-secondary hover:text-med-text-primary hover:bg-surface-elevated'
              }`
            }
          >
            <div className="flex items-center gap-2.5">
              <Stethoscope className="w-4 h-4" />
              <span>Consultation Suite</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-med-green/10 text-med-green border border-med-green/20 font-bold">
              Rx Pad
            </span>
          </NavLink>
        </nav>

        {/* Urgent Alert Warning strip in sidebar */}
        {urgentCount > 0 && (
          <div className="p-3 m-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-red-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{urgentCount} Urgent Red-Flag Alert</span>
            </div>
            <p className="text-[11px] text-red-300/80 leading-tight">
              Token {selectedPatient.token} requires {selectedPatient.redFlag?.title?.toLowerCase() || 'immediate'} evaluation.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 border-t border-border flex items-center justify-between text-xs text-med-text-muted">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-med-green" /> ABDM Linked
          </span>
          <button
            onClick={() => navigate('/patient/welcome')}
            className="hover:text-med-text-primary p-1"
            title="Switch to Kiosk View"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Clinical Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Workstation Top Bar */}
        <header className="h-16 px-6 bg-surface/90 border-b border-border flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
          {/* Quick Search across OPD queue */}
          <div className="relative w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-med-text-muted" />
            <input
              type="text"
              placeholder="Search by Token, Name, ABHA ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-surface-elevated border border-border text-xs text-med-text-primary placeholder:text-med-text-muted focus:border-med-green outline-none"
            />
          </div>

          {/* OPD Shift Metrics Bar */}
          <div className="flex items-center gap-4 text-xs">
            <div className="hidden lg:flex items-center gap-4 px-3.5 py-1.5 rounded-lg bg-surface-elevated border border-border text-med-text-secondary">
              <div className="flex items-center gap-1.5">
                <span className="text-med-text-muted">Today's OPD:</span>
                <span className="font-bold text-med-text-primary">{shiftMetrics?.todaysTotalOpd ?? '—'}</span>
              </div>
              <span className="text-border">|</span>
              <div className="flex items-center gap-1.5">
                <span className="text-med-text-muted">Completed Histories:</span>
                <span className="font-bold text-med-green">
                  {shiftMetrics ? `${shiftMetrics.completedHistoriesCount} (${shiftMetrics.completionRatePct}%)` : '—'}
                </span>
              </div>
              <span className="text-border">|</span>
              <div className="flex items-center gap-1.5">
                <span className="text-med-text-muted">Avg History Time:</span>
                <span className="font-bold text-med-green font-mono">{shiftMetrics ? `${shiftMetrics.avgIntakeMinutes} min` : '—'}</span>
              </div>
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 rounded-lg bg-surface-elevated border border-border text-med-text-secondary hover:text-med-text-primary">
              <Bell className="w-4 h-4" />
              {urgentCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
              )}
            </button>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
