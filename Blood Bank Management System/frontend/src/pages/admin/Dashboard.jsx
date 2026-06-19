import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Droplets, ClipboardList, Activity, ArrowUpRight, 
  ArrowDownRight, TrendingUp, Calendar, AlertTriangle, 
  CheckCircle2, Clock, ChevronRight, LayoutDashboard
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { BloodTypeBadge } from '../../components/shared/BloodTypeBadge';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../utils/cn';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [inventoryShortage, setInventoryShortage] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, requestsRes, inventoryRes] = await Promise.all([
        axiosInstance.get('/api/dashboard/stats'),
        axiosInstance.get('/api/requests?limit=5'),
        axiosInstance.get('/api/inventory?status=low,critical')
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      if (requestsRes.data.success) setRecentRequests(requestsRes.data.data);
      if (inventoryRes.data.success) {
        setInventoryShortage(inventoryRes.data.data || []);
      }
    } catch (err) {
      console.error('Dashboard Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    { title: 'Total Donors', value: stats?.total_donors || 0, icon: Users, trend: '+12%', color: 'from-blue-500 to-indigo-600', path: '/admin/donors' },
    { title: 'Active Requests', value: stats?.active_requests || 0, icon: ClipboardList, trend: '+5%', color: 'from-rose-500 to-red-600', path: '/admin/requests' },
    { title: 'Blood Units', value: stats?.inventory_units || 0, icon: Droplets, trend: 'Total', color: 'from-emerald-500 to-teal-600', path: '/admin/inventory' },
    { title: 'Fulfilled Today', value: stats?.fulfilled_today || 0, icon: CheckCircle2, trend: 'Today', color: 'from-orange-500 to-amber-600', path: '/admin/reports' },
  ];

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-[#C0392B] border-t-transparent rounded-full animate-spin" />
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Waking Analytics...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* HEADER CARD - MATCHING REPORTS PAGE STYLE */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#C0392B] to-[#E74C3C] rounded-[1.5rem] p-6 shadow-xl shadow-red-100 border border-white/10 group mt-4">
        <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
           <LayoutDashboard className="w-20 h-20 text-white" />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Operations Power Panel</h1>
              <p className="text-red-100/70 font-medium text-sm">Real-time throughput analytics and distribution monitoring.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
             <div className="hidden md:flex flex-col items-end mr-4">
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Server Time</span>
                <span className="text-xs font-black text-white">{new Date().toLocaleTimeString()}</span>
             </div>
             <button 
               onClick={fetchDashboardData}
               className="px-6 py-2.5 bg-white text-[#C0392B] text-[10px] font-black rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
             >
               Refresh Live
             </button>
          </div>
        </div>
      </div>

      {/* COLORFUL STAT CARDS - MATCHING REPORTS PAGE SIZE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            onClick={() => navigate(stat.path)}
            className={`p-6 rounded-[2rem] bg-gradient-to-br ${stat.color} text-white shadow-xl border border-white/10 cursor-pointer group`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-black bg-black/10 px-2 py-1 rounded-lg border border-white/10">
                {stat.trend}
              </span>
            </div>
            <p className="text-xs font-bold text-white/70 uppercase tracking-widest">{stat.title}</p>
            <h3 className="text-4xl font-black mt-1 tracking-tighter">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Graph */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-5 h-5 text-[#C0392B]" />
            <div>
               <h3 className="font-black text-[#2C3E50]">Distribution Strategy</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">7-Day throughput metrics</p>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.chartData || []}>
                <defs>
                  <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C0392B" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#C0392B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 800, fill: '#94A3B8' }} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="donations" stroke="#C0392B" strokeWidth={4} fillOpacity={1} fill="url(#colorDonations)" />
                <Area type="monotone" dataKey="requests" stroke="#3498DB" strokeWidth={4} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Critical Alerts Card - Sleek Dark Theme */}
        <div className="bg-[#0F172A] rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden border border-white/5">
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-900/50">
                <AlertTriangle className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="font-black text-white">Critical Alerts</h3>
                <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Stock Sync</p>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              {inventoryShortage.length === 0 ? (
                <div className="py-12 text-center">
                   <CheckCircle2 className="w-12 h-12 text-emerald-500 opacity-40 mx-auto mb-4" />
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No Alarms Active</p>
                </div>
              ) : (
                inventoryShortage.slice(0, 3).map((item, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ x: 5 }}
                    onClick={() => navigate('/admin/inventory')}
                    className="cursor-pointer bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between group/item hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <BloodTypeBadge type={item.blood_type} />
                      <p className="text-sm font-black italic">{item.units} ml</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover/item:text-white" />
                  </motion.div>
                ))
              )}
            </div>

            <button 
              onClick={() => navigate('/admin/inventory')}
              className="mt-8 w-full py-4 bg-rose-600 hover:bg-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-rose-900/20"
            >
              Emergency Refill
            </button>
          </div>
          <Droplets className="absolute -bottom-20 -right-20 w-64 h-64 text-white/5 rotate-12 pointer-events-none" />
        </div>
      </div>

      {/* Distribution Pipeline - MATCHING REPORTS LIST STYLE */}
      <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#C0392B]" />
              <div>
                 <h3 className="font-black text-[#2C3E50]">Live Pipeline</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent activity feed</p>
              </div>
           </div>
           <button 
             onClick={() => navigate('/admin/requests')}
             className="text-[10px] font-black text-[#C0392B] hover:underline uppercase tracking-widest"
           >
             View All Requests
           </button>
        </div>

        <div className="overflow-x-auto min-h-[250px]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Recipient</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Group</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentRequests.map((req, i) => (
                <tr key={i} className="group hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-black text-sm text-[#2C3E50]">{req.patient_name || req.name || 'Anonymous User'}</td>
                  <td className="py-4 text-center">
                    <BloodTypeBadge type={req.blood_type} />
                  </td>
                  <td className="py-4 text-[11px] font-bold text-slate-400 italic">{new Date(req.created_at).toLocaleTimeString()}</td>
                  <td className="py-4 text-right">
                    <Badge variant={req.status === 'fulfilled' ? 'success' : 'warning'}>{req.status?.toUpperCase()}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
