// src/pages/voter/CastVotePage.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../services/api';

export default function CastVotePage() {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [secretId, setSecretId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { data: election, isLoading: electionLoading } = useQuery({
    queryKey: ['election', electionId],
    queryFn: async () => {
      const response = await api.get(`/elections/${electionId}`);
      return response.data;
    }
  });

  const { data: candidates, isLoading: candidatesLoading } = useQuery({
    queryKey: ['candidates', electionId],
    queryFn: async () => {
      const response = await api.get(`/elections/${electionId}/candidates`);
      return response.data || [];
    }
  });

  const { mutate: castVote, isPending } = useMutation({
    mutationFn: async () => {
      if (!selectedCandidateId) {
        throw new Error('Please select a candidate');
      }
      if (!secretId.trim()) {
        throw new Error('Please enter your secret ID');
      }

      const response = await api.post('/votes/cast', {
        election_id: electionId,
        candidate_id: selectedCandidateId,
        secret_id: secretId
      });
      return response.data;
    },
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => {
        navigate(`/voter/vote-confirmation/${electionId}`);
      }, 2000);
    },
    onError: (err) => {
      setError(err.response?.data?.error || err.message || 'Failed to cast vote');
    }
  });

  if (electionLoading || candidatesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">Election not found</p>
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

  if (election.status !== 'active') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏰</div>
          <p className="text-white mb-4">This election is not active</p>
          <button
            onClick={() => navigate(`/election/${electionId}`)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            View Election Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            🗳️ Cast Your Vote
          </h1>
          <p className="text-gray-400">
            {election.title}
          </p>
        </div>

        {success ? (
          <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Vote Submitted Successfully!
            </h2>
            <p className="text-gray-300 mb-4">
              Your vote has been recorded anonymously and cannot be traced back to you.
            </p>
            <p className="text-sm text-gray-400">
              Redirecting to confirmation page...
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setError('');
              castVote();
            }}
            className="space-y-6"
          >
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-lg">
                {error}
              </div>
            )}

            {/* Candidate Selection */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Select Your Candidate
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {candidates?.map((candidate) => (
                  <button
                    key={candidate.id}
                    onClick={() => setSelectedCandidateId(candidate.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setSelectedCandidateId(candidate.id);
                      }
                    }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition text-left ${
                      selectedCandidateId === candidate.id
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    {candidate.photo_url && (
                      <img
                        src={candidate.photo_url}
                        alt={candidate.name}
                        className="w-full h-32 object-cover rounded mb-3"
                      />
                    )}
                    <h3 className="font-bold text-white mb-1">
                      {candidate.name}
                    </h3>
                    {candidate.designation && (
                      <p className="text-sm text-gray-400 mb-2">
                        {candidate.designation}
                      </p>
                    )}
                    {candidate.manifesto && (
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {candidate.manifesto}
                      </p>
                    )}
                    {selectedCandidateId === candidate.id && (
                      <div className="mt-3 text-blue-400 font-semibold">
                        ✓ Selected
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Secret ID Input */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Enter Your Secret ID
              </h2>
              <p className="text-gray-400 mb-4 text-sm">
                You should have received your unique secret ID via email. This ID ensures your vote is recorded anonymously.
              </p>
              <input
                type="text"
                value={secretId}
                onChange={(e) => setSecretId(e.target.value.toUpperCase())}
                placeholder="e.g., ELEC-0001"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-center text-lg tracking-widest font-mono"
              />
              <p className="text-xs text-gray-500 mt-2">
                This ID will not be stored with your vote
              </p>
            </div>

            {/* Confirmation */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="text-2xl">🔐</div>
                <div>
                  <h3 className="font-bold text-white mb-1">
                    Your Vote is Completely Anonymous
                  </h3>
                  <p className="text-sm text-gray-400">
                    Once you submit this form, your vote will be recorded with only the candidate ID. Your identity will not be stored with your vote.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(`/election/${electionId}`)}
                className="flex-1 px-6 py-3 border border-white/10 hover:bg-white/5 text-white font-semibold rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedCandidateId || !secretId.trim() || isPending}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition"
              >
                {isPending ? 'Submitting Vote...' : 'Submit Vote'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
