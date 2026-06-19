// src/components/form/SelectField.jsx
import { forwardRef } from 'react';

const SelectField = forwardRef(({
  label,
  error,
  options = [],
  placeholder = 'Select option...',
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
      <select
        ref={ref}
        className={`
          w-full
          bg-white/5 border rounded-lg px-4 py-2.5
          text-white
          focus:outline-none focus:border-blue-500 transition
          ${error ? 'border-red-500/50' : 'border-white/10'}
          ${className}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
});

SelectField.displayName = 'SelectField';

export default SelectField;
