import { describe, it, expect } from 'vitest';

describe('Frontend test setup', () => {
  it('vitest runs in jsdom environment', () => {
    expect(typeof document).toBe('object');
    expect(typeof window).toBe('object');
  });
});
