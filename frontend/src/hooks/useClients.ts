import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface Client {
  id: string;
  documentType: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientDetail extends Client {
  addresses: unknown[];
  emails: unknown[];
  phones: unknown[];
  documents: unknown[];
  orders: unknown[];
  requests: unknown[];
  profile: unknown;
}

interface ClientsParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export function useClients(params?: ClientsParams) {
  const queryParams: Record<string, string> = {};
  if (params?.page) queryParams.page = String(params.page);
  if (params?.pageSize) queryParams.pageSize = String(params.pageSize);
  if (params?.search) queryParams.search = params.search;

  return useQuery({
    queryKey: ['clients', params],
    queryFn: () => apiClient.get<Client[]>('/clients', queryParams),
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => apiClient.get<ClientDetail>(`/clients/${id}`),
    enabled: !!id,
  });
}

export function useClientByDocument(type: string, number: string) {
  return useQuery({
    queryKey: ['clients', 'document', type, number],
    queryFn: () => apiClient.get<ClientDetail>(`/clients/document/${type}/${number}`),
    enabled: !!type && !!number,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Client>) => apiClient.post<Client>('/clients', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Client> }) =>
      apiClient.put<Client>(`/clients/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/clients/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}
