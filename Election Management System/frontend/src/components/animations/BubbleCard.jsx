// src/components/animations/BubbleCard.jsx
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { cn } from '../../utils/helpers';

const gradients = {
  blue:   'from-blue-500/20 via-indigo-500/10 to-purple-500/20',
  green:  'from-emerald-500/20 via-teal-500/10 to-cyan-500/20',
  orange: 'from-orange-500/20 via-amber-500/10 to-yellow-500/20',
  pink:   'from-pink-500/20 via-rose-500/10 to-red-500/20',
  purple: 'from-purple-500/20 via-violet-500/10 to-indigo-500/20',
};

const glows = {
  blue:   'shadow-blue-500/30',
  green:  'shadow-emerald-500/30',
  orange: 'shadow-orange-500/30',
  pink:   'shadow-pink-500/30',
  purple: 'shadow-purple-500/30',
};

export default function BubbleCard({
  children,
  color = 'blue',
  className = '',
  animate = true,
  ...props
}) {
  return (
    <motion.div
      whileHover={animate ? { scale: 1.02, y: -4 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'relative rounded-2xl overflow-hidden',
        `bg-gradient-to-br ${gradients[color]}`,
        'border border-white/10',
        'backdrop-blur-md',
        'shadow-xl',
        glows[color],
        className
      )}
      {...props}
    >
      {/* Shimmer line effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
        -translate-x-full animate-shimmer pointer-events-none" />
      
      {/* Bubble particles */}
      {animate && [...new Array(5)].map((_, i) => (
        <motion.div
          key={`bubble-${i}`}
          className="absolute w-2 h-2 rounded-full bg-white/10"
          animate={{
            y: [-20, -60],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1.5]
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.8,
            ease: 'easeOut'
          }}
          style={{
            left: `${15 + i * 18}%`,
            bottom: '10%'
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

BubbleCard.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['blue', 'green', 'orange', 'pink', 'purple']),
  className: PropTypes.string,
  animate: PropTypes.bool
};
