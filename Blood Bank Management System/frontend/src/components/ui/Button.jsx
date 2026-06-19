import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  icon: Icon,
  disabled, 
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: 'bg-gradient-to-b from-[#E74C3C] to-[#C0392B] text-white shadow-[0_6px_0_#922B21,0_10px_20px_rgba(192,57,43,0.4)] hover:shadow-[0_4px_0_#922B21,0_8px_15px_rgba(192,57,43,0.4)] hover:translate-y-[2px] active:shadow-[0_0px_0_#922B21] active:translate-y-[6px]',
    secondary: 'bg-gradient-to-b from-white to-gray-100 text-[#2C3E50] border-2 border-[#E5E7EB] shadow-[0_6px_0_#D1D5DB,0_10px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_0_#D1D5DB] hover:translate-y-[2px] active:shadow-[0_0px_0_#D1D5DB] active:translate-y-[6px]',
    danger: 'bg-gradient-to-b from-red-500 to-[#E74C3C] text-white shadow-[0_6px_0_#B03A2E,0_10px_20px_rgba(231,76,60,0.4)] hover:shadow-[0_4px_0_#B03A2E] hover:translate-y-[2px] active:shadow-[0_0px_0_#B03A2E] active:translate-y-[6px]',
    ghost: 'hover:bg-gray-100 text-[#2C3E50]',
    outline: 'bg-white border-2 border-[#C0392B] text-[#C0392B] shadow-[0_6px_0_#C0392B,0_10px_20px_rgba(192,57,43,0.2)] hover:shadow-[0_4px_0_#C0392B] hover:translate-y-[2px] active:shadow-[0_0px_0_#C0392B] active:translate-y-[6px]',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-11 px-6 py-2 text-md',
    lg: 'h-14 px-8 text-lg font-extrabold',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E74C3C]/50 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:translate-y-[6px]',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!loading && Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
