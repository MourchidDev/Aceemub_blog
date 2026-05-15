import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationProps {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

// Styles pour le conteneur principal (Effet de verre et bordure latérale)
const containerStyles = {
  success: 'bg-white/80 dark:bg-slate-900/80 border-l-4 border-l-green-500 border-gray-100 dark:border-slate-800',
  error: 'bg-white/80 dark:bg-slate-900/80 border-l-4 border-l-red-500 border-gray-100 dark:border-slate-800',
  warning: 'bg-white/80 dark:bg-slate-900/80 border-l-4 border-l-amber-500 border-gray-100 dark:border-slate-800',
  info: 'bg-white/80 dark:bg-slate-900/80 border-l-4 border-l-blue-500 border-gray-100 dark:border-slate-800',
};

// Styles pour l'icône et son arrière-plan arrondi
const iconWrapperStyles = {
  success: 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400',
  error: 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400',
  warning: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
  info: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
};

export default function Notification({ id, type, message, duration = 4000, onClose }: NotificationProps) {
  const Icon = icons[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <div
      className={`
        group flex items-center gap-4 min-w-[350px] max-w-md p-4 
        rounded-r-2xl border shadow-[0_8px_30px_rgb(0,0,0,0.04)] 
        backdrop-blur-md animate-slide-in transition-all duration-300
        hover:translate-x-[-8px] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]
        ${containerStyles[type]}
      `}
    >
      {/* Wrapper de l'icône */}
      <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${iconWrapperStyles[type]}`}>
        <Icon size={22} strokeWidth={2.5} />
      </div>
      
      {/* Contenu textuel */}
      <div className="flex-1">
        <h4 className="text-sm font-bold capitalize text-gray-900 dark:text-white mb-0.5">
          {type}
        </h4>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium leading-tight">
          {message}
        </p>
      </div>

      {/* Bouton de fermeture */}
      <button
        onClick={() => onClose(id)}
        className="
          opacity-0 group-hover:opacity-100 
          flex-shrink-0 w-8 h-8 rounded-full 
          flex items-center justify-center 
          hover:bg-gray-100 dark:hover:bg-slate-800 
          text-gray-400 dark:text-gray-500
          transition-all duration-200
        "
        aria-label="Fermer"
      >
        <X size={16} />
      </button>
    </div>
  );
}