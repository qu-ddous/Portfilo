const express = require('express');
const supabase = require('../../config/supabase');
const { authMiddleware } = require('../../middleware/auth');
const { updateProfileSchema } = require('../../validators/schemas');
const { calculateDailyCalories } = require('../../utils/calorieCalculator');

const router = express.Router();

// ─── GET /api/user/dashboard ──────────────────────────────────
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.sub;
    const today = new Date().toISOString().split('T')[0];

    // Fetch user info
    const { data: user } = await supabase
      .from('users')
      .select('name, current_weight_kg, target_weight_kg, daily_calorie_target, fitness_goal')
      .eq('id', userId)
      .single();

    // Today's meal calories
    const { data: mealsToday } = await supabase
      .from('user_meals')
      .select('meal_id, quantity_served, meals(meal_nutrition(calories))')
      .eq('user_id', userId)
      .gte('logged_date', `${today}T00:00:00`)
      .lte('logged_date', `${today}T23:59:59`);

    let calories_consumed = 0;
    if (mealsToday) {
      mealsToday.forEach(um => {
        const cal = um.meals?.meal_nutrition?.[0]?.calories || 0;
        calories_consumed += cal * (um.quantity_served || 1);
      });
    }

    // Today's workouts
    const { count: workouts_logged } = await supabase
      .from('user_workouts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('completed_date', `${today}T00:00:00`);

    const calTarget = user?.daily_calorie_target || 2000;

    return res.json({
      success: true,
      dashboard: {
        user: {
          name: user?.name,
          current_weight_kg: user?.current_weight_kg,
          target_weight_kg: user?.target_weight_kg,
          fitness_goal: user?.fitness_goal,
        },
        todaysSummary: {
          date: today,
          calories_consumed: Math.round(calories_consumed),
          daily_calorie_target: calTarget,
          calories_remaining: Math.max(0, calTarget - Math.round(calories_consumed)),
          percentage_complete: Math.min(100, Math.round((calories_consumed / calTarget) * 100)),
          workouts_logged: workouts_logged || 0,
          meals_logged: mealsToday?.length || 0,
        },
      },
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/user/profile ────────────────────────────────────
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, age, gender, height_cm, current_weight_kg, target_weight_kg, activity_level, fitness_goal, daily_calorie_target, signup_date')
      .eq('id', req.user.sub)
      .single();

    if (error) throw error;
    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/user/profile ────────────────────────────────────
router.put('/profile', authMiddleware, async (req, res) => {
  const { error, value } = updateProfileSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  try {
    // If weight/goal/activity changes → recalculate calories
    if (value.current_weight_kg || value.fitness_goal || value.activity_level) {
      const { data: current } = await supabase
        .from('users')
        .select('gender, age, height_cm, current_weight_kg, activity_level, fitness_goal')
        .eq('id', req.user.sub)
        .single();

      const merged = { ...current, ...value };
      value.daily_calorie_target = calculateDailyCalories(merged);
    }

    await supabase.from('users').update(value).eq('id', req.user.sub);

    return res.json({
      success: true,
      message: 'Profile updated',
      daily_calorie_target: value.daily_calorie_target,
    });
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/user/stats ──────────────────────────────────────
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.sub;

    const { data: user } = await supabase
      .from('users')
      .select('current_weight_kg, target_weight_kg, daily_calorie_target')
      .eq('id', userId)
      .single();

    const { count: totalWorkouts } = await supabase
      .from('user_workouts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    const { data: weightLogs } = await supabase
      .from('weight_logs')
      .select('weight_kg')
      .eq('user_id', userId)
      .order('logged_date', { ascending: false })
      .limit(2);

    const weightTrend = weightLogs?.length >= 2
      ? +(weightLogs[0].weight_kg - weightLogs[1].weight_kg).toFixed(2)
      : 0;

    return res.json({
      success: true,
      stats: {
        weight: {
          current: user?.current_weight_kg,
          target: user?.target_weight_kg,
          trend: weightTrend,
        },
        calories: { target: user?.daily_calorie_target },
        workouts: { total_completed: totalWorkouts || 0 },
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/user/progress ───────────────────────────────────
router.get('/progress', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.sub;
    const days = parseInt(req.query.days) || 30;
    const from = new Date(Date.now() - days * 86400000).toISOString();

    const { data: weight_logs } = await supabase
      .from('weight_logs')
      .select('logged_date, weight_kg')
      .eq('user_id', userId)
      .gte('logged_date', from)
      .order('logged_date', { ascending: true });

    const { data: workout_logs } = await supabase
      .from('user_workouts')
      .select('completed_date, duration_minutes, workouts(name)')
      .eq('user_id', userId)
      .gte('completed_date', from)
      .order('completed_date', { ascending: false });

    return res.json({
      success: true,
      progress: {
        weight_logs: weight_logs || [],
        workout_logs: (workout_logs || []).map(w => ({
          date: w.completed_date,
          workout: w.workouts?.name,
          duration: w.duration_minutes,
        })),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
