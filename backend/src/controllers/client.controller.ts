import type { Request, Response, NextFunction } from 'express';
import * as clientService from '../services/client.service.js';
import { prisma } from '../lib/prisma.js';

// ── Client Controller ───────────────────────────────────────────────────────

/**
 * GET /api/v1/clients
 *
 * Paginated list of clients. Requires JWT + RBAC (clients:read).
 *
 * Validates: Requirements 3.1, 7.1, 7.2
 */
export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, pageSize } = req.query as unknown as { page: number; pageSize: number };
    const result = await clientService.getAll(page, pageSize);

    res.status(200).json({
      status: 'success',
      data: result.data,
      meta: {
        total: result.total,
        page,
        pageSize,
        totalPages: Math.ceil(result.total / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/clients/:id
 *
 * Get a single client by ID. Requires JWT + RBAC (clients:read).
 *
 * Validates: Requirements 3.1, 7.1, 7.2, 2.5
 */
export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const client = await clientService.getById(id);

    res.status(200).json({
      status: 'success',
      data: client,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/clients/document/:type/:number
 *
 * Find a client by document type and number. Requires JWT.
 *
 * Validates: Requirements 3.1, 7.1, 7.2
 */
export async function getByDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const type = req.params.type as string;
    const number = req.params.number as string;
    const client = await clientService.getByDocument(type, number);

    res.status(200).json({
      status: 'success',
      data: client,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/clients
 *
 * Create a new client. Requires JWT + RBAC (clients:create).
 *
 * Validates: Requirements 3.1, 7.1, 7.2
 */
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const client = await clientService.create(req.body);

    res.status(201).json({
      status: 'success',
      data: client,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/v1/clients/:id
 *
 * Update an existing client. Requires JWT + RBAC (clients:update).
 *
 * Validates: Requirements 3.1, 7.1, 7.2
 */
export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const client = await clientService.update(id, req.body);

    res.status(200).json({
      status: 'success',
      data: client,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/clients/:id
 *
 * Delete a client. Requires JWT + RBAC (clients:delete).
 *
 * Validates: Requirements 3.1, 7.1, 7.2
 */
export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    await clientService.remove(id);

    res.status(200).json({
      status: 'success',
      data: { message: 'Cliente eliminado exitosamente' },
    });
  } catch (error) {
    next(error);
  }
}

// ── Sub-resource controllers ────────────────────────────────────────────────

/**
 * GET /api/v1/clients/:id/addresses
 *
 * Get all addresses for a client. Requires JWT.
 *
 * Validates: Requirements 2.5, 7.2
 */
export async function getAddresses(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;

    // Ensure client exists
    await clientService.getById(id);

    const addresses = await prisma.clientAddress.findMany({
      where: { clientId: id },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      status: 'success',
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/clients/:id/addresses
 *
 * Add an address to a client. Requires JWT.
 *
 * Validates: Requirements 2.5, 7.2
 */
export async function createAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;

    // Ensure client exists
    await clientService.getById(id);

    const address = await prisma.clientAddress.create({
      data: {
        ...req.body,
        client: { connect: { id } },
      },
    });

    res.status(201).json({
      status: 'success',
      data: address,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/clients/:id/documents
 *
 * Get all documents for a client. Requires JWT.
 *
 * Validates: Requirements 2.5, 7.2
 */
export async function getDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;

    // Ensure client exists
    await clientService.getById(id);

    const documents = await prisma.clientDocument.findMany({
      where: { clientId: id },
      include: { documentType: true },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      status: 'success',
      data: documents,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/clients/:id/orders
 *
 * Get all orders for a client. Requires JWT.
 *
 * Validates: Requirements 2.5, 7.2
 */
export async function getOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;

    // Ensure client exists
    await clientService.getById(id);

    const orders = await prisma.order.findMany({
      where: { clientId: id },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      status: 'success',
      data: orders,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/clients/:id/requests
 *
 * Get all requests for a client. Requires JWT.
 *
 * Validates: Requirements 2.5, 7.2
 */
export async function getRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;

    // Ensure client exists
    await clientService.getById(id);

    const requests = await prisma.request.findMany({
      where: { clientId: id },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      status: 'success',
      data: requests,
    });
  } catch (error) {
    next(error);
  }
}
