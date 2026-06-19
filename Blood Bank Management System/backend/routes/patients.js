const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authMiddleware, checkRole } = require('../middleware/auth');

// @route   GET /api/patients
// @desc    Get all patients
router.get('/', authMiddleware, checkRole(['admin', 'staff']), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('patients')
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

    const flattenedData = data.map(patient => ({
      ...patient,
      name: patient.user?.name,
      email: patient.user?.email,
      phone: patient.user?.phone
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

// @route   POST /api/patients
// @desc    Register a new patient
router.post('/', authMiddleware, checkRole(['admin', 'staff']), async (req, res) => {
  const { name, email, phone, blood_type, medical_condition } = req.body;

  if (!name || !email || !phone || !blood_type) {
    return res.status(400).json({ 
      success: false, 
      error: 'Name, Email, Phone, and Blood Type are required', 
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
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{ name, email, phone, role: 'patient' }])
        .select()
        .single();

      if (createError) throw createError;
      userId = newUser.id;
    } else if (userFetchError) {
      throw userFetchError;
    } else {
      userId = user.id;
    }

    // 2. Check if patient record exists
    const { data: existingPatient, error: patientFetchError } = await supabase
      .from('patients')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existingPatient) {
      return res.status(400).json({ 
        success: false, 
        error: 'A patient record already exists for this user', 
        statusCode: 400 
      });
    }

    // 3. Create patient record
    const { data: patient, error: patientCreateError } = await supabase
      .from('patients')
      .insert([{ 
        user_id: userId, 
        blood_type, 
        medical_condition: medical_condition || 'N/A'
      }])
      .select()
      .single();

    if (patientCreateError) throw patientCreateError;

    res.status(201).json({
      success: true,
      data: patient,
      message: 'Patient registered successfully'
    });

  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message,
      statusCode: 500 
    });
  }
});

// @route   GET /api/patients/:id
// @desc    Get patient by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('patients')
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

// @route   PUT /api/patients/:id
// @desc    Update patient details
router.put('/:id', authMiddleware, checkRole(['admin', 'staff']), async (req, res) => {
  const { name, phone, blood_type, medical_condition } = req.body;
  
  try {
    const { data: patient, error: fetchError } = await supabase
      .from('patients')
      .select('user_id')
      .eq('id', req.params.id)
      .single();
    
    if (fetchError) throw fetchError;

    if (name || phone) {
      const { error: userError } = await supabase
        .from('users')
        .update({ name, phone })
        .eq('id', patient.user_id);
      
      if (userError) throw userError;
    }

    const updates = {};
    if (blood_type) updates.blood_type = blood_type;
    if (medical_condition) updates.medical_condition = medical_condition;

    const { data: updatedPatient, error: patientError } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (patientError) throw patientError;

    res.json({
      success: true,
      data: updatedPatient,
      message: 'Patient updated successfully'
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message,
      statusCode: 500
    });
  }
});

// @route   DELETE /api/patients/:id
// @desc    Delete a patient
router.delete('/:id', authMiddleware, checkRole(['admin']), async (req, res) => {
  try {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    
    res.json({ 
      success: true,
      message: 'Patient deleted successfully' 
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
