const express = require('express');
const supabase = require('../../config/supabase');
const { authMiddleware } = require('../../middleware/auth');

const router = express.Router();

// ─── GET /api/user/notifications ──────────────────────────────
router.get('/', authMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const { data, error } = await supabase
      .from('notifications')
      .select('id, title, message, type, is_read, created_at')
      .eq('user_id', req.user.sub)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    const unread_count = (data || []).filter(n => !n.is_read).length;

    return res.json({ success: true, notifications: data || [], unread_count });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/user/notifications/:notificationId/read ─────────
router.put('/:notificationId/read', authMiddleware, async (req, res) => {
  try {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', req.params.notificationId)
      .eq('user_id', req.user.sub);

    return res.json({ success: true, message: 'Marked as read' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/user/notifications/read-all ────────────────────
router.post('/read-all', authMiddleware, async (req, res) => {
  try {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', req.user.sub)
      .eq('is_read', false);

    return res.json({ success: true, message: 'All marked as read' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
