import { useEffect, useState } from 'react';
import { User, History, Shield, Fingerprint, Clock, Activity, Search, Filter } from 'lucide-react';
import api from '../utils/api';
import GlassCard from '../components/GlassCard';
import EmptyState from '../components/EmptyState';

const actionStyle = (action = '') => {
  if (action.includes('DELETE')) return 'from-rose-500 to-red-600 shadow-red-200';
  if (action.includes('CREATE')) return 'from-emerald-500 to-teal-600 shadow-emerald-200';
  if (action.includes('UPDATE')) return 'from-blue-500 to-indigo-600 shadow-blue-200';
  return 'from-slate-500 to-slate-700 shadow-slate-200';
};

const AuditLogs = () => {
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/admin/system/logs');
      setLogs(response.data.logs || []);
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = logs.filter(l => 
    l.action?.toLowerCase().includes(search.toLowerCase()) ||
    l.users?.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.entity_type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in pb-20">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-slate-800 via-indigo-900 to-slate-900 p-6 rounded-[30px] shadow-xl shadow-indigo-950/40 border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_5s_infinite] skew-x-[-25deg]"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/10 shadow-inner group-hover:animate-float transition-all">
               <Shield size={28} className="text-indigo-400 animate-glow animate-hue" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white leading-tight drop-shadow-lg">Security Audit</h2>
              <p className="text-white/40 font-bold text-[10px] uppercase tracking-widest">Global administrative transition ledger</p>
            </div>
          </div>
          <div className="relative w-full md:w-80 group/search">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within/search:text-white transition-colors" size={18} />
             <input 
               type="text" 
               placeholder="Filter security records..."
               className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl pl-12 pr-6 py-4 text-sm font-black text-white placeholder-white/20 focus:bg-white/20 focus:border-white/40 outline-none transition-all shadow-2xl"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
          </div>
        </div>
      </div>

      {/* ── Security Status Widget ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Encryption', val: 'SSL-Secure', grad: 'from-emerald-500 to-teal-600' },
           { label: 'Integrity', val: '100% Verified', grad: 'from-blue-600 to-indigo-700' },
           { label: 'Uptime', val: '99.98% Active', grad: 'from-purple-600 to-fuchsia-700' },
         ].map((w, i) => (
           <div key={i} className={`relative overflow-hidden p-6 rounded-[30px] bg-gradient-to-br ${w.grad} text-white shadow-xl group`}>
             <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-1000 skew-x-[-25deg]"></div>
             <h4 className="font-black text-[9px] uppercase tracking-[0.2em] mb-2 opacity-70">{w.label}</h4>
             <div className="text-2xl font-black">{w.val}</div>
           </div>
         ))}
      </div>

      {/* ── Main Logs Ledger ── */}
      <div className="relative group rounded-[30px] overflow-hidden bg-white shadow-xl shadow-slate-100 border border-slate-100">
         {/* Shiny Reflect */}
         <div className="absolute top-0 left-[-100%] w-full h-[200%] bg-gradient-to-r from-transparent via-purple-500/5 to-transparent group-hover:left-[100%] transition-all duration-1500 skew-x-[-25deg] pointer-events-none"></div>

         <div className="overflow-x-auto">
           <table className="w-full border-collapse">
             <thead>
               <tr className="bg-slate-950 text-white">
                 <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest opacity-60">Architect</th>
                 <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest opacity-60">Action Logic</th>
                 <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest opacity-60">Target Instance</th>
                 <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest opacity-60">Vector Time</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {loading ? (
                 [1, 2, 3, 4, 5, 6].map(i => (
                   <tr key={i}><td colSpan="4" className="px-8 py-6"><div className="shimmer h-6 w-full rounded-xl" /></td></tr>
                 ))
               ) : filtered.length === 0 ? (
                 <tr><td colSpan="4"><EmptyState message="No security records" submessage="System transactions will appear here." /></td></tr>
               ) : filtered.map((log) => (
                 <tr key={log.id} className="hover:bg-slate-50 transition-all group/row">
                   <td className="px-8 py-6">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg group-hover/row:scale-110 transition-transform">
                         <Fingerprint size={18} />
                       </div>
                       <div>
                         <p className="text-xs font-black text-slate-800">{log.users?.name || 'Root'}</p>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{log.users?.role || 'Admin'}</p>
                       </div>
                     </div>
                   </td>
                   <td className="px-8 py-6">
                     <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${actionStyle(log.action)} text-white text-[9px] font-black uppercase tracking-widest shadow-lg`}>
                        {log.action}
                     </div>
                   </td>
                   <td className="px-8 py-6">
                     <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-800 flex items-center gap-2">
                           <Activity size={12} className="text-slate-300" /> {log.entity_type}
                        </span>
                        <span className="text-[9px] font-bold text-slate-300 font-mono mt-0.5">ID: {log.entity_id?.slice(0, 10)}</span>
                     </div>
                   </td>
                   <td className="px-8 py-6 text-right">
                     <div className="flex flex-col items-end">
                        <p className="text-xs font-black text-slate-800 flex items-center gap-2">
                           <Clock size={12} className="text-purple-400" /> {new Date(log.created_at).toLocaleTimeString()}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                           {new Date(log.created_at).toLocaleDateString()}
                        </p>
                     </div>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
      </div>
    </div>
  );
};

export default AuditLogs;
