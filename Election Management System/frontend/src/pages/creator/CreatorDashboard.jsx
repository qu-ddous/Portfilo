// src/pages/creator/CreatorDashboard.jsx
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export default function CreatorDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuthStore();

  const { data: myElections, isLoading } = useQuery({
    queryKey: ['my-elections'],
    queryFn: async () => {
      const response = await api.get('/elections?creator_only=true');
      return response.data || [];
    }
  });

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-500/30 text-gray-200',
      published: 'bg-blue-500/30 text-blue-200',
      active: 'bg-green-500/30 text-green-200',
      completed: 'bg-purple-500/30 text-purple-200'
    };
    return colors[status] || colors.draft;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            🎯 Creator Dashboard
          </h1>
          <p className="text-gray-400">
            Welcome, {profile?.full_name || 'Creator'}
          </p>
        </div>
        <button
          onClick={() => navigate('/creator/create-election')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
        >
          + Create Election
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Total Elections',
            value: myElections?.length || 0,
            icon: '📊'
          },
          {
            label: 'Active Elections',
            value: myElections?.filter(e => e.status === 'active').length || 0,
            icon: '🟢'
          },
          {
            label: 'Draft Elections',
            value: myElections?.filter(e => e.status === 'draft').length || 0,
            icon: '📝'
          },
          {
            label: 'Completed Elections',
            value: myElections?.filter(e => e.status === 'completed').length || 0,
            icon: '✅'
          }
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white/5 border border-white/10 rounded-xl p-4"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* My Elections */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          📋 My Elections
        </h2>

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        )}

        {!isLoading && (!myElections || myElections.length === 0) && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🗳️</div>
            <p className="text-gray-400 mb-4">No elections created yet</p>
            <button
              onClick={() => navigate('/creator/create-election')}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Create Your First Election
            </button>
          </div>
        )}

        {!isLoading && myElections && myElections.length > 0 && (
          <div className="space-y-4">
            {myElections.map((election) => (
              <div
                key={election.id}
                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-white/20 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {election.title}
                      </h3>
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(election.status)}`}>
                        {election.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      {election.description}
                    </p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>📅 {new Date(election.start_time).toLocaleDateString()}</span>
                      <span>🗳️ {election.candidates_count || 0} candidates</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/creator/manage-candidates/${election.id}`)}
                      className="px-3 py-1.5 bg-blue-600/50 hover:bg-blue-600 text-white text-sm rounded transition"
                    >
                      Candidates
                    </button>
                    <button
                      onClick={() => navigate(`/creator/election-control/${election.id}`)}
                      className="px-3 py-1.5 bg-purple-600/50 hover:bg-purple-600 text-white text-sm rounded transition"
                    >
                      Control
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
