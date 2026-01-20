import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Clock,
  MapPin,
  Users,
  Loader
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ScheduleEvent {
  id: number;
  classId: number;
  className: string;
  subject: string;
  startTime: string;
  endTime: string;
  room: string;
  day: string;
  students: number;
}

const mockSchedule: ScheduleEvent[] = [
  {
    id: 1,
    classId: 1,
    className: 'Grade 9-A',
    subject: 'Mathematics',
    startTime: '08:00',
    endTime: '09:00',
    room: 'Room 201',
    day: 'Monday',
    students: 45
  },
  {
    id: 2,
    classId: 2,
    className: 'Grade 9-B',
    subject: 'English',
    startTime: '09:00',
    endTime: '10:00',
    room: 'Room 202',
    day: 'Monday',
    students: 42
  },
  {
    id: 3,
    classId: 1,
    className: 'Grade 9-A',
    subject: 'Science',
    startTime: '10:30',
    endTime: '11:30',
    room: 'Room 201',
    day: 'Tuesday',
    students: 45
  },
  {
    id: 4,
    classId: 3,
    className: 'Grade 10-A',
    subject: 'Mathematics',
    startTime: '11:30',
    endTime: '12:30',
    room: 'Room 301',
    day: 'Wednesday',
    students: 38
  }
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = ['08:00', '09:00', '10:00', '10:30', '11:00', '11:30', '12:00', '13:00', '14:00', '14:30'];

export default function TeacherSchedule() {
  const [schedule, setSchedule] = useState<ScheduleEvent[]>(mockSchedule);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [saving, setSaving] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);

  const [formData, setFormData] = useState({
    classId: '',
    className: '',
    subject: '',
    startTime: '08:00',
    endTime: '09:00',
    room: '',
    day: 'Monday',
    students: ''
  });

  const daySchedule = schedule.filter(event => event.day === selectedDay);
  const sortedDaySchedule = daySchedule.sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleAddEvent = async () => {
    if (!formData.className || !formData.subject || !formData.room) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setSaving(true);
      const newEvent: ScheduleEvent = {
        id: Math.max(...schedule.map(s => s.id), 0) + 1,
        classId: parseInt(formData.classId) || 0,
        className: formData.className,
        subject: formData.subject,
        startTime: formData.startTime,
        endTime: formData.endTime,
        room: formData.room,
        day: formData.day,
        students: parseInt(formData.students) || 0
      };

      setSchedule([...schedule, newEvent]);
      toast.success('Event added successfully');
      setFormData({
        classId: '',
        className: '',
        subject: '',
        startTime: '08:00',
        endTime: '09:00',
        room: '',
        day: 'Monday',
        students: ''
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      toast.error('Failed to add event');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      setSaving(true);
      setSchedule(schedule.filter(e => e.id !== id));
      toast.success('Event deleted successfully');
    } catch (error) {
      toast.error('Failed to delete event');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      'Mathematics': 'bg-blue-100 text-blue-800',
      'English': 'bg-green-100 text-green-800',
      'Science': 'bg-purple-100 text-purple-800',
      'History': 'bg-amber-100 text-amber-800',
      'Urdu': 'bg-red-100 text-red-800',
      'Islamic Studies': 'bg-green-100 text-green-800'
    };
    return colors[subject] || 'bg-gray-100 text-gray-800';
  };

  const stats = {
    totalClasses: new Set(schedule.map(s => s.classId)).size,
    totalHours: schedule.reduce((sum) => sum + 1, 0),
    eventsThisWeek: schedule.filter(e => daysOfWeek.includes(e.day)).length,
    totalStudents: schedule.reduce((sum, s) => sum + s.students, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Schedule</h1>
          <p className="text-muted-foreground">Manage your class schedule</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.totalClasses}</div>
              <p className="text-sm text-muted-foreground">Classes</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50/50 backdrop-blur-sm border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalHours}</div>
              <p className="text-sm text-muted-foreground">Hours/Week</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50/50 backdrop-blur-sm border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.eventsThisWeek}</div>
              <p className="text-sm text-muted-foreground">This Week</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50/50 backdrop-blur-sm border-purple-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalStudents}</div>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly View */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>Your teaching schedule for the week</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Day selector */}
          <div className="grid grid-cols-5 gap-2 mb-6">
            {daysOfWeek.map(day => (
              <Button
                key={day}
                variant={selectedDay === day ? 'default' : 'outline'}
                onClick={() => setSelectedDay(day)}
                className="text-sm"
              >
                {day.substring(0, 3)}
              </Button>
            ))}
          </div>

          {/* Schedule for selected day */}
          <div className="space-y-3">
            {sortedDaySchedule.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No classes scheduled for {selectedDay}</p>
              </div>
            ) : (
              sortedDaySchedule.map(event => (
                <div
                  key={event.id}
                  className={`border rounded-lg p-4 ${getSubjectColor(event.subject)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{event.subject}</h3>
                      <p className="text-sm opacity-75">{event.className}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingEvent(event)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{event.room}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{event.students} students</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* List View */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>All Scheduled Classes</CardTitle>
          <CardDescription>{schedule.length} events scheduled</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {schedule.map(event => (
              <div
                key={event.id}
                className={`border rounded p-3 flex items-center justify-between ${getSubjectColor(event.subject)}`}
              >
                <div>
                  <p className="font-medium">{event.subject} - {event.className}</p>
                  <p className="text-sm opacity-75">
                    {event.day} • {event.startTime}-{event.endTime} • {event.room}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteEvent(event.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Event Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Schedule Event</DialogTitle>
            <DialogDescription>
              Add a new class to your schedule
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="class">Class Name</Label>
              <Input
                id="class"
                placeholder="e.g., Grade 9-A"
                value={formData.className}
                onChange={(e) => setFormData({...formData, className: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="e.g., Mathematics"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="day">Day</Label>
                <Select 
                  value={formData.day}
                  onValueChange={(value) => setFormData({...formData, day: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map(day => (
                      <SelectItem key={day} value={day}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="room">Room</Label>
                <Input
                  id="room"
                  placeholder="e.g., Room 201"
                  value={formData.room}
                  onChange={(e) => setFormData({...formData, room: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start">Start Time</Label>
                <Select 
                  value={formData.startTime}
                  onValueChange={(value) => setFormData({...formData, startTime: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="end">End Time</Label>
                <Select 
                  value={formData.endTime}
                  onValueChange={(value) => setFormData({...formData, endTime: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="students">Number of Students</Label>
              <Input
                id="students"
                type="number"
                placeholder="0"
                value={formData.students}
                onChange={(e) => setFormData({...formData, students: e.target.value})}
              />
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddEvent} disabled={saving}>
                {saving ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                {saving ? 'Adding...' : 'Add Event'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      {editingEvent && (
        <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Event Details (Read-only)</Label>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-medium">{editingEvent.subject}</p>
                  <p className="text-sm text-muted-foreground">
                    {editingEvent.day} • {editingEvent.startTime}-{editingEvent.endTime}
                  </p>
                  <p className="text-sm text-muted-foreground">{editingEvent.room}</p>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setEditingEvent(null)}>Close</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
