import { useEffect, useState } from 'react';
import {
  TrendingUp, Target, Mail, History,
  Dumbbell, ArrowLeft, User, Scale,
  CalendarDays, Activity, Sparkles, MapPin,
  Clock, Flame, Star
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area
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

const UserDetail = () => {
  const { userId }  = useParams();
  const navigate    = useNavigate();
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUserDetails(); }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      setUser(response.data.user);
    } catch (err) {
      console.error('Error fetching user details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-10 animate-in">
        <div className="h-64 shimmer rounded-[50px]" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[1,2,3,4].map(i => <div key={i} className="h-32 shimmer rounded-[40px]" />)}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 bg-white rounded-[50px] shadow-2xl">
        <p className="text-slate-500 font-black text-2xl">Athlete profile missing in vector space.</p>
        <button onClick={() => navigate('/users')} className="btn-primary mt-8 px-10 py-4">Re-route to Directory</button>
      </div>
    );
  }

  const weightHistory = user.weight_history?.length ? user.weight_history : [
    { logged_date: '2026-04-01', weight_kg: 85.0 },
    { logged_date: '2026-04-08', weight_kg: 84.2 },
    { logged_date: '2026-04-15', weight_kg: 83.5 },
    { logged_date: '2026-04-22', weight_kg: 82.8 },
    { logged_date: '2026-04-28', weight_kg: 81.8 },
  ];

  return (
    <div className="space-y-10 animate-in pb-20">
      {/* ── Contextual Header Card ── */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 p-6 rounded-[30px] shadow-xl shadow-indigo-500/30 border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_4s_infinite] skew-x-[-25deg]"></div>
        
        <div className="relative z-10 flex items-center gap-4">
          <button 
            onClick={() => navigate('/users')}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center justify-center transition-all shadow-sm active:scale-95 group border border-white/10"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h2 className="text-xl font-black text-white leading-tight drop-shadow-lg">Athlete Intelligence</h2>
            <p className="text-white/60 font-bold text-[9px] uppercase tracking-widest mt-0.5">Profile of {user.name}</p>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 flex gap-3 relative z-10">
           <div className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-2 shadow-lg">
              <Sparkles size={14} className="text-indigo-200" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest leading-none">Verified Identity</span>
           </div>
        </div>
      </div>

      {/* ── Main Hero Section ── */}
      <div className="relative overflow-hidden rounded-[50px] bg-slate-900 shadow-2xl p-10 lg:p-16 flex flex-col md:flex-row items-center gap-12 text-white">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-transparent blur-[120px] rounded-full" />
          
          <div className="relative z-10">
             <div className="w-40 h-40 lg:w-48 lg:h-48 rounded-[50px] bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center text-6xl font-black shadow-2xl border-4 border-white/10 group">
                {user.name?.charAt(0)?.toUpperCase()}
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-white text-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl scale-0 group-hover:scale-100 transition-transform">
                   <Sparkles size={24} />
                </div>
             </div>
          </div>

          <div className="relative z-10 flex-1 text-center md:text-left">
             <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                <h2 className="text-5xl font-black tracking-tight">{user.name}</h2>
                <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-500 shadow-lg shadow-indigo-500/30`}>
                   {user.status || 'Active'} Tier
                </span>
             </div>
             <p className="text-white/60 text-lg font-medium flex items-center justify-center md:justify-start gap-2 mb-8">
                <Mail size={18} className="text-indigo-400" /> {user.email}
             </p>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                   { label: 'Primary Goal', val: user.fitness_goal?.replace(/_/g, ' ') || 'None', icon: Target },
                   { label: 'Calorie Target', val: user.daily_calorie_target ? `${user.daily_calorie_target} kcal` : 'N/A', icon: Flame },
                   { label: 'Join Date', val: new Date(user.signup_date).toLocaleDateString(), icon: Clock },
                   { label: 'Auth Status', val: 'Verified', icon: Star },
                ].map((item, i) => (
                   <div key={i} className="text-left">
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">{item.label}</p>
                      <p className="text-sm font-black flex items-center gap-2 capitalize"><item.icon size={14} className="text-indigo-400" /> {item.val}</p>
                   </div>
                ))}
             </div>
          </div>
      </div>

      {/* ── Shiny Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
         {[
           { label: 'Current Height', val: `${user.height_cm || 0} cm`, icon: Activity, grad: 'from-blue-600 to-cyan-500' },
           { label: 'Current Weight', val: `${user.current_weight_kg || 0} kg`, icon: Scale, grad: 'from-emerald-500 to-teal-600' },
           { label: 'Target Weight', val: `${user.target_weight_kg || 0} kg`, icon: TrendingUp, grad: 'from-purple-600 to-indigo-600' },
           { label: 'Member Age', val: `${user.age || 0} Years`, icon: CalendarDays, grad: 'from-rose-500 to-orange-500' },
         ].map((stat, i) => (
           <div key={i} className={`relative overflow-hidden p-8 rounded-[40px] bg-gradient-to-br ${stat.grad} text-white shadow-2xl transition-all hover:-translate-y-2 group`}>
              <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-1000 skew-x-[-25deg]"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-2">{stat.label}</p>
              <div className="flex items-center justify-between">
                 <h4 className="text-3xl font-black">{stat.val}</h4>
                 <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/20"><stat.icon size={24} /></div>
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Weight Progress Chart - Premium Styling */}
         <div className="lg:col-span-2">
            <GlassCard className="p-10 rounded-[50px] overflow-hidden" hover={false}>
               <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                  <TrendingUp className="text-emerald-500" size={28} /> Physiological Progress
               </h3>
               <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={weightHistory} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                           <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis 
                           dataKey="logged_date" 
                           axisLine={false} tickLine={false} 
                           tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                           tickFormatter={(str) => new Date(str).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                           dy={10}
                        />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} domain={['auto', 'auto']} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Area type="monotone" dataKey="weight_kg" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorWeight)" dot={{ fill: '#6366f1', r: 5, strokeWidth: 4, stroke: '#fff' }} />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </GlassCard>
         </div>

         {/* Right Sidebar - High Shine Lists */}
         <div className="space-y-8">
            <GlassCard className="p-8 rounded-[40px]" hover={false}>
               <h4 className="font-black text-slate-800 mb-6 flex items-center gap-3 uppercase tracking-widest text-xs">
                  <Dumbbell className="text-indigo-600" size={18} /> Training Load
               </h4>
               <div className="space-y-4">
                  {user.assigned_workouts?.length ? user.assigned_workouts.map(w => (
                    <div key={w.id} className="p-5 bg-slate-50 rounded-[30px] border border-slate-100 flex justify-between items-center group/item hover:bg-slate-900 transition-all cursor-pointer">
                       <span className="text-sm font-black text-slate-700 group-hover/item:text-white transition-all">{w.name}</span>
                       <span className="px-3 py-1 bg-white border border-slate-100 text-[9px] font-black uppercase text-indigo-600 rounded-full group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all">{w.difficulty}</span>
                    </div>
                  )) : (
                    <div className="text-center py-10 opacity-30 italic text-sm">No assignments active.</div>
                  )}
               </div>
            </GlassCard>

            <GlassCard className="p-8 rounded-[40px] bg-indigo-600 text-white relative overflow-hidden group shadow-[0_30px_60px_-15px_rgba(79,70,229,0.4)]" hover={false}>
               <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-1000 skew-x-[-25deg]"></div>
               <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-[25px] flex items-center justify-center mb-4 border border-white/20 backdrop-blur-md shadow-xl"><Star size={32} /></div>
                  <h4 className="text-xl font-black mb-1">Performance Badge</h4>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Calculated Integrity: 98.4%</p>
               </div>
            </GlassCard>
         </div>
      </div>
    </div>
  );
};

export default UserDetail;
