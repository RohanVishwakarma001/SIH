import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  LanguageCode, 
  DepartmentId, 
  MedicalDocument, 
  RedFlagAlert, 
  DashavidhaPariksha,
  StructuredClinicalHistory,
  ClinicalQuestion
} from '../types';
import { CLINICAL_QUESTIONS, SOCRATES_QUESTIONS, AYUSH_PARIKSHA_QUESTIONS } from '../data/mockData';
import { api } from '../services/api';

export interface PatientAuthData {
  method: 'abha' | 'mobile' | 'walkin';
  abhaId?: string;
  mobile?: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  abhaVerified?: boolean;
  patientId?: string;
  token?: string;
}

interface KioskContextType {
  language: LanguageCode;
  department: DepartmentId;
  authData: PatientAuthData;
  hasConsented: boolean;
  sessionId: string;
  interviewId: string;
  activeQuestionIndex: number;
  answers: Record<string, any>;
  voiceTranscript: string;
  isListening: boolean;
  isAiProcessing: boolean;
  isRedFlagTriggered: boolean;
  redFlagAlert: RedFlagAlert | null;
  uploadedDocuments: MedicalDocument[];
  activeOcrDoc: MedicalDocument | null;
  ocrProgress: number;
  isOcrProcessing: boolean;
  ocrError: string | null;
  generatedToken: string;
  estimatedWaitMins: number;
  assignedDoctorName: string;
  consultationRoom: string;
  ayushParikshaData: Partial<DashavidhaPariksha>;
  
  // Actions
  setLanguage: (lang: LanguageCode) => void;
  setDepartment: (dept: DepartmentId) => void;
  setAuthData: (data: PatientAuthData) => void;
  setHasConsented: (consent: boolean, flags?: { consentAi: boolean; consentDoctorShare: boolean; consentAbha: boolean }) => void;
  initializeInterview: () => Promise<void>;
  finishInterview: () => Promise<void>;
  finalizeVisit: () => Promise<void>;
  selectOption: (questionId: string, optionId: string, isRedFlag?: boolean) => void;
  toggleMultiOption: (questionId: string, optionId: string, isRedFlag?: boolean) => void;
  setCustomAnswer: (questionId: string, value: any) => void;
  startVoiceListening: () => void;
  stopVoiceListening: () => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  triggerEmergencyAlert: (reason?: string) => void;
  dismissEmergencyAlert: () => void;
  uploadDocumentFile: (file: File, fileType?: 'prescription' | 'lab_report' | 'discharge_summary') => Promise<void>;
  updateExtractedEntity: (docId: string, entityId: string, newValue: string) => void;
  getStructuredSummary: () => StructuredClinicalHistory;
  getActiveQuestions: () => ClinicalQuestion[];
  resetKiosk: () => void;
}

const BCP47_LANG_MAP: Record<LanguageCode, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  bn: 'bn-IN'
};

const KioskContext = createContext<KioskContextType | undefined>(undefined);

export const KioskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('hi');
  const [department, setDepartmentState] = useState<DepartmentId>('general');
  const [authData, setAuthDataState] = useState<PatientAuthData>({
    method: 'abha',
    name: '',
    age: 0,
    gender: 'Male',
    abhaVerified: false
  });
  const [hasConsented, setHasConsentedState] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [interviewId, setInterviewId] = useState<string>('');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
  const [isRedFlagTriggered, setIsRedFlagTriggered] = useState<boolean>(false);
  const [redFlagAlert, setRedFlagAlert] = useState<RedFlagAlert | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<MedicalDocument[]>([]);
  const [activeOcrDoc, setActiveOcrDoc] = useState<MedicalDocument | null>(null);
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const [isOcrProcessing, setIsOcrProcessing] = useState<boolean>(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [generatedToken, setGeneratedToken] = useState<string>('');
  const [estimatedWaitMins, setEstimatedWaitMins] = useState<number>(8);
  const [assignedDoctorName, setAssignedDoctorName] = useState<string>('');
  const [consultationRoom, setConsultationRoom] = useState<string>('');
  const [ayushParikshaData, setAyushParikshaData] = useState<Partial<DashavidhaPariksha>>({
    prakriti: { vata: 45, pitta: 35, kapha: 20, primaryDosha: 'Vata-Pitta' },
    satva: 'Madhyama (Medium)',
    vyayamaShakti: 'Madhyama',
    vaya: 'Madhyama'
  });

  // Hydrate persisted kiosk state from localStorage on page refresh
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('medikiosk_lang') as LanguageCode;
      if (savedLang) setLanguageState(savedLang);

      const savedDept = localStorage.getItem('medikiosk_dept') as DepartmentId;
      if (savedDept) setDepartmentState(savedDept);

      const savedAuth = localStorage.getItem('medikiosk_auth');
      if (savedAuth) setAuthDataState(JSON.parse(savedAuth));

      const savedConsent = localStorage.getItem('medikiosk_consent');
      if (savedConsent) setHasConsentedState(savedConsent === 'true');

      const savedAnswers = localStorage.getItem('medikiosk_answers');
      if (savedAnswers) setAnswers(JSON.parse(savedAnswers));

      const savedSess = localStorage.getItem('medikiosk_session_id');
      if (savedSess) setSessionId(savedSess);

      const savedInt = localStorage.getItem('medikiosk_interview_id');
      if (savedInt) setInterviewId(savedInt);

      const savedToken = localStorage.getItem('medikiosk_patient_token');
      if (savedToken) setGeneratedToken(savedToken);
    } catch {
      // Safe fallback
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('medikiosk_lang', lang);
    if (sessionId) {
      api.updateSessionLanguage(sessionId, lang).catch(() => {});
    }
  };

  const setDepartment = (dept: DepartmentId) => {
    setDepartmentState(dept);
    localStorage.setItem('medikiosk_dept', dept);
  };

  const setAuthData = (data: PatientAuthData) => {
    setAuthDataState(data);
    localStorage.setItem('medikiosk_auth', JSON.stringify(data));
    if (data.patientId) {
      localStorage.setItem('medikiosk_patient_id', data.patientId);
    }
    if (data.token) {
      setGeneratedToken(data.token);
      localStorage.setItem('medikiosk_patient_token', data.token);
    }
    // Initiate or link session with backend using the real verified patient id
    api.createSession(department, 'K01', language, data.patientId)
      .then(res => {
        if (res?.sessionId) {
          setSessionId(res.sessionId);
          localStorage.setItem('medikiosk_session_id', res.sessionId);
        }
      })
      .catch(() => {});
  };

  const setHasConsented = (consent: boolean, flags?: { consentAi: boolean; consentDoctorShare: boolean; consentAbha: boolean }) => {
    setHasConsentedState(consent);
    localStorage.setItem('medikiosk_consent', String(consent));
    if (!authData.patientId) return;
    api.recordConsent(authData.patientId, sessionId, flags || { consentAi: consent, consentDoctorShare: consent, consentAbha: consent }).catch(() => {});
  };

  const initializeInterview = async () => {
    if (!authData.patientId) return;
    try {
      const res = await api.getOrCreateInterview(authData.patientId, sessionId, department);
      if (res?.interviewId) {
        setInterviewId(res.interviewId);
        localStorage.setItem('medikiosk_interview_id', res.interviewId);
      }
    } catch {
      // Offline fallback: keep locally generated interviewId
    }
  };

  const finishInterview = async () => {
    if (!authData.patientId) return;
    try {
      await api.completeInterview(interviewId, authData.patientId);
    } catch {
      // Offline fallback: no-op, local flow continues
    }
  };

  const finalizeVisit = async () => {
    try {
      const res: any = await api.completeSession(sessionId);
      if (res?.token) {
        setGeneratedToken(res.token);
        localStorage.setItem('medikiosk_patient_token', res.token);
      }
      if (res?.assignedDoctor) setAssignedDoctorName(res.assignedDoctor);
      if (res?.roomNo) setConsultationRoom(res.roomNo);
      if (typeof res?.waitTimeMins === 'number') setEstimatedWaitMins(res.waitTimeMins);
    } catch {
      // Offline fallback: keep locally generated token
    }
  };

  const getActiveQuestions = (): ClinicalQuestion[] => {
    let base = [...CLINICAL_QUESTIONS];
    // Dynamic branching for chest pain / acute symptoms -> inject SOCRATES probing
    if (answers['q_chief_complaint'] === 'chest_pain' || answers['q_location'] === 'loc_chest_arm') {
      const locIdx = base.findIndex(q => q.id === 'q_location');
      if (locIdx !== -1) {
        base.splice(locIdx + 1, 0, ...SOCRATES_QUESTIONS);
      } else {
        base.push(...SOCRATES_QUESTIONS);
      }
    }
    if (department === 'ayush') {
      base = [...base, ...AYUSH_PARIKSHA_QUESTIONS];
    }
    return base;
  };

  const triggerEmergencyAlert = (reason: string = 'Critical symptoms detected during AI interview') => {
    setIsRedFlagTriggered(true);
    setRedFlagAlert({
      isTriggered: true,
      title: 'URGENT MEDICAL ATTENTION REQUIRED',
      description: 'Your clinical responses indicate potentially critical symptoms requiring immediate priority review by nursing staff and the emergency doctor.',
      symptoms: [
        'Acute substernal discomfort or crushing chest pressure',
        'Severe shortness of breath or cold diaphoresis',
        'Vital sign vulnerability'
      ],
      severity: 'critical',
      timestamp: new Date().toLocaleTimeString(),
      staffAlertSent: true
    });

    // Notify backend triage desk
    if (!authData.patientId) return;
    api.triggerEmergencyAlert(authData.patientId, sessionId, [
      'Acute substernal discomfort or crushing chest pressure',
      'Severe shortness of breath or cold diaphoresis',
      'Vital sign vulnerability'
    ], reason).catch(() => {});
  };

  const dismissEmergencyAlert = () => {
    setIsRedFlagTriggered(false);
  };

  const selectOption = (questionId: string, optionId: string, isRedFlag?: boolean) => {
    const updatedAnswers = { ...answers, [questionId]: optionId };
    setAnswers(updatedAnswers);
    localStorage.setItem('medikiosk_answers', JSON.stringify(updatedAnswers));

    // Submit answer to Fastify backend deterministic red flag rule engine
    api.submitAnswer(interviewId, {
      questionId,
      answerType: 'single_choice',
      value: optionId,
      stepNumber: activeQuestionIndex + 1,
      department,
    }).then(res => {
      if (res?.redFlagAlert?.isTriggered) {
        setIsRedFlagTriggered(true);
        setRedFlagAlert({
          isTriggered: true,
          title: res.redFlagAlert.title || 'CRITICAL CLINICAL RED FLAG',
          description: res.redFlagAlert.reason || 'Symptom pattern requires immediate doctor evaluation.',
          symptoms: res.redFlagAlert.triggeringFindings || ['Severe chest pain with radiation'],
          severity: 'critical',
          timestamp: new Date().toLocaleTimeString(),
          staffAlertSent: true,
        });
      }
    }).catch(() => {
      // Offline fallback only if backend unreachable
      if (isRedFlag && (optionId === 'chest_pain' || optionId === 'loc_chest_arm' || optionId === 'sev_extreme')) {
        triggerEmergencyAlert();
      }
    });
  };

  const toggleMultiOption = (questionId: string, optionId: string, isRedFlag?: boolean) => {
    setAnswers(prev => {
      const currentList: string[] = prev[questionId] || [];
      const updated = currentList.includes(optionId)
        ? currentList.filter(id => id !== optionId)
        : [...currentList, optionId];
      const nextAnswers = { ...prev, [questionId]: updated };
      localStorage.setItem('medikiosk_answers', JSON.stringify(nextAnswers));

      api.submitAnswer(interviewId, {
        questionId,
        answerType: 'multi_choice',
        value: updated,
        stepNumber: activeQuestionIndex + 1,
        department,
      }).then(res => {
        if (res?.redFlagAlert?.isTriggered) {
          triggerEmergencyAlert(res.redFlagAlert.reason);
        }
      }).catch(() => {});

      return nextAnswers;
    });

    if (isRedFlag) {
      triggerEmergencyAlert();
    }
  };

  const setCustomAnswer = (questionId: string, value: any) => {
    setAnswers(prev => {
      const nextAnswers = { ...prev, [questionId]: value };
      localStorage.setItem('medikiosk_answers', JSON.stringify(nextAnswers));
      return nextAnswers;
    });
  };

  // Matches a raw speech transcript against the current question's options (label,
  // sublabel, and every language's nativeLabel) using substring/word-overlap scoring,
  // and applies the best match the same way a tap would. Runs entirely offline against
  // data already in mockData.ts — no AI call needed for this simple keyword match.
  const matchVoiceAnswerToOption = (transcript: string) => {
    const currentQ = getActiveQuestions()[activeQuestionIndex];
    if (!currentQ?.options?.length) return;

    const normalize = (s: string) => s.toLowerCase().trim();
    const spoken = normalize(transcript);
    if (!spoken) return;

    let bestMatch: { id: string; score: number; isRedFlag?: boolean } | null = null;

    currentQ.options.forEach(option => {
      const candidates = [option.label, option.sublabel, ...Object.values(option.nativeLabel || {})]
        .filter((s): s is string => !!s)
        .map(normalize);

      candidates.forEach(candidate => {
        let score = 0;
        if (spoken.includes(candidate) || candidate.includes(spoken)) {
          score = candidate.length;
        } else {
          const words = candidate.split(/\s+/).filter(w => w.length > 2);
          const matchedWords = words.filter(w => spoken.includes(w));
          if (matchedWords.length > 0) {
            score = matchedWords.join('').length;
          }
        }
        if (score > 0 && (!bestMatch || score > bestMatch.score)) {
          bestMatch = { id: option.id, score, isRedFlag: option.isRedFlag };
        }
      });
    });

    if (bestMatch) {
      const match = bestMatch as { id: string; score: number; isRedFlag?: boolean };
      if (currentQ.inputType === 'multi_choice') {
        toggleMultiOption(currentQ.id, match.id, match.isRedFlag);
      } else {
        selectOption(currentQ.id, match.id, match.isRedFlag);
      }
    }
  };

  const startVoiceListening = () => {
    setIsListening(true);
    setVoiceTranscript('');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = BCP47_LANG_MAP[language] || 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = true;

        let finalTranscript = '';

        recognition.onresult = (event: any) => {
          const text = Array.from(event.results)
            .map((r: any) => r[0].transcript)
            .join('');
          finalTranscript = text;
          setVoiceTranscript(text);
        };

        recognition.onend = () => {
          setIsListening(false);
          setIsAiProcessing(true);
          setTimeout(() => {
            setIsAiProcessing(false);
            if (finalTranscript.trim()) {
              matchVoiceAnswerToOption(finalTranscript);
            }
          }, 800);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.start();
        return;
      } catch (e) {
        console.warn('SpeechRecognition failed', e);
      }
    }

    // Safe non-intrusive fallback if browser speech recognition is not supported
    setIsListening(false);
    const unsupportedMessages: Record<LanguageCode, string> = {
      en: 'Voice input not supported in this browser. Please tap an option below.',
      hi: 'आवाज़ रिकॉर्डर उपलब्ध नहीं है। कृपया नीचे दिए गए विकल्पों को स्पर्श करके चुनें।',
      mr: 'आवाज रेकॉर्डर उपलब्ध नाही. कृपया खालील पर्यायाला स्पर्श करा.',
      ta: 'குரல் உள்ளீடு இந்த உலாவியில் கிடைக்கவில்லை. கீழே உள்ள விருப்பத்தைத் தட்டவும்.',
      te: 'వాయిస్ ఇన్‌పుట్ ఈ బ్రౌజర్‌లో అందుబాటులో లేదు. దయచేసి కింద ఉన్న ఎంపికను నొక్కండి.',
      bn: 'এই ব্রাউজারে ভয়েস ইনপুট সমর্থিত নয়। অনুগ্রহ করে নিচের একটি বিকল্প স্পর্শ করুন।'
    };
    setVoiceTranscript(unsupportedMessages[language] || unsupportedMessages.en);
  };

  const stopVoiceListening = () => {
    setIsListening(false);
  };

  const nextQuestion = () => {
    const questions = getActiveQuestions();
    if (activeQuestionIndex < questions.length - 1) {
      setIsAiProcessing(true);
      setTimeout(() => {
        setIsAiProcessing(false);
        setActiveQuestionIndex(prev => prev + 1);
      }, 500);
    }
  };

  const prevQuestion = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(prev => prev - 1);
    }
  };

  const uploadDocumentFile = async (file: File, fileType: 'prescription' | 'lab_report' | 'discharge_summary' = 'prescription') => {
    if (!authData.patientId) {
      setOcrError('You must be checked in before uploading a document.');
      return;
    }

    setIsOcrProcessing(true);
    setOcrError(null);
    setOcrProgress(15);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('patientId', authData.patientId);
      formData.append('documentType', fileType.toUpperCase());

      setOcrProgress(40);
      const uploadedDoc = await api.uploadDocument(formData);
      setOcrProgress(75);

      // Fetch the extracted entities
      let entities: any[] = [];
      let rawText = '';
      try {
        const extraction: any = await api.getOcrExtraction(uploadedDoc.id);
        if (extraction?.entities && Array.isArray(extraction.entities)) {
          entities = extraction.entities.map((e: any) => ({
            id: e.id,
            category: (e.category || 'medication').toLowerCase(),
            value: e.value,
            dosage: e.dosage,
            frequency: e.frequency,
            confidence: Math.round(e.confidence || 95),
            isVerified: e.isVerified || false,
          }));
        }
        if (extraction?.rawText) {
          rawText = extraction.rawText;
        }
      } catch {
        // Extraction not ready yet; the document review screen will poll/refresh for it.
      }

      setOcrProgress(100);

      const completedDoc: MedicalDocument = {
        id: uploadedDoc.id,
        title: file.name || uploadedDoc.title || 'Scanned Clinical Document',
        type: fileType,
        fileUrl: uploadedDoc.fileUrl || '',
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        facility: 'MediKiosk OPD Terminal',
        ocrStatus: 'completed',
        confidenceScore: Math.round((uploadedDoc.confidenceScore || 0) * 100),
        entities,
        rawOcrText: rawText,
      };

      setActiveOcrDoc(completedDoc);
      setUploadedDocuments(prev => [...prev.filter(d => d.id !== completedDoc.id), completedDoc]);
    } catch (err: any) {
      setOcrError(err?.message || 'Document upload failed. Please try again.');
    } finally {
      setIsOcrProcessing(false);
    }
  };

  const updateExtractedEntity = (docId: string, entityId: string, newValue: string) => {
    setUploadedDocuments(prev => prev.map(doc => {
      if (doc.id !== docId) return doc;
      return {
        ...doc,
        entities: doc.entities.map(ent => {
          if (ent.id !== entityId) return ent;
          return { ...ent, value: newValue, isVerified: true };
        })
      };
    }));

    if (activeOcrDoc && activeOcrDoc.id === docId) {
      setActiveOcrDoc(prev => {
        if (!prev) return null;
        return {
          ...prev,
          entities: prev.entities.map(ent => ent.id === entityId ? { ...ent, value: newValue, isVerified: true } : ent)
        };
      });
    }

    // Persist correction audit record to backend
    api.correctEntity(docId, entityId, newValue).catch(() => {});
  };

  const getStructuredSummary = (): StructuredClinicalHistory => {
    const isChestPain = answers['q_chief_complaint'] === 'chest_pain' || answers['q_location'] === 'loc_chest_arm';
    
    // SOCRATES details
    const charMap: Record<string, string> = {
      'char_crushing': 'Crushing Heavy Pressure (retrosternal compression)',
      'char_burning': 'Burning / Hot Acidity sensation',
      'char_sharp': 'Sharp Stabbing / Needle-like pain',
      'char_dull': 'Dull continuous ache'
    };
    const radMap: Record<string, string> = {
      'rad_arm_jaw': 'Radiating to left arm, neck, and lower jaw',
      'rad_back': 'Radiating to upper back / interscapular region',
      'rad_epigastric': 'Spreading downwards to epigastrium',
      'rad_localized': 'Non-radiating, localized to chest'
    };
    const relMap: Record<string, string[]> = {
      'rel_worse_exertion': ['Worse with physical exertion / walking', 'Relieved with resting'],
      'rel_worse_meals': ['Aggravated post-meals / recumbency', 'Relieved with antacids'],
      'rel_worse_breathing': ['Exacerbated by deep inspiration or coughing'],
      'rel_no_factor': ['Spontaneous onset without clear triggers']
    };

    const character = answers['socrates_character'] ? charMap[answers['socrates_character']] || answers['socrates_character'] : undefined;
    const radiation = answers['socrates_radiation'] ? radMap[answers['socrates_radiation']] || answers['socrates_radiation'] : undefined;
    const aggravating = answers['socrates_exacerbating_relieving'] ? relMap[answers['socrates_exacerbating_relieving']] || ['Exertion'] : ['Exertion', 'Walking'];

    return {
      chiefComplaint: {
        primary: isChestPain 
          ? (character ? `Severe chest pain (${character})` : 'Retrosternal crushing chest pain with radiation')
          : answers['q_chief_complaint'] || 'General weakness & routine checkup',
        onset: answers['q_duration'] === 'dur_acute_hours' ? 'Acute sudden (< 24 hours)' : '2-7 days',
        duration: answers['q_duration'] || '2 hours persistent',
        severityScore: answers['q_severity'] === 'sev_extreme' ? 9 : (answers['q_severity'] === 'sev_severe' ? 7 : 5),
        location: answers['q_location'] === 'loc_chest_arm' 
          ? (radiation || 'Mid-chest radiating to left arm/jaw') 
          : (answers['q_location'] || 'Generalized'),
        aggravatingFactors: aggravating,
        relievingFactors: ['Rest', 'Sublingual nitrate if indicated']
      },
      historyOfPresentIllness: isChestPain
        ? `Patient presented via MediKiosk with acute substernal chest discomfort. SOCRATES clinical probing elicited: Character: ${character || 'Crushing'}; Radiation: ${radiation || 'Left arm/neck'}; Exacerbating: Exertion. Immediate triage alert triggered.`
        : 'Patient completed MediKiosk interactive triage intake. Symptoms recorded via multilingual voice input and touch confirmation.',
      pastMedicalHistory: [
        { condition: 'Essential Hypertension', diagnosedYear: '2019', currentStatus: 'Active' },
        { condition: 'Type 2 Diabetes Mellitus', diagnosedYear: '2021', currentStatus: 'Active' }
      ],
      pastSurgicalHistory: [
        { procedure: 'Appendectomy (Laparoscopic)', year: '2018', hospital: 'District Civil Hospital' }
      ],
      drugHistory: [
        { drugName: 'Telmisartan', dosage: '40mg', frequency: 'OD', adherence: 'Regular', duration: '3 years', isVerifiedByOcr: true },
        { drugName: 'Atorvastatin', dosage: '20mg', frequency: 'HS', adherence: 'Regular', duration: '2 years', isVerifiedByOcr: true }
      ],
      allergyHistory: [
        { allergen: 'Penicillin', reaction: 'Skin rash, facial edema', severity: 'Severe (Anaphylaxis Risk)' }
      ],
      familyHistory: [
        { relation: 'Father', condition: 'Premature Coronary Artery Disease' }
      ],
      personalHistory: {
        diet: answers['ayush_ahara_vihara'] || 'Vegetarian',
        tobaccoUse: 'Nil (Quit)',
        alcoholUse: 'Nil',
        sleep: '6 hours',
        physicalActivity: 'Sedentary'
      },
      reviewOfSystems: [
        { system: 'Cardiovascular', status: isChestPain ? 'Abnormal' : 'Normal', findings: isChestPain ? 'Chest tightness, diaphoresis' : 'Nil' },
        { system: 'Respiratory', status: 'Abnormal', findings: 'Exertional dyspnea' }
      ],
      previousInvestigations: [
        { testName: 'Fasting Blood Sugar', result: '158', unit: 'mg/dL', referenceRange: '70-100', date: 'Feb 2026', status: 'High' },
        { testName: 'Serum Potassium (K+)', result: '5.6', unit: 'mEq/L', referenceRange: '3.5 - 5.0', date: 'Feb 2026', status: 'High' }
      ],
      dashavidhaPariksha: department === 'ayush' ? {
        prakriti: answers['ayush_prakriti'] ? {
          vata: answers['ayush_prakriti'] === 'prakriti_vata' ? 60 : 30,
          pitta: answers['ayush_prakriti'] === 'prakriti_pitta' ? 60 : 30,
          kapha: answers['ayush_prakriti'] === 'prakriti_kapha' ? 60 : 20,
          primaryDosha: answers['ayush_prakriti'] === 'prakriti_vata' ? 'Vata' : (answers['ayush_prakriti'] === 'prakriti_pitta' ? 'Pitta' : 'Kapha')
        } : { vata: 45, pitta: 35, kapha: 20, primaryDosha: 'Vata-Pitta' },
        vikriti: answers['ayush_vikriti'] || 'Vishamagni with Pitta-Kapha Samana',
        sara: answers['ayush_sara'] || 'Madhyama Sara (Medium tissue essence)',
        samhanana: answers['ayush_samhanana'] || 'Madhyama Samhanana (Moderate compact body)',
        pramana: answers['ayush_pramana'] || 'Prakrita (Proportionate body measurements)',
        satmya: answers['ayush_satmya'] || 'Katu-Lavana Satmya (Habituated to mixed diet)',
        satva: answers['ayush_satva'] || 'Madhyama Satva (Medium mental endurance)',
        aharaShakti: {
          abhyavaharana: answers['ayush_ahara_shakti'] || 'Visham (Irregular food intake capacity)',
          jarana: 'Mandata (Slow digestion)'
        },
        vyayamaShakti: answers['ayush_vyayama_shakti'] || 'Madhyama (Moderate physical capacity)',
        vaya: answers['ayush_vaya'] || 'Madhyama (Middle age 16-60)',
        agni: answers['ayush_ahara_agni'] 
          ? (answers['ayush_ahara_agni'] === 'agni_mandagni' ? 'Mandagni (मंदाग्नि / Sluggish)' : answers['ayush_ahara_agni'] === 'agni_tikshnagni' ? 'Tikshnagni (तीक्ष्णाग्नि / Hyperactive)' : answers['ayush_ahara_agni'] === 'agni_vishamagni' ? 'Vishamagni (विषमाग्नि / Irregular)' : 'Samagni (समाग्नि / Balanced)')
          : 'Vishamagni (विषमाग्नि / Irregular)',
        koshtha: answers['ayush_koshtha']
          ? (answers['ayush_koshtha'] === 'koshtha_krura' ? 'Krura Koshtha (क्रूर कोष्ठ - Constipation tendency)' : answers['ayush_koshtha'] === 'koshtha_mridu' ? 'Mridu Koshtha (मृदु कोष्ठ - Loose tendency)' : 'Madhyama Koshtha (मध्यम कोष्ठ - Normal)')
          : 'Krura Koshtha (क्रूर कोष्ठ - Hard stool / Constipation tendency)',
        ashtavidhaPariksha: {
          nadi: 'Vata-Pitta Nadi (Manduka-Sarpa Gati)',
          mutra: 'Prakrita (Normal pale yellow)',
          mala: answers['ayush_koshtha'] === 'koshtha_krura' ? 'Vibandha / Saama (Constipated, dry)' : 'Prakrita',
          jihwa: answers['ayush_ashtavidha_jihwa_mala'] === 'jihwa_saama_heavy' ? 'Saama Jihwa (White thick coating over base indicating Ama)' : 'Niraama Jihwa (Clean pink)',
          shabda: 'Prakrita (Clear voice)',
          sparsha: 'Anushnasheeta (Normal tactile feel)',
          druk: 'Prakrita (Clear vision)',
          akruti: 'Madhyama (Proportionate built)'
        },
        trividhaPariksha: {
          darshana: 'Twak Rukshata (Dryness of skin), coated tongue base',
          sparshana: 'Mild tenderness in epigastric region on palpation',
          prashna: 'Complaints of sour belching and sluggish digestion after meals'
        },
        aharaVihara: {
          dietRegimen: Array.isArray(answers['ayush_ahara_vihara_diet']) ? answers['ayush_ahara_vihara_diet'].join(', ') : 'Irregular meal timings, spicy fast food',
          lifestyleHabits: Array.isArray(answers['ayush_vihara_lifestyle']) ? answers['ayush_vihara_lifestyle'].join(', ') : 'Ratrijagarana (midnight screen work), sedentary',
          viruddhaAhara: 'Incompatible foods consumed occasionally'
        },
        nidanaSamprapti: {
          causativeFactors: 'Vishamashana, Ratrijagarana, Vega Vidharana',
          pathogenesisChain: 'Agni Mandya -> Ama formation -> Pitta-Vata Sammurchana -> Annavaha Srotodushti'
        }
      } : undefined
    };
  };

  const resetKiosk = () => {
    setActiveQuestionIndex(0);
    setAnswers({});
    setVoiceTranscript('');
    setIsListening(false);
    setIsAiProcessing(false);
    setIsRedFlagTriggered(false);
    setRedFlagAlert(null);
    setUploadedDocuments([]);
    setActiveOcrDoc(null);
    setOcrProgress(0);
    setIsOcrProcessing(false);
    setHasConsentedState(false);
    setGeneratedToken('');
    setAssignedDoctorName('');
    setConsultationRoom('');
    setSessionId('');
    setInterviewId('');
    setAuthDataState({
      method: 'abha',
      name: '',
      age: 0,
      gender: 'Male',
      abhaVerified: false
    });
    localStorage.removeItem('medikiosk_answers');
    localStorage.removeItem('medikiosk_consent');
    localStorage.removeItem('medikiosk_auth');
    localStorage.removeItem('medikiosk_session_id');
    localStorage.removeItem('medikiosk_interview_id');
    localStorage.removeItem('medikiosk_patient_id');
    localStorage.removeItem('medikiosk_patient_token');
  };

  return (
    <KioskContext.Provider
      value={{
        language,
        department,
        authData,
        hasConsented,
        sessionId,
        interviewId,
        activeQuestionIndex,
        answers,
        voiceTranscript,
        isListening,
        isAiProcessing,
        isRedFlagTriggered,
        redFlagAlert,
        uploadedDocuments,
        activeOcrDoc,
        ocrProgress,
        isOcrProcessing,
        ocrError,
        generatedToken,
        estimatedWaitMins,
        assignedDoctorName,
        consultationRoom,
        ayushParikshaData,
        setLanguage,
        setDepartment,
        setAuthData,
        setHasConsented,
        initializeInterview,
        finishInterview,
        finalizeVisit,
        selectOption,
        toggleMultiOption,
        setCustomAnswer,
        startVoiceListening,
        stopVoiceListening,
        nextQuestion,
        prevQuestion,
        triggerEmergencyAlert,
        dismissEmergencyAlert,
        uploadDocumentFile,
        updateExtractedEntity,
        getStructuredSummary,
        getActiveQuestions,
        resetKiosk
      }}
    >
      {children}
    </KioskContext.Provider>
  );
};

export const useKiosk = (): KioskContextType => {
  const context = useContext(KioskContext);
  if (!context) {
    throw new Error('useKiosk must be used within a KioskProvider');
  }
  return context;
};
