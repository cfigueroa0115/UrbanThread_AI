// UrbanThread AI — Constantes compartidas

// ============================================================
// Tipos de documento de identidad
// ============================================================
export const DOCUMENT_TYPES = {
  CC: 'CC',
  CE: 'CE',
  NIT: 'NIT',
  PP: 'PP',
  TI: 'TI',
} as const;

export type DocumentTypeCode = (typeof DOCUMENT_TYPES)[keyof typeof DOCUMENT_TYPES];

export const DOCUMENT_TYPE_LABELS: Record<DocumentTypeCode, string> = {
  CC: 'Cédula de Ciudadanía',
  CE: 'Cédula de Extranjería',
  NIT: 'Número de Identificación Tributaria',
  PP: 'Pasaporte',
  TI: 'Tarjeta de Identidad',
};

export const DOCUMENT_TYPE_VALUES = Object.values(DOCUMENT_TYPES) as [DocumentTypeCode, ...DocumentTypeCode[]];

// ============================================================
// Estados de pedidos (orders)
// ============================================================
export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export type OrderStatusValue = (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];

export const ORDER_STATUS_VALUES = Object.values(ORDER_STATUSES) as [OrderStatusValue, ...OrderStatusValue[]];

// ============================================================
// Estados de solicitudes (requests / radicación)
// ============================================================
export const REQUEST_STATUSES = {
  REGISTERED: 'registered',
  IN_REVIEW: 'in_review',
  IN_PROGRESS: 'in_progress',
  PENDING_INFO: 'pending_info',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
  CANCELLED: 'cancelled',
} as const;

export type RequestStatusValue = (typeof REQUEST_STATUSES)[keyof typeof REQUEST_STATUSES];

export const REQUEST_STATUS_VALUES = Object.values(REQUEST_STATUSES) as [RequestStatusValue, ...RequestStatusValue[]];

// ============================================================
// Prioridades de solicitudes
// ============================================================
export const REQUEST_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export type RequestPriorityValue = (typeof REQUEST_PRIORITIES)[keyof typeof REQUEST_PRIORITIES];

export const REQUEST_PRIORITY_VALUES = Object.values(REQUEST_PRIORITIES) as [RequestPriorityValue, ...RequestPriorityValue[]];

// ============================================================
// Códigos de error internos
// ============================================================
export const ERROR_CODES = {
  // Autenticación
  AUTH_TOKEN_MISSING: 'AUTH_TOKEN_MISSING',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  AUTH_CREDENTIALS_INVALID: 'AUTH_CREDENTIALS_INVALID',

  // OTP
  OTP_EXPIRED: 'OTP_EXPIRED',
  OTP_INVALID: 'OTP_INVALID',
  OTP_BLOCKED: 'OTP_BLOCKED',

  // RBAC
  RBAC_FORBIDDEN: 'RBAC_FORBIDDEN',

  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

  // Validación
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  VALIDATION_REQUIRED: 'VALIDATION_REQUIRED',
  VALIDATION_FORMAT: 'VALIDATION_FORMAT',
  VALIDATION_RANGE: 'VALIDATION_RANGE',

  // Recursos
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',

  // Archivos
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  FILE_TYPE_INVALID: 'FILE_TYPE_INVALID',

  // Webhooks
  WEBHOOK_DELIVERY_FAILED: 'WEBHOOK_DELIVERY_FAILED',
  IDEMPOTENCY_DUPLICATE: 'IDEMPOTENCY_DUPLICATE',

  // Servicios externos
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',

  // Interno
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

// ============================================================
// Tipos de archivo permitidos
// ============================================================
export const FILE_TYPES = {
  PDF: 'application/pdf',
  JPG: 'image/jpeg',
  PNG: 'image/png',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
} as const;

export type FileType = (typeof FILE_TYPES)[keyof typeof FILE_TYPES];

export const ALLOWED_FILE_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'docx'] as const;

export const ALLOWED_MIME_TYPES = Object.values(FILE_TYPES) as string[];

// ============================================================
// Límites de archivos
// ============================================================
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_FILE_SIZE_MB = 10;

// ============================================================
// OTP
// ============================================================
export const OTP_LENGTH = 6;
export const OTP_EXPIRATION_SECONDS = 300; // 5 minutos
export const OTP_MAX_ATTEMPTS = 3;
export const OTP_BLOCK_DURATION_MINUTES = 15;

// ============================================================
// Sesiones
// ============================================================
export const SESSION_EXPIRATION_MINUTES = 30;
export const JWT_DEFAULT_EXPIRATION = '30m';

// ============================================================
// Rate limiting
// ============================================================
export const RATE_LIMIT_AUTH_MAX_ATTEMPTS = 10;
export const RATE_LIMIT_AUTH_WINDOW_MINUTES = 5;
export const RATE_LIMIT_AUTH_BLOCK_MINUTES = 30;

// ============================================================
// Paginación
// ============================================================
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// ============================================================
// Tipos de notificación
// ============================================================
export const NOTIFICATION_TYPES = {
  ORDER_STATUS: 'order_status',
  REQUEST_STATUS: 'request_status',
  DOCUMENT: 'document',
  SYSTEM: 'system',
  PROMOTION: 'promotion',
} as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

// ============================================================
// Tipos de evento de analítica
// ============================================================
export const ANALYTICS_EVENT_TYPES = {
  PAGE_VISIT: 'page_visit',
  CLICK: 'click',
  FORM_SUBMIT: 'form_submit',
  CHATBOT_INTERACTION: 'chatbot_interaction',
  PURCHASE: 'purchase',
  LOGIN: 'login',
} as const;

export type AnalyticsEventType = (typeof ANALYTICS_EVENT_TYPES)[keyof typeof ANALYTICS_EVENT_TYPES];

// ============================================================
// Tipos de evento de webhook n8n
// ============================================================
export const WEBHOOK_EVENT_TYPES = {
  REQUEST_CREATED: 'request.created',
  CLIENT_UPDATED: 'client.updated',
  OTP_SENT: 'otp.sent',
  EMAIL_SENT: 'email.sent',
  ALERT_GENERATED: 'alert.generated',
  WHATSAPP_MESSAGE: 'whatsapp.message',
  INTENT_CLASSIFIED: 'intent.classified',
  NOTIFICATION_SENT: 'notification.sent',
  STATUS_UPDATED: 'status.updated',
  CLIENT_CONFIRMED: 'client.confirmed',
} as const;

export type WebhookEventType = (typeof WEBHOOK_EVENT_TYPES)[keyof typeof WEBHOOK_EVENT_TYPES];

// ============================================================
// Webhook reintentos
// ============================================================
export const WEBHOOK_MAX_RETRIES = 3;
export const WEBHOOK_RETRY_INTERVALS_MS = [1000, 5000, 15000] as const; // 1s, 5s, 15s

// ============================================================
// Roles del chatbot
// ============================================================
export const CHAT_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
} as const;

export type ChatRole = (typeof CHAT_ROLES)[keyof typeof CHAT_ROLES];

// ============================================================
// Tipos de dirección
// ============================================================
export const ADDRESS_TYPES = {
  HOME: 'home',
  WORK: 'work',
  BILLING: 'billing',
  SHIPPING: 'shipping',
} as const;

export type AddressType = (typeof ADDRESS_TYPES)[keyof typeof ADDRESS_TYPES];

// ============================================================
// Tipos de teléfono
// ============================================================
export const PHONE_TYPES = {
  MOBILE: 'mobile',
  HOME: 'home',
  WORK: 'work',
} as const;

export type PhoneType = (typeof PHONE_TYPES)[keyof typeof PHONE_TYPES];

// ============================================================
// Tiers de cliente
// ============================================================
export const CLIENT_TIERS = {
  STANDARD: 'standard',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
} as const;

export type ClientTier = (typeof CLIENT_TIERS)[keyof typeof CLIENT_TIERS];
