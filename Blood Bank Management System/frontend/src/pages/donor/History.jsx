import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  History as HistoryIcon, Download, Filter, FileText, 
  Droplets, Calendar, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { DataTable } from '../../components/shared/DataTable';
import { Badge } from '../../components/ui/Badge';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'sonner';

export default function DonationHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await axiosInstance.get('/api/dashboard/donor');
      if (res.data.success) {
        setHistory(res.data.data.recent_donations || []);
      }
    } catch (err) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const columns = [
    { 
      header: 'Donation Batch', 
      accessor: 'id', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
             <Droplets className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-[#2C3E50]">#{row.id?.substring(0, 8)}</p>
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Confirmed Batch</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Donation Date', 
      accessor: 'created_at', 
      render: (row) => (
        <div className="flex items-center gap-2">
           <Calendar className="w-4 h-4 text-slate-400" />
           <span className="font-bold text-[#2C3E50]">
              {new Date(row.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
           </span>
        </div>
      )
    },
    { 
      header: 'Volume', 
      accessor: 'units', 
      render: (row) => (
        <span className="text-xs font-black bg-slate-100 px-3 py-1.5 rounded-xl text-slate-600 uppercase tracking-widest">
           {row.units === 1 ? '500ml' : '1000ml'}
        </span>
      )
    },
    { 
      header: 'Status', 
      accessor: 'test_status', 
      render: (row) => (
        <Badge variant={row.test_status === 'approved' ? 'success' : 'warning'}>
           {row.test_status?.toUpperCase()}
        </Badge>
      )
    },
    { 
      header: 'Action', 
      accessor: 'actions', 
      render: () => (
        <button className="flex items-center gap-2 text-[10px] font-black text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-xl transition-all uppercase tracking-widest border border-rose-100">
          <FileText className="w-3 h-3" /> Report
        </button>
      )
    },
  ];

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* PREMIUM RED HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#C0392B] to-[#E74C3C] rounded-[1.5rem] p-6 mb-8 shadow-xl shadow-red-100 border border-white/10 group mt-4">
        <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
           <HistoryIcon className="w-40 h-40 text-white" />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
              <HistoryIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Heroic History</h1>
              <p className="text-red-100/70 font-medium text-sm">Review your past contributions and download verified reports.</p>
            </div>
          </div>
          
          <button className="px-6 py-2.5 bg-white text-[#C0392B] text-[10px] font-black rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest flex items-center gap-2">
            <Download className="w-4 h-4" /> Download Records
          </button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="bg-white rounded-[2rem] p-4 border-2 border-slate-50 shadow-sm">
           <DataTable columns={columns} data={history} />
        </div>
      </motion.div>

      {/* Hero Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
         <div className="bg-[#0F172A] rounded-[2.5rem] p-8 text-white relative overflow-hidden group border border-white/5">
            <div className="relative z-10">
               <h3 className="text-xl font-black mb-2 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-rose-500" /> Consistency Milestone
               </h3>
               <p className="text-slate-400 font-medium text-sm leading-relaxed">
                  You've successfully completed {history.length} life-saving donations. Each batch has been screened and processed for emergency distribution local centers.
               </p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-rose-600/10 rounded-full blur-3xl group-hover:bg-rose-600/20 transition-all" />
         </div>
         
         <div className="bg-white rounded-[2.5rem] p-8 border-2 border-slate-50 shadow-sm group hover:border-rose-100 transition-all">
            <h3 className="text-xl font-black text-[#0F172A] mb-2 flex items-center gap-3">
               <FileText className="w-6 h-6 text-rose-600" /> Lab Verification
            </h3>
            <p className="text-slate-500 font-medium text-sm leading-relaxed">
               All your reports are verified by qualified technicians. You can use these reports for your personal health records or medical consultations.
            </p>
         </div>
      </div>
    </div>
  );
}
