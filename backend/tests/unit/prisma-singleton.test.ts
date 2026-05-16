import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Prisma Singleton', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    // Clean up the global prisma reference between tests
    const g = globalThis as unknown as { prisma: unknown };
    delete g.prisma;
    vi.resetModules();
  });

  it('should export a prisma instance', async () => {
    const { prisma } = await import('../../src/lib/prisma.js');
    expect(prisma).toBeDefined();
    expect(prisma).toHaveProperty('$connect');
    expect(prisma).toHaveProperty('$disconnect');
  });

  it('should return the same instance on multiple imports (singleton)', async () => {
    const mod1 = await import('../../src/lib/prisma.js');
    const mod2 = await import('../../src/lib/prisma.js');
    expect(mod1.prisma).toBe(mod2.prisma);
  });

  it('should store instance on globalThis in non-production', async () => {
    process.env.NODE_ENV = 'development';
    vi.resetModules();
    await import('../../src/lib/prisma.js');
    const g = globalThis as unknown as { prisma: unknown };
    expect(g.prisma).toBeDefined();
  });
});
