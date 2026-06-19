const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authMiddleware, checkRole } = require('../middleware/auth');

// @route   GET /api/requests
// @desc    Get all blood requests
router.get('/', authMiddleware, async (req, res) => {
  try {
    let query = supabase
      .from('blood_requests')
      .select(`
        *,
        patient:patients (
          id,
          medical_condition,
          user:users (
            name,
            phone
          )
        )
      `);
    
    // If patient, only show their requests
    if (req.user.role === 'patient') {
      // Need to find the patient record for this user first
      const { data: pRecord } = await supabase.from('patients').select('id').eq('user_id', req.user.id).single();
      if (pRecord) {
        query = query.eq('patient_id', pRecord.id);
      } else {
        return res.json({ success: true, data: [] });
      }
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    const flattenedData = data.map(req => ({
      ...req,
      patient_name: req.patient?.user?.name || 'N/A',
      patient_phone: req.patient?.user?.phone || 'N/A'
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

// @route   POST /api/requests
// @desc    Create a new blood request
router.post('/', authMiddleware, async (req, res) => {
  const { blood_type, units, urgency, condition, required_date, patient_id } = req.body;
  
  try {
    let finalPatientId = patient_id;

    // If user is a patient, they can only request for themselves
    if (req.user.role === 'patient') {
      const { data: pRecord } = await supabase.from('patients').select('id').eq('user_id', req.user.id).single();
      if (!pRecord) throw new Error('Patient profile not found');
      finalPatientId = pRecord.id;
    }

    if (!finalPatientId || !blood_type || !units || !urgency || !required_date) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields',
        statusCode: 400 
      });
    }

    const { data, error } = await supabase
      .from('blood_requests')
      .insert([{ 
        patient_id: finalPatientId, 
        blood_type, 
        units: parseInt(units), 
        urgency, 
        condition: condition || 'N/A',
        required_date,
        status: 'pending' 
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: data,
      message: 'Blood request submitted successfully'
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message,
      statusCode: 500
    });
  }
});

// @route   PATCH /api/requests/:id/status
// @desc    Update request status (Approve/Reject)
router.patch('/:id/status', authMiddleware, checkRole(['admin', 'staff']), async (req, res) => {
  const { status, rejection_reason } = req.body;
  try {
    const { data, error } = await supabase
      .from('blood_requests')
      .update({ status, rejection_reason })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: data,
      message: `Request ${status}`
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message,
      statusCode: 500
    });
  }
});

// @route   PATCH /api/requests/:id/fulfill
// @desc    Fulfill request (Updates inventory)
router.patch('/:id/fulfill', authMiddleware, checkRole(['admin', 'staff']), async (req, res) => {
  const { id } = req.params;
  try {
    // 1. Get request details
    const { data: request, error: reqErr } = await supabase
      .from('blood_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (reqErr) throw reqErr;
    if (request.status === 'fulfilled') return res.status(400).json({ success: false, error: 'Already fulfilled' });

    // 2. Check Inventory (Simplified total check)
    const { data: batches, error: invErr } = await supabase
      .from('blood_inventory')
      .select('id, units')
      .eq('blood_type', request.blood_type)
      .gt('units', 0)
      .order('expiry_date', { ascending: true }); // FIFO

    if (invErr) throw invErr;

    const totalAvailable = batches.reduce((acc, b) => acc + b.units, 0);

    if (totalAvailable < request.units) {
      return res.status(400).json({ 
        success: false, 
        error: `Insufficient inventory of ${request.blood_type}. Only ${totalAvailable} ml available.` 
      });
    }

    // 3. Deduct from inventory (FIFO)
    let pendingDeduction = request.units;
    for (const batch of batches) {
      if (pendingDeduction <= 0) break;
      
      const deduct = Math.min(batch.units, pendingDeduction);
      const { error: updateErr } = await supabase
        .from('blood_inventory')
        .update({ units: batch.units - deduct })
        .eq('id', batch.id);
      
      if (updateErr) throw updateErr;
      pendingDeduction -= deduct;
    }

    // 4. Update request status
    const { data: updatedReq, error: finalErr } = await supabase
      .from('blood_requests')
      .update({ status: 'fulfilled' })
      .eq('id', id)
      .select()
      .single();

    if (finalErr) throw finalErr;

    // Notify patient
    const { data: patientUser } = await supabase.from('patients').select('user_id').eq('id', request.patient_id).single();
    if (patientUser) {
      await supabase.from('notifications').insert([{
        user_id: patientUser.user_id,
        title: 'Blood Request Fulfilled',
        message: `Good news! Your request for ${request.units} ml of ${request.blood_type} blood has been fulfilled.`,
        type: 'success'
      }]);
    }

    res.json({ 
      success: true,
      message: 'Request fulfilled successfully (FIFO)', 
      data: updatedReq 
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
