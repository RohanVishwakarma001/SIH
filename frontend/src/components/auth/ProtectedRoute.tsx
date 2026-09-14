import React from 'react';
import { Navigate } from 'react-router-dom';
import { apiClient } from '../../lib/api-client';

interface ProtectedRouteProps {
  allowedRoles: Array<'DOCTOR' | 'STAFF' | 'ADMIN'>;
  children: React.ReactNode;
}

/**
 * Gates clinical-staff routes behind a real authenticated session. Doctor/Staff/Admin
 * pages have no meaning without a signed-in user, so an anonymous or wrong-role visitor
 * is sent to the login page rather than shown an empty/broken dashboard.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const token = apiClient.getToken();
  const role = typeof window !== 'undefined' ? localStorage.getItem('medikiosk_role') : null;

  if (!token || !role || !allowedRoles.includes(role as any)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
