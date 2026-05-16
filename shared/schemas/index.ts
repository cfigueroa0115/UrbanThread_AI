// UrbanThread AI — Esquemas Zod compartidos para validación

import { z } from 'zod';
import {
  DOCUMENT_TYPE_VALUES,
  ORDER_STATUS_VALUES,
  REQUEST_STATUS_VALUES,
  REQUEST_PRIORITY_VALUES,
  MAX_FILE_SIZE_BYTES,
  ALLOWED_MIME_TYPES,
  OTP_LENGTH,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from '../constants';

// ============================================================
// OTP
// ============================================================

/** POST /api/v1/auth/otp/request */
export const OTPRequestSchema = z.object({
  documentType: z.enum(DOCUMENT_TYPE_VALUES, {
    required_error: 'El tipo de documento es requerido',
    invalid_type_error: 'Tipo de documento inválido',
  }),
  documentNumber: z
    .string({ required_error: 'El número de documento es requerido' })
    .min(5, 'El número de documento debe tener al menos 5 caracteres')
    .max(20, 'El número de documento no puede exceder 20 caracteres'),
});

export type OTPRequestInput = z.infer<typeof OTPRequestSchema>;

/** POST /api/v1/auth/otp/verify */
export const OTPVerifySchema = z.object({
  documentType: z.enum(DOCUMENT_TYPE_VALUES, {
    required_error: 'El tipo de documento es requerido',
    invalid_type_error: 'Tipo de documento inválido',
  }),
  documentNumber: z
    .string({ required_error: 'El número de documento es requerido' })
    .min(5, 'El número de documento debe tener al menos 5 caracteres')
    .max(20, 'El número de documento no puede exceder 20 caracteres'),
  code: z
    .string({ required_error: 'El código OTP es requerido' })
    .length(OTP_LENGTH, `El código OTP debe tener exactamente ${OTP_LENGTH} dígitos`)
    .regex(/^\d+$/, 'El código OTP debe contener solo dígitos'),
});

export type OTPVerifyInput = z.infer<typeof OTPVerifySchema>;

// ============================================================
// Autenticación Admin
// ============================================================

/** POST /api/v1/auth/admin/login */
export const LoginAdminSchema = z.object({
  email: z
    .string({ required_error: 'El correo electrónico es requerido' })
    .email('Formato de correo electrónico inválido'),
  password: z
    .string({ required_error: 'La contraseña es requerida' })
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export type LoginAdminInput = z.infer<typeof LoginAdminSchema>;

// ============================================================
// Clientes
// ============================================================

/** POST /api/v1/clients */
export const CreateClientSchema = z.object({
  documentType: z.enum(DOCUMENT_TYPE_VALUES, {
    required_error: 'El tipo de documento es requerido',
  }),
  documentNumber: z
    .string({ required_error: 'El número de documento es requerido' })
    .min(5, 'El número de documento debe tener al menos 5 caracteres')
    .max(20, 'El número de documento no puede exceder 20 caracteres'),
  firstName: z
    .string({ required_error: 'El nombre es requerido' })
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  lastName: z
    .string({ required_error: 'El apellido es requerido' })
    .min(1, 'El apellido es requerido')
    .max(100, 'El apellido no puede exceder 100 caracteres'),
  dateOfBirth: z.string().datetime().optional().nullable(),
  gender: z.string().max(20).optional().nullable(),
  email: z.string().email('Formato de correo electrónico inválido').optional(),
  phone: z.string().min(7).max(20).optional(),
});

export type CreateClientInput = z.infer<typeof CreateClientSchema>;

// ============================================================
// Pedidos (Orders)
// ============================================================

const OrderItemSchema = z.object({
  productName: z
    .string({ required_error: 'El nombre del producto es requerido' })
    .min(1, 'El nombre del producto es requerido'),
  description: z.string().optional().nullable(),
  quantity: z
    .number({ required_error: 'La cantidad es requerida' })
    .int('La cantidad debe ser un número entero')
    .positive('La cantidad debe ser mayor a 0'),
  unitPrice: z
    .number({ required_error: 'El precio unitario es requerido' })
    .nonnegative('El precio unitario no puede ser negativo'),
});

/** POST /api/v1/orders */
export const CreateOrderSchema = z.object({
  clientId: z
    .string({ required_error: 'El ID del cliente es requerido' })
    .uuid('ID de cliente inválido'),
  items: z
    .array(OrderItemSchema, { required_error: 'Los items del pedido son requeridos' })
    .min(1, 'El pedido debe tener al menos un item'),
  currency: z.string().default('COP'),
  notes: z.string().max(500).optional().nullable(),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

// ============================================================
// Solicitudes / Radicación (Requests)
// ============================================================

/** POST /api/v1/requests */
export const CreateRequestSchema = z.object({
  clientId: z
    .string({ required_error: 'El ID del cliente es requerido' })
    .uuid('ID de cliente inválido'),
  type: z
    .string({ required_error: 'El tipo de solicitud es requerido' })
    .min(1, 'El tipo de solicitud es requerido'),
  description: z
    .string({ required_error: 'La descripción es requerida' })
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(2000, 'La descripción no puede exceder 2000 caracteres'),
  priority: z.enum(REQUEST_PRIORITY_VALUES, {
    required_error: 'La prioridad es requerida',
    invalid_type_error: 'Prioridad inválida',
  }),
  attachments: z.array(z.string().uuid()).optional(),
});

export type CreateRequestInput = z.infer<typeof CreateRequestSchema>;

// ============================================================
// Documentos
// ============================================================

/** POST /api/v1/documents/upload (metadata, file handled separately) */
export const UploadDocumentSchema = z.object({
  clientId: z
    .string({ required_error: 'El ID del cliente es requerido' })
    .uuid('ID de cliente inválido'),
  documentType: z
    .string({ required_error: 'El tipo de documento es requerido' })
    .min(1, 'El tipo de documento es requerido'),
  description: z.string().max(500).optional(),
  fileName: z.string().optional(),
  fileSize: z
    .number()
    .max(MAX_FILE_SIZE_BYTES, `El archivo no puede exceder ${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB`)
    .optional(),
  mimeType: z
    .string()
    .refine(
      (val) => ALLOWED_MIME_TYPES.includes(val),
      'Tipo de archivo no soportado. Tipos permitidos: PDF, JPG, PNG, DOCX'
    )
    .optional(),
});

export type UploadDocumentInput = z.infer<typeof UploadDocumentSchema>;

// ============================================================
// Testimonios
// ============================================================

/** POST /api/v1/testimonials */
export const CreateTestimonialSchema = z.object({
  clientName: z
    .string({ required_error: 'El nombre del cliente es requerido' })
    .min(1, 'El nombre del cliente es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  clientRole: z.string().max(100).optional().nullable(),
  photoUrl: z.string().url('URL de foto inválida').optional().nullable(),
  rating: z
    .number({ required_error: 'La valoración es requerida' })
    .int('La valoración debe ser un número entero')
    .min(1, 'La valoración mínima es 1')
    .max(5, 'La valoración máxima es 5'),
  comment: z
    .string({ required_error: 'El comentario es requerido' })
    .min(10, 'El comentario debe tener al menos 10 caracteres')
    .max(1000, 'El comentario no puede exceder 1000 caracteres'),
  caseStudy: z.string().max(2000).optional().nullable(),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().nonnegative().default(0),
});

export type CreateTestimonialInput = z.infer<typeof CreateTestimonialSchema>;

/** PUT /api/v1/testimonials/:id */
export const UpdateTestimonialSchema = CreateTestimonialSchema.partial();

export type UpdateTestimonialInput = z.infer<typeof UpdateTestimonialSchema>;

// ============================================================
// Actualización de estado
// ============================================================

/** PUT /api/v1/orders/:id/status or /api/v1/requests/:id/status */
export const UpdateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUS_VALUES, {
    required_error: 'El estado es requerido',
    invalid_type_error: 'Estado inválido',
  }),
  comment: z.string().max(500).optional().nullable(),
});

export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;

export const UpdateRequestStatusSchema = z.object({
  status: z.enum(REQUEST_STATUS_VALUES, {
    required_error: 'El estado es requerido',
    invalid_type_error: 'Estado inválido',
  }),
  comment: z.string().max(500).optional().nullable(),
});

export type UpdateRequestStatusInput = z.infer<typeof UpdateRequestStatusSchema>;

// ============================================================
// Paginación
// ============================================================

export const PaginationSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .positive('La página debe ser un número positivo')
    .default(DEFAULT_PAGE),
  pageSize: z.coerce
    .number()
    .int()
    .positive('El tamaño de página debe ser un número positivo')
    .max(MAX_PAGE_SIZE, `El tamaño de página no puede exceder ${MAX_PAGE_SIZE}`)
    .default(DEFAULT_PAGE_SIZE),
});

export type PaginationInput = z.infer<typeof PaginationSchema>;

// ============================================================
// Formulario de contacto
// ============================================================

export const ContactFormSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  email: z
    .string({ required_error: 'El correo electrónico es requerido' })
    .email('Formato de correo electrónico inválido'),
  phone: z.string().min(7).max(20).optional(),
  subject: z
    .string({ required_error: 'El asunto es requerido' })
    .min(1, 'El asunto es requerido')
    .max(200, 'El asunto no puede exceder 200 caracteres'),
  message: z
    .string({ required_error: 'El mensaje es requerido' })
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(2000, 'El mensaje no puede exceder 2000 caracteres'),
});

export type ContactFormInput = z.infer<typeof ContactFormSchema>;

// ============================================================
// Usuarios (Users)
// ============================================================

/** POST /api/v1/users */
export const CreateUserSchema = z.object({
  email: z
    .string({ required_error: 'El correo electrónico es requerido' })
    .email('Formato de correo electrónico inválido'),
  password: z
    .string({ required_error: 'La contraseña es requerida' })
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
  firstName: z
    .string({ required_error: 'El nombre es requerido' })
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  lastName: z
    .string({ required_error: 'El apellido es requerido' })
    .min(1, 'El apellido es requerido')
    .max(100, 'El apellido no puede exceder 100 caracteres'),
  roleId: z
    .string({ required_error: 'El rol es requerido' })
    .uuid('ID de rol inválido'),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

/** PUT /api/v1/users/:id */
export const UpdateUserSchema = z.object({
  email: z.string().email('Formato de correo electrónico inválido').optional(),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').optional(),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  roleId: z.string().uuid('ID de rol inválido').optional(),
  isActive: z.boolean().optional(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

// ============================================================
// Roles
// ============================================================

/** POST /api/v1/roles */
export const CreateRoleSchema = z.object({
  name: z
    .string({ required_error: 'El nombre del rol es requerido' })
    .min(1, 'El nombre del rol es requerido')
    .max(50, 'El nombre del rol no puede exceder 50 caracteres'),
  description: z.string().max(200).optional().nullable(),
  permissionIds: z.array(z.string().uuid('ID de permiso inválido')).optional(),
});

export type CreateRoleInput = z.infer<typeof CreateRoleSchema>;

/** PUT /api/v1/roles/:id */
export const UpdateRoleSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  description: z.string().max(200).optional().nullable(),
  permissionIds: z.array(z.string().uuid('ID de permiso inválido')).optional(),
});

export type UpdateRoleInput = z.infer<typeof UpdateRoleSchema>;

// ============================================================
// ID param (reutilizable)
// ============================================================

export const IdParamSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export type IdParamInput = z.infer<typeof IdParamSchema>;
