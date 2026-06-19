// src/components/common/Alert.jsx
import PropTypes from 'prop-types';

export default function Alert({ type = 'info', children, onClose, title }) {
  const variants = {
    success: 'bg-green-500/20 border-green-500/50 text-green-200',
    error: 'bg-red-500/20 border-red-500/50 text-red-200',
    warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200',
    info: 'bg-blue-500/20 border-blue-500/50 text-blue-200'
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div className={`
      border rounded-lg p-4 flex gap-3 items-start
      ${variants[type]}
    `}>
      <div className="text-lg font-bold flex-shrink-0">{icons[type]}</div>
      <div className="flex-1">
        {title && <div className="font-semibold">{title}</div>}
        <div className="text-sm">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-lg leading-none flex-shrink-0 hover:opacity-70"
        >
          ×
        </button>
      )}
    </div>
  );
}
