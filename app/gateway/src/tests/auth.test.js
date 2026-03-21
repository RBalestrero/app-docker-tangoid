import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getAuthTest: vi.fn(),
  verifyToken: vi.fn(),
}));

vi.mock('../services/authProxy.service.js', () => ({
  getAuthTest: mocks.getAuthTest,
}));

vi.mock('../middlewares/auth.middlewares.js', () => ({
  verifyToken: mocks.verifyToken,
}));

import app from '../app.js';

describe('Auth routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe rechazar si no hay token', async () => {
    mocks.verifyToken.mockImplementation((req, res) => {
      return res.status(401).json({ error: 'Token requerido' });
    });

    const response = await request(app).get('/auth/test');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: 'Token requerido',
    });
  });

  it('debe permitir acceso si el middleware valida', async () => {
    mocks.verifyToken.mockImplementation((req, res, next) => next());

    mocks.getAuthTest.mockResolvedValue({
      service: 'auth-service',
      status: 'ok',
    });

    const response = await request(app).get('/auth/test');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      gateway: 'ok',
      upstream: {
        service: 'auth-service',
        status: 'ok',
      },
    });
  });
});