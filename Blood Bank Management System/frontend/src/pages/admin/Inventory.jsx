import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, AlertTriangle, ArrowRight, Plus, X, Trash2, Download, Loader2 } from 'lucide-react';
import { DataTable } from '../../components/shared/DataTable';
import { Badge } from '../../components/ui/Badge';
import { BloodTypeBadge } from '../../components/shared/BloodTypeBadge';
import { useInventoryStore } from '../../store/inventoryStore';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { toast } from 'sonner';
import { exportToPDF } from '../../utils/export';
import axiosInstance from '../../api/axiosInstance';

export default function BloodInventory() {
  const { inventory, lowStockTypes, isLoading, addInventory, deleteInventory } = useInventoryStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [sendingAlert, setSendingAlert] = useState(false);
  const [formData, setFormData] = useState({
    blood_type: 'O+',
    units: 1,
    collection_date: new Date().toISOString().split('T')[0],
    expiry_date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const columns = [
    { header: 'Blood Type', accessor: 'blood_type', render: (row) => <BloodTypeBadge type={row.blood_type} /> },
    { header: 'Total Units', accessor: 'units', render: (row) => <span className="font-black text-lg text-[#2C3E50]">{row.units}</span> },
    { header: 'Status', accessor: 'status', render: (row) => (
      <Badge variant={row.units > 20 ? 'success' : row.units > 5 ? 'warning' : 'danger'}>
        {row.units > 20 ? 'Healthy' : row.units > 5 ? 'Warning' : 'Critical'}
      </Badge>
    )},
    { header: 'Actions', accessor: 'actions', render: (row) => (
      <button 
        onClick={() => handleDelete(row.id)}
        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
        title="Delete Batch"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    )},
  ];

  const handleExport = async () => {
    setExporting(true);
    const columns = ['Blood Type', 'Units (ml)', 'Collection Date', 'Expiry Date', 'Status'];
    const data = inventory.map(item => [
      item.blood_type,
      `${item.units}ml`,
      new Date(item.collection_date).toLocaleDateString(),
      new Date(item.expiry_date).toLocaleDateString(),
      item.units > 20 ? 'Healthy' : item.units > 5 ? 'Warning' : 'Critical'
    ]);
    
    const success = await exportToPDF('Blood Inventory Report', columns, data, 'BloodLink_Inventory');
    if (success) toast.success('Inventory report exported as PDF');
    setExporting(false);
  };

  const triggerDonorAlert = async () => {
    if (!window.confirm('Send emergency alert to all registered donors regarding shortages?')) return;
    
    setSendingAlert(true);
    try {
      const res = await axiosInstance.post('/api/notifications/broadcast', {
        message: 'URGENT: Blood Link is running low on critical blood groups. Please visit for donation if eligible.',
        type: 'emergency'
      });
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to broadcast donor alert');
    } finally {
      setSendingAlert(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blood batch?')) {
      try {
        await deleteInventory(id);
        toast.success('Batch deleted successfully');
      } catch (err) {
        toast.error('Failed to delete batch');
      }
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addInventory(formData);
      toast.success('New blood batch added!');
      setShowAddModal(false);
    } catch (err) {
      toast.error('Failed to add blood batch');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayData = inventory.length > 0 ? inventory : [];
  const criticalItems = displayData.filter(d => d.units < 10);

  if (isLoading) return <div className="p-12 text-center font-bold text-gray-400 border-none">Syncing with Backend...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-[#C0392B] to-[#E74C3C] rounded-[1.5rem] p-6 mb-8 shadow-xl shadow-red-100 border border-white/10 group mt-4">
        <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
           <Droplets className="w-20 h-20 text-white" />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Blood Inventory
              </h1>
              <p className="text-red-100/70 font-medium text-sm">
                Real-time stock monitoring & management.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleExport}
              disabled={exporting}
              className="px-6 py-2.5 bg-white/10 backdrop-blur-md text-white text-xs font-black rounded-xl border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Export Stock
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2.5 bg-white text-[#C0392B] text-xs font-black rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Stock
            </button>
          </div>
        </div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {displayData.length === 0 ? (
             <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
                <Droplets className="w-12 h-12 text-gray-200 mb-4" />
                <h3 className="font-bold text-gray-400">Inventory is Empty</h3>
                <p className="text-sm text-gray-400">Add new blood units to start tracking.</p>
             </div>
          ) : (
            <DataTable columns={columns} data={displayData} />
          )}
        </div>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#2C3E50] to-[#1a252f] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-black text-xl mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" /> Shortages
              </h3>
              <div className="space-y-3">
                {criticalItems.length === 0 ? (
                  <p className="text-xs font-medium text-white/50 italic py-4">No critical shortages today.</p>
                ) : (
                  criticalItems.map(item => (
                    <div key={item.id} className="bg-white/5 rounded-xl p-3 flex items-center justify-between border border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-rose-500 text-white font-black rounded-lg flex items-center justify-center text-sm shadow-lg shadow-rose-900/20">
                          {item.blood_type}
                        </span>
                        <span className="font-bold text-sm">{item.units} units</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <button 
                onClick={triggerDonorAlert}
                disabled={sendingAlert}
                className="w-full mt-6 bg-rose-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-rose-500 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {sendingAlert ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
                Trigger Donor Alert
              </button>
            </div>
            <Droplets className="absolute -bottom-10 -right-10 w-40 h-40 text-white/5 rotate-12" />
          </div>
        </div>
      </div>

      <Modal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        title="Add New Blood Batch"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
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
            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Units (ml)</label>
              <input 
                type="number"
                className="w-full h-14 px-5 bg-white border-2 border-gray-100 rounded-2xl outline-none focus:border-rose-500 transition-all font-bold text-sm text-[#2C3E50] placeholder:text-gray-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_10px_20px_rgba(225,29,72,0.1)]"
                value={formData.units}
                onChange={(e) => setFormData({...formData, units: parseInt(e.target.value)})}
                min="1"
                placeholder="e.g. 500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <Input 
                label="Collection Date" 
                type="date" 
                value={formData.collection_date}
                onChange={(e) => setFormData({...formData, collection_date: e.target.value})}
             />
             <Input 
                label="Expiry Date" 
                type="date" 
                value={formData.expiry_date}
                onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
             />
          </div>

          <div className="pt-4 flex gap-3">
             <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">Cancel</Button>
             <Button type="submit" loading={isSubmitting} className="flex-1">Add Batch</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
