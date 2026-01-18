// src/pages/teacher/Attendance.tsx
import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Users, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface AttendanceRecord {
  id: string;
  date: string;
  className: string;
  subject: string;
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  attendanceRate: number;
}

interface StudentAttendance {
  id: string;
  name: string;
  studentId: string;
  status: 'present' | 'absent' | 'late';
  checkInTime?: string;
}

export default function Attendance() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const attendanceRecords: AttendanceRecord[] = [
    {
      id: '1',
      date: '2024-01-15',
      className: 'Grade 10-A',
      subject: 'Mathematics',
      totalStudents: 24,
      present: 22,
      absent: 1,
      late: 1,
      attendanceRate: 92
    },
    {
      id: '2',
      date: '2024-01-15',
      className: 'Grade 11-B',
      subject: 'Physics',
      totalStudents: 22,
      present: 20,
      absent: 1,
      late: 1,
      attendanceRate: 91
    },
    {
      id: '3',
      date: '2024-01-14',
      className: 'Grade 10-A',
      subject: 'Mathematics',
      totalStudents: 24,
      present: 23,
      absent: 1,
      late: 0,
      attendanceRate: 96
    },
    {
      id: '4',
      date: '2024-01-14',
      className: 'Grade 12-A',
      subject: 'Advanced Mathematics',
      totalStudents: 20,
      present: 19,
      absent: 1,
      late: 0,
      attendanceRate: 95
    },
  ];

  const studentAttendance: StudentAttendance[] = [
    { id: '1', name: 'Sarah Johnson', studentId: 'GS2023001', status: 'present', checkInTime: '08:55' },
    { id: '2', name: 'Michael Chen', studentId: 'BS2023001', status: 'present', checkInTime: '08:58' },
    { id: '3', name: 'Emma Wilson', studentId: 'GS2023002', status: 'late', checkInTime: '09:15' },
    { id: '4', name: 'David Rodriguez', studentId: 'BS2023002', status: 'absent' },
    { id: '5', name: 'Alex Turner', studentId: 'BS2023003', status: 'present', checkInTime: '08:50' },
  ];

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesSearch = record.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || record.className === selectedClass;
    return matchesSearch && matchesClass;
  });

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const currentDateStr = currentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const getStatusIcon = (status: StudentAttendance['status']) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'absent': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'late': return <Clock className="h-4 w-4 text-amber-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: StudentAttendance['status']) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">Track and manage student attendance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Take Attendance
          </Button>
        </div>
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
              <div className="text-2xl font-bold">{currentDateStr}</div>
              <div className="text-muted-foreground">Today's Attendance</div>
            </div>
            
            <Button variant="outline" onClick={() => navigateDate('next')}>
              Next Day
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {attendanceRecords.reduce((acc, r) => acc + r.totalStudents, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.round(attendanceRecords.reduce((acc, r) => acc + r.attendanceRate, 0) / attendanceRecords.length)}%
              </div>
              <p className="text-sm text-muted-foreground">Overall Attendance</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {attendanceRecords.reduce((acc, r) => acc + r.absent, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Total Absent</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {attendanceRecords.reduce((acc, r) => acc + r.late, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Total Late</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Today's Attendance</CardTitle>
              <CardDescription>Mark attendance for your classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger>
                        <Users className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        <SelectItem value="Grade 10-A">Grade 10-A</SelectItem>
                        <SelectItem value="Grade 11-B">Grade 11-B</SelectItem>
                        <SelectItem value="Grade 12-A">Grade 12-A</SelectItem>
                        <SelectItem value="Grade 10-B">Grade 10-B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search students..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Attendance Sheet */}
                <div className="border rounded-lg">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50/50">
                    <div className="col-span-1">
                      <Label className="font-medium">#</Label>
                    </div>
                    <div className="col-span-4">
                      <Label className="font-medium">Student Name</Label>
                    </div>
                    <div className="col-span-3">
                      <Label className="font-medium">Student ID</Label>
                    </div>
                    <div className="col-span-4">
                      <Label className="font-medium">Attendance Status</Label>
                    </div>
                  </div>

                  {studentAttendance.map((student, index) => (
                    <div key={student.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50/30">
                      <div className="col-span-1 flex items-center">
                        {index + 1}
                      </div>
                      <div className="col-span-4 flex items-center">
                        <span className="font-medium">{student.name}</span>
                      </div>
                      <div className="col-span-3 flex items-center">
                        <span className="text-muted-foreground">{student.studentId}</span>
                      </div>
                      <div className="col-span-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Checkbox id={`present-${student.id}`} defaultChecked={student.status === 'present'} />
                            <Label htmlFor={`present-${student.id}`} className="flex items-center">
                              <CheckCircle className="mr-1 h-4 w-4 text-green-600" />
                              Present
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox id={`absent-${student.id}`} defaultChecked={student.status === 'absent'} />
                            <Label htmlFor={`absent-${student.id}`} className="flex items-center">
                              <XCircle className="mr-1 h-4 w-4 text-red-600" />
                              Absent
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox id={`late-${student.id}`} defaultChecked={student.status === 'late'} />
                            <Label htmlFor={`late-${student.id}`} className="flex items-center">
                              <Clock className="mr-1 h-4 w-4 text-amber-600" />
                              Late
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between">
                  <Button variant="outline">Save as Draft</Button>
                  <Button>Submit Attendance</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
              <CardDescription>Previous attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-indigo-100">
                        <Calendar className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{record.className} - {record.subject}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{record.date}</span>
                          <span>{record.totalStudents} students</span>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            {record.present} Present
                          </Badge>
                          <Badge className="bg-red-100 text-red-800">
                            <XCircle className="mr-1 h-3 w-3" />
                            {record.absent} Absent
                          </Badge>
                          <Badge className="bg-amber-100 text-amber-800">
                            <Clock className="mr-1 h-3 w-3" />
                            {record.late} Late
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{record.attendanceRate}%</div>
                      <Progress value={record.attendanceRate} className="w-32 mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Attendance Analytics */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Attendance Analytics</CardTitle>
          <CardDescription>Attendance trends and patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-4">
              <h4 className="font-medium">Weekly Attendance Trend</h4>
              <div className="space-y-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-sm">{day}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={85 - index * 5} className="w-32 h-2" />
                      <span className="text-sm font-medium">{85 - index * 5}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Class-wise Attendance</h4>
              <div className="space-y-2">
                {attendanceRecords.slice(0, 3).map((record) => (
                  <div key={record.id} className="flex items-center justify-between">
                    <span className="text-sm">{record.className}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={record.attendanceRate} className="w-32 h-2" />
                      <span className="text-sm font-medium">{record.attendanceRate}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Attendance Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Overall Attendance Rate</span>
                  <span className="font-medium">94%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Perfect Attendance Students</span>
                  <span className="font-medium">18</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Frequent Absences</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Parent Notifications Sent</span>
                  <span className="font-medium">5</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}