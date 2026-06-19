// src/pages/creator/MyElectionsPage.jsx
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function MyElectionsPage() {
  const navigate = useNavigate();

  const { data: elections = [], isLoading } = useQuery({
    queryKey: ['my-elections'],
    queryFn: async () => {
      const response = await api.get('/elections?creator_only=true');
      return response.data || [];
    }
  });

  const statusColor = {
    draft: 'bg-gray-500/30 text-gray-200',
    published: 'bg-yellow-500/30 text-yellow-200',
    active: 'bg-green-500/30 text-green-200',
    completed: 'bg-blue-500/30 text-blue-200'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">📊 My Elections</h1>
          <button
            onClick={() => navigate('/creator/create')}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
          >
            + New Election
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        )}

        {!isLoading && elections.length === 0 && (
          <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-400 mb-4">No elections created yet</p>
            <button
              onClick={() => navigate('/creator/create')}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Create First Election
            </button>
          </div>
        )}

        {!isLoading && elections.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {elections.map((election) => (
              <button 
                key={election.id} 
                onClick={() => navigate(`/creator/control/${election.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/creator/control/${election.id}`);
                  }
                }}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/50 transition cursor-pointer text-left"
              >
                {election.banner_url && (
                  <img
                    src={election.banner_url}
                    alt={election.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white flex-1">{election.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${statusColor[election.status]}`}>
                      {election.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {election.description}
                  </p>
                  <div className="text-xs text-gray-500">
                    Created: {new Date(election.created_at).toLocaleDateString()}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
