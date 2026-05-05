const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const { registerSchema, loginSchema, changePasswordSchema } = require('../validators/schemas');
const { authMiddleware } = require('../middleware/auth');
const { calculateDailyCalories } = require('../utils/calorieCalculator');

const router = express.Router();

// ─── Helper: generate tokens ──────────────────────────────────
const generateTokens = async (user) => {
  const accessToken = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1d' });
  const refreshToken = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  // Store/Update refresh token in DB for rotation security
  await supabase.from('auth_refresh_tokens').upsert({
    user_id: user.id,
    token: refreshToken,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  }, { onConflict: 'user_id' });

  return { accessToken, refreshToken };
};

// ─── POST /api/auth/register ──────────────────────────────────
router.post('/register', async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  try {
    const { data: existing } = await supabase.from('users').select('id').eq('email', value.email).single();
    if (existing) return res.status(409).json({ success: false, message: 'Email already registered' });

    const password_hash = await bcrypt.hash(value.password, 12);

    const daily_calorie_target = calculateDailyCalories({
      gender: value.gender,
      age: value.age,
      height_cm: value.height_cm,
      current_weight_kg: value.current_weight_kg,
      activity_level: value.activity_level,
      fitness_goal: value.fitness_goal,
    });

    const { data: user, error: dbError } = await supabase.from('users').insert({
      name: value.name,
      email: value.email,
      password_hash,
      age: value.age,
      gender: value.gender,
      height_cm: value.height_cm,
      current_weight_kg: value.current_weight_kg,
      target_weight_kg: value.target_weight_kg,
      activity_level: value.activity_level || 'moderately_active',
      fitness_goal: value.fitness_goal || 'maintenance',
      daily_calorie_target,
    }).select('id, email, name, role, daily_calorie_target').single();

    if (dbError) throw dbError;

    return res.status(201).json({
      success: true,
      message: 'Account created',
      user: { id: user.id, email: user.email, name: user.name, daily_calorie_target: user.daily_calorie_target },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────
router.post('/login', async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  try {
    const { data: user, error: dbError } = await supabase
      .from('users')
      .select('id, email, name, role, password_hash, status, daily_calorie_target, avatar, age, gender, height_cm, current_weight_kg, target_weight_kg, activity_level, fitness_goal')
      .eq('email', value.email)
      .single();

    if (dbError || !user) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    if (user.status === 'suspended') return res.status(403).json({ success: false, message: 'Account suspended' });

    const valid = await bcrypt.compare(value.password, user.password_hash);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    await supabase.from('users').update({ last_login: new Date().toISOString() }).eq('id', user.id);

    const { accessToken, refreshToken } = await generateTokens(user);

    return res.status(200).json({
      success: true,
      tokens: { accessToken, refreshToken },
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        age: user.age,
        gender: user.gender,
        height_cm: user.height_cm,
        current_weight_kg: user.current_weight_kg,
        target_weight_kg: user.target_weight_kg,
        activity_level: user.activity_level,
        fitness_goal: user.fitness_goal,
        daily_calorie_target: user.daily_calorie_target,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/auth/refresh ───────────────────────────────────
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ success: false, message: 'Refresh token required' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Verify against DB (Rotation check)
    const { data: storedToken, error } = await supabase
      .from('auth_refresh_tokens')
      .select('*')
      .eq('user_id', decoded.sub)
      .eq('token', refreshToken)
      .single();

    if (error || !storedToken) {
      return res.status(403).json({ success: false, message: 'Invalid or rotated refresh token' });
    }

    // Generate new pair
    const accessToken = jwt.sign({ sub: decoded.sub, role: decoded.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1d' });
    const newRefreshToken = jwt.sign({ sub: decoded.sub, role: decoded.role }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Rotate token in DB
    await supabase.from('auth_refresh_tokens').update({
      token: newRefreshToken,
      updated_at: new Date().toISOString()
    }).eq('user_id', decoded.sub);

    return res.json({
      success: true,
      tokens: { accessToken, refreshToken: newRefreshToken }
    });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
});

// ─── POST /api/auth/logout ────────────────────────────────────
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    await supabase.from('auth_refresh_tokens').delete().eq('user_id', req.user.sub);
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/auth/change-password ──────────────────────────
router.post('/change-password', authMiddleware, async (req, res) => {
  const { error, value } = changePasswordSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  try {
    const { data: user } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', req.user.sub)
      .single();

    const valid = await bcrypt.compare(value.current_password, user.password_hash);
    if (!valid) return res.status(401).json({ success: false, message: 'Current password is incorrect' });

    const newHash = await bcrypt.hash(value.new_password, 12);
    await supabase.from('users').update({ password_hash: newHash }).eq('id', req.user.sub);

    return res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/auth/profile ────────────────────────────────────
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { age, gender, height_cm, current_weight_kg, target_weight_kg, activity_level, fitness_goal, avatar } = req.body;
    
    // Recalculate daily calorie target
    const daily_calorie_target = calculateDailyCalories({
      gender: gender,
      age: age,
      height_cm: height_cm,
      current_weight_kg: current_weight_kg,
      activity_level: activity_level,
      fitness_goal: fitness_goal,
    });

    // Build update object — only include avatar if provided
    const updateData = {
      age, gender, height_cm, current_weight_kg, target_weight_kg,
      activity_level, fitness_goal, daily_calorie_target,
      updated_at: new Date().toISOString(),
    };
    if (avatar !== undefined) updateData.avatar = avatar;

    const { data: user, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', req.user.sub)
      .select('id, email, name, role, avatar, age, gender, height_cm, current_weight_kg, target_weight_kg, activity_level, fitness_goal, daily_calorie_target')
      .single();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * GET /api/auth/me
 * Get current user profile (used for auto-login on app restart)
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, role, avatar, age, gender, height_cm, current_weight_kg, target_weight_kg, activity_level, fitness_goal, daily_calorie_target')
      .eq('id', req.user.sub)
      .single();

    if (error || !user) return res.status(404).json({ success: false, message: 'User not found' });

    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * GET /api/auth/admin-info
 * Get public info of the admin for support chat
 */
router.get('/admin-info', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, avatar')
      .eq('role', 'admin')
      .limit(1)
      .single();

    if (error) throw error;
    res.json({ success: true, admin: data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
