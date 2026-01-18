import { useState, useEffect } from "react"
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
  Users,
  Heart,
  Award,
  Edit2,
  Save,
  X,
  CheckCircle,
  Calendar,
  Globe,
  Smartphone,
  AlertCircle
} from "lucide-react"

import { toast } from "sonner"
import { motion } from "framer-motion"

import { api } from "@/lib/api"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


const mockProfileData = {
  personal: {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Maple Street, San Francisco, CA 94107",
    birthday: "April 15, 1985",
    occupation: "Marketing Director",
    bio: "Dedicated parent of two wonderful children. Passionate about education and active school involvement.",
    avatar: "SJ"
  },
  children: [
    { id: 1, name: "Emily Johnson", grade: "Grade 5", relationship: "Daughter" },
    { id: 2, name: "Michael Johnson", grade: "Grade 7", relationship: "Son" }
  ],
  preferences: {
    notifications: {
      email: true,
      sms: true,
      push: false,
      grades: true,
      attendance: true,
      events: true
    },
    language: "English",
    timezone: "PST (Pacific Standard Time)",
    theme: "Light"
  },
  activity: [
    { action: "Viewed Emily's report card", time: "2 hours ago" },
    { action: "Messaged Mr. Wilson", time: "1 day ago" },
    { action: "Paid school fees", time: "3 days ago" },
    { action: "Updated contact info", time: "1 week ago" }
  ]
}

const Profile = () => {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(mockProfileData)
  const [activeTab, setActiveTab] = useState("personal")

  const loadProfile = async () => {
    try {
      const r = await api.get("/parents/me/profile")
      if (r.data) {
        setProfile(r.data)
      }
    } catch (_e) {
      // keep fallback mock data
    }
  }

  const handleSave = async () => {
    try {
      await api.put("/parents/me/profile", profile)
      setIsEditing(false)
      toast.success("Profile updated successfully!", {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      })
    } catch (_e) {
      toast.error("Failed to update profile")
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    loadProfile()
  }

  const handleProfilePicture = () => {
    toast.info("Profile picture upload feature coming soon!")
  }

  useEffect(() => {
    if (profile === mockProfileData) {
      loadProfile()
    }
  }, [profile])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600">Manage your personal information and preferences</p>
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
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-3xl">
                        {profile.personal.avatar}
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
                  <p className="text-gray-600 mb-4">Parent Account</p>
                  
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 mb-6">
                    <Shield className="h-3 w-3 mr-2" />
                    Verified Parent
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
                  </div>

                  <Separator className="my-6" />

                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900 mb-2">Member Since</h4>
                    <p className="text-gray-600">January 2023</p>
                    <Badge className="mt-2 bg-green-100 text-green-700">
                      <Award className="h-3 w-3 mr-1" />
                      Active Member
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Children Card */}
            <Card className="mt-8 border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  My Children
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.children.map((child) => (
                    <motion.div
                      key={child.id}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer"
                      onClick={() => navigate(`/parent/report?child=${child.id}`)}
                    >
                      <Avatar>
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {child.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{child.name}</h4>
                        <p className="text-sm text-gray-600">{child.grade} • {child.relationship}</p>
                      </div>
                      <Heart className="h-4 w-4 text-pink-500" />
                    </motion.div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigate('/parent')}
                >
                  View All Activities
                </Button>
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
                <TabsTrigger value="preferences" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Preferences
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Security
                </TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value="personal" className="space-y-6 mt-6">
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details and contact information
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
                        <Label htmlFor="birthday">Birthday</Label>
                        <Input 
                          id="birthday" 
                          value={profile.personal.birthday}
                          disabled={!isEditing}
                          onChange={(e) => setProfile({
                            ...profile,
                            personal: { ...profile.personal, birthday: e.target.value }
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
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input 
                        id="occupation" 
                        value={profile.personal.occupation}
                        disabled={!isEditing}
                        onChange={(e) => setProfile({
                          ...profile,
                          personal: { ...profile.personal, occupation: e.target.value }
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        rows={3}
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
                            Changes will be verified by school administration before updating
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profile.activity.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gray-100">
                              <Calendar className="h-4 w-4 text-gray-600" />
                            </div>
                            <span className="text-gray-700">{item.action}</span>
                          </div>
                          <span className="text-sm text-gray-500">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-6 mt-6">
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Choose how you want to receive updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Notification Channels</h4>
                      {Object.entries(profile.preferences.notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <Label htmlFor={key} className="capitalize">
                            {key === 'sms' ? 'SMS Text Messages' : 
                             key === 'push' ? 'Push Notifications' :
                             key.charAt(0).toUpperCase() + key.slice(1)}
                          </Label>
                          <Switch 
                            id={key}
                            checked={value}
                            disabled={!isEditing}
                            onCheckedChange={(checked) => setProfile({
                              ...profile,
                              preferences: {
                                ...profile.preferences,
                                notifications: {
                                  ...profile.preferences.notifications,
                                  [key]: checked
                                }
                              }
                            })}
                          />
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Content Preferences</h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="language">Language</Label>
                          <Input 
                            id="language" 
                            value={profile.preferences.language}
                            disabled={!isEditing}
                            onChange={(e) => setProfile({
                              ...profile,
                              preferences: { ...profile.preferences, language: e.target.value }
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timezone">Timezone</Label>
                          <Input 
                            id="timezone" 
                            value={profile.preferences.timezone}
                            disabled={!isEditing}
                            onChange={(e) => setProfile({
                              ...profile,
                              preferences: { ...profile.preferences, timezone: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Display Preferences</h4>
                      <div className="space-y-2">
                        <Label htmlFor="theme">Theme</Label>
                        <div className="flex gap-4">
                          {['Light', 'Dark', 'System'].map((theme) => (
                            <Button
                              key={theme}
                              type="button"
                              variant={profile.preferences.theme === theme ? "default" : "outline"}
                              disabled={!isEditing}
                              onClick={() => setProfile({
                                ...profile,
                                preferences: { ...profile.preferences, theme }
                              })}
                            >
                              {theme}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6 mt-6">
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your account security and privacy
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Password & Authentication</h4>
                      <div className="space-y-3">
                        <div className="p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Password</p>
                              <p className="text-sm text-gray-600">Last changed 30 days ago</p>
                            </div>
                            <Button variant="outline" onClick={() => toast.info("Password reset email sent!")}>
                              Change Password
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Two-Factor Authentication</p>
                              <p className="text-sm text-gray-600">Add an extra layer of security</p>
                            </div>
                            <Button variant="outline" onClick={() => toast.info("2FA setup initiated")}>
                              Enable 2FA
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Connected Devices</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg border border-green-200 bg-green-50">
                          <div className="flex items-center gap-3">
                            <Smartphone className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium">iPhone 14 Pro</p>
                              <p className="text-sm text-gray-600">Current device • San Francisco, CA</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-700">Active</Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-3">
                            <Globe className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium">Windows Laptop</p>
                              <p className="text-sm text-gray-600">Last active 2 days ago</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">Revoke</Button>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Privacy Settings</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Profile Visibility</p>
                            <p className="text-sm text-gray-600">Control who can see your profile</p>
                          </div>
                          <Select defaultValue="teachers-only" disabled={!isEditing}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">All Users</SelectItem>
                              <SelectItem value="teachers-only">Teachers Only</SelectItem>
                              <SelectItem value="private">Private</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Data Sharing</p>
                            <p className="text-sm text-gray-600">Allow data for educational research</p>
                          </div>
                          <Switch disabled={!isEditing} />
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-red-700">Danger Zone</h4>
                          <p className="text-sm text-red-600 mb-3">
                            Once you delete your account, there is no going back. Please be certain.
                          </p>
                          <Button 
                            variant="destructive" 
                            onClick={() => toast.error("Account deletion requires additional verification")}
                          >
                            Delete Account
                          </Button>
                        </div>
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

export default Profile