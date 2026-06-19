// src/pages/voter/VoterDashboard.jsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export default function VoterDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: myPolls, isLoading } = useQuery({
    queryKey: ['my-polls', statusFilter],
    queryFn: async () => {
      const response = await api.get('/elections', {
        params: {
          status: statusFilter === 'all' ? '' : statusFilter,
          limit: 50
        }
      });
      return response.data || [];
    }
  });

  const { data: votedElections } = useQuery({
    queryKey: ['voted-elections'],
    queryFn: async () => {
      // This will be fetched from voter-specific endpoint
      return [];
    }
  });

  const getStatusColor = (status) => {
    const colors = {
      published: 'bg-blue-500/30 text-blue-200',
      active: 'bg-green-500/30 text-green-200',
      completed: 'bg-purple-500/30 text-purple-200'
    };
    return colors[status] || colors.published;
  };

  const elections = Array.isArray(myPolls) ? myPolls.filter(e => e.status !== 'draft') : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          🗳️ Voter Dashboard
        </h1>
        <p className="text-gray-400">
          Welcome, {profile?.full_name || 'Voter'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-2xl mb-2">📊</div>
          <div className="text-sm text-gray-400">Available Elections</div>
          <div className="text-2xl font-bold text-white">
            {elections.filter(e => e.status === 'active').length}
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-2xl mb-2">✅</div>
          <div className="text-sm text-gray-400">Elections Voted</div>
          <div className="text-2xl font-bold text-white">
            {votedElections?.length || 0}
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-2xl mb-2">👁️</div>
          <div className="text-sm text-gray-400">Can Still Vote</div>
          <div className="text-2xl font-bold text-white">
            {elections.filter(e => e.status === 'active').length - (votedElections?.length || 0)}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {['all', 'active', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg transition ${
              statusFilter === status
                ? 'bg-blue-600 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            {status === 'all' ? 'All Elections' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Elections List */}
      <div className="space-y-4">
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        )}

        {!isLoading && (!elections || elections.length === 0) && (
          <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-400">No elections available</p>
          </div>
        )}

        {!isLoading && elections && elections.length > 0 && (
          elections.map((election) => {
            const hasVoted = votedElections?.includes(election.id);
            const isActive = election.status === 'active';

            return (
              <div
                key={election.id}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">
                        {election.title}
                      </h3>
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(election.status)}`}>
                        {election.status.toUpperCase()}
                      </span>
                      {hasVoted && (
                        <span className="text-xs px-3 py-1 rounded-full bg-green-500/30 text-green-200 font-semibold">
                          ✅ VOTED
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 mb-3">
                      {election.description}
                    </p>
                    <div className="flex gap-6 text-sm text-gray-500">
                      <span>🏛️ {election.category || 'General'}</span>
                      <span>👤 {election.candidates_count || 0} candidates</span>
                      <span>👨‍⚖️ {election.profiles?.full_name || 'Unknown'}</span>
                    </div>
                  </div>
                  <div>
                    {hasVoted && (
                      <button
                        onClick={() => navigate(`/election/${election.id}`)}
                        className="px-6 py-2.5 bg-gray-600/50 text-white font-semibold rounded-lg transition"
                        disabled
                      >
                        Already Voted
                      </button>
                    )}
                    {!hasVoted && isActive && (
                      <button
                        onClick={() => navigate(`/voter/cast-vote/${election.id}`)}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                      >
                        Cast Vote
                      </button>
                    )}
                    {!hasVoted && !isActive && (
                      <button
                        onClick={() => navigate(`/election/${election.id}`)}
                        className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg transition"
                      >
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Help Section */}
      <div className="mt-12 bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">
          ❓ How Voting Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-2xl mb-2">1️⃣</div>
            <div className="font-semibold text-white mb-1">Register</div>
            <p className="text-sm text-gray-400">Join an election and receive your unique secret ID</p>
          </div>
          <div>
            <div className="text-2xl mb-2">2️⃣</div>
            <div className="font-semibold text-white mb-1">Vote Anonymously</div>
            <p className="text-sm text-gray-400">Cast your vote securely with complete anonymity</p>
          </div>
          <div>
            <div className="text-2xl mb-2">3️⃣</div>
            <div className="font-semibold text-white mb-1">See Results</div>
            <p className="text-sm text-gray-400">View live results as voting concludes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
