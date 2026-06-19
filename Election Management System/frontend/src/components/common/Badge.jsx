// src/components/common/Badge.jsx
import PropTypes from 'prop-types';

export default function Badge({ children, variant = 'blue', size = 'md', className = '' }) {
  const variants = {
    blue: 'bg-blue-500/30 text-blue-200',
    green: 'bg-green-500/30 text-green-200',
    red: 'bg-red-500/30 text-red-200',
    yellow: 'bg-yellow-500/30 text-yellow-200',
    purple: 'bg-purple-500/30 text-purple-200',
    gray: 'bg-gray-500/30 text-gray-200'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`
      inline-block rounded-full font-semibold
      ${variants[variant]}
      ${sizes[size]}
      ${className}
    `}>
      {children}
    </span>
  );
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['blue', 'green', 'red', 'yellow', 'purple', 'gray']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string
};
