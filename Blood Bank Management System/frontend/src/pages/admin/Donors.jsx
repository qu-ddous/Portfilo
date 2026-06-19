import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, AlertCircle, Users, Trash2, Edit2, X, Download, Loader2 } from 'lucide-react';
import { DataTable } from '../../components/shared/DataTable';
import { Badge } from '../../components/ui/Badge';
import { BloodTypeBadge } from '../../components/shared/BloodTypeBadge';
import axiosInstance from '../../api/axiosInstance';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { toast } from 'sonner';
import { exportToPDF } from '../../utils/export';

export default function DonorsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    blood_type: 'O+',
    age: '',
    weight: ''
  });
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '',
    blood_type: '',
    age: '',
    weight: '',
    is_eligible: true
  });

  const fetchDonors = async () => {
    try {
      const res = await axiosInstance.get('/api/donors');
      if (res.data.success) {
        setDonors(res.data.data);
      } else {
        setDonors(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error('Failed to fetch donors');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDonors();
  }, []);

  const handleExport = async () => {
    setExporting(true);
    const columns = ['Name', 'Phone', 'Blood Type', 'Age', 'Weight', 'Eligibility'];
    const data = filteredDonors.map(d => [
      d.name,
      d.phone || 'N/A',
      d.blood_type,
      d.age,
      d.weight,
      d.is_eligible ? 'Eligible' : 'Deferred'
    ]);
    
    const success = await exportToPDF('Donors Directory', columns, data, 'BloodLink_Donors');
    if (success) toast.success('Donors list exported as PDF');
    setExporting(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this donor?')) {
      try {
        const response = await axiosInstance.delete(`/api/donors/${id}`);
        if (response.data.success) {
          toast.success(response.data.message || 'Donor removed successfully');
          fetchDonors();
        } else {
          toast.error(response.data.error || 'Failed to delete donor');
        }
      } catch (err) {
        toast.error('Failed to delete donor');
      }
    }
  };

  const handleEditClick = (donor) => {
    setSelectedDonor(donor);
    setEditFormData({
      name: donor.name,
      phone: donor.phone,
      blood_type: donor.blood_type,
      age: donor.age,
      weight: donor.weight,
      is_eligible: donor.is_eligible
    });
    setShowEditModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.put(`/api/donors/${selectedDonor.id}`, editFormData);
      if (response.data.success) {
        toast.success(response.data.message || 'Donor updated successfully!');
        setShowEditModal(false);
        fetchDonors();
      } else {
        toast.error(response.data.error || 'Failed to update donor');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update donor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post('/api/donors', formData);
      if (response.data.success) {
        toast.success(response.data.message || 'New donor registered!');
        setShowAddModal(false);
        setFormData({ name: '', email: '', phone: '', blood_type: 'O+', age: '', weight: '' });
        fetchDonors();
      } else {
        toast.error(response.data.error || 'Failed to register donor');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to register donor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { header: 'Donor Name', accessor: 'name', render: (row) => (
      <div>
        <p className="font-bold text-[#2C3E50]">{row.name}</p>
        <p className="text-xs text-gray-400 font-medium">{row.phone || 'No phone'}</p>
      </div>
    )},
    { header: 'Blood Type', accessor: 'blood_type', render: (row) => <BloodTypeBadge type={row.blood_type} /> },
    { header: 'Last Donation', accessor: 'last_donation', render: (row) => <span className="text-sm font-medium text-gray-500">{row.last_donation || 'Never'}</span> },
    { header: 'Status', accessor: 'status', render: (row) => (
      <Badge variant={row.is_eligible !== false ? 'success' : 'danger'}>
        {row.is_eligible !== false ? 'Eligible' : 'Deferred'}
      </Badge>
    )},
    { header: 'Actions', accessor: 'actions', render: (row) => (
       <div className="flex items-center gap-2">
          <button 
            onClick={() => handleEditClick(row)}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDelete(row.id)}
            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
       </div>
    )},
  ];

  const filteredDonors = donors.filter(d => 
    (d.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (d.blood_type || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-12 text-center text-gray-400 font-bold">Syncing Donors List...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-[#C0392B] to-[#E74C3C] rounded-[1.5rem] p-6 mb-8 shadow-xl shadow-red-100 border border-white/10 group mt-4">
        <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
           <Users className="w-20 h-20 text-white" />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Donors Directory
              </h1>
              <p className="text-red-100/70 font-medium text-sm">
                Manage and view all registered life-savers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleExport}
              disabled={exporting}
              className="px-6 py-2.5 bg-white/10 backdrop-blur-md text-white text-xs font-black rounded-xl border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Export List
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2.5 bg-white text-[#C0392B] text-xs font-black rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Register New Donor
            </button>
          </div>
        </div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search donors by name, blood type, or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-100 rounded-2xl text-sm font-medium outline-none focus:border-rose-500 transition-all shadow-sm"
          />
        </div>

        <DataTable 
          columns={columns} 
          data={filteredDonors} 
        />
      </div>

      {/* Add Donor Modal */}
      <Modal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        title="Register New Donor"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input 
            label="Full Name" 
            placeholder="e.g. Ali Raza"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Email" 
              type="email"
              placeholder="ali@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <Input 
              label="Phone" 
              placeholder="+92 300 1234567"
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Blood Type</label>
            <select 
              className="w-full h-14 px-5 bg-white border-2 border-gray-100 rounded-2xl outline-none focus:border-rose-500 transition-all font-bold text-sm text-[#2C3E50] shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_10px_20px_rgba(225,29,72,0.1)]"
              value={formData.blood_type}
              onChange={(e) => setFormData({...formData, blood_type: e.target.value})}
            >
              {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Age" 
              type="number"
              placeholder="e.g. 25"
              required
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
            />
            <Input 
              label="Weight (kg)" 
              type="number"
              placeholder="e.g. 70"
              required
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: e.target.value})}
            />
          </div>

          <div className="pt-4 flex gap-3">
             <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">Cancel</Button>
             <Button type="submit" loading={isSubmitting} className="flex-1">Register Donor</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Donor Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        title="Update Donor Details"
      >
        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          <Input 
            label="Full Name" 
            placeholder="e.g. Ali Raza"
            required
            value={editFormData.name}
            onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
          />
          <Input 
            label="Phone" 
            placeholder="+92 300 1234567"
            required
            value={editFormData.phone}
            onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Blood Type</label>
              <select 
                className="w-full h-14 px-5 bg-white border-2 border-gray-100 rounded-2xl outline-none focus:border-rose-500 transition-all font-bold text-sm text-[#2C3E50] shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_10px_20px_rgba(225,29,72,0.1)]"
                value={editFormData.blood_type}
                onChange={(e) => setEditFormData({...editFormData, blood_type: e.target.value})}
              >
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Eligibility</label>
              <select 
                className="w-full h-14 px-5 bg-white border-2 border-gray-100 rounded-2xl outline-none focus:border-rose-500 transition-all font-bold text-sm text-[#2C3E50] shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_10px_20px_rgba(225,29,72,0.1)]"
                value={editFormData.is_eligible}
                onChange={(e) => setEditFormData({...editFormData, is_eligible: e.target.value === 'true'})}
              >
                <option value="true">Eligible</option>
                <option value="false">Deferred</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Age" 
              type="number"
              required
              value={editFormData.age}
              onChange={(e) => setEditFormData({...editFormData, age: e.target.value})}
            />
            <Input 
              label="Weight (kg)" 
              type="number"
              required
              value={editFormData.weight}
              onChange={(e) => setEditFormData({...editFormData, weight: e.target.value})}
            />
          </div>

          <div className="pt-4 flex gap-3">
             <Button type="button" variant="outline" onClick={() => setShowEditModal(false)} className="flex-1">Cancel</Button>
             <Button type="submit" loading={isSubmitting} className="flex-1">Update Details</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
