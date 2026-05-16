import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface Order {
  id: string;
  clientId: string;
  status: string;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderDetail extends Order {
  items: unknown[];
  statusHistory: unknown[];
  client: unknown;
}

interface OrdersParams {
  page?: number;
  pageSize?: number;
  status?: string;
  clientId?: string;
}

export function useOrders(params?: OrdersParams) {
  const queryParams: Record<string, string> = {};
  if (params?.page) queryParams.page = String(params.page);
  if (params?.pageSize) queryParams.pageSize = String(params.pageSize);
  if (params?.status) queryParams.status = params.status;
  if (params?.clientId) queryParams.clientId = params.clientId;

  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => apiClient.get<Order[]>('/orders', queryParams),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => apiClient.get<OrderDetail>(`/orders/${id}`),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Order>) => apiClient.post<Order>('/orders', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, comment }: { id: string; status: string; comment?: string }) =>
      apiClient.put<Order>(`/orders/${id}/status`, { status, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
