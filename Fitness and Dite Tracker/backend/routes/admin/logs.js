const express = require('express');
const supabase = require('../../config/supabase');
const { adminMiddleware } = require('../../middleware/auth');

const router = express.Router();

// ─── GET /api/admin/system/logs ──────────────────────────────
router.get('/', adminMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const { data, error } = await supabase
      .from('admin_logs')
      .select('*, users!admin_id(name, email)') // Join with user table to get admin info
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return res.json({ success: true, logs: data || [] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
