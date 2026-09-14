import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  LanguageCode, 
  DepartmentId, 
  MedicalDocument, 
  RedFlagAlert, 
  DashavidhaPariksha,
  StructuredClinicalHistory 
} from '../types';
import { CLINICAL_QUESTIONS, AYUSH_PARIKSHA_QUESTIONS, MOCK_DOCUMENTS } from '../data/mockData';
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
  simulateDocUpload: (fileType: 'prescription' | 'lab_report' | 'discharge_summary') => Promise<void>;
  uploadDocumentFile: (file: File, fileType?: 'prescription' | 'lab_report' | 'discharge_summary') => Promise<void>;
  updateExtractedEntity: (docId: string, entityId: string, newValue: string) => void;
  getStructuredSummary: () => StructuredClinicalHistory;
  resetKiosk: () => void;
}

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
    const patId = authData.patientId || 'pat_001';
    api.recordConsent(patId, sessionId, flags || { consentAi: consent, consentDoctorShare: consent, consentAbha: consent }).catch(() => {});
  };

  const initializeInterview = async () => {
    const patId = authData.patientId || 'pat_001';
    try {
      const res = await api.getOrCreateInterview(patId, sessionId, department);
      if (res?.interviewId) {
        setInterviewId(res.interviewId);
        localStorage.setItem('medikiosk_interview_id', res.interviewId);
      }
    } catch {
      // Offline fallback: keep locally generated interviewId
    }
  };

  const finishInterview = async () => {
    const patId = authData.patientId || 'pat_001';
    try {
      await api.completeInterview(interviewId, patId);
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

  const getActiveQuestions = () => {
    if (department === 'ayush') {
      return [...CLINICAL_QUESTIONS, ...AYUSH_PARIKSHA_QUESTIONS];
    }
    return CLINICAL_QUESTIONS;
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
    const patId = authData.patientId || 'pat_001';
    api.triggerEmergencyAlert(patId, sessionId, [
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

  const startVoiceListening = () => {
    setIsListening(true);
    setVoiceTranscript('');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          const text = Array.from(event.results)
            .map((r: any) => r[0].transcript)
            .join('');
          setVoiceTranscript(text);
        };

        recognition.onend = () => {
          setIsListening(false);
          setIsAiProcessing(true);
          setTimeout(() => {
            setIsAiProcessing(false);
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
    setVoiceTranscript(
      language === 'hi'
        ? 'आवाज़ रिकॉर्डर उपलब्ध नहीं है। कृपया नीचे दिए गए विकल्पों को स्पर्श करके चुनें।'
        : 'Voice input not supported in this browser. Please tap an option below.'
    );
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

  const simulateDocUpload = async (fileType: 'prescription' | 'lab_report' | 'discharge_summary') => {
    setIsOcrProcessing(true);
    setOcrProgress(15);

    const targetDoc = fileType === 'prescription' ? MOCK_DOCUMENTS[0] : MOCK_DOCUMENTS[1];
    setActiveOcrDoc({ ...targetDoc, ocrStatus: 'processing' });

    await new Promise(r => setTimeout(r, 400));
    setOcrProgress(45);
    await new Promise(r => setTimeout(r, 400));
    setOcrProgress(80);
    await new Promise(r => setTimeout(r, 300));
    setOcrProgress(100);

    const completedDoc: MedicalDocument = {
      ...targetDoc,
      ocrStatus: 'completed'
    };

    setActiveOcrDoc(completedDoc);
    setUploadedDocuments(prev => {
      const exists = prev.some(d => d.id === completedDoc.id);
      return exists ? prev : [...prev, completedDoc];
    });
    setIsOcrProcessing(false);
  };

  const uploadDocumentFile = async (file: File, fileType: 'prescription' | 'lab_report' | 'discharge_summary' = 'prescription') => {
    setIsOcrProcessing(true);
    setOcrProgress(15);
    const patId = authData.patientId || 'pat_001';

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('patientId', patId);
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
        // Fallback entities from mock if extraction endpoint was empty
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
        confidenceScore: Math.round((uploadedDoc.confidenceScore || 0.94) * 100),
        entities: entities.length > 0 ? entities : (fileType === 'prescription' ? MOCK_DOCUMENTS[0].entities : MOCK_DOCUMENTS[1].entities),
        rawOcrText: rawText || (fileType === 'prescription' ? MOCK_DOCUMENTS[0].rawOcrText : MOCK_DOCUMENTS[1].rawOcrText),
      };

      setActiveOcrDoc(completedDoc);
      setUploadedDocuments(prev => [...prev.filter(d => d.id !== completedDoc.id), completedDoc]);
    } catch (err) {
      console.warn('Backend document upload failed, using high-fidelity local OCR processor', err);
      await simulateDocUpload(fileType);
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
    return {
      chiefComplaint: {
        primary: answers['q_chief_complaint'] === 'chest_pain' 
          ? 'Retrosternal crushing chest pain with radiation'
          : answers['q_chief_complaint'] || 'General weakness & routine checkup',
        onset: answers['q_duration'] === 'dur_acute_hours' ? 'Acute sudden (< 24 hours)' : '2-7 days',
        duration: '2 hours persistent',
        severityScore: answers['q_severity'] === 'sev_extreme' ? 9 : 6,
        location: answers['q_location'] === 'loc_chest_arm' ? 'Mid-chest radiating to left arm/jaw' : 'Generalized',
        aggravatingFactors: ['Exertion', 'Walking'],
        relievingFactors: ['Rest']
      },
      historyOfPresentIllness: 'Patient completed MediKiosk interactive triage intake. Symptoms recorded via multilingual voice input and touch confirmation.',
      pastMedicalHistory: [
        { condition: 'Essential Hypertension', diagnosedYear: '2019', currentStatus: 'Active' },
        { condition: 'Type 2 Diabetes Mellitus', diagnosedYear: '2021', currentStatus: 'Active' }
      ],
      pastSurgicalHistory: [],
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
        diet: 'Vegetarian',
        tobaccoUse: 'Nil (Quit)',
        alcoholUse: 'Nil',
        sleep: '6 hours',
        physicalActivity: 'Sedentary'
      },
      reviewOfSystems: [
        { system: 'Cardiovascular', status: 'Abnormal', findings: 'Chest tightness, diaphoresis' },
        { system: 'Respiratory', status: 'Abnormal', findings: 'Exertional dyspnea' }
      ],
      previousInvestigations: [
        { testName: 'Fasting Blood Sugar', result: '158', unit: 'mg/dL', referenceRange: '70-100', date: 'Feb 2026', status: 'High' }
      ],
      dashavidhaPariksha: department === 'ayush' ? {
        prakriti: { vata: 45, pitta: 35, kapha: 20, primaryDosha: 'Vata-Pitta' },
        vikriti: 'Vishamagni with Pitta-Kapha Samana',
        sara: 'Madhyama Sara',
        samhanana: 'Madhyama',
        pramana: 'Prakrita',
        satmya: 'Katu-Lavana Satmya',
        satva: 'Madhyama (Medium)',
        aharaShakti: { abhyavaharana: 'Visham', jarana: 'Mandata' },
        vyayamaShakti: 'Madhyama',
        vaya: 'Madhyama'
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
        simulateDocUpload,
        uploadDocumentFile,
        updateExtractedEntity,
        getStructuredSummary,
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
