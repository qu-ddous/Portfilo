const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authMiddleware, checkRole } = require('../middleware/auth');

// @route   GET /api/users/profile
// @desc    Get current user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   PUT /api/users/profile
// @desc    Update current user profile (Name, Email, Phone, Avatar)
router.put('/profile', authMiddleware, async (req, res) => {
  const { name, email, phone, avatar_url } = req.body;
  try {
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (phone) updates.phone = phone;
    if (avatar_url) updates.avatar_url = avatar_url;

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data, message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   GET /api/users/staff
// @desc    Get all staff (Admin only)
router.get('/staff', authMiddleware, checkRole(['admin']), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'staff');

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   POST /api/users/staff
// @desc    Add new staff member (Admin only)
router.post('/staff', authMiddleware, checkRole(['admin']), async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    const { data: user, error } = await supabase
      .from('users')
      .insert([{ 
        name, 
        email, 
        role: 'staff', 
        phone: phone || '00000000000',
        created_at: new Date()
      }])
      .select();

    if (error) throw error;
    res.status(201).json({ success: true, data: user[0], message: 'Staff added successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete a user (Admin only)
router.delete('/:id', authMiddleware, checkRole(['admin']), async (req, res) => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
