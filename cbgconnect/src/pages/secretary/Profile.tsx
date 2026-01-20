// src/pages/secretary/Profile.tsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Shield,
  Bell,
  Lock,
  Calendar,
  Briefcase,
  Award,
  Edit2,
  Save,
  X,
  CheckCircle,
  Clock,
  Star,
  Users,
  FileText,
  TrendingUp,
  Settings,
  ShieldCheck,
  CreditCard,
  Activity,
  BarChart3,
  Target,
  Download,
  Upload
} from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from "@/components/ui/progress"

// Mock secretary profile data
const mockProfileData = {
  personal: {
    name: "Emily Davis",
    email: "emily.davis@cbgschool.edu",
    phone: "+1 (555) 987-6543",
    address: "456 Administration Blvd, San Francisco, CA 94107",
    birthday: "March 22, 1988",
    position: "Senior Secretary",
    department: "School Administration",
    employeeId: "EMP-SEC-024",
    hireDate: "2018-06-15",
    bio: "Dedicated school secretary with 6+ years of experience in educational administration. Passionate about creating efficient systems and supporting students, parents, and faculty."
  },
  notifications: {
    email: true,
    sms: false,
    push: true,
    studentAlerts: true,
    paymentReminders: true,
    attendanceAlerts: true,
    systemUpdates: true,
    reportAlerts: true
  },
  performance: {
    tasksCompleted: 1247,
    formsProcessed: 892,
    accuracyRate: "99.2%",
    responseTime: "2.1 hours",
    studentInteractions: 345,
    parentCommunications: 278,
    satisfactionScore: 98,
    efficiency: 92
  },
  activity: [
    { action: "Processed enrollment forms", count: "15 forms", time: "Today, 10:30 AM", icon: FileText },
    { action: "Updated attendance records", count: "125 students", time: "Today, 9:15 AM", icon: Users },
    { action: "Generated financial report", type: "Monthly", time: "Yesterday, 3:45 PM", icon: BarChart3 },
    { action: "Coordinated parent meetings", count: "8 meetings", time: "Yesterday, 11:30 AM", icon: Calendar },
    { action: "Trained new staff member", name: "Assistant Secretary", time: "2 days ago", icon: ShieldCheck }
  ]
}

const Profile = () => {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(mockProfileData)
  const [activeTab, setActiveTab] = useState("personal")

  const handleSave = () => {
    setIsEditing(false)
    toast.success("Profile updated successfully!", {
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setProfile(mockProfileData)
  }

  const handleProfilePicture = () => {
    toast.info("Profile picture upload feature coming soon!")
  }

  const calculateExperience = () => {
    const hireDate = new Date(profile.personal.hireDate)
    const now = new Date()
    const years = now.getFullYear() - hireDate.getFullYear()
    const months = now.getMonth() - hireDate.getMonth()
    return `${years} years, ${months} months`
  }

  const getPerformanceColor = (value: number) => {
    if (value >= 90) return "text-green-600 bg-green-50 border-green-200"
    if (value >= 80) return "text-amber-600 bg-amber-50 border-amber-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-gray-600 mt-2">Manage your secretary profile and preferences</p>
          </div>
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="border-amber-200 hover:bg-amber-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border border-amber-100 bg-gradient-to-b from-white to-amber-50/50 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur-lg opacity-30"></div>
                    <Avatar className="h-32 w-32 mx-auto border-4 border-white shadow-lg relative z-10">
                      <AvatarFallback className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-3xl">
                        {profile.personal.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="icon"
                        className="absolute bottom-2 right-2 h-10 w-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 z-20"
                        onClick={handleProfilePicture}
                      >
                        <Camera className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900">{profile.personal.name}</h2>
                  <p className="text-amber-600 font-medium mb-2">{profile.personal.position}</p>
                  <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-amber-200 hover:from-amber-200 hover:to-orange-200">
                    <Shield className="h-3 w-3 mr-2" />
                    {profile.personal.department}
                  </Badge>

                  <Separator className="my-6" />

                  <div className="space-y-4 text-left">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-amber-50/50 transition-colors">
                      <Mail className="h-4 w-4 text-amber-500" />
                      <span className="text-gray-700">{profile.personal.email}</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-amber-50/50 transition-colors">
                      <Phone className="h-4 w-4 text-amber-500" />
                      <span className="text-gray-700">{profile.personal.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-amber-50/50 transition-colors">
                      <MapPin className="h-4 w-4 text-amber-500" />
                      <span className="text-gray-700">{profile.personal.address}</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-amber-50/50 transition-colors">
                      <Briefcase className="h-4 w-4 text-amber-500" />
                      <span className="text-gray-700">ID: {profile.personal.employeeId}</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-amber-50/50 transition-colors">
                      <Calendar className="h-4 w-4 text-amber-500" />
                      <span className="text-gray-700">{calculateExperience()} experience</span>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900 mb-2">Performance Rating</h4>
                    <div className="flex justify-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-5 w-5 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <Badge className="mt-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200">
                      <Award className="h-3 w-3 mr-1" />
                      Top Performer
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Performance Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="border border-amber-100 bg-gradient-to-b from-white to-amber-50/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Activity className="h-5 w-5 text-amber-500" />
                  Performance Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                    <div className="text-2xl font-bold text-gray-900">{profile.performance.tasksCompleted}</div>
                    <p className="text-sm text-gray-600">Tasks</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                    <div className="text-2xl font-bold text-gray-900">{profile.performance.formsProcessed}</div>
                    <p className="text-sm text-gray-600">Forms</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Accuracy Rate</span>
                      <span className="font-bold text-green-600">{profile.performance.accuracyRate}</span>
                    </div>
                    <Progress value={99.2} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Efficiency</span>
                      <span className="font-bold text-amber-600">{profile.performance.efficiency}%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </div>

                <Separator className="my-4" />
                
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    className="w-full border-amber-200 hover:bg-amber-50"
                    onClick={() => navigate('/secretary/reports')}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Tabs */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="bg-gradient-to-r from-white to-amber-50/50 rounded-xl p-1 border border-amber-100">
                <TabsList className="grid w-full grid-cols-3 bg-transparent">
                  <TabsTrigger 
                    value="personal" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Personal
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notifications" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger 
                    value="activity" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    Activity
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Personal Information Tab */}
              <TabsContent value="personal" className="space-y-6 mt-6">
                <Card className="border border-amber-100 bg-gradient-to-b from-white to-amber-50/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Professional Information</CardTitle>
                    <CardDescription>
                      Update your professional details and contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={profile.personal.name}
                          disabled={!isEditing}
                          className="border-amber-200 focus:border-amber-500"
                          onChange={(e) => setProfile({
                            ...profile,
                            personal: { ...profile.personal, name: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={profile.personal.email}
                          disabled={!isEditing}
                          className="border-amber-200 focus:border-amber-500"
                          onChange={(e) => setProfile({
                            ...profile,
                            personal: { ...profile.personal, email: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          value={profile.personal.phone}
                          disabled={!isEditing}
                          className="border-amber-200 focus:border-amber-500"
                          onChange={(e) => setProfile({
                            ...profile,
                            personal: { ...profile.personal, phone: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="position">Position</Label>
                        <Input 
                          id="position" 
                          value={profile.personal.position}
                          disabled={!isEditing}
                          className="border-amber-200 focus:border-amber-500"
                          onChange={(e) => setProfile({
                            ...profile,
                            personal: { ...profile.personal, position: e.target.value }
                          })}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="employeeId">Employee ID</Label>
                        <Input 
                          id="employeeId" 
                          value={profile.personal.employeeId}
                          disabled={true}
                          className="border-amber-200 bg-amber-50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hireDate">Hire Date</Label>
                        <Input 
                          id="hireDate" 
                          type="date"
                          value={profile.personal.hireDate}
                          disabled={!isEditing}
                          className="border-amber-200 focus:border-amber-500"
                          onChange={(e) => setProfile({
                            ...profile,
                            personal: { ...profile.personal, hireDate: e.target.value }
                          })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input 
                        id="address" 
                        value={profile.personal.address}
                        disabled={!isEditing}
                        className="border-amber-200 focus:border-amber-500"
                        onChange={(e) => setProfile({
                          ...profile,
                          personal: { ...profile.personal, address: e.target.value }
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input 
                        id="department" 
                        value={profile.personal.department}
                        disabled={!isEditing}
                        className="border-amber-200 focus:border-amber-500"
                        onChange={(e) => setProfile({
                          ...profile,
                          personal: { ...profile.personal, department: e.target.value }
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Professional Bio</Label>
                      <Textarea 
                        id="bio" 
                        rows={4}
                        value={profile.personal.bio}
                        disabled={!isEditing}
                        className="border-amber-200 focus:border-amber-500 resize-none"
                        onChange={(e) => setProfile({
                          ...profile,
                          personal: { ...profile.personal, bio: e.target.value }
                        })}
                      />
                    </div>

                    {isEditing && (
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-amber-500" />
                          <p className="text-sm text-amber-700">
                            Changes will be reviewed by school administration
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6 mt-6">
                <Card className="border border-amber-100 bg-gradient-to-b from-white to-amber-50/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Notification Preferences</CardTitle>
                    <CardDescription>
                      Choose how you want to receive administrative alerts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Bell className="h-5 w-5 text-amber-500" />
                        Notification Channels
                      </h4>
                      <div className="space-y-4">
                        {Object.entries(profile.notifications).map(([key, value]) => (
                          <motion.div
                            key={key}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-amber-50/50 transition-colors"
                          >
                            <div>
                              <Label htmlFor={key} className="capitalize font-medium text-gray-900">
                                {key === 'sms' ? 'SMS Text Messages' : 
                                 key === 'push' ? 'Push Notifications' :
                                 key === 'studentAlerts' ? 'Student Alert Notifications' :
                                 key === 'paymentReminders' ? 'Payment Reminder Alerts' :
                                 key === 'attendanceAlerts' ? 'Attendance Alert Notifications' :
                                 key === 'systemUpdates' ? 'System Update Notifications' :
                                 key === 'reportAlerts' ? 'Report Generation Alerts' :
                                 'Email Notifications'}
                              </Label>
                              <p className="text-sm text-gray-500">
                                {key === 'email' ? 'Receive notifications via email' :
                                 key === 'sms' ? 'Get SMS alerts on your phone' :
                                 key === 'push' ? 'App push notifications' :
                                 key === 'studentAlerts' ? 'Alerts about student activities' :
                                 key === 'paymentReminders' ? 'Reminders for pending payments' :
                                 key === 'attendanceAlerts' ? 'Alerts for attendance anomalies' :
                                 key === 'systemUpdates' ? 'Updates about system maintenance' :
                                 'Alerts for report generation and completion'}
                              </p>
                            </div>
                            <Switch 
                              id={key}
                              checked={value}
                              disabled={!isEditing}
                              className="data-[state=checked]:bg-amber-500"
                              onCheckedChange={(checked) => setProfile({
                                ...profile,
                                notifications: {
                                  ...profile.notifications,
                                  [key]: checked
                                }
                              })}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-amber-500" />
                        Alert Schedule
                      </h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="alert-time">Daily Alert Time</Label>
                          <Select defaultValue="9am">
                            <SelectTrigger className="border-amber-200">
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="8am">8:00 AM</SelectItem>
                              <SelectItem value="9am">9:00 AM</SelectItem>
                              <SelectItem value="10am">10:00 AM</SelectItem>
                              <SelectItem value="3pm">3:00 PM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="summary-frequency">Summary Frequency</Label>
                          <Select defaultValue="daily">
                            <SelectTrigger className="border-amber-200">
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="immediate">Immediate</SelectItem>
                              <SelectItem value="daily">Daily Digest</SelectItem>
                              <SelectItem value="weekly">Weekly Summary</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-6 mt-6">
                <Card className="border border-amber-100 bg-gradient-to-b from-white to-amber-50/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Recent Activity</CardTitle>
                    <CardDescription>
                      Your recent administrative actions and interactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profile.activity.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-4 p-4 rounded-xl border border-amber-100 bg-white hover:shadow-md transition-shadow"
                        >
                          <div className="p-2 rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 text-amber-600">
                            <item.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.action}</h4>
                            {item.count && (
                              <p className="text-sm text-gray-600">Count: {item.count}</p>
                            )}
                            {item.type && (
                              <p className="text-sm text-gray-600">Type: {item.type}</p>
                            )}
                            {item.name && (
                              <p className="text-sm text-gray-600">With: {item.name}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-2 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {item.time}
                            </p>
                          </div>
                          <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200">
                            Completed
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Interaction Stats */}
                <Card className="border border-amber-100 bg-gradient-to-b from-white to-amber-50/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Interaction Statistics</CardTitle>
                    <CardDescription>
                      Monthly performance metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                        <div className="text-2xl font-bold text-gray-900">{profile.performance.studentInteractions}</div>
                        <p className="text-sm text-gray-600">Student Interactions</p>
                        <Badge className="mt-2 bg-green-100 text-green-700">+12%</Badge>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                        <div className="text-2xl font-bold text-gray-900">{profile.performance.parentCommunications}</div>
                        <p className="text-sm text-gray-600">Parent Communications</p>
                        <Badge className="mt-2 bg-green-100 text-green-700">+8%</Badge>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                        <div className="text-2xl font-bold text-gray-900">{profile.performance.satisfactionScore}%</div>
                        <p className="text-sm text-gray-600">Satisfaction Rate</p>
                        <div className="flex justify-center mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 text-amber-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                        <div className="text-2xl font-bold text-gray-900">{profile.performance.efficiency}%</div>
                        <p className="text-sm text-gray-600">Efficiency</p>
                        <Badge className="mt-2 bg-green-100 text-green-700">+5%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Profile