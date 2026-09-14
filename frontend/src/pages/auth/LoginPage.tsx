import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, LogIn, ShieldCheck, AlertCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api, ApiError } from '../../services/api';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const data = await api.login(email.trim(), password);
      const role = data.user?.role;
      if (role === 'DOCTOR') navigate('/doctor/dashboard', { replace: true });
      else if (role === 'STAFF') navigate('/staff', { replace: true });
      else if (role === 'ADMIN') navigate('/admin', { replace: true });
      else navigate('/patient/welcome', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-med-text-primary p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-xl bg-med-green/10 border border-med-green/30 flex items-center justify-center text-med-green shadow-glow-green-sm">
            <Activity className="w-6 h-6" />
          </div>
          <div className="font-extrabold text-xl tracking-tight">
            Medi<span className="text-med-green">Kiosk</span>
          </div>
          <p className="text-xs text-med-text-secondary">
            Clinical Workstation Sign In
          </p>
        </div>

        <Card className="p-6 bg-surface-elevated border-border space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold text-med-text-secondary">Email</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="doctor@hospital.in"
                className="w-full h-11 px-3.5 bg-surface rounded-xl border border-border text-sm text-med-text-primary placeholder:text-med-text-muted focus:border-med-green outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-bold text-med-text-secondary">Password</label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-3.5 bg-surface rounded-xl border border-border text-sm text-med-text-primary placeholder:text-med-text-muted focus:border-med-green outline-none"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full font-bold"
              leftIcon={<LogIn className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          <div className="pt-3 border-t border-border flex items-center gap-1.5 text-[11px] text-med-text-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-med-green shrink-0" />
            <span>For clinical staff (Doctor / Nursing / Admin) accounts only.</span>
          </div>
        </Card>

        <button
          onClick={() => navigate('/patient/welcome')}
          className="w-full text-center text-xs text-med-text-muted hover:text-med-text-secondary"
        >
          Patient? Go to the kiosk instead →
        </button>
      </div>
    </div>
  );
};
