// src/pages/auth/ForgotPasswordPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${globalThis.location.origin}/reset-password`
      });

      if (resetError) {
        setError(resetError.message);
        setLoading(false);
        return;
      }

      setSuccess('Password reset link sent to your email. Check your inbox!');
      setEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            🗳️ VoteSecure
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Reset Your Password
          </p>

          <form onSubmit={handleResetPassword} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            <div>
              <label htmlFor="emailReset" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="emailReset"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Enter the email address associated with your account
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition mt-6"
            >
              {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            <button
              onClick={() => navigate('/login')}
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
