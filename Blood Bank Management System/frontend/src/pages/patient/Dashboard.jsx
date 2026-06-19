import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Clock, CheckCircle, AlertTriangle, FilePlus, 
  ArrowRight, Heart, Droplet, MapPin, Search, 
  Plus, History, ShieldCheck, Zap
} from 'lucide-react';
import { StatCard } from '../../components/shared/StatCard';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    blood_type: 'O+',
    units: 1,
    hospital_name: '',
    reason: '',
    urgency: 'Normal'
  });

  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get('/api/requests');
      setRequests(res.data);
    } catch (err) {
      console.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axiosInstance.post('/api/requests', formData);
      toast.success('Blood Request Submitted Successfully!');
      setShowAddModal(false);
      fetchRequests();
    } catch (err) {
      toast.error('Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeRequests = requests.filter(r => r.status === 'Pending');
  const pastRequests = requests.filter(r => r.status !== 'Pending');

  const stats = [
    { title: 'Total Requests', value: requests.length || 0, icon: FilePlus, color: 'from-[#C0392B] to-[#E74C3C]' },
    { title: 'Status Tracking', value: activeRequests.length || 0, icon: Clock, color: 'from-[#2C3E50] to-[#1a252f]' },
    { title: 'Units Received', value: requests.filter(r => r.status === 'Fulfilled').reduce((acc, r) => acc + r.units, 0) || 0, icon: CheckCircle, color: 'from-emerald-500 to-teal-600' },
    { title: 'System Priority', value: 'High', icon: Zap, color: 'from-orange-500 to-amber-600' },
  ];

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-[#C0392B] border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Registry...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* PREMIUM HEADER - RED GRADIENT */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#C0392B] to-[#E74C3C] rounded-[2rem] p-8 shadow-xl shadow-red-100 border border-white/10 group mt-4">
        <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
           <Heart className="w-40 h-40 text-white" />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight uppercase">Patient Care Hub</h1>
              <p className="text-red-100/70 font-bold text-sm">Hello {user?.name || 'Valued User'}. You can request blood or track your status here.</p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-8 py-4 bg-white text-[#C0392B] text-[10px] font-black rounded-[1.2rem] shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest flex items-center gap-2"
          >
            <FilePlus className="w-5 h-5" /> Urgent Request
          </button>
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
                Life Status
              </span>
            </div>
            <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">{stat.title}</p>
            <h3 className="text-4xl font-black mt-2 tracking-tighter truncate">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ACTIVE TRACKING */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-10 border-b border-slate-50 pb-6">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 transition-colors">
                   <Activity className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-xl font-black text-[#2C3E50]">Active Monitoring</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time blood fulfillment status</p>
                </div>
             </div>
             <Badge variant="warning">{activeRequests.length} Running</Badge>
          </div>

          <div className="space-y-12">
            {activeRequests.length === 0 ? (
               <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                  <p className="text-slate-300 font-black uppercase tracking-widest text-sm">No Active Requests Found</p>
                  <p className="text-slate-400 text-xs font-bold mt-2 italic">Click "Urgent Request" above to get started.</p>
               </div>
            ) : (
              activeRequests.map((req) => (
                <div key={req.id} className="relative pl-10 border-l-4 border-rose-500 py-2">
                    <div className="absolute -left-[14px] top-4 w-6 h-6 bg-rose-600 rounded-full border-4 border-white shadow-lg animate-pulse" />
                    
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Tracking ID: #{req.id?.slice(0,8)}</p>
                          <h3 className="text-3xl font-black text-[#0F172A] mt-2 tracking-tight">
                             {req.units} Units of {req.blood_type}
                          </h3>
                          <p className="text-slate-500 font-bold mt-2 flex items-center gap-2">
                             <MapPin className="w-4 h-4 text-rose-500" /> Transfusion at <span className="text-[#0F172A]">{req.hospital_name}</span>
                          </p>
                      </div>
                      <div className="md:text-right">
                          <span className="inline-block px-4 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-rose-100">
                             {req.urgency} Urgency
                          </span>
                      </div>
                    </div>
                    
                    <div className="mt-10">
                      <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase mb-4 tracking-widest">
                          <span className="text-emerald-500">Verified</span>
                          <span className="text-emerald-500">Broadcasting</span>
                          <span className="text-rose-600 animate-pulse">Matching Donors</span>
                          <span>Courier on Dispatch</span>
                      </div>
                      <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden flex ring-1 ring-slate-100 p-1">
                          <div className="w-1/4 h-full bg-emerald-500 rounded-l-full" />
                          <div className="w-1/4 h-full bg-emerald-500 ml-1 rounded-sm" />
                          <div className="w-1/4 h-full bg-rose-500 ml-1 animate-pulse rounded-sm" />
                          <div className="w-1/4 h-full bg-slate-100 ml-1 rounded-r-full" />
                      </div>
                    </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RECENT RECORDS */}
        <div className="bg-[#0F172A] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden border border-white/5 flex flex-col justify-between">
           <div className="relative z-10">
              <div className="w-14 h-14 bg-[#2C3E50] rounded-2xl flex items-center justify-center border border-white/10 shadow-lg mb-8">
                 <History className="w-7 h-7 text-rose-500" />
              </div>
              <h3 className="text-3xl font-black tracking-tight leading-tight mb-6 uppercase">
                 Past Records
              </h3>
              
              <div className="space-y-4">
                 {pastRequests.length === 0 ? (
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">No history yet.</p>
                 ) : (
                    pastRequests.slice(0, 4).map(r => (
                       <div key={r.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                          <div className="flex justify-between items-center mb-1">
                             <span className="text-xs font-black text-white">{r.blood_type} FULFILLED</span>
                             <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{r.hospital_name}</p>
                       </div>
                    ))
                 )}
              </div>
           </div>
           
           <button className="mt-12 w-full py-4 bg-white text-[#C0392B] rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95">
             Full Archival View
           </button>
           
           <Droplet className="absolute -bottom-16 -right-16 w-60 h-60 text-white/5 rotate-12 pointer-events-none" />
        </div>
      </div>

      {/* NEW REQUEST MODAL - PREMIUM STYLED */}
      <Modal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        title={
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500">
                <FilePlus className="w-5 h-5" />
             </div>
             <div>
                <h3 className="font-black text-[#0F172A] tracking-tight">Urgent Blood Request</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Submit to all nearby centers</p>
             </div>
          </div>
        }
      >
        <form onSubmit={handleAddSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Blood Type Required</label>
              <select 
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-rose-500 transition-all font-black text-[#0F172A]"
                value={formData.blood_type}
                onChange={(e) => setFormData({...formData, blood_type: e.target.value})}
              >
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Units Required</label>
              <input 
                type="number"
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-rose-500 transition-all font-black text-[#0F172A]"
                value={formData.units}
                onChange={(e) => setFormData({...formData, units: parseInt(e.target.value)})}
                min="1"
              />
            </div>
          </div>
          
          <Input 
            label="Hospital / Medical Center Name" 
            placeholder="e.g. City General Specialist"
            required
            className="rounded-2xl h-14 bg-slate-50 border-slate-100"
            value={formData.hospital_name}
            onChange={(e) => setFormData({...formData, hospital_name: e.target.value})}
          />

          <div>
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Priority Level</label>
             <div className="flex gap-3">
                {['Normal', 'Urgent', 'Critical'].map(u => (
                   <button 
                     key={u}
                     type="button"
                     onClick={() => setFormData({...formData, urgency: u})}
                     className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                       formData.urgency === u 
                       ? 'bg-rose-600 text-white border-rose-600 shadow-xl shadow-rose-900/10' 
                       : 'bg-white text-slate-400 border-slate-100 hover:border-rose-200'
                     }`}
                   >
                      {u}
                   </button>
                ))}
             </div>
          </div>

          <div className="pt-6 flex gap-4">
             <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest">Discard</Button>
             <Button type="submit" loading={isSubmitting} className="flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-rose-600 hover:bg-rose-700">Submit Request</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
