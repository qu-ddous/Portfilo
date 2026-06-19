import React, { useState, useEffect } from 'react';
import { 
  Save, Shield, Sliders, Bell, Globe, 
  Database, Building, Lock, Cpu, Mail, Loader2, User as UserIcon, Camera
} from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import { compressImage } from '../../utils/imageOptimizer';

export default function AdminSettings() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  
  // System Settings
  const [settings, setSettings] = useState({
    hospital_name: '',
    license_number: '',
    email: '',
    phone: '',
    address: '',
    min_donation_interval: 90,
    inventory_low_threshold: 10,
    expiry_warning_days: 3,
    fulfillment_strategy: 'FIFO',
    emergency_mode: false,
    public_stocks_view: true,
    accept_guest_donors: false,
    two_factor_auth: true,
    auto_backups: true
  });

  // Admin Profile Settings
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    avatar_url: ''
  });

  const fetchData = async () => {
    try {
      const [settingsRes, profileRes] = await Promise.all([
        axiosInstance.get('/api/settings'),
        axiosInstance.get('/api/users/profile')
      ]);

      if (settingsRes.data.success) {
        setSettings(prev => ({ ...prev, ...settingsRes.data.data }));
      }
      if (profileRes.data.success) {
        setProfile({
          name: profileRes.data.data.name || '',
          email: profileRes.data.data.email || '',
          phone: profileRes.data.data.phone || '',
          avatar_url: profileRes.data.data.avatar_url || ''
        });
      }
    } catch (err) {
      toast.error('Could not load system configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const res = await axiosInstance.post('/api/settings', settings);
      if (res.data.success) {
        toast.success('System settings updated successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update system settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true);
      const res = await axiosInstance.put('/api/users/profile', profile);
      if (res.data.success) {
        toast.success('Admin profile updated!');
        if (setUser) {
          setUser(res.data.data);
        }
      }
    } catch (err) {
      toast.error('Failed to update personal profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressed = await compressImage(file);
        setProfile({ ...profile, avatar_url: compressed });
        toast.success('Image optimized!');
      } catch (err) {
        toast.error('Failed to process image');
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateField = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      
      {/* Red Header Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#C0392B] to-[#E74C3C] rounded-[1.5rem] p-6 mb-8 shadow-xl shadow-red-100 border border-white/10 group mt-4">
        <div className="absolute top-0 right-0 p-4 opacity-5 transform group-hover:scale-110 transition-transform duration-500">
           <Sliders className="w-40 h-40 text-white" />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
              <Sliders className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">System Configuration</h1>
              <p className="text-red-100/70 font-medium text-sm">Manage institutional rules, security, and profile.</p>
            </div>
          </div>
          
          <Button 
            onClick={handleSaveSettings}
            loading={saving}
            className="px-6 py-2.5 bg-white text-[#C0392B] text-[10px] font-black rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest h-auto border-none"
          >
            <Save className="w-4 h-4 mr-2" /> Sync Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Organization & Profile */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* PERSONAL PROFILE SECTION */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
               <h2 className="text-xl font-black text-[#0F172A] flex items-center gap-3">
                  <UserIcon className="w-5 h-5 text-rose-500" /> Admin Profile
               </h2>
               <Button variant="outline" size="sm" onClick={handleSaveProfile} loading={savingProfile}>Update Profile</Button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
               <div className="relative group mx-auto md:mx-0">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-200 bg-slate-50 flex items-center justify-center">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-12 h-12 text-slate-200" />
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
                    label="Full Legal Name" 
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                  <Input 
                    label="Work Email" 
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                  />
                  <Input 
                    label="Personal Phone" 
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  />
                  <div className="flex items-end">
                    <Button 
                      className="w-full h-14 rounded-2xl bg-[#0F172A] text-white font-black"
                      onClick={handleSaveProfile} 
                      loading={savingProfile}
                    >
                       SAVE PERSONAL PROFILE
                    </Button>
                  </div>
               </div>
            </div>
          </section>

          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm space-y-6">
            <h2 className="text-xl font-black text-[#0F172A] border-b border-slate-50 pb-4 flex items-center gap-2">
               <Building className="w-5 h-5 text-rose-500" /> Institution Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Hospital/Center Name" 
                value={settings.hospital_name} 
                onChange={(e) => updateField('hospital_name', e.target.value)}
              />
              <Input 
                label="Registry License #" 
                value={settings.license_number}
                onChange={(e) => updateField('license_number', e.target.value)}
              />
              <Input 
                label="Official Center Email" 
                value={settings.email}
                onChange={(e) => updateField('email', e.target.value)}
              />
              <Input 
                label="Support Phone" 
                value={settings.phone}
                onChange={(e) => updateField('phone', e.target.value)}
              />
              <div className="md:col-span-2">
                <Input 
                  label="Facility Full Address" 
                  value={settings.address}
                  onChange={(e) => updateField('address', e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm space-y-6">
            <h2 className="text-xl font-black text-[#0F172A] border-b border-slate-50 pb-4 flex items-center gap-2">
               <Cpu className="w-5 h-5 text-rose-500" /> Operational Rules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Min Donation Interval (Days)" 
                type="number" 
                value={settings.min_donation_interval}
                onChange={(e) => updateField('min_donation_interval', Number(e.target.value))}
              />
              <Input 
                label="Stock Low Warning Threshold" 
                type="number" 
                value={settings.inventory_low_threshold}
                onChange={(e) => updateField('inventory_low_threshold', Number(e.target.value))}
              />
              <Input 
                label="Batch Expiry Alarm (Days)" 
                type="number" 
                value={settings.expiry_warning_days}
                onChange={(e) => updateField('expiry_warning_days', Number(e.target.value))}
              />
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Fulfillment Logic</label>
                <select 
                  value={settings.fulfillment_strategy}
                  onChange={(e) => updateField('fulfillment_strategy', e.target.value)}
                  className="w-full h-14 px-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-sm text-[#0F172A] outline-none focus:border-rose-500 transition-all cursor-pointer"
                >
                  <option value="FIFO">FIFO (First In First Out)</option>
                  <option value="LIFO">LIFO (Last In First Out)</option>
                  <option value="FEFO">Expiring Soonest (FEFO)</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Toggles */}
        <div className="space-y-8">
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm space-y-6">
            <h2 className="text-xl font-black text-[#0F172A] border-b border-slate-50 pb-4 flex items-center gap-2">
               <Globe className="w-5 h-5 text-rose-500" /> Operational Modes
            </h2>
            <div className="space-y-4">
              <ToggleItem 
                title="Emergency Drive Mode" 
                desc="Enables high-priority banners across all terminals."
                active={settings.emergency_mode}
                onChange={() => updateField('emergency_mode', !settings.emergency_mode)}
              />
              <ToggleItem 
                title="Public Stocks View" 
                desc="Allow external donors to view stock status."
                active={settings.public_stocks_view}
                onChange={() => updateField('public_stocks_view', !settings.public_stocks_view)}
              />
              <ToggleItem 
                title="Accept Guest Donors" 
                desc="Bypass mandatory user registration for drives."
                active={settings.accept_guest_donors}
                onChange={() => updateField('accept_guest_donors', !settings.accept_guest_donors)}
              />
            </div>
          </section>

          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm space-y-6">
            <h2 className="text-xl font-black text-[#0F172A] border-b border-slate-50 pb-4 flex items-center gap-2">
               <Shield className="w-5 h-5 text-slate-400" /> System Security
            </h2>
            <div className="space-y-4">
              <ToggleItem 
                title="Admin Two-Factor" 
                active={settings.two_factor_auth}
                onChange={() => updateField('two_factor_auth', !settings.two_factor_auth)}
              />
              <ToggleItem 
                title="Auto Cloud Backups" 
                active={settings.auto_backups}
                onChange={() => updateField('auto_backups', !settings.auto_backups)}
              />
            </div>
          </section>

          <div className="bg-[#0F172A] rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
             <h3 className="text-lg font-black mb-2 relative z-10">Technical Support</h3>
             <p className="text-[10px] text-slate-400 font-bold mb-6 relative z-10 uppercase tracking-widest">Available 24/7 for system maintenance.</p>
             <button className="flex items-center gap-3 text-rose-500 font-black text-sm hover:translate-x-1 transition-transform relative z-10">
                <Mail className="w-4 h-4" /> support@bloodlink.tech
             </button>
             <Database className="absolute -bottom-8 -right-8 w-24 h-24 text-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleItem({ title, desc, active, onChange }) {
  return (
    <div 
      onClick={onChange}
      className={`flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer group ${
        active ? 'bg-rose-50/30 border-rose-100' : 'bg-slate-50 border-slate-100 hover:border-slate-200'
      }`}
    >
       <div className="max-w-[70%]">
         <p className={`font-black text-sm transition-colors ${active ? 'text-rose-600' : 'text-[#0F172A]'}`}>{title}</p>
         {desc && <p className="text-[9px] font-bold text-slate-400 uppercase leading-tight mt-1 tracking-tighter">{desc}</p>}
       </div>
       <div className={`w-12 h-6 ${active ? 'bg-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.3)]' : 'bg-slate-300'} rounded-full relative transition-all duration-300`}>
          <div className={`absolute top-1 ${active ? 'right-1' : 'left-1'} w-4 h-4 bg-white rounded-full transition-all shadow-sm`} />
       </div>
    </div>
  );
}
