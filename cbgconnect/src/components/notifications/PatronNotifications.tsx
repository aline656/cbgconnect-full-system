// src/components/notifications/PatronNotifications.tsx
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Bell, Shield, AlertTriangle, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export function PatronNotificationWidget() {
  const { notifications, unreadCount } = useNotifications();
  
  const patronNotifications = notifications
    .filter(n => (n.role === 'patron' || n.role === 'all') && !n.read)
    .slice(0, 3);

  if (patronNotifications.length === 0) {
    return null;
  }

  const getIcon = (category: string) => {
    switch (category) {
      case 'discipline': return <Shield className="h-4 w-4 text-red-500" />;
      case 'dormitory': return <Users className="h-4 w-4 text-blue-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Boys' Notifications</h3>
        <Badge variant="outline">{unreadCount} unread</Badge>
      </div>
      <div className="space-y-2">
        {patronNotifications.map((notification) => (
          <div
            key={notification.id}
            className="p-3 border rounded-lg hover:bg-gray-50/50 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-2">
              {getIcon(notification.category)}
              <div className="flex-1">
                <p className="font-medium text-sm">{notification.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {notification.description}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      notification.priority === 'high' ? 'border-red-200 text-red-700' :
                      notification.priority === 'medium' ? 'border-amber-200 text-amber-700' :
                      'border-blue-200 text-blue-700'
                    }`}
                  >
                    {notification.priority}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" className="w-full">
        View All Incidents
      </Button>
    </div>
  );
}