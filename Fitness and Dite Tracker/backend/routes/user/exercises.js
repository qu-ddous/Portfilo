const express = require('express');
const supabase = require('../../config/supabase');
const { authMiddleware } = require('../../middleware/auth');
const router = express.Router();

/**
 * GET /api/user/exercises
 * Fetch all available exercises with descriptions and images/videos
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { category, equipment, search } = req.query;
    
    let query = supabase.from('exercises').select('*');

    if (category) query = query.eq('target_muscle_group', category);
    if (equipment) query = query.eq('equipment_required', equipment);
    if (search) query = query.ilike('name', `%${search}%`);

    const { data, error } = await query.order('name');

    if (error) throw error;
    return res.json({ success: true, exercises: data || [] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
