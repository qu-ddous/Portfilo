// src/routes/vote.routes.js
import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { castVote, checkIfVoted } from '../controllers/vote.controller.js';

const router = express.Router();

/**
 * POST /api/votes/cast
 * Cast a vote (requires authentication)
 * 
 * Body:
 * {
 *   "election_id": "uuid",
 *   "candidate_id": "uuid",
 *   "secret_id": "ELEC-0042"
 * }
 */
router.post('/cast', authenticate, castVote);

/**
 * GET /api/votes/my-vote/:electionId
 * Check if current user has voted in an election (returns boolean only)
 */
router.get('/my-vote/:electionId', authenticate, checkIfVoted);

export default router;
