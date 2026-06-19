const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authMiddleware, checkRole } = require('../middleware/auth');

// @route   GET /api/settings
// @desc    Get global system settings
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .eq('id', 'global')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found, return defaults
        return res.json({ 
          success: true, 
          data: {
            hospital_name: 'BloodLink Central Hub',
            license_number: 'BLK-PW-2026-X',
            email: 'admin@bloodlink.org',
            phone: '+92 321 0000000',
            address: 'Phase 6, Hayatabad, Peshawar, Pakistan',
            min_donation_interval: 90,
            inventory_low_threshold: 10,
            expiry_warning_days: 3,
            fulfillment_strategy: 'FIFO',
            emergency_mode: false,
            public_stocks_view: true,
            accept_guest_donors: false,
            two_factor_auth: true,
            auto_backups: true
          } 
        });
      }
      throw error;
    }

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   POST /api/settings
// @desc    Update/Upsert global system settings
router.post('/', authMiddleware, checkRole(['admin']), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .upsert({ id: 'global', ...req.body, updated_at: new Date() })
      .select()
      .single();

    if (error) throw error;

    res.json({ 
      success: true, 
      message: 'System settings updated successfully!', 
      data 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
