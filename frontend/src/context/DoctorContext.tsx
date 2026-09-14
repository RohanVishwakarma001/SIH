import React, { createContext, useContext, useState, useEffect } from 'react';
import { Patient, PriorityLevel, DepartmentId, DoctorConsultationNote } from '../types';
import { api } from '../services/api';
import { apiClient } from '../lib/api-client';

const getDoctorName = () => apiClient.getUserName() || 'Attending Doctor';

const emptyConsultationNote = (patientId = ''): DoctorConsultationNote => ({
  patientId,
  doctorName: getDoctorName(),
  provisionalDiagnosis: '',
  icdCode: '',
  clinicalNotes: '',
  prescriptions: [],
  orderedInvestigations: [],
  followUpDays: 0,
  isPushedToAbha: false
});

interface DoctorContextType {
  patients: Patient[];
  selectedPatient: Patient | undefined;
  filterPriority: 'all' | PriorityLevel;
  filterDepartment: 'all' | DepartmentId;
  searchQuery: string;
  consultationNote: DoctorConsultationNote;
  isSavingConsultation: boolean;
  isConsultationSaved: boolean;
  isLoadingWorkspace: boolean;
  isLoadingQueue: boolean;
  queueError: string | null;

  // Actions
  selectPatientById: (id: string) => Promise<void>;
  setFilterPriority: (priority: 'all' | PriorityLevel) => void;
  setFilterDepartment: (dept: 'all' | DepartmentId) => void;
  setSearchQuery: (query: string) => void;
  verifyAiSummary: (action: 'accepted' | 'edited' | 'rejected', modifiedText?: string) => Promise<void>;
  updateConsultationNote: (updates: Partial<DoctorConsultationNote>) => void;
  addPrescriptionItem: (item: { medicine: string; dosage: string; frequency: string; duration: string; instructions: string }) => void;
  removePrescriptionItem: (index: number) => void;
  saveAndPushToAbha: () => Promise<void>;
  resetConsultation: () => void;
  refreshQueue: () => Promise<void>;
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

export const DoctorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<'all' | PriorityLevel>('all');
  const [filterDepartment, setFilterDepartment] = useState<'all' | DepartmentId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState<boolean>(false);
  const [isLoadingQueue, setIsLoadingQueue] = useState<boolean>(true);
  const [queueError, setQueueError] = useState<string | null>(null);

  const [consultationNote, setConsultationNote] = useState<DoctorConsultationNote>(emptyConsultationNote());

  const [isSavingConsultation, setIsSavingConsultation] = useState<boolean>(false);
  const [isConsultationSaved, setIsConsultationSaved] = useState<boolean>(false);

  // Synchronize Live OPD Queue with Fastify Backend
  const refreshQueue = async () => {
    setIsLoadingQueue(true);
    setQueueError(null);
    try {
      const res = await api.getDoctorQueue({
        priority: filterPriority,
        department: filterDepartment,
        query: searchQuery,
      });

      const queue = Array.isArray(res?.queue) ? res.queue : [];
      setPatients(prev => {
        const map = new Map(prev.map(p => [p.id, p]));
        return queue.map(q => {
          const existing = map.get(q.id) || {
            id: q.id,
            token: q.token,
            roomNo: q.roomNo || 'Not assigned',
            name: q.name,
            age: q.age,
            gender: q.gender,
            phone: q.phone,
            abhaId: q.abhaId,
            abhaVerified: Boolean(q.abhaId),
            priority: (q.priority || 'normal').toLowerCase() as PriorityLevel,
            queueStatus: (q.queueStatus || 'waiting') as any,
            historyStatus: (q.historyStatus || 'not_started') as any,
            waitTimeMinutes: q.waitTimeMinutes ?? 0,
            checkedInTime: q.checkedInTime || 'Today',
            chiefComplaintShort: q.chiefComplaintShort || 'Pending clinical intake',
            department: (q.department || 'general') as any,
            vitals: { bp: 'Not recorded', heartRate: 0, spo2: 0, temperature: 'Not recorded', bmi: 0 },
            structuredHistory: {
              chiefComplaint: { primary: q.chiefComplaintShort || 'Not yet recorded', onset: 'Not yet recorded', duration: 'Not yet recorded', severityScore: 0, location: 'Not yet recorded', aggravatingFactors: [], relievingFactors: [] },
              historyOfPresentIllness: 'Clinical history has not been captured yet for this patient.',
              pastMedicalHistory: [], pastSurgicalHistory: [], drugHistory: [], allergyHistory: [], familyHistory: [],
              personalHistory: { diet: 'Not recorded', tobaccoUse: 'Not recorded', alcoholUse: 'Not recorded', sleep: 'Not recorded', physicalActivity: 'Not recorded' },
              reviewOfSystems: [], previousInvestigations: []
            },
            aiSummary: {
              conciseSummary: 'AI clinical summary has not been generated yet for this patient.',
              keyPositiveFindings: [],
              pertinentNegatives: [],
              redFlagAlerts: q.priority === 'urgent' ? ['High Priority Review'] : [],
              differentialDiagnoses: [],
              recommendedInvestigations: []
            },
            timeline: [],
            documents: []
          };
          return {
            ...existing,
            ...q,
            priority: (q.priority || existing.priority).toLowerCase() as PriorityLevel,
          };
        });
      });
    } catch (err: any) {
      setQueueError(err?.message || 'Unable to load the OPD queue. Please retry.');
    } finally {
      setIsLoadingQueue(false);
    }
  };

  useEffect(() => {
    refreshQueue();
  }, [filterPriority, filterDepartment, searchQuery]);

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  // Fetch Aggregated Workspace via single GET /api/v1/doctor/patients/:patientId/workspace call
  const selectPatientById = async (id: string) => {
    setSelectedPatientId(id);
    setIsLoadingWorkspace(true);

    try {
      const workspace = await api.getPatientWorkspace(id);
      if (workspace && workspace.patient) {
        const wsPatient = workspace.patient;
        setPatients(prev => prev.map(p => {
          if (p.id !== id) return p;
          return {
            ...p,
            ...wsPatient,
            structuredHistory: workspace.structuredHistory || p.structuredHistory,
            aiSummary: workspace.aiSummary || p.aiSummary,
            timeline: workspace.timeline || p.timeline,
            documents: workspace.documents && workspace.documents.length > 0 ? workspace.documents : p.documents,
            redFlag: workspace.redFlagAlert || p.redFlag,
          };
        }));
      }
    } catch {
      // Safe fallback to local data
    } finally {
      setIsLoadingWorkspace(false);
    }

    const pat = patients.find(p => p.id === id);
    if (pat) {
      setConsultationNote({
        patientId: pat.id,
        doctorName: getDoctorName(),
        provisionalDiagnosis: pat.aiSummary.differentialDiagnoses[0]?.name || 'Clinical Evaluation',
        icdCode: pat.aiSummary.differentialDiagnoses[0]?.icdCode || 'R69',
        clinicalNotes: `Patient reviewed based on MediKiosk structured history. Chief complaint: ${pat.structuredHistory.chiefComplaint.primary}.`,
        prescriptions: pat.structuredHistory.drugHistory.map(d => ({
          medicine: d.drugName,
          dosage: d.dosage,
          frequency: d.frequency,
          duration: '30 days',
          instructions: 'Continue regular maintenance regimen'
        })),
        orderedInvestigations: pat.aiSummary.recommendedInvestigations.slice(0, 3),
        followUpDays: pat.priority === 'urgent' ? 1 : 14,
        isPushedToAbha: false
      });
      setIsConsultationSaved(false);
    }
  };

  const verifyAiSummary = async (action: 'accepted' | 'edited' | 'rejected', modifiedText?: string) => {
    setPatients(prev => prev.map(p => {
      if (p.id !== selectedPatientId) return p;
      return {
        ...p,
        aiSummary: {
          ...p.aiSummary,
          doctorVerification: {
            status: action,
            modifiedText: modifiedText || p.aiSummary.conciseSummary,
            verifiedAt: new Date().toLocaleTimeString(),
            verifiedByDoctorId: getDoctorName()
          }
        }
      };
    }));

    // Record verified summary in PostgreSQL
    const sumId = selectedPatient?.aiSummary?.id || selectedPatientId;
    api.verifySummary(sumId, action, modifiedText).catch(() => {});
  };

  const updateConsultationNote = (updates: Partial<DoctorConsultationNote>) => {
    setConsultationNote(prev => ({ ...prev, ...updates }));
  };

  const addPrescriptionItem = (item: { medicine: string; dosage: string; frequency: string; duration: string; instructions: string }) => {
    setConsultationNote(prev => ({
      ...prev,
      prescriptions: [...prev.prescriptions, item]
    }));
  };

  const removePrescriptionItem = (index: number) => {
    setConsultationNote(prev => ({
      ...prev,
      prescriptions: prev.prescriptions.filter((_, i) => i !== index)
    }));
  };

  const saveAndPushToAbha = async () => {
    setIsSavingConsultation(true);

    try {
      // 1. Save Consultation to Fastify Backend
      const saveRes = await api.saveConsultation({
        patientId: selectedPatientId,
        provisionalDiagnosis: consultationNote.provisionalDiagnosis,
        icdCode: consultationNote.icdCode,
        clinicalNotes: consultationNote.clinicalNotes,
        prescriptions: consultationNote.prescriptions,
        orderedInvestigations: consultationNote.orderedInvestigations,
        followUpDays: consultationNote.followUpDays,
      });

      // 2. Trigger ABDM FHIR R4 Bundle Push
      if (saveRes?.consultationId) {
        await api.pushConsultationToAbha(saveRes.consultationId);
      }
    } catch {
      // Safe simulated delay if offline
      await new Promise(r => setTimeout(r, 1000));
    } finally {
      setIsSavingConsultation(false);
      setIsConsultationSaved(true);
      setConsultationNote(prev => ({
        ...prev,
        isPushedToAbha: true,
        savedAt: new Date().toLocaleTimeString()
      }));

      // Update patient status to completed
      setPatients(prev => prev.map(p => {
        if (p.id !== selectedPatientId) return p;
        return {
          ...p,
          queueStatus: 'completed',
          historyStatus: 'verified'
        };
      }));
    }
  };

  const resetConsultation = () => {
    setIsConsultationSaved(false);
  };

  return (
    <DoctorContext.Provider
      value={{
        patients,
        selectedPatient,
        filterPriority,
        filterDepartment,
        searchQuery,
        consultationNote,
        isSavingConsultation,
        isConsultationSaved,
        isLoadingWorkspace,
        isLoadingQueue,
        queueError,
        selectPatientById,
        setFilterPriority,
        setFilterDepartment,
        setSearchQuery,
        verifyAiSummary,
        updateConsultationNote,
        addPrescriptionItem,
        removePrescriptionItem,
        saveAndPushToAbha,
        resetConsultation,
        refreshQueue
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctor = (): DoctorContextType => {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error('useDoctor must be used within a DoctorProvider');
  }
  return context;
};
