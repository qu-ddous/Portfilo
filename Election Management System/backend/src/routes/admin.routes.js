// src/routes/admin.routes.js
import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';
import {
  getCreatorRequests,
  approveCreator,
  rejectCreator,
  getAllUsers,
  getAuditLogs,
  getSystemStats
} from '../controllers/admin.controller.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate, requireAdmin);

/**
 * GET /api/admin/creator-requests
 * Get all creator requests (pending/approved/rejected)
 */
router.get('/creator-requests', getCreatorRequests);

/**
 * PATCH /api/admin/creator-requests/:requestId/approve
 * Approve creator request
 */
router.patch('/creator-requests/:requestId/approve', approveCreator);

/**
 * PATCH /api/admin/creator-requests/:requestId/reject
 * Reject creator request
 */
router.patch('/creator-requests/:requestId/reject', rejectCreator);

/**
 * GET /api/admin/users
 * Get all users
 */
router.get('/users', getAllUsers);

/**
 * GET /api/admin/audit-logs
 * Get audit logs
 */
router.get('/audit-logs', getAuditLogs);

/**
 * GET /api/admin/stats
 * Get system statistics
 */
router.get('/stats', getSystemStats);

export default router;
