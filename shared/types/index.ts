// UrbanThread AI — Tipos de dominio compartidos

import type {
  DocumentTypeCode,
  OrderStatusValue,
  RequestStatusValue,
  RequestPriorityValue,
  NotificationType,
  AnalyticsEventType,
  WebhookEventType,
  ChatRole,
  AddressType,
  PhoneType,
  ClientTier,
  ErrorCode,
} from '../constants';

// ============================================================
// Respuesta genérica de la API
// ============================================================
export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  data?: T;
  errors?: ApiError[];
  meta?: PaginationMeta;
}

export interface ApiError {
  field?: string;
  message: string;
  code: string;
}

export interface PaginationMeta {
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
  requestId?: string;
  timestamp?: string;
}

// ============================================================
// Usuarios, Roles y Permisos
// ============================================================
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  role?: Role;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  permissions?: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
  description: string | null;
  createdAt: string;
}

// ============================================================
// Clientes
// ============================================================
export interface Client {
  id: string;
  documentType: DocumentTypeCode;
  documentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  gender: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientDetail extends Client {
  documents: ClientDocument[];
  addresses: ClientAddress[];
  emails: ClientEmail[];
  phones: ClientPhone[];
  profile: CustomerProfile | null;
  orders?: Order[];
  requests?: RequestRecord[];
}

export interface ClientAddress {
  id: string;
  clientId: string;
  type: AddressType;
  street: string;
  city: string;
  state: string;
  postalCode: string | null;
  country: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientEmail {
  id: string;
  clientId: string;
  email: string;
  isPrimary: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientPhone {
  id: string;
  clientId: string;
  phone: string;
  type: PhoneType;
  isPrimary: boolean;
  isWhatsapp: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfile {
  id: string;
  clientId: string;
  preferredLanguage: string | null;
  loyaltyPoints: number;
  tier: ClientTier;
  notes: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ClientDocument {
  id: string;
  clientId: string;
  documentTypeId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  status: 'active' | 'archived' | 'deleted';
  uploadedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Pedidos (Orders)
// ============================================================
export interface Order {
  id: string;
  clientId: string;
  orderNumber: string;
  status: OrderStatusValue;
  totalAmount: number;
  currency: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderDetail extends Order {
  client?: Client;
  items: OrderItem[];
  statusHistory: OrderStatusEntry[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productName: string;
  description: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
}

export interface OrderStatusEntry {
  id: string;
  orderId: string;
  status: OrderStatusValue;
  comment: string | null;
  changedBy: string | null;
  createdAt: string;
}

// ============================================================
// Solicitudes / Radicación (Requests)
// ============================================================
export interface RequestRecord {
  id: string;
  clientId: string;
  radicationNumber: string;
  type: string;
  description: string;
  priority: RequestPriorityValue;
  status: RequestStatusValue;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RequestDetail extends RequestRecord {
  client?: Client;
  statusHistory: RequestStatusEntry[];
  attachedFiles: DocumentRecord[];
}

export interface RequestStatusEntry {
  id: string;
  requestId: string;
  status: RequestStatusValue;
  comment: string | null;
  changedBy: string | null;
  createdAt: string;
}

// ============================================================
// Documentos / Archivos adjuntos
// ============================================================
export interface DocumentRecord {
  id: string;
  requestId: string | null;
  clientId: string | null;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  documentType: string | null;
  status: string;
  uploadedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Notificaciones
// ============================================================
export interface Notification {
  id: string;
  clientId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  readAt: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

// ============================================================
// Testimonios y Experiencias
// ============================================================
export interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string | null;
  photoUrl: string | null;
  rating: number;
  comment: string;
  caseStudy: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerExperience {
  id: string;
  clientName: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// OTP
// ============================================================
export interface OTPRecord {
  id: string;
  clientId: string;
  code: string;
  email: string;
  attempts: number;
  isUsed: boolean;
  expiresAt: string;
  blockedUntil: string | null;
  createdAt: string;
}

export interface OTPRequestResult {
  message: string;
  expiresIn: number;
  maskedEmail: string;
}

export interface OTPVerifyResult {
  token: string;
  expiresIn: number;
  client: ClientDetail;
}

// ============================================================
// Chat / Chatbot
// ============================================================
export interface ChatMessage {
  id: string;
  conversationId: string;
  role: ChatRole;
  content: string;
  tokensUsed: number | null;
  responseTimeMs: number | null;
  createdAt: string;
}

export interface Conversation {
  id: string;
  clientId: string | null;
  sessionId: string;
  status: 'active' | 'escalated' | 'closed';
  escalatedAt: string | null;
  ticketId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  messages?: ChatMessage[];
}

// ============================================================
// Analítica
// ============================================================
export interface AnalyticsEvent {
  id: string;
  eventType: AnalyticsEventType;
  userId: string | null;
  sessionId: string | null;
  page: string | null;
  element: string | null;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  device: 'mobile' | 'tablet' | 'desktop' | null;
  source: 'direct' | 'organic' | 'social' | 'referral' | 'whatsapp' | null;
  createdAt: string;
}

// ============================================================
// Webhooks n8n
// ============================================================
export interface WebhookEvent {
  id: string;
  eventType: WebhookEventType;
  timestamp: string;
  idempotencyKey: string;
  data: Record<string, unknown>;
}

export interface WebhookDeliveryResult {
  eventId: string;
  status: 'delivered' | 'failed' | 'pending';
  attempt: number;
  responseCode: number | null;
  error: string | null;
  deliveredAt: string | null;
}

export interface WebhookEventStatus {
  eventId: string;
  eventType: WebhookEventType;
  status: 'delivered' | 'failed' | 'pending' | 'retrying';
  attempts: number;
  lastAttemptAt: string | null;
  error: string | null;
}

// ============================================================
// WhatsApp
// ============================================================
export interface WhatsAppMessage {
  id: string;
  clientId: string | null;
  sessionId: string;
  direction: 'inbound' | 'outbound';
  phoneNumber: string;
  content: string;
  messageType: 'text' | 'image' | 'document' | 'audio';
  mediaUrl: string | null;
  intent: string | null;
  status: 'received' | 'sent' | 'delivered' | 'read' | 'failed';
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

// ============================================================
// Auditoría
// ============================================================
export interface AuditLogEntry {
  id: string;
  userId: string | null;
  action: string;
  resource: string;
  resourceId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  result: 'success' | 'failure';
  details: Record<string, unknown> | null;
  createdAt: string;
}

export interface ActivityLogEntry {
  id: string;
  userId: string | null;
  module: string;
  action: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

// ============================================================
// Sesiones
// ============================================================
export interface Session {
  id: string;
  userId: string;
  token: string;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: string;
  createdAt: string;
}

// ============================================================
// Integraciones
// ============================================================
export interface Integration {
  id: string;
  name: string;
  type: 'webhook' | 'api' | 'smtp';
  config: Record<string, unknown>;
  isActive: boolean;
  lastSyncAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Tipos auxiliares de autenticación
// ============================================================
export interface TokenPayload {
  userId: string;
  email: string;
  roleId: string;
  roleName: string;
  iat: number;
  exp: number;
}

export interface AuthResult {
  token: string;
  user: User;
}

// ============================================================
// Tipos de paginación
// ============================================================
export interface PaginatedRequest {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta & {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
