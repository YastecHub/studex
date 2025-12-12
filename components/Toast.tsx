import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, InfoIcon, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id?: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps & { onClose: () => void }> = ({
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      title: 'text-green-900',
      message: 'text-green-700'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      title: 'text-red-900',
      message: 'text-red-700'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
      title: 'text-yellow-900',
      message: 'text-yellow-700'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-900',
      message: 'text-blue-700'
    }
  };

  const style = styles[type];
  const icons = {
    success: <CheckCircle size={24} />,
    error: <XCircle size={24} />,
    warning: <AlertCircle size={24} />,
    info: <InfoIcon size={24} />
  };

  return (
    <div className={`${style.bg} border-l-4 ${style.border} rounded-lg p-4 mb-4 shadow-md flex items-start gap-3 animate-in slide-in-from-right`}>
      <div className={style.icon}>{icons[type]}</div>
      <div className="flex-1">
        <h3 className={`font-semibold ${style.title}`}>{title}</h3>
        {message && <p className={`text-sm mt-1 ${style.message}`}>{message}</p>}
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
      >
        <X size={20} />
      </button>
    </div>
  );
};

export default Toast;
