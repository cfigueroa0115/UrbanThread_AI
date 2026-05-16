import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore, type AuthUser, type ClientSession } from '@/stores/auth.store';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roleId: string;
    isActive: boolean;
    role?: {
      id: string;
      name: string;
      description?: string | null;
      isSystem: boolean;
    };
  };
}

interface OTPRequestPayload {
  documentType: string;
  documentNumber: string;
}

interface OTPVerifyPayload {
  documentType: string;
  documentNumber: string;
  code: string;
}

interface OTPVerifyResponse {
  token: string;
  client: ClientSession;
  expiresIn?: number;
}

/* ---- Admin JWT auth ---- */

export function useLogin() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const res = await apiClient.post<LoginResponse>('/auth/admin/login', payload);
      return res.data!;
    },
    onSuccess: (data) => {
      const roleName = data.user.role?.name ?? 'unknown';
      // Map backend user to frontend AuthUser shape
      const authUser: AuthUser = {
        id: data.user.id,
        name: `${data.user.firstName} ${data.user.lastName}`,
        email: data.user.email,
        role: roleName,
        // Admin role gets all permissions; other roles get a subset
        permissions: roleName === 'admin'
          ? ['users:read', 'users:create', 'users:update', 'users:delete',
             'roles:read', 'roles:create', 'roles:update', 'roles:delete',
             'clients:read', 'clients:create', 'clients:update', 'clients:delete',
             'orders:read', 'orders:create', 'orders:update', 'orders:delete',
             'requests:read', 'requests:create', 'requests:update', 'requests:delete',
             'documents:read', 'documents:create', 'documents:update', 'documents:delete',
             'notifications:read', 'notifications:create', 'notifications:update', 'notifications:delete',
             'testimonials:read', 'testimonials:create', 'testimonials:update', 'testimonials:delete',
             'analytics:read', 'analytics:create', 'analytics:update', 'analytics:delete',
             'audit:read', 'audit:create', 'audit:update', 'audit:delete',
             'chatbot:read', 'chatbot:create', 'chatbot:update', 'chatbot:delete',
             'whatsapp:read', 'whatsapp:create', 'whatsapp:update', 'whatsapp:delete',
             'webhooks:read', 'webhooks:create', 'webhooks:update', 'webhooks:delete',
             'integrations:read', 'integrations:create', 'integrations:update', 'integrations:delete',
             'settings:read', 'settings:create', 'settings:update', 'settings:delete']
          : roleName === 'supervisor'
            ? ['clients:read', 'clients:create', 'clients:update',
               'orders:read', 'orders:create', 'orders:update',
               'requests:read', 'requests:create', 'requests:update',
               'documents:read', 'documents:create', 'documents:update',
               'notifications:read', 'notifications:create', 'notifications:update',
               'testimonials:read', 'testimonials:create', 'testimonials:update',
               'analytics:read',
               'chatbot:read',
               'whatsapp:read']
            : ['clients:read', 'orders:read', 'requests:read',
               'documents:read', 'notifications:read', 'analytics:read'],
      };
      login(data.token, authUser);
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const logoutClient = useAuthStore((s) => s.logoutClient);
  const mode = useAuthStore((s) => s.mode);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (mode === 'admin') {
        await apiClient.post('/auth/admin/logout');
      }
    },
    onSettled: () => {
      if (mode === 'client') {
        logoutClient();
      } else {
        logout();
      }
      queryClient.clear();
    },
  });
}

export function useRefreshToken() {
  const setToken = useAuthStore((s) => s.setToken);

  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.post<{ token: string }>('/auth/admin/refresh');
      return res.data!;
    },
    onSuccess: (data) => {
      setToken(data.token);
    },
  });
}

/* ---- Client OTP auth ---- */

export function useRequestOTP() {
  return useMutation({
    mutationFn: async (payload: OTPRequestPayload) => {
      const res = await apiClient.post<{ message: string; expiresIn: number }>('/auth/otp/request', payload);
      return res.data!;
    },
  });
}

export function useVerifyOTP() {
  const loginClient = useAuthStore((s) => s.loginClient);

  return useMutation({
    mutationFn: async (payload: OTPVerifyPayload) => {
      const res = await apiClient.post<OTPVerifyResponse>('/auth/otp/verify', payload);
      return res.data!;
    },
    onSuccess: (data) => {
      // Backend returns expiresIn in seconds, loginClient expects milliseconds
      const expiresInMs = data.expiresIn ? data.expiresIn * 1000 : undefined;
      loginClient(data.token, data.client, expiresInMs);
    },
  });
}

export function useResendOTP() {
  return useMutation({
    mutationFn: async (payload: OTPRequestPayload) => {
      const res = await apiClient.post<{ message: string; expiresIn: number }>('/auth/otp/resend', payload);
      return res.data!;
    },
  });
}

/* ---- Social auth (Google/Apple) lookup ---- */

export interface SocialLookupPayload {
  email: string;
  displayName?: string;
}

export interface SocialLookupResponse {
  found: boolean;
  otpSent?: boolean;
  message: string;
  email?: string;
  expiresIn?: number;
  maskedEmail?: string;
  client?: {
    id: string;
    firstName: string;
    lastName: string;
    documentType: string;
    documentNumber: string;
  };
  devCode?: string;
  devPreviewUrl?: string;
}

export function useSocialLookup() {
  return useMutation({
    mutationFn: async (payload: SocialLookupPayload) => {
      const res = await apiClient.post<SocialLookupResponse>('/auth/social/lookup', payload);
      return res.data!;
    },
  });
}
