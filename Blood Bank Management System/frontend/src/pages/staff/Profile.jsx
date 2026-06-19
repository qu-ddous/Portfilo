import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Phone, Mail, ShieldCheck, Edit2, Camera, 
  UserCircle2, Building, Loader2, Save, BadgeCheck,
  Stethoscope, Briefcase, History
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';

export default function StaffProfile() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
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
          avatar_url: res.data.data.avatar_url || ''
        });
      }
    } catch (err) {
      toast.error('Failed to load staff profile');
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
        toast.success('Your professional profile has been updated!');
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
      <Loader2 className="w-10 h-10 text-[#C0392B] animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      
      {/* STAFF HEADER CARD */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#2C3E50] to-[#1a252f] rounded-[1.5rem] p-8 mb-8 shadow-xl border border-white/10 group mt-4">
        <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
           <Briefcase className="w-40 h-40 text-white" />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
              <BadgeCheck className="w-8 h-8 text-[#E74C3C]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight uppercase">Staff Credentials</h1>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Employee Portal • {user?.role?.toUpperCase()} ID</p>
            </div>
          </div>
          
          <Button 
            onClick={handleSave}
            loading={saving}
            className="px-8 py-3 bg-[#E74C3C] text-white text-[10px] font-black rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest h-auto border-none"
          >
            <Save className="w-4 h-4 mr-2" /> Commit Updates
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <section className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm space-y-10">
              <div className="flex items-center justify-between border-b border-slate-50 pb-8">
                 <h2 className="text-2xl font-black text-[#0F172A] flex items-center gap-4">
                    <UserCircle2 className="w-6 h-6 text-[#C0392B]" /> Professional Identity
                 </h2>
              </div>

              <div className="flex flex-col md:flex-row gap-10 items-start">
                 {/* Avatar Upload */}
                 <div className="relative group mx-auto md:mx-0">
                    <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-100 bg-slate-50 flex items-center justify-center">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-16 h-16 text-slate-200" />
                      )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 bg-[#C0392B] hover:bg-[#E74C3C] p-3 rounded-2xl shadow-lg border-2 border-white text-white cursor-pointer transition-transform hover:scale-110">
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
                      label="Full Professional Name" 
                      className="rounded-2xl h-14 bg-slate-50 border-slate-100"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                    />
                    <Input 
                      label="Company Email" 
                      className="rounded-2xl h-14 bg-slate-100 border-slate-100 text-slate-400"
                      value={profile.email}
                      readOnly
                    />
                    <Input 
                      label="Emergency Contact" 
                      className="rounded-2xl h-14 bg-slate-50 border-slate-100"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    />
                    <div className="p-4 bg-slate-50 rounded-2xl flex flex-col justify-center">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned Role</span>
                       <span className="text-sm font-black text-[#2C3E50]">{user?.role?.toUpperCase()} OFFICER</span>
                    </div>
                 </div>
              </div>
           </section>
        </div>

        <div className="space-y-8">
           <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group border-b-4 border-b-[#C0392B]">
              <h3 className="text-xl font-black text-[#0F172A] mb-4">Security Protocol</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 leading-relaxed">
                 Manage your access credentials and workstation security here.
              </p>
              <button 
                onClick={() => toast.info('Access code refresh link sent.')}
                className="w-full py-4 bg-[#2C3E50] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-[#1a252f] shadow-lg"
              >
                Reset Access Key
              </button>
           </div>

           <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-slate-100">
                 <History className="w-8 h-8 text-slate-300" />
              </div>
              <h4 className="text-sm font-black text-[#0F172A] uppercase tracking-widest">Audit Log</h4>
              <p className="text-[10px] font-bold text-slate-400 mt-2">Last active: {new Date().toLocaleTimeString()}</p>
           </div>
        </div>
      </div>
    </div>
  );
}
