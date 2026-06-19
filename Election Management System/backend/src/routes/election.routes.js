// src/routes/election.routes.js
import express from 'express';
import { authenticate, requireCreator } from '../middleware/auth.middleware.js';
import {
  createElection,
  getElections,
  getElectionById,
  updateElection,
  publishElection,
  startElection,
  stopElection,
  getElectionResults,
  deleteElection
} from '../controllers/election.controller.js';

const router = express.Router();

/**
 * POST /api/elections/
 * Create a new election (creator only)
 */
router.post('/', authenticate, requireCreator, createElection);

/**
 * GET /api/elections/
 * Get all elections (public: published/active/completed)
 */
router.get('/', getElections);

/**
 * GET /api/elections/:id
 * Get election detail by ID
 */
router.get('/:id', getElectionById);

/**
 * PUT /api/elections/:id
 * Update election (creator only, draft only)
 */
router.put('/:id', authenticate, requireCreator, updateElection);

/**
 * PATCH /api/elections/:id/publish
 * Publish election (draft → published)
 */
router.patch('/:id/publish', authenticate, requireCreator, publishElection);

/**
 * PATCH /api/elections/:id/start
 * Start election (published → active)
 */
router.patch('/:id/start', authenticate, requireCreator, startElection);

/**
 * PATCH /api/elections/:id/stop
 * Stop election (active → completed)
 */
router.patch('/:id/stop', authenticate, requireCreator, stopElection);

/**
 * GET /api/elections/:id/results
 * Get election results (vote counts)
 */
router.get('/:id/results', getElectionResults);

/**
 * DELETE /api/elections/:id
 * Delete election (creator only, draft only)
 */
router.delete('/:id', authenticate, requireCreator, deleteElection);

export default router;
