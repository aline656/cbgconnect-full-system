// src/pages/teacher/Grades.tsx
import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download,
  TrendingUp,
  Award,
  Users,
  BookOpen,
  BarChart3,
  Eye,
  Edit,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface GradebookEntry {
  studentId: string;
  studentName: string;
  className: string;
  grades: {
    [assignmentId: string]: number;
  };
  average: number;
  attendance: number;
  status: 'passing' | 'at_risk' | 'failing';
}

interface GradeDistribution {
  range: string;
  count: number;
  percentage: number;
  color: string;
}

export default function Grades() {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const gradebookEntries: GradebookEntry[] = [
    {
      studentId: 'GS2023001',
      studentName: 'Sarah Johnson',
      className: 'Grade 10-A',
      grades: {
        'assignment1': 85,
        'assignment2': 92,
        'quiz1': 88,
        'midterm': 90
      },
      average: 89,
      attendance: 95,
      status: 'passing'
    },
    {
      studentId: 'BS2023001',
      studentName: 'Michael Chen',
      className: 'Grade 11-B',
      grades: {
        'assignment1': 78,
        'assignment2': 85,
        'quiz1': 82,
        'midterm': 80
      },
      average: 81,
      attendance: 92,
      status: 'passing'
    },
    {
      studentId: 'GS2023002',
      studentName: 'Emma Wilson',
      className: 'Grade 12-A',
      grades: {
        'assignment1': 92,
        'assignment2': 95,
        'quiz1': 90,
        'midterm': 93
      },
      average: 93,
      attendance: 98,
      status: 'passing'
    },
    {
      studentId: 'BS2023002',
      studentName: 'David Rodriguez',
      className: 'Grade 10-B',
      grades: {
        'assignment1': 65,
        'assignment2': 70,
        'quiz1': 68,
        'midterm': 62
      },
      average: 66,
      attendance: 85,
      status: 'at_risk'
    },
    {
      studentId: 'BS2023003',
      studentName: 'Alex Turner',
      className: 'Grade 11-B',
      grades: {
        'assignment1': 58,
        'assignment2': 62,
        'quiz1': 55,
        'midterm': 60
      },
      average: 59,
      attendance: 78,
      status: 'failing'
    },
  ];

  const gradeDistribution: GradeDistribution[] = [
    { range: '90-100', count: 8, percentage: 32, color: 'bg-green-500' },
    { range: '80-89', count: 10, percentage: 40, color: 'bg-blue-500' },
    { range: '70-79', count: 4, percentage: 16, color: 'bg-yellow-500' },
    { range: '60-69', count: 2, percentage: 8, color: 'bg-orange-500' },
    { range: '0-59', count: 1, percentage: 4, color: 'bg-red-500' },
  ];

  const filteredEntries = gradebookEntries.filter(entry => {
    const matchesSearch = entry.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || entry.className === selectedClass;
    return matchesSearch && matchesClass;
  });

  const getStatusColor = (status: GradebookEntry['status']) => {
    switch (status) {
      case 'passing': return 'bg-green-100 text-green-800';
      case 'at_risk': return 'bg-yellow-100 text-yellow-800';
      case 'failing': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: GradebookEntry['status']) => {
    switch (status) {
      case 'passing': return 'Passing';
      case 'at_risk': return 'At Risk';
      case 'failing': return 'Failing';
      default: return 'Unknown';
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600 font-bold';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    if (grade >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grades</h1>
          <p className="text-muted-foreground">Manage and analyze student grades</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Grades
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Enter Grades
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.round(gradebookEntries.reduce((acc, e) => acc + e.average, 0) / gradebookEntries.length)}%
              </div>
              <p className="text-sm text-muted-foreground">Class Average</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {gradebookEntries.filter(e => e.status === 'passing').length}
              </div>
              <p className="text-sm text-muted-foreground">Passing Students</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {gradebookEntries.filter(e => e.status === 'at_risk' || e.status === 'failing').length}
              </div>
              <p className="text-sm text-muted-foreground">At Risk/Failing</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.round(gradebookEntries.reduce((acc, e) => acc + e.attendance, 0) / gradebookEntries.length)}%
              </div>
              <p className="text-sm text-muted-foreground">Avg Attendance</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Grade Distribution */}
        <Card className="lg:col-span-1 bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
            <CardDescription>Current class grade spread</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {gradeDistribution.map((dist) => (
                <div key={dist.range} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{dist.range}</span>
                    <span className="font-medium">{dist.count} students ({dist.percentage}%)</span>
                  </div>
                  <Progress value={dist.percentage} className="h-2" />
                </div>
              ))}
              
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Top Performers</p>
                    <p className="text-muted-foreground">3 students ≥ 90%</p>
                  </div>
                  <div>
                    <p className="font-medium">Need Improvement</p>
                    <p className="text-muted-foreground">3 students - 70%</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gradebook Table */}
        <Card className="lg:col-span-2 bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gradebook</CardTitle>
                <CardDescription>Student grades and performance</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    className="pl-9 w-[200px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="Grade 10-A">Grade 10-A</SelectItem>
                    <SelectItem value="Grade 11-B">Grade 11-B</SelectItem>
                    <SelectItem value="Grade 12-A">Grade 12-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Assignment 1</TableHead>
                    <TableHead>Assignment 2</TableHead>
                    <TableHead>Quiz 1</TableHead>
                    <TableHead>Midterm</TableHead>
                    <TableHead>Average</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow key={entry.studentId}>
                      <TableCell className="font-medium">{entry.studentName}</TableCell>
                      <TableCell>{entry.studentId}</TableCell>
                      <TableCell>{entry.className}</TableCell>
                      <TableCell className={getGradeColor(entry.grades.assignment1)}>
                        {entry.grades.assignment1}%
                      </TableCell>
                      <TableCell className={getGradeColor(entry.grades.assignment2)}>
                        {entry.grades.assignment2}%
                      </TableCell>
                      <TableCell className={getGradeColor(entry.grades.quiz1)}>
                        {entry.grades.quiz1}%
                      </TableCell>
                      <TableCell className={getGradeColor(entry.grades.midterm)}>
                        {entry.grades.midterm}%
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${getGradeColor(entry.average)}`}>
                            {entry.average}%
                          </span>
                          <Progress value={entry.average} className="w-16 h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(entry.status)}>
                          {getStatusText(entry.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analysis */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Performance Analysis</CardTitle>
          <CardDescription>Detailed analysis of student performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-4">
              <h4 className="font-medium flex items-center">
                <TrendingUp className="mr-2 h-4 w-4 text-green-600" />
                Top Performers
              </h4>
              <div className="space-y-2">
                {gradebookEntries
                  .sort((a, b) => b.average - a.average)
                  .slice(0, 3)
                  .map((entry, index) => (
                    <div key={entry.studentId} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <Award className={`h-5 w-5 ${
                          index === 0 ? 'text-amber-500' : 
                          index === 1 ? 'text-gray-400' : 'text-amber-800'
                        }`} />
                        <span>{entry.studentName}</span>
                      </div>
                      <span className="font-bold">{entry.average}%</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium flex items-center">
                <BookOpen className="mr-2 h-4 w-4 text-amber-600" />
                Improvement Needed
              </h4>
              <div className="space-y-2">
                {gradebookEntries
                  .filter(e => e.status === 'at_risk' || e.status === 'failing')
                  .map((entry) => (
                    <div key={entry.studentId} className="flex items-center justify-between p-2 border rounded">
                      <span>{entry.studentName}</span>
                      <div className="text-right">
                        <span className="font-bold text-red-600">{entry.average}%</span>
                        <p className="text-xs text-muted-foreground">Attendance: {entry.attendance}%</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium flex items-center">
                <BarChart3 className="mr-2 h-4 w-4 text-blue-600" />
                Quick Actions
              </h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Generate Report Cards
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Send Progress Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Schedule Parent Meetings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Create Grade Curve
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}