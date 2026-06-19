import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, TrendingUp, Users, Droplets, 
  Download, PieChart as PieIcon, BarChart3, Activity, Loader2 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'sonner';

const COLORS = ['#E74C3C', '#3498DB', '#F1C40F', '#2ECC71', '#9B59B6', '#E67E22'];

export default function GeneralReports() {
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [stats, setStats] = useState(null);

  const fetchAnalytics = async () => {
    try {
      const res = await axiosInstance.get('/api/reports/analytics');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to sync real-time analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleExport = async () => {
    if (!stats) return;
    setExporting(true);
    try {
      // Dynamic imports to prevent Vite 500 errors
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(192, 57, 43); // #C0392B
      doc.text('BloodLink Analytics Report', 14, 22);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
      
      // Summary Stats Table
      const summaryData = [
        ['Total Donors', stats.summary.total_donors],
        ['Total Blood Units (ml)', stats.summary.inventory_units],
        ['Total Distribution Requests', stats.summary.total_requests],
        ['Critical Shortages Identified', stats.summary.critical_shortages]
      ];
      
      autoTable(doc, {
        startY: 40,
        head: [['Metric', 'Value']],
        body: summaryData,
        theme: 'striped',
        headStyles: { fillColor: [192, 57, 43] }
      });
      
      // Blood Distribution Table
      const bloodData = (stats.bloodTypeChart || []).map(item => [item.name, `${item.value}ml`]);
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 15,
        head: [['Blood Type', 'Current Volume']],
        body: bloodData,
        theme: 'grid',
        headStyles: { fillColor: [44, 62, 80] }
      });
      
      doc.save(`BloodLink_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Analytics report exported as PDF');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF report');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-[#C0392B] to-[#E74C3C] rounded-[1.5rem] p-6 mb-8 shadow-xl shadow-red-100 border border-white/10 group mt-4">
        <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
           <FileText className="w-20 h-20 text-white" />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                System Analytics
              </h1>
              <p className="text-red-100/70 font-medium text-sm">
                Advanced performance tracking & real-time blood distribution.
              </p>
            </div>
          </div>

          <button 
            onClick={handleExport}
            disabled={exporting}
            className="px-6 py-2.5 bg-white text-[#C0392B] text-xs font-black rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Donors', value: stats?.summary?.total_donors || 0, icon: Users, trend: 'Active', color: 'from-rose-500 to-red-600' },
          { title: 'Inventory Units', value: stats?.summary?.inventory_units || 0, icon: Droplets, trend: 'Live ml', color: 'from-blue-500 to-indigo-600' },
          { title: 'Total Requests', value: stats?.summary?.total_requests || 0, icon: TrendingUp, trend: 'Total', color: 'from-emerald-500 to-teal-600' },
          { title: 'Shortages', value: stats?.summary?.critical_shortages || 0, icon: Activity, trend: 'Warning', color: 'from-orange-500 to-amber-600' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className={`p-6 rounded-[2rem] bg-gradient-to-br ${stat.color} text-white shadow-xl border border-white/10`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/20 rounded-xl">
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-black bg-black/10 px-2 py-1 rounded-lg">
                {stat.trend}
              </span>
            </div>
            <p className="text-xs font-bold text-white/70 uppercase tracking-widest">{stat.title}</p>
            <h3 className="text-4xl font-black mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="w-5 h-5 text-[#C0392B]" />
            <h3 className="font-black text-[#2C3E50]">Distribution Trends (Live)</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.monthlyData || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 800, fill: '#94A3B8' }} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'transparent' }} 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                />
                <Bar dataKey="donations" fill="#EB4D4B" radius={[6, 6, 0, 0]} barSize={25} />
                <Bar dataKey="requests" fill="#D1D5DB" radius={[6, 6, 0, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <PieIcon className="w-5 h-5 text-[#C0392B]" />
            <h3 className="font-black text-[#2C3E50]">Inventory Mix</h3>
          </div>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.bloodTypeChart || []}
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {(stats?.bloodTypeChart || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={5} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-6">
             {(stats?.bloodTypeChart || []).map((item, i) => (
               <div key={i} className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{item.name}</span>
                 <span className="text-[10px] font-bold text-gray-300 ml-auto">{item.value}ml</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
