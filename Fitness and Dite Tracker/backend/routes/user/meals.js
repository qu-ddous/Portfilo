const express = require('express');
const supabase = require('../../config/supabase');
const { authMiddleware } = require('../../middleware/auth');
const { logMealSchema } = require('../../validators/schemas');

const router = express.Router();

// ─── GET /api/user/meal-plans/assigned ────────────────────────
router.get('/plans/assigned', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('meal_plan_assignments')
      .select(`
        id, assigned_date, status,
        meal_plans (
          id, name, description,
          meal_plan_items (
            meal_slot, sequence_order,
            meals (
              id, name, meal_type, image_url,
              meal_nutrition ( calories, protein_grams, carbs_grams, fats_grams )
            )
          )
        )
      `)
      .eq('user_id', req.user.sub)
      .eq('status', 'active');

    if (error) throw error;
    return res.json({ success: true, meal_plans: data || [] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/user/meals/today ────────────────────────────────
router.get('/today', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.sub;
    const today = new Date().toISOString().split('T')[0];

    const { data: logsToday } = await supabase
      .from('user_meals')
      .select('id, quantity_served, logged_date, notes, meals(id, name, meal_type, image_url, meal_nutrition(calories, protein_grams, carbs_grams, fats_grams))')
      .eq('user_id', userId)
      .gte('logged_date', `${today}T00:00:00`)
      .lte('logged_date', `${today}T23:59:59`);

    const { data: user } = await supabase
      .from('users')
      .select('daily_calorie_target')
      .eq('id', userId)
      .single();

    let totals = { calories: 0, protein_grams: 0, carbs_grams: 0, fats_grams: 0 };
    (logsToday || []).forEach(log => {
      const n = log.meals?.meal_nutrition?.[0];
      const qty = log.quantity_served || 1;
      if (n) {
        totals.calories += (n.calories || 0) * qty;
        totals.protein_grams += (n.protein_grams || 0) * qty;
        totals.carbs_grams += (n.carbs_grams || 0) * qty;
        totals.fats_grams += (n.fats_grams || 0) * qty;
      }
    });

    const target_cal = user?.daily_calorie_target || 2000;

    // Fetch water
    const { data: waterLogs } = await supabase
      .from('water_logs')
      .select('amount_ml')
      .eq('user_id', userId)
      .eq('logged_date', today);
      
    const { data: userWater } = await supabase.from('users').select('water_goal_ml').eq('id', userId).single();
    const water_total = (waterLogs || []).reduce((sum, log) => sum + log.amount_ml, 0);

    return res.json({
      success: true,
      date: today,
      meals_logged: logsToday || [],
      daily_totals: {
        calories: Math.round(totals.calories),
        protein_grams: Math.round(totals.protein_grams),
        carbs_grams: Math.round(totals.carbs_grams),
        fats_grams: Math.round(totals.fats_grams),
      },
      daily_targets: { calories: target_cal, protein_grams: Math.round(target_cal * 0.3 / 4) },
      remaining: { calories: Math.max(0, target_cal - Math.round(totals.calories)) },
      water_logs: {
        total_ml: water_total,
        goal_ml: userWater?.water_goal_ml || 2500
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/user/meals/log ─────────────────────────────────
router.post('/log', authMiddleware, async (req, res) => {
  const { error: valErr, value } = logMealSchema.validate(req.body);
  if (valErr) return res.status(400).json({ success: false, message: valErr.details[0].message });

  try {
    const io = req.app.get('io');
    const { data: mealLog, error } = await supabase
      .from('user_meals')
      .insert({
        user_id: req.user.sub,
        meal_id: value.meal_id,
        quantity_served: value.quantity_served || 1,
        logged_date: value.logged_date ? new Date(value.logged_date).toISOString() : new Date().toISOString(),
        notes: value.notes,
      })
      .select('id, logged_date, meals(name, meal_nutrition(calories))')
      .single();

    if (error) throw error;

    // Real-time: notify admin
    if (io) {
      const { data: user } = await supabase.from('users').select('name').eq('id', req.user.sub).single();
      io.to('admin-room').emit('admin:meal-logged', {
        user_id: req.user.sub,
        user_name: user?.name,
        meal_name: mealLog.meals?.name,
        calories: mealLog.meals?.meal_nutrition?.[0]?.calories,
        timestamp: new Date(),
      });
    }

    return res.status(201).json({ success: true, meal_log: mealLog });
  } catch (err) {
    console.error('Log meal error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/user/meals/history ──────────────────────────────
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const from = new Date(Date.now() - days * 86400000).toISOString();

    const { data, error } = await supabase
      .from('user_meals')
      .select('id, logged_date, quantity_served, meals(name, meal_type, meal_nutrition(calories))')
      .eq('user_id', req.user.sub)
      .gte('logged_date', from)
      .order('logged_date', { ascending: false });

    if (error) throw error;
    return res.json({ success: true, meals: data || [] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/user/meals/available ───────────────────────────
router.get('/available', authMiddleware, async (req, res) => {
  try {
    let query = supabase
      .from('meals')
      .select('id, name, meal_type, description, image_url, meal_nutrition(calories, protein_grams, carbs_grams, fats_grams)')
      .eq('status', 'active');

    if (req.query.meal_type) query = query.eq('meal_type', req.query.meal_type);

    const { data, error } = await query;
    if (error) throw error;
    return res.json({ success: true, meals: data || [] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/user/nutrition/daily ───────────────────────────
router.get('/nutrition/daily', authMiddleware, async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const userId = req.user.sub;

    const { data: logs } = await supabase
      .from('user_meals')
      .select('quantity_served, meals(meal_nutrition(calories, protein_grams, carbs_grams, fats_grams, fiber_grams))')
      .eq('user_id', userId)
      .gte('logged_date', `${date}T00:00:00`)
      .lte('logged_date', `${date}T23:59:59`);

    let nutrition = { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 };
    (logs || []).forEach(log => {
      const n = log.meals?.meal_nutrition?.[0];
      const qty = log.quantity_served || 1;
      if (n) {
        nutrition.calories += (n.calories || 0) * qty;
        nutrition.protein += (n.protein_grams || 0) * qty;
        nutrition.carbs += (n.carbs_grams || 0) * qty;
        nutrition.fats += (n.fats_grams || 0) * qty;
        nutrition.fiber += (n.fiber_grams || 0) * qty;
      }
    });

    Object.keys(nutrition).forEach(k => { nutrition[k] = Math.round(nutrition[k]); });

    const { data: user } = await supabase
      .from('users').select('daily_calorie_target').eq('id', userId).single();

    return res.json({
      success: true,
      nutrition: {
        date,
        ...nutrition,
        targets: { calories: user?.daily_calorie_target || 2000, protein: 150 },
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/user/meals/log/:logId ──────────────────────────
router.put('/log/:logId', authMiddleware, async (req, res) => {
  try {
    const { quantity_served, notes } = req.body;
    await supabase
      .from('user_meals')
      .update({ quantity_served, notes })
      .eq('id', req.params.logId)
      .eq('user_id', req.user.sub);
    return res.json({ success: true, message: 'Meal log updated' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── DELETE /api/user/meals/log/:logId ───────────────────────
router.delete('/log/:logId', authMiddleware, async (req, res) => {
  try {
    await supabase
      .from('user_meals')
      .delete()
      .eq('id', req.params.logId)
      .eq('user_id', req.user.sub);
    return res.json({ success: true, message: 'Meal log deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/user/meals/log-custom ──────────────────────────
router.post('/log-custom', authMiddleware, async (req, res) => {
  const { logCustomMealSchema } = require('../../validators/schemas');
  const { error: valErr, value } = logCustomMealSchema.validate(req.body);
  if (valErr) return res.status(400).json({ success: false, message: valErr.details[0].message });

  try {
    // 1. Create a "hidden" meal entry for this custom item
    // Note: We might want a 'user_id' column in 'meals' to identify user-created items
    const { data: meal, error: mealErr } = await supabase
      .from('meals')
      .insert({
        name: value.name,
        meal_type: value.meal_type.toLowerCase(),
        image_url: value.image_url,
        status: 'active', // Should ideally be 'custom' or tied to user
        description: 'Auto-created from external search'
      })
      .select()
      .single();

    if (mealErr) throw mealErr;

    // 2. Create nutrition entry for this meal
    const qty = Math.max(1, value.quantity_served || 100);
    const { error: nutErr } = await supabase
      .from('meal_nutrition')
      .insert({
        meal_id: meal.id,
        calories: (value.calories || 0) / (qty / 100),
        protein_grams: (value.protein || 0) / (qty / 100),
        carbs_grams: (value.carbs || 0) / (qty / 100),
        fats_grams: (value.fats || 0) / (qty / 100),
        serving_size_grams: 100
      });

    if (nutErr) throw nutErr;

    // 3. Log it for the user
    const { data: log, error: logErr } = await supabase
      .from('user_meals')
      .insert({
        user_id: req.user.sub,
        meal_id: meal.id,
        quantity_served: qty / 100, 
        logged_date: new Date().toISOString(),
        notes: 'Logged from Vitafit Search'
      })
      .select();

    if (logErr) throw logErr;

    return res.status(201).json({ success: true, log: log[0] });
  } catch (err) {
    console.error('Log custom error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
