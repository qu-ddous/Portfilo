// src/pages/admin/ApprovalQueuePage.jsx
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import { useState } from 'react';

export default function ApprovalQueuePage() {
  const [rejectionReason, setRejectionReason] = useState({});
  const [showRejectionForm, setShowRejectionForm] = useState({});

  const { data: requests, isLoading, refetch } = useQuery({
    queryKey: ['creator-requests'],
    queryFn: async () => {
      const response = await api.get('/admin/creator-requests?status=pending');
      return response.data || [];
    }
  });

  const { mutate: approve } = useMutation({
    mutationFn: (requestId) => api.patch(`/admin/creator-requests/${requestId}/approve`),
    onSuccess: () => refetch()
  });

  const { mutate: reject } = useMutation({
    mutationFn: (requestId) => 
      api.patch(`/admin/creator-requests/${requestId}/reject`, {
        reason: rejectionReason[requestId]
      }),
    onSuccess: () => {
      refetch();
      setShowRejectionForm({});
      setRejectionReason({});
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          📋 Creator Approval Queue
        </h1>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : !requests || requests.length === 0 ? (
          <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-gray-400">No pending requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {req.profiles?.full_name}
                    </h3>
                    <p className="text-gray-400">{req.profiles?.email}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/30 text-yellow-200">
                    PENDING
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <div className="text-sm text-gray-500">Organization</div>
                    <div className="text-white">{req.organization}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Reason</div>
                    <div className="text-white">{req.reason}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Requested</div>
                    <div className="text-white">
                      {new Date(req.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>

                {showRejectionForm[req.id] ? (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
                    <textarea
                      value={rejectionReason[req.id] || ''}
                      onChange={(e) =>
                        setRejectionReason(prev => ({
                          ...prev,
                          [req.id]: e.target.value
                        }))
                      }
                      placeholder="Provide rejection reason..."
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500 text-sm"
                      rows={3}
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => setShowRejectionForm(prev => ({
                          ...prev,
                          [req.id]: false
                        }))}
                        className="flex-1 px-3 py-1.5 text-sm rounded bg-white/10 text-white hover:bg-white/20"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => reject(req.id)}
                        className="flex-1 px-3 py-1.5 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ) : null}

                <div className="flex gap-2">
                  <button
                    onClick={() => approve(req.id)}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => setShowRejectionForm(prev => ({
                      ...prev,
                      [req.id]: !prev[req.id]
                    }))}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                  >
                    ✗ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
