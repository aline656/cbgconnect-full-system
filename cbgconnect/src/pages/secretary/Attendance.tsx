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
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Loader,
  Eye,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { apiCall } from '@/lib/api';

interface AttendanceRecord {
  id: number;
  student_id: number;
  student_name: string;
  class_name: string;
  attendance_date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  check_in_time: string | null;
  notes: string;
}

interface StudentStats {
  student_id: number;
  student_name: string;
  class_name: string;
  total_days: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  excused_days: number;
  attendance_rate: number;
}

export default function SecretaryAttendance() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('today');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [studentStats, setStudentStats] = useState<StudentStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentStats | null>(null);

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedClass, selectedDateRange, currentDate]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (selectedClass !== 'all') {
        params.append('class_name', selectedClass);
      }

      // Fetch attendance records
      const records = await apiCall.get(`/api/attendance?${params}`);
      setAttendanceRecords(records);

      // Calculate student statistics
      const statsMap: Record<number, StudentStats> = {};
      records.forEach((record: AttendanceRecord) => {
        if (!statsMap[record.student_id]) {
          statsMap[record.student_id] = {
            student_id: record.student_id,
            student_name: record.student_name,
            class_name: record.class_name,
            total_days: 0,
            present_days: 0,
            absent_days: 0,
            late_days: 0,
            excused_days: 0,
            attendance_rate: 0
          };
        }

        statsMap[record.student_id].total_days++;
        
        if (record.status === 'present') {
          statsMap[record.student_id].present_days++;
        } else if (record.status === 'absent') {
          statsMap[record.student_id].absent_days++;
        } else if (record.status === 'late') {
          statsMap[record.student_id].late_days++;
        } else if (record.status === 'excused') {
          statsMap[record.student_id].excused_days++;
        }
      });

      // Calculate attendance rates
      Object.values(statsMap).forEach(stat => {
        stat.attendance_rate = stat.total_days > 0 
          ? Math.round(((stat.present_days + stat.late_days + stat.excused_days) / stat.total_days) * 100)
          : 0;
      });

      setStudentStats(Object.values(statsMap));
    } catch (error) {
      toast.error('Failed to fetch attendance data');
      console.error(error);
    } finally {
      setLoading(false);
    }
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

  const handleExportAttendance = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/attendance/export/csv', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Attendance exported successfully');
    } catch (error) {
      toast.error('Failed to export attendance');
      console.error(error);
    }
  };

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesSearch = record.student_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredStats = studentStats.filter(stat => {
    const matchesSearch = stat.student_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    total: attendanceRecords.length,
    present: attendanceRecords.filter(r => r.status === 'present').length,
    absent: attendanceRecords.filter(r => r.status === 'absent').length,
    late: attendanceRecords.filter(r => r.status === 'late').length,
    excused: attendanceRecords.filter(r => r.status === 'excused').length
  };

  const averageAttendanceRate = studentStats.length > 0
    ? Math.round(studentStats.reduce((sum, s) => sum + s.attendance_rate, 0) / studentStats.length)
    : 0;

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

  const getAttendanceRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-amber-600';
    return 'text-red-600';
  };

  const currentDateStr = currentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">School Attendance</h1>
          <p className="text-muted-foreground">View and manage school-wide attendance records</p>
        </div>
        <Button 
          onClick={handleExportAttendance}
          variant="outline"
        >
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total Records</p>
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
              <div className={`text-2xl font-bold ${getAttendanceRateColor(averageAttendanceRate)}`}>{averageAttendanceRate}%</div>
              <p className="text-sm text-muted-foreground">Avg. Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="class">Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="Grade 9">S1</SelectItem>
                  <SelectItem value="Grade 10">Grade 10</SelectItem>
                  <SelectItem value="Grade 11">Grade 11</SelectItem>
                  <SelectItem value="Grade 12">Grade 12</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label htmlFor="status">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="excused">Excused</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="records" className="space-y-4">
        <TabsList>
          <TabsTrigger value="records">Daily Records</TabsTrigger>
          <TabsTrigger value="statistics">Student Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          {/* Attendance Records */}
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>
                {filteredRecords.length} records found
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
                        <TableHead>Student</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Check-in Time</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <p className="text-muted-foreground">No attendance records found</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRecords.map((record) => (
                          <TableRow key={record.id} className="hover:bg-gray-50/50">
                            <TableCell className="font-medium">{record.student_name}</TableCell>
                            <TableCell>{record.class_name}</TableCell>
                            <TableCell>{new Date(record.attendance_date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(record.status)}>
                                  {record.status}
                                </Badge>
                                {getStatusIcon(record.status)}
                              </div>
                            </TableCell>
                            <TableCell>{record.check_in_time || '-'}</TableCell>
                            <TableCell>{record.notes || '-'}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          {/* Student Statistics */}
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Student Attendance Statistics</CardTitle>
              <CardDescription>
                Overall attendance performance by student
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader className="h-8 w-8 animate-spin" />
                </div>
              ) : filteredStats.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No students found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredStats.map((stat) => (
                    <div 
                      key={stat.student_id}
                      className="border rounded-lg p-4 hover:bg-gray-50/50 cursor-pointer"
                      onClick={() => {
                        setSelectedStudent(stat);
                        setIsDetailDialogOpen(true);
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold">{stat.student_name}</h3>
                          <p className="text-sm text-muted-foreground">{stat.class_name}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-2xl font-bold ${getAttendanceRateColor(stat.attendance_rate)}`}>
                            {stat.attendance_rate}%
                          </span>
                          <p className="text-sm text-muted-foreground">Attendance Rate</p>
                        </div>
                      </div>

                      <Progress value={stat.attendance_rate} className="mb-3" />

                      <div className="grid grid-cols-4 gap-2">
                        <div className="bg-green-50 rounded p-2 text-center">
                          <p className="text-sm font-semibold text-green-600">{stat.present_days}</p>
                          <p className="text-xs text-muted-foreground">Present</p>
                        </div>
                        <div className="bg-red-50 rounded p-2 text-center">
                          <p className="text-sm font-semibold text-red-600">{stat.absent_days}</p>
                          <p className="text-xs text-muted-foreground">Absent</p>
                        </div>
                        <div className="bg-amber-50 rounded p-2 text-center">
                          <p className="text-sm font-semibold text-amber-600">{stat.late_days}</p>
                          <p className="text-xs text-muted-foreground">Late</p>
                        </div>
                        <div className="bg-blue-50 rounded p-2 text-center">
                          <p className="text-sm font-semibold text-blue-600">{stat.excused_days}</p>
                          <p className="text-xs text-muted-foreground">Excused</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Student Detail Dialog */}
      {selectedStudent && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedStudent.student_name}</DialogTitle>
              <DialogDescription>
                Class: {selectedStudent.class_name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Overall Statistics</h3>
                <div className="grid grid-cols-5 gap-4">
                  <div className="bg-gray-50 rounded p-3 text-center">
                    <p className="text-2xl font-bold">{selectedStudent.total_days}</p>
                    <p className="text-xs text-muted-foreground">Total Days</p>
                  </div>
                  <div className="bg-green-50 rounded p-3 text-center">
                    <p className="text-2xl font-bold text-green-600">{selectedStudent.present_days}</p>
                    <p className="text-xs text-muted-foreground">Present</p>
                  </div>
                  <div className="bg-red-50 rounded p-3 text-center">
                    <p className="text-2xl font-bold text-red-600">{selectedStudent.absent_days}</p>
                    <p className="text-xs text-muted-foreground">Absent</p>
                  </div>
                  <div className="bg-amber-50 rounded p-3 text-center">
                    <p className="text-2xl font-bold text-amber-600">{selectedStudent.late_days}</p>
                    <p className="text-xs text-muted-foreground">Late</p>
                  </div>
                  <div className="bg-blue-50 rounded p-3 text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedStudent.excused_days}</p>
                    <p className="text-xs text-muted-foreground">Excused</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Attendance Rate</h3>
                <Progress value={selectedStudent.attendance_rate} className="mb-2" />
                <p className="text-center text-sm font-semibold">{selectedStudent.attendance_rate}%</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
