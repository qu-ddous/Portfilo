import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, History, Droplet, Play, CheckCircle } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import axiosInstance from '../../api/axiosInstance';
import { useInventoryStore } from '../../store/inventoryStore';
import { toast } from 'sonner';

export default function RecordDonation() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const { addInventory } = useInventoryStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/api/donors?search=${searchTerm}`);
      setResults(res.data);
      if (res.data.length === 0) toast.error('No donor found');
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStartDraw = async () => {
    try {
      // 1. Add to Inventory
      await addInventory({
        blood_type: selectedDonor.blood_type,
        units: 450, // Standard unit
        collection_date: new Date().toISOString().split('T')[0],
        expiry_date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });

      // 2. Update Donor Last Donation (Optional but good)
      await axiosInstance.put(`/api/donors/${selectedDonor.id}`, {
        last_donation: new Date().toISOString().split('T')[0]
      });

      toast.success(`Blood Collection Recorded for ${selectedDonor.name}! Units added to Inventory.`);
      setSelectedDonor(null);
      setSearchTerm('');
      setResults([]);
    } catch (err) {
      toast.error('Failed to complete collection process.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[#2C3E50] tracking-tight">Record Blood Donation</h1>
        <p className="text-gray-500 font-medium mt-1">Search for an existing donor to begin the blood collection phase.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input 
              placeholder="Enter Donor Name, Email or Phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit" loading={loading} className="sm:mt-0 font-bold shrink-0">Search Donor</Button>
        </form>

        {results.length > 0 && !selectedDonor && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Select Donor</h3>
            {results.map((donor) => (
              <motion.div 
                key={donor.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedDonor(donor)}
                className="p-4 border-2 border-gray-100 hover:border-red-200 hover:bg-red-50/30 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 group-hover:bg-red-100 rounded-xl flex items-center justify-center font-black text-gray-400 group-hover:text-red-500 transition-colors">
                    {donor.blood_type}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2C3E50]">{donor.name} <span className="text-xs text-gray-400 ml-1">#{donor.id.slice(0,8)}</span></h4>
                    <p className="text-xs font-semibold mt-0.5 text-gray-500 flex items-center gap-1">
                      <History className="w-3 h-3" /> Last: {donor.last_donation || 'Never'}
                    </p>
                  </div>
                </div>
                <Badge variant={donor.is_eligible !== false ? 'success' : 'danger'}>{donor.is_eligible !== false ? 'Eligible' : 'Deferred'}</Badge>
              </motion.div>
            ))}
          </div>
        )}

        {selectedDonor && (
           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 border-t-2 border-dashed border-gray-200 pt-8">
             <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />
               <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                 <Droplet className="text-red-500 fill-current w-5 h-5" /> Donation Protocol
               </h3>

               <div className="space-y-6">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                     <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Type Match</p>
                     <p className="font-bold text-white mt-0.5">{selectedDonor.blood_type}</p>
                   </div>
                   <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                     <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Weight</p>
                     <p className="font-bold text-white mt-0.5">Verified</p>
                   </div>
                 </div>

                 <p className="text-sm font-medium text-emerald-300 flex items-center gap-2 bg-emerald-500/10 p-3 border border-emerald-500/20 rounded-xl">
                   <CheckCircle className="w-4 h-4" /> Eligibility Confirmed. Ready to Sync.
                 </p>

                 <button onClick={handleStartDraw} className="w-full py-4 bg-[#E74C3C] text-white font-black rounded-xl hover:bg-[#C0392B] transition-colors flex items-center justify-center gap-3 shadow-[0_4px_0_#922B21] active:translate-y-1 active:shadow-none">
                   <Play className="w-5 h-5 fill-current" /> Initialize Collection
                 </button>
               </div>
             </div>
             
             <button onClick={() => setSelectedDonor(null)} className="mt-4 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
               ← Cancel and search another donor
             </button>
           </motion.div>
        )}
      </div>
    </div>
  );
}
