// src/hooks/useNotificationActions.ts
import { useNotifications } from '@/contexts/NotificationContext';

export function useNotificationActions() {
  const { addNotification } = useNotifications();

  const sendAssignmentNotification = (data: {
    title: string;
    className: string;
    dueDate: string;
  }) => {
    addNotification({
      title: data.title,
      description: `${data.className} assignment due on ${data.dueDate}`,
      type: 'reminder',
      role: 'teacher',
      priority: 'medium',
      category: 'assignment',
      sender: 'Assignment System'
    });
  };

  const sendAttendanceNotification = (data: {
    className: string;
    absentCount: number;
  }) => {
    addNotification({
      title: 'Low Attendance Alert',
      description: `${data.className} has ${data.absentCount} absent students`,
      type: 'warning',
      role: 'teacher',
      priority: 'medium',
      category: 'attendance',
      sender: 'Attendance System'
    });
  };

  const sendDormitoryAssignmentNotification = (data: {
    girlName: string;
    dormitory: string;
    bed: string;
  }) => {
    addNotification({
      title: 'New Dormitory Assignment',
      description: `${data.girlName} assigned to ${data.dormitory}, Bed ${data.bed}`,
      type: 'info',
      role: 'metron',
      priority: 'medium',
      category: 'dormitory',
      sender: 'Dormitory System'
    });
  };

  const sendLateCheckinNotification = (data: {
    studentName: string;
    checkinTime: string;
    delay: number;
  }) => {
    addNotification({
      title: 'Late Check-in',
      description: `${data.studentName} checked in ${data.delay} minutes late at ${data.checkinTime}`,
      type: 'warning',
      role: 'metron',
      priority: 'high',
      category: 'dormitory',
      sender: 'Security System'
    });
  };

  const sendDisciplinaryNotification = (data: {
    studentName: string;
    incidentType: string;
    severity: string;
  }) => {
    addNotification({
      title: 'Disciplinary Incident',
      description: `${data.studentName} - ${data.incidentType} (${data.severity})`,
      type: 'error',
      role: 'patron',
      priority: 'high',
      category: 'discipline',
      sender: 'Security'
    });
  };

  const sendMaintenanceNotification = (data: {
    location: string;
    issue: string;
  }) => {
    addNotification({
      title: 'Maintenance Request',
      description: `${data.issue} at ${data.location}`,
      type: 'warning',
      role: 'patron',
      priority: 'medium',
      category: 'dormitory',
      sender: 'Facilities Department'
    });
  };

  const sendSystemNotification = (data: {
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high';
  }) => {
    addNotification({
      title: data.title,
      description: data.message,
      type: 'info',
      role: 'all',
      priority: data.priority,
      category: 'system',
      sender: 'System Admin'
    });
  };

  return {
    sendAssignmentNotification,
    sendAttendanceNotification,
    sendDormitoryAssignmentNotification,
    sendLateCheckinNotification,
    sendDisciplinaryNotification,
    sendMaintenanceNotification,
    sendSystemNotification
  };
}