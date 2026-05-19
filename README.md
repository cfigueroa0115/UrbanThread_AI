# UrbanThread AI

**Plataforma Smart Commerce — Tejiendo experiencias inteligentes**

UrbanThread AI es una plataforma de comercio electrónico premium enfocada en moda sostenible, con integración de inteligencia artificial, automatización de procesos (n8n) y experiencia de usuario de alta calidad.

---

## 🌐 URLs de Producción

### Aplicaciones principales

| Componente | URL |
|---|---|
| **Frontend (Producción)** | https://urban-thread-ai-frontend-wine.vercel.app |
| **Backend API** | https://urban-thread-ai-backend-tau.vercel.app |
| **GitHub (Repositorio)** | https://github.com/cfigueroa0115/UrbanThread_AI |
| **Vercel Dashboard (Frontend)** | https://vercel.com/carlos-figueroas-projects-77a0a373/urban-thread-ai-frontend |
| **Vercel Dashboard (Backend)** | https://vercel.com/carlos-figueroas-projects-77a0a373/urban-thread-ai-backend |
| **Neon DB (PostgreSQL)** | https://console.neon.tech |
| **n8n Webhook** | https://segurobolivar-trial.app.n8n.cloud/webhook/numero_de_identifica |

### Páginas del sitio

| Página | URL |
|---|---|
| Inicio | https://urban-thread-ai-frontend-wine.vercel.app |
| Quiénes Somos | https://urban-thread-ai-frontend-wine.vercel.app/quienes-somos |
| Sostenibilidad | https://urban-thread-ai-frontend-wine.vercel.app/sostenibilidad |
| Servicios | https://urban-thread-ai-frontend-wine.vercel.app/servicios |
| Testimonios | https://urban-thread-ai-frontend-wine.vercel.app/testimonios |
| Contacto | https://urban-thread-ai-frontend-wine.vercel.app/contacto |
| Portal Cliente (Login) | https://urban-thread-ai-frontend-wine.vercel.app/cliente/login |
| Portal Cliente | https://urban-thread-ai-frontend-wine.vercel.app/portal |
| Perfil | https://urban-thread-ai-frontend-wine.vercel.app/portal/perfil |
| Pedidos | https://urban-thread-ai-frontend-wine.vercel.app/portal/pedidos |
| Solicitudes | https://urban-thread-ai-frontend-wine.vercel.app/portal/solicitudes |
| Radicación | https://urban-thread-ai-frontend-wine.vercel.app/portal/radicacion |
| Documentos | https://urban-thread-ai-frontend-wine.vercel.app/portal/documentos |
| Notificaciones | https://urban-thread-ai-frontend-wine.vercel.app/portal/notificaciones |
| Admin (Login) | https://urban-thread-ai-frontend-wine.vercel.app/admin/login |
| Panel Admin | https://urban-thread-ai-frontend-wine.vercel.app/admin |
| Checkout | https://urban-thread-ai-frontend-wine.vercel.app/checkout |

### API Endpoints

| Endpoint | Método | URL |
|---|---|---|
| Health Check | GET | /api/v1/health |
| Validar Documento | POST | /api/v1/auth/validate-document |
| Solicitar OTP | POST | /api/v1/auth/otp/request |
| Verificar OTP | POST | /api/v1/auth/otp/verify |
| Reenviar OTP | POST | /api/v1/auth/otp/resend |
| Registrar Cliente | POST | /api/v1/auth/register-client |
| Perfil Cliente | GET | /api/v1/clients/me |
| Pedidos | GET/POST | /api/v1/orders |
| Solicitudes | GET/POST | /api/v1/requests |
| Actualizar Estado | PUT | /api/v1/requests/status |
| Notificaciones | GET | /api/v1/notifications |
| No leídas | GET | /api/v1/notifications/unread/count |
| Documentos | GET | /api/v1/documents |
| Testimonios | GET | /api/v1/testimonials |
| Chatbot | POST | /api/v1/chatbot/message |

---

## 🏗️ Arquitectura del Proyecto

```
UrbanThread AI/
├── frontend/          → Next.js 14 (React 18, TailwindCSS)
├── backend/           → Express.js (TypeScript, Prisma ORM)
├── shared/            → Constantes, schemas y tipos compartidos
├── package.json       → Monorepo con npm workspaces
└── .gitignore         → Exclusiones de seguridad
```

| Componente | Tecnología | Puerto Local |
|---|---|---|
| Frontend | Next.js 14 + TailwindCSS | 3000 |
| Backend API | Express.js + TypeScript | 4000 |
| Base de datos | PostgreSQL (Prisma ORM) | 5432 |
| DB Producción | Neon PostgreSQL (serverless) | — |
| Automatización | n8n Webhooks | Externo |
| AI Chatbot | Google Gemini 2.0 Flash | — |

---

## 🚀 Instalación y Despliegue Local

### Requisitos previos
- Node.js >= 20.0.0
- npm (incluido con Node.js)

### 1. Clonar el repositorio
```bash
git clone https://github.com/cfigueroa0115/UrbanThread_AI.git
cd UrbanThread_AI
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp backend/.env.example backend/.env
# Editar backend/.env con tus credenciales
```

### 4. Iniciar la base de datos PostgreSQL
```bash
cd backend
npx tsx scripts/start-db.ts
```

### 5. Ejecutar migraciones y seed
```bash
cd backend
npx prisma migrate deploy
npx tsx src/seeds/seed.ts
```

### 6. Iniciar el Backend
```bash
cd backend
npm run dev
```

### 7. Iniciar el Frontend
```bash
cd frontend
npm run dev
```

---

## 📋 Funcionalidades Principales

### 🛍️ Tienda Online
- Colecciones: Mujer, Hombre, Niños (6-14 años), Beauty, Accesorios
- Catálogo con filtros por talla, color y categoría
- Carrito de compras con checkout completo
- Imágenes locales optimizadas para cada producto
- Precios en pesos colombianos

### 👤 Portal del Cliente
- Autenticación segura con OTP (código de 6 dígitos por email)
- Validación de documento de identidad con webhook n8n
- Gestión de pedidos y seguimiento con estados dinámicos
- Radicación de solicitudes con flujo de pago integrado
- Gestión de documentos (recibidos desde n8n/Google Drive)
- Visor universal de documentos (PDF, DOCX, imágenes)
- Sugerencia de vestimenta según clima de la ciudad
- Notificaciones en tiempo real
- Spinner de carga premium con diseño glassmorphism

### 🔐 Panel de Administración
- Dashboard con métricas y analítica
- Gestión de clientes, pedidos y solicitudes
- Auditoría de operaciones
- Configuración del sistema
- Gestión de testimonios
- Integraciones (WhatsApp, n8n)

### 🤖 Agente IA — Zyla
- Chatbot con Google Gemini 2.0 Flash
- Base de conocimiento con 300+ respuestas predefinidas
- Reconocimiento de voz continuo (espera silencio antes de enviar)
- Respuestas por voz con síntesis de habla en español colombiano
- Precios siempre en pesos colombianos
- Cierre cordial: "¿Puedo ayudarte en algo más?"
- Disponible 24/7

### 🌿 Sostenibilidad
- Página dedicada a prácticas sostenibles
- Productos con badge "Eco"
- Materiales reciclados y procesos de bajo impacto

### 📄 Documentos (n8n + Google Drive)
- Webhook n8n captura documentos automáticamente
- Almacenamiento en base de datos Neon
- Visor universal con Google Drive viewer
- Descarga directa de cualquier tipo de archivo
- Actualización automática (siempre última versión)

### 💳 Flujo de Pago y Estados
- Radicación → Registrada → Pagada → En preparación → Enviada → Entregada → Recibida → Cerrada
- Temporizador automático de progresión de estados
- Integración con carrito de compras desde radicación

---

## 🔗 Integraciones

### n8n Webhook
- **URL:** `https://segurobolivar-trial.app.n8n.cloud/webhook/numero_de_identifica`
- **Trigger:** Al hacer clic en "Validar documento" en el Portal Cliente
- **Datos enviados:**
  ```json
  {
    "Tipodocumento": "Cédula de Ciudadanía",
    "Numerodocumento": "1234567890"
  }
  ```
- **Response capturado:** Datos del cliente + documentos de Google Drive
- **Documentos:** Se guardan automáticamente en la BD asociados al cliente

### Google Gemini AI
- Modelo: gemini-2.0-flash
- Respuestas contextuales sobre UrbanThread AI
- System prompt con información completa de la empresa

### Email (SMTP - Ethereal)
- Envío de códigos OTP
- Preview URL para verificar correos en desarrollo

---

## 🗄️ Base de Datos

### Producción (Neon PostgreSQL)
- **Host:** ep-plain-cell-apfj0gcz-pooler.c-7.us-east-1.aws.neon.tech
- **Database:** neondb
- **Region:** US East 1
- **Clientes:** 62
- **Tablas:** 32

### Modelos principales
- **Autenticación:** Users, Roles, Permissions, OTP tokens
- **Clientes:** Clients, Addresses, Emails, Phones, Documents, Profiles
- **Pedidos:** Orders, OrderItems, OrderStatus
- **Solicitudes:** Requests, RequestStatus, AttachedFiles
- **Contenido:** Testimonials, Products, Collections
- **Sistema:** AuditLogs, Notifications, ChatbotSessions
- **Integraciones:** Webhooks, WhatsappMessages

---

## 🛡️ Seguridad

- JWT (jose) para autenticación de sesiones
- Rate limiting (100 req/15min por IP)
- Helmet.js para headers HTTP seguros
- Sanitización de inputs (prevención XSS/injection)
- CORS configurado
- OTP con expiración (5 min) y bloqueo por intentos fallidos
- Auditoría de operaciones de escritura

---

## 📁 Estructura del Frontend

```
frontend/src/
├── app/                   → Pages (App Router Next.js 14)
│   ├── (auth)/            → Login cliente y admin
│   ├── (public)/          → Páginas públicas + checkout
│   ├── admin/             → Panel de administración
│   ├── portal/            → Portal del cliente
│   └── api/v1/            → API Routes (Prisma + Neon)
├── components/            → Componentes reutilizables
│   ├── ui/                → Design system (Button, Card, Spinner...)
│   ├── home/              → Secciones de la página principal
│   ├── layout/            → Header, Footer, Sidebar, MobileMenu
│   ├── cart/              → Carrito de compras
│   ├── chatbot/           → Widget de chatbot Zyla
│   └── radicacion/        → Formulario de radicación
├── data/                  → Productos y knowledge base
├── hooks/                 → Custom hooks (React Query)
├── lib/                   → API client, Prisma, analytics
└── stores/                → Estado global (Zustand)
```

---

## 📁 Estructura del Backend

```
backend/src/
├── app.ts                 → Entry point del servidor
├── config/                → Variables de entorno
├── controllers/           → Lógica de request/response
├── middleware/            → Auth, rate-limit, sanitization, audit
├── repositories/          → Acceso a datos (Prisma)
├── routes/                → Definición de endpoints
├── services/              → Lógica de negocio
├── integrations/          → OpenAI, WhatsApp
├── seeds/                 → Datos iniciales
└── utils/                 → JWT, crypto, email, errors
```

---

## 🧪 Testing

```bash
# Backend
cd backend
npm test              # Tests unitarios e integración
npm run test:coverage # Con cobertura

# Frontend
cd frontend
npm test              # Tests de componentes
```

---

## 📦 Scripts del Monorepo

```bash
npm run dev:frontend     # Iniciar frontend en desarrollo
npm run dev:backend      # Iniciar backend en desarrollo
npm run build            # Build completo (shared + backend + frontend)
npm run test             # Tests en todos los workspaces
```

---

## 🛠️ Variables de Entorno

### Backend (.env)
| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Conexión PostgreSQL (Neon en producción) |
| `JWT_SECRET` | Secreto para tokens JWT |
| `GEMINI_API_KEY` | API key de Google Gemini (chatbot) |
| `SMTP_*` | Configuración de email (Ethereal) |
| `CORS_ORIGIN` | Origen permitido para CORS |
| `N8N_WEBHOOK_BASE_URL` | URL base de n8n |

### Frontend (Vercel)
| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Conexión Neon PostgreSQL |
| `JWT_SECRET` | Secreto para verificar tokens |
| `GEMINI_API_KEY` | Google Gemini para chatbot |
| `NEXT_PUBLIC_API_URL` | URL del backend |
| `SMTP_*` | Configuración email para OTP |

---

## 🔄 Sincronización Automática

El proyecto tiene un hook configurado que al terminar cada tarea:
1. Detecta cambios en git
2. Hace commit y push a GitHub
3. Despliega frontend y backend en Vercel automáticamente

---

## 👥 Clientes de Prueba

| Documento | Nombre | Ciudad | Tipo |
|---|---|---|---|
| 1129564302 | Carlos Alberto Figueroa Martinez | Bogotá | Premium |
| 1020061911 | Catalina García Ramírez | Bogotá | Premium |
| 110102194 | Andrea Medina Rivera | Medellín | Frecuente |
| 484857644 | Sergio Cruz Díaz | Bucaramanga | Estandar |
| 1018439422 | Sandra Yaquelin Caranton Rodriguez | Bogotá | Estandar |
| 1016963174 | Angie Tatiana Ortega Vargas | Bogotá | Frecuente |

---

## 👥 Autor

**Carlos Figueroa** — [@cfigueroa0115](https://github.com/cfigueroa0115)

---

## 📄 Licencia

Proyecto privado — Todos los derechos reservados.
