import { useEffect, useState } from 'react';
import { 
  Users, 
  Dumbbell, 
  Utensils, 
  Activity,
  TrendingUp
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import api from '../utils/api';
import useSocket from '../hooks/useSocket';
import GlassCard from '../components/GlassCard';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('admin:workout-logged', (data) => {
      setRecentLogs((prev) => [data, ...prev].slice(0, 5));
    });

    socket.on('admin:meal-logged', (data) => {
      setRecentLogs((prev) => [data, ...prev].slice(0, 5));
    });
  }, [socket]);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data.dashboard);
      if (response.data.dashboard.recentLogs) {
        setRecentLogs(response.data.dashboard.recentLogs);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats');
    }
  };

  const chartData = stats?.charts?.userGrowth || [
    { name: 'Mon', value: 40, prev: 24 },
    { name: 'Tue', value: 30, prev: 13 },
    { name: 'Wed', value: 60, prev: 48 },
    { name: 'Thu', value: 80, prev: 39 },
    { name: 'Fri', value: 50, prev: 48 },
    { name: 'Sat', value: 90, prev: 38 },
    { name: 'Sun', value: 110, prev: 43 },
  ];

  const calorieData = stats?.charts?.calorieTrends || [
    { name: 'Mon', calories: 2100 },
    { name: 'Tue', calories: 1950 },
    { name: 'Wed', calories: 2300 },
    { name: 'Thu', calories: 2200 },
    { name: 'Fri', calories: 2500 },
    { name: 'Sat', calories: 2800 },
    { name: 'Sun', calories: 2400 },
  ];

  const statCards = [
    { 
      title: 'Total Users', 
      value: stats?.stats?.total_users || 12, 
      icon: Users, 
      color: 'text-blue-100', 
      bgGradient: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800',
      iconBg: 'bg-blue-400/30',
      shadow: 'shadow-[0_8px_30px_rgb(59,130,246,0.5)]'
    },
    { 
      title: 'Workouts Logged', 
      value: stats?.stats?.total_workouts_logged || 84, 
      icon: Dumbbell, 
      color: 'text-emerald-100', 
      bgGradient: 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-700',
      iconBg: 'bg-emerald-400/30',
      shadow: 'shadow-[0_8px_30px_rgb(16,185,129,0.5)]'
    },
    { 
      title: 'Meals Tracked', 
      value: stats?.stats?.total_meals_logged || 245, 
      icon: Utensils, 
      color: 'text-orange-100', 
      bgGradient: 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-700',
      iconBg: 'bg-orange-400/30',
      shadow: 'shadow-[0_8px_30px_rgb(249,115,22,0.5)]'
    },
    { 
      title: 'Active Today', 
      value: stats?.stats?.users_logged_today || 3, 
      icon: Activity, 
      color: 'text-purple-100', 
      bgGradient: 'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-800',
      iconBg: 'bg-purple-400/30',
      shadow: 'shadow-[0_8px_30px_rgb(168,85,247,0.5)]'
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 rounded-[30px] shadow-xl shadow-blue-500/20 border border-white/10 relative overflow-hidden group">
        {/* Animated Shine Mesh */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_white_0%,transparent_50%)] animate-[pulse_8s_infinite] scale-150 blur-3xl"></div>
        </div>
        <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_3s_infinite] skew-x-[-25deg]"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center text-white">
          <div>
            <h2 className="text-2xl font-black leading-tight drop-shadow-lg">Platform Overview</h2>
            <p className="text-white/60 font-bold text-[10px] uppercase tracking-widest mt-1">Real-time statistics & activity monitor</p>
          </div>
          <div className="mt-4 md:mt-0 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgb(52,211,153)]"></div>
            <span className="text-[9px] font-black uppercase tracking-widest leading-none">Live Metrics</span>
          </div>
        </div>
      </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => (
          <GlassCard key={idx} className={`p-5 flex items-center gap-4 border-white/20 relative overflow-hidden backdrop-blur-xl ${card.bgGradient} ${card.shadow} transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl`}>
            {/* Shiny decorative blob */}
            <div className="absolute -right-6 -top-6 w-20 h-20 bg-white opacity-10 rounded-full blur-2xl"></div>
            
            <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20 z-10 shadow-inner group-hover:animate-float`}>
              <card.icon className="text-white drop-shadow-md animate-glow animate-hue" size={22} />
            </div>
            <div className="z-10">
              <p className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${card.color} opacity-80`}>{card.title}</p>
              <h3 className="text-2xl font-black text-white drop-shadow-md">{card.value}</h3>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-6 border-slate-50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-800">User Growth</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Weekly engagement trends</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest ring-1 ring-emerald-500/10">
              <TrendingUp size={12} />
              <span>+12.5%</span>
            </div>
          </div>
          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
                />
                <Tooltip 
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', border: '1px solid #f1f5f9', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 700 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="prev" 
                  name="Previous Week"
                  stroke="#cbd5e1" 
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  fillOpacity={1} 
                  fill="url(#colorPrev)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  name="This Week"
                  stroke="#10b981" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex flex-col border-slate-50">
           <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
              <Activity size={18} className="text-indigo-600" /> Recent Activity
           </h3>
           <div className="space-y-4 flex-1 overflow-y-auto pr-2 max-h-[260px] custom-scrollbar">
              {recentLogs.length > 0 ? (
                recentLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors group">
                    <div className={`mt-1 w-2 h-2 rounded-full ring-2 animate-pulse ${log.type === 'meal' ? 'bg-orange-500 ring-orange-50' : 'bg-emerald-500 ring-emerald-50'}`}></div>
                    <div className="flex-1">
                      <p className="text-[11px] font-black text-slate-800">
                        {log.user_name} <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider ml-1">{log.type === 'meal' ? 'tracked meal' : 'logged workout'}</span>
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold mt-0.5 line-clamp-1 group-hover:text-indigo-600 transition-colors">{log.name || log.workout_name || log.meal_name}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400">
                  <p className="text-sm font-medium">No recent activity yet.</p>
                </div>
              )}
           </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6 border-slate-50 relative overflow-hidden">
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
            <Utensils size={18} className="text-orange-500" /> Platform Calorie Trends
          </h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calorieData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                {/* ... existing code ... */}
                <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                <Tooltip 
                  cursor={{fill: '#f8fafc', radius: 6}}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.98)', border: '1px solid #f1f5f9', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                  itemStyle={{ fontWeight: 800, fontSize: 12, color: '#ea580c' }}
                />
                <Bar dataKey="calories" fill="url(#barGradient)" radius={[6, 6, 6, 6]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
      </GlassCard>
    </div>
  );
};

export default Dashboard;
