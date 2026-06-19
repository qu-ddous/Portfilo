// src/controllers/candidate.controller.js
import { supabaseAdmin } from '../services/supabase.service.js';

/**
 * Add candidate to election
 */
export const addCandidate = async (req, res) => {
  try {
    const { electionId } = req.params;
    const creator_id = req.user.id;
    const { name, designation, photo_url, manifesto, display_order } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Candidate name is required' });
    }

    // Verify election ownership and status
    const { data: election, error: electionError } = await supabaseAdmin
      .from('elections')
      .select('creator_id, status')
      .eq('id', electionId)
      .single();

    if (electionError || !election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    if (election.creator_id !== creator_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (election.status !== 'draft') {
      return res.status(400).json({
        error: 'Can only add candidates to draft elections',
        code: 'ELECTION_NOT_DRAFT'
      });
    }

    // Insert candidate
    const { data: candidate, error: insertError } = await supabaseAdmin
      .from('candidates')
      .insert({
        election_id: electionId,
        name,
        designation: designation || null,
        photo_url: photo_url || null,
        manifesto: manifesto || null,
        display_order: display_order || 0
      })
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({ error: 'Failed to add candidate' });
    }

    res.json({
      success: true,
      message: 'Candidate added successfully',
      data: candidate
    });

  } catch (error) {
    console.error('Add candidate error:', error);
    res.status(500).json({ error: 'Failed to add candidate' });
  }
};

/**
 * Get candidates for an election
 */
export const getCandidates = async (req, res) => {
  try {
    const { electionId } = req.params;

    const { data: candidates, error } = await supabaseAdmin
      .from('candidates')
      .select('*')
      .eq('election_id', electionId)
      .order('display_order', { ascending: true });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch candidates' });
    }

    res.json({
      success: true,
      data: candidates
    });

  } catch (error) {
    console.error('Get candidates error:', error);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
};

/**
 * Update candidate
 */
export const updateCandidate = async (req, res) => {
  try {
    const { electionId, candidateId } = req.params;
    const creator_id = req.user.id;
    const { name, designation, photo_url, manifesto, display_order } = req.body;

    // Verify election ownership
    const { data: election, error: electionError } = await supabaseAdmin
      .from('elections')
      .select('creator_id, status')
      .eq('id', electionId)
      .single();

    if (electionError || !election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    if (election.creator_id !== creator_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (election.status !== 'draft') {
      return res.status(400).json({
        error: 'Can only edit candidates in draft elections',
        code: 'ELECTION_NOT_DRAFT'
      });
    }

    // Update candidate
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('candidates')
      .update({
        name: name || undefined,
        designation: designation || undefined,
        photo_url: photo_url || undefined,
        manifesto: manifesto || undefined,
        display_order: display_order !== undefined ? display_order : undefined
      })
      .eq('id', candidateId)
      .eq('election_id', electionId)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ error: 'Failed to update candidate' });
    }

    res.json({
      success: true,
      message: 'Candidate updated successfully',
      data: updated
    });

  } catch (error) {
    console.error('Update candidate error:', error);
    res.status(500).json({ error: 'Failed to update candidate' });
  }
};

/**
 * Delete candidate
 */
export const deleteCandidate = async (req, res) => {
  try {
    const { electionId, candidateId } = req.params;
    const creator_id = req.user.id;

    // Verify election ownership
    const { data: election, error: electionError } = await supabaseAdmin
      .from('elections')
      .select('creator_id, status')
      .eq('id', electionId)
      .single();

    if (electionError || !election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    if (election.creator_id !== creator_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (election.status !== 'draft') {
      return res.status(400).json({
        error: 'Can only delete candidates from draft elections',
        code: 'ELECTION_NOT_DRAFT'
      });
    }

    // Delete candidate
    const { error: deleteError } = await supabaseAdmin
      .from('candidates')
      .delete()
      .eq('id', candidateId)
      .eq('election_id', electionId);

    if (deleteError) {
      return res.status(500).json({ error: 'Failed to delete candidate' });
    }

    res.json({
      success: true,
      message: 'Candidate deleted successfully'
    });

  } catch (error) {
    console.error('Delete candidate error:', error);
    res.status(500).json({ error: 'Failed to delete candidate' });
  }
};
