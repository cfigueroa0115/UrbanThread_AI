import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ValidationError, NotFoundError, AuthorizationError } from '../../src/utils/errors.js';

// ── Mock repositories ────────────────────────────────────────────────────────

const mockFindById = vi.fn();
const mockCreate = vi.fn();
const mockRemove = vi.fn();

vi.mock('../../src/repositories/index.js', () => ({
  documentRepository: {
    findById: (...args: unknown[]) => mockFindById(...args),
    create: (...args: unknown[]) => mockCreate(...args),
    remove: (...args: unknown[]) => mockRemove(...args),
  },
}));

// ── Import after mocks ───────────────────────────────────────────────────────

const { validateFile, upload, download, deleteDocument } = await import(
  '../../src/services/document.service.js'
);

// ── Test data ────────────────────────────────────────────────────────────────

const now = new Date();

const validPdfFile = {
  size: 1024 * 1024, // 1 MB
  mimetype: 'application/pdf',
  originalname: 'contract.pdf',
};

const validJpgFile = {
  size: 500 * 1024, // 500 KB
  mimetype: 'image/jpeg',
  originalname: 'photo.jpg',
};

const validPngFile = {
  size: 200 * 1024,
  mimetype: 'image/png',
  originalname: 'screenshot.png',
};

const validDocxFile = {
  size: 2 * 1024 * 1024, // 2 MB
  mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  originalname: 'report.docx',
};

const mockDocument = {
  id: 'doc-001',
  clientId: 'client-001',
  fileName: 'contract.pdf',
  fileSize: 1024 * 1024,
  mimeType: 'application/pdf',
  filePath: 'uploads/client-001/contract.pdf',
  documentType: 'contract',
  status: 'active',
  uploadedBy: null,
  requestId: null,
  createdAt: now,
  updatedAt: now,
};

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Document Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── validateFile ─────────────────────────────────────────────────────────

  describe('validateFile', () => {
    it('returns valid for a PDF file within size limit', () => {
      const result = validateFile(validPdfFile);
      expect(result).toEqual({ valid: true });
    });

    it('returns valid for a JPG file', () => {
      const result = validateFile(validJpgFile);
      expect(result).toEqual({ valid: true });
    });

    it('returns valid for a PNG file', () => {
      const result = validateFile(validPngFile);
      expect(result).toEqual({ valid: true });
    });

    it('returns valid for a DOCX file', () => {
      const result = validateFile(validDocxFile);
      expect(result).toEqual({ valid: true });
    });

    it('returns invalid for an unsupported MIME type', () => {
      const file = { size: 1024, mimetype: 'application/zip', originalname: 'archive.zip' };
      const result = validateFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('application/zip');
      expect(result.error).toContain('not allowed');
    });

    it('returns invalid when file exceeds 10 MB', () => {
      const file = { size: 11 * 1024 * 1024, mimetype: 'application/pdf', originalname: 'large.pdf' };
      const result = validateFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('10 MB');
    });

    it('returns valid for a file exactly at 10 MB', () => {
      const file = { size: 10 * 1024 * 1024, mimetype: 'application/pdf', originalname: 'exact.pdf' };
      const result = validateFile(file);
      expect(result).toEqual({ valid: true });
    });

    it('returns invalid for text/plain MIME type', () => {
      const file = { size: 100, mimetype: 'text/plain', originalname: 'notes.txt' };
      const result = validateFile(file);
      expect(result.valid).toBe(false);
    });
  });

  // ── upload ───────────────────────────────────────────────────────────────

  describe('upload', () => {
    it('creates a document record for a valid file', async () => {
      mockCreate.mockResolvedValue(mockDocument);

      const result = await upload(validPdfFile, 'client-001', {
        documentType: 'contract',
      });

      expect(result).toEqual(mockDocument);
      expect(mockCreate).toHaveBeenCalledTimes(1);
      const callArg = mockCreate.mock.calls[0][0];
      expect(callArg.fileName).toBe('contract.pdf');
      expect(callArg.fileSize).toBe(1024 * 1024);
      expect(callArg.mimeType).toBe('application/pdf');
      expect(callArg.client.connect.id).toBe('client-001');
    });

    it('includes metadata in the created record', async () => {
      mockCreate.mockResolvedValue(mockDocument);

      await upload(validPdfFile, 'client-001', {
        documentType: 'invoice',
      });

      const callArg = mockCreate.mock.calls[0][0];
      expect(callArg.documentType).toBe('invoice');
    });

    it('sets filePath based on clientId and original filename', async () => {
      mockCreate.mockResolvedValue(mockDocument);

      await upload(validPdfFile, 'client-042', { documentType: 'id' });

      const callArg = mockCreate.mock.calls[0][0];
      expect(callArg.filePath).toBe('uploads/client-042/contract.pdf');
    });

    it('throws ValidationError for unsupported file type', async () => {
      const invalidFile = { size: 1024, mimetype: 'application/zip', originalname: 'archive.zip' };

      await expect(
        upload(invalidFile, 'client-001', {}),
      ).rejects.toThrow(ValidationError);

      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('throws ValidationError for file exceeding size limit', async () => {
      const largeFile = { size: 11 * 1024 * 1024, mimetype: 'application/pdf', originalname: 'huge.pdf' };

      await expect(
        upload(largeFile, 'client-001', {}),
      ).rejects.toThrow(ValidationError);

      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  // ── download ─────────────────────────────────────────────────────────────

  describe('download', () => {
    it('returns document when client owns it', async () => {
      mockFindById.mockResolvedValue(mockDocument);

      const result = await download('doc-001', 'client-001');

      expect(result).toEqual(mockDocument);
      expect(mockFindById).toHaveBeenCalledWith('doc-001');
    });

    it('throws NotFoundError when document does not exist', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(download('nonexistent', 'client-001')).rejects.toThrow(NotFoundError);
      await expect(download('nonexistent', 'client-001')).rejects.toMatchObject({
        statusCode: 404,
      });
    });

    it('throws AuthorizationError when client does not own the document', async () => {
      mockFindById.mockResolvedValue(mockDocument);

      await expect(download('doc-001', 'client-999')).rejects.toThrow(AuthorizationError);
      await expect(download('doc-001', 'client-999')).rejects.toMatchObject({
        statusCode: 403,
      });
    });
  });

  // ── deleteDocument ───────────────────────────────────────────────────────

  describe('deleteDocument', () => {
    it('deletes document when it exists', async () => {
      mockFindById.mockResolvedValue(mockDocument);
      mockRemove.mockResolvedValue(mockDocument);

      const result = await deleteDocument('doc-001');

      expect(result).toEqual(mockDocument);
      expect(mockFindById).toHaveBeenCalledWith('doc-001');
      expect(mockRemove).toHaveBeenCalledWith('doc-001');
    });

    it('throws NotFoundError when document does not exist', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(deleteDocument('nonexistent')).rejects.toThrow(NotFoundError);

      expect(mockRemove).not.toHaveBeenCalled();
    });
  });
});
