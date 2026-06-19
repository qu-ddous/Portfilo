import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, Activity, Trash2, Edit2, UserPlus, Heart, Download, Loader2 } from 'lucide-react';
import { DataTable } from '../../components/shared/DataTable';
import { Badge } from '../../components/ui/Badge';
import { BloodTypeBadge } from '../../components/shared/BloodTypeBadge';
import axiosInstance from '../../api/axiosInstance';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { toast } from 'sonner';
import { exportToPDF } from '../../utils/export';

export default function PatientsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  
  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    blood_type: 'O+',
    medical_condition: ''
  });

  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '',
    blood_type: '',
    medical_condition: ''
  });

  const fetchPatients = async () => {
    try {
      const res = await axiosInstance.get('/api/patients');
      if (res.data.success) {
        setPatients(res.data.data);
      } else {
        setPatients(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error('Failed to fetch patients');
      toast.error('Could not sync patients directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleExport = async () => {
    setExporting(true);
    const columns = ['Patient Name', 'Phone', 'Blood Type', 'Medical Condition', 'Registration Date'];
    const data = filteredPatients.map(p => [
      p.name,
      p.phone || 'N/A',
      p.blood_type,
      p.medical_condition,
      new Date(p.created_at).toLocaleDateString()
    ]);
    
    const success = await exportToPDF('Patients Directory', columns, data, 'BloodLink_Patients');
    if (success) toast.success('Patients list exported as PDF');
    setExporting(false);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post('/api/patients', formData);
      if (response.data.success) {
        toast.success(response.data.message || 'Patient registered successfully!');
        setShowAddModal(false);
        setFormData({ name: '', email: '', phone: '', blood_type: 'O+', medical_condition: '' });
        fetchPatients();
      } else {
        toast.error(response.data.error || 'Failed to register patient');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to register patient');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (patient) => {
    setSelectedPatient(patient);
    setEditFormData({
      name: patient.name,
      phone: patient.phone,
      blood_type: patient.blood_type,
      medical_condition: patient.medical_condition
    });
    setShowEditModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.put(`/api/patients/${selectedPatient.id}`, editFormData);
      if (response.data.success) {
        toast.success(response.data.message || 'Patient record updated!');
        setShowEditModal(false);
        fetchPatients();
      } else {
        toast.error(response.data.error || 'Failed to update patient');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update patient');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this patient record?')) {
      try {
        const response = await axiosInstance.delete(`/api/patients/${id}`);
        if (response.data.success) {
          toast.success(response.data.message || 'Patient removed');
          fetchPatients();
        } else {
          toast.error(response.data.error || 'Failed to delete patient');
        }
      } catch (err) {
        toast.error('Failed to delete patient');
      }
    }
  };

  const columns = [
    { header: 'Patient Name', accessor: 'name', render: (row) => (
      <div>
        <p className="font-bold text-[#2C3E50] flex items-center gap-2">
          {row.name}
          {row.medical_condition?.toLowerCase().includes('critical') && (
            <Activity className="w-3 h-3 text-red-500 animate-pulse" title="High Priority/Critical" />
          )}
        </p>
        <p className="text-xs text-gray-400 font-medium">{row.phone || 'No phone'}</p>
      </div>
    )},
    { header: 'Blood Type', accessor: 'blood_type', render: (row) => <BloodTypeBadge type={row.blood_type} /> },
    { header: 'Condition', accessor: 'medical_condition', render: (row) => <span className="text-sm font-semibold text-gray-600 truncate max-w-[200px] block">{row.medical_condition || 'Stable'}</span> },
    { header: 'Registered', accessor: 'created_at', render: (row) => <span className="text-xs text-gray-400 font-medium">{new Date(row.created_at).toLocaleDateString()}</span> },
    { header: 'Actions', accessor: 'actions', render: (row) => (
       <div className="flex items-center gap-2">
          <button 
            onClick={() => handleEditClick(row)}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Details"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDelete(row.id)}
            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
            title="Remove Patient"
          >
            <Trash2 className="w-4 h-4" />
          </button>
       </div>
    )},
  ];

  const filteredPatients = patients.filter(d => 
    (d.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (d.medical_condition || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.blood_type || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-12 text-center text-gray-400 font-bold">Syncing Patients Directory...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-[#C0392B] to-[#E74C3C] rounded-[1.5rem] p-6 mb-8 shadow-xl shadow-red-100 border border-white/10 group mt-4">
        <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
           <Activity className="w-20 h-20 text-white" />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Patients Directory
              </h1>
              <p className="text-red-100/70 font-medium text-sm">
                Monitoring and managing patient care.
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
              <Plus className="w-4 h-4" /> Register New Patient
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
            placeholder="Search patients by name or condition..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-100 rounded-2xl text-sm font-medium outline-none focus:border-rose-500 transition-all shadow-sm"
          />
        </div>

        <DataTable 
          columns={columns} 
          data={filteredPatients} 
        />
      </div>

      {/* Register Patient Modal */}
      <Modal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        title="Register New Patient"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <Input 
            label="Full Name" 
            placeholder="e.g. Ahmad Khan"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Email" 
              type="email"
              placeholder="ahmad@example.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <Input 
              label="Phone" 
              placeholder="03001234567"
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
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
            <Input 
              label="Medical Condition" 
              placeholder="e.g. Critical, Surgery..."
              required
              value={formData.medical_condition}
              onChange={(e) => setFormData({...formData, medical_condition: e.target.value})}
            />
          </div>

          <div className="pt-4 flex gap-3">
             <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">Cancel</Button>
             <Button type="submit" loading={isSubmitting} className="flex-1">Register Patient</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Patient Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        title="Update Patient Details"
      >
        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          <Input 
            label="Full Name" 
            required
            value={editFormData.name}
            onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
          />
          <Input 
            label="Phone" 
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
            <Input 
              label="Medical Condition" 
              required
              value={editFormData.medical_condition}
              onChange={(e) => setEditFormData({...editFormData, medical_condition: e.target.value})}
            />
          </div>

          <div className="pt-4 flex gap-3">
             <Button type="button" variant="outline" onClick={() => setShowEditModal(false)} className="flex-1">Cancel</Button>
             <Button type="submit" loading={isSubmitting} className="flex-1">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
