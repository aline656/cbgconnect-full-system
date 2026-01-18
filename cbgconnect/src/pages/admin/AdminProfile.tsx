import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Settings,
  Camera,
  Edit2,
  Save,
  X,
  CheckCircle,
  Clock,
  Activity,
  Key,
  Bell,
  Lock,
  Eye,
  EyeOff
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

// Mock admin profile data
const mockAdminProfile = {
  personal: {
    name: "System Administrator",
    email: "admin@cbgschool.edu",
    phone: "+1 (555) 123-4567",
    role: "Super Admin",
    department: "System Administration",
    employeeId: "ADMIN-001",
    joinDate: "2020-01-15",
    bio: "System administrator with full privileges. Responsible for overall system management, security, and configuration."
  },
  security: {
    twoFactorEnabled: true,
    lastPasswordChange: "2024-09-15",
    lastLogin: "2024-10-20 09:15:00",
    loginLocation: "San Francisco, CA",
    activeSessions: 2
  },
  activity: [
    { action: "System configuration updated", time: "Today, 10:30 AM" },
    { action: "User permissions modified", user: "Teacher ID: 45", time: "Today, 9:15 AM" },
    { action: "Security audit completed", time: "Yesterday, 3:45 PM" },
    { action: "Database backup initiated", time: "Yesterday, 2:00 AM" },
    { action: "New admin account created", user: "Assistant Admin", time: "2 days ago" }
  ]
}

const AdminProfile = () => {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(mockAdminProfile)
  const [activeTab, setActiveTab] = useState("personal")
  const [showPassword, setShowPassword] = useState(false)

  const handleSave = () => {
    setIsEditing(false)
    toast.success("Profile updated successfully!", {
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setProfile(mockAdminProfile)
  }

  const handleChangePassword = () => {
    toast.info("Password change initiated")
  }

  const handleToggle2FA = () => {
    toast.success("Two-factor authentication updated!")
  }

  const calculateExperience = () => {
    const joinDate = new Date(profile.personal.joinDate)
    const now = new Date()
    const years = now.getFullYear() - joinDate.getFullYear()
    const months = now.getMonth() - joinDate.getMonth()
    return `${years} years, ${months} months`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
              <p className="text-gray-600">Manage administrator profile and security settings</p>
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
                      <AvatarFallback className="bg-gradient-to-r from-red-600 to-orange-600 text-white text-3xl">
                        SA
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="icon"
                        className="absolute bottom-2 right-2 h-10 w-10 rounded-full"
                        onClick={() => toast.info("Profile picture upload")}
                      >
                        <Camera className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900">{profile.personal.name}</h2>
                  <p className="text-gray-600 mb-2">{profile.personal.role}</p>
                  <Badge className="bg-red-100 text-red-700 hover:bg-red-200 mb-4">
                    <Shield className="h-3 w-3 mr-2" />
                    Super Administrator
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
                      <Shield className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">Employee ID: {profile.personal.employeeId}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">Experience: {calculateExperience()}</span>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900 mb-2">System Access</h4>
                    <p className="text-sm text-gray-600">Full administrative privileges</p>
                    <Badge className="mt-2 bg-green-100 text-green-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified & Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Status */}
            <Card className="mt-8 border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">2FA Enabled</span>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Last Login</span>
                    <span className="font-medium">{profile.security.lastLogin.split(' ')[0]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Active Sessions</span>
                    <Badge className="bg-blue-100 text-blue-700">{profile.security.activeSessions}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Password Age</span>
                    <span className="font-medium">35 days</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/admin/settings')}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Security Settings
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
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Activity
                </TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value="personal" className="space-y-6 mt-6">
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your administrator profile information
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
                        <Label htmlFor="role">Role</Label>
                        <Input 
                          id="role" 
                          value={profile.personal.role}
                          disabled={true}
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
                        <Label htmlFor="joinDate">Join Date</Label>
                        <Input 
                          id="joinDate" 
                          type="date"
                          value={profile.personal.joinDate}
                          disabled={!isEditing}
                          onChange={(e) => setProfile({
                            ...profile,
                            personal: { ...profile.personal, joinDate: e.target.value }
                          })}
                        />
                      </div>
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
                      <Label htmlFor="bio">Bio</Label>
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
                            Changes to administrator profiles require additional verification
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6 mt-6">
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your account security and authentication
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Authentication</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Two-Factor Authentication</Label>
                            <p className="text-sm text-gray-500">Add an extra layer of security</p>
                          </div>
                          <Switch 
                            checked={profile.security.twoFactorEnabled}
                            onCheckedChange={handleToggle2FA}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter current password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            placeholder="Enter new password"
                          />
                        </div>
                        <Button onClick={handleChangePassword}>
                          <Key className="h-4 w-4 mr-2" />
                          Change Password
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Session Management</h4>
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Current Session</p>
                              <p className="text-sm text-gray-500">San Francisco, CA • {profile.security.lastLogin}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-700">Active</Badge>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Mobile Session</p>
                              <p className="text-sm text-gray-500">iPhone 14 • Yesterday, 8:30 PM</p>
                            </div>
                            <Badge className="bg-green-100 text-green-700">Active</Badge>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full">
                          <Lock className="h-4 w-4 mr-2" />
                          Log Out All Other Sessions
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Login History</h4>
                      <div className="space-y-2">
                        {[
                          { date: "Today, 09:15 AM", location: "San Francisco, CA", device: "Chrome on Windows" },
                          { date: "Yesterday, 8:30 PM", location: "San Francisco, CA", device: "Safari on iPhone" },
                          { date: "Oct 19, 2:45 PM", location: "New York, NY", device: "Chrome on Mac" }
                        ].map((login, index) => (
                          <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                            <div>
                              <p className="text-sm font-medium">{login.date}</p>
                              <p className="text-xs text-gray-500">{login.location} • {login.device}</p>
                            </div>
                            <Badge variant="outline">Successful</Badge>
                          </div>
                        ))}
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
                      Your recent administrative actions
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
                            <Activity className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.action}</h4>
                            {item.user && (
                              <p className="text-sm text-gray-600">User: {item.user}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">{item.time}</p>
                          </div>
                          <Badge variant="outline">Completed</Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Activity Stats */}
                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center p-4 rounded-xl bg-blue-50">
                        <div className="text-2xl font-bold text-blue-600">42</div>
                        <p className="text-gray-600">Actions Today</p>
                        <p className="text-sm text-gray-500">Most active: 10:00 AM</p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-green-50">
                        <div className="text-2xl font-bold text-green-600">98%</div>
                        <p className="text-gray-600">Success Rate</p>
                        <p className="text-sm text-gray-500">Completed actions</p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-purple-50">
                        <div className="text-2xl font-bold text-purple-600">24/7</div>
                        <p className="text-gray-600">System Access</p>
                        <p className="text-sm text-gray-500">Full administrative control</p>
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

export default AdminProfile