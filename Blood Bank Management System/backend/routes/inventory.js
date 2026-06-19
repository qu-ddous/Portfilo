const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authMiddleware, checkRole } = require('../middleware/auth');

// @route   GET /api/inventory/stats
// @desc    Get aggregated stats for public landing
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blood_inventory')
      .select('blood_type, units');

    if (error) throw error;
    
    // Aggregate units by type
    const stats = data.reduce((acc, curr) => {
      acc[curr.blood_type] = (acc[curr.blood_type] || 0) + curr.units;
      return acc;
    }, {});

    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message,
      statusCode: 500
    });
  }
});

// @route   GET /api/inventory
// @desc    Get all blood inventory
// @access  Protected
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blood_inventory')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    res.json({
      success: true,
      data: data
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message,
      statusCode: 500
    });
  }
});

// @route   POST /api/inventory
// @desc    Add new blood batch
// @access  Admin, Staff
router.post('/', authMiddleware, checkRole(['admin', 'staff']), async (req, res) => {
  const { blood_type, units, collection_date, expiry_date } = req.body;

  if (!blood_type || !units || !collection_date || !expiry_date) {
    return res.status(400).json({ 
      success: false, 
      error: 'All fields are required (blood_type, units, collection_date, expiry_date)',
      statusCode: 400
    });
  }

  try {
    const { data, error } = await supabase
      .from('blood_inventory')
      .insert([{ 
        blood_type, 
        units: parseInt(units), 
        collection_date, 
        expiry_date, 
        status: 'sufficient' 
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: data,
      message: 'Blood batch added to inventory'
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message,
      statusCode: 500
    });
  }
});

// @route   PUT /api/inventory/:id
// @desc    Update a specific batch
// @access  Admin, Staff
router.put('/:id', authMiddleware, checkRole(['admin', 'staff']), async (req, res) => {
  const { units, status } = req.body;
  try {
    const updates = {};
    if (units !== undefined) updates.units = parseInt(units);
    if (status) updates.status = status;

    const { data, error } = await supabase
      .from('blood_inventory')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: data,
      message: 'Inventory batch updated'
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message,
      statusCode: 500
    });
  }
});

// @route   DELETE /api/inventory/:id
// @desc    Delete a blood batch
// @access  Admin
router.delete('/:id', authMiddleware, checkRole(['admin']), async (req, res) => {
  try {
    const { error } = await supabase
      .from('blood_inventory')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ 
      success: true,
      message: 'Inventory item deleted' 
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
