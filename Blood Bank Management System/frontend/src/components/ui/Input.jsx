import React from 'react';
import { cn } from '../../utils/cn';

export const Input = React.forwardRef(({ className, type, label, error, register, ...props }, ref) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 block">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded-2xl bg-white border-2 border-gray-100 px-5 py-3 text-sm font-bold text-[#2C3E50] transition-all focus:border-rose-500 focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_10px_20px_rgba(225,29,72,0.1)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] outline-none disabled:opacity-50 placeholder:text-gray-300",
          error && "border-red-500 bg-red-50 focus:border-red-500",
          className
        )}
        ref={ref}
        {...(register ? register : {})}
        {...props}
      />
      {error && (
        <p className="mt-1 text-[10px] font-black text-red-500 uppercase tracking-tight ml-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
