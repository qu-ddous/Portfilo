const express = require('express');
const supabase = require('../../config/supabase');
const { adminMiddleware } = require('../../middleware/auth');

const router = express.Router();

/**
 * POST /api/admin/notifications/broadcast
 * Send a notification to all active users
 */
router.post('/broadcast', adminMiddleware, async (req, res) => {
  const { title, message, type = 'system_alert' } = req.body;

  if (!title || !message) {
    return res.status(400).json({ success: false, message: 'Title and message are required' });
  }

  try {
    // 1. Get all active users
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'user')
      .eq('status', 'active');

    if (userError) throw userError;

    if (!users || users.length === 0) {
      return res.json({ success: true, message: 'No active users to notify' });
    }

    // 2. Prepare notifications for DB
    const notifications = users.map(user => ({
      user_id: user.id,
      title,
      message,
      type
    }));

    // 3. Batch insert into DB
    const { error: insertError } = await supabase
      .from('notifications')
      .insert(notifications);

    if (insertError) throw insertError;

    // 4. Emit via Socket.io (Real-time)
    const io = req.app.get('io');
    io.emit('broadcast_notification', { title, message, type });

    // 5. Log action
    await supabase.from('admin_logs').insert({
      admin_id: req.user.sub,
      action: 'BROADCAST_NOTIFICATION',
      changes: { title, type }
    });

    return res.status(200).json({ 
      success: true, 
      message: `Successfully broadcasted to ${users.length} users` 
    });
  } catch (err) {
    console.error('Broadcast error:', err);
    return res.status(500).json({ success: false, message: 'Server error during broadcast' });
  }
});

/**
 * GET /api/admin/notifications
 * Get all notifications (grouped by title/message to see broadcasts)
 */
router.get('/', adminMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json({ success: true, notifications: data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * DELETE /api/admin/notifications/:id
 * Delete a specific notification
 */
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    return res.json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * DELETE /api/admin/notifications/clear-all
 * Delete all notifications
 */
router.delete('/clear-all/confirm', adminMiddleware, async (req, res) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Hack to delete all in supabase

    if (error) throw error;
    return res.json({ success: true, message: 'All notifications cleared' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
