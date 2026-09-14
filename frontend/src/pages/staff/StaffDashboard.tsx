import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Activity, 
  PhoneCall, 
  ShieldAlert, 
  Monitor, 
  UserPlus, 
  RefreshCw,
  Bell,
  ArrowRight
} from 'lucide-react';
import { useDoctor } from '../../context/DoctorContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { api } from '../../services/api';

export const StaffDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { patients } = useDoctor();

  const [activeAlertAcknowledged, setActiveAlertAcknowledged] = useState(false);
  const [kiosks, setKiosks] = useState<any[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);

  useEffect(() => {
    api.getStaffKiosks()
      .then(res => {
        if (res?.kiosks) setKiosks(res.kiosks);
      })
      .catch(() => {});

    api.getStaffAlerts()
      .then(res => {
        if (res?.alerts) setActiveAlerts(res.alerts);
      })
      .catch(() => {});
  }, []);

  const activeAlert = activeAlerts[0];

  const handleAcknowledgeAlert = () => {
    if (!activeAlert) return;
    setActiveAlertAcknowledged(true);
    api.acknowledgeAlert(activeAlert.id).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-background text-med-text-primary p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-med-green">
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-med-text-primary">
              OPD Triage Staff & Kiosk Monitoring Desk
            </h1>
            <p className="text-xs text-med-text-secondary">
              {kiosks.length} MediKiosk Terminal{kiosks.length !== 1 ? 's' : ''} • Real-Time Emergency Dispatch
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/doctor/dashboard')}
          >
            Switch to Doctor Workstation
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/patient/welcome')}
          >
            Open Kiosk Terminal
          </Button>
        </div>
      </div>

      {/* Emergency Red Flag Broadcast Alert (Audible & Visual) */}
      {activeAlert && !activeAlertAcknowledged && (
        <Card className="p-5 bg-surface-elevated border-2 border-med-urgent shadow-glow-urgent flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-pulse-subtle">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500 text-red-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-red-400 bg-red-500/20 px-2.5 py-0.5 rounded border border-red-500/30">
                  STAT RED-FLAG DISPATCH ALERT
                </span>
                <span className="text-xs text-med-text-muted font-mono">{activeAlert.kioskTerminal}</span>
              </div>
              <h2 className="text-lg font-black text-med-text-primary mt-1">
                Patient {activeAlert.patientName} (Token {activeAlert.patientToken}): {activeAlert.title}
              </h2>
              <p className="text-xs text-red-300">
                {activeAlert.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="danger"
              size="lg"
              className="font-bold shadow-glow-urgent"
              onClick={handleAcknowledgeAlert}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Acknowledge & Dispatch Nurse
            </Button>
          </div>
        </Card>
      )}

      {/* 4 Active MediKiosk Terminals Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-med-text-primary uppercase tracking-wider">
          MediKiosk Terminal Live Telemetry
        </h2>

        {kiosks.length === 0 ? (
          <div className="text-xs text-med-text-muted">No kiosk terminals registered.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kiosks.map((kiosk) => {
              const isAlert = !activeAlertAcknowledged && activeAlert?.kioskTerminal?.includes(kiosk.terminalCode);

              return (
                <Card
                  key={kiosk.id}
                  className={`p-4 transition-all border ${
                    isAlert
                      ? 'border-med-urgent bg-surface-elevated shadow-glow-urgent'
                      : 'border-border bg-surface hover:bg-surface-elevated'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-sm text-med-text-primary flex items-center gap-1.5">
                      <Monitor className="w-4 h-4 text-med-green" />
                      {kiosk.terminalCode}
                    </span>
                    <Badge variant={isAlert ? 'urgent' : kiosk.status === 'In Use' ? 'green' : 'normal'} size="sm" dot>
                      {isAlert ? 'RED FLAG' : kiosk.status}
                    </Badge>
                  </div>

                  <div className="space-y-1.5 text-xs text-med-text-secondary">
                    <div><strong>Location:</strong> {kiosk.location}</div>
                    <div><strong>Current Patient:</strong> {kiosk.patientToken}</div>
                    <div><strong>Active Language:</strong> {kiosk.language}</div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* OPD Assistance Queue */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-med-text-primary uppercase tracking-wider">
          High-Volume Triage & Registration Queue
        </h2>

        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-elevated border-b border-border text-med-text-secondary uppercase font-bold">
              <tr>
                <th className="p-3">Token</th>
                <th className="p-3">Patient</th>
                <th className="p-3">Dept</th>
                <th className="p-3">Triage State</th>
                <th className="p-3">Kiosk Intake</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {patients.map(p => (
                <tr key={p.id} className="hover:bg-surface-elevated/50">
                  <td className="p-3 font-mono font-bold text-med-text-primary">{p.token}</td>
                  <td className="p-3 font-semibold text-med-text-primary">{p.name} ({p.age}y/{p.gender[0]})</td>
                  <td className="p-3 uppercase text-med-text-secondary">{p.department}</td>
                  <td className="p-3">
                    <Badge variant={p.priority === 'urgent' ? 'urgent' : p.priority === 'attention' ? 'attention' : 'normal'} size="sm">
                      {p.priority}
                    </Badge>
                  </td>
                  <td className="p-3 text-med-green font-semibold capitalize">
                    {p.historyStatus.replace(/-/g, ' ')}
                  </td>
                  <td className="p-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/doctor/patient/${p.id}`)}
                    >
                      View Workstation
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
