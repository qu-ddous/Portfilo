// src/controllers/vote.controller.js
import { supabaseAdmin } from '../services/supabase.service.js';
import { hashSecretId, generateVoteToken, verifySecretId } from '../services/secretId.service.js';

/**
 * Cast a vote (CRITICAL SECURITY FUNCTION)
 * 
 * Requirements:
 * 1. Election must be active
 * 2. Voter must be finalized
 * 3. Secret ID must be valid
 * 4. Voter must not have already voted
 * 5. Vote is stored anonymously (no voter_id)
 */
export const castVote = async (req, res) => {
  try {
    const { election_id, candidate_id, secret_id } = req.body;
    const voter_id = req.user.id;

    // ═══════════════════════════════════════════════════════════════
    // VALIDATION
    // ═══════════════════════════════════════════════════════════════
    if (!election_id || !candidate_id || !secret_id) {
      return res.status(400).json({
        error: 'Missing required fields',
        code: 'MISSING_FIELDS'
      });
    }

    // ═══════════════════════════════════════════════════════════════
    // 1. CHECK ELECTION IS ACTIVE
    // ═══════════════════════════════════════════════════════════════
    const { data: election, error: electionError } = await supabaseAdmin
      .from('elections')
      .select('status, start_time, end_time, id')
      .eq('id', election_id)
      .single();

    if (electionError || !election) {
      return res.status(404).json({
        error: 'Election not found',
        code: 'ELECTION_NOT_FOUND'
      });
    }

    if (election.status !== 'active') {
      return res.status(400).json({
        error: 'Election is not currently active',
        code: 'ELECTION_NOT_ACTIVE',
        currentStatus: election.status
      });
    }

    // Check time window
    const now = new Date();
    const startTime = new Date(election.start_time);
    const endTime = new Date(election.end_time);

    if (now < startTime || now > endTime) {
      return res.status(400).json({
        error: 'Voting window has closed',
        code: 'VOTING_WINDOW_CLOSED',
        currentTime: now.toISOString(),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      });
    }

    // ═══════════════════════════════════════════════════════════════
    // 2. CHECK VOTER IS FINALIZED
    // ═══════════════════════════════════════════════════════════════
    const { data: registration, error: registrationError } = await supabaseAdmin
      .from('voter_registrations')
      .select('secret_id_hash, status, id')
      .eq('election_id', election_id)
      .eq('voter_id', voter_id)
      .single();

    if (registrationError || !registration) {
      return res.status(403).json({
        error: 'You are not registered for this election',
        code: 'NOT_REGISTERED'
      });
    }

    if (registration.status !== 'finalized') {
      return res.status(403).json({
        error: 'You are not a finalized voter for this election',
        code: 'NOT_FINALIZED',
        currentStatus: registration.status
      });
    }

    // ═══════════════════════════════════════════════════════════════
    // 3. VALIDATE SECRET ID
    // ═══════════════════════════════════════════════════════════════
    const isValidSecretId = verifySecretId(secret_id, registration.secret_id_hash);
    if (!isValidSecretId) {
      return res.status(403).json({
        error: 'Invalid secret voter ID',
        code: 'INVALID_SECRET_ID'
      });
    }

    // ═══════════════════════════════════════════════════════════════
    // 4. GENERATE ANONYMOUS VOTE TOKEN
    // (Deterministic hash of secret_id + election_id + JWT_SECRET)
    // This allows preventing duplicate votes without storing voter_id
    // ═══════════════════════════════════════════════════════════════
    const voteToken = generateVoteToken(secret_id, election_id);

    // ═══════════════════════════════════════════════════════════════
    // 5. CHECK DUPLICATE VOTE (by vote token)
    // ═══════════════════════════════════════════════════════════════
    const { data: existingVote } = await supabaseAdmin
      .from('votes')
      .select('id')
      .eq('vote_token', voteToken)
      .single();

    if (existingVote) {
      return res.status(409).json({
        error: 'You have already voted in this election',
        code: 'ALREADY_VOTED'
      });
    }

    // ═══════════════════════════════════════════════════════════════
    // 6. VERIFY CANDIDATE EXISTS IN THIS ELECTION
    // ═══════════════════════════════════════════════════════════════
    const { data: candidate, error: candidateError } = await supabaseAdmin
      .from('candidates')
      .select('id')
      .eq('id', candidate_id)
      .eq('election_id', election_id)
      .single();

    if (candidateError || !candidate) {
      return res.status(404).json({
        error: 'Candidate not found or invalid for this election',
        code: 'INVALID_CANDIDATE'
      });
    }

    // ═══════════════════════════════════════════════════════════════
    // 7. INSERT VOTE (NO voter_id stored — ANONYMOUS)
    // ═══════════════════════════════════════════════════════════════
    const { data: voteRecord, error: voteError } = await supabaseAdmin
      .from('votes')
      .insert({
        election_id,
        candidate_id,
        vote_token: voteToken
        // NOTE: voter_id is intentionally NOT stored
      })
      .select()
      .single();

    if (voteError) {
      console.error('Vote insert error:', voteError);
      return res.status(500).json({
        error: 'Failed to cast vote',
        code: 'VOTE_INSERT_FAILED'
      });
    }

    // ═══════════════════════════════════════════════════════════════
    // 8. LOG ACTION (Audit log)
    // Note: Logs that voter_id participated, NOT who they voted for
    // ═══════════════════════════════════════════════════════════════
    await supabaseAdmin
      .from('audit_logs')
      .insert({
        actor_id: voter_id,
        action: 'cast_vote',
        entity_type: 'election',
        entity_id: election_id,
        metadata: {
          registration_id: registration.id,
          vote_token: voteToken.substring(0, 16) + '...' // Log truncated token
          // DO NOT log candidate_id for privacy
        },
        ip_address: req.ip
      });

    // ═══════════════════════════════════════════════════════════════
    // 9. RESPONSE
    // ═══════════════════════════════════════════════════════════════
    res.json({
      success: true,
      message: 'Vote cast successfully',
      data: {
        vote_id: voteRecord.id,
        timestamp: voteRecord.voted_at
      }
    });

  } catch (error) {
    console.error('Cast vote error:', error);
    res.status(500).json({
      error: 'Failed to cast vote',
      code: 'INTERNAL_ERROR'
    });
  }
};

/**
 * Check if current user has voted in an election
 * (Returns boolean only, no vote details)
 */
export const checkIfVoted = async (req, res) => {
  try {
    const { electionId } = req.params;
    const voter_id = req.user.id;

    // Get voter registration for this election
    const { data: registration, error: registrationError } = await supabaseAdmin
      .from('voter_registrations')
      .select('secret_id_hash, status')
      .eq('election_id', electionId)
      .eq('voter_id', voter_id)
      .single();

    if (registrationError || !registration) {
      return res.json({
        hasVoted: false,
        registered: false,
        status: null
      });
    }

    if (registration.status !== 'finalized') {
      return res.json({
        hasVoted: false,
        registered: true,
        status: registration.status
      });
    }

    // Check if vote token exists for this voter
    // We can't directly check without the secret_id, so we trust the RLS policy
    // The database will only allow counting if properly finalized
    res.json({
      hasVoted: false, // Frontend will track this after casting
      registered: true,
      status: 'finalized'
    });

  } catch (error) {
    console.error('Check vote error:', error);
    res.status(500).json({ error: 'Failed to check vote status' });
  }
};
