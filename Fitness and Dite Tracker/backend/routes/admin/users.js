const express = require('express');
const supabase = require('../../config/supabase');
const { adminMiddleware } = require('../../middleware/auth');
const { assignMealPlanSchema } = require('../../validators/schemas');

const router = express.Router();

// ─── GET /api/admin/users ─────────────────────────────────────
router.get('/', adminMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    let query = supabase
      .from('users')
      .select('id, name, email, current_weight_kg, target_weight_kg, fitness_goal, status, signup_date, last_login', { count: 'exact' })
      .eq('role', 'user')
      .range(offset, offset + limit - 1)
      .order('signup_date', { ascending: false });

    if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);

    const { data, error, count } = await query;
    if (error) throw error;

    return res.json({
      success: true,
      users: data || [],
      pagination: { page, limit, total: count || 0 },
    });
  } catch (err) {
    console.error('Admin users error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/admin/users/profile/me ────────────────────────────
router.get('/profile/me', adminMiddleware, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, role, phone, avatar, system_settings')
      .eq('id', req.user.sub)
      .single();

    if (error) {
       console.error("Supabase Error GET /profile/me:", error);
       throw error;
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error("Catch Error GET /profile/me:", err);
    res.status(500).json({ success: false, message: 'Server error fetching profile' });
  }
});

// ─── PUT /api/admin/users/profile/me ────────────────────────────
router.put('/profile/me', adminMiddleware, async (req, res) => {
  try {
    const { name, email, phone, avatar, system_settings } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (system_settings) updateData.system_settings = system_settings;

    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', req.user.sub);

    if (error) {
      if (error.code === 'P0001' || error.message.includes('column')) {
         console.warn("DB missing new columns (phone, avatar, system_settings)");
         return res.json({ success: true, message: 'Profile update simulated (DB columns missing)'});
      }
      throw error;
    }

    res.json({ success: true, message: 'Profile updated' });
  } catch (err) {
    console.error("Profile update error: ", err);
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
});

const bcrypt = require('bcryptjs');
// ─── PUT /api/admin/users/password/me ────────────────────────────
router.put('/password/me', adminMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // get user
    const { data: user } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', req.user.sub)
      .single();

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // verify old
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Incorrect current password' });
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    
    await supabase.from('users').update({ password_hash: hash }).eq('id', req.user.sub);
    res.json({ success: true, message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error updating password' });
  }
});

// ─── GET /api/admin/users/:userId ────────────────────────────
router.get('/:userId', adminMiddleware, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, age, gender, height_cm, current_weight_kg, target_weight_kg, fitness_goal, activity_level, daily_calorie_target, signup_date, last_login, status')
      .eq('id', req.params.userId)
      .single();

    if (error || !user) return res.status(404).json({ success: false, message: 'User not found' });

    const { data: assignedWorkouts } = await supabase
      .from('workout_assignments')
      .select('workouts(id, name, difficulty)')
      .eq('user_id', req.params.userId)
      .eq('status', 'active');

    const { data: assignedMealPlans } = await supabase
      .from('meal_plan_assignments')
      .select('meal_plans(id, name)')
      .eq('user_id', req.params.userId)
      .eq('status', 'active');

    const { count: workoutsCompleted } = await supabase
      .from('user_workouts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', req.params.userId);

    return res.json({
      success: true,
      user: {
        ...user,
        assigned_workouts: (assignedWorkouts || []).map(a => a.workouts),
        assigned_meal_plans: (assignedMealPlans || []).map(a => a.meal_plans),
        progress: { workouts_completed: workoutsCompleted || 0 },
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/admin/users/:userId ────────────────────────────
router.put('/:userId', adminMiddleware, async (req, res) => {
  try {
    const allowed = ['name', 'target_weight_kg', 'fitness_goal', 'activity_level', 'status', 'daily_calorie_target'];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));

    await supabase.from('users').update(updates).eq('id', req.params.userId);

    await supabase.from('admin_logs').insert({
      admin_id: req.user.sub, action: 'UPDATE_USER',
      entity_type: 'user', entity_id: req.params.userId, changes: updates,
    });

    return res.json({ success: true, message: 'User updated' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/admin/users/:userId/assign-workout ────────────
router.post('/:userId/assign-workout', adminMiddleware, async (req, res) => {
  try {
    const { workout_id } = req.body;
    if (!workout_id) return res.status(400).json({ success: false, message: 'workout_id required' });

    const io = req.app.get('io');

    await supabase.from('workout_assignments').insert({
      user_id: req.params.userId, workout_id, assigned_by: req.user.sub,
    });

    const { data: workout } = await supabase.from('workouts').select('name').eq('id', workout_id).single();

    await supabase.from('notifications').insert({
      user_id: req.params.userId,
      title: 'New Workout Assigned! 💪',
      message: `You have been assigned: ${workout?.name}`,
      type: 'workout_assigned',
    });

    if (io) {
      io.to(`user:${req.params.userId}`).emit('workout:assigned', {
        workout_id, workout_name: workout?.name, assigned_date: new Date(),
      });
    }

    return res.status(201).json({ success: true, message: 'Workout assigned' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/admin/users/:userId/assign-meal-plan ──────────
router.post('/:userId/assign-meal-plan', adminMiddleware, async (req, res) => {
  const { error: valErr, value } = assignMealPlanSchema.validate(req.body);
  if (valErr) return res.status(400).json({ success: false, message: valErr.details[0].message });

  try {
    const io = req.app.get('io');

    await supabase.from('meal_plan_assignments').insert({
      user_id: req.params.userId, meal_plan_id: value.meal_plan_id, assigned_by: req.user.sub,
    });

    const { data: plan } = await supabase.from('meal_plans').select('name').eq('id', value.meal_plan_id).single();

    await supabase.from('notifications').insert({
      user_id: req.params.userId,
      title: 'New Meal Plan Assigned! 🥗',
      message: `You have been assigned a new meal plan: ${plan?.name}`,
      type: 'meal_plan_assigned',
    });

    if (io) {
      io.to(`user:${req.params.userId}`).emit('meal_plan:assigned', {
        meal_plan_id: value.meal_plan_id, plan_name: plan?.name, assigned_date: new Date(),
      });
    }

    return res.status(201).json({ success: true, message: 'Meal plan assigned' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── DELETE /api/admin/users/:userId ──────────────────────────
router.delete('/:userId', adminMiddleware, async (req, res) => {
  try {
    await supabase.from('users').update({ status: 'suspended' }).eq('id', req.params.userId);

    await supabase.from('admin_logs').insert({
      admin_id: req.user.sub, action: 'SUSPEND_USER',
      entity_type: 'user', entity_id: req.params.userId,
    });

    return res.json({ success: true, message: 'User suspended' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
