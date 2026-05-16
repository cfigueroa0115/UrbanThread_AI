import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AuthMode = 'admin' | 'client' | null;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  avatar?: string;
}

export interface ClientSession {
  id: string;
  documentType: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  email?: string;
}

export interface AuthState {
  /* Shared */
  mode: AuthMode;
  isAuthenticated: boolean;

  /* Admin JWT auth */
  token: string | null;
  user: AuthUser | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  setToken: (token: string) => void;
  setUser: (user: AuthUser) => void;

  /* Client OTP auth */
  clientToken: string | null;
  client: ClientSession | null;
  clientSessionExpiry: number | null;
  loginClient: (token: string, client: ClientSession, expiresInMs?: number) => void;
  logoutClient: () => void;
  isClientSessionExpired: () => boolean;
}

const CLIENT_SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      /* Shared */
      mode: null,
      isAuthenticated: false,

      /* Admin JWT */
      token: null,
      user: null,

      login: (token, user) =>
        set({ token, user, isAuthenticated: true, mode: 'admin' }),

      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          mode: null,
        }),

      setToken: (token) =>
        set({ token, isAuthenticated: true }),

      setUser: (user) =>
        set({ user }),

      /* Client OTP */
      clientToken: null,
      client: null,
      clientSessionExpiry: null,

      loginClient: (token, client, expiresInMs = CLIENT_SESSION_DURATION) =>
        set({
          clientToken: token,
          client,
          clientSessionExpiry: Date.now() + expiresInMs,
          isAuthenticated: true,
          mode: 'client',
        }),

      logoutClient: () =>
        set({
          clientToken: null,
          client: null,
          clientSessionExpiry: null,
          isAuthenticated: false,
          mode: null,
        }),

      isClientSessionExpired: () => {
        const expiry = get().clientSessionExpiry;
        if (!expiry) return true;
        return Date.now() > expiry;
      },
    }),
    {
      name: 'ut-auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        mode: state.mode,
        clientToken: state.clientToken,
        client: state.client,
        clientSessionExpiry: state.clientSessionExpiry,
      }),
    },
  ),
);
