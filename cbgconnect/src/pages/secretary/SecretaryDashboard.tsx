import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, FileText, Calendar, Bell, TrendingUp, Clock, DollarSign, Shield, Search, Filter, Download, Printer, Mail, Phone, CheckCircle, AlertCircle, UserPlus, BarChart3, Archive, Database, Eye, Edit, Trash2, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import apiService from "@/services/api"

export default function SecretaryDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await apiService.request({
          method: 'GET',
          url: '/dashboard/secretary'
        });
        setDashboardData(data);
        setError(null);
      } catch (err: any) {
        // Don't show error for network errors - just log it
        if (err.code === 'ERR_NETWORK') {
          console.log('Backend server not available - using offline mode');
          setError('Backend server not available - showing demo data');
        } else {
          setError(err.message || 'Failed to fetch dashboard data');
        }
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    feePayments: 0,
    pendingForms: 0,
    newAdmissions: 0,
    attendanceRate: 0,
    urgentTasks: 0
  };

  const pendingTasks = dashboardData.pendingTasks || [];
  const recentActivities = dashboardData.recentActivities || [];
  const upcomingEvents = dashboardData.upcomingEvents || [];
  const quickActions = dashboardData.quickActions || [];

  const handleTaskComplete = (taskId: number) => {
    toast.success("Task marked as completed!")
    // In real app, update task status
  };

  const handleQuickAction = (path: string) => {
    navigate(path);
    toast.info(`Navigating to ${path.split('/').pop()}`);
  };

  const handleStudentSearch = () => {
    if (searchTerm) {
      toast.info(`Searching for: ${searchTerm}`);
      // In real app, implement search
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700"
      case "medium": return "bg-amber-100 text-amber-700"
      case "low": return "bg-blue-100 text-blue-700"
      default: return "bg-gray-100 text-gray-700"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-5 w-5" />
                <Badge className="bg-white/20 hover:bg-white/30">Secretary Portal</Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">Welcome back</h1>
              <p className="text-blue-100 mt-2">Manage school administration and student records</p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="secondary" 
                onClick={() => navigate('/secretary/profile')}
                className="bg-white/10 hover:bg-white/20 border-white/20"
              >
                My Profile
              </Button>
              <Button 
                onClick={() => navigate('/secretary/settings')}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search students, parents, or records..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleStudentSearch()}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSearchTerm("")}>
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button onClick={handleStudentSearch}>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Quick Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Stats */}
            <Card className="border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Today's Overview
                </CardTitle>
                <CardDescription>
                  Real-time school administration statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 rounded-xl bg-blue-50 border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalStudents}</div>
                    <p className="text-sm text-gray-600">Total Students</p>
                    <div className="mt-2 flex justify-center gap-2 text-xs">
                      <span className="text-green-600">{stats.presentToday} present</span>
                      <span className="text-red-600">{stats.absentToday} absent</span>
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-green-50 border border-green-200">
                    <div className="text-2xl font-bold text-green-600">{stats.feePayments}</div>
                    <p className="text-sm text-gray-600">Fee Payments Today</p>
                    <div className="mt-2 text-xs text-gray-500">Last hour: 5 payments</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-purple-50 border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">{stats.pendingForms}</div>
                    <p className="text-sm text-gray-600">Pending Forms</p>
                    <div className="mt-2 text-xs text-gray-500">Require processing</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="text-2xl font-bold text-amber-600">{stats.newAdmissions}</div>
                    <p className="text-sm text-gray-600">New Admissions</p>
                    <div className="mt-2 text-xs text-gray-500">Awaiting approval</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-cyan-50 border border-cyan-200">
                    <div className="text-2xl font-bold text-cyan-600">{stats.attendanceRate}%</div>
                    <p className="text-sm text-gray-600">Attendance Rate</p>
                    <Progress value={stats.attendanceRate} className="h-2 mt-2" />
                  </div>
                  <div className="text-center p-4 rounded-xl bg-red-50 border border-red-200">
                    <div className="text-2xl font-bold text-red-600">{stats.urgentTasks}</div>
                    <p className="text-sm text-gray-600">Urgent Tasks</p>
                    <div className="mt-2 text-xs text-gray-500">Require immediate attention</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Frequently used administrative tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action: any, index: number) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        className={`w-full h-20 flex-col gap-2 ${action.color}`}
                        onClick={() => handleQuickAction(action.path)}
                      >
                        <action.icon className="h-6 w-6" />
                        <span className="text-sm">{action.title}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Pending Tasks & Recent Activities */}
          <div className="space-y-8">
            {/* Pending Tasks */}
            <Card className="border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Pending Tasks
                </CardTitle>
                <CardDescription>
                  Tasks requiring your attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingTasks.slice(0, 5).map((task: any) => (
                    <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className="text-xs text-gray-500">{task.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Button size="sm" onClick={() => handleTaskComplete(task.id)}>
                          Complete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activities
                </CardTitle>
                <CardDescription>
                  Latest administrative actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.slice(0, 5).map((activity: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                        <Badge 
                          variant={activity.status === 'completed' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {activity.status}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upcoming Events */}
        <Card className="border-gray-200 shadow-lg mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
            <CardDescription>
              Important dates and deadlines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingEvents.map((event: any, index: number) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      event.type === 'meeting' ? 'bg-blue-100' :
                      event.type === 'deadline' ? 'bg-red-100' : 'bg-green-100'
                    }`}>
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-gray-500">{event.date}</p>
                      <p className="text-xs text-gray-500">{event.time}</p>
                      {event.location && (
                        <p className="text-xs text-gray-500">{event.location}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
