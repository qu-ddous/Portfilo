// src/components/common/Button.jsx
import { forwardRef } from 'react';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white',
    secondary: 'bg-white/10 hover:bg-white/20 border border-white/20 text-white',
    danger: 'bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    ghost: 'hover:bg-white/10 text-white border border-white/20'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg'
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <div className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
