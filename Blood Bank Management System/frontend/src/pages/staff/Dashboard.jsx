import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ClipboardList, Droplet, FileCheck, CheckCircle, Clock, 
  AlertTriangle, ArrowRight, UserPlus, Zap, Activity,
  Stethoscope, Microscope, Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../../components/ui/Badge';

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStaffData = async () => {
    try {
      const res = await axiosInstance.get('/api/dashboard/staff');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch staff stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  const stats = [
    { title: 'New Donors Today', value: data?.donors_today || 0, icon: UserPlus, color: 'from-[#C0392B] to-[#E74C3C]', desc: 'New hero registrations' },
    { title: 'Pending Screening', value: data?.pending_tests || 0, icon: Microscope, color: 'from-[#2C3E50] to-[#1a252f]', desc: 'Lab work awaiting focus' },
    { title: 'Orders Fulfilled', value: data?.fulfilled_today || 0, icon: CheckCircle, color: 'from-emerald-500 to-teal-600', desc: 'Life-saving deliveries' },
    { title: 'System Status', value: data?.activity_label || 'Healthy', icon: Zap, color: 'from-orange-500 to-amber-600', desc: 'Operational flow check' },
  ];

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-[#C0392B] border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Waking Operations...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* PREMIUM HEADER - RED GRADIENT */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#C0392B] to-[#E74C3C] rounded-[2rem] p-8 shadow-xl shadow-red-100 border border-white/10 group mt-4">
        <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
           <Stethoscope className="w-40 h-40 text-white" />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg group-hover:rotate-6 transition-transform">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight uppercase">Operational Command</h1>
              <p className="text-red-100/70 font-bold text-sm">Welcome back, {user?.name || 'Staff'}. {data?.pending_tests > 0 ? `You have ${data.pending_tests} tests pending!` : 'Everything is on track.'}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
             <button 
               onClick={() => navigate('/staff/register-donor')}
               className="px-6 py-3 bg-white text-[#C0392B] text-[10px] font-black rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest flex items-center gap-2"
             >
               <UserPlus className="w-4 h-4" /> Register Donor
             </button>
             <button 
               onClick={() => navigate('/staff/record-donation')}
               className="px-6 py-3 bg-[#1e293b] text-white text-[10px] font-black rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest flex items-center gap-2 border border-white/10"
             >
               <Droplet className="w-4 h-4" /> Record Donation
             </button>
          </div>
        </div>
      </div>

      {/* COLORFUL STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className={`p-8 rounded-[2.5rem] bg-gradient-to-br ${stat.color} text-white shadow-xl shadow-slate-200 border border-white/10 group overflow-hidden relative`}
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />
             <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl group-hover:scale-110 transition-transform">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-[10px] font-black bg-white/10 px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">
                Real-Time
              </span>
            </div>
            <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">{stat.title}</p>
            <h3 className="text-4xl font-black mt-2 tracking-tighter truncate">{stat.value}</h3>
            <p className="text-xs font-bold text-white/70 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
               {stat.desc}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* QUICK ACTIONS FOR STAFF */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-10">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors">
                   <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-xl font-black text-[#2C3E50]">Operational Log</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Actionable tasks for today</p>
                </div>
             </div>
             <button 
               onClick={() => navigate('/staff/manage-requests')}
               className="px-5 py-2.5 bg-slate-50 text-slate-500 text-[10px] font-black rounded-xl hover:bg-slate-100 uppercase tracking-widest border border-slate-200 transition-all"
             >
               Full Workflow
             </button>
          </div>

          <div className="space-y-6">
             {[
               { title: 'Screening Lab High Alert', desc: '3 O- batches ready for testing focus.', status: 'Pending', color: 'rose' },
               { title: 'Emergency Inventory Check', desc: 'Verify City Hospital branch stocks.', status: 'Priority', color: 'blue' },
             ].map((task, i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border-2 border-transparent hover:border-slate-100 hover:bg-white transition-all group">
                   <div className="flex items-center gap-6">
                      <div className={`w-3 h-3 rounded-full bg-${task.color}-500 shadow-[0_0_15px_rgba(0,0,0,0.1)]`} />
                      <div>
                         <h4 className="font-black text-[#0F172A] text-sm">{task.title}</h4>
                         <p className="text-xs font-bold text-slate-400 mt-0.5">{task.desc}</p>
                      </div>
                   </div>
                   <button className="p-3 bg-white rounded-xl shadow-sm text-slate-300 group-hover:text-rose-500 transition-colors">
                      <ArrowRight className="w-5 h-5" />
                   </button>
                </div>
             ))}
          </div>
        </div>

        {/* RESOURCE FINDER */}
        <div className="bg-[#0F172A] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden border border-white/5 flex flex-col justify-between">
           <div className="relative z-10">
              <div className="w-14 h-14 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-900/40 mb-8">
                 <Search className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-3xl font-black tracking-tight leading-tight mb-6 uppercase">
                 Resource Finder
              </h3>
              <p className="text-slate-400 text-sm font-bold leading-relaxed mb-10 uppercase tracking-widest">
                 Locate donors, patients, or specific blood units across all branches in real-time.
              </p>
           </div>
           
           <div className="space-y-4 relative z-10">
              <button 
                onClick={() => navigate('/staff/test-results')}
                className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Screening Lab Access
              </button>
              <button 
                onClick={() => navigate('/staff/manage-requests')}
                className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-rose-900/20"
              >
                Process Urgent Requests
              </button>
           </div>
           
           <Microscope className="absolute -bottom-16 -right-16 w-60 h-60 text-white/5 rotate-12 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
