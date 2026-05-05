import { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Send, 
  Bell, 
  Loader2, 
  CheckCircle, 
  Info, 
  Sparkles, 
  Zap, 
  Radio,
  History,
  Trash2,
  AlertCircle,
  Clock,
  User
} from 'lucide-react';
import api from '../utils/api';
import GlassCard from '../components/GlassCard';

const typeOptions = [
  { value: 'system_alert', label: 'System Alert',    grad: 'from-rose-500 to-red-600', shadow: 'shadow-red-500/20'    },
  { value: 'reminder',     label: 'Daily Reminder',  grad: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20'   },
  { value: 'goal_achieved',label: 'Goal Milestone',  grad: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20'},
];

const Notifications = () => {
  const [loading, setLoading]   = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [success, setSuccess]   = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({
    title: '', message: '', type: 'system_alert',
  });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/admin/notifications');
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error('Error fetching notification history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await api.post('/admin/notifications/broadcast', formData);
      setSuccess(true);
      setFormData({ title: '', message: '', type: 'system_alert' });
      fetchHistory(); // Refresh history
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      alert('Failed to send broadcast. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification record?')) return;
    try {
      await api.delete(`/admin/notifications/${id}`);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (err) {
      alert('Failed to delete notification.');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('WARNING: This will delete ALL notifications from the platform. Proceed?')) return;
    try {
      await api.delete('/admin/notifications/clear-all/confirm');
      setNotifications([]);
    } catch (err) {
      alert('Failed to clear notifications.');
    }
  };

  return (
    <div className="space-y-12 animate-in pb-20 max-w-6xl mx-auto">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 rounded-[30px] shadow-xl shadow-emerald-500/20 border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_4s_infinite] skew-x-[-25deg]"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-black text-white flex items-center gap-3 drop-shadow-lg">
             <Radio className="text-emerald-200 animate-pulse animate-hue" size={30} /> Intelligence Dispatch
          </h2>
          <p className="text-emerald-50/60 font-bold mt-1 text-[10px] uppercase tracking-widest">Real-time platform synchronization</p>
        </div>
        <button 
          onClick={handleClearAll}
          className="relative z-10 px-6 py-3 bg-rose-500/20 hover:bg-rose-500 text-rose-100 rounded-2xl flex items-center gap-2 transition-all border border-rose-500/30 text-xs font-black uppercase tracking-widest"
        >
          <Trash2 size={16} /> Wipe All Records
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* ── Broadcast Control Panel ── */}
        <div className="space-y-6">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 ml-4">
             <Send size={16} className="text-emerald-500" /> New Transmission
          </h3>
          <GlassCard className="p-8 rounded-[35px] shadow-xl shadow-slate-200 overflow-hidden relative" hover={false}>
            <form onSubmit={handleBroadcast} className="space-y-8 relative z-10">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Header Title</label>
                  <input
                    type="text" required
                    placeholder="e.g. Critical Update"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-black text-slate-800 focus:bg-white focus:border-emerald-400 outline-none transition-all"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
               </div>

               <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Broadcast Content</label>
                  <textarea
                    required rows={3}
                    placeholder="Enter message details..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-[30px] px-8 py-6 text-base font-medium text-slate-600 focus:bg-white focus:border-emerald-400 focus:ring-8 focus:ring-emerald-500/5 transition-all outline-none resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
               </div>

               <div className="space-y-4">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Category Flow</label>
                 <div className="flex flex-wrap gap-3">
                   {typeOptions.map((t) => (
                     <button
                       key={t.value}
                       type="button"
                       onClick={() => setFormData({ ...formData, type: t.value })}
                       className={`relative overflow-hidden flex items-center gap-3 px-5 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                         formData.type === t.value
                           ? `bg-gradient-to-br ${t.grad} text-white shadow-xl ${t.shadow} scale-105`
                           : 'bg-white text-slate-500 border border-slate-100'
                       }`}
                     >
                       {t.label}
                     </button>
                   ))}
                 </div>
               </div>

               <button
                 type="submit"
                 disabled={loading}
                 className={`w-full relative overflow-hidden bg-slate-900 text-white rounded-[30px] font-black py-5 text-xs uppercase tracking-[0.2em] shadow-2xl transition-all ${loading ? 'opacity-70' : 'hover:bg-black hover:scale-[1.01]'}`}
               >
                 {loading ? <Loader2 className="animate-spin mx-auto" /> : "Initiate Global Sync"}
               </button>
            </form>
          </GlassCard>
        </div>

        {/* ── Transmission History ── */}
        <div className="space-y-6">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 ml-4">
             <History size={16} className="text-indigo-500" /> Dispatch History
          </h3>
          <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
             {historyLoading ? (
               <div className="flex justify-center p-20"><Loader2 className="animate-spin text-emerald-500" /></div>
             ) : notifications.length === 0 ? (
               <GlassCard className="p-10 text-center rounded-[30px]">
                  <AlertCircle className="mx-auto text-slate-300 mb-4" size={40} />
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No previous broadcasts</p>
               </GlassCard>
             ) : (
               notifications.map((notif) => (
                 <GlassCard key={notif.id} className="p-6 rounded-[30px] border-white group/card relative overflow-hidden">
                    <div className="flex justify-between items-start relative z-10">
                       <div className="flex gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-white shadow-inner bg-gradient-to-br ${typeOptions.find(t => t.value === notif.type)?.grad || 'from-slate-400 to-slate-600'} text-white`}>
                             <Bell size={20} className="animate-sway" />
                          </div>
                          <div>
                             <h4 className="text-sm font-black text-slate-800">{notif.title}</h4>
                             <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{notif.message}</p>
                             <div className="flex items-center gap-4 mt-3">
                                <span className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                   <Clock size={12} /> {new Date(notif.created_at).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                                   <User size={12} /> ID: ...{notif.user_id.slice(-6)}
                                </span>
                             </div>
                          </div>
                       </div>
                       <button 
                         onClick={() => handleDelete(notif.id)}
                         className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all rounded-xl opacity-0 group-hover/card:opacity-100"
                       >
                          <Trash2 size={16} />
                       </button>
                    </div>
                 </GlassCard>
               ))
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
