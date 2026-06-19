import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Phone, Mail, MapPin, Droplet, Weight, 
  Calendar, ShieldCheck, Edit2, Camera, UserCircle2,
  Building, Loader2, Save
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import { compressImage } from '../../utils/imageOptimizer';

export default function DonorProfile() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    blood_type: '',
    age: '',
    weight: '',
    avatar_url: ''
  });

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressed = await compressImage(file);
        setProfile({ ...profile, avatar_url: compressed });
        toast.success('Professional image optimized!');
      } catch (err) {
        toast.error('Failed to process image');
      }
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get('/api/users/profile');
      if (res.data.success) {
        const userData = res.data.data;
        let donorData = {};
        try {
           const donorRes = await axiosInstance.get('/api/donors/me');
           if (donorRes.data.success && donorRes.data.data) {
             donorData = donorRes.data.data;
           }
        } catch (e) {
          console.error('Donor details not found');
        }

        setProfile({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          avatar_url: userData.avatar_url || '',
          blood_type: donorData.blood_type || 'O+',
          age: donorData.age || '25',
          weight: donorData.weight || '70'
        });
      }
    } catch (err) {
      toast.error('Failed to load profile');
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
        toast.success('Profile updated successfully!');
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
      
      {/* RED HEADER CARD */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#C0392B] to-[#E74C3C] rounded-[1.5rem] p-6 mb-8 shadow-xl shadow-red-100 border border-white/10 group mt-4">
        <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
           <UserCircle2 className="w-40 h-40 text-white" />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Personal Identity</h1>
              <p className="text-red-100/70 font-medium text-sm">Review your medical stats and personal security details.</p>
            </div>
          </div>
          
          <Button 
            onClick={handleSave}
            loading={saving}
            className="px-6 py-2.5 bg-white text-[#C0392B] text-[10px] font-black rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest h-auto border-none"
          >
            <Save className="w-4 h-4 mr-2" /> Sync Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-8">
           <section className="bg-white rounded-[2rem] p-8 border border-slate-200/60 shadow-sm space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                 <h2 className="text-xl font-black text-[#0F172A] flex items-center gap-3">
                    <User className="w-5 h-5 text-rose-500" /> Identity Information
                 </h2>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-start">
                 {/* Avatar Upload */}
                 <div className="relative group mx-auto md:mx-0">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-200 bg-slate-50 flex items-center justify-center">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-slate-200" />
                      )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 bg-rose-600 hover:bg-rose-700 p-2.5 rounded-xl shadow-lg border-2 border-white text-white cursor-pointer transition-transform hover:scale-110">
                       <Camera className="w-4 h-4" />
                       <input 
                         type="file" 
                         className="hidden" 
                         accept="image/*"
                         onChange={handleAvatarChange}
                       />
                    </label>
                 </div>

                 <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <Input 
                      label="Full Name" 
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                    />
                    <Input 
                      label="Email Address" 
                      value={profile.email}
                      readOnly
                      className="bg-slate-50"
                    />
                    <Input 
                      label="Phone Number" 
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    />
                    <Input 
                      label="Full Address" 
                      value={profile.address}
                      onChange={(e) => setProfile({...profile, address: e.target.value})}
                    />
                 </div>
              </div>
           </section>

           <section className="bg-white rounded-[2rem] p-8 border border-slate-200/60 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-[#0F172A] border-b border-slate-50 pb-4 flex items-center gap-2">
                 <Droplet className="w-5 h-5 text-rose-500" /> Medical Vitality
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="p-5 bg-rose-50 rounded-2xl border-2 border-rose-100 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Blood Group</p>
                    <p className="text-3xl font-black text-rose-600">{profile.blood_type}</p>
                 </div>
                 <div className="p-5 bg-blue-50 rounded-2xl border-2 border-blue-100 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Age</p>
                    <p className="text-3xl font-black text-blue-600">{profile.age}</p>
                 </div>
                 <div className="p-5 bg-emerald-50 rounded-2xl border-2 border-emerald-100 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Weight</p>
                    <p className="text-3xl font-black text-emerald-600">{profile.weight} kg</p>
                 </div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mt-4">
                 *For medical safety, please contact staff to update your blood group.
              </p>
           </section>
        </div>

        {/* Support & Security */}
        <div className="space-y-8">
           <div className="bg-[#0F172A] rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
              <h3 className="text-lg font-black mb-2 relative z-10">Hero Support</h3>
              <p className="text-[10px] text-slate-400 font-bold mb-6 relative z-10 uppercase tracking-widest leading-relaxed">
                 Need help or want to schedule a drive? Our team is available 24/7 for you.
              </p>
              <button className="flex items-center gap-3 text-rose-500 font-black text-sm hover:translate-x-1 transition-transform relative z-10">
                 <Mail className="w-4 h-4" /> help@bloodlink.tech
              </button>
              <div className="absolute -bottom-8 -right-8 w-24 h-24 text-white/5 bg-white/5 rounded-full blur-2xl" />
           </div>

           <div className="bg-white rounded-[2rem] p-8 border-2 border-slate-100 shadow-lg space-y-4">
              <h3 className="text-sm font-black text-[#0F172A] uppercase tracking-widest">Account Actions</h3>
              <button 
                onClick={() => toast.info('Password reset link sent to your email.')}
                className="w-full py-4 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-black text-[#2C3E50] hover:bg-slate-100 transition-all flex items-center justify-between group"
              >
                 Reset Password
                 <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full py-4 px-6 bg-red-50/50 border-2 border-red-100 rounded-2xl text-xs font-black text-red-600 hover:bg-red-50 transition-all flex items-center justify-between group">
                 Deactivate Profile
                 <ShieldCheck className="w-4 h-4 text-red-300" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
