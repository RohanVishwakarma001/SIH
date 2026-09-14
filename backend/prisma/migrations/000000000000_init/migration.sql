-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PATIENT', 'DOCTOR', 'STAFF', 'ADMIN');

-- CreateEnum
CREATE TYPE "PriorityLevel" AS ENUM ('NORMAL', 'ATTENTION', 'URGENT');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('CREATED', 'CONSENT_PENDING', 'INTERVIEW', 'DOCUMENTS', 'REVIEW', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "ConsentStatus" AS ENUM ('ACTIVE', 'REVOKED');

-- CreateEnum
CREATE TYPE "HistoryStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'READY_FOR_REVIEW', 'VERIFIED');

-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('WAITING', 'IN_KIOSK', 'READY', 'WITH_DOCTOR', 'COMPLETED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('PRESCRIPTION', 'LAB_REPORT', 'DISCHARGE_SUMMARY', 'IMAGING', 'OTHER');

-- CreateEnum
CREATE TYPE "OcrStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "EntityCategory" AS ENUM ('DIAGNOSIS', 'MEDICATION', 'INVESTIGATION', 'DATE', 'DOCTOR');

-- CreateEnum
CREATE TYPE "SummaryStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EDITED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'STAFF',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hospital" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nativeName" TEXT,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'Stethoscope',
    "avgWaitMins" INTEGER NOT NULL DEFAULT 12,
    "hospitalId" TEXT,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KioskTerminal" (
    "id" TEXT NOT NULL,
    "terminalCode" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Ready',
    "ipAddress" TEXT,
    "activeLanguage" TEXT NOT NULL DEFAULT 'hi',
    "currentPatientToken" TEXT,
    "hospitalId" TEXT,

    CONSTRAINT "KioskTerminal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "roomNo" TEXT NOT NULL DEFAULT 'Room 04',
    "name" TEXT NOT NULL,
    "nameHindi" TEXT,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "abhaId" TEXT,
    "abhaAddress" TEXT,
    "abhaVerified" BOOLEAN NOT NULL DEFAULT false,
    "priority" "PriorityLevel" NOT NULL DEFAULT 'NORMAL',
    "queueStatus" "QueueStatus" NOT NULL DEFAULT 'WAITING',
    "historyStatus" "HistoryStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "waitTimeMinutes" INTEGER NOT NULL DEFAULT 10,
    "checkedInTime" TEXT NOT NULL,
    "chiefComplaintShort" TEXT NOT NULL,
    "bp" TEXT NOT NULL DEFAULT '120/80',
    "heartRate" INTEGER NOT NULL DEFAULT 72,
    "spo2" INTEGER NOT NULL DEFAULT 98,
    "temperature" TEXT NOT NULL DEFAULT '98.6 °F',
    "bmi" DOUBLE PRECISION NOT NULL DEFAULT 22.5,
    "bloodSugar" INTEGER,
    "departmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientSession" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "patientId" TEXT,
    "kioskTerminalId" TEXT,
    "departmentId" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'hi',
    "status" "SessionStatus" NOT NULL DEFAULT 'CREATED',
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "estimatedWaitMins" INTEGER NOT NULL DEFAULT 8,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "PatientSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consent" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "consentAi" BOOLEAN NOT NULL DEFAULT true,
    "consentDoctorShare" BOOLEAN NOT NULL DEFAULT true,
    "consentAbha" BOOLEAN NOT NULL DEFAULT true,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "status" "ConsentStatus" NOT NULL DEFAULT 'ACTIVE',
    "revokedAt" TIMESTAMP(3),
    "revokeReason" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Consent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalInterview" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "totalSteps" INTEGER NOT NULL DEFAULT 7,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "redFlagDetected" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ClinicalInterview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewQuestion" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "questionCode" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "inputType" TEXT NOT NULL,
    "isAyush" BOOLEAN NOT NULL DEFAULT false,
    "ayushDimension" TEXT,

    CONSTRAINT "InterviewQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewAnswer" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answerType" TEXT NOT NULL,
    "selectedOptions" JSONB,
    "scaleValue" INTEGER,
    "textValue" TEXT,
    "rawVoiceTranscript" TEXT,
    "confidence" DOUBLE PRECISION,
    "isRedFlagTriggered" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalHistory" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "interviewId" TEXT,
    "chiefComplaintPrimary" TEXT NOT NULL,
    "onset" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "severityScore" INTEGER NOT NULL DEFAULT 5,
    "location" TEXT NOT NULL,
    "aggravatingFactors" JSONB,
    "relievingFactors" JSONB,
    "hpiNarrative" TEXT NOT NULL,
    "pastMedicalHistory" JSONB,
    "pastSurgicalHistory" JSONB,
    "drugHistory" JSONB,
    "allergyHistory" JSONB,
    "familyHistory" JSONB,
    "personalHistory" JSONB,
    "reviewOfSystems" JSONB,
    "previousInvestigations" JSONB,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicalHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AyushAssessment" (
    "id" TEXT NOT NULL,
    "clinicalHistoryId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "prakritiVata" INTEGER NOT NULL DEFAULT 40,
    "prakritiPitta" INTEGER NOT NULL DEFAULT 35,
    "prakritiKapha" INTEGER NOT NULL DEFAULT 25,
    "primaryDosha" TEXT NOT NULL DEFAULT 'Vata-Pitta',
    "vikriti" TEXT NOT NULL,
    "sara" TEXT NOT NULL DEFAULT 'Madhyama',
    "samhanana" TEXT NOT NULL DEFAULT 'Madhyama',
    "pramana" TEXT NOT NULL DEFAULT 'Prakrita',
    "satmya" TEXT NOT NULL DEFAULT 'Satmya',
    "satva" TEXT NOT NULL DEFAULT 'Madhyama',
    "aharaShaktiAbhyavaharana" TEXT NOT NULL,
    "aharaShaktiJarana" TEXT NOT NULL,
    "vyayamaShakti" TEXT NOT NULL DEFAULT 'Madhyama',
    "vaya" TEXT NOT NULL DEFAULT 'Madhyama',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AyushAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL DEFAULT 'PRESCRIPTION',
    "fileUrl" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "facility" TEXT,
    "doctorName" TEXT,
    "date" TEXT,
    "ocrStatus" "OcrStatus" NOT NULL DEFAULT 'PENDING',
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "rawOcrText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OCRResult" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "rawText" TEXT NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL,
    "processingTimeMs" INTEGER NOT NULL DEFAULT 1500,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OCRResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalEntity" (
    "id" TEXT NOT NULL,
    "ocrResultId" TEXT,
    "documentId" TEXT NOT NULL,
    "category" "EntityCategory" NOT NULL,
    "value" TEXT NOT NULL,
    "standardizedName" TEXT,
    "dosage" TEXT,
    "frequency" TEXT,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 95.0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "boundingBox" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MedicalEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityCorrection" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "previousValue" TEXT NOT NULL,
    "correctedValue" TEXT NOT NULL,
    "correctedByUserId" TEXT,
    "correctedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EntityCorrection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalTimelineEvent" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "yearMonth" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "facility" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "badgeText" TEXT NOT NULL,
    "isImportant" BOOLEAN NOT NULL DEFAULT false,
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MedicalTimelineEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RedFlag" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "sessionId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "symptoms" JSONB NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'CRITICAL',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "staffPagingStatus" TEXT NOT NULL DEFAULT 'DISPATCHED',
    "staffPagedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RedFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TriageAlert" (
    "id" TEXT NOT NULL,
    "redFlagId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "kioskTerminalId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "acknowledgedByUserId" TEXT,
    "acknowledgedAt" TIMESTAMP(3),
    "nurseDispatchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TriageAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalSummary" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "interviewId" TEXT,
    "conciseSummary" TEXT NOT NULL,
    "keyPositiveFindings" JSONB NOT NULL,
    "pertinentNegatives" JSONB NOT NULL,
    "redFlagAlerts" JSONB NOT NULL,
    "differentialDiagnoses" JSONB NOT NULL,
    "recommendedInvestigations" JSONB NOT NULL,
    "status" "SummaryStatus" NOT NULL DEFAULT 'PENDING',
    "currentRevisionNumber" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicalSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SummaryRevision" (
    "id" TEXT NOT NULL,
    "clinicalSummaryId" TEXT NOT NULL,
    "revisionNumber" INTEGER NOT NULL,
    "summaryText" TEXT NOT NULL,
    "modifiedByUserId" TEXT,
    "action" TEXT NOT NULL DEFAULT 'GENERATED',
    "remarks" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SummaryRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consultation" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "provisionalDiagnosis" TEXT NOT NULL,
    "icdCode" TEXT NOT NULL,
    "clinicalNotes" TEXT NOT NULL,
    "orderedInvestigations" JSONB,
    "followUpDays" INTEGER NOT NULL DEFAULT 7,
    "isPushedToAbha" BOOLEAN NOT NULL DEFAULT false,
    "abhaBundleId" TEXT,
    "savedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prescription" (
    "id" TEXT NOT NULL,
    "consultationId" TEXT NOT NULL,
    "medicine" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorNote" (
    "id" TEXT NOT NULL,
    "consultationId" TEXT NOT NULL,
    "noteText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DoctorNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "recipientRole" "UserRole",
    "recipientUserId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "actorName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "details" TEXT NOT NULL,
    "ipAddress" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SUCCESS',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "RefreshToken_token_idx" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_code_key" ON "Hospital"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Department_code_key" ON "Department"("code");

-- CreateIndex
CREATE INDEX "Department_code_idx" ON "Department"("code");

-- CreateIndex
CREATE UNIQUE INDEX "KioskTerminal_terminalCode_key" ON "KioskTerminal"("terminalCode");

-- CreateIndex
CREATE INDEX "KioskTerminal_terminalCode_idx" ON "KioskTerminal"("terminalCode");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_token_key" ON "Patient"("token");

-- CreateIndex
CREATE INDEX "Patient_token_idx" ON "Patient"("token");

-- CreateIndex
CREATE INDEX "Patient_phone_idx" ON "Patient"("phone");

-- CreateIndex
CREATE INDEX "Patient_abhaId_idx" ON "Patient"("abhaId");

-- CreateIndex
CREATE INDEX "Patient_priority_idx" ON "Patient"("priority");

-- CreateIndex
CREATE INDEX "Patient_queueStatus_idx" ON "Patient"("queueStatus");

-- CreateIndex
CREATE UNIQUE INDEX "PatientSession_sessionId_key" ON "PatientSession"("sessionId");

-- CreateIndex
CREATE INDEX "PatientSession_sessionId_idx" ON "PatientSession"("sessionId");

-- CreateIndex
CREATE INDEX "PatientSession_patientId_idx" ON "PatientSession"("patientId");

-- CreateIndex
CREATE INDEX "PatientSession_status_idx" ON "PatientSession"("status");

-- CreateIndex
CREATE INDEX "Consent_patientId_idx" ON "Consent"("patientId");

-- CreateIndex
CREATE INDEX "Consent_sessionId_idx" ON "Consent"("sessionId");

-- CreateIndex
CREATE INDEX "ClinicalInterview_patientId_idx" ON "ClinicalInterview"("patientId");

-- CreateIndex
CREATE INDEX "ClinicalInterview_sessionId_idx" ON "ClinicalInterview"("sessionId");

-- CreateIndex
CREATE INDEX "InterviewQuestion_interviewId_idx" ON "InterviewQuestion"("interviewId");

-- CreateIndex
CREATE INDEX "InterviewQuestion_questionCode_idx" ON "InterviewQuestion"("questionCode");

-- CreateIndex
CREATE INDEX "InterviewAnswer_interviewId_idx" ON "InterviewAnswer"("interviewId");

-- CreateIndex
CREATE INDEX "InterviewAnswer_questionId_idx" ON "InterviewAnswer"("questionId");

-- CreateIndex
CREATE INDEX "ClinicalHistory_patientId_idx" ON "ClinicalHistory"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "AyushAssessment_clinicalHistoryId_key" ON "AyushAssessment"("clinicalHistoryId");

-- CreateIndex
CREATE INDEX "AyushAssessment_patientId_idx" ON "AyushAssessment"("patientId");

-- CreateIndex
CREATE INDEX "Document_patientId_idx" ON "Document"("patientId");

-- CreateIndex
CREATE INDEX "Document_documentType_idx" ON "Document"("documentType");

-- CreateIndex
CREATE INDEX "Document_ocrStatus_idx" ON "Document"("ocrStatus");

-- CreateIndex
CREATE INDEX "OCRResult_documentId_idx" ON "OCRResult"("documentId");

-- CreateIndex
CREATE INDEX "MedicalEntity_documentId_idx" ON "MedicalEntity"("documentId");

-- CreateIndex
CREATE INDEX "MedicalEntity_category_idx" ON "MedicalEntity"("category");

-- CreateIndex
CREATE INDEX "EntityCorrection_entityId_idx" ON "EntityCorrection"("entityId");

-- CreateIndex
CREATE INDEX "MedicalTimelineEvent_patientId_idx" ON "MedicalTimelineEvent"("patientId");

-- CreateIndex
CREATE INDEX "MedicalTimelineEvent_yearMonth_idx" ON "MedicalTimelineEvent"("yearMonth");

-- CreateIndex
CREATE INDEX "RedFlag_patientId_idx" ON "RedFlag"("patientId");

-- CreateIndex
CREATE INDEX "RedFlag_status_idx" ON "RedFlag"("status");

-- CreateIndex
CREATE INDEX "TriageAlert_redFlagId_idx" ON "TriageAlert"("redFlagId");

-- CreateIndex
CREATE INDEX "TriageAlert_patientId_idx" ON "TriageAlert"("patientId");

-- CreateIndex
CREATE INDEX "ClinicalSummary_patientId_idx" ON "ClinicalSummary"("patientId");

-- CreateIndex
CREATE INDEX "ClinicalSummary_status_idx" ON "ClinicalSummary"("status");

-- CreateIndex
CREATE INDEX "SummaryRevision_clinicalSummaryId_idx" ON "SummaryRevision"("clinicalSummaryId");

-- CreateIndex
CREATE INDEX "Consultation_patientId_idx" ON "Consultation"("patientId");

-- CreateIndex
CREATE INDEX "Consultation_doctorId_idx" ON "Consultation"("doctorId");

-- CreateIndex
CREATE INDEX "Prescription_consultationId_idx" ON "Prescription"("consultationId");

-- CreateIndex
CREATE INDEX "Notification_recipientRole_idx" ON "Notification"("recipientRole");

-- CreateIndex
CREATE INDEX "Notification_recipientUserId_idx" ON "Notification"("recipientUserId");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_resource_idx" ON "AuditLog"("resource");

-- CreateIndex
CREATE INDEX "AuditLog_timestamp_idx" ON "AuditLog"("timestamp");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KioskTerminal" ADD CONSTRAINT "KioskTerminal_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientSession" ADD CONSTRAINT "PatientSession_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientSession" ADD CONSTRAINT "PatientSession_kioskTerminalId_fkey" FOREIGN KEY ("kioskTerminalId") REFERENCES "KioskTerminal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientSession" ADD CONSTRAINT "PatientSession_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consent" ADD CONSTRAINT "Consent_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consent" ADD CONSTRAINT "Consent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PatientSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalInterview" ADD CONSTRAINT "ClinicalInterview_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalInterview" ADD CONSTRAINT "ClinicalInterview_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PatientSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewQuestion" ADD CONSTRAINT "InterviewQuestion_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "ClinicalInterview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewAnswer" ADD CONSTRAINT "InterviewAnswer_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "ClinicalInterview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewAnswer" ADD CONSTRAINT "InterviewAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "InterviewQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalHistory" ADD CONSTRAINT "ClinicalHistory_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalHistory" ADD CONSTRAINT "ClinicalHistory_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "ClinicalInterview"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AyushAssessment" ADD CONSTRAINT "AyushAssessment_clinicalHistoryId_fkey" FOREIGN KEY ("clinicalHistoryId") REFERENCES "ClinicalHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OCRResult" ADD CONSTRAINT "OCRResult_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalEntity" ADD CONSTRAINT "MedicalEntity_ocrResultId_fkey" FOREIGN KEY ("ocrResultId") REFERENCES "OCRResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalEntity" ADD CONSTRAINT "MedicalEntity_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityCorrection" ADD CONSTRAINT "EntityCorrection_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "MedicalEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityCorrection" ADD CONSTRAINT "EntityCorrection_correctedByUserId_fkey" FOREIGN KEY ("correctedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalTimelineEvent" ADD CONSTRAINT "MedicalTimelineEvent_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalTimelineEvent" ADD CONSTRAINT "MedicalTimelineEvent_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedFlag" ADD CONSTRAINT "RedFlag_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedFlag" ADD CONSTRAINT "RedFlag_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PatientSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TriageAlert" ADD CONSTRAINT "TriageAlert_redFlagId_fkey" FOREIGN KEY ("redFlagId") REFERENCES "RedFlag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TriageAlert" ADD CONSTRAINT "TriageAlert_kioskTerminalId_fkey" FOREIGN KEY ("kioskTerminalId") REFERENCES "KioskTerminal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TriageAlert" ADD CONSTRAINT "TriageAlert_acknowledgedByUserId_fkey" FOREIGN KEY ("acknowledgedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalSummary" ADD CONSTRAINT "ClinicalSummary_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalSummary" ADD CONSTRAINT "ClinicalSummary_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "ClinicalInterview"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SummaryRevision" ADD CONSTRAINT "SummaryRevision_clinicalSummaryId_fkey" FOREIGN KEY ("clinicalSummaryId") REFERENCES "ClinicalSummary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SummaryRevision" ADD CONSTRAINT "SummaryRevision_modifiedByUserId_fkey" FOREIGN KEY ("modifiedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorNote" ADD CONSTRAINT "DoctorNote_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

