// src/pages/public/LandingPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch elections
  const { data: electionsData, isLoading, error } = useQuery({
    queryKey: ['elections', statusFilter],
    queryFn: async () => {
      const status = statusFilter === 'all' ? '' : statusFilter;
      const result = await api.get('/elections', {
        params: { status, limit: 50 }
      });
      return result.data || [];
    }
  });

  const elections = Array.isArray(electionsData) ? electionsData : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-white/5 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            🗳️ VoteSecure
          </div>
          <div className="flex gap-4">
            {user ? (
              <button
                onClick={() => navigate(`/${user.role}/dashboard`)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-2 text-white hover:bg-white/10 rounded-lg transition"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Transparent Elections,<br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Powered by Technology
          </span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Secure, anonymous, and transparent online voting system. Join the digital revolution in electoral processes.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setStatusFilter('active')}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            Browse Active Elections
          </button>
          {!user && (
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 border-2 border-white text-white hover:bg-white/10 rounded-lg font-semibold transition"
            >
              Get Started
            </button>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white/5 border-y border-white/10 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">{elections.length}</div>
            <div className="text-gray-400">Total Elections</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">
              {elections.filter(e => e.status === 'active').length}
            </div>
            <div className="text-gray-400">Active Now</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">100%</div>
            <div className="text-gray-400">Anonymous</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">Secure</div>
            <div className="text-gray-400">End-to-End</div>
          </div>
        </div>
      </section>

      {/* Elections Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Elections</h2>
          <div className="flex gap-2 flex-wrap">
            {['all', 'published', 'active', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg transition ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-400">
            Failed to load elections
          </div>
        ) : elections.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No elections found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {elections.map((election) => (
              <div
                key={election.id}
                onClick={() => navigate(`/election/${election.id}`)}
                className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/20 transition cursor-pointer group"
              >
                {election.banner_url && (
                  <img
                    src={election.banner_url}
                    alt={election.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-500/30 text-blue-200">
                    {election.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    election.status === 'active'
                      ? 'bg-green-500/30 text-green-200'
                      : election.status === 'completed'
                      ? 'bg-gray-500/30 text-gray-200'
                      : 'bg-blue-500/30 text-blue-200'
                  }`}>
                    {election.status.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition">
                  {election.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {election.description}
                </p>
                <div className="pt-4 border-t border-white/10 text-sm text-gray-400">
                  <div>
                    Creator: {election.profiles?.full_name || 'Unknown'}
                  </div>
                  <div className="mt-2">
                    Start: {new Date(election.start_time).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-white/5 border-t border-white/10 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why VoteSecure?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🔐',
                title: 'Completely Anonymous',
                description: 'Your vote is disconnected from your identity. No one can know who you voted for.'
              },
              {
                icon: '✅',
                title: 'Transparent & Verifiable',
                description: 'Results are publicly visible and cryptographically verifiable by anyone.'
              },
              {
                icon: '⚡',
                title: 'Instant Results',
                description: 'See live results as votes are cast. Results update in real-time.'
              },
              {
                icon: '🛡️',
                title: 'Military-Grade Security',
                description: 'Enterprise-level encryption and security protocols protect all data.'
              },
              {
                icon: '🌍',
                title: 'Accessible Everywhere',
                description: 'Vote from anywhere, anytime. Responsive design works on all devices.'
              },
              {
                icon: '📊',
                title: 'Detailed Analytics',
                description: 'Comprehensive election analytics and audit logs for transparency.'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/5 border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>🗳️ VoteSecure - Secure Online Election Management System</p>
          <p className="text-sm mt-2">© 2026 - Built for transparent elections</p>
        </div>
      </footer>
    </div>
  );
}
