import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { NotificationPayload } from '../types/notifications';

interface NotificationContextType {
  notifications: NotificationPayload[];
  addNotification: (notification: NotificationPayload) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
  userId: string;
  userType: NotificationPayload['ownerType'];
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  userId,
  userType,
}) => {
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}/notifications?userId=${userId}&type=${userType}`
    );

    ws.onmessage = (event) => {
      const notification: NotificationPayload = JSON.parse(event.data);
      addNotification(notification);
    };

    setSocket(ws);

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [userId, userType]);

  // Load existing notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `/api/notifications?userId=${userId}&type=${userType}`
        );
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
  }, [userId, userType]);

  const addNotification = useCallback((notification: NotificationPayload) => {
    setNotifications((prev) => [notification, ...prev]);

    // Show browser notification if permitted
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
      });
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'POST',
      });

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.reference === id ? { ...notif, readAt: new Date().toISOString() } : notif
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markAsRead, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
};