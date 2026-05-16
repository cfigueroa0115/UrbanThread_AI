/**
 * Shared Express app instance for integration tests.
 *
 * Usage in test files:
 *
 *   import { app } from '../setup/test-server.js';
 *   import request from 'supertest';
 *
 *   it('returns 200 on health check', async () => {
 *     const res = await request(app).get('/api/v1/health');
 *     expect(res.status).toBe(200);
 *   });
 */
import app from '../../src/app.js';

export { app };
