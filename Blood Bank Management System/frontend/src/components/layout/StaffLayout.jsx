import React, { useState } from 'react';
import { Outlet, Navigate, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, UserPlus, Droplets, FlaskConical,
  ClipboardList, LogOut, Menu, X, User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { NotificationBell } from '../shared/NotificationBell';
import { cn } from '../../utils/cn';

const STAFF_LINKS = [
  { name: 'Dashboard',       path: '/staff/dashboard',         icon: LayoutDashboard },
  { name: 'Register Donor',  path: '/staff/register-donor',    icon: UserPlus },
  { name: 'Record Donation', path: '/staff/record-donation',   icon: Droplets },
  { name: 'Test Results',    path: '/staff/test-results',      icon: FlaskConical },
  { name: 'Manage Requests', path: '/staff/manage-requests',   icon: ClipboardList },
  { name: 'My Profile',      path: '/staff/profile',           icon: UserIcon },
];

export const StaffLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'staff') return <Navigate to={`/${user.role}/dashboard`} replace />;

  const staffAvatar = user?.avatar_url || null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* ===== SIDEBAR ===== */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className="hidden md:flex flex-col w-72 bg-gradient-to-b from-[#1a252f] to-[#2C3E50] min-h-screen shadow-[10px_0_30px_rgba(0,0,0,0.12)] fixed top-0 left-0 z-40 text-white"
      >
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-12 h-12 bg-gradient-to-br from-[#C0392B] to-[#E74C3C] rounded-2xl flex items-center justify-center shadow-[0_4px_0_#922B21]">
            <Droplets className="text-white w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-wider text-white">BloodLink</h1>
            <p className="text-[10px] font-bold text-[#E74C3C] uppercase tracking-widest leading-3">Staff Portal</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {STAFF_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path.endsWith('dashboard')}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200',
                isActive
                  ? 'bg-[#C0392B] text-white shadow-[0_4px_0_#922B21] -translate-y-0.5'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              )}
            >
              <link.icon className="w-5 h-5 shrink-0" />
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-1">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5">
            <div className="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden border border-white/10">
              {staffAvatar ? (
                <img src={staffAvatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-4 h-4 text-white" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name || user?.email?.split('@')[0]}</p>
              <p className="text-[10px] text-[#E74C3C] font-bold uppercase tracking-widest">Officer</p>
            </div>
          </div>
          <button
            id="staff-logout-btn"
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-semibold text-gray-400 hover:text-[#E74C3C] hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-[#1a252f] to-[#2C3E50] z-50 flex flex-col text-white shadow-2xl"
            >
              <div className="p-6 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#C0392B] rounded-xl flex items-center justify-center">
                    <Droplets className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-xl font-black">BloodLink</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-2 text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {STAFF_LINKS.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) => cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm',
                      isActive ? 'bg-[#C0392B] text-white' : 'text-gray-300 hover:bg-white/5'
                    )}
                  >
                    <link.icon className="w-5 h-5 shrink-0" />
                    <span>{link.name}</span>
                  </NavLink>
                ))}
              </nav>
              <div className="p-4 border-t border-white/5">
                <button onClick={logout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm text-gray-400 hover:text-[#E74C3C] hover:bg-red-500/10">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen">
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm fixed top-0 right-0 left-0 md:left-72 z-30 flex items-center justify-between px-4 md:px-8">
          <button
            id="staff-mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 bg-gray-50 rounded-lg text-[#2C3E50] hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="hidden md:block text-lg font-black text-[#2C3E50]">Staff Panel</h2>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <div className="flex items-center gap-2 pl-3 border-l border-gray-100">
              <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                {staffAvatar ? (
                  <img src={staffAvatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-4 h-4 text-slate-400" />
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-black text-[#2C3E50] leading-3">{user?.name || 'Officer'}</p>
                <p className="text-[10px] text-[#E74C3C] font-black uppercase tracking-widest mt-1">Staff</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 pt-16 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
