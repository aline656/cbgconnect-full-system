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
  TrendingUp
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

// Mock secretary profile data
const mockProfileData = {
  personal: {
    name: "Linda Rodriguez",
    email: "linda.rodriguez@cbgschool.edu",
    phone: "+1 (555) 987-6543",
    address: "456 Administration Blvd, San Francisco, CA 94107",
    birthday: "March 22, 1988",
    position: "Head Secretary",
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
    parentCommunications: 278
  },
  activity: [
    { action: "Processed enrollment forms", count: "15 forms", time: "Today, 10:30 AM" },
    { action: "Updated attendance records", count: "125 students", time: "Today, 9:15 AM" },
    { action: "Generated financial report", type: "Monthly", time: "Yesterday, 3:45 PM" },
    { action: "Coordinated parent meetings", count: "8 meetings", time: "Yesterday, 11:30 AM" },
    { action: "Trained new staff member", name: "Assistant Secretary", time: "2 days ago" }
  ]
}

const SecretaryProfile = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600">Manage your secretary profile and preferences</p>
            </div>
            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <Card className="border-gray-200 shadow-lg">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <Avatar className="h-32 w-32 mx-auto border-4 border-white shadow-lg">
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-3xl">
                        {profile.personal.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="icon"
                        className="absolute bottom-2 right-2 h-10 w-10 rounded-full"
                        onClick={handleProfilePicture}
                      >
                        <Camera className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900">{profile.personal.name}</h2>
                  <p className="text-gray-600 mb-2">{profile.personal.position}</p>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 mb-4">
                    <Shield className="h-3 w-3 mr-2" />
                    {profile.personal.department}
                  </Badge>

                  <Separator className="my-6" />

                  <div className="space-y-4 text-left">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{profile.personal.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{profile.personal.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{profile.personal.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">Employee ID: {profile.personal.employeeId}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">Experience: {calculateExperience()}</span>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900 mb-2">Performance Rating</h4>
                    <div className="flex justify-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <Badge className="mt-2 bg-green-100 text-green-700">
                      <Award className="h-3 w-3 mr-1" />
                      Top Performer
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Stats */}
            <Card className="mt-8 border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tasks Completed</span>
                    <span className="font-bold text-gray-900">{profile.performance.tasksCompleted}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Forms Processed</span>
                    <span className="font-bold text-gray-900">{profile.performance.formsProcessed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Accuracy Rate</span>
                    <Badge className="bg-green-100 text-green-700">{profile.performance.accuracyRate}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Avg. Response Time</span>
                    <span className="font-bold text-gray-900">{profile.performance.responseTime}</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/secretary')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Tabs */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Activity
                </TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value="personal" className="space-y-6 mt-6">
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle>Professional Information</CardTitle>
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
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hireDate">Hire Date</Label>
                        <Input 
                          id="hireDate" 
                          type="date"
                          value={profile.personal.hireDate}
                          disabled={!isEditing}
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
                        onChange={(e) => setProfile({
                          ...profile,
                          personal: { ...profile.personal, bio: e.target.value }
                        })}
                      />
                    </div>

                    {isEditing && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-blue-500" />
                          <p className="text-sm text-blue-700">
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
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Choose how you want to receive administrative alerts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Notification Channels</h4>
                      <div className="space-y-4">
                        {Object.entries(profile.notifications).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <div>
                              <Label htmlFor={key} className="capitalize font-medium">
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
                              onCheckedChange={(checked) => setProfile({
                                ...profile,
                                notifications: {
                                  ...profile.notifications,
                                  [key]: checked
                                }
                              })}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Alert Schedule</h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="alert-time">Daily Alert Time</Label>
                          <Select defaultValue="9am">
                            <SelectTrigger>
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
                            <SelectTrigger>
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
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Your recent administrative actions and interactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {profile.activity.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-4 p-4 rounded-lg border border-gray-200"
                        >
                          <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                            <FileText className="h-4 w-4" />
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
                            <p className="text-xs text-gray-500 mt-2">{item.time}</p>
                          </div>
                          <Badge variant="outline">Completed</Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Interaction Stats */}
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle>Interaction Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center p-4 rounded-xl bg-blue-50">
                        <div className="text-2xl font-bold text-blue-600">{profile.performance.studentInteractions}</div>
                        <p className="text-gray-600">Student Interactions</p>
                        <p className="text-sm text-gray-500">This month</p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-green-50">
                        <div className="text-2xl font-bold text-green-600">{profile.performance.parentCommunications}</div>
                        <p className="text-gray-600">Parent Communications</p>
                        <p className="text-sm text-gray-500">This month</p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-purple-50">
                        <div className="text-2xl font-bold text-purple-600">98%</div>
                        <p className="text-gray-600">Satisfaction Rate</p>
                        <p className="text-sm text-gray-500">Based on feedback</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecretaryProfile