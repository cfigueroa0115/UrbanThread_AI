import { describe, it, expect } from 'vitest';
import { Decimal } from '@prisma/client/runtime/library';
import {
  serializeClient,
  deserializeClient,
  serializeOrder,
  deserializeOrder,
  serializeRequest,
  deserializeRequest,
  serializeDocument,
  deserializeDocument,
  serializeApiResponse,
  type PrismaClient,
  type PrismaOrder,
  type PrismaRequest,
  type PrismaDocument,
} from '../../src/utils/serialization.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

function makePrismaClient(overrides: Partial<PrismaClient> = {}): PrismaClient {
  return {
    id: 'c-001',
    documentType: 'CC',
    documentNumber: '1234567890',
    firstName: 'María',
    lastName: 'García',
    dateOfBirth: new Date('1990-05-15T00:00:00.000Z'),
    gender: 'female',
    isActive: true,
    createdAt: new Date('2024-01-10T08:30:00.000Z'),
    updatedAt: new Date('2024-06-20T14:00:00.000Z'),
    ...overrides,
  };
}

function makePrismaOrder(overrides: Partial<PrismaOrder> = {}): PrismaOrder {
  return {
    id: 'o-001',
    clientId: 'c-001',
    orderNumber: 'ORD-2024-0001',
    status: 'pending',
    totalAmount: new Decimal('150000.50'),
    currency: 'COP',
    notes: 'Entrega urgente',
    createdAt: new Date('2024-03-01T10:00:00.000Z'),
    updatedAt: new Date('2024-03-02T12:00:00.000Z'),
    ...overrides,
  };
}

function makePrismaRequest(overrides: Partial<PrismaRequest> = {}): PrismaRequest {
  return {
    id: 'r-001',
    clientId: 'c-001',
    radicationNumber: 'RAD-2024-0001',
    type: 'complaint',
    description: 'Producto defectuoso',
    priority: 'high',
    status: 'registered',
    assignedTo: 'u-admin-001',
    createdAt: new Date('2024-04-01T09:00:00.000Z'),
    updatedAt: new Date('2024-04-02T11:00:00.000Z'),
    ...overrides,
  };
}

function makePrismaDocument(overrides: Partial<PrismaDocument> = {}): PrismaDocument {
  return {
    id: 'd-001',
    requestId: 'r-001',
    clientId: 'c-001',
    fileName: 'factura.pdf',
    filePath: '/uploads/factura.pdf',
    fileSize: 204800,
    mimeType: 'application/pdf',
    documentType: 'invoice',
    status: 'active',
    uploadedBy: 'u-admin-001',
    createdAt: new Date('2024-05-01T07:00:00.000Z'),
    updatedAt: new Date('2024-05-01T07:00:00.000Z'),
    ...overrides,
  };
}

// ── Client serialization ─────────────────────────────────────────────────────

describe('serializeClient / deserializeClient', () => {
  it('round-trips a full client object', () => {
    const prisma = makePrismaClient();
    const json = serializeClient(prisma);
    const back = deserializeClient(json);

    expect(back.id).toBe(prisma.id);
    expect(back.documentType).toBe(prisma.documentType);
    expect(back.documentNumber).toBe(prisma.documentNumber);
    expect(back.firstName).toBe(prisma.firstName);
    expect(back.lastName).toBe(prisma.lastName);
    expect(back.dateOfBirth?.toISOString()).toBe(prisma.dateOfBirth?.toISOString());
    expect(back.gender).toBe(prisma.gender);
    expect(back.isActive).toBe(prisma.isActive);
    expect(back.createdAt.toISOString()).toBe(prisma.createdAt.toISOString());
    expect(back.updatedAt.toISOString()).toBe(prisma.updatedAt.toISOString());
  });

  it('serializes dates to ISO strings', () => {
    const prisma = makePrismaClient();
    const json = serializeClient(prisma);

    expect(typeof json.createdAt).toBe('string');
    expect(typeof json.updatedAt).toBe('string');
    expect(typeof json.dateOfBirth).toBe('string');
    expect(json.createdAt).toBe('2024-01-10T08:30:00.000Z');
  });

  it('preserves null dateOfBirth', () => {
    const prisma = makePrismaClient({ dateOfBirth: null });
    const json = serializeClient(prisma);

    expect(json.dateOfBirth).toBeNull();

    const back = deserializeClient(json);
    expect(back.dateOfBirth).toBeNull();
  });

  it('preserves null gender', () => {
    const prisma = makePrismaClient({ gender: null });
    const json = serializeClient(prisma);

    expect(json.gender).toBeNull();

    const back = deserializeClient(json);
    expect(back.gender).toBeNull();
  });

  it('deserializes ISO strings back to Date objects', () => {
    const prisma = makePrismaClient();
    const json = serializeClient(prisma);
    const back = deserializeClient(json);

    expect(back.createdAt).toBeInstanceOf(Date);
    expect(back.updatedAt).toBeInstanceOf(Date);
    expect(back.dateOfBirth).toBeInstanceOf(Date);
  });
});

// ── Order serialization ──────────────────────────────────────────────────────

describe('serializeOrder / deserializeOrder', () => {
  it('round-trips a full order object', () => {
    const prisma = makePrismaOrder();
    const json = serializeOrder(prisma);
    const back = deserializeOrder(json);

    expect(back.id).toBe(prisma.id);
    expect(back.clientId).toBe(prisma.clientId);
    expect(back.orderNumber).toBe(prisma.orderNumber);
    expect(back.status).toBe(prisma.status);
    expect(back.totalAmount.toNumber()).toBe(prisma.totalAmount.toNumber());
    expect(back.currency).toBe(prisma.currency);
    expect(back.notes).toBe(prisma.notes);
    expect(back.createdAt.toISOString()).toBe(prisma.createdAt.toISOString());
    expect(back.updatedAt.toISOString()).toBe(prisma.updatedAt.toISOString());
  });

  it('serializes Decimal to number', () => {
    const prisma = makePrismaOrder();
    const json = serializeOrder(prisma);

    expect(typeof json.totalAmount).toBe('number');
    expect(json.totalAmount).toBe(150000.5);
  });

  it('deserializes number back to Decimal', () => {
    const prisma = makePrismaOrder();
    const json = serializeOrder(prisma);
    const back = deserializeOrder(json);

    expect(back.totalAmount).toBeInstanceOf(Decimal);
    expect(back.totalAmount.toNumber()).toBe(150000.5);
  });

  it('preserves null notes', () => {
    const prisma = makePrismaOrder({ notes: null });
    const json = serializeOrder(prisma);

    expect(json.notes).toBeNull();

    const back = deserializeOrder(json);
    expect(back.notes).toBeNull();
  });

  it('handles zero totalAmount', () => {
    const prisma = makePrismaOrder({ totalAmount: new Decimal('0') });
    const json = serializeOrder(prisma);

    expect(json.totalAmount).toBe(0);

    const back = deserializeOrder(json);
    expect(back.totalAmount.toNumber()).toBe(0);
  });
});

// ── Request serialization ────────────────────────────────────────────────────

describe('serializeRequest / deserializeRequest', () => {
  it('round-trips a full request object', () => {
    const prisma = makePrismaRequest();
    const json = serializeRequest(prisma);
    const back = deserializeRequest(json);

    expect(back.id).toBe(prisma.id);
    expect(back.clientId).toBe(prisma.clientId);
    expect(back.radicationNumber).toBe(prisma.radicationNumber);
    expect(back.type).toBe(prisma.type);
    expect(back.description).toBe(prisma.description);
    expect(back.priority).toBe(prisma.priority);
    expect(back.status).toBe(prisma.status);
    expect(back.assignedTo).toBe(prisma.assignedTo);
    expect(back.createdAt.toISOString()).toBe(prisma.createdAt.toISOString());
    expect(back.updatedAt.toISOString()).toBe(prisma.updatedAt.toISOString());
  });

  it('preserves null assignedTo', () => {
    const prisma = makePrismaRequest({ assignedTo: null });
    const json = serializeRequest(prisma);

    expect(json.assignedTo).toBeNull();

    const back = deserializeRequest(json);
    expect(back.assignedTo).toBeNull();
  });

  it('serializes dates to ISO strings', () => {
    const prisma = makePrismaRequest();
    const json = serializeRequest(prisma);

    expect(typeof json.createdAt).toBe('string');
    expect(typeof json.updatedAt).toBe('string');
  });
});

// ── Document serialization ───────────────────────────────────────────────────

describe('serializeDocument / deserializeDocument', () => {
  it('round-trips a full document object', () => {
    const prisma = makePrismaDocument();
    const json = serializeDocument(prisma);
    const back = deserializeDocument(json);

    expect(back.id).toBe(prisma.id);
    expect(back.requestId).toBe(prisma.requestId);
    expect(back.clientId).toBe(prisma.clientId);
    expect(back.fileName).toBe(prisma.fileName);
    expect(back.filePath).toBe(prisma.filePath);
    expect(back.fileSize).toBe(prisma.fileSize);
    expect(back.mimeType).toBe(prisma.mimeType);
    expect(back.documentType).toBe(prisma.documentType);
    expect(back.status).toBe(prisma.status);
    expect(back.uploadedBy).toBe(prisma.uploadedBy);
    expect(back.createdAt.toISOString()).toBe(prisma.createdAt.toISOString());
    expect(back.updatedAt.toISOString()).toBe(prisma.updatedAt.toISOString());
  });

  it('preserves null requestId', () => {
    const prisma = makePrismaDocument({ requestId: null });
    const json = serializeDocument(prisma);

    expect(json.requestId).toBeNull();

    const back = deserializeDocument(json);
    expect(back.requestId).toBeNull();
  });

  it('preserves null clientId', () => {
    const prisma = makePrismaDocument({ clientId: null });
    const json = serializeDocument(prisma);

    expect(json.clientId).toBeNull();

    const back = deserializeDocument(json);
    expect(back.clientId).toBeNull();
  });

  it('preserves null documentType and uploadedBy', () => {
    const prisma = makePrismaDocument({ documentType: null, uploadedBy: null });
    const json = serializeDocument(prisma);

    expect(json.documentType).toBeNull();
    expect(json.uploadedBy).toBeNull();

    const back = deserializeDocument(json);
    expect(back.documentType).toBeNull();
    expect(back.uploadedBy).toBeNull();
  });
});

// ── serializeApiResponse ─────────────────────────────────────────────────────

describe('serializeApiResponse', () => {
  it('wraps data in standard envelope', () => {
    const result = serializeApiResponse({ name: 'test' });

    expect(result.status).toBe('success');
    expect(result.data).toEqual({ name: 'test' });
    expect(result.meta).toBeUndefined();
  });

  it('includes meta when provided', () => {
    const meta = { page: 1, pageSize: 20, total: 100, totalPages: 5 };
    const result = serializeApiResponse([1, 2, 3], meta);

    expect(result.status).toBe('success');
    expect(result.data).toEqual([1, 2, 3]);
    expect(result.meta).toEqual(meta);
  });

  it('omits meta when not provided', () => {
    const result = serializeApiResponse('hello');

    expect(result).not.toHaveProperty('meta');
  });

  it('works with null data', () => {
    const result = serializeApiResponse(null);

    expect(result.status).toBe('success');
    expect(result.data).toBeNull();
  });

  it('works with serialized domain objects', () => {
    const prisma = makePrismaClient();
    const serialized = serializeClient(prisma);
    const response = serializeApiResponse(serialized);

    expect(response.status).toBe('success');
    expect(response.data).toEqual(serialized);
  });
});
