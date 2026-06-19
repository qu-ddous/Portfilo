import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Droplets, ClipboardList,
  FileText, Settings, LogOut, Menu, X, User as UserIcon, AlertCircle, Bell,
} from 'lucide-react';
import { Outlet, Navigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { NotificationBell } from '../shared/NotificationBell';
import { cn } from '../../utils/cn';
import { useSettingsStore } from '../../store/settingsStore';

const ADMIN_LINKS = [
  { name: 'Dashboard',       path: '/admin/dashboard',  icon: LayoutDashboard },
  { name: 'Donors',          path: '/admin/donors',      icon: Users },
  { name: 'Patients',        path: '/admin/patients',    icon: Users },
  { name: 'Staff',           path: '/admin/staff',       icon: Users },
  { name: 'Blood Inventory', path: '/admin/inventory',   icon: Droplets },
  { name: 'Requests',        path: '/admin/requests',    icon: ClipboardList },
  { name: 'Reports',         path: '/admin/reports',     icon: FileText },
  { name: 'Settings',        path: '/admin/settings',    icon: Settings },
];

export const AdminLayout = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { settings, fetchSettings } = useSettingsStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.role) {
    logout();
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'admin') return <Navigate to={`/${user.role}/dashboard`} replace />;

  const adminAvatar = user?.avatar_url || null;

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex text-[#1A202C]">
      {/* ===== PREMIUM DARK SIDEBAR ===== */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className="hidden md:flex flex-col w-72 bg-[#0F172A] min-h-screen shadow-2xl fixed top-0 left-0 z-40 text-white border-r border-white/5"
      >
        {/* Logo Section */}
        <div className="p-8 flex items-center gap-4 border-b border-white/5 bg-black/20">
          <div className="w-12 h-12 bg-gradient-to-br from-[#E11D48] to-[#9F1239] rounded-2xl flex items-center justify-center shadow-lg shadow-rose-900/40 ring-2 ring-white/10">
            <Droplets className="text-white w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white uppercase">BloodLink</h1>
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest leading-none mt-1">Management System</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar pt-6">
          {ADMIN_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path.endsWith('dashboard')}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 group relative overflow-hidden outline-none',
                isActive
                  ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg shadow-rose-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}
            >
              {({ isActive }) => (
                <>
                  <link.icon className={cn(
                    "w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110", 
                    isActive ? "text-white" : "text-slate-500 group-hover:text-rose-400"
                  )} />
                  <span>{link.name}</span>
                  {isActive && (
                    <motion.div layoutId="activeNav" className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="p-6 mt-auto border-t border-white/5 bg-black/20">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-5 py-4 w-full rounded-2xl text-sm font-bold text-slate-400 hover:text-white hover:bg-rose-600/10 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
               <LogOut className="w-4 h-4" />
            </div>
            <span>Sign Out System</span>
          </button>
        </div>
      </motion.aside>

      {/* ===== MOBILE SIDEBAR ===== */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-72 bg-[#0F172A] z-50 flex flex-col text-white shadow-[20px_0_50px_rgba(0,0,0,0.5)] md:hidden"
            >
              <div className="p-8 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Droplets className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-xl font-black">BloodLink</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto pt-6">
                {ADMIN_LINKS.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) => cn(
                      'flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all',
                      isActive ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'
                    )}
                  >
                    {({ isActive }) => (
                      <>
                        <link.icon className="w-5 h-5 shrink-0" />
                        <span>{link.name}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen">
        {/* Emergency Mode Banner */}
        <AnimatePresence>
          {settings.emergency_mode && (
            <motion.div 
              initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
              className="bg-[#E11D48] text-white py-2.5 px-8 flex items-center justify-center gap-4 shadow-xl z-50 sticky top-0"
            >
               <div className="flex items-center gap-2 animate-pulse">
                  <AlertCircle className="w-4 h-4 fill-white text-rose-600" />
                  <span className="text-[11px] font-black uppercase tracking-[0.3em]">Critical Emergency System Mode Active</span>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Bar */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2.5 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 transition-all shadow-sm"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <h2 className="text-xl font-black text-[#0F172A] tracking-tight truncate max-w-[150px] md:max-w-none">
                {settings.hospital_name || 'Admin Power Panel'}
              </h2>
              <p className="hidden md:block text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Overview & Management</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            {/* Notification & Tools */}
            <div className="hidden sm:flex p-1 bg-slate-100 rounded-2xl items-center gap-1 shadow-inner">
               <div className="w-10 h-10 hover:bg-white rounded-xl flex items-center justify-center text-slate-600 transition-all hover:shadow-sm cursor-pointer group">
                  <NotificationBell />
               </div>
               <NavLink to="/admin/settings" className="w-10 h-10 hover:bg-white rounded-xl flex items-center justify-center text-slate-600 transition-all hover:shadow-sm">
                  <Settings className="w-5 h-5" />
               </NavLink>
            </div>

            <div className="hidden sm:block h-10 w-px bg-slate-200 mx-2" />

            {/* Admin Profile Section */}
            <div className="flex items-center gap-3 md:gap-4 bg-slate-100/50 pl-2 pr-2 md:pr-4 py-1.5 rounded-2xl border border-slate-200/50 hover:bg-slate-100 transition-all cursor-pointer group">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl overflow-hidden shadow-lg ring-2 ring-white border border-slate-200">
                {adminAvatar ? (
                  <img src={adminAvatar} alt="Admin" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-xs">
                    {user?.name?.charAt(0) || <UserIcon className="w-4 h-4" />}
                  </div>
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-black text-[#0F172A] group-hover:text-rose-600 transition-colors uppercase tracking-tighter">
                  {user?.name || user?.email?.split('@')[0]}
                </p>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <p className="text-[9px] text-slate-500 font-black uppercase tracking-tighter">Superuser</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* View Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
