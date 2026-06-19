import React from 'react';
import { Search, Filter, Clock, CheckCircle, XCircle } from 'lucide-react';
import { DataTable } from '../../components/shared/DataTable';
import { Badge } from '../../components/ui/Badge';

const MY_REQUESTS = [
  { id: 'REQ-4402', bloodType: 'O-', units: 2, hospital: 'City Gen Hospital', status: 'In Progress', date: 'Oct 14, 2023', donors: '2/2 Confirmed' },
  { id: 'REQ-1120', bloodType: 'O-', units: 1, hospital: 'National Medical Center', status: 'Resolved', date: 'Oct 05, 2023', donors: '1/1 Fulfilled' },
  { id: 'REQ-0501', bloodType: 'O-', units: 1, hospital: 'City Gen Hospital', status: 'Cancelled', date: 'Sep 28, 2023', donors: 'N/A' },
];

export default function TrackRequests() {
  const columns = [
    { header: 'Request ID', accessor: 'id', render: (row) => <span className="text-xs font-black text-gray-400">#{row.id}</span> },
    { header: 'Details', accessor: 'bloodType', render: (row) => (
      <div>
        <p className="font-bold text-[#2C3E50]">{row.units} Units of {row.bloodType}</p>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{row.date}</p>
      </div>
    )},
    { header: 'Hospital', accessor: 'hospital', render: (row) => <span className="text-sm font-semibold text-gray-500">{row.hospital}</span> },
    { header: 'Donor Status', accessor: 'donors', render: (row) => <span className={`text-sm font-black ${row.status === 'Resolved' ? 'text-emerald-500' : 'text-gray-400'}`}>{row.donors}</span> },
    { header: 'Status', accessor: 'status', render: (row) => (
      <Badge variant={row.status === 'Resolved' ? 'success' : row.status === 'Cancelled' ? 'danger' : 'warning'}>
        {row.status}
      </Badge>
    )},
    { header: 'Actions', accessor: 'actions', render: (row) => (
      <button className="text-xs font-black text-[#C0392B] hover:underline uppercase tracking-widest">
         {row.status === 'In Progress' ? 'View Live' : 'View Summary'}
      </button>
    )},
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#2C3E50] tracking-tight">Track Your Requests</h1>
          <p className="text-gray-500 font-medium mt-1">Monitor all active and previous blood requests in real-time.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border-2 border-gray-100 text-gray-600 text-sm font-black rounded-2xl shadow-sm hover:border-red-200 transition-all flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Active', value: '1', icon: Clock, color: 'text-orange-500 bg-orange-50' },
           { label: 'Resolved', value: '12', icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50' },
           { label: 'Cancelled', value: '2', icon: XCircle, color: 'text-rose-500 bg-rose-50' },
         ].map((stat, i) => (
           <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 flex items-center justify-between shadow-sm">
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
                 <p className="text-3xl font-black text-[#2C3E50] mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                 <stat.icon className="w-6 h-6" />
              </div>
           </div>
         ))}
      </div>

      <div className="space-y-4">
        <div className="relative max-w-sm mb-4">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
           <input 
              type="text" 
              placeholder="Search request ID or hospital..." 
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-100 rounded-2xl text-sm font-medium outline-none focus:border-rose-400 transition-all"
           />
        </div>
        <DataTable columns={columns} data={MY_REQUESTS} />
      </div>
    </div>
  );
}
