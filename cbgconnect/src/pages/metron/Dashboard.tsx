// src/pages/metron/Dashboard.tsx
import { useState, useEffect } from 'react';
import { Users, Home, Calendar, Activity, BookOpen, Bell, TrendingUp, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useMetronDashboard } from '@/hooks/useRealTimeData';
import apiService from '@/services/api';

export default function MetronDashboard() {
  const { data: dashboardData, loading, error, refetch } = useMetronDashboard();
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
    totalGirls: 0,
    internalGirls: 0,
    externalGirls: 0,
    dormitoryOccupancy: 0,
    activeActivities: 0,
    pendingReports: 0
  };

  const recentActivities = dashboardData.recentActivities || [];
  const pendingTasks = dashboardData.pendingTasks || [];
  const recentAssignments = dashboardData.recentAssignments || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Metron Dashboard</h1>
          <p className="text-muted-foreground">Manage girls' dormitory, activities, and reports</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Avatar>
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Metron" />
            <AvatarFallback>MT</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Girls</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGirls}</div>
            <p className="text-xs text-muted-foreground">
              {stats.internalGirls} internal, {stats.externalGirls} external
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dormitory Occupancy</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.dormitoryOccupancy}%</div>
            <Progress value={stats.dormitoryOccupancy} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeActivities}</div>
            <p className="text-xs text-muted-foreground">4 cultural, 3 sports, 5 academic</p>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReports}</div>
            <p className="text-xs text-muted-foreground">2 require immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 rounded-lg border p-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {activity.type === 'assignment' && <Home className="h-4 w-4 text-primary" />}
                      {activity.type === 'checkin' && <Calendar className="h-4 w-4 text-primary" />}
                      {activity.type === 'activity' && <Activity className="h-4 w-4 text-primary" />}
                      {activity.type === 'health' && <Shield className="h-4 w-4 text-primary" />}
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.description}</p>
                    <p className="text-sm text-muted-foreground">{activity.girl}</p>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    {activity.time}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button className="justify-start" variant="outline">
                <Home className="mr-2 h-4 w-4" />
                Assign Dormitory
              </Button>
              <Button className="justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Add New Girl
              </Button>
              <Button className="justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Activity
              </Button>
              <Button className="justify-start" variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                Create Report
              </Button>
              <Button className="justify-start" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Schedule */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Upcoming Schedule</CardTitle>
          <CardDescription>Next 7 days activities and events</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tomorrow">
            <TabsList>
              <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
            </TabsList>
            <TabsContent value="tomorrow" className="space-y-2 pt-4">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">Morning Assembly</p>
                  <p className="text-sm text-muted-foreground">All girls - 8:00 AM</p>
                </div>
                <Badge>Mandatory</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">Sports Practice</p>
                  <p className="text-sm text-muted-foreground">Volleyball Team - 4:00 PM</p>
                </div>
                <Badge variant="outline">Optional</Badge>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}