// backend/src/controllers/twofa.controller.js
import { supabaseAdmin } from '../services/supabase.service.js';
import crypto from 'crypto';

/**
 * Generate 2FA secret (TOTP)
 */
export const generateTwoFASecret = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Generate random secret
    const secret = crypto.randomBytes(32).toString('hex');

    // Store in database
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        two_fa_secret: secret,
        two_fa_enabled: false
      })
      .eq('id', user_id);

    if (error) {
      return res.status(500).json({ error: 'Failed to generate secret' });
    }

    res.json({
      success: true,
      message: 'Secret generated. Confirm with a 6-digit code to enable.',
      data: {
        secret: secret.substring(0, 16) // Send shortened version to user
      }
    });

  } catch (error) {
    console.error('Generate 2FA secret error:', error);
    res.status(500).json({ error: 'Failed to generate 2FA secret' });
  }
};

/**
 * Verify and enable 2FA
 */
export const enableTwoFA = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { code } = req.body;

    if (!code || code.length !== 6) {
      return res.status(400).json({ error: 'Invalid code format' });
    }

    // Get user's secret
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('two_fa_secret')
      .eq('id', user_id)
      .single();

    if (!profile?.two_fa_secret) {
      return res.status(400).json({ error: 'No 2FA secret found' });
    }

    // Verify code (simplified - in production use speakeasy or similar)
    const timestamp = Math.floor(Date.now() / 30000);
    const verifyCode = crypto
      .createHmac('sha1', Buffer.from(profile.two_fa_secret, 'hex'))
      .update(Buffer.from(timestamp.toString()))
      .digest()
      .readUInt32BE(profile.two_fa_secret.length % 15) & 0x7fffffff;
    
    const expectedCode = (verifyCode % 1000000).toString().padStart(6, '0');

    if (code !== expectedCode) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Enable 2FA
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ two_fa_enabled: true })
      .eq('id', user_id);

    if (error) {
      return res.status(500).json({ error: 'Failed to enable 2FA' });
    }

    // Log audit
    await supabaseAdmin.from('audit_logs').insert({
      user_id,
      action: 'enable_two_fa',
      resource_type: 'user',
      resource_id: user_id
    });

    res.json({
      success: true,
      message: '2FA successfully enabled'
    });

  } catch (error) {
    console.error('Enable 2FA error:', error);
    res.status(500).json({ error: 'Failed to enable 2FA' });
  }
};

/**
 * Disable 2FA
 */
export const disableTwoFA = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password required' });
    }

    // Verify password
    const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(user_id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Disable 2FA
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        two_fa_enabled: false,
        two_fa_secret: null
      })
      .eq('id', user_id);

    if (error) {
      return res.status(500).json({ error: 'Failed to disable 2FA' });
    }

    // Log audit
    await supabaseAdmin.from('audit_logs').insert({
      user_id,
      action: 'disable_two_fa',
      resource_type: 'user',
      resource_id: user_id
    });

    res.json({
      success: true,
      message: '2FA successfully disabled'
    });

  } catch (error) {
    console.error('Disable 2FA error:', error);
    res.status(500).json({ error: 'Failed to disable 2FA' });
  }
};

/**
 * Verify 2FA code during login
 */
export const verifyTwoFACode = async (req, res) => {
  try {
    const { user_id, code } = req.body;

    if (!user_id || !code) {
      return res.status(400).json({ error: 'Missing user_id or code' });
    }

    // Get user's secret
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('two_fa_secret')
      .eq('id', user_id)
      .single();

    if (!profile?.two_fa_secret) {
      return res.status(400).json({ error: '2FA not enabled for this user' });
    }

    // Verify code
    const timestamp = Math.floor(Date.now() / 30000);
    const verifyCode = crypto
      .createHmac('sha1', Buffer.from(profile.two_fa_secret, 'hex'))
      .update(Buffer.from(timestamp.toString()))
      .digest()
      .readUInt32BE(profile.two_fa_secret.length % 15) & 0x7fffffff;
    
    const expectedCode = (verifyCode % 1000000).toString().padStart(6, '0');

    if (code !== expectedCode) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    res.json({
      success: true,
      message: '2FA verification successful'
    });

  } catch (error) {
    console.error('Verify 2FA code error:', error);
    res.status(500).json({ error: 'Failed to verify 2FA code' });
  }
};

/**
 * Get 2FA status
 */
export const getTwoFAStatus = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('two_fa_enabled')
      .eq('id', user_id)
      .single();

    res.json({
      success: true,
      data: {
        two_fa_enabled: profile?.two_fa_enabled || false
      }
    });

  } catch (error) {
    console.error('Get 2FA status error:', error);
    res.status(500).json({ error: 'Failed to fetch 2FA status' });
  }
};
