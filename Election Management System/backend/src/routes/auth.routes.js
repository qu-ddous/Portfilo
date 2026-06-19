// src/routes/auth.routes.js
import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  register,
  login,
  getProfile,
  requestCreator,
  updateProfile
} from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register new user
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', login);

/**
 * GET /api/auth/me
 * Get current user profile (requires auth)
 */
router.get('/me', authenticate, getProfile);

/**
 * POST /api/auth/request-creator
 * Request creator role (requires auth)
 */
router.post('/request-creator', authenticate, requestCreator);

/**
 * PATCH /api/auth/profile
 * Update profile (requires auth)
 */
router.patch('/profile', authenticate, updateProfile);

export default router;
