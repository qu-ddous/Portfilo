import { Bell, User, Search, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const Header = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex-1 w-full flex items-center justify-between relative">

      {/* ── Search Bar ── */}
      <div className="relative w-full max-w-sm hidden md:block group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors duration-300">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Search analytics, users, logs..."
          className="w-full bg-white/8 border border-white/10 rounded-2xl pl-11 pr-12 py-3 focus:outline-none focus:border-emerald-500/40 focus:bg-white/15 text-sm text-white/80 placeholder-slate-500 transition-all duration-300"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-white/10 rounded-lg text-[9px] text-slate-500 font-bold border border-white/5 tracking-wider">
          ⌘K
        </div>
      </div>

      {/* ── Right Side Actions ── */}
      <div className="flex items-center gap-4 lg:gap-6 ml-auto">

        {/* System Status Badge */}
        <div className="hidden xl:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
          <Zap size={14} className="text-emerald-400 fill-emerald-400" />
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">System Healthy</span>
        </div>

        {/* Notification Bell */}
        <Link to="/notifications" className="relative p-2.5 text-slate-400 hover:text-emerald-400 transition-all duration-300 bg-white/5 hover:bg-white/10 rounded-2xl active:scale-90">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-slate-900 animate-pulse" />
        </Link>

        {/* User Profile */}
        <div className="flex items-center gap-4 pl-5 border-l border-white/10 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white leading-tight">
              {user?.name || 'Administrator'}
            </p>
            <p className="text-[9px] text-emerald-400/70 uppercase tracking-widest font-black mt-0.5">
              Admin Panel
            </p>
          </div>
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center border-2 border-white/20 shadow-xl shadow-emerald-500/20 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
              {user?.avatar ? (
                <img src={user.avatar} alt="Admin" className="w-full h-full object-cover" />
              ) : (
                <User size={22} className="text-white" />
              )}
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
