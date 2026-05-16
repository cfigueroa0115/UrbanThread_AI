import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../setup/test-server.js';

describe('Health check', () => {
  it('GET /api/v1/health returns 200 with status ok', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
  });
});
