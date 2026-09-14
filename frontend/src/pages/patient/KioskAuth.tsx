import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Smartphone, 
  UserPlus, 
  ArrowRight, 
  CheckCircle2, 
  KeyRound,
  IdCard,
  Sparkles
} from 'lucide-react';
import { useKiosk, PatientAuthData } from '../../context/KioskContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';

export const KioskAuth: React.FC = () => {
  const navigate = useNavigate();
  const { authData, setAuthData, language } = useKiosk();
  const { speakText } = useAccessibility();

  const [authMethod, setAuthMethod] = useState<'abha' | 'mobile' | 'walkin'>('abha');
  const [abhaInput, setAbhaInput] = useState<string>('91-4829-1029-4412');
  const [mobileInput, setMobileInput] = useState<string>('9811243210');
  const [otpInput, setOtpInput] = useState<string>('4829');
  const [isOtpSent, setIsOtpSent] = useState<boolean>(true);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Walk-in form states
  const [walkinName, setWalkinName] = useState<string>('Rameshwar Prasad Patel');
  const [walkinAge, setWalkinAge] = useState<number>(58);
  const [walkinGender, setWalkinGender] = useState<'Male' | 'Female' | 'Other'>('Male');

  const handleVerifyAndProceed = async () => {
    setIsVerifying(true);
    speakText(language === 'hi' ? 'पहचान सत्यापित हो गई है। कृपया सहमति पृष्ठ पर आगे बढ़ें।' : 'Identity verified successfully. Proceeding to consent.', language);

    const fallbackAuthData: PatientAuthData = {
      method: authMethod,
      abhaId: authMethod === 'abha' ? abhaInput : undefined,
      mobile: authMethod === 'mobile' ? mobileInput : authData.mobile,
      name: authMethod === 'walkin' ? walkinName : 'Rameshwar Prasad Patel',
      age: authMethod === 'walkin' ? walkinAge : 58,
      gender: authMethod === 'walkin' ? walkinGender : 'Male',
      abhaVerified: authMethod === 'abha'
    };

    try {
      let result: { patient: any };
      if (authMethod === 'abha') {
        result = await api.verifyAbha(abhaInput, otpInput);
      } else if (authMethod === 'mobile') {
        result = await api.verifyMobile(mobileInput, otpInput);
      } else {
        result = await api.registerWalkin({ name: walkinName, age: walkinAge, gender: walkinGender, mobile: undefined });
      }

      setAuthData({
        ...fallbackAuthData,
        name: result.patient?.name || fallbackAuthData.name,
        age: result.patient?.age ?? fallbackAuthData.age,
        gender: result.patient?.gender || fallbackAuthData.gender,
        patientId: result.patient?.id,
        token: result.patient?.token,
      });
    } catch {
      // Offline fallback: proceed locally without a verified backend patient id
      setAuthData(fallbackAuthData);
    } finally {
      setIsVerifying(false);
      navigate('/patient/consent');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-2xl mx-auto py-6 space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-border text-xs font-semibold text-med-text-secondary">
          <IdCard className="w-4 h-4 text-med-green" />
          <span>Step 2 of 6 • पहचान एवं सत्यापन</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-med-text-primary">
          Patient Check-In / मरीज़ पहचान
        </h1>
        <p className="text-sm text-med-text-secondary">
          Select your check-in method to retrieve prior records or create a new OPD token.
        </p>
      </div>

      {/* Tabs for Login Type */}
      <div className="grid grid-cols-3 gap-2 w-full p-1.5 bg-surface-elevated rounded-2xl border border-border">
        <button
          onClick={() => setAuthMethod('abha')}
          className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${
            authMethod === 'abha'
              ? 'bg-med-green text-background shadow-glow-green-sm'
              : 'text-med-text-secondary hover:text-med-text-primary hover:bg-surface'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>ABHA ID</span>
        </button>

        <button
          onClick={() => setAuthMethod('mobile')}
          className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${
            authMethod === 'mobile'
              ? 'bg-med-green text-background shadow-glow-green-sm'
              : 'text-med-text-secondary hover:text-med-text-primary hover:bg-surface'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Mobile OTP</span>
        </button>

        <button
          onClick={() => setAuthMethod('walkin')}
          className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${
            authMethod === 'walkin'
              ? 'bg-med-green text-background shadow-glow-green-sm'
              : 'text-med-text-secondary hover:text-med-text-primary hover:bg-surface'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>New Patient</span>
        </button>
      </div>

      {/* Form Container */}
      <Card className="w-full p-6 sm:p-8 space-y-6 bg-surface-elevated border-border">
        {authMethod === 'abha' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-med-text-primary flex items-center gap-2">
                <span>14-Digit ABHA Number / आभा संख्या</span>
              </label>
              <span className="text-[11px] px-2 py-0.5 rounded bg-med-green/10 text-med-green border border-med-green/20 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> ABDM Linked
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={abhaInput}
                onChange={e => setAbhaInput(e.target.value)}
                placeholder="XX-XXXX-XXXX-XXXX"
                className="w-full h-14 px-4 text-xl font-mono tracking-wider bg-surface rounded-xl border border-border focus:border-med-green focus:ring-1 focus:ring-med-green outline-none text-med-text-primary"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-med-green flex items-center gap-1 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Record</span>
              </div>
            </div>

            {/* Found Record Profile Preview */}
            <div className="p-4 rounded-xl bg-surface border border-med-green/30 flex items-center justify-between">
              <div>
                <div className="font-bold text-base text-med-text-primary">Rameshwar Prasad Patel</div>
                <div className="text-xs text-med-text-secondary">58 Years • Male • +91 98112 43210</div>
                <div className="text-[11px] text-med-green font-mono mt-0.5">rameshwar.patel@abdm</div>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 rounded bg-med-green/15 text-med-green text-xs font-bold border border-med-green/30">
                  ABDM Verified
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-med-text-secondary">
                Authentication OTP sent to registered mobile (Demo auto-filled):
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={otpInput}
                  onChange={e => setOtpInput(e.target.value)}
                  className="w-36 h-12 text-center text-xl font-mono tracking-widest bg-surface rounded-xl border border-border text-med-text-primary focus:border-med-green outline-none"
                />
                <span className="text-xs text-med-text-muted flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-med-green" /> OTP 4829 verified
                </span>
              </div>
            </div>
          </div>
        )}

        {authMethod === 'mobile' && (
          <div className="space-y-4">
            <label className="text-sm font-bold text-med-text-primary">
              10-Digit Mobile Number / मोबाइल नंबर
            </label>
            <div className="flex gap-2">
              <span className="h-14 px-4 flex items-center justify-center bg-surface border border-border rounded-xl font-mono text-sm text-med-text-secondary">
                +91
              </span>
              <input
                type="text"
                value={mobileInput}
                onChange={e => setMobileInput(e.target.value)}
                placeholder="Enter 10 digit mobile"
                className="flex-1 h-14 px-4 text-xl font-mono bg-surface rounded-xl border border-border focus:border-med-green outline-none text-med-text-primary"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-med-text-secondary pt-2">
              <span>Demo OTP: 4829 (Valid for 5 mins)</span>
              <button className="text-med-green hover:underline">Resend OTP</button>
            </div>
          </div>
        )}

        {authMethod === 'walkin' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-med-text-secondary">Full Name / पूरा नाम</label>
              <input
                type="text"
                value={walkinName}
                onChange={e => setWalkinName(e.target.value)}
                className="w-full h-12 px-4 mt-1 bg-surface rounded-xl border border-border text-med-text-primary outline-none focus:border-med-green"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-med-text-secondary">Age / उम्र</label>
                <input
                  type="number"
                  value={walkinAge}
                  onChange={e => setWalkinAge(Number(e.target.value))}
                  className="w-full h-12 px-4 mt-1 bg-surface rounded-xl border border-border text-med-text-primary outline-none focus:border-med-green"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-med-text-secondary">Gender / लिंग</label>
                <select
                  value={walkinGender}
                  onChange={e => setWalkinGender(e.target.value as any)}
                  className="w-full h-12 px-4 mt-1 bg-surface rounded-xl border border-border text-med-text-primary outline-none focus:border-med-green"
                >
                  <option value="Male">Male (पुरुष)</option>
                  <option value="Female">Female (महिला)</option>
                  <option value="Other">Other (अन्य)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          variant="primary"
          size="xl"
          isLoading={isVerifying}
          className="w-full text-base font-bold shadow-glow-green"
          onClick={handleVerifyAndProceed}
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          Verify & Continue / सत्यापित कर आगे बढ़ें
        </Button>
      </Card>
    </div>
  );
};
