import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Notification, { NotificationType } from './Notification';

interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  notify: (type: NotificationType, message: string, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const notify = useCallback((type: NotificationType, message: string, duration = 4000) => {
    const id = `${Date.now()}-${Math.random()}`;
    setNotifications((prev) => [...prev, { id, type, message, duration }]);
  }, []);

  const success = useCallback((message: string, duration?: number) => notify('success', message, duration), [notify]);
  const error = useCallback((message: string, duration?: number) => notify('error', message, duration), [notify]);
  const warning = useCallback((message: string, duration?: number) => notify('warning', message, duration), [notify]);
  const info = useCallback((message: string, duration?: number) => notify('info', message, duration), [notify]);

  const handleClose = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notify, success, error, warning, info }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        <div className="flex flex-col gap-3 pointer-events-auto">
          {notifications.map((notification) => (
            <Notification key={notification.id} {...notification} onClose={handleClose} />
          ))}
        </div>
      </div>
    </NotificationContext.Provider>
  );
}