import { Router } from 'express';
import { loginAdmin, refreshToken, logout } from '../controllers/auth.controller.js';
import { requestOTP, verifyOTP, resendOTP, validateDocument, registerClient, socialLookup } from '../controllers/otp.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { authRateLimiter } from '../middleware/rate-limiter.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
  LoginAdminSchema,
  OTPRequestSchema,
  OTPVerifySchema,
} from '@shared/schemas/index.js';

// ── Auth Router ──────────────────────────────────────────────────────────────

const router = Router();

// ── Admin authentication ─────────────────────────────────────────────────────

/** POST /auth/admin/login — Authenticate admin with email/password */
router.post(
  '/admin/login',
  validate({ body: LoginAdminSchema }),
  authRateLimiter,
  loginAdmin,
);

/** POST /auth/admin/refresh — Refresh JWT token (requires auth) */
router.post(
  '/admin/refresh',
  authMiddleware,
  refreshToken,
);

/** POST /auth/admin/logout — Revoke session token (requires auth) */
router.post(
  '/admin/logout',
  authMiddleware,
  logout,
);

// ── Client OTP authentication ────────────────────────────────────────────────

/** POST /auth/otp/request — Request OTP code for client login */
router.post(
  '/otp/request',
  validate({ body: OTPRequestSchema }),
  authRateLimiter,
  requestOTP,
);

/** POST /auth/otp/verify — Verify OTP code and get client token */
router.post(
  '/otp/verify',
  validate({ body: OTPVerifySchema }),
  verifyOTP,
);

/** POST /auth/otp/resend — Resend OTP code */
router.post(
  '/otp/resend',
  validate({ body: OTPRequestSchema }),
  authRateLimiter,
  resendOTP,
);

/** POST /auth/validate-document — Validate document via n8n + local DB */
router.post(
  '/validate-document',
  validateDocument,
);

/** POST /auth/register-client — Register a new client */
router.post(
  '/register-client',
  registerClient,
);

/** POST /auth/social/lookup — Look up client by email (Google/Apple) and send OTP */
router.post(
  '/social/lookup',
  authRateLimiter,
  socialLookup,
);

export default router;
