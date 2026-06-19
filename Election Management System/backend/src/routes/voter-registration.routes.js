// src/routes/voter-registration.routes.js
import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  registerVoter,
  finalizeVoters,
  getRegistrationStatus,
  cancelRegistration
} from '../controllers/voter-registration.controller.js';

const router = express.Router({ mergeParams: true });

/**
 * POST /api/elections/:electionId/register
 * Register for election
 */
router.post('/', authenticate, registerVoter);

/**
 * GET /api/elections/:electionId/register/status
 * Get registration status
 */
router.get('/status', authenticate, getRegistrationStatus);

/**
 * DELETE /api/elections/:electionId/register
 * Cancel registration
 */
router.delete('/', authenticate, cancelRegistration);

/**
 * POST /api/elections/:electionId/register/finalize
 * Finalize voters and send secret IDs (admin only - will add middleware)
 */
router.post('/finalize', authenticate, finalizeVoters);

export default router;
