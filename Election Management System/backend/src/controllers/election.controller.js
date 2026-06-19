// src/controllers/election.controller.js
import { supabaseAdmin } from '../services/supabase.service.js';
import { generateSecretId, hashSecretId, generateVoteToken } from '../services/secretId.service.js';
import { sendSecretIdEmail, sendElectionStartEmail } from '../services/email.service.js';

/**
 * Create a new election (creator only)
 */
export const createElection = async (req, res) => {
  try {
    const creator_id = req.user.id;
    const {
      title,
      description,
      category,
      registration_deadline,
      start_time,
      end_time,
      max_voters,
      banner_url
    } = req.body;

    // Validate required fields
    if (!title || !registration_deadline || !start_time || !end_time) {
      return res.status(400).json({
        error: 'Missing required fields',
        code: 'MISSING_FIELDS'
      });
    }

    // Validate dates
    const regDeadline = new Date(registration_deadline);
    const startTime = new Date(start_time);
    const endTime = new Date(end_time);

    if (regDeadline >= startTime) {
      return res.status(400).json({
        error: 'Registration deadline must be before start time',
        code: 'INVALID_DATES'
      });
    }

    if (startTime >= endTime) {
      return res.status(400).json({
        error: 'Start time must be before end time',
        code: 'INVALID_DATES'
      });
    }

    // Create election
    const { data: election, error: createError } = await supabaseAdmin
      .from('elections')
      .insert({
        creator_id,
        title,
        description: description || '',
        category: category || 'general',
        registration_deadline: regDeadline.toISOString(),
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        max_voters: max_voters || 1000,
        banner_url: banner_url || null,
        status: 'draft'
      })
      .select()
      .single();

    if (createError) {
      return res.status(500).json({
        error: 'Failed to create election',
        code: 'CREATE_ERROR'
      });
    }

    res.json({
      success: true,
      message: 'Election created successfully',
      data: election
    });

  } catch (error) {
    console.error('Create election error:', error);
    res.status(500).json({ error: 'Failed to create election' });
  }
};

/**
 * Get all elections (public: published/active/completed, private: own)
 */
export const getElections = async (req, res) => {
  try {
    const { status, category, search, limit = 50, offset = 0 } = req.query;
    let query = supabaseAdmin.from('elections').select('*, profiles!creator_id(full_name, avatar_url)');

    // Filter by status
    if (status) {
      const statuses = status.split(',');
      query = query.in('status', statuses);
    } else {
      // Default: show published, active, completed
      query = query.in('status', ['published', 'active', 'completed']);
    }

    // Filter by category
    if (category) {
      query = query.eq('category', category);
    }

    // Search by title or description
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Pagination
    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data: elections, error } = await query;

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch elections' });
    }

    res.json({
      success: true,
      data: elections,
      pagination: { limit: parseInt(limit), offset: parseInt(offset) }
    });

  } catch (error) {
    console.error('Get elections error:', error);
    res.status(500).json({ error: 'Failed to fetch elections' });
  }
};

/**
 * Get election by ID (public detail page)
 */
export const getElectionById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: election, error } = await supabaseAdmin
      .from('elections')
      .select(`
        *,
        profiles!creator_id(full_name, avatar_url),
        candidates(*)
      `)
      .eq('id', id)
      .single();

    if (error || !election) {
      return res.status(404).json({
        error: 'Election not found',
        code: 'NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: election
    });

  } catch (error) {
    console.error('Get election error:', error);
    res.status(500).json({ error: 'Failed to fetch election' });
  }
};

/**
 * Update election (creator only, draft status only)
 */
export const updateElection = async (req, res) => {
  try {
    const { id } = req.params;
    const creator_id = req.user.id;
    const { title, description, category, max_voters, banner_url } = req.body;

    // Check ownership and status
    const { data: election, error: fetchError } = await supabaseAdmin
      .from('elections')
      .select('creator_id, status')
      .eq('id', id)
      .single();

    if (fetchError || !election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    if (election.creator_id !== creator_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (election.status !== 'draft') {
      return res.status(400).json({
        error: 'Can only edit draft elections',
        code: 'ELECTION_NOT_DRAFT'
      });
    }

    // Update
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('elections')
      .update({
        title: title || undefined,
        description: description || undefined,
        category: category || undefined,
        max_voters: max_voters || undefined,
        banner_url: banner_url || undefined
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ error: 'Failed to update election' });
    }

    res.json({
      success: true,
      message: 'Election updated successfully',
      data: updated
    });

  } catch (error) {
    console.error('Update election error:', error);
    res.status(500).json({ error: 'Failed to update election' });
  }
};

/**
 * Publish election (draft → published)
 */
export const publishElection = async (req, res) => {
  try {
    const { id } = req.params;
    const creator_id = req.user.id;

    // Check ownership and status
    const { data: election, error: fetchError } = await supabaseAdmin
      .from('elections')
      .select('creator_id, status, candidates(count)')
      .eq('id', id)
      .single();

    if (fetchError || !election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    if (election.creator_id !== creator_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (election.status !== 'draft') {
      return res.status(400).json({
        error: 'Can only publish draft elections',
        code: 'INVALID_STATUS'
      });
    }

    // Update status
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('elections')
      .update({ status: 'published' })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ error: 'Failed to publish election' });
    }

    // Log
    await supabaseAdmin.from('audit_logs').insert({
      actor_id: creator_id,
      action: 'publish_election',
      entity_type: 'election',
      entity_id: id
    });

    res.json({
      success: true,
      message: 'Election published successfully',
      data: updated
    });

  } catch (error) {
    console.error('Publish election error:', error);
    res.status(500).json({ error: 'Failed to publish election' });
  }
};

/**
 * Start election (published → active)
 */
export const startElection = async (req, res) => {
  try {
    const { id } = req.params;
    const creator_id = req.user.id;

    const { data: election, error: fetchError } = await supabaseAdmin
      .from('elections')
      .select('creator_id, status, start_time')
      .eq('id', id)
      .single();

    if (fetchError || !election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    if (election.creator_id !== creator_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (election.status !== 'published') {
      return res.status(400).json({
        error: 'Can only start published elections',
        code: 'INVALID_STATUS'
      });
    }

    // Update status
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('elections')
      .update({ status: 'active' })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ error: 'Failed to start election' });
    }

    res.json({
      success: true,
      message: 'Election started successfully',
      data: updated
    });

  } catch (error) {
    console.error('Start election error:', error);
    res.status(500).json({ error: 'Failed to start election' });
  }
};

/**
 * Stop election (active → completed)
 */
export const stopElection = async (req, res) => {
  try {
    const { id } = req.params;
    const creator_id = req.user.id;

    const { data: election, error: fetchError } = await supabaseAdmin
      .from('elections')
      .select('creator_id, status')
      .eq('id', id)
      .single();

    if (fetchError || !election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    if (election.creator_id !== creator_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (election.status !== 'active') {
      return res.status(400).json({
        error: 'Can only stop active elections',
        code: 'INVALID_STATUS'
      });
    }

    // Update status
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('elections')
      .update({ status: 'completed' })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ error: 'Failed to stop election' });
    }

    res.json({
      success: true,
      message: 'Election stopped successfully',
      data: updated
    });

  } catch (error) {
    console.error('Stop election error:', error);
    res.status(500).json({ error: 'Failed to stop election' });
  }
};

/**
 * Get election results (vote counts per candidate)
 */
export const getElectionResults = async (req, res) => {
  try {
    const { id } = req.params;

    // Use RPC function to safely get vote counts
    const { data: results, error } = await supabaseAdmin
      .rpc('get_vote_counts', { p_election_id: id });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch results' });
    }

    // Get total voter count
    const { data: voterCount } = await supabaseAdmin
      .rpc('get_voter_count', { p_election_id: id });

    // Get total votes cast
    const { data: totalVotes } = await supabaseAdmin
      .rpc('get_total_votes', { p_election_id: id });

    res.json({
      success: true,
      data: {
        results,
        totalVoters: voterCount || 0,
        totalVotes: totalVotes || 0,
        turnout: voterCount > 0 ? Math.round((totalVotes / voterCount) * 100) : 0
      }
    });

  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
};

/**
 * Delete election (creator only, draft only)
 */
export const deleteElection = async (req, res) => {
  try {
    const { id } = req.params;
    const creator_id = req.user.id;

    const { data: election, error: fetchError } = await supabaseAdmin
      .from('elections')
      .select('creator_id, status')
      .eq('id', id)
      .single();

    if (fetchError || !election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    if (election.creator_id !== creator_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (election.status !== 'draft') {
      return res.status(400).json({
        error: 'Can only delete draft elections',
        code: 'INVALID_STATUS'
      });
    }

    // Delete (cascade will handle related records)
    const { error: deleteError } = await supabaseAdmin
      .from('elections')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return res.status(500).json({ error: 'Failed to delete election' });
    }

    res.json({
      success: true,
      message: 'Election deleted successfully'
    });

  } catch (error) {
    console.error('Delete election error:', error);
    res.status(500).json({ error: 'Failed to delete election' });
  }
};
