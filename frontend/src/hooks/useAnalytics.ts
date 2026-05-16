import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

/** Matches the actual shape returned by GET /api/v1/analytics/dashboard */
export interface DashboardData {
  totalVisits: number;
  uniqueSessions: number;
  totalClients: number;
  totalOrders: number;
  totalRequests: number;
  totalPurchases: number;
  totalTestimonials: number;
  ordersPending: number;
  ordersProcessing: number;
  ordersCompleted: number;
  ordersCancelled: number;
  conversionRate: number;
  avgOrderValue: number;
  totalRevenue: number;
  formsSubmitted: number;
  requestsFiled: number;
  chatbotInteractions: number;
  whatsappMessages: number;
  avgChatbotResponseTimeMs: number;
  otpTotal: number;
  otpSuccessful: number;
  otpSuccessRate: number;
  newClientsLast30Days: number;
  returningClients: number;
  pageVisitsCount: number;
  recentEvents: number;
  topPages: Array<{ page: string; count: number }>;
  trafficBySource: Record<string, number>;
  deviceBreakdown: Record<string, number>;
  conversionFunnel: {
    visits: number;
    interactions: number;
    formsSubmitted: number;
    ordersCreated: number;
    ordersDelivered: number;
  };
}

export interface MetricSeries {
  label: string;
  data: { date: string; value: number }[];
}

interface AnalyticsParams {
  startDate?: string;
  endDate?: string;
  channel?: string;
  status?: string;
}

export function useDashboardData(params?: AnalyticsParams) {
  const queryParams: Record<string, string> = {};
  if (params?.startDate) queryParams.startDate = params.startDate;
  if (params?.endDate) queryParams.endDate = params.endDate;
  if (params?.channel) queryParams.channel = params.channel;
  if (params?.status) queryParams.status = params.status;

  return useQuery({
    queryKey: ['analytics', 'dashboard', params],
    queryFn: () => apiClient.get<DashboardData>('/analytics/dashboard', queryParams),
    refetchInterval: 60_000,
  });
}

export function useMetrics(metric: string, params?: AnalyticsParams) {
  const queryParams: Record<string, string> = {};
  if (params?.startDate) queryParams.startDate = params.startDate;
  if (params?.endDate) queryParams.endDate = params.endDate;

  return useQuery({
    queryKey: ['analytics', 'metrics', metric, params],
    queryFn: () => apiClient.get<MetricSeries[]>(`/analytics/metrics/${metric}`, queryParams),
  });
}

export function useTopPages(params?: AnalyticsParams) {
  const queryParams: Record<string, string> = {};
  if (params?.startDate) queryParams.startDate = params.startDate;
  if (params?.endDate) queryParams.endDate = params.endDate;

  return useQuery({
    queryKey: ['analytics', 'top-pages', params],
    queryFn: () => apiClient.get<{ page: string; visits: number }[]>('/analytics/top-pages', queryParams),
  });
}

export function useConversionFunnel(params?: AnalyticsParams) {
  const queryParams: Record<string, string> = {};
  if (params?.startDate) queryParams.startDate = params.startDate;
  if (params?.endDate) queryParams.endDate = params.endDate;

  return useQuery({
    queryKey: ['analytics', 'funnel', params],
    queryFn: () => apiClient.get<{ step: string; count: number }[]>('/analytics/funnel', queryParams),
  });
}

export function useTrackEvent() {
  return useMutation({
    mutationFn: (event: { type: string; page: string; metadata?: Record<string, unknown> }) =>
      apiClient.post('/analytics/events', event),
  });
}
