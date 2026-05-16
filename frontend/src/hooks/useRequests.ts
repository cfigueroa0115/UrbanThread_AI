import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface RequestRecord {
  id: string;
  clientId: string;
  radicationNumber: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface RequestDetail extends RequestRecord {
  description?: string;
  statusHistory: unknown[];
  attachedFiles: unknown[];
  client: unknown;
}

interface RequestsParams {
  page?: number;
  pageSize?: number;
  status?: string;
  clientId?: string;
}

export function useRequests(params?: RequestsParams) {
  const queryParams: Record<string, string> = {};
  if (params?.page) queryParams.page = String(params.page);
  if (params?.pageSize) queryParams.pageSize = String(params.pageSize);
  if (params?.status) queryParams.status = params.status;
  if (params?.clientId) queryParams.clientId = params.clientId;

  return useQuery({
    queryKey: ['requests', params],
    queryFn: () => apiClient.get<RequestRecord[]>('/requests', queryParams),
  });
}

export function useRequest(id: string) {
  return useQuery({
    queryKey: ['requests', id],
    queryFn: () => apiClient.get<RequestDetail>(`/requests/${id}`),
    enabled: !!id,
  });
}

export function useRequestByRadication(radicationNumber: string) {
  return useQuery({
    queryKey: ['requests', 'radication', radicationNumber],
    queryFn: () => apiClient.get<RequestDetail>(`/requests/radication/${radicationNumber}`),
    enabled: !!radicationNumber,
  });
}

export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<RequestRecord>) => apiClient.post<RequestRecord>('/requests', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
}

export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, comment }: { id: string; status: string; comment?: string }) =>
      apiClient.put<RequestRecord>(`/requests/${id}/status`, { status, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
}
