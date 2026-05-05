import React from 'react';

const GlassCard = ({ children, className = '', hover = true }) => {
  return (
    <div className={`glass-card ${hover ? 'hover:translate-y-[-4px]' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;
