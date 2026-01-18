// src/components/notifications/NotificationDemo.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotificationActions } from '@/hooks/useNotificationActions';

export function TeacherNotificationDemo() {
  const {
    sendAssignmentNotification,
    sendAttendanceNotification
  } = useNotificationActions();

  return (
    <Card className="bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Teacher Notifications</CardTitle>
        <CardDescription>Test teacher notification triggers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => sendAssignmentNotification({
              title: 'Calculus Homework',
              className: 'Grade 10-A',
              dueDate: 'Tomorrow 9:00 AM'
            })}
          >
            Assignment Due
          </Button>
          <Button
            variant="outline"
            onClick={() => sendAttendanceNotification({
              className: 'Grade 11-B',
              absentCount: 3
            })}
          >
            Low Attendance
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function MetronNotificationDemo() {
  const {
    sendDormitoryAssignmentNotification,
    sendLateCheckinNotification
  } = useNotificationActions();

  return (
    <Card className="bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Metron Notifications</CardTitle>
        <CardDescription>Test metron notification triggers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => sendDormitoryAssignmentNotification({
              girlName: 'Sarah Johnson',
              dormitory: 'Rose Hall',
              bed: 'B-204-A'
            })}
          >
            New Assignment
          </Button>
          <Button
            variant="outline"
            onClick={() => sendLateCheckinNotification({
              studentName: 'Emma Wilson',
              checkinTime: '10:45 PM',
              delay: 45
            })}
          >
            Late Check-in
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function PatronNotificationDemo() {
  const {
    sendDisciplinaryNotification,
    sendMaintenanceNotification
  } = useNotificationActions();

  return (
    <Card className="bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Patron Notifications</CardTitle>
        <CardDescription>Test patron notification triggers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => sendDisciplinaryNotification({
              studentName: 'Michael Chen',
              incidentType: 'Fighting',
              severity: 'High'
            })}
          >
            Disciplinary Incident
          </Button>
          <Button
            variant="outline"
            onClick={() => sendMaintenanceNotification({
              location: 'Oak Hall, Room 301',
              issue: 'Broken bed frame'
            })}
          >
            Maintenance Request
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}