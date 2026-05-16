import { useAuthStore } from '@/stores/auth.store';

const BASE_URL = '/api/v1';

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  errors?: ApiError[];
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  field?: string;
  message: string;
  code: string;
}

export class ApiClientError extends Error {
  status: number;
  errors: ApiError[];

  constructor(status: number, errors: ApiError[], message?: string) {
    super(message ?? errors[0]?.message ?? 'Error de API');
    this.name = 'ApiClientError';
    this.status = status;
    this.errors = errors;
  }
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const body: ApiResponse<T> = await response.json();

  if (!response.ok) {
    // Handle 401 — clear auth state
    if (response.status === 401) {
      const state = useAuthStore.getState();
      if (state.mode === 'client') {
        state.logoutClient();
      } else {
        state.logout();
      }
    }
    throw new ApiClientError(
      response.status,
      body.errors ?? [{ message: response.statusText, code: 'UNKNOWN_ERROR' }],
    );
  }

  return body;
}

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const state = useAuthStore.getState();
  const token = state.mode === 'client' ? state.clientToken : state.token;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

export const apiClient = {
  async get<T>(path: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const url = new URL(`${BASE_URL}${path}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
    }
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<T>(response);
  },

  async post<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: getHeaders(),
      body: body != null ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  async put<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: body != null ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  async patch<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: body != null ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  async delete<T>(path: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse<T>(response);
  },

  async upload<T>(path: string, formData: FormData): Promise<ApiResponse<T>> {
    const state = useAuthStore.getState();
    const token = state.mode === 'client' ? state.clientToken : state.token;
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // Don't set Content-Type — browser sets it with boundary for multipart
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return handleResponse<T>(response);
  },
};

export default apiClient;
