const express = require('express');
const supabase = require('../../config/supabase');
const { authMiddleware } = require('../../middleware/auth');
const router = express.Router();

/**
 * GET /api/user/water/today
 */
router.get('/today', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.sub;
    const today = new Date().toISOString().split('T')[0];

    const { data: logs, error } = await supabase
      .from('water_logs')
      .select('amount_ml')
      .eq('user_id', userId)
      .eq('logged_date', today);

    if (error) {
      console.error('Water today error:', error);
      throw error;
    }

    const total = logs.reduce((sum, log) => sum + log.amount_ml, 0);
    const { data: user } = await supabase.from('users').select('water_goal_ml').eq('id', userId).single();

    return res.json({ 
      success: true, 
      total_ml: total, 
      goal_ml: user?.water_goal_ml || 2500 
    });
  } catch (err) {
    console.error('Water today error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

/**
 * POST /api/user/water/log
 */
router.post('/log', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.sub;
    const { amount_ml } = req.body;

    if (!amount_ml) return res.status(400).json({ success: false, message: 'Amount required' });

    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('water_logs')
      .insert({ user_id: userId, amount_ml, logged_date: today })
      .select('*')
      .single();

    if (error) {
      console.error('Water log error:', error);
      throw error;
    }

    return res.status(201).json({ success: true, log: data });
  } catch (err) {
    console.error('Water log error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

module.exports = router;
