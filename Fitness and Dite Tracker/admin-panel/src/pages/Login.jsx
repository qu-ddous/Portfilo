import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Dumbbell, Mail, Lock, Loader2, ShieldCheck } from 'lucide-react';
import api from '../utils/api';
import useAuthStore from '../store/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  // Agar pehle se logged in hai toh dashboard pe redirect karo
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, tokens } = response.data;

      if (user.role !== 'admin') {
        setError('Only administrators can access this panel.');
        return;
      }

      setAuth(user, tokens.accessToken);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center p-6">
      {/* Background decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="w-full max-w-md relative">
        {/* Logo & Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl shadow-2xl shadow-emerald-500/30 mb-5">
            <Dumbbell className="text-white" size={36} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 font-medium">Sign in to access the admin panel.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-200/60 p-8 space-y-6">

          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-2xl text-sm font-medium">
              <ShieldCheck size={18} className="shrink-0 text-red-500" />
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-12"
                  placeholder="admin@fitness.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-12"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
            className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-base"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Signing In...
              </>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </div>

        <p className="text-center text-slate-400 text-xs mt-8 font-medium">
          &copy; 2026 FitAdmin Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
