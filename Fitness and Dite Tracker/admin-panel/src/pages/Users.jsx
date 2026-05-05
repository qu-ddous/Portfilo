import { useEffect, useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Eye,
  Users as UsersIcon,
  TrendingDown,
  Target,
  ArrowRight,
  UserCheck,
  Star,
  Activity,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import GlassCard from '../components/GlassCard';
import EmptyState from '../components/EmptyState';

const userGradients = [
  'from-blue-600 via-indigo-500 to-purple-600',
  'from-emerald-600 via-teal-500 to-cyan-600',
  'from-rose-600 via-pink-500 to-orange-600',
  'from-amber-500 via-orange-600 to-red-600',
  'from-fuchsia-600 via-purple-600 to-indigo-700',
  'from-cyan-500 via-blue-600 to-indigo-700',
  'from-teal-600 via-emerald-600 to-lime-600',
  'from-violet-600 via-purple-600 to-fuchsia-600',
];

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ total: 0, active: 0, new: 0 });
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.users || []);
      setStats({
        total: response.data.pagination?.total || response.data.users.length,
        active: response.data.users.filter(u => u.status === 'active').length,
        new: response.data.users.filter(u => new Date(u.signup_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
      });
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-in pb-20">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 rounded-[30px] shadow-xl shadow-blue-500/20 border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_3s_infinite] skew-x-[-25deg]"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-inner">
             <UserCheck size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white leading-tight drop-shadow-lg">Athletes Directory</h2>
            <p className="text-white/60 font-bold text-[10px] uppercase tracking-widest">Platform membership & performance</p>
          </div>
        </div>
        <div className="w-full md:w-80 relative z-10">
           <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search athletes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-sm font-black text-white placeholder-white/30 focus:bg-white/20 focus:border-white/30 outline-none transition-all"
              />
           </div>
        </div>
      </div>

      {/* ── High-Shine Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Athletes', val: stats.total, icon: UsersIcon, grad: 'from-blue-600 to-indigo-700', shadow: 'shadow-blue-200' },
          { label: 'Active Sessions', val: stats.active, icon: Activity, grad: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-200' },
          { label: 'New Members', val: stats.new, icon: Zap, grad: 'from-purple-600 to-fuchsia-700', shadow: 'shadow-purple-200' },
          { label: 'Avg Progress', val: '78%', icon: TrendingUp, grad: 'from-rose-500 to-orange-600', shadow: 'shadow-rose-200' },
        ].map((stat, i) => (
          <div key={i} className={`relative overflow-hidden p-6 rounded-[30px] bg-gradient-to-br ${stat.grad} text-white shadow-xl transition-all hover:-translate-y-1 group`}>
             <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-1000 skew-x-[-25deg]"></div>
             <div className="flex items-center justify-between relative z-10">
                <div>
                   <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 mb-1">{stat.label}</p>
                   <h3 className="text-2xl font-black">{stat.val}</h3>
                </div>
                <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center border border-white/20 backdrop-blur-md">
                   <stat.icon size={20} />
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* ── User Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-96 shimmer rounded-[60px]" />)
        ) : filtered.length === 0 ? (
          <div className="col-span-full"><EmptyState message="No results matched" submessage="Expand your scope or check for typos." /></div>
        ) : filtered.map((user, idx) => {
          const grad = userGradients[idx % userGradients.length];
          const progress = user.current_weight_kg && user.target_weight_kg
            ? Math.round((user.target_weight_kg / user.current_weight_kg) * 100)
            : 0;

          return (
            <div 
              key={user.id} 
              style={{animationDelay: `${idx * 100}ms`}}
              className={`group relative rounded-[35px] p-8 overflow-hidden bg-gradient-to-br ${grad} shadow-xl transition-all duration-700 hover:-translate-y-2 hover:scale-[1.02] animate-in flex flex-col`}
            >
              <div className="absolute top-0 left-[-150%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:left-[100%] transition-all duration-1200 skew-x-[-30deg]"></div>
              
              <div className="relative z-10 flex flex-col h-full text-white">
                <div className="flex justify-between items-start mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-2xl rounded-2xl flex items-center justify-center font-black text-2xl border border-white/30 shadow-2xl group-hover:rotate-6 transition-transform">
                      {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-md rounded-full px-3 py-1 shadow-xl">
                    <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">{user.status}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-xl font-black mb-1 line-clamp-1">{user.name}</h4>
                  <p className="text-white/60 font-bold text-xs truncate uppercase tracking-tighter">{user.email}</p>
                </div>
 
                <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="bg-white/10 backdrop-blur-2xl border border-white/5 rounded-2xl p-4">
                      <Target size={14} className="text-white/40 mb-2" />
                      <p className="text-[8px] font-black uppercase tracking-widest text-white/50 mb-0.5">Target</p>
                      <p className="font-black text-[11px] capitalize truncate">{user.fitness_goal?.replace(/_/g, ' ') || 'Consistency'}</p>
                   </div>
                   <div className="bg-white/10 backdrop-blur-2xl border border-white/5 rounded-2xl p-4">
                      <TrendingDown size={14} className="text-white/40 mb-2" />
                      <p className="text-[8px] font-black uppercase tracking-widest text-white/50 mb-0.5">Stats</p>
                      <p className="font-black text-[11px]">{user.current_weight_kg || '0'}kg → {user.target_weight_kg || '0'}kg</p>
                   </div>
                </div>

                <div className="mb-10">
                   <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Completion</span>
                      <span className="text-sm font-black">{progress}%</span>
                   </div>
                   <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)] rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, Math.max(10, progress))}%` }} />
                   </div>
                </div>

                <div className="mt-auto">
                   <button onClick={() => navigate(`/users/${user.id}`)} className="w-full bg-white text-slate-900 py-4 rounded-xl font-black flex items-center justify-center gap-2 shadow-xl hover:bg-slate-900 hover:text-white transition-all uppercase tracking-widest text-[10px] active:scale-95 group/btn">
                     Inspect Profile <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                   </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Users;
