// src/components/common/Modal.jsx
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

export default function Modal({ isOpen, onClose, title, children, footer, size = 'md' }) {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`
              fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              bg-slate-800 border border-white/10 rounded-xl shadow-2xl
              z-50 ${sizes[size]} w-full mx-4
            `}
          >
            {/* Header */}
            {title && (
              <div className="flex justify-between items-center p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white text-2xl leading-none"
                >
                  ×
                </button>
              </div>
            )}

            {/* Body */}
            <div className="p-6">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="border-t border-white/10 p-6 flex gap-2 justify-end">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl'])
};
