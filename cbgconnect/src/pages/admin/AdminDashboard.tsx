import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  BookOpen, 
  Calendar,
  Bell,
  Settings,
  Shield,
  BarChart3,
  PieChart,
  FileText,
  Database,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  UserPlus,
  Download,
  Filter,
  Search
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle ,CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { api } from "@/lib/api"
import apiService from "@/services/api"

// Dashboard will load from API

  const AdminDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("overview")
  const [adminData, setAdminData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const userResponse = await api.get("/auth/me")
        const { user } = userResponse.data
        
        // Fetch dashboard data from API
        const dashResponse = await apiService.getDashboardData('admin')

        setAdminData({
          user: {
            name: user.name,
            role: "System Administrator",
            avatar: user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase(),
            lastLogin: "Today, 9:15 AM"
          },
          ...dashResponse,
          quickStats: [
            { label: "New Students", value: "15", change: "+12%", icon: UserPlus, color: "bg-blue-500" },
            { label: "Revenue Today", value: "$2,850", change: "+8%", icon: DollarSign, color: "bg-green-500" },
            { label: "Active Sessions", value: "124", change: "+5%", icon: Activity, color: "bg-purple-500" },
            { label: "Pending Tasks", value: "18", change: "-3%", icon: Clock, color: "bg-amber-500" }
          ]
        })
      } catch (error) {
        toast.error("Failed to load admin data")
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [])

  const handleQuickAction = (action: string) => {
    switch(action) {
      case 'users':
        navigate('/admin/users')
        break
      case 'settings':
        navigate('/admin/settings')
        break
      case 'reports':
        navigate('/admin/reports')
        break
      case 'analytics':
        navigate('/admin/analytics')
        break
      default:
        toast.info(`Opening ${action} panel`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-700'
      case 'warning': return 'bg-amber-100 text-amber-700'
      case 'error': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getSystemStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'online':
      case 'protected':
      case 'completed':
        return 'bg-green-500'
      case 'warning':
        return 'bg-amber-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-5 w-5" />
                <Badge className="bg-white/20 hover:bg-white/30">System Admin</Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">Administration Dashboard</h1>
              <p className="text-gray-300 mt-2">Complete control over school management system</p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="secondary" 
                onClick={() => navigate('/admin/profile')}
                className="bg-white/10 hover:bg-white/20 border-white/20"
              >
                Admin Profile
              </Button>
              <Button 
                onClick={() => navigate('/admin/settings')}
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                System Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {adminData?.quickStats.map((stat: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border-gray-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <div className="flex items-baseline gap-2">
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        <Badge className={
                          stat.change.startsWith('+') ? 'bg-green-100 text-green-700' :
                          stat.change.startsWith('-') ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }>
                          {stat.change}
                        </Badge>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full ${stat.color} text-white`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Stats */}
          <div className="lg:col-span-2 space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card className="border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle>System Overview</CardTitle>
                    <CardDescription>
                      Key metrics and performance indicators
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(mockAdminData.stats).map(([key, value]) => (
                        <div key={key} className="text-center p-4 rounded-xl bg-gray-50">
                          <div className="text-2xl font-bold text-gray-900">{value}</div>
                          <p className="text-sm text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <Progress value={85} className="h-2 mt-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Frequently used administrative functions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { icon: Users, label: "User Management", action: "users" },
                        { icon: Settings, label: "System Settings", action: "settings" },
                        { icon: BarChart3, label: "Analytics", action: "analytics" },
                        { icon: FileText, label: "Reports", action: "reports" },
                        { icon: Database, label: "Database", action: "database" },
                        { icon: Shield, label: "Security", action: "security" },
                        { icon: Calendar, label: "Schedule", action: "schedule" },
                        { icon: DollarSign, label: "Finance", action: "finance" }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Card 
                            className="border-gray-200 hover:border-blue-300 cursor-pointer h-full"
                            onClick={() => handleQuickAction(item.action)}
                          >
                            <CardContent className="p-6 text-center">
                              <div className="p-3 rounded-full bg-blue-100 text-blue-600 w-fit mx-auto mb-4">
                                <item.icon className="h-6 w-6" />
                              </div>
                              <h3 className="font-semibold text-gray-900 text-sm">{item.label}</h3>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users">
                <Card className="border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      Manage all user accounts in the system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input placeholder="Search users..." className="pl-10" />
                        </div>
                        <Button onClick={() => navigate('/admin/users/new')}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add User
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-xl bg-blue-50 text-center">
                          <div className="text-3xl font-bold text-blue-600">{mockAdminData.stats.totalStudents}</div>
                          <p className="text-gray-700">Students</p>
                          <Button size="sm" variant="link" className="mt-2" onClick={() => navigate('/admin/students')}>
                            Manage →
                          </Button>
                        </div>
                        <div className="p-6 rounded-xl bg-green-50 text-center">
                          <div className="text-3xl font-bold text-green-600">{mockAdminData.stats.totalTeachers}</div>
                          <p className="text-gray-700">Teachers</p>
                          <Button size="sm" variant="link" className="mt-2" onClick={() => navigate('/admin/teachers')}>
                            Manage →
                          </Button>
                        </div>
                        <div className="p-6 rounded-xl bg-purple-50 text-center">
                          <div className="text-3xl font-bold text-purple-600">{mockAdminData.stats.totalParents}</div>
                          <p className="text-gray-700">Parents</p>
                          <Button size="sm" variant="link" className="mt-2" onClick={() => navigate('/admin/parents')}>
                            Manage →
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Recent Activities */}
            <Card className="border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activities
                  <Badge className="bg-blue-100 text-blue-700">Live</Badge>
                </CardTitle>
                <CardDescription>
                  System activities and user actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAdminData.recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                          {activity.status === 'success' ? <CheckCircle className="h-4 w-4" /> :
                           activity.status === 'warning' ? <AlertCircle className="h-4 w-4" /> :
                           <AlertCircle className="h-4 w-4" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{activity.action}</h4>
                          <p className="text-sm text-gray-600">By: {activity.user}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => navigate('/admin/activities')}>
                  View All Activities
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Right Column - System Status & Profile */}
          <div className="space-y-8">
            {/* Admin Profile */}
            <Card className="border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-16 w-16 border-2 border-blue-200">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                      {mockAdminData.user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-gray-900">{mockAdminData.user.name}</h3>
                    <p className="text-gray-600">{mockAdminData.user.role}</p>
                    <p className="text-sm text-gray-500">Last login: {mockAdminData.user.lastLogin}</p>
                  </div>
                </div>
                <Separator className="my-6" />
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/admin/profile')}>
                    <Shield className="h-4 w-4 mr-2" />
                    Admin Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/admin/settings')}>
                    <Settings className="h-4 w-4 mr-2" />
                    System Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export Logs
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  System Status
                </CardTitle>
                <CardDescription>
                  Real-time system health monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(mockAdminData.systemStatus).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${getSystemStatusColor(value)}`} />
                        <span className="text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                      <Badge className={
                        value.toLowerCase() === 'healthy' || value.toLowerCase() === 'online' || 
                        value.toLowerCase() === 'protected' || value.toLowerCase() === 'completed'
                          ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }>
                        {value}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Separator className="my-6" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-2">{mockAdminData.systemStatus.uptime}</div>
                  <p className="text-sm text-gray-600">System Uptime</p>
                  <Progress value={99.9} className="h-2 mt-2" />
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                  <Badge className="bg-red-100 text-red-700">3 New</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "System Backup Required", message: "Schedule weekly backup", type: "warning" },
                    { title: "Security Update Available", message: "Update to v2.5.1", type: "info" },
                    { title: "Storage Limit Alert", message: "85% of storage used", type: "error" }
                  ].map((notification, index) => (
                    <div key={index} className="p-3 rounded-lg border border-gray-200">
                      <div className="flex items-start gap-3">
                        <AlertCircle className={`h-5 w-5 mt-0.5 ${
                          notification.type === 'warning' ? 'text-amber-600' :
                          notification.type === 'error' ? 'text-red-600' :
                          'text-blue-600'
                        }`} />
                        <div>
                          <h4 className="font-medium text-gray-900">{notification.title}</h4>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Reports */}
            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Reports</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-white">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Usage Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-white">
                    <PieChart className="h-4 w-4 mr-2" />
                    Performance Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-white">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Financial Summary
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard