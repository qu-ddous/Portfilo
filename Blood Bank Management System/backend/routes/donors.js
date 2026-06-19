const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authMiddleware, checkRole } = require('../middleware/auth');

// @route   GET /api/donors/me
// @desc    Get current logged-in donor profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    res.json({
      success: true,
      data: data || null
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   GET /api/donors
// @desc    Get all donors (Admin/Staff only)
router.get('/', authMiddleware, checkRole(['admin', 'staff']), async (req, res) => {
  try {
    // Join with users table to get name, email, phone
    const { data, error } = await supabase
      .from('donors')
      .select(`
        *,
        user:users (
          name,
          email,
          phone
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Flatten the data for easier frontend consumption
    const flattenedData = data.map(donor => ({
      ...donor,
      name: donor.user?.name,
      email: donor.user?.email,
      phone: donor.user?.phone
    }));

    res.json({
      success: true,
      data: flattenedData
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message,
      statusCode: 500
    });
  }
});

// @route   POST /api/donors
// @desc    Register a new donor
router.post('/', authMiddleware, checkRole(['admin', 'staff']), async (req, res) => {
  const { name, email, phone, blood_type, age, weight } = req.body;

  // Validation
  if (!name || !email || !phone || !blood_type || !age || !weight) {
    return res.status(400).json({ 
      success: false, 
      error: 'All fields are required (name, email, phone, blood_type, age, weight)', 
      statusCode: 400 
    });
  }

  const ageNum = parseInt(age);
  const weightNum = parseInt(weight);

  if (ageNum < 18) {
    return res.status(400).json({ 
      success: false, 
      error: 'Donor must be at least 18 years old', 
      statusCode: 400 
    });
  }

  if (weightNum < 50) {
    return res.status(400).json({ 
      success: false, 
      error: 'Donor must weigh at least 50 kg', 
      statusCode: 400 
    });
  }

  try {
    // 1. Check if user exists
    let { data: user, error: userFetchError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    let userId;

    if (userFetchError && userFetchError.code === 'PGRST116') {
      // User not found, create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{ name, email, phone, role: 'donor' }])
        .select()
        .single();

      if (createError) throw createError;
      userId = newUser.id;
    } else if (userFetchError) {
      throw userFetchError;
    } else {
      userId = user.id;
    }

    // 2. Check if donor record already exists
    const { data: existingDonor, error: donorFetchError } = await supabase
      .from('donors')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existingDonor) {
      return res.status(400).json({ 
        success: false, 
        error: 'A donor record already exists for this user', 
        statusCode: 400 
      });
    }

    // 3. Create donor record
    const { data: donor, error: donorCreateError } = await supabase
      .from('donors')
      .insert([{ 
        user_id: userId, 
        blood_type, 
        age: ageNum, 
        weight: weightNum,
        is_eligible: true 
      }])
      .select()
      .single();

    if (donorCreateError) throw donorCreateError;
    
    // Create Notification
    await supabase.from('notifications').insert([{
      user_id: userId,
      title: 'Donor Registered',
      message: 'Your donor profile has been successfully created. Welcome to the life-saving community!',
      type: 'info'
    }]);

    res.status(201).json({
      success: true,
      data: donor,
      message: 'Donor registered successfully'
    });

  } catch (err) {
    console.error('Error registering donor:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Internal server error', 
      statusCode: 500 
    });
  }
});

// @route   GET /api/donors/:id
// @desc    Get donor by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('donors')
      .select(`
        *,
        user:users (
          name,
          email,
          phone
        )
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    const flattenedData = {
      ...data,
      name: data.user?.name,
      email: data.user?.email,
      phone: data.user?.phone
    };

    res.json({
      success: true,
      data: flattenedData
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message,
      statusCode: 500
    });
  }
});

// @route   PUT /api/donors/:id
// @desc    Update donor details
router.put('/:id', authMiddleware, checkRole(['admin', 'staff']), async (req, res) => {
  const { name, phone, blood_type, age, weight, is_eligible } = req.body;
  
  try {
    // 1. Get user_id first
    const { data: donor, error: fetchError } = await supabase
      .from('donors')
      .select('user_id')
      .eq('id', req.params.id)
      .single();
    
    if (fetchError) throw fetchError;

    // 2. Update user details if provided
    if (name || phone) {
      const { error: userError } = await supabase
        .from('users')
        .update({ name, phone })
        .eq('id', donor.user_id);
      
      if (userError) throw userError;
    }

    // 3. Update donor details
    const updates = {};
    if (blood_type) updates.blood_type = blood_type;
    if (age) updates.age = parseInt(age);
    if (weight) updates.weight = parseInt(weight);
    if (is_eligible !== undefined) updates.is_eligible = is_eligible;

    const { data: updatedDonor, error: donorError } = await supabase
      .from('donors')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (donorError) throw donorError;

    res.json({
      success: true,
      data: updatedDonor,
      message: 'Donor updated successfully'
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message,
      statusCode: 500
    });
  }
});

// @route   DELETE /api/donors/:id
// @desc    Delete a donor
router.delete('/:id', authMiddleware, checkRole(['admin']), async (req, res) => {
  try {
    // We only delete the donor record, keeping the user record (they might be a patient too)
    const { error } = await supabase
      .from('donors')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    
    res.json({ 
      success: true,
      message: 'Donor deleted successfully' 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message,
      statusCode: 500
    });
  }
});

module.exports = router;
