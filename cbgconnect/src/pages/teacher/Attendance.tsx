import { useState, useEffect } from 'react';
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
  TrendingUp,
  Save,
  Loader
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
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiCall } from '@/lib/api';

interface Student {
  id: number;
  name: string;
  student_id: string;
  class_name: string;
  status: 'present' | 'absent' | 'late' | 'excused';
}

interface AttendanceStats {
  total_days: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  excused_days: number;
  attendance_rate: number;
}

export default function TeacherAttendance() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [students, setStudents] = useState<(Student & { isChecked: boolean })[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [attendanceStats, setAttendanceStats] = useState<Record<number, AttendanceStats>>({});

  useEffect(() => {
    fetchStudents();
  }, [selectedClass]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedClass !== 'all') params.append('class_name', selectedClass);

      const data = await apiCall.get(`/api/students?${params}`);
      const enrichedStudents = await Promise.all(
        data.map(async (student: any) => {
          const stats = await apiCall.get(`/api/attendance/stats/${student.id}`);
          setAttendanceStats(prev => ({...prev, [student.id]: stats}));
          return {
            ...student,
            status: 'present' as const,
            isChecked: false
          };
        })
      );
      setStudents(enrichedStudents);
    } catch (error) {
      toast.error('Failed to fetch students');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async () => {
    try {
      setSaving(true);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      const records = students.map(student => ({
        student_id: student.id,
        class_id: null,
        attendance_date: dateStr,
        status: student.status,
        check_in_time: student.status === 'present' || student.status === 'late' ? new Date().toTimeString().split(' ')[0] : null,
        notes: ''
      }));

      await apiCall.post('/api/attendance/bulk', {
        class_id: selectedClass !== 'all' ? selectedClass : null,
        attendance_date: dateStr,
        records
      });

      toast.success(`Attendance marked for ${students.length} students`);
    } catch (error) {
      toast.error('Failed to mark attendance');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = (studentId: number, newStatus: 'present' | 'absent' | 'late' | 'excused') => {
    setStudents(students.map(s => 
      s.id === studentId ? {...s, status: newStatus} : s
    ));
  };

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setStudents(students.map(s => ({...s, isChecked: true})));
    } else {
      setStudents(students.map(s => ({...s, isChecked: false})));
    }
  };

  const handleMarkAllPresent = () => {
    const checkedStudents = students.filter(s => s.isChecked);
    setStudents(students.map(s => 
      s.isChecked ? {...s, status: 'present' as const} : s
    ));
    toast.success(`Marked ${checkedStudents.length} students as present`);
  };

  const handleMarkAllAbsent = () => {
    const checkedStudents = students.filter(s => s.isChecked);
    setStudents(students.map(s => 
      s.isChecked ? {...s, status: 'absent' as const} : s
    ));
    toast.success(`Marked ${checkedStudents.length} students as absent`);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.student_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    total: students.length,
    present: students.filter(s => s.status === 'present').length,
    absent: students.filter(s => s.status === 'absent').length,
    late: students.filter(s => s.status === 'late').length,
    excused: students.filter(s => s.status === 'excused').length
  };

  const attendanceRate = stats.total > 0 
    ? Math.round(((stats.present + stats.late + stats.excused) / stats.total) * 100)
    : 0;

  const currentDateStr = currentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'absent': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'late': return <Clock className="h-4 w-4 text-amber-600" />;
      case 'excused': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-amber-100 text-amber-800';
      case 'excused': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Class Attendance</h1>
          <p className="text-muted-foreground">Mark and manage student attendance</p>
        </div>
      </div>

      {/* Date Selector */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigateDate('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 text-center">
              <div className="text-lg font-semibold">{currentDateStr}</div>
              <p className="text-sm text-muted-foreground">
                {currentDate.toISOString().split('T')[0]}
              </p>
            </div>

            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigateDate('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Class Selector */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="class">Select Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="Grade 9">Grade 9</SelectItem>
                  <SelectItem value="Grade 10">Grade 10</SelectItem>
                  <SelectItem value="Grade 11">Grade 11</SelectItem>
                  <SelectItem value="Grade 12">Grade 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleMarkAttendance} disabled={saving}>
              {saving ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {saving ? 'Saving...' : 'Save Attendance'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50/50 backdrop-blur-sm border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.present}</div>
              <p className="text-sm text-muted-foreground">Present</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50/50 backdrop-blur-sm border-red-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
              <p className="text-sm text-muted-foreground">Absent</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50/50 backdrop-blur-sm border-amber-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{stats.late}</div>
              <p className="text-sm text-muted-foreground">Late</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50/50 backdrop-blur-sm border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{attendanceRate}%</div>
              <p className="text-sm text-muted-foreground">Attendance Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Label>Bulk Actions</Label>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleMarkAllPresent}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark Selected Present
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleMarkAllAbsent}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Mark Selected Absent
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Record
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search students..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Attendance Table */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
          <CardDescription>
            Click on a student to change their status for {currentDate.toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        onChange={(e) => handleToggleAll(e.target.checked)}
                        checked={students.length > 0 && students.every(s => s.isChecked)}
                      />
                    </TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Attendance Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <p className="text-muted-foreground">No students found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => {
                      const stats = attendanceStats[student.id];
                      const rate = stats?.attendance_rate || 0;
                      return (
                        <TableRow key={student.id} className="hover:bg-gray-50/50">
                          <TableCell>
                            <Checkbox 
                              checked={student.isChecked}
                              onChange={(e) => setStudents(students.map(s => 
                                s.id === student.id ? {...s, isChecked: e.target.checked} : s
                              ))}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.student_id}</TableCell>
                          <TableCell>{student.class_name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <select
                                value={student.status}
                                onChange={(e) => handleStatusChange(student.id, e.target.value as any)}
                                className="px-3 py-1 border rounded text-sm bg-white"
                              >
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                                <option value="late">Late</option>
                                <option value="excused">Excused</option>
                              </select>
                              {getStatusIcon(student.status)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="w-24">
                              <div className="flex items-center gap-2">
                                <Progress value={rate} className="h-2" />
                                <span className="text-xs font-medium">{Math.round(rate)}%</span>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle>Summary Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Average Attendance</p>
              <p className="text-2xl font-bold">{attendanceRate}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Students Present</p>
              <p className="text-2xl font-bold">{stats.present}/{stats.total}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Students Absent</p>
              <p className="text-2xl font-bold">{stats.absent}/{stats.total}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Present Rate</p>
              <Progress value={attendanceRate} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
