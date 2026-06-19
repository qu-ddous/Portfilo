// src/middleware/auth.middleware.js
import { supabaseAdmin } from '../services/supabase.service.js';

/**
 * Authenticate request using Bearer token
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split('Bearer ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return res.status(401).json({ error: 'Profile not found' });
    }

    // Attach user and profile to request
    req.user = user;
    req.profile = profile;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

/**
 * Require specific role(s)
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.profile || !roles.includes(req.profile.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        requiredRoles: roles,
        userRole: req.profile?.role
      });
    }
    next();
  };
};

/**
 * Require specific role: super_admin
 */
export const requireAdmin = requireRole('super_admin');

/**
 * Require specific role: election_creator
 */
export const requireCreator = requireRole('election_creator', 'super_admin');

/**
 * Require specific role: voter
 */
export const requireVoter = requireRole('voter', 'election_creator', 'super_admin');
