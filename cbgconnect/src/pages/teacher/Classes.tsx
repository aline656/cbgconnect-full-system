// src/pages/teacher/Classes.tsx
import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Users, Calendar, BookOpen, TrendingUp, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import apiService from '@/services/api';

interface Class {
  id: string;
  name: string;
  subject: string;
  grade: string;
  students: number;
  schedule: string;
  averagePerformance: number;
  attendanceRate: number;
  assignmentsPending: number;
}

export default function Classes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch classes from backend
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const data = await apiService.getTeacherClasses();
        setClasses(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch classes');
        console.error('Failed to fetch classes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error loading classes: {error}</div>
      </div>
    );
  }

  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || classItem.grade === selectedGrade;
    const matchesSubject = selectedSubject === 'all' || classItem.subject === selectedSubject;
    return matchesSearch && matchesGrade && matchesSubject;
  });

  const getPerformanceColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    return 'text-amber-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
          <p className="text-muted-foreground">Manage your classes and student information</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Class
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search classes or subjects..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="9">Grade 9</SelectItem>
                  <SelectItem value="10">Grade 10</SelectItem>
                  <SelectItem value="11">Grade 11</SelectItem>
                  <SelectItem value="12">Grade 12</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="Biology">Biology</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{classes.length}</div>
              <p className="text-sm text-muted-foreground">Total Classes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {classes.reduce((acc, c) => acc + c.students, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.round(classes.reduce((acc, c) => acc + c.averagePerformance, 0) / classes.length)}%
              </div>
              <p className="text-sm text-muted-foreground">Avg Performance</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.round(classes.reduce((acc, c) => acc + c.attendanceRate, 0) / classes.length)}%
              </div>
              <p className="text-sm text-muted-foreground">Avg Attendance</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.map((classItem) => (
          <Card key={classItem.id} className="bg-white/50 backdrop-blur-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{classItem.name}</CardTitle>
                  <CardDescription>{classItem.subject} • Grade {classItem.grade}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Class</DropdownMenuItem>
                    <DropdownMenuItem>Manage Students</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete Class</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <Users className="mr-2 h-3 w-3 text-muted-foreground" />
                    <span>{classItem.students} Students</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-3 w-3 text-muted-foreground" />
                    <span>{classItem.schedule}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <BookOpen className="mr-2 h-3 w-3 text-muted-foreground" />
                    <span>{classItem.assignmentsPending} Pending</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="mr-2 h-3 w-3 text-muted-foreground" />
                    <span className={getPerformanceColor(classItem.averagePerformance)}>
                      {classItem.averagePerformance}% Avg
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Attendance Rate</span>
                  <span className="font-medium">{classItem.attendanceRate}%</span>
                </div>
                <Progress value={classItem.attendanceRate} className="h-2" />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button size="sm" className="flex-1">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-lg font-semibold mb-2">No classes found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedGrade !== 'all' || selectedSubject !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first class to get started'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
