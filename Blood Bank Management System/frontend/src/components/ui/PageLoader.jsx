import React from 'react';
import { motion } from 'framer-motion';
import { Droplet } from 'lucide-react';

export const PageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-[#F8F9FA]/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-16 h-16 bg-gradient-to-br from-[#C0392B] to-[#E74C3C] rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 mb-4"
      >
        <Droplet className="text-white w-8 h-8 fill-current" />
      </motion.div>
      <p className="text-[#2C3E50] font-medium text-lg animate-pulse">{message}</p>
    </div>
  );
};
