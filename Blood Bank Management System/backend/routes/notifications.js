const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authMiddleware, checkRole } = require('../middleware/auth');

// @route   GET /api/notifications
// @desc    Get current user notifications
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    res.json({
      success: true,
      data: data
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message,
      statusCode: 500
    });
  }
});

// @route   PATCH /api/notifications/:id/read
// @desc    Mark notification as read
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select();

    if (error) throw error;
    
    res.json({
      success: true,
      data: data[0],
      message: 'Notification marked as read'
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message,
      statusCode: 500
    });
  }
});

// @route   PATCH /api/notifications/read-all
// @desc    Mark all unread notifications for a user as read
router.patch('/read-all', authMiddleware, async (req, res) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', req.user.id)
      .eq('is_read', false);

    if (error) throw error;

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message,
      statusCode: 500
    });
  }
});

// @route   POST /api/notifications
// @desc    Send notification (Admin only)
router.post('/', authMiddleware, checkRole(['admin']), async (req, res) => {
  const { user_id, title, message, type } = req.body;
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([{ 
        user_id, 
        title, 
        message, 
        type: type || 'info', 
        is_read: false 
      }])
      .select();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: data[0],
      message: 'Notification sent'
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message,
      statusCode: 500
    });
  }
});

// @route   POST /api/notifications/broadcast
// @desc    Send notification to all donors (Admin/Emergency)
router.post('/broadcast', authMiddleware, checkRole(['admin']), async (req, res) => {
  const { message, type } = req.body;
  try {
    // 1. Get all donor user IDs
    const { data: donors, error: donorError } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'donor');

    if (donorError) throw donorError;

    if (!donors || donors.length === 0) {
      return res.json({ success: true, message: 'No donors found to notify.' });
    }

    // 2. Prepare notifications for all donors
    const alerts = donors.map(d => ({
      user_id: d.id,
      title: 'Emergency: Blood Shortage',
      message: message || 'Critical inventory shortage. Please visit for donation.',
      type: type || 'emergency',
      is_read: false
    }));

    const { error: insertError } = await supabase
      .from('notifications')
      .insert(alerts);

    if (insertError) throw insertError;

    res.json({
      success: true,
      message: `Broadcast alert sent to ${donors.length} donors!`
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

module.exports = router;
