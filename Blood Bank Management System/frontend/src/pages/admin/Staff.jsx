import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Users, User, Phone, Mail, X } from 'lucide-react';
import { DataTable } from '../../components/shared/DataTable';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'sonner';

export default function StaffManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchStaff = async () => {
    try {
      const res = await axiosInstance.get('/api/users/staff');
      setStaff(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch staff');
      toast.error('Failed to load staff members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      try {
        await axiosInstance.delete(`/api/users/${id}`);
        toast.success('Staff member removed successfully');
        fetchStaff();
      } catch (err) {
        toast.error('Failed to delete staff member');
      }
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axiosInstance.post('/api/users/staff', formData);
      toast.success('New staff member registered!');
      setShowAddModal(false);
      setFormData({ name: '', email: '', phone: '' });
      fetchStaff();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add staff');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { 
      header: 'Staff Member', 
      accessor: 'name', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 font-bold">
            {(row.name || 'S')[0]}
          </div>
          <div>
            <p className="font-bold text-[#2C3E50]">{row.name}</p>
            <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest">{row.role}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Contact Info', 
      accessor: 'email', 
      render: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Mail className="w-3 h-3" /> {row.email}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Phone className="w-3 h-3" /> {row.phone || 'N/A'}
          </div>
        </div>
      )
    },
    { 
      header: 'Joined On', 
      accessor: 'created_at', 
      render: (row) => (
        <span className="text-sm font-medium text-gray-400">
          {new Date(row.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
        </span>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status', 
      render: (row) => (
        <Badge variant="success">Active</Badge>
      )
    },
    { 
      header: 'Actions', 
      accessor: 'actions', 
      render: (row) => (
        <div className="flex gap-2">
           <button 
             onClick={() => handleDelete(row.id)}
             className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
           >
             <Trash2 className="w-4 h-4" />
           </button>
        </div>
      )
    },
  ];

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Standardized Red Header Card */}
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
                Staff Management
              </h1>
              <p className="text-red-100/70 font-medium text-sm">
                Manage your team and platform access.
              </p>
            </div>
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2.5 bg-white text-[#C0392B] text-xs font-black rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Staff Member
          </button>
        </div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="space-y-4">
        <div className="relative max-w-md mb-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search staff by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-100 rounded-2xl text-sm font-bold text-[#2C3E50] outline-none focus:border-rose-500 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_10px_20px_rgba(225,29,72,0.1)]"
          />
        </div>

        <DataTable 
          columns={columns} 
          data={staff.filter(d => 
            (d.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
            (d.email || '').toLowerCase().includes(searchTerm.toLowerCase())
          )} 
        />
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Staff Member"
      >
        <form onSubmit={handleAddStaff} className="space-y-5">
          <Input 
            label="Full Name"
            placeholder="Enter full name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input 
            label="Email Address"
            type="email"
            placeholder="staff@bloodlink.com"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <Input 
            label="Phone Number"
            placeholder="0321-XXXXXXX"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="flex-1 py-4 bg-gray-100 text-gray-500 text-sm font-black rounded-2xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={submitting}
              type="submit"
              className="flex-[2] py-4 bg-gradient-to-r from-[#C0392B] to-[#E74C3C] text-white text-sm font-black rounded-2xl shadow-xl shadow-red-200 hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
            >
              {submitting ? 'Adding...' : 'Confirm Registration'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
