import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

export const Alert = ({ title, children, variant = 'info', className }) => {
  const Icon = iconMap[variant];
  
  const variants = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200',
  };

  return (
    <div className={cn("p-4 border rounded-lg flex items-start gap-3", variants[variant], className)}>
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div>
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
    </div>
  );
};
