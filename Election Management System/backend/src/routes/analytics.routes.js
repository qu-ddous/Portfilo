// backend/src/routes/analytics.routes.js
import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';
import {
  getElectionAnalytics,
  getSystemAnalytics,
  getVotingTimeline
} from '../controllers/analytics.controller.js';

const router = express.Router();

/**
 * GET /api/analytics/election/:electionId
 * Get detailed election analytics
 */
router.get('/election/:electionId', authenticate, getElectionAnalytics);

/**
 * GET /api/analytics/system
 * Get system-wide analytics (admin only)
 */
router.get('/system', authenticate, requireAdmin, getSystemAnalytics);

/**
 * GET /api/analytics/voting-timeline/:electionId
 * Get voting timeline for election
 */
router.get('/voting-timeline/:electionId', authenticate, getVotingTimeline);

export default router;
