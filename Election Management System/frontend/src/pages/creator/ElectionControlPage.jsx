// src/pages/creator/ElectionControlPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../services/api';

export default function ElectionControlPage() {
  const { electionId } = useParams();
  const navigate = useNavigate();

  const { data: election, refetch, isLoading } = useQuery({
    queryKey: ['election', electionId],
    queryFn: async () => {
      const response = await api.get(`/elections/${electionId}`);
      return response.data;
    }
  });

  const { data: results } = useQuery({
    queryKey: ['election-results', electionId],
    queryFn: async () => {
      const response = await api.get(`/elections/${electionId}/results`);
      return response.data || {};
    }
  });

  const { mutate: publish } = useMutation({
    mutationFn: () => api.patch(`/elections/${electionId}/publish`),
    onSuccess: () => refetch()
  });

  const { mutate: start } = useMutation({
    mutationFn: () => api.patch(`/elections/${electionId}/start`),
    onSuccess: () => refetch()
  });

  const { mutate: stop } = useMutation({
    mutationFn: () => api.patch(`/elections/${electionId}/stop`),
    onSuccess: () => refetch()
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const statusColor = {
    draft: 'bg-gray-500/30 text-gray-200',
    published: 'bg-yellow-500/30 text-yellow-200',
    active: 'bg-green-500/30 text-green-200',
    completed: 'bg-blue-500/30 text-blue-200'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/creator/dashboard')}
          className="text-blue-400 hover:text-blue-300 mb-6"
        >
          ← Back
        </button>

        {/* Election Info */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold text-white">{election?.title}</h1>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColor[election?.status] || 'bg-gray-500/30'}`}>
              {election?.status?.toUpperCase()}
            </span>
          </div>
          <p className="text-gray-400 mb-6">{election?.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-500">Start Time</div>
              <div className="text-white">
                {new Date(election?.start_time).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">End Time</div>
              <div className="text-white">
                {new Date(election?.end_time).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Candidates</div>
              <div className="text-white text-lg font-bold">
                {results?.total_candidates || 0}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Votes Cast</div>
              <div className="text-white text-lg font-bold">
                {results?.total_votes || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Election Controls</h2>
          <div className="flex flex-wrap gap-3">
            {election?.status === 'draft' && (
              <button
                onClick={() => publish()}
                className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition"
              >
                📢 Publish Election
              </button>
            )}
            {election?.status === 'published' && (
              <button
                onClick={() => start()}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
              >
                ▶️ Start Voting
              </button>
            )}
            {election?.status === 'active' && (
              <button
                onClick={() => stop()}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
              >
                ⏹️ Stop Voting
              </button>
            )}
            <button
              onClick={() => navigate(`/election/${electionId}`)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              👁️ View Public Page
            </button>
          </div>
        </div>

        {/* Results Preview */}
        {results?.candidates && results.candidates.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-8">
            <h2 className="text-xl font-bold text-white mb-4">📊 Current Results</h2>
            <div className="space-y-4">
              {results.candidates.map((candidate) => (
                <div key={candidate.id}>
                  <div className="flex justify-between mb-2">
                    <span className="text-white font-semibold">{candidate.name}</span>
                    <span className="text-gray-400">{candidate.vote_count} votes</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${results.total_votes > 0 ? (candidate.vote_count / results.total_votes) * 100 : 0}%`
                      }}
                    />
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {results.total_votes > 0 ? Math.round((candidate.vote_count / results.total_votes) * 100) : 0}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
