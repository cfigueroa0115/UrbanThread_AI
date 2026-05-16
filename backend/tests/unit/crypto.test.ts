import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from '../../src/utils/crypto.js';

describe('Crypto utilities', () => {
  describe('hashPassword', () => {
    it('returns a bcrypt hash string', async () => {
      const hash = await hashPassword('MyP@ssw0rd');
      // bcrypt hashes start with $2a$ or $2b$
      expect(hash).toMatch(/^\$2[ab]\$/);
    });

    it('produces different hashes for the same input (unique salts)', async () => {
      const hash1 = await hashPassword('same-password');
      const hash2 = await hashPassword('same-password');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('returns true for a matching password', async () => {
      const password = 'Str0ng!Pass';
      const hash = await hashPassword(password);
      const result = await comparePassword(password, hash);
      expect(result).toBe(true);
    });

    it('returns false for a non-matching password', async () => {
      const hash = await hashPassword('correct-password');
      const result = await comparePassword('wrong-password', hash);
      expect(result).toBe(false);
    });
  });
});
