import { clientRepository } from '../repositories/index.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import type { Prisma } from '@prisma/client';

// ── Client Service ───────────────────────────────────────────────────────────

/**
 * Retrieve a paginated list of clients.
 *
 * @returns Object with `data` (client array) and `total` count.
 */
export async function getAll(page: number, pageSize: number) {
  return clientRepository.findAll({ page, pageSize });
}

/**
 * Find a client by its unique ID.
 *
 * @throws {NotFoundError} when no client exists with the given ID
 */
export async function getById(id: string) {
  const client = await clientRepository.findById(id);

  if (!client) {
    throw new NotFoundError(`No se encontr� un cliente con id "${id}"`);
  }

  return client;
}

/**
 * Find a client by document type and number.
 *
 * @throws {NotFoundError} when no client matches the document
 */
export async function getByDocument(documentType: string, documentNumber: string) {
  const client = await clientRepository.findByDocument(documentType, documentNumber);

  if (!client) {
    throw new NotFoundError(
      `No se encontró un cliente con documento ${documentType} ${documentNumber}`,
    );
  }

  return client;
}

/**
 * Retrieve full client detail including addresses, emails, phones,
 * documents, profile, orders and requests.
 *
 * Validates: Requirements 2.5, 6.2, 7.2
 *
 * @throws {NotFoundError} when no client exists with the given ID
 */
export async function getClientDetail(id: string) {
  const detail = await clientRepository.findWithDetails(id);

  if (!detail) {
    throw new NotFoundError(`No se encontr� un cliente con id "${id}"`);
  }

  return detail;
}

/**
 * Create a new client.
 *
 * Checks for duplicate document type + number before creating.
 *
 * @throws {ConflictError} when a client with the same document already exists
 */
export async function create(data: Prisma.ClientCreateInput) {
  const existing = await clientRepository.findByDocument(
    data.documentType,
    data.documentNumber,
  );

  if (existing) {
    throw new ConflictError(
      `Ya existe un cliente con documento ${data.documentType} ${data.documentNumber}`,
    );
  }

  return clientRepository.create(data);
}

/**
 * Update an existing client.
 *
 * @throws {NotFoundError} when no client exists with the given ID
 */
export async function update(id: string, data: Prisma.ClientUpdateInput) {
  const existing = await clientRepository.findById(id);

  if (!existing) {
    throw new NotFoundError(`No se encontr� un cliente con id "${id}"`);
  }

  return clientRepository.update(id, data);
}

/**
 * Remove a client by ID.
 *
 * @throws {NotFoundError} when no client exists with the given ID
 */
export async function remove(id: string) {
  const existing = await clientRepository.findById(id);

  if (!existing) {
    throw new NotFoundError(`No se encontr� un cliente con id "${id}"`);
  }

  return clientRepository.remove(id);
}

/**
 * Find a client by their primary email address.
 *
 * @returns The client or null if not found
 */
export async function getByEmail(email: string) {
  return clientRepository.findByEmail(email);
}
