# UrbanThread AI

**Plataforma Smart Commerce — Tejiendo experiencias inteligentes**

UrbanThread AI es una plataforma de comercio electrónico premium enfocada en moda sostenible, con integración de inteligencia artificial, automatización de procesos (n8n) y experiencia de usuario de alta calidad.

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

| Componente | Tecnología | Puerto |
|---|---|---|
| Frontend | Next.js 14 + TailwindCSS | 3000 |
| Backend API | Express.js + TypeScript | 4000 |
| Base de datos | PostgreSQL (Prisma ORM) | 5432 |
| Automatización | n8n Webhooks | Externo |

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
> Usa PostgreSQL embebido (no requiere instalación externa). Los datos persisten en `backend/.pg-data/`.

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
> API disponible en http://localhost:4000

### 7. Iniciar el Frontend
```bash
cd frontend
npm run dev
```
> Aplicación disponible en http://localhost:3000

---

## 📋 Funcionalidades Principales

### 🛍️ Tienda Online
- Colecciones: Mujer, Hombre, Niños, Beauty, Accesorios
- Catálogo con filtros por talla, color y categoría
- Carrito de compras con checkout completo
- Imágenes locales optimizadas para cada producto

### 👤 Portal del Cliente
- Autenticación segura con OTP (código de 6 dígitos por email)
- Validación de documento de identidad
- Gestión de pedidos y seguimiento
- Radicación de solicitudes (PQR)
- Gestión de documentos
- Notificaciones en tiempo real

### 🔐 Panel de Administración
- Dashboard con métricas y analítica
- Gestión de clientes, pedidos y solicitudes
- Auditoría de operaciones
- Configuración del sistema
- Gestión de testimonios
- Integraciones (WhatsApp, n8n)

### 🤖 Inteligencia Artificial
- Chatbot con Google Gemini AI
- Base de conocimiento con 300+ respuestas predefinidas
- Reconocimiento de voz
- Respuestas contextuales sobre productos, servicios y procesos

### 🌿 Sostenibilidad
- Página dedicada a prácticas sostenibles
- Productos con badge "Eco"
- Materiales reciclados y procesos de bajo impacto

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
- **Tipos de documento soportados:**
  - CC → Cédula de Ciudadanía
  - CE → Cédula de Extranjería
  - NIT → Número de Identificación Tributaria
  - PP → Pasaporte
  - TI → Tarjeta de Identidad

### WhatsApp (Meta Cloud API)
- Integración opcional para notificaciones
- Configurar tokens en `backend/.env`

### Email (SMTP)
- Envío de códigos OTP
- Notificaciones de pedidos
- Compatible con cualquier proveedor SMTP

---

## 🗄️ Base de Datos

PostgreSQL con 32 tablas gestionadas por Prisma ORM:

- **Autenticación:** Users, Roles, Permissions, OTP tokens
- **Clientes:** Clients, Addresses, Documents
- **Pedidos:** Orders, OrderItems, Payments
- **Solicitudes:** Requests, RequestStatusHistory, AttachedFiles
- **Contenido:** Testimonials, Products, Collections
- **Sistema:** AuditLogs, Notifications, ChatbotSessions
- **Integraciones:** Webhooks, WhatsAppMessages

### Migraciones
```bash
cd backend
npx prisma migrate dev      # Desarrollo (crear nueva migración)
npx prisma migrate deploy   # Producción (aplicar migraciones)
npx prisma studio           # UI visual de la base de datos
```

---

## 🛡️ Seguridad

- JWT para autenticación de sesiones
- Rate limiting (100 req/15min por IP)
- Helmet.js para headers HTTP seguros
- Sanitización de inputs (prevención XSS/injection)
- CORS configurado
- OTP con expiración (5 min) y bloqueo por intentos fallidos
- Auditoría de operaciones de escritura

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

### API Endpoints principales
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/v1/health` | Health check |
| POST | `/api/v1/auth/validate-document` | Validar documento cliente |
| POST | `/api/v1/auth/otp/request` | Solicitar código OTP |
| POST | `/api/v1/auth/otp/verify` | Verificar código OTP |
| GET | `/api/v1/clients` | Listar clientes |
| GET | `/api/v1/orders` | Listar pedidos |
| GET/POST | `/api/v1/requests` | Gestión de solicitudes |
| GET | `/api/v1/testimonials` | Testimonios |
| POST | `/api/v1/chatbot/message` | Chatbot AI |

---

## 📁 Estructura del Frontend

```
frontend/src/
├── app/                   → Pages (App Router Next.js 14)
│   ├── (auth)/            → Login cliente y admin
│   ├── (public)/          → Páginas públicas
│   ├── admin/             → Panel de administración
│   └── portal/            → Portal del cliente
├── components/            → Componentes reutilizables
│   ├── ui/                → Design system (Button, Card, Input...)
│   ├── home/              → Secciones de la página principal
│   ├── layout/            → Header, Footer, Sidebar
│   ├── cart/              → Carrito de compras
│   ├── chatbot/           → Widget de chatbot
│   └── radicacion/        → Formulario de radicación
├── data/                  → Productos y knowledge base
├── hooks/                 → Custom hooks (React Query)
├── lib/                   → API client, analytics, providers
└── stores/                → Estado global (Zustand)
```

---

## 🧪 Testing

```bash
# Backend
cd backend
npm test              # Tests unitarios e integración
npm run test:watch    # Watch mode
npm run test:coverage # Con cobertura

# Frontend
cd frontend
npm test              # Tests de componentes
npm run test:watch    # Watch mode
```

---

## 📦 Scripts del Monorepo

```bash
npm run dev:frontend     # Iniciar frontend en desarrollo
npm run dev:backend      # Iniciar backend en desarrollo
npm run build            # Build completo (shared + backend + frontend)
npm run test             # Tests en todos los workspaces
npm run lint             # Lint en todos los workspaces
```

---

## 🌐 URLs de la Aplicación

| Página | URL |
|---|---|
| Inicio | http://localhost:3000 |
| Quiénes Somos | http://localhost:3000/quienes-somos |
| Sostenibilidad | http://localhost:3000/sostenibilidad |
| Servicios | http://localhost:3000/servicios |
| Testimonios | http://localhost:3000/testimonios |
| Contacto | http://localhost:3000/contacto |
| Portal Cliente (Login) | http://localhost:3000/cliente/login |
| Portal Cliente | http://localhost:3000/portal |
| Admin (Login) | http://localhost:3000/admin/login |
| Panel Admin | http://localhost:3000/admin |

---

## 🛠️ Variables de Entorno

Ver `backend/.env.example` para la lista completa. Variables clave:

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Conexión PostgreSQL |
| `JWT_SECRET` | Secreto para tokens JWT |
| `GEMINI_API_KEY` | API key de Google Gemini (chatbot) |
| `SMTP_*` | Configuración de email |
| `CORS_ORIGIN` | Origen permitido para CORS |
| `N8N_WEBHOOK_BASE_URL` | URL base de n8n |

---

## 👥 Autor

**Carlos Figueroa** — [@cfigueroa0115](https://github.com/cfigueroa0115)

---

## 📄 Licencia

Proyecto privado — Todos los derechos reservados.
