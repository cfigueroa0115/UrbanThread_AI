import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import {
  sanitizeString,
  sanitizeValue,
  sanitizationMiddleware,
} from '../../src/middleware/sanitization.middleware.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

function mockReq(overrides: Partial<Request> = {}): Request {
  return {
    body: {},
    params: {},
    query: {},
    ...overrides,
  } as unknown as Request;
}

function mockRes(): Response {
  return {} as Response;
}

// ── sanitizeString ───────────────────────────────────────────────────────────

describe('sanitizeString', () => {
  it('escapes HTML tags to prevent XSS', () => {
    expect(sanitizeString('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
    );
  });

  it('escapes all HTML-significant characters', () => {
    expect(sanitizeString('a & b < c > d " e \' f')).toBe(
      'a &amp; b &lt; c &gt; d &quot; e &#x27; f',
    );
  });

  it('removes null bytes', () => {
    expect(sanitizeString('hello\0world')).toBe('helloworld');
    expect(sanitizeString('\0\0\0')).toBe('');
  });

  it('trims whitespace', () => {
    expect(sanitizeString('  hello  ')).toBe('hello');
    expect(sanitizeString('\t\n spaced \n\t')).toBe('spaced');
  });

  it('preserves legitimate email addresses', () => {
    expect(sanitizeString('user@example.com')).toBe('user@example.com');
  });

  it('preserves legitimate URLs in data fields', () => {
    // Note: & in URLs gets escaped, which is correct for HTML context safety.
    // The URL remains functionally valid when decoded.
    expect(sanitizeString('https://example.com/path?a=1')).toBe(
      'https://example.com/path?a=1',
    );
  });

  it('handles empty string', () => {
    expect(sanitizeString('')).toBe('');
  });

  it('handles string with only whitespace and null bytes', () => {
    expect(sanitizeString('  \0  ')).toBe('');
  });
});

// ── sanitizeValue ────────────────────────────────────────────────────────────

describe('sanitizeValue', () => {
  it('sanitizes a plain string', () => {
    expect(sanitizeValue('<b>bold</b>')).toBe('&lt;b&gt;bold&lt;/b&gt;');
  });

  it('passes through numbers unchanged', () => {
    expect(sanitizeValue(42)).toBe(42);
    expect(sanitizeValue(3.14)).toBe(3.14);
    expect(sanitizeValue(0)).toBe(0);
  });

  it('passes through booleans unchanged', () => {
    expect(sanitizeValue(true)).toBe(true);
    expect(sanitizeValue(false)).toBe(false);
  });

  it('passes through null and undefined unchanged', () => {
    expect(sanitizeValue(null)).toBe(null);
    expect(sanitizeValue(undefined)).toBe(undefined);
  });

  it('sanitizes strings inside arrays', () => {
    expect(sanitizeValue(['<a>', 'safe', '<img>'])).toEqual([
      '&lt;a&gt;',
      'safe',
      '&lt;img&gt;',
    ]);
  });

  it('preserves non-string values inside arrays', () => {
    expect(sanitizeValue([1, true, null, 'text'])).toEqual([1, true, null, 'text']);
  });

  it('sanitizes strings in nested objects', () => {
    const input = {
      name: '<script>alert(1)</script>',
      address: {
        city: 'Bogotá',
        note: '<b>urgent</b>',
      },
    };
    expect(sanitizeValue(input)).toEqual({
      name: '&lt;script&gt;alert(1)&lt;/script&gt;',
      address: {
        city: 'Bogotá',
        note: '&lt;b&gt;urgent&lt;/b&gt;',
      },
    });
  });

  it('handles deeply nested structures', () => {
    const input = { a: { b: { c: { d: '<xss>' } } } };
    expect(sanitizeValue(input)).toEqual({
      a: { b: { c: { d: '&lt;xss&gt;' } } },
    });
  });

  it('handles arrays of objects', () => {
    const input = [
      { name: '<em>test</em>', count: 5 },
      { name: 'safe', count: 10 },
    ];
    expect(sanitizeValue(input)).toEqual([
      { name: '&lt;em&gt;test&lt;/em&gt;', count: 5 },
      { name: 'safe', count: 10 },
    ]);
  });
});

// ── sanitizationMiddleware ───────────────────────────────────────────────────

describe('sanitizationMiddleware', () => {
  it('calls next() after sanitization', () => {
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn();

    sanitizationMiddleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it('sanitizes req.body strings', () => {
    const req = mockReq({
      body: { name: '<script>xss</script>', age: 25 },
    });
    const next = vi.fn();

    sanitizationMiddleware(req, mockRes(), next);

    expect(req.body).toEqual({
      name: '&lt;script&gt;xss&lt;/script&gt;',
      age: 25,
    });
  });

  it('sanitizes req.query strings', () => {
    const req = mockReq({
      query: { search: '<img onerror=alert(1)>', page: '1' } as Record<string, string>,
    });
    const next = vi.fn();

    sanitizationMiddleware(req, mockRes(), next);

    expect((req.query as Record<string, string>).search).toBe(
      '&lt;img onerror=alert(1)&gt;',
    );
    expect((req.query as Record<string, string>).page).toBe('1');
  });

  it('sanitizes req.params strings', () => {
    const req = mockReq({
      params: { id: 'abc\0def' } as Record<string, string>,
    });
    const next = vi.fn();

    sanitizationMiddleware(req, mockRes(), next);

    expect(req.params.id).toBe('abcdef');
  });

  it('handles XSS payloads in body', () => {
    const xssPayloads = [
      '<script>document.cookie</script>',
      '<img src=x onerror=alert(1)>',
      '<svg onload=alert(1)>',
      '"><script>alert(1)</script>',
      "javascript:alert('XSS')",
    ];

    for (const payload of xssPayloads) {
      const req = mockReq({ body: { input: payload } });
      const next = vi.fn();

      sanitizationMiddleware(req, mockRes(), next);

      expect(req.body.input).not.toContain('<script>');
      expect(req.body.input).not.toContain('<img');
      expect(req.body.input).not.toContain('<svg');
    }
  });

  it('handles SQL injection strings without breaking them (escapes HTML only)', () => {
    const sqlPayloads = [
      "'; DROP TABLE users; --",
      "1' OR '1'='1",
      "admin'--",
      "1; DELETE FROM orders",
    ];

    for (const payload of sqlPayloads) {
      const req = mockReq({ body: { input: payload } });
      const next = vi.fn();

      sanitizationMiddleware(req, mockRes(), next);

      // The sanitizer escapes HTML chars and trims; SQL-specific chars like
      // single quotes get HTML-escaped. The content is still present.
      expect(req.body.input).toBe(sanitizeString(payload));
      expect(next).toHaveBeenCalled();
    }
  });

  it('removes null bytes from all request sources', () => {
    const req = mockReq({
      body: { data: 'hello\0world' },
      query: { q: 'test\0value' } as Record<string, string>,
      params: { id: 'abc\0' + '123' } as Record<string, string>,
    });
    const next = vi.fn();

    sanitizationMiddleware(req, mockRes(), next);

    expect(req.body.data).toBe('helloworld');
    expect((req.query as Record<string, string>).q).toBe('testvalue');
    expect(req.params.id).toBe('abc123');
  });

  it('preserves nested objects and arrays in body', () => {
    const req = mockReq({
      body: {
        items: [
          { name: '<b>Item 1</b>', price: 19.99 },
          { name: 'Item 2', price: 29.99 },
        ],
        metadata: {
          tags: ['<script>', 'safe-tag'],
          count: 2,
          active: true,
        },
      },
    });
    const next = vi.fn();

    sanitizationMiddleware(req, mockRes(), next);

    expect(req.body).toEqual({
      items: [
        { name: '&lt;b&gt;Item 1&lt;/b&gt;', price: 19.99 },
        { name: 'Item 2', price: 29.99 },
      ],
      metadata: {
        tags: ['&lt;script&gt;', 'safe-tag'],
        count: 2,
        active: true,
      },
    });
  });

  it('preserves legitimate content (emails, normal text)', () => {
    const req = mockReq({
      body: {
        email: 'user@example.com',
        name: 'María García',
        phone: '+57 300 123 4567',
        description: 'Solicitud de pedido #12345',
      },
    });
    const next = vi.fn();

    sanitizationMiddleware(req, mockRes(), next);

    expect(req.body).toEqual({
      email: 'user@example.com',
      name: 'María García',
      phone: '+57 300 123 4567',
      description: 'Solicitud de pedido #12345',
    });
  });

  it('handles empty body/query/params gracefully', () => {
    const req = mockReq({ body: {}, query: {}, params: {} as Record<string, string> });
    const next = vi.fn();

    sanitizationMiddleware(req, mockRes(), next);

    expect(req.body).toEqual({});
    expect(req.query).toEqual({});
    expect(req.params).toEqual({});
    expect(next).toHaveBeenCalledOnce();
  });
});
