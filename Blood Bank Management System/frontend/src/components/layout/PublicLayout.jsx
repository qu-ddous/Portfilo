import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Menu, X } from 'lucide-react';
import { cn } from '../../utils/cn';

const NAV_LINKS = [
  { name: 'Home',    path: 'home', isHash: false },
  { name: 'About',   path: 'about', isHash: true },
  { name: 'Contact', path: 'contact', isHash: true },
];

export const PublicLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (e, link) => {
    if (link.isHash) {
      e.preventDefault();
      const el = document.getElementById(link.path);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate('/home');
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* ===== NAVBAR ===== */}
      <header className="bg-white/90 backdrop-blur-md border-b-2 border-gray-100 shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/home" id="public-navbar-logo" onClick={() => window.scrollTo({top:0})} className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ rotate: 10 }}
                className="w-10 h-10 bg-gradient-to-br from-[#C0392B] to-[#E74C3C] rounded-xl flex items-center justify-center shadow-[0_4px_0_#922B21] group-hover:shadow-[0_6px_0_#922B21] transition-all"
              >
                <Droplets className="text-white w-5 h-5 fill-current" />
              </motion.div>
              <span className="text-xl font-black text-[#2C3E50] tracking-tight">
                Blood<span className="text-[#C0392B]">Link</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.name}
                  onClick={(e) => handleNavClick(e, link)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-[#7F8C8D] hover:text-[#2C3E50] hover:bg-gray-50 transition-all cursor-pointer"
                >
                  {link.name}
                </button>
              ))}
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <motion.button
                id="public-navbar-login-btn"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/login')}
                className="px-5 py-2 border-2 border-[#C0392B] text-[#C0392B] text-sm font-bold rounded-xl hover:bg-red-50 transition-all"
              >
                Login
              </motion.button>
              <motion.button
                id="public-navbar-register-btn"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97, boxShadow: '0 0px 0 #922B21' }}
                onClick={() => navigate('/signup')}
                className="px-5 py-2 bg-[#C0392B] text-white text-sm font-bold rounded-xl shadow-[0_4px_0_#922B21] hover:bg-[#E74C3C] transition-all active:translate-y-1 active:shadow-none"
              >
                Register
              </motion.button>
            </div>

            {/* Mobile hamburger */}
            <button
              id="public-mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 bg-gray-50 rounded-lg text-[#2C3E50] hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ===== MOBILE MENU ===== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-0 right-0 h-full w-72 bg-white z-50 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#C0392B] rounded-lg flex items-center justify-center">
                    <Droplets className="w-4 h-4 text-white fill-current" />
                  </div>
                  <span className="font-black text-[#2C3E50]">BloodLink</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-50">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-1">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.name}
                    onClick={(e) => handleNavClick(e, link)}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-[#7F8C8D] hover:text-[#2C3E50] hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    {link.name}
                  </button>
                ))}
              </nav>

              <div className="p-4 space-y-3 border-t border-gray-100">
                <button
                  onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                  className="w-full py-3 border-2 border-[#C0392B] text-[#C0392B] text-sm font-bold rounded-xl hover:bg-red-50 transition-all"
                >
                  Login
                </button>
                <button
                  onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }}
                  className="w-full py-3 bg-[#C0392B] text-white text-sm font-bold rounded-xl shadow-[0_4px_0_#922B21] hover:bg-[#E74C3C] transition-all"
                >
                  Register Now
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ===== PAGE CONTENT ===== */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#2C3E50] text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#C0392B] rounded-lg flex items-center justify-center">
                <Droplets className="w-4 h-4 fill-current text-white" />
              </div>
              <span className="font-black text-lg">BloodLink</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Connecting donors with patients in need. Every drop counts in saving a life.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-black text-sm uppercase tracking-widest text-[#E74C3C] mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <button onClick={(e) => handleNavClick(e, link)} className="text-sm text-gray-400 hover:text-[#E74C3C] transition-colors cursor-pointer appearance-none bg-transparent p-0 m-0 border-none select-none text-left">
                    {link.name}
                  </button>
                </li>
              ))}
                <li>
                  <Link to="/login" className="text-sm text-gray-400 hover:text-[#E74C3C] transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="text-sm text-gray-400 hover:text-[#E74C3C] transition-colors">
                    Register
                  </Link>
                </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-black text-sm uppercase tracking-widest text-[#E74C3C] mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📍 123 Medical Center Drive</li>
              <li>📞 +1 (800) BLOODLINK</li>
              <li>✉️ info@bloodlink.org</li>
              <li>🕐 Mon–Sat: 8AM – 8PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} BloodLink — All rights reserved. Saving lives, one drop at a time.
        </div>
      </footer>
    </div>
  );
};
