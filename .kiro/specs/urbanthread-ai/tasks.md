# Plan de Implementación: UrbanThread AI — Plataforma Smart Commerce Completa

## Descripción General

Este plan convierte el diseño técnico de UrbanThread AI en tareas de implementación incrementales. Cada tarea construye sobre las anteriores, comenzando por la infraestructura del proyecto, pasando por la base de datos, backend core, API REST, módulos funcionales, frontend y finalizando con integración completa y datos semilla. Los tests de propiedades validan las 24 propiedades de correctitud definidas en el diseño. El stack es TypeScript con Next.js 14, Express.js, Prisma, PostgreSQL, Tailwind CSS, Vitest y fast-check.

## Tareas

- [x] 1. Scaffolding del proyecto y configuración del monorepo
  - [x] 1.1 Inicializar monorepo con workspaces (root `package.json`, carpetas `frontend/`, `backend/`, `shared/`)
    - Configurar npm/yarn workspaces en el `package.json` raíz
    - Crear `tsconfig.json` base con paths compartidos
    - _Requisitos: 3.1, 15.3_

  - [x] 1.2 Configurar proyecto backend con Express.js y TypeScript
    - Inicializar `backend/package.json` con dependencias: express, prisma, @prisma/client, zod, jsonwebtoken, bcryptjs, nodemailer, multer, cors, helmet, express-rate-limit, dotenv
    - Configurar `backend/tsconfig.json` con strict mode
    - Crear `backend/src/app.ts` como entry point de Express con middleware base (cors, helmet, json parser, error handler)
    - Crear `backend/src/config/index.ts` con variables de entorno tipadas
    - _Requisitos: 3.1, 3.2, 14.1_

  - [x] 1.3 Configurar proyecto frontend con Next.js 14 (App Router) y Tailwind CSS
    - Inicializar `frontend/` con Next.js 14, TypeScript, Tailwind CSS, App Router
    - Instalar dependencias: zustand, @tanstack/react-query, zod, lucide-react, recharts, framer-motion
    - Configurar `tailwind.config.ts` con la paleta de colores del diseño (tokens `--ut-*`), tipografía Inter y JetBrains Mono
    - Crear `frontend/src/app/globals.css` con variables CSS del design system
    - _Requisitos: 11.1, 11.2, 12.1_

  - [x] 1.4 Configurar paquete shared con tipos y esquemas Zod compartidos
    - Crear `shared/types/index.ts` con tipos de dominio: Client, Order, Request, Document, Notification, Testimonial, ApiResponse, ApiError
    - Crear `shared/schemas/index.ts` con esquemas Zod para validación compartida (OTPRequest, OTPVerify, CreateRequest, UploadDocument, etc.)
    - Crear `shared/constants/index.ts` con constantes: document types, order statuses, request statuses, error codes
    - _Requisitos: 18.1, 18.2, 3.4_

  - [x] 1.5 Configurar Vitest y fast-check para testing
    - Instalar vitest, fast-check, @testing-library/react, @testing-library/jest-dom, supertest, msw en los workspaces correspondientes
    - Crear `backend/vitest.config.ts` y `frontend/vitest.config.ts`
    - Crear `backend/tests/setup/global-setup.ts` con configuración de test DB
    - Crear `backend/tests/setup/test-server.ts` con instancia de Express para tests
    - _Requisitos: 14.4, 18.3_

- [x] 2. Esquema de base de datos y migraciones (Prisma)
  - [x] 2.1 Definir esquema Prisma con las 32 tablas del diseño
    - Crear `backend/prisma/schema.prisma` con todas las tablas: users, roles, permissions, role_permissions, sessions, administrators, clients, document_types, client_documents, client_addresses, client_emails, client_phones, customer_profiles, orders, order_items, order_status, requests, request_status, attached_files, whatsapp_messages, chatbot_conversations, chatbot_messages, otp_codes, audit_logs, activity_logs, notifications, integrations, analytics_events, page_visits, testimonials, customer_experiences, purchases
    - Implementar todas las relaciones de integridad referencial (claves foráneas, cascadas, índices)
    - Incluir campos `created_at` y `updated_at` en cada tabla
    - Incluir índices optimizados para consultas por documento (`@@index([documentType, documentNumber])`)
    - _Requisitos: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [x] 2.2 Generar y ejecutar migración inicial
    - Ejecutar `npx prisma migrate dev --name init` para generar la migración
    - Generar el cliente Prisma con `npx prisma generate`
    - Crear `backend/src/lib/prisma.ts` con instancia singleton del cliente Prisma
    - _Requisitos: 2.1, 2.2_

- [x] 3. Backend core: middleware, autenticación y RBAC
  - [x] 3.1 Implementar middleware de autenticación JWT
    - Crear `backend/src/middleware/auth.middleware.ts` con verificación de token JWT
    - Implementar generación de tokens con expiración configurable en `backend/src/utils/jwt.ts`
    - Implementar hash de contraseñas con bcrypt en `backend/src/utils/crypto.ts`
    - Retornar 401 con código `AUTH_TOKEN_MISSING`, `AUTH_TOKEN_EXPIRED` o `AUTH_TOKEN_INVALID` según corresponda
    - _Requisitos: 3.5, 14.1_

  - [x] 3.2 Implementar middleware RBAC
    - Crear `backend/src/middleware/rbac.middleware.ts` con verificación de permisos por rol
    - Consultar permisos del usuario desde la tabla `role_permissions` vía Prisma
    - Retornar 403 con código `RBAC_FORBIDDEN` si el usuario no tiene el permiso requerido
    - _Requisitos: 7.6, 14.2_

  - [x] 3.3 Implementar middleware de validación con Zod
    - Crear `backend/src/middleware/validation.middleware.ts` que valide body, params y query contra esquemas Zod
    - Retornar 400 con estructura de error estándar (`field`, `message`, `code`) para datos inválidos
    - _Requisitos: 3.3, 3.4, 18.4_

  - [x] 3.4 Implementar middleware de rate limiting
    - Crear `backend/src/middleware/rate-limiter.middleware.ts` con express-rate-limit
    - Configurar límite de 10 intentos fallidos de autenticación por IP en 5 minutos
    - Bloquear IP por 30 minutos al exceder el límite y registrar en `audit_logs`
    - Retornar 429 con código `RATE_LIMIT_EXCEEDED`
    - _Requisitos: 14.6_

  - [x] 3.5 Implementar middleware de auditoría
    - Crear `backend/src/middleware/audit.middleware.ts` que registre operaciones de escritura (POST, PUT, DELETE)
    - Registrar en `audit_logs`: usuario, acción, recurso, resourceId, IP, userAgent, resultado, timestamp
    - _Requisitos: 14.5_

  - [x] 3.6 Implementar middleware de sanitización de entrada
    - Crear `backend/src/middleware/sanitization.middleware.ts` que sanitice inputs contra SQL injection, XSS y CSRF
    - Escapar caracteres peligrosos sin alterar contenido legítimo
    - _Requisitos: 14.4_

  - [x] 3.7 Implementar manejo global de errores
    - Crear `backend/src/middleware/error-handler.middleware.ts` con el error handler global de Express
    - Implementar clases de error tipadas: `ValidationError`, `AuthenticationError`, `AuthorizationError`, `NotFoundError`, `ConflictError`
    - Estructura de respuesta estándar con `status`, `errors[]` y `meta` (requestId, timestamp)
    - _Requisitos: 3.3, 3.4, 3.5_

  - [ ]* 3.8 Tests de propiedades para middleware de autenticación y validación
    - **Propiedad 2: Estructura consistente de respuestas de error de la API**
    - **Propiedad 3: Autenticación JWT requerida en endpoints protegidos**
    - **Valida: Requisitos 3.3, 3.4, 3.5, 14.1, 18.4**

  - [ ]* 3.9 Tests de propiedades para RBAC
    - **Propiedad 10: Aplicación de RBAC en endpoints y vistas**
    - **Valida: Requisitos 7.6, 14.2**

  - [ ]* 3.10 Tests de propiedades para sanitización
    - **Propiedad 11: Sanitización de datos de entrada contra inyección**
    - **Valida: Requisitos 14.4**

  - [ ]* 3.11 Tests de propiedades para auditoría
    - **Propiedad 12: Registro de auditoría para operaciones de escritura**
    - **Valida: Requisitos 14.5**

  - [ ]* 3.12 Tests de propiedades para rate limiting
    - **Propiedad 13: Rate limiting por IP en autenticación**
    - **Valida: Requisitos 14.6**

- [x] 4. Checkpoint — Verificar infraestructura base
  - Asegurar que todos los tests pasan, preguntar al usuario si surgen dudas.

- [x] 5. Capa de repositorios y servicios base
  - [x] 5.1 Implementar repositorios de acceso a datos
    - Crear `backend/src/repositories/` con repositorios para cada dominio: `user.repository.ts`, `client.repository.ts`, `order.repository.ts`, `request.repository.ts`, `document.repository.ts`, `notification.repository.ts`, `testimonial.repository.ts`, `analytics.repository.ts`, `audit.repository.ts`, `chatbot.repository.ts`, `whatsapp.repository.ts`, `webhook.repository.ts`, `otp.repository.ts`
    - Cada repositorio encapsula las consultas Prisma con tipado completo
    - _Requisitos: 2.1, 2.2, 2.5_

  - [x] 5.2 Implementar servicio de autenticación de administradores
    - Crear `backend/src/services/auth.service.ts` con: `authenticateAdmin`, `generateToken`, `verifyToken`, `refreshToken`, `revokeToken`
    - Implementar login con email/password, generación JWT con expiración configurable, refresh token
    - _Requisitos: 14.1, 3.5_

  - [x] 5.3 Implementar servicio OTP
    - Crear `backend/src/services/otp.service.ts` con: `generateOTP`, `sendOTP`, `verifyOTP`, `isBlocked`, `recordFailedAttempt`, `resetAttempts`
    - Generar código de 6 dígitos con expiración de 5 minutos
    - Bloquear acceso tras 3 intentos fallidos por 15 minutos
    - Enviar OTP por email usando Nodemailer
    - _Requisitos: 8.1, 8.2, 8.3, 8.4_

  - [x] 5.4 Implementar servicio de clientes
    - Crear `backend/src/services/client.service.ts` con CRUD completo y búsqueda por tipo/número de documento
    - Incluir carga de información completa: datos personales, direcciones, correos, teléfonos, documentos, pedidos, solicitudes
    - _Requisitos: 2.5, 6.2, 7.2_

  - [x] 5.5 Implementar servicio de pedidos
    - Crear `backend/src/services/order.service.ts` con CRUD, cambio de estado con historial
    - Registrar cada cambio de estado en `order_status` con timestamp, usuario y comentario
    - _Requisitos: 2.6, 7.5_

  - [x] 5.6 Implementar servicio de radicación
    - Crear `backend/src/services/radicacion.service.ts` con: `lookupClient`, `createRequest`, `generateRadicationNumber`, `sendConfirmationEmail`, `triggerN8nWorkflow`, `getRequestStatus`
    - Generar número de radicación único alfanumérico secuencial
    - Enviar email de confirmación con número de radicación y resumen
    - Disparar webhook n8n con datos completos de la solicitud
    - _Requisitos: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [x] 5.7 Implementar servicio de documentos
    - Crear `backend/src/services/document.service.ts` con: `upload`, `download`, `validateFile`, `deleteDocument`
    - Validar tipo de archivo (PDF, JPG, PNG, DOCX) y tamaño máximo (10 MB)
    - Verificar autorización de descarga por cliente
    - Almacenar metadatos en `attached_files` y `client_documents`
    - _Requisitos: 16.1, 16.2, 16.3, 16.4_

  - [x] 5.8 Implementar servicio de notificaciones
    - Crear `backend/src/services/notification.service.ts` con: generación automática por cambio de estado, listado, conteo de no leídas, marcar como leída
    - Generar notificación al cambiar estado de pedido o solicitud
    - _Requisitos: 17.1, 17.2, 17.3_

  - [x] 5.9 Implementar servicio de serialización/deserialización
    - Crear `backend/src/utils/serialization.ts` con funciones de serialización/deserialización para objetos de dominio
    - Garantizar round-trip consistency para Client, Order, Request, Document
    - _Requisitos: 18.1, 18.2, 18.3_

  - [ ]* 5.10 Tests de propiedades para serialización round-trip
    - **Propiedad 1: Ida y vuelta de serialización de objetos de dominio (Round-Trip)**
    - **Valida: Requisitos 18.1, 18.2, 18.3**

  - [ ]* 5.11 Tests de propiedades para consulta de cliente por documento
    - **Propiedad 4: Consulta de cliente por tipo y número de documento**
    - **Valida: Requisitos 2.5, 6.2, 7.2**

  - [ ]* 5.12 Tests de propiedades para historial de estados
    - **Propiedad 5: Historial completo de cambios de estado**
    - **Valida: Requisitos 2.6, 7.5**

  - [ ]* 5.13 Tests de propiedades para documentos por cliente
    - **Propiedad 6: Asociación uno-a-muchos de documentos por cliente**
    - **Valida: Requisitos 2.3, 16.4**

  - [ ]* 5.14 Tests de propiedades para número de radicación
    - **Propiedad 7: Unicidad y formato del número de radicación**
    - **Valida: Requisitos 6.4**

  - [ ]* 5.15 Tests de propiedades para OTP
    - **Propiedad 8: Generación y expiración de códigos OTP**
    - **Propiedad 9: Bloqueo por intentos fallidos de OTP**
    - **Valida: Requisitos 8.1, 8.3, 8.4**

  - [ ]* 5.16 Tests de propiedades para validación de documentos
    - **Propiedad 14: Validación de carga de documentos**
    - **Valida: Requisitos 16.1, 16.3**

  - [ ]* 5.17 Tests de propiedades para autorización de descarga
    - **Propiedad 15: Autorización de descarga de documentos**
    - **Valida: Requisitos 16.2**

  - [ ]* 5.18 Tests de propiedades para notificaciones
    - **Propiedad 16: Generación de notificaciones por cambio de estado**
    - **Propiedad 17: Conteo y gestión de estado de notificaciones**
    - **Valida: Requisitos 17.1, 17.2, 17.3**

- [x] 6. Checkpoint — Verificar servicios y repositorios
  - Asegurar que todos los tests pasan, preguntar al usuario si surgen dudas.

- [x] 7. Controladores y rutas de la API REST
  - [x] 7.1 Implementar controladores y rutas de autenticación y OTP
    - Crear `backend/src/controllers/auth.controller.ts` con: `loginAdmin`, `refreshToken`, `logout`
    - Crear `backend/src/controllers/otp.controller.ts` con: `requestOTP`, `verifyOTP`, `resendOTP`
    - Crear `backend/src/routes/auth.routes.ts` con rutas POST `/auth/admin/login`, `/auth/admin/refresh`, `/auth/admin/logout`, `/auth/otp/request`, `/auth/otp/verify`, `/auth/otp/resend`
    - _Requisitos: 3.1, 3.2, 8.1, 8.2, 8.3, 8.4, 14.1_

  - [x] 7.2 Implementar controladores y rutas de usuarios y roles
    - Crear `backend/src/controllers/user.controller.ts` con CRUD de usuarios
    - Crear `backend/src/controllers/role.controller.ts` con CRUD de roles y permisos
    - Crear `backend/src/routes/user.routes.ts` y `backend/src/routes/role.routes.ts`
    - Rutas: GET/POST/PUT/DELETE `/users`, `/users/:id`, GET/POST/PUT `/roles`, `/roles/:id`, GET `/permissions`
    - Proteger con JWT + RBAC
    - _Requisitos: 3.1, 7.1, 7.6, 14.2_

  - [x] 7.3 Implementar controladores y rutas de clientes
    - Crear `backend/src/controllers/client.controller.ts` con: `getAll`, `getById`, `getByDocument`, `create`, `update`, `delete` y sub-recursos (addresses, documents, orders, requests)
    - Crear `backend/src/routes/client.routes.ts` con todas las rutas de clientes
    - Rutas: GET/POST/PUT/DELETE `/clients`, GET `/clients/document/:type/:number`, GET/POST `/clients/:id/addresses`, GET `/clients/:id/documents`, `/clients/:id/orders`, `/clients/:id/requests`
    - _Requisitos: 3.1, 7.1, 7.2, 2.5_

  - [x] 7.4 Implementar controladores y rutas de pedidos
    - Crear `backend/src/controllers/order.controller.ts` con: `getAll`, `getById`, `getByClient`, `create`, `updateStatus`
    - Crear `backend/src/routes/order.routes.ts`
    - Rutas: GET/POST `/orders`, GET `/orders/:id`, PUT `/orders/:id/status`, GET `/orders/:id/history`, GET `/orders/:id/items`
    - _Requisitos: 3.1, 7.1, 7.5, 2.6_

  - [x] 7.5 Implementar controladores y rutas de solicitudes/radicación
    - Crear `backend/src/controllers/request.controller.ts` con: `getAll`, `getById`, `getByRadicationNumber`, `create`, `updateStatus`
    - Crear `backend/src/routes/request.routes.ts`
    - Rutas: GET/POST `/requests`, GET `/requests/:id`, GET `/requests/radication/:number`, PUT `/requests/:id/status`, GET `/requests/:id/history`, GET `/requests/:id/files`
    - _Requisitos: 3.1, 6.1, 6.4, 6.5, 6.6_

  - [x] 7.6 Implementar controladores y rutas de documentos
    - Crear `backend/src/controllers/document.controller.ts` con: `upload`, `download`, `getById`, `delete`
    - Crear `backend/src/routes/document.routes.ts`
    - Configurar multer para carga de archivos con límite de 10 MB
    - Rutas: POST `/documents/upload`, GET `/documents/:id/download`, GET `/documents/:id`, DELETE `/documents/:id`
    - _Requisitos: 3.1, 16.1, 16.2, 16.3, 16.4_

  - [x] 7.7 Implementar controladores y rutas de notificaciones
    - Crear `backend/src/controllers/notification.controller.ts` con: `getByUser`, `getUnreadCount`, `markAsRead`, `markAllAsRead`
    - Crear `backend/src/routes/notification.routes.ts`
    - Rutas: GET `/notifications`, GET `/notifications/unread/count`, PUT `/notifications/:id/read`, PUT `/notifications/read-all`
    - _Requisitos: 3.1, 17.1, 17.2, 17.3_

  - [x] 7.8 Implementar controladores y rutas de testimonios y experiencias
    - Crear `backend/src/controllers/testimonial.controller.ts` con CRUD y endpoint público
    - Crear `backend/src/routes/testimonial.routes.ts`
    - Rutas: GET `/testimonials` (público), POST/PUT/DELETE `/testimonials` (JWT+RBAC), GET/POST `/experiences`
    - _Requisitos: 3.1, 10.1, 10.5_

  - [x] 7.9 Implementar controladores y rutas de analítica
    - Crear `backend/src/controllers/analytics.controller.ts` con: `getDashboard`, `getMetrics`, `trackEvent`, `getEvents`
    - Crear `backend/src/routes/analytics.routes.ts`
    - Rutas: GET `/analytics/dashboard`, GET `/analytics/metrics`, POST `/analytics/events`, GET `/analytics/events`
    - _Requisitos: 3.1, 9.1, 9.2, 9.4_

  - [x] 7.10 Implementar controladores y rutas de auditoría y logs
    - Crear `backend/src/controllers/audit.controller.ts` con listado filtrable de audit_logs y activity_logs
    - Crear `backend/src/routes/audit.routes.ts`
    - Rutas: GET `/audit-logs`, GET `/activity-logs` con filtros por usuario, acción, fecha, módulo
    - _Requisitos: 3.1, 7.4, 14.5_

  - [x] 7.11 Registrar todas las rutas bajo el prefijo /api/v1/ en app.ts
    - Montar todos los routers en `backend/src/app.ts` bajo `/api/v1/`
    - Aplicar middleware en orden: cors, helmet, json, rate-limiter, auth, rbac, validation, audit, error-handler
    - _Requisitos: 3.1, 3.2_

- [x] 8. Integraciones externas (Chatbot IA, WhatsApp, n8n)
  - [x] 8.1 Implementar servicio y controlador del Chatbot IA
    - Crear `backend/src/integrations/openai.ts` con cliente OpenAI configurado (GPT-4)
    - Crear `backend/src/services/chatbot.service.ts` con: envío de mensaje, persistencia de conversación, escalación a agente
    - Crear `backend/src/controllers/chatbot.controller.ts` con: `sendMessage`, `getConversation`, `getConversations`, `escalate`
    - Crear `backend/src/routes/chatbot.routes.ts`
    - Timeout de 10 segundos, fallback a respuesta predefinida
    - Registrar cada conversación en `chatbot_conversations` y cada mensaje en `chatbot_messages`
    - _Requisitos: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 8.2 Implementar servicio y controlador de WhatsApp
    - Crear `backend/src/integrations/whatsapp.ts` con cliente Meta Cloud API
    - Crear `backend/src/services/whatsapp.service.ts` con: recepción de mensajes, envío, clasificación de intención, procesamiento de documentos adjuntos
    - Crear `backend/src/controllers/whatsapp.controller.ts` con: `receiveMessage` (webhook), `sendMessage`, `getConversations`
    - Crear `backend/src/routes/whatsapp.routes.ts`
    - Almacenar mensajes en `whatsapp_messages` con sessionId, cliente, contenido, teléfono, timestamp
    - _Requisitos: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 8.3 Implementar servicio y controlador de webhooks n8n
    - Crear `backend/src/services/webhook.service.ts` con: `sendWebhook`, `retryWebhook`, `scheduleRetry`, `validateIdempotencyKey`
    - Crear `backend/src/controllers/webhook.controller.ts` con: `triggerEvent`, `getEventStatus`, `retryEvent`
    - Crear `backend/src/routes/webhook.routes.ts`
    - Implementar reintentos con backoff exponencial (1s, 5s, 15s)
    - Registrar fallo definitivo en `audit_logs` tras 3 reintentos
    - Validar clave de idempotencia para evitar duplicados
    - Payload JSON con: tipo de evento, timestamp, eventId, datos, clave de idempotencia
    - _Requisitos: 13.1, 13.2, 13.3, 13.4, 13.5_

  - [x] 8.4 Implementar servicio de email (Nodemailer)
    - Crear `backend/src/utils/email.ts` con configuración Nodemailer y plantillas HTML
    - Plantillas para: OTP, confirmación de radicación, notificaciones
    - Timeout de 15 segundos, cola de reintentos (hasta 3 intentos)
    - _Requisitos: 6.5, 8.2_

  - [x] 8.5 Tests de propiedades para persistencia del chatbot
    - **Propiedad 21: Persistencia de mensajes del chatbot**
    - **Valida: Requisitos 5.4**

  - [ ]* 8.6 Tests de propiedades para trazabilidad WhatsApp
    - **Propiedad 22: Trazabilidad de conversaciones WhatsApp**
    - **Valida: Requisitos 4.5**

  - [ ]* 8.7 Tests de propiedades para webhooks n8n
    - **Propiedad 18: Estructura de payload de webhooks n8n**
    - **Propiedad 19: Reintentos de webhook con backoff exponencial**
    - **Propiedad 20: Idempotencia de procesamiento de webhooks**
    - **Valida: Requisitos 13.2, 13.3, 13.4, 13.5**

- [x] 9. Checkpoint — Verificar API REST completa e integraciones
  - Asegurar que todos los tests pasan, preguntar al usuario si surgen dudas.

- [x] 10. Servicio de analítica y datos simulados
  - [x] 10.1 Implementar servicio de analítica
    - Crear `backend/src/services/analytics.service.ts` con: `trackEvent`, `getDashboardData`, `getMetrics`, `generateSimulatedData`
    - Capturar métricas: visitas, usuarios únicos, páginas más visitadas, tasa de conversión, formularios enviados, solicitudes radicadas, pedidos, tiempo de respuesta, fuente de tráfico, clics, interacciones chatbot, mensajes WhatsApp, tasa OTP, clientes nuevos vs recurrentes, embudo de conversión, comportamiento por dispositivo
    - _Requisitos: 9.1, 9.4_

  - [x] 10.2 Implementar generación de datos semilla (seed)
    - Crear `backend/src/seeds/seed.ts` con datos simulados realistas:
      - Roles y permisos del sistema (admin, supervisor, operador)
      - 5+ usuarios administradores
      - Tipos de documento (CC, CE, NIT, PP, TI)
      - 50+ clientes con datos completos (direcciones, emails, teléfonos, perfiles)
      - 100+ pedidos con items y historial de estados
      - 50+ solicitudes con historial de estados y archivos adjuntos
      - 10+ testimonios con fotos simuladas, valoraciones y mini casos de éxito
      - 500+ eventos de analítica variados
      - 100+ visitas a páginas
      - 50+ compras
      - 20+ conversaciones de chatbot con mensajes
      - 20+ mensajes de WhatsApp
      - 50+ notificaciones
      - Configuración de integraciones (n8n, whatsapp, openai, smtp)
    - _Requisitos: 9.3, 10.3_

  - [ ]* 10.3 Tests de propiedades para eventos de analítica
    - **Propiedad 23: Registro de eventos de analítica**
    - **Valida: Requisitos 9.4**

- [x] 11. Design System y componentes UI base del frontend
  - [x] 11.1 Implementar sistema de diseño y tokens CSS
    - Crear `frontend/src/app/globals.css` con variables CSS completas: paleta de colores (`--ut-primary`, `--ut-accent`, `--ut-gold`, `--ut-electric`, etc.), tipografía (Inter, JetBrains Mono), espaciado, bordes, sombras, breakpoints
    - Configurar `tailwind.config.ts` con extensiones de colores, fuentes y breakpoints del diseño
    - _Requisitos: 11.1, 11.2_

  - [x] 11.2 Implementar componentes UI base
    - Crear `frontend/src/components/ui/Button.tsx` con variantes: primary, secondary, outline, ghost, danger; tamaños: sm, md, lg; estados: loading, disabled
    - Crear `frontend/src/components/ui/Card.tsx` con variantes: default, elevated, glass, gradient
    - Crear `frontend/src/components/ui/Input.tsx` con label, error, tipos: text, email, password, number, tel
    - Crear `frontend/src/components/ui/Modal.tsx` con tamaños: sm, md, lg, xl
    - Crear `frontend/src/components/ui/DataTable.tsx` con paginación, búsqueda, ordenamiento
    - Crear `frontend/src/components/ui/StatsCard.tsx` para dashboards con tendencia y cambio porcentual
    - Crear componentes adicionales: Badge, Select, Textarea, Tabs, Tooltip, Toast, Spinner, Avatar, Dropdown
    - Implementar animaciones suaves y micro-interacciones con framer-motion
    - _Requisitos: 11.3, 11.4, 11.5_

  - [x] 11.3 Implementar componentes de layout
    - Crear `frontend/src/components/layout/Header.tsx` con variantes: public, admin, portal; navegación, logo, botones de acceso
    - Crear `frontend/src/components/layout/Footer.tsx` con información de contacto, enlaces, redes sociales
    - Crear `frontend/src/components/layout/Sidebar.tsx` para admin y portal con items colapsables, badges, permisos
    - Crear `frontend/src/components/layout/Breadcrumbs.tsx` con navegación contextual
    - Crear `frontend/src/components/layout/MobileMenu.tsx` menú hamburguesa para móvil (<768px)
    - _Requisitos: 11.4, 12.3, 15.5_

  - [x] 11.4 Implementar stores de estado global (Zustand)
    - Crear `frontend/src/stores/auth.store.ts` para estado de autenticación (admin JWT y cliente OTP)
    - Crear `frontend/src/stores/ui.store.ts` para estado de UI (tema, sidebar, modales)
    - Crear `frontend/src/stores/notification.store.ts` para conteo de notificaciones
    - _Requisitos: 8.5, 8.6, 15.1_

  - [x] 11.5 Implementar cliente API y hooks de React Query
    - Crear `frontend/src/lib/api-client.ts` con instancia axios/fetch configurada con base URL `/api/v1/`, interceptores de auth y manejo de errores
    - Crear `frontend/src/hooks/useAuth.ts`, `frontend/src/hooks/useClients.ts`, `frontend/src/hooks/useOrders.ts`, `frontend/src/hooks/useRequests.ts`, `frontend/src/hooks/useNotifications.ts`, `frontend/src/hooks/useAnalytics.ts`
    - Configurar React Query provider en layout raíz
    - _Requisitos: 15.1, 15.2_

- [x] 12. Sitio web principal (páginas públicas)
  - [x] 12.1 Implementar página de inicio con todas las secciones
    - Crear `frontend/src/app/(public)/page.tsx` como página de inicio
    - Crear componentes en `frontend/src/components/home/`:
      - `HeroSection.tsx`: hero con slogan, CTA principal, fondo de alto impacto visual
      - `BrandPresentation.tsx`: presentación de marca UrbanThread AI
      - `ProblemSolution.tsx`: sección problema/solución
      - `MissionSection.tsx`: misión con iconos e infografías
      - `VisionSection.tsx`: visión aspiracional con línea de tiempo y meta 2030
      - `ValuesSection.tsx`: valores en tarjetas con iconos
      - `ValueProposition.tsx`: propuesta de valor
      - `ServicesSection.tsx`: servicios y capacidades
      - `ModulesSection.tsx`: módulos del sistema
      - `TechIntegration.tsx`: integración tecnológica
      - `SustainabilitySection.tsx`: sostenibilidad
      - `TestimonialsSection.tsx`: testimonios con fotos
      - `KPISection.tsx`: métricas/analítica con KPIs operativos
      - `ContactSection.tsx`: contacto y CTAs
    - Botones persistentes de acceso a: Portal Cliente, Panel Admin, Chatbot, WhatsApp
    - _Requisitos: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [x] 12.2 Implementar páginas públicas adicionales
    - Crear `frontend/src/app/(public)/servicios/page.tsx` con detalle de servicios
    - Crear `frontend/src/app/(public)/contacto/page.tsx` con formulario de contacto funcional
    - Crear `frontend/src/app/(public)/testimonios/page.tsx` con galería completa de testimonios
    - Crear `frontend/src/app/not-found.tsx` página 404 con diseño de marca y enlace a inicio
    - _Requisitos: 10.1, 10.2, 10.4, 15.3, 15.4_

  - [x] 12.3 Implementar layout raíz y navegación global
    - Crear `frontend/src/app/layout.tsx` con providers (React Query, Zustand), fuentes (Inter, JetBrains Mono), metadata SEO
    - Implementar navegación con breadcrumbs, menú principal y enlaces contextuales
    - Implementar mapa de sitio completo con todas las rutas definidas
    - _Requisitos: 15.3, 15.5_

- [x] 13. Portal de cliente con autenticación OTP
  - [x] 13.1 Implementar flujo de login OTP del cliente
    - Crear `frontend/src/app/(auth)/cliente/login/page.tsx` con formulario de tipo y número de documento
    - Crear componente de verificación de código OTP de 6 dígitos
    - Implementar lógica de reenvío de OTP, contador de expiración (5 min), mensaje de bloqueo (15 min tras 3 intentos)
    - Conectar con endpoints `/auth/otp/request` y `/auth/otp/verify`
    - _Requisitos: 8.1, 8.2, 8.3, 8.4_

  - [x] 13.2 Implementar layout y páginas del portal de cliente
    - Crear `frontend/src/app/portal/layout.tsx` con sidebar, header de portal, protección de ruta por token OTP
    - Crear `frontend/src/app/portal/perfil/page.tsx` con perfil completo: datos personales, direcciones, correos, teléfonos, actualización de información permitida
    - Crear `frontend/src/app/portal/pedidos/page.tsx` con historial de pedidos, detalle, seguimiento de estados
    - Crear `frontend/src/app/portal/solicitudes/page.tsx` con historial de solicitudes, seguimiento por número de radicación
    - Crear `frontend/src/app/portal/documentos/page.tsx` con listado, carga y descarga de documentos
    - Crear `frontend/src/app/portal/notificaciones/page.tsx` con listado de notificaciones, conteo de no leídas, marcar como leída
    - Implementar expiración de sesión tras 30 minutos de inactividad
    - _Requisitos: 8.5, 8.6, 17.2, 17.3, 16.1, 16.2_

  - [x] 13.3 Implementar módulo de radicación (flujo de 12 pasos)
    - Crear `frontend/src/app/portal/radicacion/page.tsx` con componente stepper
    - Crear `frontend/src/components/radicacion/RadicacionStepper.tsx` con los 12 pasos:
      1. Selección de tipo de documento
      2. Ingreso de número de documento
      3. Consulta a base de datos (loading, autocompletado en <2s)
      4. Carga automática de información del cliente
      5. Autocompletado de campos
      6. Adjunción automática de documentos asociados
      7. Carga de nuevos archivos
      8. Registro de solicitud
      9. Generación de número de radicación
      10. Envío de confirmación por email
      11. Disparo de flujo n8n
      12. Habilitación de seguimiento
    - Manejar caso de cliente no encontrado (registro manual)
    - _Requisitos: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [x] 14. Panel de administración
  - [x] 14.1 Implementar login de administrador y layout del panel
    - Crear `frontend/src/app/(auth)/admin/login/page.tsx` con formulario email/password
    - Crear `frontend/src/app/admin/layout.tsx` con sidebar, header admin, protección por JWT+RBAC
    - Implementar navegación del sidebar con items: Dashboard, Usuarios, Clientes, Pedidos, Solicitudes, Documentos, Testimonios, Analítica, Chatbot, Integraciones, Auditoría, Configuración
    - Restringir items del sidebar según permisos del rol
    - _Requisitos: 7.1, 7.6, 14.1, 14.2_

  - [x] 14.2 Implementar páginas CRUD del panel de administración
    - Crear `frontend/src/app/admin/usuarios/page.tsx` con DataTable, crear/editar/eliminar usuarios, asignar roles
    - Crear `frontend/src/app/admin/clientes/page.tsx` con DataTable, búsqueda por documento, vista detallada completa (datos, direcciones, correos, teléfonos, documentos, pedidos, solicitudes)
    - Crear `frontend/src/app/admin/pedidos/page.tsx` con DataTable, detalle de pedido, cambio de estado con historial
    - Crear `frontend/src/app/admin/solicitudes/page.tsx` con DataTable, detalle de solicitud, cambio de estado con historial
    - Crear `frontend/src/app/admin/documentos/page.tsx` con gestión de documentos
    - Crear `frontend/src/app/admin/testimonios/page.tsx` con CRUD de testimonios y experiencias
    - _Requisitos: 7.1, 7.2, 7.5_

  - [x] 14.3 Implementar dashboard de analítica en el panel admin
    - Crear `frontend/src/app/admin/analitica/page.tsx` con dashboard completo
    - Crear componentes en `frontend/src/components/analitica/`:
      - `DashboardCards.tsx`: tarjetas de resumen (visitas, usuarios, conversión, pedidos, solicitudes)
      - `BarChart.tsx`, `LineChart.tsx`, `PieChart.tsx`: gráficos con recharts
      - `MetricsTable.tsx`: tabla de métricas detalladas
      - `DateFilter.tsx`: filtros por fecha, canal, estado
      - `FunnelChart.tsx`: embudo de conversión
      - `DeviceBreakdown.tsx`: comportamiento por dispositivo
    - Implementar auto-refresh cada 60 segundos sin recarga de página
    - Mostrar datos simulados cuando no hay datos de producción
    - _Requisitos: 9.1, 9.2, 9.3, 9.5_

  - [x] 14.4 Implementar páginas de auditoría, integraciones y configuración
    - Crear `frontend/src/app/admin/auditoria/page.tsx` con logs de auditoría y actividad, filtros por usuario, acción, fecha, módulo
    - Crear `frontend/src/app/admin/integraciones/page.tsx` con configuración de n8n, WhatsApp, OpenAI, SMTP
    - Crear `frontend/src/app/admin/chatbot/page.tsx` con gestión de conversaciones del chatbot, preguntas frecuentes
    - Crear `frontend/src/app/admin/configuracion/page.tsx` con configuración general de la plataforma
    - _Requisitos: 7.3, 7.4_

- [x] 15. Checkpoint — Verificar frontend completo
  - Asegurar que todos los tests pasan, preguntar al usuario si surgen dudas.

- [x] 16. Widget del Chatbot IA (frontend)
  - [x] 16.1 Implementar widget flotante del chatbot
    - Crear `frontend/src/components/chatbot/ChatbotWidget.tsx` como componente flotante (bottom-right)
    - Implementar interfaz de chat: lista de mensajes, input de texto, botón enviar, indicador de "escribiendo"
    - Diseño premium coherente con paleta de colores y tipografía de la marca (gradiente `--ut-electric`)
    - Conectar con endpoint `/chatbot/message`
    - Disponible en todas las páginas (incluir en layout raíz)
    - _Requisitos: 5.1, 5.2, 5.3, 5.6_

  - [x] 16.2 Implementar store y lógica del chatbot
    - Crear `frontend/src/stores/chatbot.store.ts` con estado: isOpen, messages, conversationId, isTyping
    - Implementar acciones: toggle, sendMessage, clearConversation
    - Manejar escalación a agente humano con creación de ticket
    - _Requisitos: 5.4, 5.5_

- [x] 17. Diseño responsivo completo
  - [x] 17.1 Implementar responsive design en todos los componentes y páginas
    - Ajustar todos los componentes para breakpoints: móvil (320px-767px), tablet (768px-1023px), laptop (1024px-1439px), escritorio (1440px+)
    - Implementar menú hamburguesa en dispositivos <768px
    - Asegurar funcionalidad completa en cada breakpoint sin pérdida de características
    - Optimizar rendimiento de carga para móvil (FCP <2s en 4G)
    - Verificar DataTable, formularios, stepper de radicación, dashboards y chatbot en todos los breakpoints
    - _Requisitos: 12.1, 12.2, 12.3, 12.4_

- [x] 18. Validación de formularios frontend y conexión completa
  - [x] 18.1 Implementar validación de formularios en frontend con Zod
    - Validar todos los formularios con esquemas Zod compartidos desde `shared/schemas/`
    - Mostrar errores por campo antes de enviar a la API
    - Formularios: login admin, login OTP, verificación OTP, crear/editar cliente, crear pedido, crear solicitud, cargar documento, crear testimonio, contacto, radicación (12 pasos)
    - _Requisitos: 15.2, 14.4_

  - [x] 18.2 Conectar todos los botones, formularios y rutas
    - Verificar que cada botón visible tiene acción funcional: navegación, estado de carga, validación, confirmación/error, retroalimentación visual
    - Verificar que cada formulario envía datos a la API correspondiente y muestra resultado
    - Verificar navegación completa: breadcrumbs, menú principal, enlaces contextuales, página 404
    - _Requisitos: 15.1, 15.2, 15.3, 15.4, 15.5_

  - [ ]* 18.3 Tests de propiedades para validación de formularios
    - **Propiedad 24: Validación de formularios en frontend y backend**
    - **Valida: Requisitos 15.2**

- [x] 19. Tracking de analítica en frontend
  - [x] 19.1 Implementar captura de eventos de analítica en el frontend
    - Crear `frontend/src/lib/analytics.ts` con funciones de tracking: `trackPageVisit`, `trackClick`, `trackFormSubmit`, `trackChatbotInteraction`
    - Integrar tracking en todas las páginas y componentes interactivos
    - Enviar eventos al endpoint POST `/analytics/events`
    - Capturar: tipo de evento, timestamp, userId, página de origen, dispositivo, fuente de tráfico, metadatos
    - _Requisitos: 9.4_

- [x] 20. Checkpoint — Verificar plataforma completa integrada
  - Asegurar que todos los tests pasan, preguntar al usuario si surgen dudas.

- [x] 21. Datos semilla y verificación final
  - [x] 21.1 Ejecutar seed de datos simulados y verificar dashboards
    - Ejecutar script de seed para poblar la base de datos con datos realistas
    - Verificar que los dashboards de analítica muestran datos correctamente
    - Verificar que los testimonios se muestran en la página pública
    - Verificar que la búsqueda de clientes por documento funciona con datos semilla
    - Verificar KPIs operativos en la página de inicio
    - _Requisitos: 9.3, 10.3, 1.7_

- [x] 22. Checkpoint final — Verificar toda la plataforma
  - Asegurar que todos los tests pasan, preguntar al usuario si surgen dudas.

## Notas

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia los requisitos específicos que implementa para trazabilidad
- Los checkpoints aseguran validación incremental del progreso
- Los tests de propiedades validan las 24 propiedades de correctitud universales definidas en el diseño
- Los tests unitarios validan ejemplos específicos y casos borde
- El stack completo es TypeScript: Next.js 14 (frontend), Express.js (backend), Prisma (ORM), PostgreSQL (BD), Vitest + fast-check (testing)
- Los esquemas Zod compartidos en `shared/` garantizan consistencia de validación entre frontend y backend
