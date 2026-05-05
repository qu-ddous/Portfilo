import React, { useState, useEffect, useRef } from 'react';
import { User, Lock, Mail, Phone, Camera, Save, Bell, Shield, Palette, Sparkles, Fingerprint, Cog, Languages, Globe, Zap } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import api from '../utils/api';
import useAuthStore from '../store/authStore';

const Settings = () => {
  const { user, setAuth } = useAuthStore();
  const fileInputRef = useRef(null);
  
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || null
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [systemSettings, setSystemSettings] = useState({
    emailAlerts: user?.system_settings?.emailAlerts ?? true,
    pushNotifications: user?.system_settings?.pushNotifications ?? false,
    darkMode: user?.system_settings?.darkMode ?? true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.get('/admin/users/profile/me');
        if(data.success && data.user) {
          setProfileForm({
            name: data.user.name || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
            avatar: data.user.avatar || null
          });
          if(data.user.system_settings) setSystemSettings(data.user.system_settings);
        }
      } catch (err) {
        console.error("Failed to load profile details", err);
      }
    };
    loadProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleSystemChange = async (setting) => {
    const newSettings = { ...systemSettings, [setting]: !systemSettings[setting] };
    setSystemSettings(newSettings);
    try {
      await api.put('/admin/users/profile/me', { system_settings: newSettings });
    } catch (err) {
       console.log('Setup fail', err);
    }
  };

  const triggerFileSelect = () => { fileInputRef.current.click(); };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.match('image.*')) return setMsg({ type: 'error', text: 'Please select an image' });

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width, height = img.height;
        const MAX_SIZE = 400;
        if (width > height) { if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; } }
        else { if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; } }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const webpDataUrl = canvas.toDataURL('image/webp', 0.8);
        setProfileForm({ ...profileForm, avatar: webpDataUrl });
      };
      img.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg({ type: '', text: '' });
    try {
      const { data } = await api.put('/admin/users/profile/me', {
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        avatar: profileForm.avatar,
        system_settings: systemSettings
      });
      if(data.success) {
         setMsg({ type: 'success', text: 'Vector profile synchronized!' });
         setAuth({ ...user, name: profileForm.name, email: profileForm.email, avatar: profileForm.avatar }, localStorage.getItem('admin_token'));
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Calibration failed.' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMsg({ type: '', text: '' }), 3000);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    if(passwordForm.newPassword !== passwordForm.confirmPassword){
        setMsg({ type: 'error', text: 'Keys do not match' });
        return;
    }
    try {
      const { data } = await api.put('/admin/users/password/me', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      if(data.success) {
         setMsg({ type: 'success', text: 'Security layer updated!' });
         setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: ''});
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Auth verification failed' });
    }
    setTimeout(() => setMsg({ type: '', text: '' }), 3000);
  };

  return (
    <div className="space-y-12 animate-in pb-20 max-w-6xl mx-auto">
      {/* ── Premium Header ── */}
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 p-6 rounded-[30px] shadow-xl shadow-indigo-500/20 border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_3s_infinite] skew-x-[-25deg]"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-black text-white flex items-center gap-3 drop-shadow-lg">
             <Cog className="text-indigo-200 animate-[spin_10s_linear_infinite] animate-hue" size={30} /> Admin Configuration
          </h2>
          <p className="text-indigo-100/60 font-bold mt-1 text-[10px] uppercase tracking-widest">Global settings & identity layers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left: Main Settings Area */}
        <div className="lg:col-span-2 space-y-10">
          
          {msg.text && (
             <div className={`p-6 rounded-[30px] border-l-8 shadow-2xl font-black text-xs uppercase tracking-widest animate-in slide-in-from-top-4 ${msg.type === 'error' ? 'bg-rose-50 border-rose-500 text-rose-600' : 'bg-emerald-50 border-emerald-500 text-emerald-600'}`}>
                {msg.text}
             </div>
          )}

          {/* Identity Card */}
          <GlassCard className="p-8 rounded-[35px] relative overflow-hidden" hover={false}>
             <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-[100%] transition-all duration-1000 skew-x-[-25deg] pointer-events-none"></div>
             
             <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <User size={20} className="text-indigo-600" /> Identity Profile
             </h3>

             <form onSubmit={saveProfile} className="space-y-10">
                <div className="flex flex-col md:flex-row items-center gap-10">
                   <div className="relative group cursor-pointer" onClick={triggerFileSelect}>
                      <div className="w-32 h-32 rounded-[40px] bg-indigo-50 flex items-center justify-center text-4xl font-black text-indigo-300 border-4 border-white shadow-2xl overflow-hidden group-hover:radius-[20px] transition-all duration-500">
                         {profileForm.avatar ? <img src={profileForm.avatar} className="w-full h-full object-cover" /> : <User size={48} />}
                      </div>
                      <div className="absolute inset-0 bg-indigo-600/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[40px]">
                         <Camera className="text-white" size={24} />
                      </div>
                      <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" />
                   </div>
                   <div className="flex-1 text-center md:text-left">
                      <h4 className="text-xl font-black text-slate-900 mb-2">Architectural Avatar</h4>
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-4 leading-relaxed">Visual key for platform recognition.</p>
                      <button type="button" onClick={triggerFileSelect} className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm">Recalibrate Image</button>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Public Persona</label>
                      <input 
                        type="text" name="name" value={profileForm.name} onChange={handleProfileChange}
                        className="w-full bg-slate-50/50 border border-slate-100 rounded-[22px] px-6 py-4 text-sm font-black text-slate-800 focus:bg-white focus:border-indigo-400 outline-none transition-all shadow-inner"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Digital Signature</label>
                      <input 
                        type="email" name="email" value={profileForm.email} onChange={handleProfileChange}
                        className="w-full bg-slate-50/50 border border-slate-100 rounded-[22px] px-6 py-4 text-sm font-black text-slate-800 focus:bg-white focus:border-indigo-400 outline-none transition-all shadow-inner"
                      />
                   </div>
                </div>

                <div className="flex justify-end pt-8">
                   <button type="submit" disabled={isLoading} className="bg-slate-900 hover:bg-black text-white px-10 py-5 rounded-[25px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/30 flex items-center gap-3 transition-all active:scale-95">
                      {isLoading ? <Zap className="animate-pulse" /> : <Save size={18} />} Update System Identity
                   </button>
                </div>
             </form>
          </GlassCard>

          {/* Encryption Card */}
          <GlassCard className="p-8 rounded-[35px]" hover={false}>
             <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <Shield size={20} className="text-rose-500" /> Security Override
             </h3>
             <form onSubmit={savePassword} className="space-y-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Current Auth Key</label>
                   <input 
                     type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange}
                     className="w-full bg-slate-50/50 border border-slate-100 rounded-[22px] px-6 py-4 text-sm font-black text-slate-800 focus:bg-white focus:border-rose-400 outline-none transition-all shadow-inner"
                   />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">New Sequence</label>
                      <input 
                        type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange}
                        className="w-full bg-slate-50/50 border border-slate-100 rounded-[22px] px-6 py-4 text-sm font-black text-slate-800 focus:bg-white focus:border-rose-400 outline-none transition-all shadow-inner"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Confirm Sequence</label>
                      <input 
                        type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordChange}
                        className="w-full bg-slate-50/50 border border-slate-100 rounded-[22px] px-6 py-4 text-sm font-black text-slate-800 focus:bg-white focus:border-rose-400 outline-none transition-all shadow-inner"
                      />
                   </div>
                </div>
                <div className="flex justify-end pt-4">
                   <button type="submit" className="bg-rose-500 hover:bg-rose-600 text-white px-10 py-5 rounded-[25px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-rose-500/30 flex items-center gap-3 transition-all active:scale-95">
                      <Lock size={18} /> Resign Encryption Keys
                   </button>
                </div>
             </form>
          </GlassCard>
        </div>

        {/* Right: Sub-preferences */}
        <div className="space-y-6">
          <GlassCard className="p-8 rounded-[35px] relative overflow-hidden" hover={false}>
             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 blur-3xl opacity-50"></div>
             <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
                <Bell size={18} className="text-purple-600" /> Dispatch Layer
             </h3>
             <div className="space-y-8">
                <div className="flex items-center justify-between group">
                   <div>
                      <p className="text-sm font-black text-slate-800">Email Reports</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Daily vector logs</p>
                   </div>
                   <button onClick={() => handleSystemChange('emailAlerts')} className={`w-14 h-7 rounded-full transition-all duration-500 relative flex items-center px-1 ${systemSettings.emailAlerts ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-slate-200'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full transition-all duration-500 shadow-xl ${systemSettings.emailAlerts ? 'translate-x-7' : 'translate-x-0'}`} />
                   </button>
                </div>

                <div className="flex items-center justify-between group pt-8 border-t border-slate-100">
                   <div>
                      <p className="text-sm font-black text-slate-800">Push Hub</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Real-time alerts</p>
                   </div>
                   <button onClick={() => handleSystemChange('pushNotifications')} className={`w-14 h-7 rounded-full transition-all duration-500 relative flex items-center px-1 ${systemSettings.pushNotifications ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-slate-200'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full transition-all duration-500 shadow-xl ${systemSettings.pushNotifications ? 'translate-x-7' : 'translate-x-0'}`} />
                   </button>
                </div>
             </div>
          </GlassCard>

          <GlassCard className="p-10 rounded-[50px] relative overflow-hidden bg-slate-900 text-white" hover={false}>
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl opacity-50"></div>
             <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                <Sparkles size={20} className="text-amber-400" /> Interface Deck
             </h3>
             <div className="space-y-8">
                <div className="flex items-center justify-between group">
                   <div>
                      <p className="text-sm font-black">Ultra Dark Mode</p>
                      <p className="text-[10px] font-bold text-white/30 mt-1 uppercase tracking-widest text-slate-400">Night visual deck</p>
                   </div>
                   <button onClick={() => handleSystemChange('darkMode')} className={`w-14 h-7 rounded-full transition-all duration-500 relative flex items-center px-1 ${systemSettings.darkMode ? 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]' : 'bg-white/10'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full transition-all duration-500 shadow-xl ${systemSettings.darkMode ? 'translate-x-7' : 'translate-x-0'}`} />
                   </button>
                </div>
             </div>
          </GlassCard>

          {/* Quick Stats Widget */}
          <GlassCard className={`relative overflow-hidden p-10 rounded-[40px] bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-2xl transition-all hover:-translate-y-2 group`} hover={false}>
             <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-1000 skew-x-[-25deg]"></div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-2">Connectivity</p>
             <div className="flex items-end justify-between">
                <div>
                   <h3 className="text-3xl font-black">Active</h3>
                   <span className="text-[10px] font-black text-white/70">Verified Admin Tunnel</span>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-md">
                   <Globe size={28} />
                </div>
             </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Settings;
