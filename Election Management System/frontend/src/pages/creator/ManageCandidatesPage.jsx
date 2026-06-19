// src/pages/creator/ManageCandidatesPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../../services/api';

export default function ManageCandidatesPage() {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    party: '',
    designation: '',
    manifesto: '',
    photo_url: ''
  });

  const { data: candidates, refetch, isLoading } = useQuery({
    queryKey: ['candidates', electionId],
    queryFn: async () => {
      const response = await api.get(`/elections/${electionId}/candidates`);
      return response.data || [];
    }
  });

  const { mutate: addCandidate, isPending: isAdding } = useMutation({
    mutationFn: () => api.post(`/elections/${electionId}/candidates`, newCandidate),
    onSuccess: () => {
      setNewCandidate({
        name: '',
        party: '',
        designation: '',
        manifesto: '',
        photo_url: ''
      });
      setShowAddForm(false);
      refetch();
    }
  });

  const { mutate: deleteCandidate } = useMutation({
    mutationFn: (candidateId) => api.delete(`/elections/${electionId}/candidates/${candidateId}`),
    onSuccess: () => refetch()
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            🗳️ Manage Candidates
          </h1>
          <button
            onClick={() => navigate('/creator/dashboard')}
            className="text-blue-400 hover:text-blue-300"
          >
            Back
          </button>
        </div>

        {/* Add Candidate Form */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="mb-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
          >
            + Add Candidate
          </button>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Add New Candidate</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Candidate Name"
                value={newCandidate.name}
                onChange={(e) => setNewCandidate(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500"
              />
              <input
                type="text"
                placeholder="Party/Organization"
                value={newCandidate.party}
                onChange={(e) => setNewCandidate(prev => ({
                  ...prev,
                  party: e.target.value
                }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500"
              />
              <input
                type="text"
                placeholder="Designation"
                value={newCandidate.designation}
                onChange={(e) => setNewCandidate(prev => ({
                  ...prev,
                  designation: e.target.value
                }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500"
              />
              <textarea
                placeholder="Campaign Manifesto"
                value={newCandidate.manifesto}
                onChange={(e) => setNewCandidate(prev => ({
                  ...prev,
                  manifesto: e.target.value
                }))}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500"
              />
              <input
                type="url"
                placeholder="Photo URL"
                value={newCandidate.photo_url}
                onChange={(e) => setNewCandidate(prev => ({
                  ...prev,
                  photo_url: e.target.value
                }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => addCandidate()}
                  disabled={isAdding}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
                >
                  {isAdding ? 'Adding...' : 'Add Candidate'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Candidates List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : !candidates || candidates.length === 0 ? (
          <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-gray-400">No candidates yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                {candidate.photo_url && (
                  <img
                    src={candidate.photo_url}
                    alt={candidate.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-lg font-bold text-white">{candidate.name}</h3>
                <p className="text-blue-400 text-sm">{candidate.party}</p>
                <p className="text-gray-400 text-sm">{candidate.designation}</p>
                {candidate.manifesto && (
                  <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                    {candidate.manifesto}
                  </p>
                )}
                <button
                  onClick={() => deleteCandidate(candidate.id)}
                  className="mt-4 w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
