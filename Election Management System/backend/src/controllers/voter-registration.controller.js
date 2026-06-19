// src/controllers/voter-registration.controller.js
import { supabaseAdmin } from '../services/supabase.service.js';
import { generateSecretId, hashSecretId } from '../services/secretId.service.js';
import { sendSecretIdEmail } from '../services/email.service.js';

/**
 * Register voter for election
 */
export const registerVoter = async (req, res) => {
  try {
    const { electionId } = req.params;
    const voter_id = req.user.id;

    // Verify election exists and is in correct state
    const { data: election, error: electionError } = await supabaseAdmin
      .from('elections')
      .select('*')
      .eq('id', electionId)
      .single();

    if (electionError || !election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    if (!['published', 'active'].includes(election.status)) {
      return res.status(400).json({
        error: 'Can only register for published or active elections',
        code: 'ELECTION_NOT_OPEN'
      });
    }

    // Check if already registered
    const { data: existing } = await supabaseAdmin
      .from('voter_registrations')
      .select('id')
      .eq('election_id', electionId)
      .eq('voter_id', voter_id)
      .single();

    if (existing) {
      return res.status(400).json({
        error: 'Already registered for this election',
        code: 'ALREADY_REGISTERED'
      });
    }

    // Check voter limit
    const { data: currentVoters } = await supabaseAdmin
      .from('voter_registrations')
      .select('id', { count: 'exact', head: true })
      .eq('election_id', electionId);

    if (election.max_voters && currentVoters?.length >= election.max_voters) {
      return res.status(400).json({
        error: 'Election voter capacity reached',
        code: 'CAPACITY_REACHED'
      });
    }

    // Create voter registration
    const { data: registration, error: regError } = await supabaseAdmin
      .from('voter_registrations')
      .insert({
        election_id: electionId,
        voter_id,
        status: 'registered'
      })
      .select()
      .single();

    if (regError) {
      return res.status(500).json({ error: 'Failed to register voter' });
    }

    // Log audit
    await supabaseAdmin.from('audit_logs').insert({
      user_id: voter_id,
      action: 'register_for_election',
      resource_type: 'voter_registration',
      resource_id: registration.id,
      details: { election_id: electionId }
    });

    res.json({
      success: true,
      message: 'Registered for election. Admin will send secret ID soon.',
      data: registration
    });

  } catch (error) {
    console.error('Register voter error:', error);
    res.status(500).json({ error: 'Failed to register voter' });
  }
};

/**
 * Finalize voters and send secret IDs (admin only)
 */
export const finalizeVoters = async (req, res) => {
  try {
    const { electionId } = req.params;
    const admin_id = req.user.id;

    // Get election
    const { data: election } = await supabaseAdmin
      .from('elections')
      .select('*')
      .eq('id', electionId)
      .single();

    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    // Get all registered voters
    const { data: voters, error: votersError } = await supabaseAdmin
      .from('voter_registrations')
      .select('*')
      .eq('election_id', electionId)
      .eq('status', 'registered');

    if (votersError) {
      return res.status(500).json({ error: 'Failed to fetch voters' });
    }

    // Generate secret IDs and send emails
    const results = [];
    for (let i = 0; i < voters.length; i++) {
      const voter = voters[i];
      const sequenceNum = i + 1;
      const secretId = generateSecretId(election.title, sequenceNum);
      const secretIdHash = hashSecretId(secretId, process.env.JWT_SECRET);

      // Update voter registration
      await supabaseAdmin
        .from('voter_registrations')
        .update({
          status: 'finalized',
          secret_id_hash: secretIdHash,
          secret_id_sent: true
        })
        .eq('id', voter.id)
        .select()
        .single();

      // Get voter email
      const { data: voterProfile } = await supabaseAdmin
        .from('profiles')
        .select('email, full_name')
        .eq('id', voter.voter_id)
        .single();

      // Send email with secret ID
      if (voterProfile?.email) {
        await sendSecretIdEmail(
          voterProfile.email,
          voterProfile.full_name,
          election.title,
          secretId
        );
      }

      results.push({
        voter_id: voter.voter_id,
        secret_id: secretId,
        email_sent: !!voterProfile?.email
      });
    }

    // Log audit
    await supabaseAdmin.from('audit_logs').insert({
      user_id: admin_id,
      action: 'finalize_voters',
      resource_type: 'election',
      resource_id: electionId,
      details: { voters_count: voters.length }
    });

    res.json({
      success: true,
      message: `Finalized ${voters.length} voters and sent secret IDs`,
      data: {
        total: voters.length,
        emailsSent: results.filter(r => r.email_sent).length,
        results
      }
    });

  } catch (error) {
    console.error('Finalize voters error:', error);
    res.status(500).json({ error: 'Failed to finalize voters' });
  }
};

/**
 * Get voter registration status
 */
export const getRegistrationStatus = async (req, res) => {
  try {
    const { electionId } = req.params;
    const voter_id = req.user.id;

    const { data: registration } = await supabaseAdmin
      .from('voter_registrations')
      .select('*')
      .eq('election_id', electionId)
      .eq('voter_id', voter_id)
      .single();

    if (!registration) {
      return res.json({
        success: true,
        data: {
          registered: false,
          status: null
        }
      });
    }

    res.json({
      success: true,
      data: {
        registered: true,
        status: registration.status,
        secret_id_sent: registration.secret_id_sent
      }
    });

  } catch (error) {
    console.error('Get registration status error:', error);
    res.status(500).json({ error: 'Failed to fetch registration status' });
  }
};

/**
 * Cancel voter registration
 */
export const cancelRegistration = async (req, res) => {
  try {
    const { electionId } = req.params;
    const voter_id = req.user.id;

    const { data: registration } = await supabaseAdmin
      .from('voter_registrations')
      .select('*')
      .eq('election_id', electionId)
      .eq('voter_id', voter_id)
      .single();

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    // Can only cancel if not voted yet
    if (registration.status === 'voted') {
      return res.status(400).json({
        error: 'Cannot cancel registration after voting',
        code: 'ALREADY_VOTED'
      });
    }

    // Delete registration
    const { error: deleteError } = await supabaseAdmin
      .from('voter_registrations')
      .delete()
      .eq('id', registration.id);

    if (deleteError) {
      return res.status(500).json({ error: 'Failed to cancel registration' });
    }

    // Log audit
    await supabaseAdmin.from('audit_logs').insert({
      user_id: voter_id,
      action: 'cancel_registration',
      resource_type: 'voter_registration',
      resource_id: registration.id,
      details: { election_id: electionId }
    });

    res.json({
      success: true,
      message: 'Registration cancelled'
    });

  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({ error: 'Failed to cancel registration' });
  }
};
