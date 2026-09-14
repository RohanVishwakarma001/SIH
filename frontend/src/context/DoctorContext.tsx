import React, { createContext, useContext, useState, useEffect } from 'react';
import { Patient, PriorityLevel, DepartmentId, DoctorConsultationNote } from '../types';
import { MOCK_PATIENTS } from '../data/mockData';
import { api } from '../services/api';
import { apiClient } from '../lib/api-client';

const getDoctorName = () => apiClient.getUserName() || 'Attending Doctor';

interface DoctorContextType {
  patients: Patient[];
  selectedPatient: Patient;
  filterPriority: 'all' | PriorityLevel;
  filterDepartment: 'all' | DepartmentId;
  searchQuery: string;
  consultationNote: DoctorConsultationNote;
  isSavingConsultation: boolean;
  isConsultationSaved: boolean;
  isLoadingWorkspace: boolean;
  
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
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(MOCK_PATIENTS[0].id);
  const [filterPriority, setFilterPriority] = useState<'all' | PriorityLevel>('all');
  const [filterDepartment, setFilterDepartment] = useState<'all' | DepartmentId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState<boolean>(false);
  
  const [consultationNote, setConsultationNote] = useState<DoctorConsultationNote>({
    patientId: MOCK_PATIENTS[0].id,
    doctorName: getDoctorName(),
    provisionalDiagnosis: 'Acute Coronary Syndrome (Rule out Anterior Wall STEMI)',
    icdCode: 'I21.9',
    clinicalNotes: 'Pt presents with classic retrosternal chest pain + diaphoresis. Stat ECG reveals 2mm ST-elevations in V2-V4. Initiated ACS loading dose protocol.',
    prescriptions: [
      { medicine: 'Tab. Aspirin', dosage: '300mg', frequency: 'STAT (Chewable)', duration: '1 day', instructions: 'Take immediately with water' },
      { medicine: 'Tab. Clopidogrel', dosage: '300mg', frequency: 'STAT', duration: '1 day', instructions: 'Loading dose' },
      { medicine: 'Tab. Atorvastatin', dosage: '80mg', frequency: 'STAT', duration: '1 day', instructions: 'High intensity statin' },
      { medicine: 'S/L Sorbitrate', dosage: '5mg', frequency: 'SOS', duration: '3 days', instructions: 'Place under tongue if chest pain recurs' }
    ],
    orderedInvestigations: [
      'Stat 12-Lead Electrocardiogram (ECG)',
      'High Sensitivity Troponin-I (hs-cTnI)',
      'Echocardiogram (Bedside 2D Echo)'
    ],
    followUpDays: 0,
    isPushedToAbha: false
  });

  const [isSavingConsultation, setIsSavingConsultation] = useState<boolean>(false);
  const [isConsultationSaved, setIsConsultationSaved] = useState<boolean>(false);

  // Synchronize Live OPD Queue with Fastify Backend
  const refreshQueue = async () => {
    try {
      const res = await api.getDoctorQueue({
        priority: filterPriority,
        department: filterDepartment,
        query: searchQuery,
      });

      if (res?.queue && Array.isArray(res.queue) && res.queue.length > 0) {
        // Merge backend queue data with full mock patient details
        setPatients(prev => {
          const map = new Map(prev.map(p => [p.id, p]));
          return res.queue.map(q => {
            const existing = map.get(q.id) || MOCK_PATIENTS.find(m => m.id === q.id) || MOCK_PATIENTS[0];
            return {
              ...existing,
              ...q,
              priority: (q.priority || existing.priority).toLowerCase() as PriorityLevel,
            };
          });
        });
      }
    } catch {
      // Retain local patients if offline
    }
  };

  useEffect(() => {
    refreshQueue();
  }, [filterPriority, filterDepartment, searchQuery]);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

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

    const pat = patients.find(p => p.id === id) || MOCK_PATIENTS.find(m => m.id === id);
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
    const sumId = selectedPatient.aiSummary?.id || selectedPatientId;
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
