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
        console.error("Failed to load admin data", error)
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
      case 'students':
        navigate('/admin/students')
        break
      case 'analytics':
        navigate('/admin/analytics')
        break
      case 'settings':
        navigate('/admin/settings')
        break
      default:
        break
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!adminData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-96">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Unable to load admin data</p>
            <Button onClick={() => window.location.reload()} className="w-full mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">System Overview & Management</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button size="sm" onClick={() => handleQuickAction('settings')}>
                <Settings className="h-4 w-4 mr-2" />
                System Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminData.quickStats?.map((stat: any, idx: number) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                        <p className={`text-xs mt-2 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change} from yesterday
                        </p>
                      </div>
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white border border-gray-200 rounded-lg p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-blue-50">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-blue-50">
              <Database className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {adminData.stats?.totalStudents || 0}
                  </div>
                  <Progress value={85} className="h-2" />
                  <p className="text-sm text-gray-600 mt-2">85% enrollment rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Total Teachers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {adminData.stats?.totalTeachers || 0}
                  </div>
                  <Progress value={92} className="h-2" />
                  <p className="text-sm text-gray-600 mt-2">92% active status</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Total Parents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {adminData.stats?.totalParents || 0}
                  </div>
                  <Progress value={78} className="h-2" />
                  <p className="text-sm text-gray-600 mt-2">78% verified accounts</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest system activities and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminData.recentActivities?.map((activity: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                      <div className={`p-2 rounded-lg ${
                        activity.status === 'success' ? 'bg-green-50' :
                        activity.status === 'warning' ? 'bg-yellow-50' :
                        'bg-red-50'
                      }`}>
                        {activity.status === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                        {activity.status === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-600" />}
                        {activity.status === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.user}</p>
                      </div>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage system users and roles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" onClick={() => handleQuickAction('users')}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Users</CardTitle>
                  <CardDescription>Currently online</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {adminData.stats?.activeUsers || 0}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(adminData.systemStatus || {}).map(([key, value]: any) => (
                  <div key={key} className="flex items-center justify-between pb-4 border-b last:border-b-0">
                    <span className="capitalize text-gray-700">{key.replace(/_/g, ' ')}</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {value}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminDashboard
