const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_bloodlink_token_key_123!';

// @route   POST /api/auth/register
// @desc    Register a new donor or patient
router.post('/register', async (req, res) => {
  const { name, email, password, role, ...extra } = req.body;
  try {
    // 1. Create User (Simplified simulation without Supabase Auth for this exercise)
    // Note: In real life, we'd use supabase.auth.signUp
    const { data: user, error: userErr } = await supabase
      .from('users')
      .insert([{ name, email, role, phone: extra.phone || '00000000000' }])
      .select();

    if (userErr) throw userErr;

    const userId = user[0].id;

    // 2. Create Role-Specific Entry
    if (role === 'donor') {
      const { error } = await supabase
        .from('donors')
        .insert([{ user_id: userId, blood_type: extra.blood_type, age: extra.age, weight: extra.weight }]);
      if (error) throw error;
    } else if (role === 'patient') {
      const { error } = await supabase
        .from('patients')
        .insert([{ user_id: userId, blood_type: extra.blood_type, medical_condition: extra.medical_condition || 'N/A' }]);
      if (error) throw error;
    }

    // 3. Generate Token
    const token = jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: user[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: data.id, role: data.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: data
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
