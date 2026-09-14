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
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useKiosk, PatientAuthData } from '../../context/KioskContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';

export const KioskAuth: React.FC = () => {
  const navigate = useNavigate();
  const { setAuthData, language } = useKiosk();
  const { speakText } = useAccessibility();

  const [authMethod, setAuthMethod] = useState<'abha' | 'mobile' | 'walkin'>('abha');
  
  // Clean empty input states (no pre-filled demo data)
  const [abhaInput, setAbhaInput] = useState<string>('');
  const [mobileInput, setMobileInput] = useState<string>('');
  const [otpInput, setOtpInput] = useState<string>('');
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Walk-in form states
  const [walkinName, setWalkinName] = useState<string>('');
  const [walkinAge, setWalkinAge] = useState<string>('');
  const [walkinGender, setWalkinGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [walkinMobile, setWalkinMobile] = useState<string>('');

  const handleSendOtp = () => {
    setErrorMessage(null);
    if (authMethod === 'abha') {
      const cleanAbha = abhaInput.replace(/[^0-9-]/g, '');
      if (cleanAbha.length < 10) {
        setErrorMessage(language === 'hi' ? 'कृपया एक वैध 14-अंकीय आभा संख्या दर्ज करें।' : 'Please enter a valid 14-digit ABHA Number.');
        return;
      }
      setIsOtpSent(true);
      speakText(language === 'hi' ? 'ओटीपी भेजा गया है। कोड दर्ज करें।' : 'OTP sent to registered mobile. Please enter code.', language);
    } else if (authMethod === 'mobile') {
      const cleanPhone = mobileInput.replace(/[^0-9]/g, '');
      if (cleanPhone.length !== 10) {
        setErrorMessage(language === 'hi' ? 'कृपया 10-अंकों का मान्य मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
        return;
      }
      setIsOtpSent(true);
      speakText(language === 'hi' ? 'ओटीपी भेजा गया है। कोड दर्ज करें।' : 'OTP sent to your mobile. Please enter code.', language);
    }
  };

  const handleVerifyAndProceed = async () => {
    setErrorMessage(null);

    // Validation
    if (authMethod === 'abha') {
      if (!abhaInput.trim()) {
        setErrorMessage(language === 'hi' ? 'कृपया अपनी आभा संख्या दर्ज करें।' : 'Please enter your ABHA number.');
        return;
      }
      if (!otpInput.trim()) {
        setErrorMessage(language === 'hi' ? 'कृपया सत्यापन कोड दर्ज करें।' : 'Please enter the verification code.');
        return;
      }
    } else if (authMethod === 'mobile') {
      if (!mobileInput.trim() || mobileInput.replace(/[^0-9]/g, '').length !== 10) {
        setErrorMessage(language === 'hi' ? 'कृपया 10-अंकों का वैध मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
        return;
      }
      if (!otpInput.trim()) {
        setErrorMessage(language === 'hi' ? 'कृपया सत्यापन कोड दर्ज करें।' : 'Please enter the verification code.');
        return;
      }
    } else if (authMethod === 'walkin') {
      if (!walkinName.trim()) {
        setErrorMessage(language === 'hi' ? 'कृपया मरीज़ का पूरा नाम दर्ज करें।' : 'Please enter patient full name.');
        return;
      }
      const ageNum = parseInt(walkinAge, 10);
      if (isNaN(ageNum) || ageNum <= 0 || ageNum > 125) {
        setErrorMessage(language === 'hi' ? 'कृपया मान्य उम्र दर्ज करें।' : 'Please enter a valid age.');
        return;
      }
    }

    setIsVerifying(true);

    try {
      let verifiedPatient: any = null;
      let token: string | undefined;

      if (authMethod === 'abha') {
        const res = await api.verifyAbha(abhaInput.trim(), otpInput.trim());
        verifiedPatient = res.patient;
        token = res.token;
      } else if (authMethod === 'mobile') {
        const res = await api.verifyMobile(mobileInput.trim(), otpInput.trim());
        verifiedPatient = res.patient;
        token = res.token;
      } else {
        const res = await api.registerWalkin({
          name: walkinName.trim(),
          age: parseInt(walkinAge, 10),
          gender: walkinGender,
          mobile: walkinMobile.trim() ? `+91 ${walkinMobile.trim()}` : undefined
        });
        verifiedPatient = res.patient;
        token = res.token;
      }

      if (!verifiedPatient) {
        throw new Error('Could not verify or register patient record.');
      }

      // Populate Kiosk context with real patient record
      const realAuthData: PatientAuthData = {
        method: authMethod,
        abhaId: verifiedPatient.abhaId || (authMethod === 'abha' ? abhaInput : undefined),
        mobile: verifiedPatient.phone || mobileInput,
        name: verifiedPatient.name || walkinName,
        age: verifiedPatient.age || parseInt(walkinAge, 10) || 30,
        gender: (verifiedPatient.gender as any) || walkinGender || 'Male',
        abhaVerified: verifiedPatient.abhaVerified || (authMethod === 'abha'),
        patientId: verifiedPatient.id,
        token: token || verifiedPatient.token,
      };

      setAuthData(realAuthData);

      speakText(
        language === 'hi'
          ? `${realAuthData.name} का सत्यापन सफल हुआ।`
          : `Patient ${realAuthData.name} verified successfully.`,
        language
      );

      // Navigate ONLY after successful backend verification
      navigate('/patient/consent');
    } catch (err: any) {
      console.error('Patient check-in error:', err);
      const friendlyMsg = err?.message || 'Verification failed. Please check credentials or try again.';
      setErrorMessage(friendlyMsg);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-2xl mx-auto py-6 space-y-6 animate-in fade-in duration-300">
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
          Select check-in method to retrieve prior health records or create a new OPD token.
        </p>
      </div>

      {/* Tabs for Login Type */}
      <div className="grid grid-cols-3 gap-2 w-full p-1.5 bg-surface-elevated rounded-2xl border border-border">
        <button
          onClick={() => { setAuthMethod('abha'); setErrorMessage(null); }}
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
          onClick={() => { setAuthMethod('mobile'); setErrorMessage(null); }}
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
          onClick={() => { setAuthMethod('walkin'); setErrorMessage(null); }}
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
        {/* Inline Error Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tab 1: ABHA Verification */}
        {authMethod === 'abha' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-med-text-primary flex items-center gap-2">
                <span>14-Digit ABHA Number / आभा संख्या</span>
              </label>
              <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> ABDM Sandbox
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={abhaInput}
                onChange={e => {
                  setAbhaInput(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="e.g. 14-1234-5678-9012"
                className="w-full h-14 px-4 text-xl font-mono tracking-wider bg-surface rounded-xl border border-border focus:border-med-green focus:ring-1 focus:ring-med-green outline-none text-med-text-primary"
              />
            </div>

            {/* OTP Section */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-med-text-secondary">
                  Authentication OTP sent to Aadhaar-linked mobile:
                </label>
                {!isOtpSent && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-xs text-med-green hover:underline font-semibold"
                  >
                    Request OTP
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={otpInput}
                  onChange={e => {
                    setOtpInput(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Enter code"
                  className="w-36 h-12 text-center text-xl font-mono tracking-widest bg-surface rounded-xl border border-border text-med-text-primary focus:border-med-green outline-none"
                />
                <span className="text-[11px] text-amber-300/90 flex items-center gap-1 leading-snug">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  ABDM OTP gateway not yet connected — any code is accepted in sandbox mode.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Mobile OTP Verification */}
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
                onChange={e => {
                  setMobileInput(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Enter 10-digit mobile (e.g. 9811243210)"
                className="flex-1 h-14 px-4 text-xl font-mono bg-surface rounded-xl border border-border focus:border-med-green outline-none text-med-text-primary"
              />
            </div>

            {/* OTP Section */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-med-text-secondary">
                  Enter 4-Digit OTP:
                </label>
                {!isOtpSent && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-xs text-med-green hover:underline font-semibold"
                  >
                    Send OTP
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={otpInput}
                  onChange={e => {
                    setOtpInput(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Enter code"
                  className="w-36 h-12 text-center text-xl font-mono tracking-widest bg-surface rounded-xl border border-border text-med-text-primary focus:border-med-green outline-none"
                />
                <span className="text-[11px] text-amber-300/90 flex items-center gap-1 leading-snug">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  SMS gateway not yet connected — any code is accepted in sandbox mode.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Walk-in Registration */}
        {authMethod === 'walkin' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-med-text-secondary">Full Name / पूरा नाम *</label>
              <input
                type="text"
                value={walkinName}
                onChange={e => {
                  setWalkinName(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Enter full name as per ID"
                className="w-full h-12 px-4 mt-1 bg-surface rounded-xl border border-border text-med-text-primary outline-none focus:border-med-green"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-med-text-secondary">Age / उम्र *</label>
                <input
                  type="number"
                  value={walkinAge}
                  onChange={e => {
                    setWalkinAge(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="e.g. 58"
                  className="w-full h-12 px-4 mt-1 bg-surface rounded-xl border border-border text-med-text-primary outline-none focus:border-med-green"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-med-text-secondary">Gender / लिंग *</label>
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

            <div>
              <label className="text-xs font-bold text-med-text-secondary">Contact Mobile (Optional) / मोबाइल</label>
              <input
                type="text"
                value={walkinMobile}
                onChange={e => setWalkinMobile(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full h-12 px-4 mt-1 bg-surface rounded-xl border border-border text-med-text-primary outline-none focus:border-med-green"
              />
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
          {authMethod === 'walkin' ? 'Register & Check In / पंजीकरण करें' : 'Verify & Continue / सत्यापित कर आगे बढ़ें'}
        </Button>
      </Card>
    </div>
  );
};
