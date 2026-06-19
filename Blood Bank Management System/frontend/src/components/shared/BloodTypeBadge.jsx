import React from 'react';
import { cn } from '../../utils/cn';

export const BloodTypeBadge = ({ type, className }) => {
  if (!type) return null;

  // Visual categorization for standard blood types
  const isPositive = type.includes('+');
  const isNegative = type.includes('-');
  const isO = type.includes('O');

  return (
    <span className={cn(
      "inline-flex items-center justify-center min-w-[3rem] px-3 py-1.5 rounded-xl font-extrabold text-sm border-2 shadow-[0_4px_0_rgba(0,0,0,0.1)]",
      isO ? "bg-gradient-to-b from-[#C0392B] to-[#922B21] text-white border-[#7B241C] shadow-[0_4px_0_#7B241C]" : 
      isPositive ? "bg-gradient-to-b from-red-50 to-red-100 text-[#C0392B] border-red-200 shadow-[0_4px_0_#FADBD8]" : 
      "bg-gradient-to-b from-gray-50 to-gray-200 text-[#2C3E50] border-gray-300 shadow-[0_4px_0_#D5D8DC]",
      className
    )}>
      {type}
    </span>
  );
};
