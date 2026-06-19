// src/pages/voter/VoteConfirmationPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

export default function VoteConfirmationPage() {
  const { electionId } = useParams();
  const navigate = useNavigate();

  const { data: election } = useQuery({
    queryKey: ['election', electionId],
    queryFn: async () => {
      const response = await api.get(`/elections/${electionId}`);
      return response.data;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        {/* Success Animation */}
        <div className="mb-8">
          <div className="inline-block text-8xl mb-4 animate-bounce">
            ✅
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Vote Confirmed!
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Your vote has been successfully recorded
          </p>
        </div>

        {/* Confirmation Card */}
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-xl p-8 mb-8">
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🗳️</span>
              <div>
                <div className="text-sm text-gray-400">Election</div>
                <div className="font-semibold text-white">
                  {election?.title || 'Election'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔐</span>
              <div>
                <div className="text-sm text-gray-400">Vote Status</div>
                <div className="font-semibold text-green-200">
                  Anonymously Recorded
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">⏰</span>
              <div>
                <div className="text-sm text-gray-400">Timestamp</div>
                <div className="font-semibold text-white">
                  {new Date().toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">
            Important Information
          </h2>
          <div className="space-y-3 text-left text-sm text-gray-400">
            <p>
              ✓ Your vote has been recorded with a unique token that prevents duplicate voting
            </p>
            <p>
              ✓ Your identity has NOT been stored with your vote - it is completely anonymous
            </p>
            <p>
              ✓ You cannot change your vote once it has been submitted
            </p>
            <p>
              ✓ The election results will be visible after the election ends
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/voter/dashboard')}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate(`/election/${electionId}`)}
            className="flex-1 px-6 py-3 border border-white/10 hover:bg-white/5 text-white font-semibold rounded-lg transition"
          >
            View Results
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-600 mt-8">
          🗳️ Your vote is secure and anonymous. Thank you for participating in the democratic process!
        </p>
      </div>
    </div>
  );
}
