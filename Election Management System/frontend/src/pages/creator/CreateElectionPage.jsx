// src/pages/creator/CreateElectionPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../../services/api';

export default function CreateElectionPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    start_time: '',
    end_time: '',
    banner_url: '',
    max_voters: ''
  });
  const [error, setError] = useState('');

  const { mutate: createElection, isPending } = useMutation({
    mutationFn: async () => {
      if (!formData.title || !formData.start_time || !formData.end_time) {
        throw new Error('Title and dates are required');
      }
      const response = await api.post('/elections', formData);
      return response.data;
    },
    onSuccess: (data) => {
      navigate(`/creator/manage-candidates/${data.id}`);
    },
    onError: (err) => {
      setError(err.response?.data?.error || 'Failed to create election');
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/creator/dashboard')}
          className="text-blue-400 hover:text-blue-300 mb-6"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold text-white mb-8">
          🎯 Create New Election
        </h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError('');
            createElection();
          }}
          className="bg-white/5 border border-white/10 rounded-xl p-8 space-y-6"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Election Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Presidential Elections 2026"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe this election..."
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition"
            >
              <option value="General">General</option>
              <option value="Presidential">Presidential</option>
              <option value="Municipal">Municipal</option>
              <option value="Board">Board</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Time *
              </label>
              <input
                type="datetime-local"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition"
                required
              />
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Time *
              </label>
              <input
                type="datetime-local"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition"
                required
              />
            </div>
          </div>

          {/* Banner URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Banner Image URL
            </label>
            <input
              type="url"
              name="banner_url"
              value={formData.banner_url}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Max Voters */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Maximum Voters (optional)
            </label>
            <input
              type="number"
              name="max_voters"
              value={formData.max_voters}
              onChange={handleChange}
              placeholder="Leave empty for unlimited"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/creator/dashboard')}
              className="flex-1 px-6 py-3 border border-white/10 hover:bg-white/5 text-white font-semibold rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition"
            >
              {isPending ? 'Creating...' : 'Create Election'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
