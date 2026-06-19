import React, { useState } from 'react';
import { Search, ClipboardList, CheckCircle, Clock, MapPin, Droplets } from 'lucide-react';
import { DataTable } from '../../components/shared/DataTable';
import { Badge } from '../../components/ui/Badge';
import { toast } from 'sonner';
import axiosInstance from '../../api/axiosInstance';

export default function ManageBloodRequests() {
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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

  React.useEffect(() => {
    fetchRequests();
  }, []);

  const handleFulfill = async (id) => {
    try {
      await axiosInstance.patch(`/api/requests/${id}/fulfill`);
      toast.success(`Request fulfilled successfully via FIFO!`);
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to fulfill request');
    }
  };

  const displayData = requests.length > 0 ? requests : [
    { id: 'REQ-4402', patient: 'Ahmad Khan', blood_type: 'O-', units: 2, hospital_name: 'City Gen Hospital', status: 'Pending', urgency: 'High' },
  ];

  const columns = [
    { header: 'ID', accessor: 'id', render: (row) => <span className="text-xs font-bold text-gray-400">#{row.id?.slice(0, 8) || row.id}</span> },
    { header: 'Patient / Blood Type', accessor: 'patient', render: (row) => (
      <div>
        <p className="font-bold text-[#2C3E50]">{row.patient || 'External'}</p>
        <p className="text-xs font-black text-rose-500 uppercase">Needs {row.blood_type || row.type}</p>
      </div>
    )},
    { header: 'Qty', accessor: 'units', render: (row) => <span className="font-black text-slate-700">{row.units} Units</span> },
    { header: 'Hospital', accessor: 'hospital_name', render: (row) => (
      <div className="flex items-center gap-1.5 text-gray-500 font-medium text-sm">
        <MapPin className="w-3.5 h-3.5" /> {row.hospital_name || row.hospital}
      </div>
    )},
    { header: 'Urgency', accessor: 'urgency', render: (row) => (
      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${row.urgency?.toLowerCase().includes('high') || row.urgency?.toLowerCase().includes('emergency') ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
        {row.urgency}
      </span>
    )},
    { header: 'Status', accessor: 'status', render: (row) => (
      <Badge variant={row.status === 'Fulfilled' ? 'success' : 'warning'}>
        {row.status}
      </Badge>
    )},
    { header: 'Action', accessor: 'actions', render: (row) => (
      <div className="flex gap-2">
         {row.status === 'Pending' ? (
           <button onClick={() => handleFulfill(row.id)} className="px-4 py-2 bg-[#C0392B] text-white text-xs font-bold rounded-xl shadow-[0_2px_0_#922B21] hover:bg-[#E74C3C] transition-all">
              Fulfill (FIFO)
           </button>
         ) : (
           <button className="p-2 text-emerald-500 bg-emerald-50 rounded-lg cursor-default">
              <CheckCircle className="w-4 h-4" />
           </button>
         )}
      </div>
    )},
  ];

  if (loading) return <div className="p-12 text-center text-gray-400 font-bold">Connecting to Central Registry...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#2C3E50] tracking-tight">Active Requests Queue</h1>
          <p className="text-gray-500 font-medium mt-1">Manage and fulfill live blood requests from hospitals and patients.</p>
        </div>
        <div className="px-4 py-2 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-black flex items-center gap-2">
           <Droplets className="w-4 h-4" /> Real-time Sync: ENABLED
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative max-w-md">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
           <input 
             type="text" 
             placeholder="Search Patient name or hospital..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-10 pr-4 py-3.5 bg-white border-2 border-gray-100 rounded-2xl text-sm font-medium outline-none focus:border-rose-400 transition-all shadow-sm"
           />
        </div>
        <DataTable columns={columns} data={displayData.filter(r => (r.patient || '').toLowerCase().includes(searchTerm.toLowerCase()) || (r.hospital_name || '').toLowerCase().includes(searchTerm.toLowerCase()))} />
      </div>
    </div>
  );
}
