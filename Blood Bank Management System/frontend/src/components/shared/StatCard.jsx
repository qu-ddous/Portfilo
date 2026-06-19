import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const StatCard = ({ title, value, icon: Icon, trend, trendValue, onClick, className, color = 'blue' }) => {
  const colorMap = {
    red: {
      from: 'from-rose-500',
      to: 'to-red-600',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      accent: 'bg-red-400/30',
      shadow: 'shadow-[0_10px_20px_rgba(225,29,72,0.3)]',
      border: 'border-white/20'
    },
    blue: {
      from: 'from-blue-500',
      to: 'to-indigo-600',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      accent: 'bg-blue-400/30',
      shadow: 'shadow-[0_10px_20px_rgba(37,99,235,0.3)]',
      border: 'border-white/20'
    },
    emerald: {
      from: 'from-emerald-500',
      to: 'to-teal-600',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      accent: 'bg-emerald-400/30',
      shadow: 'shadow-[0_10px_20px_rgba(5,150,105,0.3)]',
      border: 'border-white/20'
    },
    orange: {
      from: 'from-orange-500',
      to: 'to-amber-600',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      accent: 'bg-orange-400/30',
      shadow: 'shadow-[0_10px_20px_rgba(245,158,11,0.3)]',
      border: 'border-white/20'
    },
    purple: {
      from: 'from-violet-500',
      to: 'to-purple-600',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      accent: 'bg-purple-400/30',
      shadow: 'shadow-[0_10px_20px_rgba(139,92,246,0.3)]',
      border: 'border-white/20'
    }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative p-6 rounded-[2rem] overflow-hidden group transition-all duration-500",
        `bg-gradient-to-br ${scheme.from} ${scheme.to} ${scheme.border} border`,
        scheme.shadow,
        onClick && "cursor-pointer",
        className
      )}
    >
      {/* 3D Glassmorphism layers */}
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
      
      {/* Shiny sweeping overlay effect */}
      <div className="absolute inset-0 -translate-x-[150%] skew-x-[-45deg] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shine z-20 pointer-events-none" />
      
      {/* Decorative blurred background orbs */}
      <div className={cn("absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 z-0", scheme.accent)} />
      <div className={cn("absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700 z-0 opacity-50", scheme.accent)} />

      {/* Large watermark icon */}
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all z-0 transform group-hover:scale-110 group-hover:rotate-6 duration-500">
        <Icon className="w-32 h-32 text-white" />
      </div>
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className={cn(
          "p-4 rounded-2xl flex items-center justify-center transition-all duration-500",
          "shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_10px_15px_rgba(0,0,0,0.1)]",
          "group-hover:translate-z-10 group-hover:scale-110",
          scheme.iconBg
        )}>
          <Icon className={cn("w-6 h-6 drop-shadow-lg", scheme.iconColor)} />
        </div>
        {trend && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl px-2.5 py-1 flex items-center gap-1.5 border border-white/20">
            <span className="text-[10px] font-black text-white uppercase tracking-tight">{trendValue}</span>
          </div>
        )}
      </div>
      
      <div className="relative z-10 flex flex-col space-y-1">
        <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest">{title}</h3>
        <p className="text-5xl font-black text-white tracking-tighter drop-shadow-md">
          {value}
        </p>
      </div>
    </motion.div>
  );
};
