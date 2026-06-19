// src/components/common/Card.jsx
import PropTypes from 'prop-types';

export default function Card({ children, className = '', header, footer }) {
  return (
    <div className={`
      bg-white/5 border border-white/10 rounded-xl
      ${className}
    `}>
      {header && (
        <div className="px-6 py-4 border-b border-white/10">
          {header}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 border-t border-white/10 flex gap-2 justify-end">
          {footer}
        </div>
      )}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.node
};
