import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  AlertCircle, 
  QrCode, 
  Heart, 
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  User,
  Phone
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api, ApiError } from '../../services/api';

export const PatientPortalAuth: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login form
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Register form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAbha, setRegAbha] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await api.loginPatientAccount(identifier.trim(), password);
      navigate('/patient/dashboard');
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : 'Unable to sign in. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await api.registerPatientAccount({
        email: regEmail.trim(),
        password: regPassword,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: regPhone.trim() || undefined,
        abhaId: regAbha.trim() || undefined,
      });
      navigate('/patient/dashboard');
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : 'Unable to create your account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-med-text-primary p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-med-green/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand identity */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-med-green/15 border border-med-green/30 flex items-center justify-center text-med-green shadow-glow-green-sm">
            <Heart className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Medi<span className="text-med-green">Kiosk</span> Patient Portal
          </h1>
          <p className="text-xs sm:text-sm text-med-text-secondary">
            Personal health records dashboard & medical data vault
          </p>
        </div>

        {/* Tab switch: Sign In vs Register */}
        <div className="flex rounded-xl bg-surface p-1 border border-border">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login' 
                ? 'bg-med-green text-background shadow-glow-green-sm' 
                : 'text-med-text-secondary hover:text-med-text-primary'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In / प्रवेश</span>
          </button>

          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'register' 
                ? 'bg-med-green text-background shadow-glow-green-sm' 
                : 'text-med-text-secondary hover:text-med-text-primary'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Register / नया खाता</span>
          </button>
        </div>

        {/* Form Card */}
        <Card className="p-6 sm:p-7 bg-surface-elevated border-border shadow-surface space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-med-text-secondary">
                  Login ID / Email / Mobile / ABHA Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-med-text-muted absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder="you@example.com or mobile number"
                    className="w-full h-11 pl-10 pr-3.5 bg-surface rounded-xl border border-border text-sm text-med-text-primary placeholder:text-med-text-muted focus:border-med-green outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-med-text-secondary">
                  Password / पासवर्ड
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-med-text-muted absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 pl-10 pr-3.5 bg-surface rounded-xl border border-border text-sm text-med-text-primary placeholder:text-med-text-muted focus:border-med-green outline-none"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full font-bold shadow-glow-green"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In to Dashboard / डैशबोर्ड खोलें
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-med-text-secondary">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="w-full h-10 px-3 bg-surface rounded-xl border border-border text-xs text-med-text-primary outline-none focus:border-med-green"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-med-text-secondary">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="w-full h-10 px-3 bg-surface rounded-xl border border-border text-xs text-med-text-primary outline-none focus:border-med-green"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-med-text-secondary">Email Address</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  placeholder="patient@example.in"
                  className="w-full h-10 px-3 bg-surface rounded-xl border border-border text-xs text-med-text-primary outline-none focus:border-med-green"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-med-text-secondary">Mobile Number</label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value)}
                    placeholder="+91 98112 43210"
                    className="w-full h-10 px-3 bg-surface rounded-xl border border-border text-xs text-med-text-primary outline-none focus:border-med-green"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-med-text-secondary">ABHA ID (Optional)</label>
                  <input
                    type="text"
                    value={regAbha}
                    onChange={e => setRegAbha(e.target.value)}
                    placeholder="14-1234-5678-9012"
                    className="w-full h-10 px-3 bg-surface rounded-xl border border-border text-xs text-med-text-primary outline-none focus:border-med-green"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-med-text-secondary">Create Password</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full h-10 px-3 bg-surface rounded-xl border border-border text-xs text-med-text-primary outline-none focus:border-med-green"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full font-bold shadow-glow-green mt-2"
                rightIcon={<UserPlus className="w-4 h-4" />}
              >
                Create Account & Open Dashboard
              </Button>
            </form>
          )}

          {/* Security & DPDP compliance note */}
          <div className="pt-3 border-t border-border flex items-start gap-2 text-[11px] text-med-text-muted">
            <ShieldCheck className="w-4 h-4 text-med-green shrink-0 mt-0.5" />
            <span>
              Compliant with Digital Personal Data Protection Act 2023 & Ayushman Bharat Digital Mission (ABDM).
            </span>
          </div>
        </Card>

        {/* Navigation back to public kiosk */}
        <div className="text-center space-y-2">
          <button
            onClick={() => navigate('/patient/welcome')}
            className="text-xs text-med-green hover:underline font-semibold"
          >
            ← Back to Walk-up Kiosk Terminal / कियोस्क पर जाएं
          </button>
        </div>
      </div>
    </div>
  );
};
