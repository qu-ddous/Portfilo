// src/pages/public/ElectionDetailPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export default function ElectionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data: election, isLoading, error } = useQuery({
    queryKey: ['election', id],
    queryFn: async () => {
      const response = await api.get(`/elections/${id}`);
      return response.data;
    }
  });

  const { data: candidates } = useQuery({
    queryKey: ['candidates', id],
    queryFn: async () => {
      const response = await api.get(`/elections/${id}/candidates`);
      return response.data || [];
    }
  });

  const { data: results } = useQuery({
    queryKey: ['results', id],
    queryFn: async () => {
      const response = await api.get(`/elections/${id}/results`);
      return response.data || {};
    },
    enabled: election?.status === 'completed' || election?.status === 'active'
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !election) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-white text-xl mb-4">Election not found</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const totalVotes = Object.values(results || {}).reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0);

  // Helper function to get status color
  const getStatusBadgeClass = () => {
    if (election.status === 'active') {
      return 'bg-green-500/30 text-green-200';
    }
    if (election.status === 'completed') {
      return 'bg-purple-500/30 text-purple-200';
    }
    return 'bg-blue-500/30 text-blue-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div className="flex-1">
          <button
            onClick={() => navigate('/')}
            className="text-blue-400 hover:text-blue-300 mb-4"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">
            {election.title}
          </h1>
          <p className="text-gray-400 mb-4">
            {election.description}
          </p>
          <div className="flex gap-4 flex-wrap">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadgeClass()}`}>
              {election.status.toUpperCase()}
            </span>
            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white/10 text-gray-200">
              {election.category}
            </span>
            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white/10 text-gray-200">
              {totalVotes} votes cast
            </span>
          </div>
        </div>
        {user && election.status === 'active' && (
          <button
            onClick={() => navigate(`/voter/cast-vote/${id}`)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Cast Your Vote
          </button>
        )}
      </div>

      {/* Banner */}
      {election.banner_url && (
        <div className="mb-8 rounded-xl overflow-hidden max-h-96">
          <img
            src={election.banner_url}
            alt={election.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Candidates */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          👤 Candidates ({candidates?.length || 0})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates?.map((candidate) => {
            const voteCount = results?.[candidate.id] || 0;
            const percentage = totalVotes > 0 ? (voteCount / totalVotes * 100) : 0;

            return (
              <div
                key={candidate.id}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition"
              >
                {candidate.photo_url && (
                  <img
                    src={candidate.photo_url}
                    alt={candidate.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-lg font-bold text-white">
                  {candidate.name}
                </h3>
                {candidate.designation && (
                  <p className="text-sm text-gray-400 mb-3">
                    {candidate.designation}
                  </p>
                )}
                {candidate.manifesto && (
                  <p className="text-sm text-gray-300 mb-4">
                    {candidate.manifesto}
                  </p>
                )}

                {/* Vote Count */}
                {(election.status === 'active' || election.status === 'completed') && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Votes</span>
                      <span className="text-white font-semibold">
                        {voteCount} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Election Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            📅 Schedule
          </h3>
          <div className="space-y-3 text-gray-400">
            <div>
              <div className="text-sm text-gray-500">Start Time</div>
              <div className="text-white font-medium">
                {new Date(election.start_time).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">End Time</div>
              <div className="text-white font-medium">
                {new Date(election.end_time).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            👨‍⚖️ Creator
          </h3>
          <div className="text-gray-400">
            <div className="text-sm text-gray-500 mb-1">Created by</div>
            <div className="text-white font-medium">
              {election.profiles?.full_name || 'Unknown'}
            </div>
            <div className="text-sm text-gray-500 mt-3 mb-1">Email</div>
            <div className="text-white font-medium">
              {election.profiles?.email || 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
