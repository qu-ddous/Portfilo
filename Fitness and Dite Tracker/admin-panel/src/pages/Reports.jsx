import { useEffect, useState } from 'react';
import {
  TrendingUp,
  Users as UsersIcon,
  Dumbbell,
  Utensils,
  Download,
  Clock,
  Target,
  Activity,
  PieChart as PieIcon,
  Zap,
  Sparkles,
  Loader2
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import api from '../utils/api';
import GlassCard from '../components/GlassCard';

const tooltipStyle = {
  backgroundColor: 'rgba(255,255,255,0.97)',
  border: '1px solid #f1f5f9',
  borderRadius: '20px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  fontSize: '12px',
  fontWeight: 700,
};

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setData(response.data.dashboard);
      } catch (err) {
        console.error('Error fetching report data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-emerald-500" size={48} />
          <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Aggregating Global Metrics...</p>
        </div>
      </div>
    );
  }

  const engagementData = data?.charts?.weeklyEngagement || [];
  const goalDistribution = data?.charts?.goalDistribution || [];
  const stats = data?.stats || {};

  return (
    <div className="space-y-12 animate-in pb-20">
      {/* ── Premium Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 rounded-[30px] shadow-xl shadow-emerald-500/20 border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_3s_infinite] skew-x-[-25deg]"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-black text-white flex items-center gap-3 drop-shadow-lg">
             <Activity className="text-emerald-200 animate-breathe animate-hue" size={30} /> Intelligence Analytics
          </h2>
          <p className="text-emerald-50/60 font-bold mt-1 text-[10px] uppercase tracking-widest">Global platform performance vectors</p>
        </div>
        <button className="relative z-10 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 flex items-center gap-2 py-4 px-8 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 text-[10px] uppercase tracking-widest shadow-lg">
          <Download size={18} /> Export Data
        </button>
      </div>

      {/* ── HIGH SHINE Stat Cards (REAL DATA) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Avg Workout', val: `${stats.average_workout_time || 0}m`, icon: Clock, grad: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-200' },
          { label: 'Meals Logged', val: stats.total_meals_logged || 0, icon: Utensils, grad: 'from-orange-500 to-amber-600', shadow: 'shadow-orange-200' },
          { label: 'Platform Users', val: stats.total_users || 0, icon: UsersIcon, grad: 'from-purple-600 to-indigo-700', shadow: 'shadow-purple-200' },
          { label: 'Total Syncs', val: stats.total_workouts_logged || 0, icon: Dumbbell, grad: 'from-blue-600 to-cyan-500', shadow: 'shadow-blue-200' },
        ].map((stat, i) => (
          <div key={i} className={`relative overflow-hidden p-6 rounded-[30px] bg-gradient-to-br ${stat.grad} text-white shadow-xl transition-all hover:-translate-y-1 group`}>
             <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-1000 skew-x-[-25deg]"></div>
             <p className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-1">{stat.label}</p>
             <div className="flex items-end justify-between">
                <div>
                   <h3 className="text-2xl font-black">{stat.val}</h3>
                   <span className="text-[8px] font-black text-white/50 uppercase">Live Feed</span>
                </div>
                <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center border border-white/20 backdrop-blur-md group-hover:animate-float">
                   <stat.icon size={20} className="animate-glow" />
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Engagement Bar Chart */}
        <GlassCard className="p-8 rounded-[35px] shadow-xl shadow-slate-100 border-white overflow-hidden relative" hover={false}>
          <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent group-hover:left-[100%] transition-all duration-1500 skew-x-[-25deg] pointer-events-none"></div>
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
             <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Zap size={18} /></div>
             Intake Analytics
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                   <linearGradient id="barG1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                   </linearGradient>
                   <linearGradient id="barG2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#2563eb" />
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#f8fafc', radius: 12 }} />
                <Bar name="Workouts" dataKey="workouts" fill="url(#barG1)" radius={[10, 10, 10, 10]} barSize={16} />
                <Bar name="Meals" dataKey="meals" fill="url(#barG2)" radius={[10, 10, 10, 10]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-8">
            <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 rounded-xl">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgb(16,185,129)]" />
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Active Training</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-xl">
              <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgb(59,130,246)]" />
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Nutritional Load</span>
            </div>
          </div>
        </GlassCard>

        {/* Goal Distribution Pie */}
        <GlassCard className="p-8 rounded-[35px] shadow-xl shadow-slate-100 border-white relative overflow-hidden group" hover={false}>
          <div className="absolute top-0 right-[-100%] w-full h-full bg-gradient-to-l from-transparent via-blue-500/5 to-transparent group-hover:right-[100%] transition-all duration-1500 skew-x-[25deg] pointer-events-none"></div>
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><PieIcon size={18} /></div>
             Motivation Matrix
          </h3>
          <div className="flex flex-col md:flex-row items-center gap-8 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={goalDistribution}
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  strokeWidth={0}
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {goalDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}`, 'Total Population']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4 w-full md:w-64">
              {goalDistribution.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between group/legend hover:bg-white transition-all shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }} />
                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{item.name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900 group-hover/legend:scale-110 transition-transform">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* ── Detailed Growth Area Chart ── */}
      <GlassCard className="p-8 rounded-[35px] shadow-xl shadow-slate-100 border-white relative overflow-hidden" hover={false}>
         <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
               <Sparkles className="text-amber-500" size={24} /> Expansion Trends
            </h3>
            <div className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-widest">Live Feed</div>
         </div>
         <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={engagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                     <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="workouts" name="Retention Signal" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#areaG)" />
               </AreaChart>
            </ResponsiveContainer>
         </div>
      </GlassCard>
    </div>
  );
};

export default Reports;
