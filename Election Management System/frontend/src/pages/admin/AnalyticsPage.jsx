// frontend/src/pages/admin/AnalyticsPage.jsx
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../../services/api';

export default function AnalyticsPage() {
  const [selectedElection, setSelectedElection] = useState(null);

  const { data: systemAnalytics, isLoading: systemLoading } = useQuery({
    queryKey: ['system-analytics'],
    queryFn: async () => {
      const response = await api.get('/analytics/system');
      return response.data;
    }
  });

  const { data: electionAnalytics, isLoading: electionLoading } = useQuery({
    queryKey: ['election-analytics', selectedElection],
    queryFn: async () => {
      if (!selectedElection) return null;
      const response = await api.get(`/analytics/election/${selectedElection}`);
      return response.data;
    },
    enabled: !!selectedElection
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">📊 Analytics Dashboard</h1>

        {/* System Statistics */}
        {systemLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : systemAnalytics ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="text-gray-400 text-sm">Total Users</div>
              <div className="text-3xl font-bold text-white">
                {systemAnalytics?.data?.users?.total_users || 0}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                This month: {systemAnalytics?.data?.users?.new_users_this_month || 0}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="text-gray-400 text-sm">Total Elections</div>
              <div className="text-3xl font-bold text-white">
                {systemAnalytics?.data?.elections?.total || 0}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Active: {systemAnalytics?.data?.elections?.by_status?.active || 0}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="text-gray-400 text-sm">Total Votes Cast</div>
              <div className="text-3xl font-bold text-white">
                {systemAnalytics?.data?.votes?.total_votes || 0}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                This month: {systemAnalytics?.data?.votes?.votes_this_month || 0}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="text-gray-400 text-sm">Election Creators</div>
              <div className="text-3xl font-bold text-white">
                {systemAnalytics?.data?.users?.by_role?.election_creator || 0}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Pending requests: {systemAnalytics?.data?.creator_requests?.pending || 0}
              </div>
            </div>
          </div>
        ) : null}

        {/* Election-Specific Analytics */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Election Details</h2>
          
          {electionLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
          ) : electionAnalytics ? (
            <div className="space-y-6">
              {/* Voter Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-4 rounded-lg">
                  <div className="text-gray-400 text-sm">Registered Voters</div>
                  <div className="text-2xl font-bold text-white">
                    {electionAnalytics?.data?.voter_statistics?.total_registered || 0}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-4 rounded-lg">
                  <div className="text-gray-400 text-sm">Votes Cast</div>
                  <div className="text-2xl font-bold text-white">
                    {electionAnalytics?.data?.vote_statistics?.total_votes || 0}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-4 rounded-lg">
                  <div className="text-gray-400 text-sm">Participation</div>
                  <div className="text-2xl font-bold text-white">
                    {electionAnalytics?.data?.participation_rate || 0}%
                  </div>
                </div>
                <div className="bg-gradient-to-br from-pink-500/20 to-red-500/20 p-4 rounded-lg">
                  <div className="text-gray-400 text-sm">Finalized</div>
                  <div className="text-2xl font-bold text-white">
                    {electionAnalytics?.data?.voter_statistics?.finalized || 0}
                  </div>
                </div>
              </div>

              {/* Candidate Results */}
              {electionAnalytics?.data?.candidate_results && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Results by Candidate</h3>
                  <div className="space-y-3">
                    {electionAnalytics.data.candidate_results.map((candidate) => (
                      <div key={candidate.id}>
                        <div className="flex justify-between mb-2">
                          <span className="text-white font-semibold">{candidate.name}</span>
                          <span className="text-gray-400">{candidate.votes} votes ({candidate.percentage}%)</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                            style={{ width: `${candidate.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400">Select an election to view detailed analytics</p>
          )}
        </div>
      </div>
    </div>
  );
}
