// src/controllers/auth.controller.js
import { supabaseAdmin } from '../services/supabase.service.js';

/**
 * Register new user (Supabase handles password hashing)
 */
export const register = async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Email, password, and full name are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Create auth user via Supabase
    const { data: { user }, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false
    });

    if (signUpError) {
      return res.status(400).json({ error: signUpError.message });
    }

    // Create profile with voter role
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: user.id,
        email,
        full_name,
        role: 'voter'
      })
      .select()
      .single();

    if (profileError) {
      // Clean up user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(user.id);
      return res.status(500).json({ error: 'Failed to create profile' });
    }

    res.json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      data: { user: profile }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

/**
 * Login user (Supabase handles auth, returns JWT)
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Authenticate via Supabase
    const { data: { user, session }, error: signInError } = await supabaseAdmin.auth.admin.getUserByEmail(email);

    if (signInError || !user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return res.status(500).json({ error: 'Failed to load profile' });
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        profile,
        session
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user_id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({
      success: true,
      data: profile
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

/**
 * Request creator role
 */
export const requestCreator = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { organization, reason } = req.body;

    if (!organization || !reason) {
      return res.status(400).json({ error: 'Organization and reason are required' });
    }

    // Check if already has creator role
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user_id)
      .single();

    if (profile?.role === 'election_creator') {
      return res.status(400).json({ error: 'Already a creator' });
    }

    // Check if already requested
    const { data: existingRequest } = await supabaseAdmin
      .from('creator_requests')
      .select('id')
      .eq('user_id', user_id)
      .eq('status', 'pending')
      .single();

    if (existingRequest) {
      return res.status(400).json({ error: 'Request already pending' });
    }

    // Create request
    const { data: request, error } = await supabaseAdmin
      .from('creator_requests')
      .insert({
        user_id,
        organization,
        reason,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to submit request' });
    }

    // Log audit
    await supabaseAdmin.from('audit_logs').insert({
      user_id,
      action: 'request_creator_role',
      resource_type: 'creator_request',
      resource_id: request.id,
      details: { organization }
    });

    res.json({
      success: true,
      message: 'Creator request submitted. Admins will review it soon.',
      data: request
    });

  } catch (error) {
    console.error('Request creator error:', error);
    res.status(500).json({ error: 'Failed to submit request' });
  }
};

/**
 * Update profile
 */
export const updateProfile = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { full_name, avatar_url } = req.body;

    const { data: updated, error } = await supabaseAdmin
      .from('profiles')
      .update({
        full_name: full_name || undefined,
        avatar_url: avatar_url || undefined,
        updated_at: new Date().toISOString()
      })
      .eq('id', user_id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to update profile' });
    }

    res.json({
      success: true,
      message: 'Profile updated',
      data: updated
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
