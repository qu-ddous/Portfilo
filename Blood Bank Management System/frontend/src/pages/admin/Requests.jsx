import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Search, Activity, Clock } from 'lucide-react';
import { DataTable } from '../../components/shared/DataTable';
import { Badge } from '../../components/ui/Badge';
import { BloodTypeBadge } from '../../components/shared/BloodTypeBadge';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'sonner';

export default function BloodRequests() {
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get('/api/requests');
      if (res.data.success) {
        setRequests(res.data.data);
      } else {
        setRequests(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRequests();
  }, []);

  const handleFulfill = async (id) => {
    try {
      const response = await axiosInstance.patch(`/api/requests/${id}/fulfill`);
      if (response.data.success) {
        toast.success(response.data.message || 'Request fulfilled successfully!');
        fetchRequests();
      } else {
        toast.error(response.data.error || 'Failed to fulfill request');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to fulfill request');
    }
  };

  const columns = [
    { header: 'Priority', accessor: 'urgency', render: (row) => (
      <span className={`text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 w-max capitalize ${
        row.urgency === 'critical' ? 'bg-red-50 text-red-600' :
        row.urgency === 'urgent' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
      }`}>
        {row.urgency === 'critical' && <Activity className="w-3 h-3" />}
        {row.urgency}
      </span>
    )},
    { header: 'Requirements', accessor: 'blood_type', render: (row) => (
      <div className="flex items-center gap-3">
        <BloodTypeBadge type={row.blood_type} />
        <span className="font-bold text-gray-600">x {row.units} ml</span>
      </div>
    )},
    { header: 'Status', accessor: 'status', render: (row) => (
      <Badge variant={
        row.status === 'approved' ? 'success' :
        row.status === 'pending' ? 'warning' :
        row.status === 'fulfilled' ? 'primary' : 'danger'
      }>
        {row.status}
      </Badge>
    )},
    { header: 'Actions', accessor: 'actions', render: (row) => (
      <div className="flex items-center gap-2">
        {row.status === 'pending' ? (
          <button 
            onClick={() => handleFulfill(row.id)}
            className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1"
          >
            <Check className="w-4 h-4" /> Fulfill (FIFO)
          </button>
        ) : (
           <span className="text-xs font-bold text-gray-300 capitalize">{row.status}</span>
        )}
      </div>
    )},
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-[#C0392B] to-[#E74C3C] rounded-[1.5rem] p-6 mb-8 shadow-xl shadow-red-100 border border-white/10 group mt-4">
        <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
           <Clock className="w-20 h-20 text-white" />
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Blood Requests
            </h1>
            <p className="text-red-100/70 font-medium text-sm">
              Managing all intake and distribution requests.
            </p>
          </div>
        </div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by ID or details..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-100 rounded-2xl text-sm font-bold text-[#2C3E50] outline-none focus:border-rose-500 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_10px_20px_rgba(225,29,72,0.1)]"
          />
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={requests.filter(r => 
          (r.patient_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
          r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (r.blood_type || '').toLowerCase().includes(searchTerm.toLowerCase())
        )} 
      />
    </div>

  );
}
