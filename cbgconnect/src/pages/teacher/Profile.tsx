// src/pages/teacher/Profile.tsx
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  BookOpen,
  Bell,
  Key,
  Save,
  Award,
  GraduationCap,
  Users,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

export default function TeacherProfile() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account and teaching preferences</p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Profile Info */}
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher" />
                  <AvatarFallback>TA</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-xl font-bold">Mr. James Anderson</h3>
                  <p className="text-muted-foreground">Senior Mathematics Teacher</p>
                  <Badge className="mt-2">Department Head</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Teaching Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Years Teaching</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Students</span>
                <span className="font-medium">45</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Classes Teaching</span>
                <span className="font-medium">4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Student Rating</span>
                <span className="font-medium">4.8/5.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Login</span>
                <span className="font-medium">Today, 08:15 AM</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Certifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Mathematics Education (M.Ed.)</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-green-600" />
                <span className="text-sm">Advanced Teaching Methods</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-purple-600" />
                <span className="text-sm">STEM Integration</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Settings */}
        <div className="md:col-span-2">
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList>
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="teaching">Teaching Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card className="bg-white/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="James" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Anderson" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="flex">
                        <div className="flex items-center rounded-l-md border border-r-0 px-3 bg-muted">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input id="email" type="email" defaultValue="james.a@school.edu" className="rounded-l-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="flex">
                        <div className="flex items-center rounded-l-md border border-r-0 px-3 bg-muted">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input id="phone" defaultValue="+1 (555) 345-6789" className="rounded-l-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input id="position" defaultValue="Senior Mathematics Teacher" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" defaultValue="Mathematics Department" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="joinDate">Join Date</Label>
                      <div className="flex">
                        <div className="flex items-center rounded-l-md border border-r-0 px-3 bg-muted">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input id="joinDate" type="date" defaultValue="2016-08-22" className="rounded-l-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="office">Office Location</Label>
                      <Input id="office" defaultValue="Room 305, Building B" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      defaultValue="Senior Mathematics teacher with 8 years of experience specializing in calculus and advanced mathematics. Passionate about making complex concepts accessible to all students."
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teaching">
              <Card className="bg-white/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Teaching Profile</CardTitle>
                  <CardDescription>Manage your teaching preferences and availability</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Subjects & Specializations</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="px-3 py-1">Mathematics</Badge>
                      <Badge className="px-3 py-1">Calculus</Badge>
                      <Badge className="px-3 py-1">Algebra</Badge>
                      <Badge className="px-3 py-1">Geometry</Badge>
                      <Badge className="px-3 py-1">Statistics</Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Current Classes</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                          <span>Mathematics 10-A</span>
                        </div>
                        <Badge variant="outline">24 Students</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-green-600" />
                          <span>Physics 11-B</span>
                        </div>
                        <Badge variant="outline">22 Students</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-purple-600" />
                          <span>Advanced Mathematics 12-A</span>
                        </div>
                        <Badge variant="outline">20 Students</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Office Hours</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Days</Label>
                        <div className="flex flex-wrap gap-2">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                            <Badge key={day} variant="outline" className="cursor-pointer hover:bg-gray-100">
                              {day}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Time</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="Start time" type="time" defaultValue="15:00" />
                          <Input placeholder="End time" type="time" defaultValue="17:00" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Teaching Preferences</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Automatic Attendance Reminders</p>
                          <p className="text-sm text-muted-foreground">
                            Send reminders for attendance submission
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Assignment Due Date Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Notify students about upcoming deadlines
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Grade Review Requests</p>
                          <p className="text-sm text-muted-foreground">
                            Allow students to request grade reviews
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="bg-white/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Session Timeout</h4>
                        <p className="text-sm text-muted-foreground">
                          Automatically log out after 30 minutes of inactivity
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-medium">Change Password</h4>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="flex">
                          <div className="flex items-center rounded-l-md border border-r-0 px-3 bg-muted">
                            <Key className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <Input id="currentPassword" type="password" className="rounded-l-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" />
                      </div>
                    </div>
                    <Button variant="outline">Update Password</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}