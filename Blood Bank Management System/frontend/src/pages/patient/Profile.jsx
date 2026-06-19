import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Phone, Mail, MapPin, Droplet, Heart,
  ShieldCheck, Edit2, Camera, UserCircle2,
  Loader2, Save, FileText, Activity
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';

export default function PatientProfile() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    blood_type: 'O+',
    avatar_url: ''
  });

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get('/api/users/profile');
      if (res.data.success) {
        setProfile({
          name: res.data.data.name || '',
          email: res.data.data.email || '',
          phone: res.data.data.phone || '',
          address: res.data.data.address || '',
          blood_type: res.data.data.blood_type || 'O+',
          avatar_url: res.data.data.avatar_url || ''
        });
      }
    } catch (err) {
      toast.error('Failed to load patient profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axiosInstance.put('/api/users/profile', profile);
      if (res.data.success) {
        toast.success('Your patient profile has been updated!');
        if (setUser) setUser(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to save profile changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      
      {/* PATIENT HEADER CARD */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 to-slate-900 rounded-[2rem] p-10 mb-8 shadow-xl border border-white/10 group mt-4">
        <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
           <Heart className="w-40 h-40 text-rose-500" />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center border border-white/20 shadow-lg">
              <Activity className="w-8 h-8 text-rose-500" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight uppercase">Medical Identity</h1>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Patient Portal • High Priority Access</p>
            </div>
          </div>
          
          <Button 
            onClick={handleSave}
            loading={saving}
            className="px-8 py-4 bg-rose-600 text-white text-[10px] font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest h-auto border-none"
          >
            <Save className="w-4 h-4 mr-2" /> Sync Records
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-10">
              <div className="flex items-center justify-between border-b border-slate-50 pb-8">
                 <h2 className="text-2xl font-black text-[#0F172A] flex items-center gap-4">
                    <UserCircle2 className="w-6 h-6 text-rose-500" /> Identity Information
                 </h2>
              </div>

              <div className="flex flex-col md:flex-row gap-10 items-start">
                 {/* Avatar Upload */}
                 <div className="relative group mx-auto md:mx-0">
                    <div className="w-36 h-36 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-100 bg-slate-50 flex items-center justify-center">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-14 h-14 text-slate-200" />
                      )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 bg-rose-600 hover:bg-rose-700 p-3 rounded-2xl shadow-lg border-2 border-white text-white cursor-pointer transition-transform hover:scale-110">
                       <Camera className="w-5 h-5" />
                       <input 
                         type="file" 
                         className="hidden" 
                         accept="image/*"
                         onChange={(e) => {
                           const file = e.target.files[0];
                           if (file) {
                             const reader = new FileReader();
                             reader.onloadend = () => setProfile({ ...profile, avatar_url: reader.result });
                             reader.readAsDataURL(file);
                           }
                         }}
                       />
                    </label>
                 </div>

                 <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    <Input 
                      label="Full Name" 
                      className="rounded-2xl h-14 bg-slate-50 border-slate-100"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                    />
                    <Input 
                      label="Primary Email" 
                      className="rounded-2xl h-14 bg-slate-100 border-slate-100 text-slate-400"
                      value={profile.email}
                      readOnly
                    />
                    <Input 
                      label="Emergency Phone" 
                      className="rounded-2xl h-14 bg-slate-50 border-slate-100"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    />
                    <Input 
                      label="Home Address" 
                      className="rounded-2xl h-14 bg-slate-50 border-slate-100"
                      value={profile.address}
                      onChange={(e) => setProfile({...profile, address: e.target.value})}
                    />
                 </div>
              </div>
           </section>

           <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">Medical Metadata</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 <div className="p-6 bg-rose-50 rounded-3xl border-2 border-rose-100 text-center">
                    <Droplet className="w-6 h-6 text-rose-500 mx-auto mb-2" />
                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Type</p>
                    <p className="text-xl font-black text-rose-600">O+</p>
                 </div>
                 <div className="p-6 bg-slate-50 rounded-3xl border-2 border-slate-100 text-center col-span-1 md:col-span-3 flex items-center justify-between px-10">
                    <div className="text-left">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical Record No.</p>
                       <p className="font-black text-[#0F172A] tracking-tighter">#MED-BL-99-XXXX</p>
                    </div>
                    <ShieldCheck className="w-8 h-8 text-slate-200" />
                 </div>
              </div>
           </section>
        </div>

        <div className="space-y-8">
           <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                 <FileText className="w-7 h-7 text-slate-300" />
              </div>
              <h3 className="text-xl font-black text-[#0F172A] mb-4">Patient Advocacy</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed mb-10">
                 Our team is here to support you in securing blood units and managing donor lists.
              </p>
              <button className="w-full py-4 px-6 bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg">
                 Contact Support
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
