import { useState, useEffect } from 'react';
import { Award, Bell, BookOpen, Calendar, Clock, FileText, TrendingUp, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useTeacherDashboard } from '@/hooks/useRealTimeData';
import apiService from '@/services/api';

export default function TeacherDashboard() {
  const { data: dashboardData, loading, error, refetch } = useTeacherDashboard();
  const [userProfile, setUserProfile] = useState<any>(null);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await apiService.getCurrentUser();
        setUserProfile(profile);
      } catch (err: any) {
        // Don't show error for network errors - just log it
        if (err.code === 'ERR_NETWORK') {
          console.log('Backend server not available - using offline mode');
        } else {
          console.error('Failed to fetch user profile:', err);
        }
      }
    };

    fetchUserProfile();
  }, []);

  // Handle profile image update
  const handleProfileImageUpdate = async (imageUrl: string) => {
    try {
      await apiService.updateUserProfile(userProfile?.id, { profileImage: imageUrl });
      setUserProfile(prev => prev ? { ...prev, profileImage: imageUrl } : null);
    } catch (err) {
      console.error('Failed to update profile image:', err);
    }
  };

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
        <div className="text-red-500">Error loading dashboard: {error}</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">No dashboard data available</div>
      </div>
    );
  }

  const stats = dashboardData.stats || {
    totalStudents: 0,
    classesTeaching: 0,
    assignmentsPending: 0,
    assignmentsGraded: 0,
    attendanceRate: 0,
    averagePerformance: 0
  };

  const upcomingClasses = dashboardData.upcomingClasses || [];
  const pendingTasks = dashboardData.pendingTasks || [];
  const topStudents = dashboardData.topStudents || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Mr. Anderson</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Avatar>
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher" />
            <AvatarFallback>TA</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Across {stats.classesTeaching} classes
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assignmentsPending}</div>
            <p className="text-xs text-muted-foreground">
              {stats.assignmentsGraded} graded, {stats.assignmentsPending} pending
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
            <Progress value={stats.attendanceRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averagePerformance}%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +2.5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
            <CardDescription>Today's schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingClasses.map((classItem) => (
                <div key={classItem.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-indigo-100">
                      <Calendar className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{classItem.subject}</h3>
                      <p className="text-sm text-muted-foreground">{classItem.className}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{classItem.time}</p>
                    <p className="text-sm text-muted-foreground">{classItem.duration} mins</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
            <CardDescription>Urgent actions required</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div key={task.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {task.type === 'assignment' && <BookOpen className="h-4 w-4 text-blue-600" />}
                      {task.type === 'attendance' && <FileText className="h-4 w-4 text-green-600" />}
                      {task.type === 'meeting' && <Users className="h-4 w-4 text-purple-600" />}
                      <span className="font-medium text-sm">{task.title}</span>
                    </div>
                    <Badge variant={task.due === 'Today' ? 'destructive' : 'outline'}>
                      {task.due}
                    </Badge>
                  </div>
                  {task.count && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{task.count} submissions</span>
                      <Button size="sm">Grade Now</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Top Performing Students</CardTitle>
            <CardDescription>This month's leaders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} />
                      <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.grade}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Award className="h-4 w-4 text-amber-500" />
                      <span className="font-bold">{student.performance}%</span>
                    </div>
                    <p className="text-sm text-green-600">{student.improvement}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button className="justify-start" variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                Create Assignment
              </Button>
              <Button className="justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Take Attendance
              </Button>
              <Button className="justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Schedule Class
              </Button>
              <Button className="justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Button>
              <Button className="justify-start" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                Generate Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}