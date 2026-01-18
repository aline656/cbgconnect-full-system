// src/components/notifications/TeacherNotifications.tsx
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export function TeacherNotificationWidget() {
  const { notifications, unreadCount } = useNotifications();
  
  const teacherNotifications = notifications
    .filter(n => (n.role === 'teacher' || n.role === 'all') && !n.read)
    .slice(0, 3);

  if (teacherNotifications.length === 0) {
    return null;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'reminder': return <Clock className="h-4 w-4 text-purple-500" />;
      default: return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Recent Notifications</h3>
        <Badge variant="outline">{unreadCount} unread</Badge>
      </div>
      <div className="space-y-2">
        {teacherNotifications.map((notification) => (
          <div
            key={notification.id}
            className="p-3 border rounded-lg hover:bg-gray-50/50 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-2">
              {getIcon(notification.type)}
              <div className="flex-1">
                <p className="font-medium text-sm">{notification.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {notification.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" className="w-full">
        View All Notifications
      </Button>
    </div>
  );
}