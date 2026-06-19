import React, { useState } from 'react';
import { Search, FlaskConical, CheckCircle, XCircle, AlertTriangle, FileText } from 'lucide-react';
import { DataTable } from '../../components/shared/DataTable';
import { Badge } from '../../components/ui/Badge';
import { toast } from 'sonner';

const SAMPLE_LIST = [
  { id: 'SMP-2045', donor: 'Ali Raza', type: 'O+', date: 'Oct 14, 2023', status: 'Pending' },
  { id: 'SMP-2046', donor: 'Sana Q.',  type: 'B-', date: 'Oct 14, 2023', status: 'In Lab' },
  { id: 'SMP-2041', donor: 'Hassan N.', type: 'O-', date: 'Oct 13, 2023', status: 'Approved' },
  { id: 'SMP-2039', donor: 'Usman R.',  type: 'A+', date: 'Oct 12, 2023', status: 'Rejected' },
];

export default function TestResults() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleApprove = (id) => {
    toast.success(`Sample ${id} results updated: SAFE`);
  };

  const columns = [
    { header: 'Sample ID', accessor: 'id', render: (row) => <span className="text-xs font-bold text-gray-400">{row.id}</span> },
    { header: 'Donor Source', accessor: 'donor', render: (row) => (
      <div>
        <p className="font-bold text-[#2C3E50]">{row.donor}</p>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{row.date}</p>
      </div>
    )},
    { header: 'Blood Type', accessor: 'type', render: (row) => <span className="font-black text-rose-500">{row.type}</span> },
    { header: 'Status', accessor: 'status', render: (row) => (
      <Badge variant={row.status === 'Approved' ? 'success' : row.status === 'Rejected' ? 'danger' : 'warning'}>
        {row.status}
      </Badge>
    )},
    { header: 'Actions', accessor: 'actions', render: (row) => (
      <div className="flex gap-2">
         {row.status === 'Pending' || row.status === 'In Lab' ? (
           <button onClick={() => handleApprove(row.id)} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Enter Safe
           </button>
         ) : (
           <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg">
              <FileText className="w-4 h-4" />
           </button>
         )}
      </div>
    )},
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#2C3E50] tracking-tight">Lab Screening Results</h1>
          <p className="text-gray-500 font-medium mt-1">Verify blood safety and screening results before inventory release.</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2">
             <FlaskConical className="w-4 h-4 text-rose-400" /> Active Tests: 2
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Screened Today', value: '24', icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50' },
           { label: 'Pending Lab', value: '8', icon: AlertTriangle, color: 'text-orange-500 bg-orange-50' },
           { label: 'Unsafe Units', value: '2', icon: XCircle, color: 'text-rose-500 bg-rose-50' },
           { label: 'Total Samples', value: '142', icon: FlaskConical, color: 'text-slate-500 bg-slate-50' },
         ].map((s, i) => (
           <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                 <p className="text-3xl font-black text-[#2C3E50] mt-1">{s.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${s.color}`}>
                 <s.icon className="w-6 h-6" />
              </div>
           </div>
         ))}
      </div>

      <div className="space-y-4">
        <div className="relative max-w-md">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
           <input 
             type="text" 
             placeholder="Search Sample ID or Donor..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-10 pr-4 py-3.5 bg-white border-2 border-gray-100 rounded-2xl text-sm font-medium outline-none focus:border-rose-400 transition-all shadow-sm"
           />
        </div>
        <DataTable columns={columns} data={SAMPLE_LIST.filter(s => s.id.includes(searchTerm) || s.donor.toLowerCase().includes(searchTerm.toLowerCase()))} />
      </div>
    </div>
  );
}
