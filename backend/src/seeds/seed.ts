/**
 * UrbanThread AI — Comprehensive Seed Script
 *
 * Generates realistic simulated data for demo / EXPOPROYECTOS presentation.
 * Uses Colombian names, addresses, and data spanning the last 6 months.
 *
 * Validates: Requirements 9.3, 10.3
 */

import { PrismaClient, type Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
const { hashSync } = bcrypt;

const prisma = new PrismaClient();

// ── Helpers ──────────────────────────────────────────────────────────────────

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function pickN<T>(arr: readonly T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDecimal(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100;
}

function padNum(n: number, len: number): string {
  return String(n).padStart(len, '0');
}

// ── Colombian Data ───────────────────────────────────────────────────────────

const FIRST_NAMES_M = [
  'Carlos', 'Andrés', 'Juan', 'Santiago', 'Sebastián', 'Miguel', 'David',
  'Daniel', 'Alejandro', 'Felipe', 'Camilo', 'Nicolás', 'Mateo', 'Diego',
  'Luis', 'Jorge', 'Ricardo', 'Óscar', 'Fernando', 'Gustavo', 'Hernán',
  'Iván', 'Javier', 'Manuel', 'Pablo', 'Rafael', 'Sergio', 'Tomás',
];

const FIRST_NAMES_F = [
  'María', 'Valentina', 'Sofía', 'Isabella', 'Camila', 'Daniela', 'Laura',
  'Natalia', 'Andrea', 'Carolina', 'Juliana', 'Paola', 'Diana', 'Marcela',
  'Catalina', 'Gabriela', 'Lucía', 'Ana', 'Paula', 'Mariana', 'Claudia',
  'Lorena', 'Tatiana', 'Ximena', 'Yolanda', 'Adriana', 'Beatriz', 'Elena',
];

const LAST_NAMES = [
  'García', 'Rodríguez', 'Martínez', 'López', 'González', 'Hernández',
  'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Gómez',
  'Díaz', 'Reyes', 'Morales', 'Jiménez', 'Ruiz', 'Álvarez', 'Romero',
  'Vargas', 'Castro', 'Ortiz', 'Mendoza', 'Guerrero', 'Medina', 'Rojas',
  'Cruz', 'Herrera', 'Aguilar', 'Parra', 'Ospina', 'Castaño', 'Mejía',
  'Arias', 'Cardona', 'Valencia', 'Muñoz', 'Salazar', 'Duque',
];

const CITIES = [
  { city: 'Bogotá', state: 'Cundinamarca', postalCode: '110111' },
  { city: 'Medellín', state: 'Antioquia', postalCode: '050001' },
  { city: 'Cali', state: 'Valle del Cauca', postalCode: '760001' },
  { city: 'Barranquilla', state: 'Atlántico', postalCode: '080001' },
  { city: 'Cartagena', state: 'Bolívar', postalCode: '130001' },
  { city: 'Bucaramanga', state: 'Santander', postalCode: '680001' },
  { city: 'Pereira', state: 'Risaralda', postalCode: '660001' },
  { city: 'Manizales', state: 'Caldas', postalCode: '170001' },
  { city: 'Santa Marta', state: 'Magdalena', postalCode: '470001' },
  { city: 'Ibagué', state: 'Tolima', postalCode: '730001' },
];

const STREETS = [
  'Calle 100 #15-20', 'Carrera 7 #45-67', 'Avenida El Dorado #68-90',
  'Calle 72 #10-34', 'Carrera 15 #93-47', 'Calle 53 #23-56',
  'Transversal 6 #27-10', 'Diagonal 40 #15-80', 'Carrera 11 #82-71',
  'Calle 26 #57-83', 'Avenida Boyacá #64-50', 'Carrera 30 #45-03',
  'Calle 134 #9-51', 'Carrera 68 #25-31', 'Calle 80 #55-20',
  'Avenida Suba #115-30', 'Carrera 50 #12-45', 'Calle 19 #4-88',
];

const PRODUCTS = [
  { name: 'Camiseta Premium UrbanThread', price: 89900 },
  { name: 'Pantalón Slim Fit Eco', price: 159900 },
  { name: 'Chaqueta Smart Casual', price: 249900 },
  { name: 'Vestido Sostenible Elegance', price: 199900 },
  { name: 'Zapatos Urban Walker', price: 179900 },
  { name: 'Bolso Eco-Leather', price: 129900 },
  { name: 'Bufanda Artesanal', price: 59900 },
  { name: 'Gorra UrbanThread Classic', price: 49900 },
  { name: 'Cinturón Premium', price: 69900 },
  { name: 'Falda Midi Sostenible', price: 139900 },
  { name: 'Blazer Smart City', price: 289900 },
  { name: 'Jeans Eco-Denim', price: 149900 },
  { name: 'Polo UrbanThread Sport', price: 79900 },
  { name: 'Sudadera Tech Comfort', price: 119900 },
  { name: 'Sandalias Eco-Step', price: 99900 },
];

const REQUEST_TYPES = [
  'Cambio de producto', 'Devolución', 'Garantía', 'Consulta de estado',
  'Actualización de datos', 'Reclamo', 'Solicitud de factura',
  'Cambio de dirección de envío', 'Cancelación de pedido',
];

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
const REQUEST_STATUSES = ['registered', 'in_review', 'in_progress', 'pending_info', 'resolved', 'closed', 'cancelled'] as const;
const PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
const TIERS = ['standard', 'silver', 'gold', 'platinum'] as const;
const DEVICES = ['mobile', 'tablet', 'desktop'] as const;
const SOURCES = ['direct', 'organic', 'social', 'referral', 'whatsapp'] as const;
const EVENT_TYPES = ['page_visit', 'click', 'form_submit', 'chatbot_interaction', 'purchase', 'login'] as const;
const PAGES = [
  '/', '/servicios', '/contacto', '/testimonios',
  '/portal/perfil', '/portal/pedidos', '/portal/solicitudes',
  '/portal/documentos', '/portal/radicacion',
  '/admin/dashboard', '/admin/clientes', '/admin/pedidos',
];
const PAYMENT_METHODS = ['credit_card', 'debit_card', 'pse', 'nequi', 'daviplata', 'cash_on_delivery'] as const;

const now = new Date();
const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

// ── Permissions definition ───────────────────────────────────────────────────

const RESOURCES = [
  'users', 'roles', 'clients', 'orders', 'requests', 'documents',
  'notifications', 'testimonials', 'analytics', 'audit', 'chatbot',
  'whatsapp', 'webhooks', 'integrations',
];
const ACTIONS = ['create', 'read', 'update', 'delete'];

// ── Main seed function ───────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Starting UrbanThread AI seed...\n');

  // Clean existing data in reverse dependency order
  console.log('🧹 Cleaning existing data...');
  await prisma.$transaction([
    prisma.chatbotMessage.deleteMany(),
    prisma.chatbotConversation.deleteMany(),
    prisma.whatsappMessage.deleteMany(),
    prisma.pageVisit.deleteMany(),
    prisma.analyticsEvent.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.purchase.deleteMany(),
    prisma.orderItem.deleteMany(),
    prisma.orderStatus.deleteMany(),
    prisma.order.deleteMany(),
    prisma.requestStatus.deleteMany(),
    prisma.attachedFile.deleteMany(),
    prisma.request.deleteMany(),
    prisma.otpCode.deleteMany(),
    prisma.clientDocument.deleteMany(),
    prisma.clientAddress.deleteMany(),
    prisma.clientEmail.deleteMany(),
    prisma.clientPhone.deleteMany(),
    prisma.customerProfile.deleteMany(),
    prisma.client.deleteMany(),
    prisma.documentType.deleteMany(),
    prisma.testimonial.deleteMany(),
    prisma.customerExperience.deleteMany(),
    prisma.activityLog.deleteMany(),
    prisma.auditLog.deleteMany(),
    prisma.session.deleteMany(),
    prisma.administrator.deleteMany(),
    prisma.user.deleteMany(),
    prisma.rolePermission.deleteMany(),
    prisma.permission.deleteMany(),
    prisma.role.deleteMany(),
    prisma.integration.deleteMany(),
  ]);

  // ── 1. Roles ─────────────────────────────────────────────────────────────
  console.log('👥 Creating roles...');
  const adminRole = await prisma.role.create({
    data: {
      name: 'admin',
      description: 'Administrador con acceso completo al sistema',
      isSystem: true,
    },
  });

  const supervisorRole = await prisma.role.create({
    data: {
      name: 'supervisor',
      description: 'Supervisor con acceso a gestión de clientes, pedidos y solicitudes',
      isSystem: true,
    },
  });

  const operadorRole = await prisma.role.create({
    data: {
      name: 'operador',
      description: 'Operador con acceso de lectura y operaciones básicas',
      isSystem: true,
    },
  });

  // ── 2. Permissions ───────────────────────────────────────────────────────
  console.log('🔑 Creating permissions...');
  const permissions: Array<{ id: string; resource: string; action: string }> = [];

  for (const resource of RESOURCES) {
    for (const action of ACTIONS) {
      const perm = await prisma.permission.create({
        data: {
          name: `${resource}:${action}`,
          resource,
          action,
          description: `${action} access to ${resource}`,
        },
      });
      permissions.push({ id: perm.id, resource, action });
    }
  }

  // Admin gets all permissions
  for (const perm of permissions) {
    await prisma.rolePermission.create({
      data: { roleId: adminRole.id, permissionId: perm.id },
    });
  }

  // Supervisor gets read + update on most resources, create on some
  const supervisorResources = ['clients', 'orders', 'requests', 'documents', 'notifications', 'testimonials', 'analytics', 'chatbot', 'whatsapp'];
  for (const perm of permissions) {
    if (supervisorResources.includes(perm.resource) && ['read', 'update', 'create'].includes(perm.action)) {
      await prisma.rolePermission.create({
        data: { roleId: supervisorRole.id, permissionId: perm.id },
      });
    }
  }

  // Operador gets read on most resources
  const operadorResources = ['clients', 'orders', 'requests', 'documents', 'notifications', 'analytics'];
  for (const perm of permissions) {
    if (operadorResources.includes(perm.resource) && perm.action === 'read') {
      await prisma.rolePermission.create({
        data: { roleId: operadorRole.id, permissionId: perm.id },
      });
    }
  }

  // ── 3. Admin Users ───────────────────────────────────────────────────────
  console.log('👤 Creating admin users...');
  const passwordHash = hashSync('Admin123!', 10);

  const adminUsers = [
    { email: 'admin@urbanthread.ai', firstName: 'Carlos', lastName: 'García', roleId: adminRole.id, department: 'Dirección General', position: 'Director General' },
    { email: 'supervisor@urbanthread.ai', firstName: 'María', lastName: 'Rodríguez', roleId: supervisorRole.id, department: 'Operaciones', position: 'Supervisora de Operaciones' },
    { email: 'operador@urbanthread.ai', firstName: 'Andrés', lastName: 'Martínez', roleId: operadorRole.id, department: 'Atención al Cliente', position: 'Operador de Soporte' },
    { email: 'admin2@urbanthread.ai', firstName: 'Valentina', lastName: 'López', roleId: adminRole.id, department: 'Tecnología', position: 'Directora de Tecnología' },
    { email: 'supervisor2@urbanthread.ai', firstName: 'Santiago', lastName: 'González', roleId: supervisorRole.id, department: 'Ventas', position: 'Supervisor de Ventas' },
    { email: 'operador2@urbanthread.ai', firstName: 'Sofía', lastName: 'Hernández', roleId: operadorRole.id, department: 'Logística', position: 'Operadora de Logística' },
    { email: 'operador3@urbanthread.ai', firstName: 'Daniel', lastName: 'Pérez', roleId: operadorRole.id, department: 'Atención al Cliente', position: 'Operador de Soporte' },
  ];

  const createdUsers: string[] = [];
  for (const u of adminUsers) {
    const user = await prisma.user.create({
      data: {
        email: u.email,
        passwordHash,
        firstName: u.firstName,
        lastName: u.lastName,
        roleId: u.roleId,
        isActive: true,
      },
    });
    await prisma.administrator.create({
      data: {
        userId: user.id,
        department: u.department,
        position: u.position,
        phone: `+57 ${randomInt(300, 320)} ${randomInt(100, 999)} ${randomInt(1000, 9999)}`,
      },
    });
    createdUsers.push(user.id);
  }

  // ── 4. Document Types ────────────────────────────────────────────────────
  console.log('📄 Creating document types...');
  const docTypes = [
    { code: 'CC', name: 'Cédula de Ciudadanía', description: 'Documento de identidad colombiano' },
    { code: 'CE', name: 'Cédula de Extranjería', description: 'Documento para extranjeros residentes' },
    { code: 'NIT', name: 'Número de Identificación Tributaria', description: 'Identificación tributaria para empresas' },
    { code: 'PP', name: 'Pasaporte', description: 'Documento de viaje internacional' },
    { code: 'TI', name: 'Tarjeta de Identidad', description: 'Documento de identidad para menores' },
  ];

  const createdDocTypes: string[] = [];
  for (const dt of docTypes) {
    const created = await prisma.documentType.create({ data: dt });
    createdDocTypes.push(created.id);
  }

  // ── 5. Clients (55 clients) ──────────────────────────────────────────────
  console.log('🧑‍💼 Creating clients...');
  const clientIds: string[] = [];

  // Fixed test clients for demo — datos completos para n8n
  const fixedClients = [
    { documentType: 'CC', documentNumber: '1020061911', firstName: 'Catalina', lastName: 'García Ramírez', gender: 'female', city: 'Bogotá', state: 'Cundinamarca', phone: '+57 310 456 7890', tipoCliente: 'Premium' },
    { documentType: 'CC', documentNumber: '110102194', firstName: 'Andrea', lastName: 'Medina Rivera', gender: 'female', city: 'Medellín', state: 'Antioquia', phone: '+57 311 234 5678', tipoCliente: 'Frecuente' },
    { documentType: 'CC', documentNumber: '255077704', firstName: 'Laura', lastName: 'Muñoz Sánchez', gender: 'female', city: 'Cali', state: 'Valle del Cauca', phone: '+57 312 345 6789', tipoCliente: 'Estandar' },
    { documentType: 'CC', documentNumber: '1709537651', firstName: 'Andrea', lastName: 'González Díaz', gender: 'female', city: 'Barranquilla', state: 'Atlántico', phone: '+57 313 456 7891', tipoCliente: 'Premium' },
    { documentType: 'PP', documentNumber: '953734425', firstName: 'Nicolás', lastName: 'Duque Cardona', gender: 'male', city: 'Cartagena', state: 'Bolívar', phone: '+57 314 567 8912', tipoCliente: 'Frecuente' },
    { documentType: 'CC', documentNumber: '484857644', firstName: 'Sergio', lastName: 'Cruz Díaz', gender: 'male', city: 'Bucaramanga', state: 'Santander', phone: '+57 315 678 9123', tipoCliente: 'Estandar' },
    { documentType: 'CC', documentNumber: '1816840494', firstName: 'Óscar', lastName: 'Flores Flores', gender: 'male', city: 'Pereira', state: 'Risaralda', phone: '+57 316 789 1234', tipoCliente: 'Premium' },
    { documentType: 'CC', documentNumber: '1963679158', firstName: 'Mateo', lastName: 'García Pérez', gender: 'male', city: 'Manizales', state: 'Caldas', phone: '+57 317 891 2345', tipoCliente: 'Frecuente' },
    { documentType: 'CC', documentNumber: '1527343699', firstName: 'Javier', lastName: 'Guerrero Salazar', gender: 'male', city: 'Santa Marta', state: 'Magdalena', phone: '+57 318 912 3456', tipoCliente: 'Estandar' },
    { documentType: 'CC', documentNumber: '1348629471', firstName: 'Manuel', lastName: 'Rivera Salazar', gender: 'male', city: 'Ibagué', state: 'Tolima', phone: '+57 319 123 4567', tipoCliente: 'Premium' },
  ];

  for (const fc of fixedClients) {
    const client = await prisma.client.create({
      data: {
        documentType: fc.documentType,
        documentNumber: fc.documentNumber,
        firstName: fc.firstName,
        lastName: fc.lastName,
        dateOfBirth: new Date(randomInt(1980, 2000), randomInt(0, 11), randomInt(1, 28)),
        gender: fc.gender,
        isActive: true,
        createdAt: randomDate(sixMonthsAgo, now),
      },
    });
    clientIds.push(client.id);

    await prisma.clientAddress.create({
      data: {
        clientId: client.id,
        type: 'home',
        street: `Calle ${randomInt(1, 170)} # ${randomInt(1, 100)}-${randomInt(1, 99)}`,
        city: fc.city,
        state: fc.state,
        country: 'Colombia',
        postalCode: padNum(randomInt(10000, 99999), 6),
        isPrimary: true,
      },
    });

    // Email con dominio @campusucc.edu.co
    const emailName = `${fc.firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}.${fc.lastName.split(' ')[0]!.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`;
    await prisma.clientEmail.create({
      data: {
        clientId: client.id,
        email: `${emailName}@campusucc.edu.co`,
        isPrimary: true,
        isVerified: true,
      },
    });

    await prisma.clientPhone.create({
      data: {
        clientId: client.id,
        type: 'mobile',
        phone: fc.phone,
        isPrimary: true,
        isWhatsapp: true,
      },
    });

    // Customer profile con tipo de cliente
    await prisma.customerProfile.create({
      data: {
        clientId: client.id,
        preferredLanguage: 'es',
        loyaltyPoints: fc.tipoCliente === 'Premium' ? randomInt(3000, 5000) : fc.tipoCliente === 'Frecuente' ? randomInt(1500, 3000) : randomInt(0, 1500),
        tier: fc.tipoCliente,
        notes: fc.tipoCliente === 'Premium' ? 'Cliente Premium con beneficios exclusivos' : fc.tipoCliente === 'Frecuente' ? 'Cliente frecuente, compras regulares' : 'Cliente estándar',
        tags: fc.tipoCliente === 'Premium' ? ['premium', 'moda', 'sostenible'] : fc.tipoCliente === 'Frecuente' ? ['frecuente', 'casual', 'deportivo'] : ['estandar', 'casual'],
      },
    });
  }

  for (let i = 0; i < 45; i++) {
    const isMale = Math.random() > 0.5;
    const firstName = isMale ? pick(FIRST_NAMES_M) : pick(FIRST_NAMES_F);
    const lastName = `${pick(LAST_NAMES)} ${pick(LAST_NAMES)}`;
    const docType = i < 40 ? 'CC' : pick(['CE', 'NIT', 'PP', 'TI'] as const);
    const docNumber = docType === 'NIT'
      ? `${randomInt(800, 999)}.${randomInt(100, 999)}.${randomInt(100, 999)}-${randomInt(0, 9)}`
      : String(randomInt(10000000, 1999999999));
    const gender = isMale ? 'male' : 'female';
    const cityData = pick(CITIES);
    const createdAt = randomDate(sixMonthsAgo, now);
    const tipoCliente = pick(['Premium', 'Estandar', 'Frecuente'] as const);

    const client = await prisma.client.create({
      data: {
        documentType: docType,
        documentNumber: docNumber,
        firstName,
        lastName,
        dateOfBirth: new Date(randomInt(1960, 2005), randomInt(0, 11), randomInt(1, 28)),
        gender,
        isActive: Math.random() > 0.05,
        createdAt,
      },
    });
    clientIds.push(client.id);

    // Address
    await prisma.clientAddress.create({
      data: {
        clientId: client.id,
        type: pick(['home', 'work', 'billing', 'shipping'] as const),
        street: pick(STREETS),
        city: cityData.city,
        state: cityData.state,
        postalCode: cityData.postalCode,
        country: 'Colombia',
        isPrimary: true,
      },
    });

    // Second address for some clients
    if (Math.random() > 0.6) {
      const city2 = pick(CITIES);
      await prisma.clientAddress.create({
        data: {
          clientId: client.id,
          type: 'shipping',
          street: pick(STREETS),
          city: city2.city,
          state: city2.state,
          postalCode: city2.postalCode,
          country: 'Colombia',
          isPrimary: false,
        },
      });
    }

    // Email con dominio @campusucc.edu.co
    const emailName = `${firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}.${lastName.split(' ')[0]!.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}${i}`;
    await prisma.clientEmail.create({
      data: {
        clientId: client.id,
        email: `${emailName}@campusucc.edu.co`,
        isPrimary: true,
        isVerified: true,
      },
    });

    // Phone
    await prisma.clientPhone.create({
      data: {
        clientId: client.id,
        phone: `+57 ${randomInt(300, 320)} ${randomInt(100, 999)} ${randomInt(1000, 9999)}`,
        type: 'mobile',
        isPrimary: true,
        isWhatsapp: Math.random() > 0.3,
      },
    });

    // Customer profile con tipo de cliente
    await prisma.customerProfile.create({
      data: {
        clientId: client.id,
        preferredLanguage: 'es',
        loyaltyPoints: tipoCliente === 'Premium' ? randomInt(3000, 5000) : tipoCliente === 'Frecuente' ? randomInt(1500, 3000) : randomInt(0, 1500),
        tier: tipoCliente,
        notes: tipoCliente === 'Premium' ? 'Cliente Premium con beneficios exclusivos' : tipoCliente === 'Frecuente' ? 'Cliente frecuente, compras regulares' : 'Cliente estándar',
        tags: pickN(['moda', 'sostenible', 'premium', 'casual', 'deportivo', 'formal', 'eco'], randomInt(1, 4)),
      },
    });
  }

  // ── 6. Orders (110 orders with items and status history) ─────────────────
  console.log('📦 Creating orders...');
  const orderIds: Array<{ id: string; clientId: string }> = [];

  for (let i = 0; i < 110; i++) {
    const clientId = pick(clientIds);
    const orderDate = randomDate(sixMonthsAgo, now);
    const numItems = randomInt(1, 4);
    const items = pickN(PRODUCTS, numItems);
    const totalAmount = items.reduce((sum, p) => sum + p.price * randomInt(1, 3), 0);

    // Determine final status with realistic distribution
    const statusIndex = Math.random() < 0.4 ? 4 // delivered
      : Math.random() < 0.6 ? randomInt(1, 3) // confirmed/processing/shipped
      : Math.random() < 0.85 ? 0 // pending
      : 5; // cancelled
    const finalStatus = ORDER_STATUSES[statusIndex]!;

    const order = await prisma.order.create({
      data: {
        clientId,
        orderNumber: `ORD-${orderDate.getFullYear()}${padNum(orderDate.getMonth() + 1, 2)}${padNum(orderDate.getDate(), 2)}-${padNum(i + 1, 4)}`,
        status: finalStatus,
        totalAmount,
        currency: 'COP',
        notes: Math.random() > 0.7 ? 'Envío prioritario solicitado' : null,
        createdAt: orderDate,
        items: {
          create: items.map((item) => {
            const qty = randomInt(1, 3);
            return {
              productName: item.name,
              description: `${item.name} - Talla ${pick(['XS', 'S', 'M', 'L', 'XL'])}`,
              quantity: qty,
              unitPrice: item.price,
              totalPrice: item.price * qty,
            };
          }),
        },
      },
    });

    orderIds.push({ id: order.id, clientId });

    // Create status history up to the final status
    const statusFlow = ORDER_STATUSES.slice(0, statusIndex + 1);
    let statusDate = new Date(orderDate);
    for (const status of statusFlow) {
      await prisma.orderStatus.create({
        data: {
          orderId: order.id,
          status,
          comment: status === 'pending' ? 'Pedido creado' :
            status === 'confirmed' ? 'Pedido confirmado por el sistema' :
            status === 'processing' ? 'En preparación en bodega' :
            status === 'shipped' ? 'Enviado por transportadora' :
            status === 'delivered' ? 'Entregado al cliente' :
            'Pedido cancelado por el cliente',
          changedBy: pick(createdUsers),
          createdAt: statusDate,
        },
      });
      statusDate = new Date(statusDate.getTime() + randomInt(1, 48) * 60 * 60 * 1000);
    }
  }

  // ── 7. Requests (55 requests with status history) ────────────────────────
  console.log('📋 Creating requests...');
  const requestIds: Array<{ id: string; clientId: string }> = [];

  for (let i = 0; i < 55; i++) {
    const clientId = pick(clientIds);
    const requestDate = randomDate(sixMonthsAgo, now);
    const reqType = pick(REQUEST_TYPES);
    const priority = pick(PRIORITIES);

    // Determine final status with realistic distribution
    const statusIndex = Math.random() < 0.3 ? 4 // resolved
      : Math.random() < 0.5 ? 5 // closed
      : Math.random() < 0.7 ? randomInt(1, 3) // in_review/in_progress/pending_info
      : Math.random() < 0.9 ? 0 // registered
      : 6; // cancelled
    const finalStatus = REQUEST_STATUSES[statusIndex]!;

    const request = await prisma.request.create({
      data: {
        clientId,
        radicationNumber: `RAD-${requestDate.getFullYear()}${padNum(requestDate.getMonth() + 1, 2)}-${padNum(i + 1, 5)}`,
        type: reqType,
        description: `Solicitud de ${reqType.toLowerCase()} para cliente. ${Math.random() > 0.5 ? 'Requiere atención prioritaria.' : 'Trámite estándar.'}`,
        priority,
        status: finalStatus,
        assignedTo: Math.random() > 0.3 ? pick(createdUsers) : null,
        createdAt: requestDate,
      },
    });

    requestIds.push({ id: request.id, clientId });

    // Create status history
    const statusFlow = REQUEST_STATUSES.slice(0, statusIndex + 1);
    let statusDate = new Date(requestDate);
    for (const status of statusFlow) {
      await prisma.requestStatus.create({
        data: {
          requestId: request.id,
          status,
          comment: status === 'registered' ? 'Solicitud registrada en el sistema' :
            status === 'in_review' ? 'En revisión por el equipo' :
            status === 'in_progress' ? 'En proceso de resolución' :
            status === 'pending_info' ? 'Pendiente de información del cliente' :
            status === 'resolved' ? 'Solicitud resuelta satisfactoriamente' :
            status === 'closed' ? 'Caso cerrado' :
            'Solicitud cancelada',
          changedBy: pick(createdUsers),
          createdAt: statusDate,
        },
      });
      statusDate = new Date(statusDate.getTime() + randomInt(2, 72) * 60 * 60 * 1000);
    }

    // Attach files to ~60% of requests
    if (Math.random() > 0.4) {
      const numFiles = randomInt(1, 3);
      for (let f = 0; f < numFiles; f++) {
        const fileTypes = [
          { ext: 'pdf', mime: 'application/pdf', docType: 'Factura' },
          { ext: 'pdf', mime: 'application/pdf', docType: 'Soporte' },
          { ext: 'jpg', mime: 'image/jpeg', docType: 'Foto evidencia' },
          { ext: 'png', mime: 'image/png', docType: 'Captura de pantalla' },
          { ext: 'docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', docType: 'Carta solicitud' },
        ];
        const fileType = pick(fileTypes);
        await prisma.attachedFile.create({
          data: {
            requestId: request.id,
            clientId,
            fileName: `${fileType.docType.toLowerCase().replace(/ /g, '_')}_${padNum(i + 1, 3)}_${f + 1}.${fileType.ext}`,
            filePath: `/uploads/requests/${request.id}/${fileType.docType.toLowerCase().replace(/ /g, '_')}_${f + 1}.${fileType.ext}`,
            fileSize: randomInt(50000, 5000000),
            mimeType: fileType.mime,
            documentType: fileType.docType,
            status: 'active',
            uploadedBy: Math.random() > 0.5 ? pick(createdUsers) : null,
            createdAt: requestDate,
          },
        });
      }
    }
  }

  // ── 8. Testimonials (12 testimonials) ────────────────────────────────────
  console.log('⭐ Creating testimonials...');
  const testimonials = [
    { clientName: 'María Valentina López', clientRole: 'Empresaria', rating: 5, comment: 'UrbanThread AI transformó completamente la gestión de mi negocio de moda. La automatización de procesos me ahorra horas cada semana.', caseStudy: 'Reducción del 60% en tiempo de gestión de pedidos gracias a la automatización con n8n y el chatbot inteligente.', isFeatured: true },
    { clientName: 'Carlos Andrés García', clientRole: 'Diseñador de Moda', rating: 5, comment: 'La plataforma es increíblemente intuitiva. El módulo de radicación simplificó todo el proceso de solicitudes de mis clientes.', caseStudy: 'Implementación exitosa del flujo de radicación de 12 pasos, reduciendo errores en un 80%.', isFeatured: true },
    { clientName: 'Sofía Hernández Reyes', clientRole: 'Gerente de Tienda', rating: 4, comment: 'El portal de cliente con OTP es muy seguro y fácil de usar. Mis clientes están encantados con la experiencia.', caseStudy: 'Aumento del 45% en la satisfacción del cliente tras implementar el portal con autenticación OTP.' },
    { clientName: 'Juan Sebastián Martínez', clientRole: 'Director Comercial', rating: 5, comment: 'Los dashboards de analítica me dan visibilidad total del negocio. Puedo tomar decisiones basadas en datos reales.', caseStudy: 'Mejora del 35% en la tasa de conversión gracias a insights del módulo de analítica.', isFeatured: true },
    { clientName: 'Daniela Torres Vargas', clientRole: 'Coordinadora de Logística', rating: 4, comment: 'La integración con WhatsApp Business es fantástica. Nuestros clientes pueden hacer seguimiento de sus pedidos directamente desde WhatsApp.', caseStudy: 'Reducción del 50% en llamadas al call center gracias a la integración WhatsApp.' },
    { clientName: 'Alejandro Ramírez Ospina', clientRole: 'Emprendedor', rating: 5, comment: 'Como emprendedor, necesitaba una solución todo-en-uno. UrbanThread AI superó mis expectativas con su enfoque sostenible.', caseStudy: 'Lanzamiento exitoso de marca de moda sostenible con gestión 100% digital.' },
    { clientName: 'Camila Rodríguez Parra', clientRole: 'Clienta Frecuente', rating: 5, comment: 'Me encanta poder gestionar mis pedidos y documentos desde el portal. La experiencia es premium y muy fluida.', caseStudy: null },
    { clientName: 'Felipe González Medina', clientRole: 'Analista de Datos', rating: 4, comment: 'El chatbot con IA es sorprendentemente preciso. Resuelve la mayoría de consultas sin necesidad de agente humano.', caseStudy: 'El chatbot resuelve el 75% de las consultas automáticamente, mejorando la eficiencia operativa.' },
    { clientName: 'Isabella Pérez Castaño', clientRole: 'Diseñadora Gráfica', rating: 5, comment: 'El diseño de la plataforma es espectacular. Se nota la atención al detalle y la coherencia con la marca.', caseStudy: null },
    { clientName: 'Diego Sánchez Mejía', clientRole: 'Gerente de Operaciones', rating: 4, comment: 'La trazabilidad completa de operaciones nos da tranquilidad. Cada acción queda registrada en el sistema de auditoría.', caseStudy: 'Cumplimiento del 100% en auditorías internas gracias al sistema de trazabilidad.' },
    { clientName: 'Laura Jiménez Arias', clientRole: 'Clienta Premium', rating: 5, comment: 'El programa de lealtad y la personalización hacen que me sienta valorada como clienta. Recomiendo UrbanThread AI.', caseStudy: null },
    { clientName: 'Nicolás Álvarez Cardona', clientRole: 'CTO Startup', rating: 5, comment: 'La arquitectura técnica es sólida. API REST bien documentada, seguridad robusta y escalabilidad garantizada.', caseStudy: 'Integración exitosa con sistemas externos mediante la API REST y webhooks n8n.', isFeatured: true },
  ];

  for (let i = 0; i < testimonials.length; i++) {
    const t = testimonials[i]!;
    await prisma.testimonial.create({
      data: {
        clientName: t.clientName,
        clientRole: t.clientRole,
        photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(t.clientName)}`,
        rating: t.rating,
        comment: t.comment,
        caseStudy: t.caseStudy ?? null,
        isPublished: true,
        isFeatured: t.isFeatured ?? false,
        sortOrder: i,
        createdAt: randomDate(sixMonthsAgo, now),
      },
    });
  }

  // ── 9. Customer Experiences ──────────────────────────────────────────────
  console.log('💫 Creating customer experiences...');
  const experiences = [
    { clientName: 'María Valentina López', title: 'Transformación Digital Completa', description: 'Gracias a UrbanThread AI, mi negocio pasó de procesos manuales a una gestión 100% digital en solo 2 semanas.', category: 'positive' },
    { clientName: 'Carlos Andrés García', title: 'Atención Ágil y Eficiente', description: 'El equipo de soporte resolvió mi solicitud en menos de 24 horas. La atención fue excepcional.', category: 'agile' },
    { clientName: 'Sofía Hernández Reyes', title: 'Facilidad de Uso Sorprendente', description: 'No soy experta en tecnología, pero la plataforma es tan intuitiva que pude configurar todo sin ayuda.', category: 'easy_use' },
    { clientName: 'Juan Sebastián Martínez', title: 'Personalización a Medida', description: 'Los dashboards se adaptan perfectamente a las necesidades de mi negocio. Cada métrica es relevante.', category: 'personalization' },
    { clientName: 'Daniela Torres Vargas', title: 'Respuesta Inmediata por WhatsApp', description: 'Puedo consultar el estado de mis pedidos directamente por WhatsApp. La respuesta es instantánea.', category: 'fast_response' },
    { clientName: 'Alejandro Ramírez Ospina', title: 'Experiencia Sin Fricción', description: 'Desde el registro hasta la compra, todo fluye naturalmente. No hay pasos innecesarios ni complicaciones.', category: 'frictionless' },
    { clientName: 'Camila Rodríguez Parra', title: 'Confianza Total en la Plataforma', description: 'La seguridad OTP y la trazabilidad me dan total confianza para gestionar mis datos y compras.', category: 'trust' },
  ];

  for (const exp of experiences) {
    await prisma.customerExperience.create({
      data: {
        clientName: exp.clientName,
        title: exp.title,
        description: exp.description,
        category: exp.category,
        isPublished: true,
        createdAt: randomDate(sixMonthsAgo, now),
      },
    });
  }

  // ── 10. Analytics Events (500+) ──────────────────────────────────────────
  console.log('📊 Creating analytics events...');
  const analyticsEvents: Prisma.AnalyticsEventCreateManyInput[] = [];

  for (let i = 0; i < 550; i++) {
    const eventDate = randomDate(sixMonthsAgo, now);
    analyticsEvents.push({
      eventType: pick(EVENT_TYPES),
      sessionId: `session-${randomInt(1, 300)}`,
      page: pick(PAGES),
      device: pick(DEVICES),
      source: pick(SOURCES),
      element: Math.random() > 0.6 ? pick(['btn-comprar', 'btn-contacto', 'btn-radicacion', 'link-portal', 'chatbot-open', 'whatsapp-btn']) : null,
      metadata: { simulated: true, seedVersion: '1.0' },
      ipAddress: `${randomInt(10, 200)}.${randomInt(0, 255)}.${randomInt(0, 255)}.${randomInt(1, 254)}`,
      userAgent: pick([
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
        'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36',
      ]),
      createdAt: eventDate,
    });
  }

  await prisma.analyticsEvent.createMany({ data: analyticsEvents });

  // ── 11. Page Visits (120) ────────────────────────────────────────────────
  console.log('👁️ Creating page visits...');
  const pageVisits: Prisma.PageVisitCreateManyInput[] = [];

  for (let i = 0; i < 120; i++) {
    const visitDate = randomDate(sixMonthsAgo, now);
    pageVisits.push({
      page: pick(PAGES),
      sessionId: `session-${randomInt(1, 300)}`,
      duration: randomInt(5, 600),
      device: pick(DEVICES),
      referrer: Math.random() > 0.4 ? pick(['https://google.com', 'https://facebook.com', 'https://instagram.com', 'https://twitter.com', null]) : null,
      createdAt: visitDate,
    });
  }

  await prisma.pageVisit.createMany({ data: pageVisits });

  // ── 12. Purchases (55) ───────────────────────────────────────────────────
  console.log('💰 Creating purchases...');
  for (let i = 0; i < 55; i++) {
    const orderData = i < orderIds.length ? orderIds[i] : null;
    const clientId = orderData?.clientId ?? pick(clientIds);
    const purchaseDate = randomDate(sixMonthsAgo, now);

    await prisma.purchase.create({
      data: {
        clientId,
        orderId: orderData?.id ?? null,
        amount: randomDecimal(50000, 800000),
        currency: 'COP',
        paymentMethod: pick(PAYMENT_METHODS),
        status: Math.random() > 0.9 ? 'refunded' : 'completed',
        transactionId: `TXN-${Date.now()}-${randomInt(1000, 9999)}-${i}`,
        createdAt: purchaseDate,
      },
    });
  }

  // ── 13. Chatbot Conversations (25 with messages) ─────────────────────────
  console.log('🤖 Creating chatbot conversations...');
  const chatbotQuestions = [
    '¿Cuál es el estado de mi pedido?',
    '¿Cómo puedo hacer una devolución?',
    'Quiero información sobre los servicios de UrbanThread AI',
    '¿Cuáles son los métodos de pago disponibles?',
    '¿Cómo puedo radicar una solicitud?',
    '¿Tienen envío gratis?',
    'Necesito ayuda con mi cuenta',
    '¿Cuánto tarda el envío a Medellín?',
    '¿Puedo cambiar la dirección de envío?',
    '¿Tienen descuentos para clientes frecuentes?',
    '¿Cómo funciona el programa de lealtad?',
    '¿Puedo pagar con Nequi?',
    'Quiero hablar con un agente',
    '¿Cuál es la política de garantía?',
    '¿Tienen tienda física?',
  ];

  const chatbotResponses = [
    'Puedo ayudarte a consultar el estado de tu pedido. ¿Podrías proporcionarme tu número de pedido?',
    'Para realizar una devolución, puedes acceder al portal de cliente y seguir el proceso de radicación. ¿Necesitas que te guíe paso a paso?',
    'UrbanThread AI ofrece una plataforma completa de Smart Commerce que incluye gestión de pedidos, radicación de solicitudes, analítica en tiempo real y más. ¿Qué aspecto te interesa conocer?',
    'Aceptamos tarjeta de crédito, débito, PSE, Nequi, Daviplata y pago contra entrega. ¿Deseas realizar una compra?',
    'Para radicar una solicitud, ingresa al portal de cliente con tu documento y código OTP. El proceso tiene 12 pasos guiados. ¿Quieres que te explique el proceso?',
    'Ofrecemos envío gratis en compras superiores a $200.000 COP. ¿Puedo ayudarte con algo más?',
    'Con gusto te ayudo con tu cuenta. ¿Podrías indicarme qué tipo de problema estás experimentando?',
    'El envío a Medellín tarda entre 2 y 4 días hábiles. Para envío express, el tiempo es de 1-2 días hábiles.',
    'Sí, puedes cambiar la dirección de envío desde tu portal de cliente antes de que el pedido sea despachado.',
    '¡Sí! Nuestro programa de lealtad ofrece descuentos exclusivos según tu nivel: Silver (5%), Gold (10%) y Platinum (15%).',
  ];

  for (let i = 0; i < 25; i++) {
    const clientId = Math.random() > 0.3 ? pick(clientIds) : null;
    const convDate = randomDate(sixMonthsAgo, now);
    const isEscalated = Math.random() > 0.85;

    const conversation = await prisma.chatbotConversation.create({
      data: {
        clientId,
        sessionId: `chat-session-${randomInt(1, 500)}`,
        status: isEscalated ? 'escalated' : Math.random() > 0.3 ? 'closed' : 'active',
        escalatedAt: isEscalated ? new Date(convDate.getTime() + randomInt(60, 600) * 1000) : null,
        ticketId: isEscalated ? `TKT-${randomInt(1000, 9999)}` : null,
        metadata: { source: pick(['web', 'portal', 'whatsapp']) },
        createdAt: convDate,
      },
    });

    // Create 2-6 messages per conversation
    const numMessages = randomInt(2, 6);
    let msgDate = new Date(convDate);

    for (let j = 0; j < numMessages; j++) {
      const isUser = j % 2 === 0;
      await prisma.chatbotMessage.create({
        data: {
          conversationId: conversation.id,
          role: isUser ? 'user' : 'assistant',
          content: isUser ? pick(chatbotQuestions) : pick(chatbotResponses),
          tokensUsed: isUser ? null : randomInt(50, 300),
          responseTimeMs: isUser ? null : randomInt(200, 2500),
          createdAt: msgDate,
        },
      });
      msgDate = new Date(msgDate.getTime() + randomInt(5, 60) * 1000);
    }
  }

  // ── 14. WhatsApp Messages (25) ───────────────────────────────────────────
  console.log('📱 Creating WhatsApp messages...');
  const waMessages = [
    'Hola, quiero consultar el estado de mi pedido',
    'Buenos días, necesito información sobre devoluciones',
    'Quiero radicar una solicitud de cambio',
    '¿Cuánto cuesta el envío a Barranquilla?',
    'Necesito una factura de mi última compra',
    'Hola, ¿tienen disponible la chaqueta Smart Casual en talla M?',
    'Quiero actualizar mi dirección de envío',
    '¿Cuándo llega mi pedido ORD-20240115-0023?',
    'Gracias por la atención, excelente servicio',
    'Necesito hablar con un asesor',
    'Buenos días, quiero hacer un pedido nuevo',
    '¿Aceptan pagos con Nequi?',
    'Mi pedido llegó incompleto, necesito ayuda',
    '¿Tienen promociones esta semana?',
    'Quiero cancelar mi pedido',
  ];

  const waResponses = [
    'Hola, bienvenido a UrbanThread AI. Con gusto te ayudo a consultar tu pedido. ¿Cuál es tu número de pedido?',
    'Buenos días. Para devoluciones, puedes radicar una solicitud desde nuestro portal. ¿Necesitas ayuda con el proceso?',
    'Claro, puedo ayudarte con eso. ¿Podrías indicarme tu número de documento para verificar tu cuenta?',
    'El envío a Barranquilla tiene un costo de $15.000 COP. Envío gratis en compras superiores a $200.000.',
    'Te enviaremos la factura a tu correo registrado en los próximos minutos.',
  ];

  for (let i = 0; i < 25; i++) {
    const clientId = Math.random() > 0.2 ? pick(clientIds) : null;
    const msgDate = randomDate(sixMonthsAgo, now);
    const isInbound = Math.random() > 0.4;

    await prisma.whatsappMessage.create({
      data: {
        clientId,
        sessionId: `wa-session-${randomInt(1, 100)}`,
        direction: isInbound ? 'inbound' : 'outbound',
        phoneNumber: `+57${randomInt(300, 320)}${randomInt(1000000, 9999999)}`,
        content: isInbound ? pick(waMessages) : pick(waResponses),
        messageType: 'text',
        intent: isInbound ? pick(['consulta_pedido', 'devolucion', 'informacion', 'compra', 'soporte', null]) : null,
        status: isInbound ? 'received' : pick(['sent', 'delivered', 'read'] as const),
        metadata: { simulated: true },
        createdAt: msgDate,
      },
    });
  }

  // ── 15. Notifications (55) ───────────────────────────────────────────────
  console.log('🔔 Creating notifications...');
  const notifTypes = ['order_status', 'request_status', 'document', 'system', 'promotion'] as const;
  const notifTemplates = [
    { type: 'order_status' as const, title: 'Pedido actualizado', message: 'El estado de tu pedido ha cambiado a: Enviado.' },
    { type: 'order_status' as const, title: 'Pedido entregado', message: 'Tu pedido ha sido entregado exitosamente. ¡Gracias por tu compra!' },
    { type: 'request_status' as const, title: 'Solicitud en revisión', message: 'Tu solicitud está siendo revisada por nuestro equipo.' },
    { type: 'request_status' as const, title: 'Solicitud resuelta', message: 'Tu solicitud ha sido resuelta satisfactoriamente.' },
    { type: 'document' as const, title: 'Documento recibido', message: 'Hemos recibido tu documento correctamente.' },
    { type: 'system' as const, title: 'Bienvenido a UrbanThread AI', message: 'Tu cuenta ha sido creada exitosamente. Explora todas las funcionalidades de la plataforma.' },
    { type: 'system' as const, title: 'Actualización del sistema', message: 'Hemos mejorado la plataforma con nuevas funcionalidades. ¡Descúbrelas!' },
    { type: 'promotion' as const, title: '¡Descuento especial!', message: 'Aprovecha un 20% de descuento en toda la colección sostenible. Válido hasta fin de mes.' },
    { type: 'promotion' as const, title: 'Envío gratis este fin de semana', message: 'Disfruta de envío gratis en todas tus compras este fin de semana.' },
  ];

  for (let i = 0; i < 55; i++) {
    const clientId = pick(clientIds);
    const template = pick(notifTemplates);
    const notifDate = randomDate(sixMonthsAgo, now);
    const isRead = Math.random() > 0.4;

    await prisma.notification.create({
      data: {
        clientId,
        type: template.type,
        title: template.title,
        message: template.message,
        isRead,
        readAt: isRead ? new Date(notifDate.getTime() + randomInt(60, 86400) * 1000) : null,
        metadata: { simulated: true },
        createdAt: notifDate,
      },
    });
  }

  // ── 16. Integration Configs ──────────────────────────────────────────────
  console.log('🔗 Creating integration configs...');
  const integrations = [
    {
      name: 'n8n',
      type: 'webhook',
      config: { webhookUrl: 'https://n8n.urbanthread.ai/webhook', apiKey: 'n8n-api-key-placeholder', enabled: true },
    },
    {
      name: 'whatsapp',
      type: 'api',
      config: { phoneNumberId: 'wa-phone-id-placeholder', accessToken: 'wa-token-placeholder', verifyToken: 'wa-verify-placeholder', businessAccountId: 'wa-ba-id-placeholder' },
    },
    {
      name: 'openai',
      type: 'api',
      config: { apiKey: 'openai-key-placeholder', model: 'gpt-4', maxTokens: 1000, temperature: 0.7 },
    },
    {
      name: 'smtp',
      type: 'smtp',
      config: { host: 'smtp.urbanthread.ai', port: 587, secure: false, user: 'noreply@urbanthread.ai', password: 'smtp-password-placeholder' },
    },
  ];

  for (const integ of integrations) {
    await prisma.integration.create({
      data: {
        name: integ.name,
        type: integ.type,
        config: integ.config as Prisma.InputJsonValue,
        isActive: true,
        lastSyncAt: randomDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), now),
      },
    });
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log('\n✅ Seed completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`   Roles: 3`);
  console.log(`   Permissions: ${permissions.length}`);
  console.log(`   Users: ${adminUsers.length}`);
  console.log(`   Document Types: ${docTypes.length}`);
  console.log(`   Clients: ${clientIds.length}`);
  console.log(`   Orders: ${orderIds.length}`);
  console.log(`   Requests: ${requestIds.length}`);
  console.log(`   Testimonials: ${testimonials.length}`);
  console.log(`   Customer Experiences: ${experiences.length}`);
  console.log(`   Analytics Events: ${analyticsEvents.length}`);
  console.log(`   Page Visits: ${pageVisits.length}`);
  console.log(`   Purchases: 55`);
  console.log(`   Chatbot Conversations: 25`);
  console.log(`   WhatsApp Messages: 25`);
  console.log(`   Notifications: 55`);
  console.log(`   Integrations: ${integrations.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
