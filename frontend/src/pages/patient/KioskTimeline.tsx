import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Calendar, 
  Activity, 
  FileText, 
  Pill, 
  ArrowRight, 
  AlertCircle,
  Building2,
  Sparkles
} from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { MOCK_PATIENTS } from '../../data/mockData';
import { api } from '../../services/api';

export const KioskTimeline: React.FC = () => {
  const navigate = useNavigate();
  const { authData } = useKiosk();

  // Default to mock patient 1 timeline, replaced by real backend data when available
  const [events, setEvents] = useState(MOCK_PATIENTS[0].timeline);

  useEffect(() => {
    const patId = authData.patientId || 'pat_001';
    api.getPatientTimeline(patId)
      .then(res => {
        if (res?.timeline && res.timeline.length > 0) setEvents(res.timeline as any);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col max-w-3xl w-full mx-auto py-4 space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-border text-xs font-semibold text-med-text-secondary mb-1">
            <Clock className="w-4 h-4 text-med-green" />
            <span>Step 5 of 6 • स्वास्थ्य समयरेखा (Medical Timeline)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-med-text-primary">
            Chronological Health Journey
          </h1>
          <p className="text-xs text-med-text-secondary">
            AI synthesized your past consultations, lab reports, and today's symptoms into a timeline.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/patient/summary')}
          className="font-bold shadow-glow-green"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          View Clinical Summary / सारांश देखें
        </Button>
      </div>

      {/* Chronological Timeline Container */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
        {events.map((event, idx) => {
          const isToday = event.yearMonth === 'Sep 2026';

          return (
            <div key={event.id} className="relative group">
              {/* Timeline Marker Node */}
              <div className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                event.isImportant
                  ? 'bg-red-500/20 border-red-500 text-red-400 shadow-glow-urgent'
                  : isToday
                  ? 'bg-med-green/20 border-med-green text-med-green shadow-glow-green-sm'
                  : 'bg-surface border-border text-med-text-muted group-hover:border-med-green'
              }`}>
                <div className={`w-2 h-2 rounded-full ${event.isImportant ? 'bg-red-500' : isToday ? 'bg-med-green' : 'bg-med-text-muted'}`} />
              </div>

              {/* Event Card */}
              <Card className={`p-4 sm:p-5 transition-all duration-200 border ${
                event.isImportant
                  ? 'bg-surface-elevated border-med-urgent/50 shadow-glow-urgent'
                  : 'bg-surface border-border hover:border-med-green/40 hover:bg-surface-elevated'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-med-text-primary">
                      {event.title}
                    </span>
                    <Badge
                      variant={event.isImportant ? 'urgent' : isToday ? 'green' : 'normal'}
                      size="sm"
                    >
                      {event.badgeText}
                    </Badge>
                  </div>

                  <span className="text-xs font-mono text-med-text-secondary flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-med-green" />
                    {event.date}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-med-green font-medium mb-2">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{event.facility}</span>
                </div>

                <p className="text-xs sm:text-sm text-med-text-secondary leading-relaxed">
                  {event.summary}
                </p>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};
