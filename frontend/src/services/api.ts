/**
 * MediKiosk Domain API Service
 * High-level typed API service connecting React UI components to the Fastify backend.
 */
import { apiClient, ApiError } from '../lib/api-client';

export { ApiError };

export const api = {
  // ==========================================
  // AUTHENTICATION & KIOSK INTAKE
  // ==========================================
  async login(email: string, password: string) {
    const data = await apiClient.post<{ accessToken: string; refreshToken: string; user: any }>('/auth/login', {
      email,
      password,
    });
    const displayName = data.user ? `${data.user.firstName} ${data.user.lastName}` : undefined;
    apiClient.setToken(data.accessToken, data.user?.role, undefined, displayName);
    return data;
  },

  async verifyAbha(abhaId: string, otp: string, sessionId?: string) {
    const data = await apiClient.post<{ patient: any; token: string; refreshToken: string }>('/auth/patient/abha-verify', {
      abhaId,
      otp,
      sessionId,
    });
    apiClient.setToken(data.token, 'PATIENT', data.patient?.id);
    return data;
  },

  async verifyMobile(mobile: string, otp: string, sessionId?: string) {
    const data = await apiClient.post<{ patient: any; token: string; refreshToken: string }>('/auth/patient/mobile-verify', {
      mobile,
      otp,
      sessionId,
    });
    apiClient.setToken(data.token, 'PATIENT', data.patient?.id);
    return data;
  },

  async registerWalkin(patientData: { name: string; age: number; gender: string; mobile?: string; sessionId?: string }) {
    const data = await apiClient.post<{ patient: any; token: string; refreshToken: string }>('/auth/patient/walkin', patientData);
    apiClient.setToken(data.token, 'PATIENT', data.patient?.id);
    return data;
  },

  async getCurrentUser() {
    return apiClient.get<{ user: any }>('/auth/me');
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      apiClient.clearSession();
    }
  },

  // ==========================================
  // PATIENT SESSIONS
  // ==========================================
  async createSession(departmentId = 'general', kioskTerminalId = 'K01', language = 'hi', patientId?: string) {
    return apiClient.post<{ sessionId: string; departmentId: string; language: string; status: string; estimatedWaitMins: number }>(
      '/patient-sessions',
      { departmentId, kioskTerminalId, language, patientId }
    );
  },

  async getSession(sessionId: string) {
    return apiClient.get(`/patient-sessions/${sessionId}`);
  },

  async updateSessionLanguage(sessionId: string, languageCode: string) {
    return apiClient.patch(`/patient-sessions/${sessionId}/language`, { languageCode });
  },

  async completeSession(sessionId: string) {
    return apiClient.post(`/patient-sessions/${sessionId}/complete`);
  },

  // ==========================================
  // CONSENTS (ABDM DPDP ACT 2023)
  // ==========================================
  async recordConsent(patientId: string, sessionId: string, flags: { consentAi: boolean; consentDoctorShare: boolean; consentAbha: boolean }) {
    return apiClient.post('/consents', {
      patientId,
      sessionId,
      ...flags,
    });
  },

  async getConsent(patientId: string) {
    return apiClient.get(`/consents/${patientId}`);
  },

  async revokeConsent(consentId: string) {
    return apiClient.post(`/consents/${consentId}/revoke`);
  },

  // ==========================================
  // AI ADAPTIVE CLINICAL INTERVIEW
  // ==========================================
  async getOrCreateInterview(patientId: string, sessionId: string, departmentId = 'general') {
    return apiClient.post<{ interviewId: string; currentStep: number; status: string; currentQuestion?: any }>('/interviews', {
      patientId,
      sessionId,
      departmentId,
    });
  },

  async submitAnswer(interviewId: string, payload: {
    questionId: string;
    answerType: string;
    value: any;
    rawVoiceTranscript?: string;
    confidence?: number;
    stepNumber?: number;
    department?: string;
  }) {
    return apiClient.post<{
      interviewId: string;
      redFlagAlert: {
        isTriggered: boolean;
        priority: 'NORMAL' | 'ATTENTION' | 'URGENT';
        title: string;
        reason: string;
        triggeringFindings: string[];
      };
      nextQuestion: any;
    }>(`/interviews/${interviewId}/answer`, payload);
  },

  async transcribeVoice(audioFile?: Blob | File, language = 'hi') {
    return apiClient.post<{ transcript: string; confidence: number }>(`/interviews/voice/transcribe?language=${language}`);
  },

  async completeInterview(interviewId: string, patientId: string) {
    return apiClient.post(`/interviews/${interviewId}/complete`, { patientId });
  },

  // ==========================================
  // DETERMINISTIC RED FLAGS & TRIAGE
  // ==========================================
  async triggerEmergencyAlert(patientId: string, sessionId: string, symptoms: string[], source?: string) {
    return apiClient.post<{ alertId: string; priority: string; staffAlertSent: boolean }>('/red-flags/trigger', {
      patientId,
      sessionId,
      symptoms,
      source,
    });
  },

  async getPatientRedFlags(patientId: string) {
    return apiClient.get(`/red-flags/${patientId}`);
  },

  // ==========================================
  // DOCUMENTS & OCR PIPELINE
  // ==========================================
  async uploadDocument(formData: FormData) {
    return apiClient.upload<{
      id: string;
      patientId: string;
      title: string;
      documentType: string;
      fileUrl: string;
      ocrStatus: string;
      confidenceScore: number;
    }>('/documents/upload', formData);
  },

  async getPatientDocuments(patientId: string) {
    return apiClient.get<{ documents: any[] }>(`/documents/patient/${patientId}`);
  },

  async getDocument(id: string) {
    return apiClient.get(`/documents/${id}`);
  },

  async getOcrStatus(jobId: string) {
    return apiClient.get<{ jobId: string; status: string; progressPct: number; stage: string }>(`/ocr/status/${jobId}`);
  },

  async getOcrExtraction(documentId: string) {
    return apiClient.get(`/ocr/${documentId}/extraction`);
  },

  async correctEntity(documentId: string, entityId: string, correctedValue: string) {
    return apiClient.patch(`/ocr/${documentId}/extraction`, { entityId, correctedValue });
  },

  // ==========================================
  // TIMELINE & CLINICAL HISTORY
  // ==========================================
  async getPatientTimeline(patientId: string) {
    return apiClient.get<{ timeline: any[] }>(`/timeline/${patientId}`);
  },

  async addTimelineEvent(event: any) {
    return apiClient.post('/timeline/events', event);
  },

  async getStructuredHistory(patientId: string) {
    return apiClient.get<{ history: any }>(`/clinical-history/${patientId}`);
  },

  // ==========================================
  // AI CLINICAL SUMMARY & REVISION HISTORY
  // ==========================================
  async generateSummary(patientId: string, interviewId?: string, isAyush?: boolean) {
    return apiClient.post('/summaries/generate', { patientId, interviewId, isAyush });
  },

  async getPatientSummary(patientId: string) {
    return apiClient.get(`/summaries/${patientId}`);
  },

  async verifySummary(summaryId: string, action: 'accepted' | 'edited' | 'rejected', modifiedText?: string) {
    return apiClient.post(`/summaries/${summaryId}/verify`, { action, modifiedText });
  },

  // ==========================================
  // DOCTOR CLINICAL WORKSPACE
  // ==========================================
  async getDoctorDashboard() {
    return apiClient.get('/doctor/dashboard');
  },

  async getDoctorQueue(params?: { priority?: string; department?: string; query?: string }) {
    return apiClient.get<{ queue: any[]; total: number }>('/doctor/queue', params);
  },

  async getPatientWorkspace(patientId: string) {
    return apiClient.get<{
      patient: any;
      structuredHistory: any;
      aiSummary: any;
      timeline: any[];
      documents: any[];
      redFlagAlert?: any;
    }>(`/doctor/patients/${patientId}/workspace`);
  },

  // ==========================================
  // CONSULTATION & ABDM FHIR R4 PUSH
  // ==========================================
  async saveConsultation(payload: {
    patientId: string;
    provisionalDiagnosis: string;
    icdCode: string;
    clinicalNotes: string;
    prescriptions: Array<{ medicine: string; dosage: string; frequency: string; duration: string; instructions?: string }>;
    orderedInvestigations?: string[];
    followUpDays?: number;
  }) {
    return apiClient.post<{ consultationId: string; status: string }>('/consultations', payload);
  },

  async pushConsultationToAbha(consultationId: string) {
    return apiClient.post<{ isPushedToAbha: boolean; fhirBundleId: string }>(`/consultations/${consultationId}/push-abha`);
  },

  // ==========================================
  // STAFF DESK & KIOSK MONITORING
  // ==========================================
  async getStaffKiosks() {
    return apiClient.get<{ kiosks: any[] }>('/staff/kiosks');
  },

  async getStaffAlerts() {
    return apiClient.get<{ alerts: any[] }>('/staff/alerts');
  },

  async acknowledgeAlert(alertId: string) {
    return apiClient.post<{ acknowledged: boolean; responderId: string }>(`/staff/alerts/${alertId}/acknowledge`);
  },

  // ==========================================
  // ADMIN ENTERPRISE ANALYTICS & AUDIT LOGS
  // ==========================================
  async getAdminAnalytics() {
    return apiClient.get<{
      metrics: any;
      hourlyFlow: { hour: string; intake: number; redFlags: number }[];
      departmentDistribution: { name: string; count: number; pct: number; color: string }[];
    }>('/admin/analytics');
  },

  async getAdminAuditLogs() {
    return apiClient.get<{ logs: any[] }>('/admin/audit-logs');
  },

  async getConsentRegistry() {
    return apiClient.get<{ registry: any[] }>('/admin/consent-registry');
  },
};
