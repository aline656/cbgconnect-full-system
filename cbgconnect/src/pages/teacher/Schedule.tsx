// src/pages/teacher/Schedule.tsx
import { useState } from 'react';
import { 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface ScheduleItem {
  id: string;
  title: string;
  type: 'class' | 'meeting' | 'exam' | 'office_hours';
  className?: string;
  subject?: string;
  startTime: string;
  endTime: string;
  date: string;
  day: string;
  location: string;
  description?: string;
  participants?: number;
}

export default function Schedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDayName = daysOfWeek[currentDate.getDay()];
  const currentDateStr = currentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const scheduleItems: ScheduleItem[] = [
    {
      id: '1',
      title: 'Mathematics Class',
      type: 'class',
      className: 'Grade 10-A',
      subject: 'Mathematics',
      startTime: '09:00',
      endTime: '09:45',
      date: '2024-01-15',
      day: 'Monday',
      location: 'Room 201',
      participants: 24
    },
    {
      id: '2',
      title: 'Physics Class',
      type: 'class',
      className: 'Grade 11-B',
      subject: 'Physics',
      startTime: '11:00',
      endTime: '12:00',
      date: '2024-01-15',
      day: 'Monday',
      location: 'Lab 3',
      participants: 22
    },
    {
      id: '3',
      title: 'Department Meeting',
      type: 'meeting',
      startTime: '14:00',
      endTime: '15:00',
      date: '2024-01-15',
      day: 'Monday',
      location: 'Conference Room A',
      description: 'Monthly department meeting'
    },
    {
      id: '4',
      title: 'Office Hours',
      type: 'office_hours',
      startTime: '15:30',
      endTime: '17:00',
      date: '2024-01-15',
      day: 'Monday',
      location: 'Office 305',
      description: 'Student consultation hours'
    },
    {
      id: '5',
      title: 'Mid-term Exam',
      type: 'exam',
      className: 'Grade 12-A',
      subject: 'Advanced Mathematics',
      startTime: '10:00',
      endTime: '12:00',
      date: '2024-01-16',
      day: 'Tuesday',
      location: 'Exam Hall',
      participants: 20
    },
  ];

  const todaySchedule = scheduleItems.filter(item => item.date === '2024-01-15');

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const getTypeColor = (type: ScheduleItem['type']) => {
    switch (type) {
      case 'class': return 'bg-blue-100 text-blue-800';
      case 'meeting': return 'bg-purple-100 text-purple-800';
      case 'exam': return 'bg-red-100 text-red-800';
      case 'office_hours': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: ScheduleItem['type']) => {
    switch (type) {
      case 'class': return <Users className="h-4 w-4" />;
      case 'meeting': return <Users className="h-4 w-4" />;
      case 'exam': return <CalendarIcon className="h-4 w-4" />;
      case 'office_hours': return <Clock className="h-4 w-4" />;
      default: return <CalendarIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
          <p className="text-muted-foreground">Manage your class schedule and appointments</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <AddEventDialog onClose={() => setIsAddDialogOpen(false)} />
        </Dialog>
      </div>

      {/* Date Navigation */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous Day
            </Button>
            
            <div className="text-center">
              <div className="text-2xl font-bold">{currentDayName}</div>
              <div className="text-muted-foreground">{currentDateStr}</div>
            </div>
            
            <Button variant="outline" onClick={() => navigateDate('next')}>
              Next Day
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Views */}
      <Tabs defaultValue="day" className="space-y-4">
        <TabsList>
          <TabsTrigger value="day">Day View</TabsTrigger>
          <TabsTrigger value="week">Week View</TabsTrigger>
          <TabsTrigger value="month">Month View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="day" className="space-y-4">
          {/* Time Slots */}
          <div className="space-y-4">
            {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time) => {
              const events = todaySchedule.filter(event => 
                event.startTime <= time && event.endTime > time
              );
              
              return (
                <div key={time} className="flex">
                  <div className="w-24 flex-shrink-0 pt-2">
                    <div className="text-sm font-medium">{time}</div>
                  </div>
                  <div className="flex-1 border-t pt-2 min-h-[80px]">
                    {events.map((event) => (
                      <div 
                        key={event.id} 
                        className="mb-2 p-3 rounded-lg border bg-white shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getTypeColor(event.type)}>
                              {getTypeIcon(event.type)}
                              <span className="ml-1">
                                {event.type.replace('_', ' ').charAt(0).toUpperCase() + event.type.slice(1).replace('_', ' ')}
                              </span>
                            </Badge>
                            <span className="font-medium">{event.title}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {event.startTime} - {event.endTime}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-3 w-3 text-muted-foreground" />
                            <span>{event.location}</span>
                          </div>
                          {event.className && (
                            <div className="flex items-center">
                              <Users className="mr-2 h-3 w-3 text-muted-foreground" />
                              <span>{event.className} • {event.participants} students</span>
                            </div>
                          )}
                        </div>
                        {event.description && (
                          <p className="text-sm text-muted-foreground mt-2">{event.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>All Scheduled Events</CardTitle>
              <CardDescription>Complete list of your scheduled events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduleItems.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-indigo-100">
                        <CalendarIcon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{event.title}</h3>
                          <Badge variant="outline" className={getTypeColor(event.type)}>
                            {event.type.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <CalendarIcon className="mr-1 h-3 w-3" />
                            {event.day}, {event.date}
                          </span>
                          <span className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {event.startTime} - {event.endTime}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="mr-1 h-3 w-3" />
                            {event.location}
                          </span>
                        </div>
                        {event.className && (
                          <p className="text-sm mt-1">{event.className} • {event.subject}</p>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upcoming Events */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Upcoming Events This Week</CardTitle>
          <CardDescription>Important events in the coming days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {scheduleItems.slice(0, 4).map((event) => (
              <div key={event.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Badge className={getTypeColor(event.type)}>
                      {event.type.replace('_', ' ')}
                    </Badge>
                    <h3 className="font-semibold mt-2">{event.title}</h3>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-3 w-3 text-muted-foreground" />
                    <span>{event.day}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-3 w-3 text-muted-foreground" />
                    <span>{event.startTime} - {event.endTime}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-3 w-3 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AddEventDialog({ onClose }: { onClose: () => void }) {
  const [eventType, setEventType] = useState('class');

  return (
    <DialogContent className="sm:max-w-[600px] bg-white/90 backdrop-blur-sm">
      <DialogHeader>
        <DialogTitle>Add New Event</DialogTitle>
        <DialogDescription>
          Schedule a new class, meeting, exam, or office hours
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-6 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input id="title" placeholder="Enter event title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Event Type</Label>
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="class">Class</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="exam">Exam</SelectItem>
                <SelectItem value="office_hours">Office Hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {eventType === 'class' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="math-10a">Mathematics 10-A</SelectItem>
                  <SelectItem value="physics-11b">Physics 11-B</SelectItem>
                  <SelectItem value="math-12a">Advanced Mathematics 12-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Enter subject" />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="day">Day</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monday">Monday</SelectItem>
                <SelectItem value="tuesday">Tuesday</SelectItem>
                <SelectItem value="wednesday">Wednesday</SelectItem>
                <SelectItem value="thursday">Thursday</SelectItem>
                <SelectItem value="friday">Friday</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input id="startTime" type="time" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input id="endTime" type="time" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="Room number or location" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input id="duration" type="number" placeholder="45" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            placeholder="Additional details about the event..." 
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Recurrence</Label>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">One-time</Button>
            <Button variant="outline" size="sm">Daily</Button>
            <Button variant="outline" size="sm">Weekly</Button>
            <Button variant="outline" size="sm">Monthly</Button>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onClose}>
          Schedule Event
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}