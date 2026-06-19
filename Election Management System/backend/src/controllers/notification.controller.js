// src/controllers/notification.controller.js
import { supabaseAdmin } from '../services/supabase.service.js';

/**
 * Get user notifications
 */
export const getNotifications = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { limit = 50, offset = 0, unread_only = false } = req.query;

    let query = supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('user_id', user_id);

    if (unread_only === 'true' || unread_only === true) {
      query = query.eq('read', false);
    }

    const { data: notifications, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch notifications' });
    }

    res.json({
      success: true,
      data: notifications
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

/**
 * Mark notification as read
 */
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const user_id = req.user.id;

    const { data: notification, error: notifError } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('id', notificationId)
      .eq('user_id', user_id)
      .single();

    if (notifError || !notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    const { error: updateError } = await supabaseAdmin
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId);

    if (updateError) {
      return res.status(500).json({ error: 'Failed to update notification' });
    }

    res.json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Failed to mark as read' });
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('user_id', user_id)
      .eq('read', false);

    if (error) {
      return res.status(500).json({ error: 'Failed to update notifications' });
    }

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });

  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const user_id = req.user.id;

    const { error } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', user_id);

    if (error) {
      return res.status(500).json({ error: 'Failed to delete notification' });
    }

    res.json({
      success: true,
      message: 'Notification deleted'
    });

  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

/**
 * Get unread count
 */
export const getUnreadCount = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { data: notifications, error } = await supabaseAdmin
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user_id)
      .eq('read', false);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch unread count' });
    }

    res.json({
      success: true,
      data: {
        unread_count: notifications?.length || 0
      }
    });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
};
