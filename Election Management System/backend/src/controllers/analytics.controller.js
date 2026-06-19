// backend/src/controllers/analytics.controller.js
import { supabaseAdmin } from '../services/supabase.service.js';

/**
 * Get detailed election analytics
 */
export const getElectionAnalytics = async (req, res) => {
  try {
    const { electionId } = req.params;

    // Get election details
    const { data: election } = await supabaseAdmin
      .from('elections')
      .select('*')
      .eq('id', electionId)
      .single();

    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    // Get voter registration stats
    const { data: registrations, error: regError } = await supabaseAdmin
      .from('voter_registrations')
      .select('status')
      .eq('election_id', electionId);

    const voterStats = {
      total_registered: registrations?.length || 0,
      finalized: registrations?.filter(r => r.status === 'finalized').length || 0,
      voted: registrations?.filter(r => r.status === 'voted').length || 0,
      pending: registrations?.filter(r => r.status === 'registered').length || 0
    };

    // Get vote statistics
    const { data: votes } = await supabaseAdmin
      .from('votes')
      .select('*')
      .eq('election_id', electionId);

    const voteStats = {
      total_votes: votes?.length || 0,
      timestamp_range: {
        first: votes && votes.length > 0 ? votes[0].created_at : null,
        last: votes && votes.length > 0 ? votes[votes.length - 1].created_at : null
      }
    };

    // Get candidate results
    const { data: candidates } = await supabaseAdmin
      .from('candidates')
      .select('*')
      .eq('election_id', electionId);

    const candidateStats = candidates?.map(candidate => {
      const candidateVotes = votes?.filter(v => v.candidate_id === candidate.id).length || 0;
      const percentage = voteStats.total_votes > 0 ? (candidateVotes / voteStats.total_votes * 100) : 0;
      return {
        id: candidate.id,
        name: candidate.name,
        party: candidate.party,
        votes: candidateVotes,
        percentage: Math.round(percentage * 100) / 100
      };
    }) || [];

    // Sort by votes
    candidateStats.sort((a, b) => b.votes - a.votes);

    res.json({
      success: true,
      data: {
        election: {
          id: election.id,
          title: election.title,
          status: election.status,
          start_time: election.start_time,
          end_time: election.end_time
        },
        voter_statistics: voterStats,
        vote_statistics: voteStats,
        candidate_results: candidateStats,
        participation_rate: voterStats.total_registered > 0 
          ? Math.round((voterStats.voted / voterStats.total_registered) * 100)
          : 0
      }
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

/**
 * Get system-wide analytics
 */
export const getSystemAnalytics = async (req, res) => {
  try {
    // Total elections by status
    const { data: elections } = await supabaseAdmin
      .from('elections')
      .select('status, created_at');

    const electionStats = {
      total: elections?.length || 0,
      by_status: {
        draft: elections?.filter(e => e.status === 'draft').length || 0,
        published: elections?.filter(e => e.status === 'published').length || 0,
        active: elections?.filter(e => e.status === 'active').length || 0,
        completed: elections?.filter(e => e.status === 'completed').length || 0
      },
      created_this_month: elections?.filter(e => {
        const createdAt = new Date(e.created_at);
        const now = new Date();
        return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
      }).length || 0
    };

    // Total votes
    const { data: votes } = await supabaseAdmin
      .from('votes')
      .select('created_at');

    const voteStats = {
      total_votes: votes?.length || 0,
      votes_this_month: votes?.filter(v => {
        const createdAt = new Date(v.created_at);
        const now = new Date();
        return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
      }).length || 0
    };

    // User statistics
    const { data: users } = await supabaseAdmin
      .from('profiles')
      .select('role, created_at');

    const userStats = {
      total_users: users?.length || 0,
      by_role: {
        super_admin: users?.filter(u => u.role === 'super_admin').length || 0,
        election_creator: users?.filter(u => u.role === 'election_creator').length || 0,
        voter: users?.filter(u => u.role === 'voter').length || 0
      },
      new_users_this_month: users?.filter(u => {
        const createdAt = new Date(u.created_at);
        const now = new Date();
        return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
      }).length || 0
    };

    // Pending creator requests
    const { data: requests } = await supabaseAdmin
      .from('creator_requests')
      .select('status');

    const requestStats = {
      pending: requests?.filter(r => r.status === 'pending').length || 0,
      approved: requests?.filter(r => r.status === 'approved').length || 0,
      rejected: requests?.filter(r => r.status === 'rejected').length || 0
    };

    res.json({
      success: true,
      data: {
        elections: electionStats,
        votes: voteStats,
        users: userStats,
        creator_requests: requestStats,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Get system analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch system analytics' });
  }
};

/**
 * Get voting timeline for election
 */
export const getVotingTimeline = async (req, res) => {
  try {
    const { electionId } = req.params;
    const { period = 'hour' } = req.query; // hour, day, week

    const { data: votes } = await supabaseAdmin
      .from('votes')
      .select('created_at')
      .eq('election_id', electionId)
      .order('created_at', { ascending: true });

    if (!votes) {
      return res.json({ success: true, data: [] });
    }

    // Group votes by period
    const timeline = {};
    votes.forEach(vote => {
      const date = new Date(vote.created_at);
      let key;

      if (period === 'hour') {
        key = date.toISOString().substring(0, 13) + ':00:00';
      } else if (period === 'day') {
        key = date.toISOString().substring(0, 10);
      } else if (period === 'week') {
        const week = Math.floor((date.getDate() - date.getDay() + 6) / 7);
        key = `${date.getFullYear()}-W${week}`;
      }

      timeline[key] = (timeline[key] || 0) + 1;
    });

    const timelineArray = Object.entries(timeline).map(([timestamp, count]) => ({
      timestamp,
      votes: count
    }));

    res.json({
      success: true,
      data: timelineArray
    });

  } catch (error) {
    console.error('Get voting timeline error:', error);
    res.status(500).json({ error: 'Failed to fetch timeline' });
  }
};
