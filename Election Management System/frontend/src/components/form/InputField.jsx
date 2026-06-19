// src/components/form/InputField.jsx
import { forwardRef } from 'react';

const InputField = forwardRef(({
  label,
  error,
  type = 'text',
  placeholder,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`
          w-full
          bg-white/5 border rounded-lg px-4 py-2.5
          text-white placeholder-gray-500
          focus:outline-none focus:border-blue-500 transition
          ${error ? 'border-red-500/50' : 'border-white/10'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';

export default InputField;
