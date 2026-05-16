import { prisma } from '../lib/prisma.js';
import { analyticsRepository } from '../repositories/index.js';
import type { Prisma } from '@prisma/client';

// ── Types ────────────────────────────────────────────────────────────────────

export interface TrackEventInput {
  eventType: string;
  userId?: string | null;
  sessionId?: string | null;
  page?: string | null;
  element?: string | null;
  metadata?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  device?: string | null;
  source?: string | null;
}

export interface DashboardFilters {
  startDate?: Date;
  endDate?: Date;
}

export interface MetricsFilters {
  startDate?: Date;
  endDate?: Date;
  eventType?: string;
  device?: string;
  source?: string;
}

export interface DashboardData {
  // Core counts
  totalVisits: number;
  uniqueSessions: number;
  totalClients: number;
  totalOrders: number;
  totalRequests: number;
  totalPurchases: number;
  totalTestimonials: number;

  // Order breakdown by status
  ordersPending: number;
  ordersProcessing: number;
  ordersCompleted: number;
  ordersCancelled: number;

  // Conversion & engagement
  conversionRate: number;
  avgOrderValue: number;
  totalRevenue: number;
  formsSubmitted: number;
  requestsFiled: number;

  // Communication metrics
  chatbotInteractions: number;
  whatsappMessages: number;
  avgChatbotResponseTimeMs: number;

  // OTP metrics
  otpTotal: number;
  otpSuccessful: number;
  otpSuccessRate: number;

  // Client metrics
  newClientsLast30Days: number;
  returningClients: number;

  // Traffic
  pageVisitsCount: number;
  recentEvents: number;

  // Top pages
  topPages: Array<{ page: string; count: number }>;

  // Traffic sources
  trafficBySource: Record<string, number>;

  // Device behavior
  deviceBreakdown: Record<string, number>;

  // Conversion funnel
  conversionFunnel: {
    visits: number;
    interactions: number;
    formsSubmitted: number;
    ordersCreated: number;
    ordersDelivered: number;
  };
}

export interface MetricsData {
  eventsByType: Record<string, number>;
  eventsByDevice: Record<string, number>;
  eventsBySource: Record<string, number>;
  topPages: Array<{ page: string; count: number }>;
  dailyEvents: Array<{ date: string; count: number }>;
  totalEvents: number;
  clicksByElement: Record<string, number>;
  dailyVisits: Array<{ date: string; count: number }>;
  newVsReturning: { new: number; returning: number };
  purchaseMetrics: {
    totalRevenue: number;
    avgPurchaseValue: number;
    purchaseCount: number;
    revenueByPaymentMethod: Record<string, number>;
  };
}

// ── Analytics Service ────────────────────────────────────────────────────────

/**
 * Track an analytics event.
 *
 * Creates an analytics event record via the analytics repository.
 *
 * Validates: Requirements 9.1, 9.4
 */
export async function trackEvent(eventData: TrackEventInput) {
  const data: Prisma.AnalyticsEventCreateInput = {
    eventType: eventData.eventType,
    userId: eventData.userId ?? undefined,
    sessionId: eventData.sessionId ?? undefined,
    page: eventData.page ?? undefined,
    element: eventData.element ?? undefined,
    metadata: eventData.metadata ? (eventData.metadata as Prisma.InputJsonValue) : undefined,
    ipAddress: eventData.ipAddress ?? undefined,
    userAgent: eventData.userAgent ?? undefined,
    device: eventData.device ?? undefined,
    source: eventData.source ?? undefined,
  };

  return analyticsRepository.createEvent(data);
}

/**
 * Get comprehensive dashboard data with optional date range filtering.
 *
 * Returns all metrics required by Requirement 9.1: visits, unique users,
 * most visited pages, conversion rate, forms submitted, requests filed,
 * orders (generated/completed/pending), avg response time, traffic source,
 * clicks, chatbot interactions, WhatsApp messages, OTP success rate,
 * new vs returning clients, purchase/sales metrics, conversion funnel,
 * and device behavior.
 *
 * Validates: Requirements 9.1, 9.4
 */
export async function getDashboardData(filters?: DashboardFilters): Promise<DashboardData> {
  const now = new Date();
  const startDate = filters?.startDate ?? new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const endDate = filters?.endDate ?? now;

  const dateFilter = { gte: startDate, lte: endDate };

  const [
    // Core counts
    totalClients,
    totalOrders,
    totalRequests,
    totalPurchases,
    totalTestimonials,

    // Events in range
    recentEvents,
    pageVisitsCount,

    // Order status breakdown
    ordersPending,
    ordersProcessing,
    ordersCompleted,
    ordersCancelled,

    // New clients
    newClientsLast30Days,

    // Revenue
    purchaseAgg,

    // Delivered orders (for conversion rate)
    deliveredOrders,

    // Forms submitted (analytics events of type form_submit)
    formsSubmitted,

    // Requests filed in range
    requestsFiled,

    // Chatbot interactions
    chatbotInteractions,

    // WhatsApp messages
    whatsappMessages,

    // Chatbot avg response time
    chatbotResponseTimeAgg,

    // OTP metrics
    otpTotal,
    otpSuccessful,

    // Unique sessions
    uniqueSessionsRaw,

    // Top pages
    topPagesRaw,

    // Traffic by source
    trafficBySourceRaw,

    // Device breakdown
    deviceBreakdownRaw,
  ] = await Promise.all([
    // Core counts
    prisma.client.count(),
    prisma.order.count(),
    prisma.request.count(),
    prisma.purchase.count(),
    prisma.testimonial.count(),

    // Events in range
    prisma.analyticsEvent.count({ where: { createdAt: dateFilter } }),
    prisma.pageVisit.count({ where: { createdAt: dateFilter } }),

    // Order status breakdown
    prisma.order.count({ where: { status: 'pending' } }),
    prisma.order.count({ where: { status: { in: ['confirmed', 'processing', 'shipped'] } } }),
    prisma.order.count({ where: { status: 'delivered' } }),
    prisma.order.count({ where: { status: 'cancelled' } }),

    // New clients in date range
    prisma.client.count({ where: { createdAt: dateFilter } }),

    // Revenue aggregation
    prisma.purchase.aggregate({
      _sum: { amount: true },
      _avg: { amount: true },
      where: { createdAt: dateFilter, status: 'completed' },
    }),

    // Delivered orders for conversion
    prisma.order.count({ where: { status: 'delivered' } }),

    // Forms submitted (analytics events)
    prisma.analyticsEvent.count({
      where: { eventType: 'form_submit', createdAt: dateFilter },
    }),

    // Requests filed in range
    prisma.request.count({ where: { createdAt: dateFilter } }),

    // Chatbot interactions (analytics events + chatbot messages)
    prisma.chatbotMessage.count({ where: { createdAt: dateFilter } }),

    // WhatsApp messages
    prisma.whatsappMessage.count({ where: { createdAt: dateFilter } }),

    // Chatbot avg response time
    prisma.chatbotMessage.aggregate({
      _avg: { responseTimeMs: true },
      where: {
        role: 'assistant',
        responseTimeMs: { not: null },
        createdAt: dateFilter,
      },
    }),

    // OTP total
    prisma.otpCode.count({ where: { createdAt: dateFilter } }),

    // OTP successful (used = true)
    prisma.otpCode.count({ where: { isUsed: true, createdAt: dateFilter } }),

    // Unique sessions from analytics events
    prisma.analyticsEvent.groupBy({
      by: ['sessionId'],
      where: { createdAt: dateFilter, sessionId: { not: null } },
    }),

    // Top pages
    prisma.pageVisit.groupBy({
      by: ['page'],
      where: { createdAt: dateFilter },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    }),

    // Traffic by source
    prisma.analyticsEvent.groupBy({
      by: ['source'],
      where: { createdAt: dateFilter, source: { not: null } },
      _count: { id: true },
    }),

    // Device breakdown
    prisma.analyticsEvent.groupBy({
      by: ['device'],
      where: { createdAt: dateFilter, device: { not: null } },
      _count: { id: true },
    }),
  ]);

  // Compute returning clients: total clients minus new clients
  const returningClients = Math.max(0, totalClients - newClientsLast30Days);

  // Conversion rate: delivered orders / total orders (percentage)
  const conversionRate = totalOrders > 0
    ? Math.round((deliveredOrders / totalOrders) * 10000) / 100
    : 0;

  // Average order value from purchases
  const avgOrderValue = purchaseAgg._avg.amount
    ? Number(purchaseAgg._avg.amount)
    : 0;

  const totalRevenue = purchaseAgg._sum.amount
    ? Number(purchaseAgg._sum.amount)
    : 0;

  // OTP success rate
  const otpSuccessRate = otpTotal > 0
    ? Math.round((otpSuccessful / otpTotal) * 10000) / 100
    : 0;

  // Avg chatbot response time
  const avgChatbotResponseTimeMs = chatbotResponseTimeAgg._avg.responseTimeMs
    ? Math.round(chatbotResponseTimeAgg._avg.responseTimeMs)
    : 0;

  // Unique sessions count
  const uniqueSessions = uniqueSessionsRaw.length;

  // Total visits = page visits + page_visit events
  const totalVisits = pageVisitsCount + recentEvents;

  // Transform top pages
  const topPages = topPagesRaw.map((row) => ({
    page: row.page,
    count: row._count.id,
  }));

  // Transform traffic by source
  const trafficBySource: Record<string, number> = {};
  for (const row of trafficBySourceRaw) {
    if (row.source) trafficBySource[row.source] = row._count.id;
  }

  // Transform device breakdown
  const deviceBreakdown: Record<string, number> = {};
  for (const row of deviceBreakdownRaw) {
    if (row.device) deviceBreakdown[row.device] = row._count.id;
  }

  // Conversion funnel
  const conversionFunnel = {
    visits: pageVisitsCount,
    interactions: recentEvents,
    formsSubmitted,
    ordersCreated: totalOrders,
    ordersDelivered: deliveredOrders,
  };

  return {
    totalVisits,
    uniqueSessions,
    totalClients,
    totalOrders,
    totalRequests,
    totalPurchases,
    totalTestimonials,
    ordersPending,
    ordersProcessing,
    ordersCompleted,
    ordersCancelled,
    conversionRate,
    avgOrderValue,
    totalRevenue,
    formsSubmitted,
    requestsFiled,
    chatbotInteractions,
    whatsappMessages,
    avgChatbotResponseTimeMs,
    otpTotal,
    otpSuccessful,
    otpSuccessRate,
    newClientsLast30Days,
    returningClients,
    pageVisitsCount,
    recentEvents,
    topPages,
    trafficBySource,
    deviceBreakdown,
    conversionFunnel,
  };
}

/**
 * Get detailed metrics with date range and dimension filtering.
 *
 * Returns events grouped by type, device, source, top pages, daily trends,
 * clicks by element, daily visits, new vs returning clients, and purchase metrics.
 *
 * Validates: Requirements 9.1, 9.4
 */
export async function getMetrics(filters?: MetricsFilters): Promise<MetricsData> {
  const now = new Date();
  const startDate = filters?.startDate ?? new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const endDate = filters?.endDate ?? now;

  const where: Prisma.AnalyticsEventWhereInput = {
    createdAt: { gte: startDate, lte: endDate },
  };

  if (filters?.eventType) where.eventType = filters.eventType;
  if (filters?.device) where.device = filters.device;
  if (filters?.source) where.source = filters.source;

  const [
    eventsByTypeRaw,
    eventsByDeviceRaw,
    eventsBySourceRaw,
    topPagesRaw,
    totalEvents,
    clicksByElementRaw,
    dailyVisitsRaw,
    newClientsCount,
    totalClientsCount,
    purchaseAgg,
    purchasesByMethodRaw,
    purchaseCount,
  ] = await Promise.all([
    prisma.analyticsEvent.groupBy({
      by: ['eventType'],
      where,
      _count: { id: true },
    }),
    prisma.analyticsEvent.groupBy({
      by: ['device'],
      where: { ...where, device: { not: null } },
      _count: { id: true },
    }),
    prisma.analyticsEvent.groupBy({
      by: ['source'],
      where: { ...where, source: { not: null } },
      _count: { id: true },
    }),
    prisma.analyticsEvent.groupBy({
      by: ['page'],
      where: { ...where, page: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    }),
    prisma.analyticsEvent.count({ where }),

    // Clicks by element
    prisma.analyticsEvent.groupBy({
      by: ['element'],
      where: { ...where, eventType: 'click', element: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 20,
    }),

    // Daily page visits
    prisma.pageVisit.findMany({
      where: { createdAt: { gte: startDate, lte: endDate } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    }),

    // New clients in range
    prisma.client.count({
      where: { createdAt: { gte: startDate, lte: endDate } },
    }),

    // Total clients (for returning calculation)
    prisma.client.count(),

    // Purchase aggregation
    prisma.purchase.aggregate({
      _sum: { amount: true },
      _avg: { amount: true },
      where: { createdAt: { gte: startDate, lte: endDate }, status: 'completed' },
    }),

    // Purchases by payment method
    prisma.purchase.groupBy({
      by: ['paymentMethod'],
      where: { createdAt: { gte: startDate, lte: endDate }, status: 'completed' },
      _sum: { amount: true },
    }),

    // Purchase count
    prisma.purchase.count({
      where: { createdAt: { gte: startDate, lte: endDate }, status: 'completed' },
    }),
  ]);

  // Transform grouped results into Record<string, number>
  const eventsByType: Record<string, number> = {};
  for (const row of eventsByTypeRaw) {
    eventsByType[row.eventType] = row._count.id;
  }

  const eventsByDevice: Record<string, number> = {};
  for (const row of eventsByDeviceRaw) {
    if (row.device) eventsByDevice[row.device] = row._count.id;
  }

  const eventsBySource: Record<string, number> = {};
  for (const row of eventsBySourceRaw) {
    if (row.source) eventsBySource[row.source] = row._count.id;
  }

  const topPages = topPagesRaw
    .filter((row) => row.page !== null)
    .map((row) => ({
      page: row.page as string,
      count: row._count.id,
    }));

  // Clicks by element
  const clicksByElement: Record<string, number> = {};
  for (const row of clicksByElementRaw) {
    if (row.element) clicksByElement[row.element] = row._count.id;
  }

  // Build daily event counts
  const events = await prisma.analyticsEvent.findMany({
    where,
    select: { createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  const dailyMap = new Map<string, number>();
  for (const event of events) {
    const dateKey = event.createdAt.toISOString().slice(0, 10);
    dailyMap.set(dateKey, (dailyMap.get(dateKey) ?? 0) + 1);
  }

  const dailyEvents = Array.from(dailyMap.entries()).map(([date, count]) => ({
    date,
    count,
  }));

  // Daily visits
  const dailyVisitsMap = new Map<string, number>();
  for (const visit of dailyVisitsRaw) {
    const dateKey = visit.createdAt.toISOString().slice(0, 10);
    dailyVisitsMap.set(dateKey, (dailyVisitsMap.get(dateKey) ?? 0) + 1);
  }

  const dailyVisits = Array.from(dailyVisitsMap.entries()).map(([date, count]) => ({
    date,
    count,
  }));

  // New vs returning
  const returningClients = Math.max(0, totalClientsCount - newClientsCount);
  const newVsReturning = {
    new: newClientsCount,
    returning: returningClients,
  };

  // Purchase metrics
  const totalRevenue = purchaseAgg._sum.amount ? Number(purchaseAgg._sum.amount) : 0;
  const avgPurchaseValue = purchaseAgg._avg.amount ? Number(purchaseAgg._avg.amount) : 0;

  const revenueByPaymentMethod: Record<string, number> = {};
  for (const row of purchasesByMethodRaw) {
    if (row.paymentMethod) {
      revenueByPaymentMethod[row.paymentMethod] = row._sum.amount
        ? Number(row._sum.amount)
        : 0;
    }
  }

  const purchaseMetrics = {
    totalRevenue,
    avgPurchaseValue,
    purchaseCount,
    revenueByPaymentMethod,
  };

  return {
    eventsByType,
    eventsByDevice,
    eventsBySource,
    topPages,
    dailyEvents,
    totalEvents,
    clicksByElement,
    dailyVisits,
    newVsReturning,
    purchaseMetrics,
  };
}

/**
 * Generate simulated analytics data for demo purposes.
 *
 * Creates a variety of analytics events and page visits spanning
 * the last 6 months to populate dashboards with realistic data.
 *
 * Validates: Requirements 9.3
 */
export async function generateSimulatedData(): Promise<void> {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

  const eventTypes = ['page_visit', 'click', 'form_submit', 'chatbot_interaction', 'purchase', 'login'];
  const devices = ['mobile', 'tablet', 'desktop'];
  const sources = ['direct', 'organic', 'social', 'referral', 'whatsapp'];
  const pages = [
    '/', '/servicios', '/contacto', '/testimonios',
    '/portal/perfil', '/portal/pedidos', '/portal/solicitudes',
    '/portal/documentos', '/portal/radicacion',
    '/admin/dashboard', '/admin/clientes', '/admin/pedidos',
  ];
  const elements = [
    'btn-comprar', 'btn-contacto', 'btn-radicacion', 'link-portal',
    'chatbot-open', 'whatsapp-btn', 'btn-login', 'btn-registro',
    'nav-servicios', 'nav-testimonios', 'cta-hero', 'btn-ver-pedido',
  ];

  // Generate 500 analytics events
  const analyticsEvents: Prisma.AnalyticsEventCreateManyInput[] = [];
  for (let i = 0; i < 500; i++) {
    const randomDate = new Date(
      sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime()),
    );
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]!;

    analyticsEvents.push({
      eventType,
      sessionId: `sim-session-${Math.floor(Math.random() * 200)}`,
      page: pages[Math.floor(Math.random() * pages.length)],
      device: devices[Math.floor(Math.random() * devices.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      element: eventType === 'click'
        ? elements[Math.floor(Math.random() * elements.length)]
        : Math.random() > 0.7
          ? elements[Math.floor(Math.random() * elements.length)]
          : undefined,
      metadata: { simulated: true },
      createdAt: randomDate,
    });
  }

  await prisma.analyticsEvent.createMany({ data: analyticsEvents });

  // Generate 100 page visits
  const pageVisits: Prisma.PageVisitCreateManyInput[] = [];
  for (let i = 0; i < 100; i++) {
    const randomDate = new Date(
      sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime()),
    );

    pageVisits.push({
      page: pages[Math.floor(Math.random() * pages.length)]!,
      sessionId: `sim-session-${Math.floor(Math.random() * 200)}`,
      duration: Math.floor(Math.random() * 300) + 5,
      device: devices[Math.floor(Math.random() * devices.length)],
      referrer: Math.random() > 0.5 ? 'https://google.com' : undefined,
      createdAt: randomDate,
    });
  }

  await prisma.pageVisit.createMany({ data: pageVisits });
}
