// backend/src/routes/twofa.routes.js
import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  generateTwoFASecret,
  enableTwoFA,
  disableTwoFA,
  verifyTwoFACode,
  getTwoFAStatus
} from '../controllers/twofa.controller.js';

const router = express.Router();

/**
 * POST /api/2fa/generate-secret
 * Generate 2FA secret for current user
 */
router.post('/generate-secret', authenticate, generateTwoFASecret);

/**
 * POST /api/2fa/enable
 * Enable 2FA with verification code
 */
router.post('/enable', authenticate, enableTwoFA);

/**
 * POST /api/2fa/disable
 * Disable 2FA
 */
router.post('/disable', authenticate, disableTwoFA);

/**
 * POST /api/2fa/verify
 * Verify 2FA code during login
 */
router.post('/verify', verifyTwoFACode);

/**
 * GET /api/2fa/status
 * Get 2FA status for current user
 */
router.get('/status', authenticate, getTwoFAStatus);

export default router;
