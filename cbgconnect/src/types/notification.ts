// src/types/notification.ts (lowercase 'n')
export interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'reminder';
  role: 'teacher' | 'metron' | 'patron' | 'all';
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  timestamp: string;
  action?: {
    label: string;
    path: string;
  };
  sender?: string;
  category: 'attendance' | 'assignment' | 'grade' | 'dormitory' | 'discipline' | 'system' | 'meeting' | 'other';
}

// Export it as both default and named for compatibility
export default Notification;
