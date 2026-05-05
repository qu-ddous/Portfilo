import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Utensils, 
  Users, 
  FileBarChart, 
  Settings,
  LogOut,
  Megaphone,
  X,
  History,
  Activity,
  MessageSquare
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Sidebar = ({ onClose }) => {
  const logout = useAuthStore((state) => state.logout);

  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Training Hub', path: '/training', icon: Dumbbell },
    { name: 'Meals', path: '/meals', icon: Utensils },
    { name: 'Users', path: '/users', icon: Users },
    { name: 'Notifications', path: '/notifications', icon: Megaphone },
    { name: 'Chat Room', path: '/chat', icon: MessageSquare },
    { name: 'Audit Logs', path: '/audit-logs', icon: History },
    { name: 'Reports', path: '/reports', icon: FileBarChart },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-full nav-shell flex flex-col p-6 shadow-2xl relative border-r border-white/5">
      {/* Mesh Gradient Bloom */}
      <div className="absolute top-0 left-0 w-full h-64 bg-emerald-500/10 blur-[100px] pointer-events-none" />

      {/* Branding */}
      <div className="flex items-center justify-between mb-12 px-2 relative">
        <div className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/40 group-hover:rotate-12 transition-transform duration-500 animate-float">
            <Activity className="text-white animate-hue animate-glow" size={26} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">
              FIT<span className="text-emerald-400 animate-pulse">ADMIN</span>
            </h1>
            <p className="text-[10px] text-emerald-400/50 font-bold tracking-widest uppercase">Premium v2.0</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-slate-500 hover:text-white bg-white/5 rounded-xl transition-all"
        >
          <X size={20} className="hover:rotate-90 transition-transform" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2 relative">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={() => {
              if (window.innerWidth < 1024) onClose();
            }}
            className={({ isActive }) => `sidebar-link group ${isActive ? 'active' : ''}`}
          >
            <link.icon size={20} className="transition-transform duration-500 group-hover:scale-125 group-hover:animate-float text-inherit group-[.active]:animate-glow group-[.active]:animate-hue" />
            <span className="tracking-wide text-sm">{link.name}</span>
            {link.path === '/notifications' && (
               <span className="ml-auto w-2 h-2 bg-emerald-400 rounded-full animate-breathe shadow-lg shadow-emerald-500"></span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="pt-8 mt-6 border-t border-white/5 relative">
        <button 
          onClick={logout}
          className="flex items-center gap-4 px-5 py-4 rounded-2xl w-full text-red-400 hover:text-white hover:bg-red-500/10 transition-all duration-300 group"
        >
          <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
            <LogOut size={18} />
          </div>
          <span className="font-bold text-sm">Logout Session</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
