import { useState, useEffect } from "react"
import { motion } from "framer-motion"

import { 
  Bell, 
  Calendar, 
  TrendingUp, 
  BookOpen, 
  Users, 
  Award,
  AlertCircle,
  FileText,
  MessageSquare,
  Clock,
  ArrowRight,
  BarChart3,
  Shield,
  Sparkles
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { api } from "@/lib/api"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mock data - In real app, this would come from API
const mockParentData = {
  name: "Sarah Johnson",
  children: [
    { 
      id: 1, 
      name: "Emily Johnson", 
      grade: "Grade 5", 
      avatar: "EJ",
      teacher: "Mr. Wilson",
      attendance: 95,
      overallGrade: "A-"
    },
    { 
      id: 2, 
      name: "Michael Johnson", 
      grade: "Grade 7", 
      avatar: "MJ",
      teacher: "Ms. Rodriguez",
      attendance: 98,
      overallGrade: "B+"
    }
  ],
  recentGrades: [
    { subject: "Mathematics", grade: "A", date: "Today", teacher: "Mr. Wilson" },
    { subject: "Science", grade: "B+", date: "Yesterday", teacher: "Ms. Chen" },
    { subject: "English", grade: "A-", date: "2 days ago", teacher: "Mr. Davis" },
    { subject: "History", grade: "B", date: "3 days ago", teacher: "Mrs. Taylor" }
  ],
  upcomingEvents: [
    { title: "Parent-Teacher Conference", date: "Tomorrow", time: "3:00 PM", location: "Room 204" },
    { title: "Science Fair", date: "Oct 25", time: "9:00 AM", location: "School Gym" },
    { title: "Report Card Distribution", date: "Oct 30", time: "All day", location: "Online" }
  ],
  notifications: [
    { id: 1, title: "Absence Notice", message: "Emily was absent yesterday", type: "warning", read: false },
    { id: 2, title: "Assignment Due", message: "Math assignment due tomorrow", type: "info", read: true },
    { id: 3, title: "Fee Payment", message: "Quarterly fee due next week", type: "payment", read: false }
  ],
  stats: {
    totalAssignments: 24,
    completedAssignments: 18,
    attendanceRate: 96.5,
    teacherMessages: 5
  }
}

const ParentDashboard = () => {
  const navigate = useNavigate()
  const [parentData, setParentData] = useState(mockParentData)
  const [activeChildId, setActiveChildId] = useState(mockParentData.children[0]?.id ?? 0)

  useEffect(() => {
    const load = async () => {
      try {
        const r = await api.get("/parents/me/dashboard")
        if (r.data) {
          setParentData(r.data)
          const firstId = r.data?.children?.[0]?.id
          if (typeof firstId === "number") {
            setActiveChildId((current) => (current ? current : firstId))
          }
        }
      } catch (_e) {
        // keep fallback mock data
      }
    }

    load()
  }, [])

  const activeChild =
    parentData.children.find((c) => c.id === activeChildId) ?? parentData.children[0]

  const handleViewReport = (childId: number) => {
    navigate(`/parent/report?child=${childId}`)
    toast.info("Loading detailed report...")
  }

  const handleViewProfile = () => {
    navigate("/parent/profile")
  }

  const handleViewSettings = () => {
    navigate("/parent/settings")
  }

  const handleSendMessage = (teacherName: string) => {
    toast.success(`Starting chat with ${teacherName}`)
    // In real app, navigate to chat
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="h-5 w-5" />
                <Badge className="bg-white/20 hover:bg-white/30">Parent Portal</Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">Welcome back, {parentData.name}</h1>
              <p className="text-blue-100 mt-2">Monitor your children's progress and stay connected</p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="secondary" 
                onClick={handleViewProfile}
                className="bg-white/10 hover:bg-white/20 border-white/20"
              >
                View Profile
              </Button>
              <Button 
                onClick={handleViewSettings}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Children & Quick Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Children Cards */}
            <Card className="border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Your Children
                </CardTitle>
                <CardDescription>
                  Select a child to view detailed information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {parentData.children.map((child) => (
                    <motion.div
                      key={child.id}
                      whileHover={{ scale: 1.02 }}
                      className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                        activeChild?.id === child.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setActiveChildId(child.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {child.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">{child.name}</h3>
                          <p className="text-sm text-gray-600">{child.grade}</p>
                        </div>
                        <Badge className="ml-auto bg-green-100 text-green-700 hover:bg-green-200">
                          {child.overallGrade}
                        </Badge>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500">Attendance</p>
                          <div className="flex items-center gap-2">
                            <Progress value={child.attendance} className="h-2" />
                            <span className="text-sm font-medium">{child.attendance}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Teacher</p>
                          <p className="text-sm font-medium">{child.teacher}</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full mt-4"
                        onClick={() => handleViewReport(child.id)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Full Report
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Grades & Performance */}
            <Card className="border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Grades - {activeChild.name}
                </CardTitle>
                <CardDescription>
                  Latest academic performance updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parentData.recentGrades.map((grade, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          grade.grade.startsWith('A') ? 'bg-green-100 text-green-600' :
                          grade.grade.startsWith('B') ? 'bg-blue-100 text-blue-600' :
                          'bg-amber-100 text-amber-600'
                        }`}>
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{grade.subject}</h4>
                          <p className="text-sm text-gray-600">Teacher: {grade.teacher}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={
                          grade.grade.startsWith('A') ? 'bg-green-100 text-green-700' :
                          grade.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }>
                          {grade.grade}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{grade.date}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/parent/report')}
                >
                  View All Grades
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            {/* Teacher Communication */}
            <Card className="border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Teacher Communication
                </CardTitle>
                <CardDescription>
                  Quick access to your child's teachers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parentData.children.map((child) => (
                    <div key={child.id} className="p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{child.name}</h4>
                          <p className="text-sm text-gray-600">{child.grade}</p>
                        </div>
                        <Badge variant="outline">Class Teacher</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-purple-100 text-purple-600">
                              {child.teacher.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{child.teacher}</p>
                            <p className="text-sm text-gray-600">Last messaged: 2 days ago</p>
                          </div>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => handleSendMessage(child.teacher)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Notifications */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <Card className="border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-xl bg-blue-50">
                    <div className="text-2xl font-bold text-blue-600">{parentData.stats.totalAssignments}</div>
                    <p className="text-sm text-gray-600">Total Assignments</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-green-50">
                    <div className="text-2xl font-bold text-green-600">{parentData.stats.completedAssignments}</div>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-amber-50">
                    <div className="text-2xl font-bold text-amber-600">{parentData.stats.attendanceRate}%</div>
                    <p className="text-sm text-gray-600">Attendance Rate</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-purple-50">
                    <div className="text-2xl font-bold text-purple-600">{parentData.stats.teacherMessages}</div>
                    <p className="text-sm text-gray-600">New Messages</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                  <Badge className="ml-2 bg-red-100 text-red-700">
                    {parentData.notifications.filter(n => !n.read).length} New
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parentData.notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-3 rounded-lg border ${
                        notification.read 
                          ? 'bg-gray-50 border-gray-200' 
                          : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className={`h-5 w-5 mt-0.5 ${
                          notification.type === 'warning' ? 'text-amber-600' :
                          notification.type === 'payment' ? 'text-red-600' :
                          'text-blue-600'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{notification.title}</h4>
                            {!notification.read && (
                              <Badge className="bg-blue-100 text-blue-700">New</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message ?? notification.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parentData.upcomingEvents.map((event, index) => (
                    <div key={index} className="p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <Badge variant="outline">{event.date}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-white"
                    onClick={() => navigate('/parent/report')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-white"
                    onClick={() => toast.info("Feature coming soon!")}
                  >
                    <Award className="h-4 w-4 mr-2" />
                    View Achievements
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-white"
                    onClick={handleViewSettings}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy Settings
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

export default ParentDashboard