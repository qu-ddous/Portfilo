// src/pages/admin/AuditLogsPage.jsx
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../../services/api';

export default function AuditLogsPage() {
  const [filters, setFilters] = useState({
    action: '',
    resource_type: ''
  });

  const { data: logs, isLoading } = useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: async () => {
      const response = await api.get('/admin/audit-logs', { params: filters });
      return response.data || [];
    }
  });

  const actions = [
    'register_for_election',
    'cast_vote',
    'create_election',
    'approve_creator_request',
    'reject_creator_request',
    'finalize_voters'
  ];

  const resourceTypes = [
    'user',
    'election',
    'vote',
    'creator_request',
    'voter_registration',
    'audit_log'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          📝 Audit Logs
        </h1>

        {/* Filters */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="actionFilter" className="block text-sm font-medium text-gray-300 mb-2">
                Action
              </label>
              <select
                id="actionFilter"
                value={filters.action}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  action: e.target.value
                }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">All Actions</option>
                {actions.map(action => (
                  <option key={action} value={action}>
                    {action.replaceAll('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-300 mb-2">
                Resource Type
              </label>
              <select
                id="typeFilter"
                value={filters.resource_type}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  resource_type: e.target.value
                }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">All Types</option>
                {resourceTypes.map(type => (
                  <option key={type} value={type}>
                    {type.replaceAll('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : !logs || logs.length === 0 ? (
          <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-gray-400">No logs found</p>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/10">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                      Resource
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/5 transition">
                      <td className="px-6 py-3 text-sm text-gray-300">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <div className="text-white">{log.user?.full_name}</div>
                        <div className="text-gray-500 text-xs">{log.user?.email}</div>
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <span className="px-2 py-1 rounded bg-blue-500/30 text-blue-200">
                          {log.action.replaceAll('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-400">
                        {log.resource_type} #{log.resource_id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
