const express = require('express');
const supabase = require('../../config/supabase');
const { authMiddleware } = require('../../middleware/auth');
const { logWeightSchema, logMeasurementsSchema } = require('../../validators/schemas');
const { syncUserCalories } = require('../../services/nutritionService');

const router = express.Router();

// ─── POST /api/user/weight/log ────────────────────────────────
router.post('/log', authMiddleware, async (req, res) => {
  const { error: valErr, value } = logWeightSchema.validate(req.body);
  if (valErr) return res.status(400).json({ success: false, message: valErr.details[0].message });

  try {
    const userId = req.user.sub;
    const io = req.app.get('io');

    const { data: weightLog, error } = await supabase
      .from('weight_logs')
      .insert({ user_id: userId, weight_kg: value.weight_kg, logged_date: value.logged_date, notes: value.notes })
      .select('id, weight_kg, logged_date')
      .single();

    if (error) throw error;

    // Update current weight in users table
    await supabase.from('users').update({ current_weight_kg: value.weight_kg }).eq('id', userId);

    // Trigger Smart Recalculation
    await syncUserCalories(userId);

    const { data: user } = await supabase.from('users').select('target_weight_kg').eq('id', userId).single();
    const weight_remaining = user ? Math.abs(value.weight_kg - user.target_weight_kg).toFixed(1) : null;

    // Notify admin
    if (io) {
      const { data: u } = await supabase.from('users').select('name').eq('id', userId).single();
      io.to('admin-room').emit('admin:weight-logged', {
        user_id: userId, user_name: u?.name, weight_kg: value.weight_kg, timestamp: new Date(),
      });
    }

    return res.status(201).json({
      success: true,
      weight_log: { ...weightLog, weight_remaining: parseFloat(weight_remaining) },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/user/weight/history ────────────────────────────
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const from = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('weight_logs')
      .select('id, weight_kg, logged_date, notes')
      .eq('user_id', req.user.sub)
      .gte('logged_date', from)
      .order('logged_date', { ascending: true });

    if (error) throw error;

    const weights = data || [];
    const stats = weights.length >= 2
      ? {
          starting_weight: weights[0].weight_kg,
          current_weight: weights[weights.length - 1].weight_kg,
          weight_loss: +(weights[0].weight_kg - weights[weights.length - 1].weight_kg).toFixed(2),
          average_weekly_loss: +((weights[0].weight_kg - weights[weights.length - 1].weight_kg) / (days / 7)).toFixed(2),
        }
      : {};

    return res.json({ success: true, weight_history: weights, statistics: stats });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/user/weight/log/:logId ──────────────────────────
router.put('/log/:logId', authMiddleware, async (req, res) => {
  try {
    const { weight_kg, notes } = req.body;
    await supabase
      .from('weight_logs')
      .update({ weight_kg, notes })
      .eq('id', req.params.logId)
      .eq('user_id', req.user.sub);
    return res.json({ success: true, message: 'Weight log updated' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── DELETE /api/user/weight/log/:logId ───────────────────────
router.delete('/log/:logId', authMiddleware, async (req, res) => {
  try {
    await supabase
      .from('weight_logs')
      .delete()
      .eq('id', req.params.logId)
      .eq('user_id', req.user.sub);
    return res.json({ success: true, message: 'Weight log deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/user/measurements/log ─────────────────────────
router.post('/measurements/log', authMiddleware, async (req, res) => {
  const { error: valErr, value } = logMeasurementsSchema.validate(req.body);
  if (valErr) return res.status(400).json({ success: false, message: valErr.details[0].message });

  try {
    const { data, error } = await supabase
      .from('body_measurements')
      .insert({ user_id: req.user.sub, ...value })
      .select('id, measured_date')
      .single();

    if (error) throw error;
    return res.status(201).json({ success: true, measurement: data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/user/measurements/history ──────────────────────
router.get('/measurements/history', authMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const { data, error } = await supabase
      .from('body_measurements')
      .select('*')
      .eq('user_id', req.user.sub)
      .order('measured_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return res.json({ success: true, measurements: data || [] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
