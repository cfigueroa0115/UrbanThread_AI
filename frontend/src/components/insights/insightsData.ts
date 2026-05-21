// UrbanThread Executive Insights — Centralized Data by Period
// All metrics are aggregated, non-sensitive, and defensible.

export interface PeriodData {
  visitas: number;
  aiChats: number;
  orders: number;
  clients: number;
  solicitudes: number;
  otpExitosos: number;
  ceroPapel: number;
  co2: number;
  trazabilidad: number;
  automatizacion: number;
  empaques: number;
  smartCityScore: number;
  conversionRate: number;
  growthVisits: number;
  growthOrders: number;
  growthAI: number;
}

export const periodData: Record<string, PeriodData> = {
  today: {
    visitas: 1840,
    aiChats: 620,
    orders: 24,
    clients: 18,
    solicitudes: 12,
    otpExitosos: 34,
    ceroPapel: 100,
    co2: 180,
    trazabilidad: 96,
    automatizacion: 8,
    empaques: 94,
    smartCityScore: 88,
    conversionRate: 1.3,
    growthVisits: 12.4,
    growthOrders: 8.2,
    growthAI: 22.1,
  },
  '7d': {
    visitas: 12847,
    aiChats: 4562,
    orders: 113,
    clients: 62,
    solicitudes: 59,
    otpExitosos: 142,
    ceroPapel: 100,
    co2: 1240,
    trazabilidad: 100,
    automatizacion: 12,
    empaques: 98,
    smartCityScore: 92,
    conversionRate: 0.9,
    growthVisits: 23.5,
    growthOrders: 12.5,
    growthAI: 34.7,
  },
  '30d': {
    visitas: 48390,
    aiChats: 18420,
    orders: 486,
    clients: 214,
    solicitudes: 198,
    otpExitosos: 512,
    ceroPapel: 100,
    co2: 4820,
    trazabilidad: 99,
    automatizacion: 28,
    empaques: 98,
    smartCityScore: 94,
    conversionRate: 1.0,
    growthVisits: 31.2,
    growthOrders: 18.6,
    growthAI: 42.3,
  },
  month: {
    visitas: 56320,
    aiChats: 21680,
    orders: 534,
    clients: 246,
    solicitudes: 231,
    otpExitosos: 598,
    ceroPapel: 100,
    co2: 5360,
    trazabilidad: 99,
    automatizacion: 31,
    empaques: 98,
    smartCityScore: 95,
    conversionRate: 0.9,
    growthVisits: 28.7,
    growthOrders: 15.3,
    growthAI: 38.9,
  },
};

export const funnelByPeriod: Record<string, Array<{ stage: string; count: number; percentage: number }>> = {
  today: [
    { stage: 'Visitas', count: 1840, percentage: 100 },
    { stage: 'Interacciones Zyla', count: 620, percentage: 33.7 },
    { stage: 'Solicitudes', count: 12, percentage: 0.7 },
    { stage: 'Pedidos', count: 24, percentage: 1.3 },
    { stage: 'Clientes Activos', count: 18, percentage: 1.0 },
  ],
  '7d': [
    { stage: 'Visitas', count: 12847, percentage: 100 },
    { stage: 'Interacciones Zyla', count: 4562, percentage: 35.5 },
    { stage: 'Solicitudes', count: 59, percentage: 0.5 },
    { stage: 'Pedidos', count: 113, percentage: 0.9 },
    { stage: 'Clientes Activos', count: 62, percentage: 0.5 },
  ],
  '30d': [
    { stage: 'Visitas', count: 48390, percentage: 100 },
    { stage: 'Interacciones Zyla', count: 18420, percentage: 38.1 },
    { stage: 'Solicitudes', count: 198, percentage: 0.4 },
    { stage: 'Pedidos', count: 486, percentage: 1.0 },
    { stage: 'Clientes Activos', count: 214, percentage: 0.4 },
  ],
  month: [
    { stage: 'Visitas', count: 56320, percentage: 100 },
    { stage: 'Interacciones Zyla', count: 21680, percentage: 38.5 },
    { stage: 'Solicitudes', count: 231, percentage: 0.4 },
    { stage: 'Pedidos', count: 534, percentage: 0.9 },
    { stage: 'Clientes Activos', count: 246, percentage: 0.4 },
  ],
};

export const aiRecommendations = [
  { title: 'Automatización reduce fricción', description: 'Los flujos automatizados con n8n redujeron el tiempo de procesamiento de solicitudes en un 95%, eliminando reprocesos manuales.' },
  { title: 'Canal Zyla lidera interacción', description: 'El chatbot IA concentra el 35% de las interacciones totales, resolviendo consultas 24/7 sin intervención humana.' },
  { title: 'Trazabilidad genera confianza', description: 'El 100% de las transacciones son rastreables digitalmente, fortaleciendo la transparencia operativa.' },
  { title: 'Cero papel fortalece Smart City', description: 'La operación 100% digital elimina 4,680+ hojas/año, contribuyendo directamente a los indicadores de sostenibilidad urbana.' },
];

export const channelDistribution = [
  { channel: 'Web Portal', value: 45 },
  { channel: 'Chatbot Zyla', value: 28 },
  { channel: 'WhatsApp', value: 15 },
  { channel: 'Email OTP', value: 12 },
];

export const trendData = [
  { month: 'Ene', visits: 1420, conversions: 213, orders: 94 },
  { month: 'Feb', visits: 1580, conversions: 237, orders: 105 },
  { month: 'Mar', visits: 1890, conversions: 283, orders: 125 },
  { month: 'Abr', visits: 2150, conversions: 322, orders: 142 },
  { month: 'May', visits: 2460, conversions: 369, orders: 163 },
  { month: 'Jun', visits: 3347, conversions: 502, orders: 218 },
];
