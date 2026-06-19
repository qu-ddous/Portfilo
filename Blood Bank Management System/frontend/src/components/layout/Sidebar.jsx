import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { LayoutDashboard, Users, Droplets, Calendar, FileText, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = ({ role }) => {
  const { logout } = useAuth();
  
  const getLinks = () => {
    const base = [
      { name: 'Dashboard', path: `/${role}/dashboard`, icon: LayoutDashboard }
    ];
    
    if (role === 'admin') {
      base.push(
        { name: 'Donors', path: '/admin/donors', icon: Users },
        { name: 'Patients', path: '/admin/patients', icon: Users },
        { name: 'Blood Inventory', path: '/admin/inventory', icon: Droplets },
        { name: 'Appointments', path: '/admin/appointments', icon: Calendar },
        { name: 'Reports', path: '/admin/reports', icon: FileText },
        { name: 'Settings', path: '/admin/settings', icon: Settings }
      );
    } else if (role === 'staff') {
      base.push(
        { name: 'Donors', path: '/staff/donors', icon: Users },
        { name: 'Blood Inventory', path: '/staff/inventory', icon: Droplets },
        { name: 'Appointments', path: '/staff/appointments', icon: Calendar }
      );
    } else if (role === 'donor') {
      base.push(
        { name: 'Donate Blood', path: '/donor/donate', icon: Droplets },
        { name: 'My Appointments', path: '/donor/appointments', icon: Calendar },
        { name: 'History', path: '/donor/history', icon: FileText }
      );
    } else if (role === 'patient') {
      base.push(
        { name: 'Request Blood', path: '/patient/request', icon: Droplets },
        { name: 'My Requests', path: '/patient/requests', icon: FileText }
      );
    }
    
    return base;
  };

  const links = getLinks();

  return (
    <motion.aside 
      initial={{ x: -200 }}
      animate={{ x: 0 }}
      className="hidden md:flex flex-col w-72 bg-gradient-to-b from-[#2C3E50] to-[#1a252f] min-h-screen shadow-[10px_0_30px_rgba(0,0,0,0.1)] border-r-4 border-[#34495e] text-white fixed top-0 left-0 z-40 transform-gpu"
    >
      <div className="p-6 flex items-center gap-3 border-b-2 border-white/5">
        <div className="w-12 h-12 bg-gradient-to-br from-[#C0392B] to-[#E74C3C] rounded-2xl flex items-center justify-center shadow-[0_4px_0_#922B21]">
          <Droplets className="text-white w-6 h-6 fill-current" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-wider text-white">BloodLink</h1>
          <p className="text-xs font-bold text-[#E74C3C] uppercase tracking-widest">{role} Portal</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path.endsWith('dashboard')}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 group relative",
              isActive 
                ? "bg-[#C0392B] text-white shadow-[0_4px_0_#922B21] translate-y-[-2px] border-b-2 border-red-400" 
                : "text-gray-300 hover:bg-white/5 hover:text-white"
            )}
          >
            <link.icon className="w-5 h-5 shrink-0" />
            <span className="truncate">{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t-2 border-white/5">
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 px-4 py-3.5 w-full rounded-xl font-bold text-sm text-[#E74C3C] transition-all hover:bg-red-500/10 hover:text-white"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </motion.aside>
  );
};
