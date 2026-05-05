import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import useAuthStore from '../../store/authStore';
import { Menu } from 'lucide-react';

const MainLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-900">
      {/* Mobile Menu Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40 lg:hidden animate-in fade-in duration-500"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop Always, Mobile conditional */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Page Area */}
      <div className="lg:ml-64 min-h-screen flex flex-col transition-all duration-500">
        {/* Animated Premium Header */}
        <header className="fixed top-0 right-0 lg:left-64 left-0 h-20 nav-shell border-b border-white/5 z-30 flex items-center px-6 lg:px-10 shadow-2xl shadow-black/20">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2.5 bg-white/5 rounded-2xl text-emerald-400 transition-all hover:bg-white/10 hover:scale-110 active:scale-95 mr-4"
          >
            <Menu size={24} />
          </button>
          
          <Header />
        </header>

        {/* Content with smooth page entry */}
        <main className="flex-1 mt-20 p-6 md:p-8 lg:p-12 page-enter">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
