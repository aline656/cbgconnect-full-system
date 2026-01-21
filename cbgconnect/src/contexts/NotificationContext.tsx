// src/contexts/NotificationContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import type { Notification } from '@/types/notification';
import apiService from '@/services/api';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  filterByRole: (role: string) => Notification[];
  getUnreadByRole: (role: string) => number;
  refetch: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications from backend
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const userRole = localStorage.getItem('userRole') || 'all';
      const data = await apiService.getNotifications(userRole) as Notification[];
      setNotifications(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch notifications:', err);
      setNotifications([]); // fallback to empty
      setError(null); // don't display error for optional notifications
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Set up real-time notification updates
  useEffect(() => {
    const handleRealTimeUpdate = (event: CustomEvent) => {
      const updateData = event.detail;
      if (updateData.type === 'new_notification') {
        setNotifications(prev => [updateData.notification, ...prev]);
      } else if (updateData.type === 'notification_read') {
        setNotifications(prev => 
          prev.map(n => n.id === updateData.notificationId ? { ...n, read: true } : n)
        );
      } else if (updateData.type === 'notification_deleted') {
        setNotifications(prev => prev.filter(n => n.id !== updateData.notificationId));
      }
    };

    window.addEventListener('realTimeUpdate', handleRealTimeUpdate as EventListener);

    return () => {
      window.removeEventListener('realTimeUpdate', handleRealTimeUpdate as EventListener);
    };
  }, []);

  const userRole = localStorage.getItem('userRole') || 'teacher';
  const unreadCount = notifications.filter(n => !n.read && (n.role === userRole || n.role === 'all')).length;

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await apiService.markNotificationAsRead(id);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await apiService.markAllNotificationsAsRead();
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    try {
      await apiService.deleteNotification(id);
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  }, []);

  const clearAll = useCallback(() => {
    setNotifications(prev => prev.filter(notification => 
      notification.role !== userRole && notification.role !== 'all'
    ));
  }, [userRole]);

  const filterByRole = useCallback((role: string) => {
    return notifications.filter(n => n.role === role || n.role === 'all');
  }, [notifications]);

  const getUnreadByRole = useCallback((role: string) => {
    return notifications.filter(n => !n.read && (n.role === role || n.role === 'all')).length;
  }, [notifications]);

  return (
    <NotificationContext.Provider value={{
      notifications: filterByRole(userRole),
      unreadCount,
      loading,
      error,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll,
      filterByRole,
      getUnreadByRole,
      refetch: fetchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
