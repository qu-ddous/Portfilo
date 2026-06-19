import React from 'react';
import { Menu, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { NotificationBell } from '../shared/NotificationBell';

export const Header = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white/90 backdrop-blur-md border-b-2 border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] fixed top-0 right-0 left-0 md:left-72 z-30 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 mr-4 bg-gray-50 rounded-lg text-[#2C3E50] hover:bg-gray-100"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl md:text-2xl font-black text-[#2C3E50] tracking-tight">Dashboard Overview</h2>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <NotificationBell />
        
        <div className="flex items-center gap-3 pl-4 md:pl-6 border-l-2 border-gray-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[#2C3E50]">{user?.email?.split('@')[0] || 'User'}</p>
            <p className="text-xs font-bold text-[#7F8C8D] uppercase tracking-wider">{user?.role || 'Guest'}</p>
          </div>
          <div className="w-11 h-11 bg-gradient-to-tr from-[#2C3E50] to-[#E74C3C] rounded-xl flex items-center justify-center shadow-[0_4px_0_rgba(44,62,80,0.5)] border-2 border-white text-white">
            <UserIcon className="w-6 h-6" />
          </div>
        </div>
      </div>
    </header>
  );
};
