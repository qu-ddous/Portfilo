// src/routes/notification.routes.js
import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
} from '../controllers/notification.controller.js';

const router = express.Router();

// All notification routes require authentication
router.use(authenticate);

/**
 * GET /api/notifications
 * Get user notifications
 */
router.get('/', getNotifications);

/**
 * GET /api/notifications/unread-count
 * Get count of unread notifications
 */
router.get('/unread-count', getUnreadCount);

/**
 * PATCH /api/notifications/:notificationId/read
 * Mark notification as read
 */
router.patch('/:notificationId/read', markAsRead);

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications as read
 */
router.patch('/read-all', markAllAsRead);

/**
 * DELETE /api/notifications/:notificationId
 * Delete notification
 */
router.delete('/:notificationId', deleteNotification);

export default router;
