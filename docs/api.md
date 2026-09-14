# MediKiosk API Reference Specification

**Version**: `1.0.0` (`/api/v1`)  
**Base URL**: `http://localhost:4000/api/v1` (Production: `https://<render-slug>.onrender.com/api/v1`)  
**Interactive Swagger UI**: `/docs`  
**Health Check**: `/health`

---

## Response Envelope Standard

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "requestId": "5b47d259-6196-41f3-b692-aaa20a157dbd"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "AUTH_REQUIRED",
    "message": "Authentication required",
    "details": null
  },
  "requestId": "5b47d259-6196-41f3-b692-aaa20a157dbd"
}
```

---

## 1. Authentication & Kiosk Check-in (`/auth`)

### `POST /api/v1/auth/login`
- **Description**: Authenticates clinical and operational staff (Doctor, Nurse/Staff, Admin).
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "email": "doctor@medikiosk.aiims.edu",
    "password": "Password@123"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci...",
    "user": {
      "id": "usr_doc_01",
      "email": "doctor@medikiosk.aiims.edu",
      "role": "DOCTOR",
      "firstName": "Dr. K. S.",
      "lastName": "Venkatesh"
    }
  }
  ```

### `POST /api/v1/auth/refresh`
- **Description**: Refreshes expired access tokens using a 7-day sliding refresh token.
- **Request Body**:
  ```json
  { "refreshToken": "eyJhbGci..." }
  ```

### `POST /api/v1/auth/patient/abha-verify`
- **Description**: Verifies 14-digit ABHA ID via Aadhaar/Mobile OTP and links patient profile.
- **Request Body**:
  ```json
  {
    "abhaId": "91-4829-1029-4412",
    "otp": "123456",
    "sessionId": "sess_001"
  }
  ```
- **Response**: `200 OK` with patient demographic bundle, token number (`A-104`), and patient JWT.

### `POST /api/v1/auth/patient/mobile-verify`
- **Description**: Instant OTP login for high-volume OPD patients with mobile numbers.
- **Request Body**:
  ```json
  {
    "mobile": "9811243210",
    "otp": "1234"
  }
  ```

### `POST /api/v1/auth/patient/walkin`
- **Description**: Quick manual intake for elderly, unassisted, or emergency walk-ins.
- **Request Body**:
  ```json
  {
    "name": "Ramesh Patel",
    "age": 58,
    "gender": "Male",
    "mobile": "9811243210"
  }
  ```

### `GET /api/v1/auth/me`
- **Description**: Resolves current authenticated session user profile and permissions.
- **Auth**: Bearer token (Any role)

---

## 2. Patient Sessions (`/patient-sessions`)

### `POST /api/v1/patient-sessions`
- **Description**: Initiates a kiosk terminal intake journey.
- **Request Body**:
  ```json
  {
    "kioskId": "kiosk_01",
    "language": "hi",
    "department": "cardiology"
  }
  ```

### `GET /api/v1/patient-sessions/:id`
- **Description**: Fetches current session progress (`currentStep`, `department`, `status`).

### `PATCH /api/v1/patient-sessions/:id`
- **Description**: Updates progress step (`CONSENT` → `INTERVIEW` → `DOCUMENTS` → `SUMMARY`).

---

## 3. Consent Management (`/consents`)

### `POST /api/v1/consents`
- **Description**: Records ABDM & DPDP Act 2023 compliant explicit patient consent.
- **Request Body**:
  ```json
  {
    "patientId": "pat_001",
    "granted": true,
    "purpose": "AI Clinical History Taking & Triaging",
    "dataSharingAbdm": true,
    "language": "hi"
  }
  ```

### `GET /api/v1/consents/:patientId`
- **Description**: Checks patient consent status prior to clinical history generation.

### `POST /api/v1/consents/:id/revoke`
- **Description**: Revokes consent and restricts clinical data propagation.

---

## 4. AI Adaptive Clinical Interview (`/interviews`)

### `POST /api/v1/interviews`
- **Description**: Initializes an interview session or resumes existing questionnaire.
- **Request Body**:
  ```json
  {
    "patientId": "pat_001",
    "sessionId": "sess_001",
    "departmentId": "cardiology"
  }
  ```

### `POST /api/v1/interviews/:id/answer`
- **Description**: Submits answer (touch option, slider, or voice text), evaluates deterministic red-flag rules, and dynamically returns the next question.
- **Request Body**:
  ```json
  {
    "questionId": "q_chief_complaint",
    "answerType": "single_choice",
    "value": "chest_pain",
    "rawVoiceTranscript": "सीने में बहुत तेज दर्द हो रहा है और पसीना आ रहा है",
    "confidence": 0.96,
    "stepNumber": 1,
    "department": "cardiology"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "interviewId": "int_001",
    "redFlagAlert": {
      "isTriggered": true,
      "priority": "URGENT",
      "title": "ACUTE CORONARY SYNDROME SUSPICION"
    },
    "nextQuestion": {
      "code": "q_location",
      "stepNumber": 2,
      "questionText": "Where is the discomfort located? / दर्द शरीर के किस हिस्से में है?",
      "inputType": "single_choice",
      "options": [...]
    }
  }
  ```

### `POST /api/v1/interviews/voice/transcribe`
- **Description**: Speech-to-text transcription service supporting Hindi, Marathi, Tamil, English.

### `POST /api/v1/interviews/:id/complete`
- **Description**: Finalizes the clinical interview and queues async AI summary generation.

---

## 5. Documents & OCR Pipeline (`/documents` & `/ocr`)

### `POST /api/v1/documents/upload`
- **Description**: Multi-part document upload for prescriptions, lab reports, discharge summaries.
- **Request**: Multipart file (`image/jpeg`, `image/png`, `application/pdf`) up to 10MB.
- **Response**: Document metadata and async processing job identifier.

### `GET /api/v1/documents/patient/:patientId`
- **Description**: Lists all patient medical records and OCR status (`OCR_COMPLETE`).

### `GET /api/v1/ocr/documents/:id/entities`
- **Description**: Retrieves extracted clinical entities (HbA1c, BP, medications, dates, diagnoses).

### `PATCH /api/v1/ocr/entities/:id`
- **Description**: Allows doctor or staff to correct misread OCR values with full audit trail.
- **Request Body**:
  ```json
  {
    "correctedValue": "Metformin 500mg BD",
    "notes": "Corrected dosage per paper prescription stamp"
  }
  ```

---

## 6. Structured Clinical History (`/clinical-history`)

### `GET /api/v1/clinical-history/patient/:patientId`
- **Description**: Retrieves structured sections: Chief Complaint, HPI, PMH, Drug History, Allergies, Review of Systems.

### `PATCH /api/v1/clinical-history/:id`
- **Description**: Doctor edit of clinical history sections prior to final sign-off.

---

## 7. Medical Timeline (`/timeline`)

### `GET /api/v1/timeline/patient/:patientId`
- **Description**: Returns chronological timeline events (previous consults, lab tests, prescriptions, surgeries).

### `POST /api/v1/timeline/events`
- **Description**: Appends manual clinical timeline entry.

---

## 8. Deterministic Red Flags & Triage (`/red-flags`)

### `GET /api/v1/red-flags/patient/:patientId`
- **Description**: Fetches current active red flag alerts (ACS, Stroke, Severe Respiratory Failure, Intractable Pain).

### `POST /api/v1/red-flags/evaluate`
- **Description**: Evaluates arbitrary symptoms against clinical safety rules.

---

## 9. AI Clinical Summary (`/summaries`)

### `POST /api/v1/summaries/generate`
- **Description**: Orchestrates LLM summarization synthesizing interview answers, timeline, and OCR entities.
- **Request Body**:
  ```json
  {
    "patientId": "pat_001",
    "interviewId": "int_001",
    "isAyush": false
  }
  ```

### `GET /api/v1/summaries/patient/:patientId`
- **Description**: Fetches the latest clinical summary revision.

### `PATCH /api/v1/summaries/:id`
- **Description**: Doctor edits summary text and differential diagnosis list.

### `POST /api/v1/summaries/:id/approve`
- **Description**: Doctor signs and approves the clinical summary, transitioning status to `APPROVED`.

### `POST /api/v1/summaries/:id/reject`
- **Description**: Rejects summary and requests intake repeat.

---

## 10. Doctor Workspace (`/doctor`)

### `GET /api/v1/doctor/dashboard`
- **Description**: High-level clinic stats (patients waiting, urgent alerts, avg wait time).
- **Auth**: DOCTOR, ADMIN

### `GET /api/v1/doctor/queue`
- **Description**: Live patient queue with filter by priority (`urgent`, `attention`, `normal`), department, and text search.
- **Auth**: DOCTOR, ADMIN

### `GET /api/v1/doctor/patients/:patientId/workspace`
- **Description**: **Aggregated single-call endpoint** providing full clinical workspace (vitals, history, red flags, timeline, documents, and AI summary) in one fast response.
- **Auth**: DOCTOR, ADMIN

---

## 11. Consultations & Rx Suite (`/consultations`)

### `POST /api/v1/consultations`
- **Description**: Creates or finalizes physician consultation with digital Rx.
- **Request Body**:
  ```json
  {
    "patientId": "pat_001",
    "doctorId": "usr_doc_01",
    "primaryDiagnosis": "Acute Coronary Syndrome - NSTEMI",
    "clinicalNotes": "Immediate ECG performed. Aspirin 300mg + Clopidogrel 300mg given.",
    "prescriptions": [
      {
        "medicationName": "Aspirin",
        "dosage": "75mg",
        "frequency": "OD",
        "duration": "Ongoing",
        "instructions": "Post breakfast"
      }
    ],
    "followUpDate": "2026-09-21"
  }
  ```

### `POST /api/v1/consultations/:id/finalize`
- **Description**: Finalizes consultation and generates ABDM FHIR R4 Bundle.

---

## 12. AYUSH & Ayurveda Workflow (`/ayush`)

- Supported via:
  - `departmentId: "ayush"` in interview sessions
  - Dashavidha Pariksha questions: Prakriti, Vikriti, Sara, Samhanana, Pramana, Satmya, Satva, Ahara Shakti, Vyayama Shakti, Vaya
  - Dedicated AYUSH clinical summary structure with Ayurvedic differential diagnosis and Panchakarma / Deepana-Pachana recommendations.

---

## 13. Notifications & Real-Time Alerts (`/notifications`)

### `GET /api/v1/notifications`
- **Description**: Fetches in-app alerts (`URGENT_RED_FLAG`, `SUMMARY_READY`, `PATIENT_READY`).

### `POST /api/v1/notifications/:id/read`
- **Description**: Marks notification as read.

---

## 14. Staff Kiosk Monitoring (`/staff`)

### `GET /api/v1/staff/kiosks`
- **Description**: Real-time status of all OPD kiosks (`kiosk_01` to `kiosk_04`), paper roll levels, battery, and current active patient token.
- **Auth**: STAFF, ADMIN

### `GET /api/v1/staff/alerts`
- **Description**: Unacknowledged emergency red-flag alerts requiring nurse dispatch.
- **Auth**: STAFF, ADMIN

### `POST /api/v1/staff/alerts/:alertId/acknowledge`
- **Description**: Acknowledges alert and logs staff responder ID.

---

## 15. Admin Analytics & Audit Logging (`/admin`)

### `GET /api/v1/admin/analytics`
- **Description**: Real-time throughput metrics (intake completion rate, time saved vs traditional triage, OCR accuracy rate).
- **Auth**: ADMIN

### `GET /api/v1/admin/audit-logs`
- **Description**: Immutable security audit trail with actor ID, action, resource, IP, and timestamp.
- **Auth**: ADMIN

### `GET /api/v1/admin/consent-registry`
- **Description**: Compliance registry for ABDM DPDP consent audits.
- **Auth**: ADMIN
