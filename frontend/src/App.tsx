import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { KioskProvider } from './context/KioskContext';
import { DoctorProvider } from './context/DoctorContext';

// Patient Kiosk Pages
import { PatientLayout } from './pages/patient/PatientLayout';
import { KioskWelcome } from './pages/patient/KioskWelcome';
import { KioskLanguage } from './pages/patient/KioskLanguage';
import { KioskAuth } from './pages/patient/KioskAuth';
import { KioskConsent } from './pages/patient/KioskConsent';
import { KioskHome } from './pages/patient/KioskHome';
import { KioskInterview } from './pages/patient/KioskInterview';
import { KioskRedFlag } from './pages/patient/KioskRedFlag';
import { KioskDocuments } from './pages/patient/KioskDocuments';
import { KioskOCRProcessing } from './pages/patient/KioskOCRProcessing';
import { KioskDocumentReview } from './pages/patient/KioskDocumentReview';
import { KioskTimeline } from './pages/patient/KioskTimeline';
import { KioskSummary } from './pages/patient/KioskSummary';
import { KioskCompletion } from './pages/patient/KioskCompletion';

// Doctor Clinical Workstation Pages
import { DoctorLayout } from './pages/doctor/DoctorLayout';
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { DoctorPatientView } from './pages/doctor/DoctorPatientView';
import { DoctorDocumentViewer } from './pages/doctor/DoctorDocumentViewer';
import { DoctorConsultation } from './pages/doctor/DoctorConsultation';

// Staff & Admin
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';

// Clinical Staff Auth
import { LoginPage } from './pages/auth/LoginPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

export function App() {
  return (
    <AccessibilityProvider>
      <KioskProvider>
        <DoctorProvider>
          <BrowserRouter>
            <div className="relative min-h-screen bg-background text-med-text-primary">
              <Routes>
                {/* Default route */}
                <Route path="/" element={<Navigate to="/patient/welcome" replace />} />

                {/* Patient Kiosk Flow */}
                <Route path="/patient" element={<PatientLayout />}>
                  <Route index element={<Navigate to="/patient/welcome" replace />} />
                  <Route path="welcome" element={<KioskWelcome />} />
                  <Route path="language" element={<KioskLanguage />} />
                  <Route path="login" element={<KioskAuth />} />
                  <Route path="consent" element={<KioskConsent />} />
                  <Route path="home" element={<KioskHome />} />
                  <Route path="interview" element={<KioskInterview />} />
                  <Route path="red-flag" element={<KioskRedFlag />} />
                  <Route path="documents" element={<KioskDocuments />} />
                  <Route path="ocr-processing" element={<KioskOCRProcessing />} />
                  <Route path="doc-review" element={<KioskDocumentReview />} />
                  <Route path="timeline" element={<KioskTimeline />} />
                  <Route path="summary" element={<KioskSummary />} />
                  <Route path="completion" element={<KioskCompletion />} />
                </Route>

                {/* Clinical Staff Sign In */}
                <Route path="/login" element={<LoginPage />} />

                {/* Doctor Clinical Workstation Flow */}
                <Route
                  path="/doctor"
                  element={
                    <ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN']}>
                      <DoctorLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/doctor/dashboard" replace />} />
                  <Route path="dashboard" element={<DoctorDashboard />} />
                  <Route path="patient/:id" element={<DoctorPatientView />} />
                  <Route path="documents" element={<DoctorDocumentViewer />} />
                  <Route path="consultation" element={<DoctorConsultation />} />
                </Route>

                {/* Staff Desk */}
                <Route
                  path="/staff"
                  element={
                    <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
                      <StaffDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Enterprise Dashboard */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all fallback */}
                <Route path="*" element={<Navigate to="/patient/welcome" replace />} />
              </Routes>
            </div>
          </BrowserRouter>
        </DoctorProvider>
      </KioskProvider>
    </AccessibilityProvider>
  );
}

export default App;
