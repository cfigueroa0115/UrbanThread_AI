# UrbanThread AI

**Plataforma Smart Commerce — Tejiendo experiencias inteligentes para Smart Cities**

UrbanThread AI es una plataforma de comercio electrónico premium enfocada en moda sostenible, con integración de inteligencia artificial (Google Gemini 2.0 Flash), automatización de procesos (n8n), identidad digital (OTP), trazabilidad completa, operación cero papel y experiencia de usuario de alta calidad. Diseñada como infraestructura digital para ciudades inteligentes.

---

## 🌐 URLs de Producción

### Aplicaciones principales

| Componente | URL |
|---|---|
| **Frontend (Producción)** | https://urban-thread-ai-frontend-wine.vercel.app |
| **Backend API** | https://urban-thread-ai-backend-tau.vercel.app |
| **Executive Insights** | https://urban-thread-ai-frontend-wine.vercel.app/insights |
| **Pitch Demo** | https://urban-thread-ai-frontend-wine.vercel.app/insights/demo |
| **GitHub (Repositorio)** | https://github.com/cfigueroa0115/UrbanThread_AI |
| **Vercel Dashboard (Frontend)** | https://vercel.com/carlos-figueroas-projects-77a0a373/urban-thread-ai-frontend |
| **Vercel Dashboard (Backend)** | https://vercel.com/carlos-figueroas-projects-77a0a373/urban-thread-ai-backend |
| **Neon DB (PostgreSQL)** | https://console.neon.tech |
| **n8n Webhook** | https://segurobolivar-trial.app.n8n.cloud/webhook/numero_de_identifica |

### Páginas del sitio (24 rutas)

| Página | URL |
|---|---|
| Inicio | https://urban-thread-ai-frontend-wine.vercel.app |
| Quiénes Somos | https://urban-thread-ai-frontend-wine.vercel.app/quienes-somos |
| Sostenibilidad | https://urban-thread-ai-frontend-wine.vercel.app/sostenibilidad |
| Servicios | https://urban-thread-ai-frontend-wine.vercel.app/servicios |
| Executive Insights | https://urban-thread-ai-frontend-wine.vercel.app/insights |
| Insights Demo (Pitch) | https://urban-thread-ai-frontend-wine.vercel.app/insights/demo |
| Testimonios | https://urban-thread-ai-frontend-wine.vercel.app/testimonios |
| Contacto | https://urban-thread-ai-frontend-wine.vercel.app/contacto |
| Colección Mujer | https://urban-thread-ai-frontend-wine.vercel.app/coleccion/mujer |
| Colección Hombre | https://urban-thread-ai-frontend-wine.vercel.app/coleccion/hombre |
| Colección Niños | https://urban-thread-ai-frontend-wine.vercel.app/coleccion/ninos |
| Colección Beauty | https://urban-thread-ai-frontend-wine.vercel.app/coleccion/beauty |
| Colección Accesorios | https://urban-thread-ai-frontend-wine.vercel.app/coleccion/accesorios |
| Checkout | https://urban-thread-ai-frontend-wine.vercel.app/checkout |
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

### API Endpoints

| Endpoint | Método | Descripción |
|---|---|---|
| `/api/v1/health` | GET | Health check con estado de DB |
| `/api/v1/auth/validate-document` | POST | Validar documento vía n8n + DB |
| `/api/v1/auth/otp/request` | POST | Solicitar código OTP |
| `/api/v1/auth/otp/verify` | POST | Verificar código OTP |
| `/api/v1/auth/otp/resend` | POST | Reenviar código OTP |
| `/api/v1/auth/register-client` | POST | Registrar nuevo cliente |
| `/api/v1/clients/me` | GET | Perfil del cliente autenticado |
| `/api/v1/orders` | GET/POST | Gestión de pedidos |
| `/api/v1/requests` | GET/POST | Gestión de solicitudes |
| `/api/v1/requests/status` | PUT | Actualizar estado solicitud |
| `/api/v1/notifications` | GET | Notificaciones del cliente |
| `/api/v1/notifications/unread/count` | GET | Contador no leídas |
| `/api/v1/documents` | GET | Documentos del cliente |
| `/api/v1/testimonials` | GET | Testimonios públicos |
| `/api/v1/chatbot/message` | POST | Enviar mensaje a Zyla (Gemini) |
| `/api/v1/public/insights` | GET | Executive Insights (live/demo) |

---

## 🏗️ Arquitectura del Proyecto

```
UrbanThread AI/
├── frontend/          → Next.js 14 (React 18, TailwindCSS, Framer Motion)
├── backend/           → Express.js (TypeScript, Prisma ORM, tsc-alias)
├── shared/            → Constantes, schemas Zod y tipos compartidos
├── package.json       → Monorepo con npm workspaces
└── .gitignore         → Exclusiones de seguridad
```

| Componente | Tecnología | Puerto Local |
|---|---|---|
| Frontend | Next.js 14 + TailwindCSS + Framer Motion | 3000 |
| Backend API | Express.js + TypeScript + tsc-alias | 4000 |
| Base de datos | PostgreSQL (Prisma ORM) | 5432 |
| DB Producción | Neon PostgreSQL (serverless) | — |
| Automatización | n8n Webhooks | Externo |
| AI Chatbot | Google Gemini 2.0 Flash | — |
| State Management | Zustand + React Query | — |
| Validación | Zod (shared schemas) | — |
| Testing | Vitest + Testing Library + fast-check | — |

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
- Diseño responsive (móvil, tablet, desktop)

### 👤 Portal del Cliente
- Autenticación segura con OTP (código de 6 dígitos por email)
- Validación de documento de identidad con webhook n8n
- Gestión de pedidos y seguimiento con estados dinámicos
- Radicación de solicitudes con flujo de pago integrado
- Gestión de documentos (recibidos desde n8n/Google Drive)
- Visor universal de documentos (PDF, DOCX, imágenes)
- Sugerencia de vestimenta según clima de la ciudad
- Notificaciones en tiempo real
- Bottom navigation móvil con acceso a todas las secciones
- Spinner de carga premium con diseño glassmorphism

### 🔐 Panel de Administración
- Dashboard con métricas y analítica
- Gestión de clientes, pedidos y solicitudes
- Auditoría de operaciones
- Configuración del sistema
- Gestión de testimonios
- Integraciones (WhatsApp, n8n)
- Chatbot management

### 🤖 Agente IA — Zyla
- Chatbot con Google Gemini 2.0 Flash
- Base de conocimiento con 300+ respuestas predefinidas
- Reconocimiento de voz continuo (espera 1.5s de silencio antes de enviar)
- Respuestas por voz con síntesis de habla en español colombiano (voz femenina, pitch 1.4)
- Precios siempre en pesos colombianos
- Cierre cordial: "¿Puedo ayudarte en algo más?"
- Disponible 24/7
- Fallback inteligente con keywords si Gemini no responde

### 📊 Executive Insights (Command Center)
- Dashboard ejecutivo premium de inteligencia operativa
- Métricas Smart City: cero papel, CO₂ evitado, trazabilidad, automatización IA
- KPIs operacionales: visitas, conversiones, pedidos, OTP, interacciones Zyla
- Periodos dinámicos (Hoy / 7 días / 30 días / Mes) con animated counters
- Funnel comercial: visitas → Zyla → solicitudes → pedidos
- Gráficas de tendencia y distribución por canal
- AI Executive Recommendations
- Smart City Contribution con readiness index
- Sustainability & Paperless Operations block
- Executive Highlights grid
- Modo Live (datos reales de Neon) + Modo Demo (fallback consistente)
- Vista Pitch Mode (/insights/demo) con simulación interactiva
- Simulador de escenarios: sliders, toggles, cálculos en tiempo real
- Optimizado para proyección en videobeam

### 🌿 Sostenibilidad
- Página dedicada con animaciones permanentes (floating, shimmer, glow)
- Ejes estratégicos: Reducción de papel, Digitalización, Baja huella, Eficiencia, Economía circular, Transparencia
- Smart City Pillars: Comercio conectado, Experiencia ciudadana, Eficiencia urbana, Inclusión digital
- Dashboard ambiental con métricas de impacto
- Tarjetas con movimiento autónomo constante (no solo hover)

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
- Temperature: 0.7, maxOutputTokens: 300

### Email (SMTP - Ethereal)
- Envío de códigos OTP de 6 dígitos
- Preview URL para verificar correos en desarrollo
- Expiración: 5 minutos
- Máximo 3 intentos antes de bloqueo

---

## 🗄️ Base de Datos

### Producción (Neon PostgreSQL)
- **Host:** ep-plain-cell-apfj0gcz-pooler.c-7.us-east-1.aws.neon.tech
- **Database:** neondb
- **Region:** US East 1
- **Clientes:** 62
- **Tablas:** 32
- **Solicitudes:** 59+
- **Testimonios:** 12

### Modelos principales (32 tablas)
- **Autenticación:** Users, Roles, Permissions, RolePermissions, Sessions, OtpCodes
- **Clientes:** Clients, ClientAddresses, ClientEmails, ClientPhones, ClientDocuments, CustomerProfiles, DocumentTypes
- **Pedidos:** Orders, OrderItems, OrderStatus
- **Solicitudes:** Requests, RequestStatus, AttachedFiles
- **Comunicación:** WhatsappMessages, ChatbotConversations, ChatbotMessages, Notifications
- **Contenido:** Testimonials, CustomerExperiences
- **Compras:** Purchases
- **Analítica:** AnalyticsEvents, PageVisits
- **Sistema:** AuditLogs, ActivityLogs, Integrations
- **Administración:** Administrators

---

## 🛡️ Seguridad

- JWT (jose) para autenticación de sesiones
- Rate limiting (100 req/15min por IP)
- Helmet.js para headers HTTP seguros
- Sanitización de inputs (prevención XSS/injection)
- CORS configurado (origin específico)
- OTP con expiración (5 min) y bloqueo por intentos fallidos (3 max, 15 min bloqueo)
- Auditoría de operaciones de escritura
- Endpoints públicos de insights solo exponen datos agregados (cero datos personales)
- Variables sensibles encriptadas en Vercel

---

## 📁 Estructura del Frontend

```
frontend/src/
├── app/                       → Pages (App Router Next.js 14)
│   ├── (auth)/                → Login cliente y admin
│   ├── (public)/              → Páginas públicas
│   │   ├── insights/          → Executive Insights Command Center
│   │   │   └── demo/          → Pitch Mode (simulación interactiva)
│   │   ├── sostenibilidad/    → Sostenibilidad con animaciones
│   │   └── ...                → Home, servicios, testimonios, etc.
│   ├── admin/                 → Panel de administración
│   ├── portal/                → Portal del cliente
│   └── api/v1/                → API Routes (Prisma + Neon)
│       └── public/insights/   → API pública de insights (live/demo)
├── components/                → Componentes reutilizables
│   ├── ui/                    → Design system (Button, Card, Spinner...)
│   ├── home/                  → Secciones de la página principal
│   ├── layout/                → Header, Footer, Sidebar, MobileMenu
│   ├── cart/                  → Carrito de compras
│   ├── chatbot/               → Widget de chatbot Zyla (voz + texto)
│   ├── insights/              → Executive Insights components
│   │   ├── AnimatedCounter    → Contador animado con easing
│   │   ├── ExecutiveFunnelChart
│   │   ├── ExecutiveTrendChart
│   │   ├── ExecutiveDonutChart
│   │   ├── ExecutiveBarChart
│   │   ├── ExecutiveSmartCityBlock
│   │   ├── ExecutiveSustainabilityBlock
│   │   ├── ExecutiveHighlightCards
│   │   ├── ExecutiveModeBadge
│   │   └── insightsData.ts   → Datos centralizados por periodo
│   └── radicacion/            → Formulario de radicación
├── data/                      → Productos y knowledge base
├── hooks/                     → Custom hooks (React Query)
├── lib/                       → API client, Prisma, analytics
└── stores/                    → Estado global (Zustand)
```

---

## 📁 Estructura del Backend

```
backend/
├── api/index.js               → Vercel serverless entry point
├── dist/                      → Compiled output (tsc + tsc-alias)
├── prisma/
│   ├── schema.prisma          → 32 modelos con relaciones
│   └── migrations/            → Migraciones de DB
├── src/
│   ├── app.ts                 → Express app + health check con DB
│   ├── config/                → Variables de entorno (Zod validation)
│   ├── controllers/           → Lógica de request/response
│   ├── middleware/            → Auth, rate-limit, sanitization, audit
│   ├── repositories/          → Acceso a datos (Prisma)
│   ├── routes/                → 15 routers (auth, clients, orders...)
│   ├── services/              → Lógica de negocio
│   ├── integrations/          → OpenAI, WhatsApp
│   ├── lib/                   → Prisma client singleton
│   ├── seeds/                 → Datos iniciales (62 clientes, 12 testimonios)
│   └── utils/                 → JWT, crypto, email, errors, serialization
├── tests/                     → 354 tests (Vitest)
├── vercel.json                → Deploy config con installCommand + builds
├── tsconfig.json              → TypeScript con path aliases (@shared/*)
└── package.json               → Scripts: build (tsc + tsc-alias), dev, test
```

---

## 🧪 Testing

```bash
# Backend (354 tests)
cd backend
npm test              # Tests unitarios e integración
npm run test:coverage # Con cobertura

# Frontend (1 test)
cd frontend
npm test              # Tests de componentes
```

**Stack de testing:** Vitest + Testing Library + MSW + fast-check (property-based)

---

## 📦 Scripts del Monorepo

```bash
npm run dev:frontend     # Iniciar frontend en desarrollo
npm run dev:backend      # Iniciar backend en desarrollo
npm run build            # Build completo (shared + backend + frontend)
npm run test             # Tests en todos los workspaces
```

### Scripts del Backend
```bash
npm run build            # prisma generate && tsc && tsc-alias
npm run dev              # tsx watch src/app.ts
npm run seed             # tsx src/seeds/seed.ts
npm run db:start         # tsx scripts/start-db.ts (PostgreSQL embebido)
```

### Scripts del Frontend
```bash
npm run build            # prisma generate && next build
npm run dev              # next dev
npm run lint             # next lint
```

---

## 🛠️ Variables de Entorno

### Backend (.env)
| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Conexión PostgreSQL (Neon en producción) |
| `NODE_ENV` | development / production |
| `PORT` | Puerto del servidor (4000) |
| `JWT_SECRET` | Secreto para tokens JWT (min 16 chars) |
| `JWT_EXPIRES_IN` | Expiración del token (1h) |
| `GEMINI_API_KEY` | API key de Google Gemini (chatbot Zyla) |
| `SMTP_HOST` | Host SMTP (smtp.ethereal.email) |
| `SMTP_PORT` | Puerto SMTP (587) |
| `SMTP_USER` | Usuario SMTP |
| `SMTP_PASS` | Contraseña SMTP |
| `SMTP_FROM` | Email remitente |
| `CORS_ORIGIN` | Origen permitido para CORS |
| `N8N_WEBHOOK_BASE_URL` | URL base de n8n |
| `RATE_LIMIT_WINDOW_MS` | Ventana de rate limiting (900000ms) |
| `RATE_LIMIT_MAX` | Máximo requests por ventana (100) |
| `OTP_EXPIRY_MINUTES` | Expiración OTP (5 min) |
| `OTP_MAX_ATTEMPTS` | Intentos máximos OTP (3) |
| `OTP_BLOCK_MINUTES` | Bloqueo por intentos fallidos (15 min) |

### Frontend (Vercel Environment Variables)
| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Conexión Neon PostgreSQL (directa) |
| `JWT_SECRET` | Secreto para verificar tokens |
| `GEMINI_API_KEY` | Google Gemini para chatbot |
| `NEXT_PUBLIC_API_URL` | URL del backend API |
| `SMTP_*` | Configuración email para OTP |

---

## 🔄 Sincronización Automática (CI/CD)

El proyecto tiene un hook configurado que al terminar cada tarea:
1. Detecta cambios en git (`git status`)
2. Hace `git add -A`, commit descriptivo y `git push origin main`
3. Despliega frontend en Vercel (`vercel --prod --yes`)
4. Despliega backend en Vercel (`vercel --prod --yes` desde /backend)

### Despliegue Manual
```bash
# Frontend
cd "UrbanThread AI"
vercel --prod --yes

# Backend
cd "UrbanThread AI/backend"
vercel --prod --yes
```

---

## 🏙️ Smart Cities & Sostenibilidad

UrbanThread AI aporta a ciudades inteligentes mediante:

| Indicador | Valor | Descripción |
|---|---|---|
| Operación Cero Papel | 100% | Facturas, radicaciones y comunicaciones digitales |
| CO₂ Evitado | ~1,240 kg/semana | Estimado por digitalización de procesos |
| Trazabilidad Digital | 100% | Cada transacción documentada y rastreable |
| Automatización IA | 12 procesos | Flujos n8n + Gemini sin intervención humana |
| Empaques Reciclables | 98% | Cadena de suministro sostenible |
| Smart City Score | 92/100 | Readiness Index de contribución urbana |

### Pilares Smart City
- **Servicios Digitales** (95%) — Portal 100% digital, OTP, chatbot 24/7
- **Eficiencia Operativa** (88%) — Automatización n8n, flujos inteligentes
- **Experiencia Ciudadana** (91%) — UX premium, accesibilidad, omnicanal
- **Sostenibilidad** (98%) — Cero papel, empaques reciclables, bajo CO₂
- **Trazabilidad** (100%) — Cada interacción documentada
- **Inclusión Digital** (87%) — Responsive, voz, múltiples canales

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

## 🧰 Stack Tecnológico Completo

| Capa | Tecnología |
|---|---|
| Frontend Framework | Next.js 14 (App Router) |
| UI Library | React 18 |
| Styling | TailwindCSS 3 |
| Animations | Framer Motion |
| State Management | Zustand 4 |
| Data Fetching | TanStack React Query 5 |
| Charts | Recharts + Custom SVG |
| Icons | Lucide React |
| Backend Framework | Express.js 4 |
| Language | TypeScript 5 |
| ORM | Prisma 6 |
| Database | PostgreSQL (Neon serverless) |
| AI | Google Gemini 2.0 Flash |
| Automation | n8n Webhooks |
| Auth | JWT (jose) + OTP |
| Email | Nodemailer + Ethereal |
| Validation | Zod |
| Testing | Vitest + Testing Library + fast-check |
| Deployment | Vercel (serverless) |
| Monorepo | npm workspaces |
| Path Aliases | tsc-alias |
| Version Control | Git + GitHub |

---

## 👥 Autor

**Carlos Figueroa** — [@cfigueroa0115](https://github.com/cfigueroa0115)

---

## 📄 Licencia

Proyecto privado — Todos los derechos reservados.
