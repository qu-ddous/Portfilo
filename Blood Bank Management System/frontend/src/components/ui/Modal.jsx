import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Droplets } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-3xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className={cn("bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] w-full max-h-[90vh] flex flex-col pointer-events-auto overflow-hidden border border-gray-100", sizes[size])}
            >
              {/* Premium Colorful Header */}
              <div className="bg-gradient-to-r from-[#C0392B] to-[#E74C3C] p-6 flex items-center justify-between text-white relative">
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                    <Droplets className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-black tracking-tight">{title}</h2>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/20 transition-all text-white relative z-10 group"
                >
                  <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {/* Decorative background circle */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              </div>

              <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                {children}
              </div>
              
              {footer && (
                <div className="p-6 border-t border-[#F1F2F4] bg-[#F8F9FA] rounded-b-[2.5rem] flex justify-end gap-3 px-8">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
