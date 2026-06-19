// src/components/common/LoadingSpinner.jsx
import PropTypes from 'prop-types';

export default function LoadingSpinner({ size = 'md', fullscreen = false, color = 'blue' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  const colors = {
    blue: 'border-blue-500',
    purple: 'border-purple-500',
    white: 'border-white'
  };

  const spinner = (
    <div className={`
      ${sizes[size]}
      ${colors[color]}
      border-t-transparent
      rounded-full
      animate-spin
    `} />
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-slate-800 rounded-lg p-6">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
}

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  fullscreen: PropTypes.bool,
  color: PropTypes.string
};
