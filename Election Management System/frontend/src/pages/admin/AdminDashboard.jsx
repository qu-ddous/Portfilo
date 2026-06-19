// src/pages/admin/AdminDashboard.jsx
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export default function AdminDashboard() {
  const { profile } = useAuthStore();

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const electionsRes = await api.get('/elections?limit=1000');
      const elections = electionsRes.data || [];
      
      return {
        totalElections: elections.length,
        activeElections: elections.filter(e => e.status === 'active').length,
        completedElections: elections.filter(e => e.status === 'completed').length,
        totalCandidates: elections.reduce((sum, e) => sum + (e.candidates_count || 0), 0),
        pendingRequests: 0 // Will be fetched from admin endpoint
      };
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          🛡️ Admin Dashboard
        </h1>
        <p className="text-gray-400">
          Welcome, {profile?.full_name || 'Administrator'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total Elections', value: stats?.totalElections || 0, icon: '📊', color: 'blue' },
          { label: 'Active Elections', value: stats?.activeElections || 0, icon: '🟢', color: 'green' },
          { label: 'Completed', value: stats?.completedElections || 0, icon: '✅', color: 'purple' },
          { label: 'Total Candidates', value: stats?.totalCandidates || 0, icon: '👤', color: 'orange' },
          { label: 'Pending Requests', value: stats?.pendingRequests || 0, icon: '⏳', color: 'yellow' }
        ].map((stat) => (
          <div
            key={stat.label}
            className={`bg-gradient-to-br from-${stat.color}-500/20 to-${stat.color}-600/10 border border-white/10 rounded-xl p-6`}
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            🔐 Creator Requests
          </h2>
          <p className="text-gray-400 mb-4">
            Review and approve creator account requests
          </p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition">
            View Requests
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            📋 Audit Logs
          </h2>
          <p className="text-gray-400 mb-4">
            View complete audit trail of all system actions
          </p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition">
            View Audit Logs
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            👥 User Management
          </h2>
          <p className="text-gray-400 mb-4">
            View all users and their roles in the system
          </p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition">
            Manage Users
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            📊 Analytics
          </h2>
          <p className="text-gray-400 mb-4">
            View system analytics and statistics
          </p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition">
            View Analytics
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          📝 Recent Activity
        </h2>
        <div className="space-y-3">
          {[
            { id: 'activity-1', action: 'Election Started', election: 'Presidential Elections 2026', time: '2 hours ago' },
            { id: 'activity-2', action: 'Creator Approved', election: 'John Doe', time: '4 hours ago' },
            { id: 'activity-3', action: 'Election Published', election: 'City Council Elections', time: '1 day ago' },
            { id: 'activity-4', action: 'Creator Request', election: 'Jane Smith', time: '2 days ago' },
          ].map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-b-0">
              <div>
                <div className="text-white font-medium">{activity.action}</div>
                <div className="text-sm text-gray-500">{activity.election}</div>
              </div>
              <div className="text-sm text-gray-400">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
