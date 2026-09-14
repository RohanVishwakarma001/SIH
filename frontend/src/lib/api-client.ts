/**
 * MediKiosk Production API Client
 * Centralized HTTP client for MediKiosk React frontend connecting to Fastify backend (/api/v1).
 * Handles token injection, request ID tracing, standardized error mapping, and fallback resilience.
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  requestId?: string;
  timestamp?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export class ApiError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly requestId?: string;
  public readonly details?: any;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR', requestId?: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.requestId = requestId;
    this.details = details;
  }
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1').replace(/\/+$/, '');
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('medikiosk_token');
    }
  }

  public setToken(token: string | null, role?: string, patientId?: string, userName?: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('medikiosk_token', token);
        if (role) localStorage.setItem('medikiosk_role', role);
        if (patientId) localStorage.setItem('medikiosk_patient_id', patientId);
        if (userName) localStorage.setItem('medikiosk_user_name', userName);
      } else {
        localStorage.removeItem('medikiosk_token');
        localStorage.removeItem('medikiosk_role');
        localStorage.removeItem('medikiosk_patient_id');
        localStorage.removeItem('medikiosk_user_name');
      }
    }
  }

  public getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('medikiosk_token');
    }
    return this.token;
  }

  public getUserName(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('medikiosk_user_name');
  }

  public clearSession() {
    this.setToken(null);
  }

  private generateRequestId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'req-' + Math.random().toString(36).substring(2, 9);
  }

  private mapErrorMessage(statusCode: number, serverMsg?: string): string {
    if (serverMsg) return serverMsg;
    switch (statusCode) {
      case 401:
        return 'Your session has expired. Please verify credentials again.';
      case 403:
        return 'You do not have permission to access this clinical resource.';
      case 404:
        return 'The requested patient or clinical record was not found.';
      case 422:
      case 400:
        return 'Please review the entered information for invalid entries.';
      case 429:
        return 'High OPD kiosk traffic. Please wait a moment before trying again.';
      case 500:
      default:
        return 'Clinical core server temporarily unavailable. Switching to safe offline mode.';
    }
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const requestId = this.generateRequestId();

    const headers: Record<string, string> = {
      'x-request-id': requestId,
      ...(options.headers as Record<string, string>),
    };

    // Auto-inject JWT token if available
    const token = this.getToken();
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Default JSON content-type if not multipart/form-data
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const contentType = response.headers.get('content-type');
      let body: any = null;
      if (contentType && contentType.includes('application/json')) {
        body = await response.json();
      } else {
        body = { success: response.ok, data: await response.text() };
      }

      if (!response.ok || body?.success === false) {
        const errorData = body?.error || {};
        const friendlyMessage = this.mapErrorMessage(response.status, errorData.message);
        throw new ApiError(
          friendlyMessage,
          response.status,
          errorData.code || `HTTP_${response.status}`,
          body?.requestId || requestId,
          errorData.details
        );
      }

      return (body?.data !== undefined ? body.data : body) as T;
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      // Network interruption / backend offline
      console.warn(`[MediKiosk API Client] Request to ${endpoint} unreachable (${err.message}). Safe fallback engaged.`);
      throw new ApiError(
        'Unable to connect to MediKiosk server. Safe fallback active.',
        0,
        'NETWORK_ERROR',
        requestId
      );
    }
  }

  public get<T>(endpoint: string, params?: Record<string, any>, options?: RequestInit): Promise<T> {
    let url = endpoint;
    if (params) {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
      const qs = query.toString();
      if (qs) url += (url.includes('?') ? '&' : '?') + qs;
    }
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  public post<T>(endpoint: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body || {}),
    });
  }

  public patch<T>(endpoint: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body || {}),
    });
  }

  public put<T>(endpoint: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body || {}),
    });
  }

  public delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  public upload<T>(endpoint: string, formData: FormData, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
    });
  }
}

export const apiClient = new ApiClient();
