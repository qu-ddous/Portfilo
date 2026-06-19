// src/controllers/admin.controller.js
import { supabaseAdmin } from '../services/supabase.service.js';
import { sendApprovalEmail, sendRejectionEmail } from '../services/email.service.js';

/**
 * Get all pending creator requests
 */
export const getCreatorRequests = async (req, res) => {
  try {
    const { status = 'pending' } = req.query;

    const { data: requests, error } = await supabaseAdmin
      .from('creator_requests')
      .select(`
        *,
        profiles:user_id(id, email, full_name)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch requests' });
    }

    res.json({
      success: true,
      data: requests
    });

  } catch (error) {
    console.error('Get creator requests error:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

/**
 * Approve creator request
 */
export const approveCreator = async (req, res) => {
  try {
    const { requestId } = req.params;
    const admin_id = req.user.id;

    // Get request
    const { data: request, error: requestError } = await supabaseAdmin
      .from('creator_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (requestError || !request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Update request status
    const { error: updateError } = await supabaseAdmin
      .from('creator_requests')
      .update({ status: 'approved' })
      .eq('id', requestId);

    if (updateError) {
      return res.status(500).json({ error: 'Failed to approve request' });
    }

    // Update user role
    const { error: roleError } = await supabaseAdmin
      .from('profiles')
      .update({ role: 'election_creator' })
      .eq('id', request.user_id);

    if (roleError) {
      return res.status(500).json({ error: 'Failed to update user role' });
    }

    // Get user email for notification
    const { data: userProfile } = await supabaseAdmin
      .from('profiles')
      .select('email, full_name')
      .eq('id', request.user_id)
      .single();

    // Send approval email
    if (userProfile?.email) {
      await sendApprovalEmail(userProfile.email, userProfile.full_name);
    }

    // Log audit
    await supabaseAdmin.from('audit_logs').insert({
      user_id: admin_id,
      action: 'approve_creator_request',
      resource_type: 'creator_request',
      resource_id: requestId,
      details: { approved_user_id: request.user_id }
    });

    res.json({
      success: true,
      message: 'Creator request approved',
      data: request
    });

  } catch (error) {
    console.error('Approve creator error:', error);
    res.status(500).json({ error: 'Failed to approve request' });
  }
};

/**
 * Reject creator request
 */
export const rejectCreator = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { reason } = req.body;
    const admin_id = req.user.id;

    if (!reason) {
      return res.status(400).json({ error: 'Rejection reason is required' });
    }

    // Get request
    const { data: request, error: requestError } = await supabaseAdmin
      .from('creator_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (requestError || !request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Update request status
    const { error: updateError } = await supabaseAdmin
      .from('creator_requests')
      .update({ status: 'rejected', rejection_reason: reason })
      .eq('id', requestId);

    if (updateError) {
      return res.status(500).json({ error: 'Failed to reject request' });
    }

    // Get user email for notification
    const { data: userProfile } = await supabaseAdmin
      .from('profiles')
      .select('email, full_name')
      .eq('id', request.user_id)
      .single();

    // Send rejection email
    if (userProfile?.email) {
      await sendRejectionEmail(userProfile.email, userProfile.full_name, reason);
    }

    // Log audit
    await supabaseAdmin.from('audit_logs').insert({
      user_id: admin_id,
      action: 'reject_creator_request',
      resource_type: 'creator_request',
      resource_id: requestId,
      details: { rejected_user_id: request.user_id, reason }
    });

    res.json({
      success: true,
      message: 'Creator request rejected',
      data: request
    });

  } catch (error) {
    console.error('Reject creator error:', error);
    res.status(500).json({ error: 'Failed to reject request' });
  }
};

/**
 * Get all users
 */
export const getAllUsers = async (req, res) => {
  try {
    const { role, limit = 50, offset = 0 } = req.query;

    let query = supabaseAdmin.from('profiles').select('*');

    if (role) {
      query = query.eq('role', role);
    }

    const { data: users, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch users' });
    }

    res.json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

/**
 * Get audit logs
 */
export const getAuditLogs = async (req, res) => {
  try {
    const { action, resource_type, limit = 100, offset = 0 } = req.query;

    let query = supabaseAdmin.from('audit_logs').select(`
      *,
      user:user_id(full_name, email)
    `);

    if (action) {
      query = query.eq('action', action);
    }

    if (resource_type) {
      query = query.eq('resource_type', resource_type);
    }

    const { data: logs, error } = await query
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch audit logs' });
    }

    res.json({
      success: true,
      data: logs
    });

  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
};

/**
 * Get system statistics
 */
export const getSystemStats = async (req, res) => {
  try {
    // Get user counts by role
    const { data: roleStats } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .then(result => {
        const stats = {
          super_admin: 0,
          election_creator: 0,
          voter: 0
        };
        result.data?.forEach(p => {
          stats[p.role]++;
        });
        return { data: stats };
      });

    // Get election stats
    const { data: elections } = await supabaseAdmin
      .from('elections')
      .select('status');

    const electionStats = {
      total: elections?.length || 0,
      draft: elections?.filter(e => e.status === 'draft').length || 0,
      published: elections?.filter(e => e.status === 'published').length || 0,
      active: elections?.filter(e => e.status === 'active').length || 0,
      completed: elections?.filter(e => e.status === 'completed').length || 0
    };

    // Get pending requests count
    const { data: pendingRequests } = await supabaseAdmin
      .from('creator_requests')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending');

    res.json({
      success: true,
      data: {
        users: roleStats,
        elections: electionStats,
        pendingCreatorRequests: pendingRequests?.length || 0
      }
    });

  } catch (error) {
    console.error('Get system stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};
