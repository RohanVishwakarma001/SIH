# MediKiosk Frontend-to-Backend Architecture & API Mapping

**Platform:** MediKiosk — AI-Powered Clinical History-Taking & Triage Platform for High-Volume Indian OPDs (Smart India Hackathon)  
**Document Purpose:** Exhaustive specification mapping every frontend route, component, form, button, state, and interaction to its corresponding backend API, database model, RBAC policy, request/response schema, and error codes.

---

## 1. System Overview & Architecture

The MediKiosk backend is architected as a high-performance **Fastify + TypeScript** REST API running with PostgreSQL and Prisma ORM, utilizing Zod for rigorous runtime validation, JWT with sliding refresh tokens for authentication, and WebSocket infrastructure for real-time red-flag emergency triage alerts.

### Supported User Roles
- **PATIENT**: Kiosk user performing pre-consultation check-in, informed consent, multilingual AI voice/touch clinical interview, and document OCR.
- **DOCTOR**: Attending physician reviewing the OPD queue, examining the 3-column clinical workstation, accepting/editing/rejecting AI clinical summaries, and generating e-prescriptions with ABDM FHIR sync.
- **STAFF**: Triage nurses and hospital ground staff monitoring kiosk terminals, acknowledging emergency red-flag dispatches, and assisting walk-ins.
- **ADMIN**: Hospital operational leadership overseeing footfall analytics, hourly throughput, AI accuracy, and ABDM DPDP compliance audit logs.

---

## 2. Complete Frontend-to-Backend Mapping Matrix

| # | Frontend Route | Feature / Component | User Role | Required API Endpoint | HTTP Method | Request Body / Query | Response Payload | Auth / RBAC | Database Entity | Possible Error Codes |
|---|---|---|---|---|---|---|---|---|---|---|
| **1** | `/patient/welcome` | Department Selection & Session Initialization | PATIENT | `/api/v1/patient-sessions` | `POST` | `{ departmentId: string, kioskTerminalId: string }` | `{ sessionId: string, department: object, status: 'CREATED', startedAt: string }` | Public / Kiosk Terminal Token | `PatientSession`, `Department` | `INVALID_DEPARTMENT`, `KIOSK_TERMINAL_OFFLINE` |
| **2** | `/patient/language` | Language Preference Selection (en, hi, mr, ta, te, bn) | PATIENT | `/api/v1/patient-sessions/:sessionId/language` | `PATCH` | `{ languageCode: 'en'\|'hi'\|'mr'\|'ta'\|'te'\|'bn' }` | `{ sessionId: string, language: string, audioGuidanceEnabled: boolean }` | Session Token | `PatientSession` | `SESSION_NOT_FOUND`, `UNSUPPORTED_LANGUAGE` |
| **3** | `/patient/login` (Tab 1: ABHA) | ABHA 14-digit ID Verification via OTP | PATIENT | `/api/v1/auth/patient/abha-verify` | `POST` | `{ abhaId: string, otp: string, sessionId: string }` | `{ patient: PatientProfile, token: string, isVerified: true }` | Public / Session Token | `Patient`, `PatientSession` | `INVALID_ABHA_FORMAT`, `OTP_EXPIRED`, `OTP_MISMATCH` |
| **4** | `/patient/login` (Tab 2: Mobile) | Mobile Number OTP Authentication | PATIENT | `/api/v1/auth/patient/mobile-verify` | `POST` | `{ mobile: string, otp: string, sessionId: string }` | `{ patient: PatientProfile, token: string }` | Public / Session Token | `Patient`, `PatientSession` | `INVALID_PHONE_NUMBER`, `OTP_INVALID` |
| **5** | `/patient/login` (Tab 3: Walk-in) | New Patient Demographic Registration | PATIENT | `/api/v1/auth/patient/walkin` | `POST` | `{ name: string, age: number, gender: string, mobile?: string, sessionId: string }` | `{ patient: PatientProfile, token: string }` | Public / Session Token | `Patient`, `PatientSession` | `INVALID_DEMOGRAPHICS`, `AGE_OUT_OF_RANGE` |
| **6** | `/patient/consent` | ABDM Informed Consent Recording | PATIENT | `/api/v1/consents` | `POST` | `{ patientId: string, sessionId: string, consentAi: boolean, consentDoctorShare: boolean, consentAbha: boolean, version: string }` | `{ consentId: string, status: 'ACTIVE', timestamp: string, fhirConsentArtifact: string }` | JWT (PATIENT) | `Consent`, `AuditLog` | `CONSENT_ALREADY_EXISTS`, `MANDATORY_CLAUSE_REJECTED` |
| **7** | `/patient/consent` | Fetch Active Patient Consent | PATIENT | `/api/v1/consents/:patientId` | `GET` | *None* | `{ hasConsented: boolean, activeConsent: ConsentDetails }` | JWT (PATIENT / DOCTOR) | `Consent` | `PATIENT_NOT_FOUND` |
| **8** | `/patient/consent` | Revoke Patient Consent | PATIENT | `/api/v1/consents/:id/revoke` | `POST` | `{ reason: string }` | `{ consentId: string, status: 'REVOKED', revokedAt: string }` | JWT (PATIENT) | `Consent`, `AuditLog` | `CONSENT_NOT_FOUND`, `ALREADY_REVOKED` |
| **9** | `/patient/home` | Pre-interview session readiness & wait time | PATIENT | `/api/v1/patient-sessions/:sessionId` | `GET` | *None* | `{ session: object, estimatedWaitMins: number, department: object }` | JWT (PATIENT) | `PatientSession`, `Department` | `SESSION_EXPIRED` |
| **10** | `/patient/interview` | Initialize / Fetch Adaptive Clinical Interview | PATIENT | `/api/v1/interviews` | `POST` | `{ sessionId: string, patientId: string, departmentId: string }` | `{ interviewId: string, currentStep: number, totalSteps: number, currentQuestion: QuestionSchema }` | JWT (PATIENT) | `ClinicalInterview`, `InterviewQuestion` | `CONSENT_REQUIRED`, `INTERVIEW_ALREADY_COMPLETED` |
| **11** | `/patient/interview` | Submit Question Answer (Touch / Scale / Voice) | PATIENT | `/api/v1/interviews/:id/answer` | `POST` | `{ questionId: string, answerType: 'single_choice'\|'multi_choice'\|'scale'\|'text_voice', value: any, rawVoiceTranscript?: string, confidence?: number }` | `{ isAccepted: true, isRedFlag: boolean, nextQuestion: QuestionSchema \| null, isCompleted: boolean }` | JWT (PATIENT) | `InterviewAnswer`, `RedFlag` | `INVALID_ANSWER_FORMAT`, `QUESTION_NOT_FOUND` |
| **12** | `/patient/interview` | Speech-to-Text Audio Transcription | PATIENT | `/api/v1/interviews/:id/voice-transcript` | `POST` | `multipart/form-data (audio file or PCM buffer, language: string)` | `{ transcript: string, confidence: number, language: string }` | JWT (PATIENT) | `ClinicalInterview` | `AUDIO_PROCESSING_ERROR`, `SPEECH_NOT_RECOGNIZED` |
| **13** | `/patient/interview` | Adaptive Next Question Engine (Rule + LLM) | PATIENT | `/api/v1/interviews/:id/next-question` | `GET` | *None* | `{ question: QuestionSchema, progressPct: number, remainingSteps: number }` | JWT (PATIENT) | `ClinicalInterview`, `InterviewQuestion` | `INTERVIEW_COMPLETED` |
| **14** | `/patient/interview` | Complete Clinical Interview Intake | PATIENT | `/api/v1/interviews/:id/complete` | `POST` | *None* | `{ interviewId: string, status: 'COMPLETED', redFlagDetected: boolean, summaryDraftId: string }` | JWT (PATIENT) | `ClinicalInterview`, `ClinicalHistory` | `INCOMPLETE_MANDATORY_QUESTIONS` |
| **15** | `/patient/red-flag` | Emergency Triage Red-Flag Trigger | PATIENT | `/api/v1/red-flags/trigger` | `POST` | `{ patientId: string, sessionId: string, symptoms: string[], severity: 'urgent'\|'critical', source: 'AI_DETECTION'\|'MANUAL_HELP' }` | `{ alertId: string, priority: 'URGENT', staffAlertSent: true, emergencyToken: string }` | JWT (PATIENT / KIOSK) | `RedFlag`, `TriageAlert`, `Notification` | `PATIENT_NOT_FOUND` |
| **16** | `/patient/red-flag` | Dispatch Triage Nurse Alert | PATIENT | `/api/v1/notifications/staff-dispatch` | `POST` | `{ alertId: string, kioskId: string, notes?: string }` | `{ dispatched: true, broadcastTimestamp: string, assignedStaffTeam: string }` | JWT (PATIENT / KIOSK) | `Notification`, `AuditLog` | `ALERT_ALREADY_DISPATCHED` |
| **17** | `/patient/documents` | Document Upload (Prescription, Lab, Discharge) | PATIENT | `/api/v1/documents/upload` | `POST` | `multipart/form-data (file: Buffer, patientId: string, type: string, facility?: string)` | `{ documentId: string, filename: string, storageKey: string, uploadStatus: 'UPLOADED' }` | JWT (PATIENT / DOCTOR) | `Document` | `FILE_TOO_LARGE`, `INVALID_MIME_TYPE`, `STORAGE_UNAVAILABLE` |
| **18** | `/patient/documents` | List Patient Scanned Documents | PATIENT / DOCTOR | `/api/v1/patients/:patientId/documents` | `GET` | *None* | `{ documents: DocumentSummary[] }` | JWT (PATIENT / DOCTOR) | `Document` | `UNAUTHORIZED_PATIENT_ACCESS` |
| **19** | `/patient/ocr-processing` | Trigger Asynchronous Document OCR & NER Pipeline | PATIENT | `/api/v1/ocr/process/:documentId` | `POST` | `{ triggerEntities: boolean, language?: string }` | `{ jobId: string, documentId: string, status: 'PROCESSING', estimatedMs: 2500 }` | JWT (PATIENT / DOCTOR) | `Document`, `OCRResult` | `DOCUMENT_NOT_FOUND`, `ALREADY_PROCESSING` |
| **20** | `/patient/ocr-processing` | Poll OCR Processing Status & Telemetry | PATIENT | `/api/v1/ocr/status/:jobId` | `GET` | *None* | `{ jobId: string, status: 'PROCESSING'\|'COMPLETED'\|'FAILED', progressPct: number, stage: string }` | JWT (PATIENT / DOCTOR) | `OCRResult` | `JOB_NOT_FOUND` |
| **21** | `/patient/doc-review` | Get Extracted Medical Entities for Verification | PATIENT / DOCTOR | `/api/v1/documents/:id/extraction` | `GET` | *None* | `{ documentId: string, rawText: string, confidenceScore: number, entities: MedicalEntity[] }` | JWT (PATIENT / DOCTOR) | `OCRResult`, `MedicalEntity` | `EXTRACTION_NOT_READY` |
| **22** | `/patient/doc-review` | Correct / Verify OCR Extracted Entity | PATIENT / DOCTOR | `/api/v1/documents/:id/extraction` | `PATCH` | `{ entityId: string, correctedValue: string, isVerified: boolean }` | `{ entityId: string, updatedValue: string, previousValue: string, correctedAt: string }` | JWT (PATIENT / DOCTOR) | `MedicalEntity`, `AuditLog` | `ENTITY_NOT_FOUND` |
| **23** | `/patient/timeline` | Get Chronological Health Journey Events | PATIENT / DOCTOR | `/api/v1/patients/:patientId/timeline` | `GET` | *None* | `{ timeline: TimelineEvent[] }` | JWT (PATIENT / DOCTOR) | `MedicalTimelineEvent` | `UNAUTHORIZED_PATIENT_ACCESS` |
| **24** | `/patient/timeline` | Append Timeline Event | DOCTOR / SYSTEM | `/api/v1/timeline/events` | `POST` | `{ patientId: string, date: string, category: string, title: string, facility: string, summary: string, isImportant?: boolean }` | `{ eventId: string, created: true }` | JWT (DOCTOR / SYSTEM) | `MedicalTimelineEvent` | `INVALID_EVENT_DATA` |
| **25** | `/patient/summary` | Get Standard Structured Clinical History | PATIENT / DOCTOR | `/api/v1/clinical-history/:patientId` | `GET` | *None* | `{ history: StructuredClinicalHistorySchema, ayushData?: DashavidhaParikshaSchema }` | JWT (PATIENT / DOCTOR) | `ClinicalHistory`, `AyushAssessment` | `CLINICAL_HISTORY_NOT_FOUND` |
| **26** | `/patient/summary` | Generate / Fetch AI Clinical Triage Summary | PATIENT / DOCTOR | `/api/v1/summaries/generate` | `POST` | `{ patientId: string, interviewId: string, refresh?: boolean }` | `{ summary: AiClinicalSummarySchema, revision: 1, requiresPhysicianReview: true }` | JWT (PATIENT / DOCTOR) | `ClinicalSummary`, `SummaryRevision` | `AI_PROVIDER_UNAVAILABLE`, `INSUFFICIENT_CLINICAL_DATA` |
| **27** | `/patient/completion` | Finalize Kiosk Intake & Issue OPD Queue Token | PATIENT | `/api/v1/patient-sessions/:sessionId/complete` | `POST` | *None* | `{ token: string, roomNo: string, assignedDoctor: string, waitTimeMins: number, queuePosition: number, qrCodeData: string }` | JWT (PATIENT) | `PatientSession`, `Patient` | `SESSION_INCOMPLETE` |
| **28** | `/patient/completion` | Dispatch Token Receipt via SMS / WhatsApp | PATIENT | `/api/v1/notifications/send-token-sms` | `POST` | `{ mobile: string, token: string, roomNo: string }` | `{ sent: true, provider: 'MOCK_NIC_SMS', timestamp: string }` | JWT (PATIENT) | `Notification` | `INVALID_PHONE_NUMBER` |
| **29** | `/doctor/dashboard` | Fetch Doctor OPD Shift Telemetry & Metrics | DOCTOR | `/api/v1/doctor/dashboard` | `GET` | *None* | `{ todaysTotalOpd: number, waitingCount: number, completedHistoriesCount: number, urgentRedFlagsCount: number, avgIntakeMinutes: number }` | JWT (DOCTOR) | `Patient`, `PatientSession`, `Doctor` | `FORBIDDEN_DOCTOR_ACCESS` |
| **30** | `/doctor/dashboard` | Fetch OPD Real-Time Triage Queue | DOCTOR | `/api/v1/doctor/queue` | `GET` | `?priority=all|urgent|attention|normal&department=all|general|cardio...&search=string` | `{ queue: DoctorQueueItem[], total: number }` | JWT (DOCTOR) | `Patient`, `PatientSession` | `INVALID_QUEUE_FILTER` |
| **31** | `/doctor/patient/:id` | Aggregated Doctor Clinical Workspace (HERO 2) | DOCTOR | `/api/v1/doctor/patients/:patientId/workspace` | `GET` | *None* | `{ patient: PatientProfile, vitals: VitalsSchema, timeline: TimelineEvent[], documents: DocumentSummary[], structuredHistory: StructuredClinicalHistory, aiSummary: AiClinicalSummary, redFlagAlert?: RedFlag }` | JWT (DOCTOR) | `Patient`, `ClinicalHistory`, `ClinicalSummary`, `Document`, `MedicalTimelineEvent` | `PATIENT_NOT_FOUND`, `UNAUTHORIZED_DOCTOR` |
| **32** | `/doctor/patient/:id` | Physician AI Summary Review (Accept/Edit/Reject) | DOCTOR | `/api/v1/summaries/:id/verify` | `POST` | `{ action: 'accepted'\|'edited'\|'rejected', modifiedText?: string, physicianRemarks?: string }` | `{ summaryId: string, status: string, revisionNumber: number, verifiedAt: string, verifiedByDoctorId: string }` | JWT (DOCTOR) | `ClinicalSummary`, `SummaryRevision`, `AuditLog` | `SUMMARY_NOT_FOUND`, `PHYSICIAN_AUTH_REQUIRED` |
| **33** | `/doctor/documents` | Document High-Res Inspection & Bounding Boxes | DOCTOR | `/api/v1/documents/:id/workspace` | `GET` | *None* | `{ document: DocumentDetail, rawOcrText: string, boundingBoxes: BoundingBox[], entities: MedicalEntity[] }` | JWT (DOCTOR) | `Document`, `OCRResult` | `DOCUMENT_NOT_FOUND` |
| **34** | `/doctor/consultation` | Save Doctor Consultation, Rx & Advice | DOCTOR | `/api/v1/consultations` | `POST` | `{ patientId: string, provisionalDiagnosis: string, icdCode: string, clinicalNotes: string, prescriptions: RxItem[], orderedInvestigations: string[], followUpDays: number }` | `{ consultationId: string, savedAt: string, status: 'SAVED', fhirPrescriptionId: string }` | JWT (DOCTOR) | `Consultation`, `Prescription`, `DoctorNote`, `AuditLog` | `INVALID_ICD_CODE`, `PATIENT_NOT_ACTIVE` |
| **35** | `/doctor/consultation` | Push Consultation to ABDM Health Data Exchange | DOCTOR | `/api/v1/consultations/:id/push-abha` | `POST` | *None* | `{ pushedToAbha: true, abhaBundleId: string, transactionId: string, timestamp: string }` | JWT (DOCTOR) | `Consultation`, `AuditLog` | `ABDM_BRIDGE_ERROR`, `CONSENT_REVOKED` |
| **36** | `/staff` | Kiosk Telemetry & Active Terminals Telemetry | STAFF / ADMIN | `/api/v1/staff/kiosks` | `GET` | *None* | `{ activeKiosks: KioskTerminalStatus[] }` | JWT (STAFF / ADMIN) | `KioskTerminal` | `UNAUTHORIZED_STAFF_ACCESS` |
| **37** | `/staff` | Fetch Active Urgent Red-Flag Dispatch Queue | STAFF | `/api/v1/staff/alerts` | `GET` | *None* | `{ alerts: RedFlagAlertItem[] }` | JWT (STAFF) | `RedFlag`, `TriageAlert` | `UNAUTHORIZED_STAFF_ACCESS` |
| **38** | `/staff` | Acknowledge Emergency Triage Alert & Dispatch Nurse | STAFF | `/api/v1/staff/alerts/:alertId/acknowledge` | `POST` | `{ staffBadgeId: string, remarks?: string }` | `{ alertId: string, status: 'ACKNOWLEDGED', nurseDispatchedAt: string }` | JWT (STAFF) | `RedFlag`, `TriageAlert`, `AuditLog` | `ALERT_ALREADY_ACKNOWLEDGED` |
| **39** | `/admin` | Executive Analytics & Hourly OPD Throughput | ADMIN | `/api/v1/admin/analytics` | `GET` | `?dateRange=today\|week\|month` | `{ metrics: AdminMetrics, hourlyFlow: HourlyFlowItem[], departmentDistribution: DeptDistributionItem[] }` | JWT (ADMIN) | `PatientSession`, `ClinicalHistory`, `OCRResult` | `FORBIDDEN_ADMIN_ACCESS` |
| **40** | `/admin` | Immutable Clinical Audit Trail | ADMIN | `/api/v1/audit/logs` | `GET` | `?limit=50&offset=0&role=string&action=string` | `{ logs: AuditLogItem[], totalCount: number }` | JWT (ADMIN) | `AuditLog` | `FORBIDDEN_ADMIN_ACCESS` |
| **41** | `/admin` | ABDM DPDP Electronic Consent Registry | ADMIN | `/api/v1/admin/consent-registry` | `GET` | `?page=1&pageSize=20` | `{ registry: ConsentRegistryItem[], totalRecords: number }` | JWT (ADMIN) | `Consent`, `AuditLog` | `FORBIDDEN_ADMIN_ACCESS` |
| **42** | Auth Core | Staff/Doctor/Admin Login | ALL | `/api/v1/auth/login` | `POST` | `{ email: string, password: string, role?: 'DOCTOR'\|'STAFF'\|'ADMIN' }` | `{ accessToken: string, refreshToken: string, user: UserProfile }` | Public | `User` | `INVALID_CREDENTIALS`, `ACCOUNT_SUSPENDED` |
| **43** | Auth Core | Refresh Access Token | ALL | `/api/v1/auth/refresh` | `POST` | `{ refreshToken: string }` | `{ accessToken: string, refreshToken: string }` | Public (Refresh Token) | `User`, `RefreshToken` | `INVALID_REFRESH_TOKEN`, `TOKEN_REVOKED` |
| **44** | Auth Core | Get Current User Context | ALL | `/api/v1/auth/me` | `GET` | *None* | `{ user: UserProfile }` | JWT (Any authenticated user) | `User` | `AUTH_REQUIRED` |
| **45** | Auth Core | Logout & Invalidate Session | ALL | `/api/v1/auth/logout` | `POST` | *None* | `{ loggedOut: true }` | JWT | `RefreshToken`, `AuditLog` | *None* |

---

## 3. Detailed Data Models & Relational Architecture (PostgreSQL + Prisma)

### Primary Database Schemas:
1. **User & Auth**: `User`, `Role` (`PATIENT`, `DOCTOR`, `STAFF`, `ADMIN`), `RefreshToken`
2. **Clinical Organization**: `Hospital`, `Department` (`general`, `cardiology`, `orthopedics`, `ayush`, `pediatrics`, `ent`), `KioskTerminal`
3. **Patient Journey**: `Patient`, `PatientSession` (`CREATED`, `CONSENT_PENDING`, `INTERVIEW`, `DOCUMENTS`, `REVIEW`, `COMPLETED`, `ABANDONED`)
4. **Consent & ABDM**: `Consent` (version, granular flags: AI intake, doctor share, ABDM link, status: `ACTIVE`, `REVOKED`), `AbhaLink`
5. **Clinical Intake**: `ClinicalInterview`, `InterviewQuestion`, `InterviewAnswer` (supports single choice, scale, multi, text, voice transcript + confidence)
6. **Clinical History**: `ClinicalHistory` (CC, HPI, PMH, PSH, Meds, Allergies, Family, Personal, ROS), `AyushAssessment` (Dashavidha Pariksha: Prakriti, Agni, Satva, Bala, etc.)
7. **Document Intelligence**: `Document` (`prescription`, `lab_report`, `discharge_summary`, `imaging`), `OCRResult`, `MedicalEntity` (medication, diagnosis, investigation, date, doctor with confidence and bounding boxes), `EntityCorrection`
8. **Clinical Triage & Red Flags**: `RedFlag` (symptoms, severity, triggeredAt, staffPagingStatus), `TriageAlert`
9. **Clinical Summary & Revision Governance**: `ClinicalSummary`, `SummaryRevision` (v1: AI Generated, v2: Doctor Edited, v3: Approved)
10. **Consultation**: `Consultation` (provisional diagnosis, ICD-10 code, doctor notes, follow-up, ABDM push status), `Prescription` (medicine, dosage, timing, duration, instructions)
11. **Timeline**: `MedicalTimelineEvent` (chronological events linking hospitalizations, diagnoses, lab results, prescriptions)
12. **Audit & Notifications**: `AuditLog` (actor, role, action, resource, timestamp, IP, status), `Notification` (urgent alerts, queue updates)

---

## 4. AI Orchestration, Red-Flag Engine & Adaptability Rules

### AI Module Pipeline:
```
Patient Response (Voice / Touch)
        │
        ▼
Answer Normalization (Language agnostic standardizer)
        │
        ▼
Clinical Entity Extraction (NER for pain, symptoms, durations, vitals)
        │
        ├────────────────────────────────────────┐
        ▼                                        ▼
Clinical Deterministic Rules             Adaptive AI Orchestrator (Zod Validated)
(e.g., Substernal crushing pain +       (Selects contextual follow-ups based on
 diaphoresis = STAT Cardiac ACS Flag)    specialty, age, gender, prior conditions)
        │                                        │
        ▼                                        ▼
Immediate Red-Flag Dispatch Alert        Next Question JSON Schema
(WebSocket broadcast to Staff Desk)     (Presented in patient's active language)
```

### Healthcare Safety Principles:
- All AI-generated text is explicitly watermarked: *"AI-Generated Clinical Triage - Requires Physician Evaluation & Sign-off"*.
- AI output never autonomously issues medical diagnoses or updates clinical databases without doctor review.
- High-risk medical emergencies trigger deterministic rules immediately, without relying solely on non-deterministic LLM prompts.

---

## 5. Security, HIPAA & ABDM DPDP 2023 Compliance

1. **Patient Isolation**: Patients can only query and modify their own active session and records derived from authenticated token claims; path tampering (e.g. `/api/v1/patients/:id`) returns `403 FORBIDDEN`.
2. **Doctor Scoping**: Doctors can only access patient records assigned to their active OPD shift or consultation room.
3. **ABDM DPDP Compliance**: Consent is checked at the middleware level before reading or processing any clinical document or OCR text.
4. **Audit Logging**: Every access to patient health data, OCR correction, or consultation generation generates an immutable audit record with actor identity and timestamp.
5. **No Medical Content in Application Logs**: Sensitive PHI (Protected Health Information) is never serialized to standard console or Pino logs.
