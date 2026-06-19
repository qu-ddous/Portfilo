import React from 'react';
import { motion } from 'framer-motion';
import { FileIcon } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export const EmptyState = ({ 
  icon: Icon = FileIcon, 
  title = 'No Data Found', 
  description = 'There is currently no data available to display.', 
  actionLabel, 
  onAction,
  className
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-[#E5E7EB]", className)}
    >
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-[#7F8C8D]" />
      </div>
      <h3 className="text-lg font-semibold text-[#2C3E50]">{title}</h3>
      <p className="text-[#7F8C8D] mt-2 mb-6 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </motion.div>
  );
};
