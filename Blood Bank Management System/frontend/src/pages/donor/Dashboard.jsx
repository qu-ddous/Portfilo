import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Droplets, Trophy, History, ArrowRight, 
  Activity, MapPin, LayoutDashboard, Heart, Star,
  Clock, CheckCircle2, TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../../components/ui/Badge';

export default function DonorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDonorData = async () => {
    try {
      const res = await axiosInstance.get('/api/dashboard/donor');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch donor stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonorData();
  }, []);

  const stats = [
    { title: 'Total Donations', value: data?.total_donations || 0, icon: Droplets, color: 'from-rose-500 to-red-600' },
    { title: 'Lives Impacted', value: data?.lives_saved || 0, icon: Heart, color: 'from-blue-500 to-indigo-600' },
    { title: 'Units Donated', value: data?.total_units || 0, icon: Activity, color: 'from-emerald-500 to-teal-600' },
    { title: 'Status', value: data?.next_eligibility || 'Eligible', icon: starIcon(data?.next_eligibility), color: 'from-orange-500 to-amber-600' },
  ];

  function starIcon(eligibility) {
    return eligibility?.includes('Eligible') ? Star : Clock;
  }

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-[#C0392B] border-t-transparent rounded-full animate-spin" />
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Your Impact...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* PREMIUM HEADER - RED GRADIENT */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#C0392B] to-[#E74C3C] rounded-[1.5rem] p-6 shadow-xl shadow-red-100 border border-white/10 group mt-4">
        <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
           <Heart className="w-20 h-20 text-white" />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Hero Dashboard</h1>
              <p className="text-red-100/70 font-medium text-sm">Hello {user?.name || 'Hero'}! Your contributions save lives every day.</p>
            </div>
          </div>
          
          <div className="px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-inner flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
             <span className="text-[10px] font-black text-white uppercase tracking-widest">
                Blood Group: {data?.blood_type || 'O+'}
             </span>
          </div>
        </div>
      </div>

      {/* COLORFUL STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className={`p-6 rounded-[2rem] bg-gradient-to-br ${stat.color} text-white shadow-xl border border-white/10 group`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-black bg-black/10 px-2 py-1 rounded-lg border border-white/10 uppercase tracking-widest">
                Live Meta
              </span>
            </div>
            <p className="text-xs font-bold text-white/70 uppercase tracking-widest">{stat.title}</p>
            <h3 className="text-2xl font-black mt-1 tracking-tighter truncate">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT HISTORY TABLE */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                   <History className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="font-black text-[#2C3E50]">Heroic History</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your past contributions</p>
                </div>
             </div>
             <button 
               onClick={() => navigate('/donor/history')}
               className="text-[10px] font-black text-[#C0392B] hover:underline uppercase tracking-widest"
             >
               View All
             </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Donation Date</th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Technician Note</th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data?.recent_donations?.length > 0 ? (
                  data.recent_donations.map((notif, i) => (
                    <tr key={i} className="group hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-black text-sm text-[#2C3E50]">
                         {new Date(notif.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </td>
                      <td className="py-4 text-xs font-bold text-slate-400">
                         {notif.test_status === 'approved' ? 'Successfully processed for distribution' : 'Processing stage...'}
                      </td>
                      <td className="py-4 text-right">
                        <Badge variant={notif.test_status === 'approved' ? 'success' : 'warning'}>
                           {notif.test_status?.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-12 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">
                       No donations found yet. Be a hero today!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PROMOTION CARD */}
        <div className="bg-[#0F172A] rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden border border-white/5">
           <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                 <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-900/40 mb-6">
                    <TrendingUp className="w-6 h-6 text-white" />
                 </div>
                 <h3 className="text-2xl font-black tracking-tight leading-tight mb-4">
                    Why your blood matters?
                 </h3>
                 <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
                    One single donation can save up to three lives. Your blood type is rare and in high demand today.
                 </p>
                 
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <CheckCircle2 className="w-4 h-4 text-rose-500" />
                       <span className="text-xs font-bold text-slate-300">Free health checkup</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <CheckCircle2 className="w-4 h-4 text-rose-500" />
                       <span className="text-xs font-bold text-slate-300">Fast-track service</span>
                    </div>
                 </div>
              </div>

              <button 
                onClick={() => navigate('/home')}
                className="mt-8 w-full py-4 bg-white text-[#C0392B] rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl hover:scale-105"
              >
                Find Nearby Drive
              </button>
           </div>
           <Droplets className="absolute -bottom-20 -right-20 w-64 h-64 text-white/5 rotate-12 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
