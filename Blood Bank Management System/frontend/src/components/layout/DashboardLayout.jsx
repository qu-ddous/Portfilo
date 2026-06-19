import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../../hooks/useAuth';

export const DashboardLayout = ({ allowedRoles }) => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If this layout is restricted to specific roles, check it
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Sidebar role={user.role} />
      
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#2C3E50]/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="md:ml-72 flex flex-col min-h-screen transition-all duration-300">
        <Header onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
        
        <main className="flex-1 p-6 md:p-8 pt-28 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
