// src/pages/secretary/Settings.tsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  Settings as SettingsIcon,
  Bell,
  Shield,
  Users,
  Database,
  Download,
  Printer,
  Lock,
  Eye,
  EyeOff,
  Key,
  User,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Trash2,
  Globe,
  Monitor,
  Mail,
  FileText,
  Zap,
  Cpu,
  HardDrive,
  Activity,
  BarChart3,
  ShieldCheck,
  UploadCloud,
  Moon,
  Sun,
  Palette,
  Layout
} from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const Settings = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("general")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  // Mock settings data
  const [settings, setSettings] = useState({
    general: {
      language: "english",
      timezone: "America/Los_Angeles",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12-hour",
      theme: "light"
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: "30",
      loginAlerts: true,
      passwordExpiry: "90"
    },
    data: {
      autoBackup: true,
      backupFrequency: "daily",
      retainRecords: "5-years",
      exportFormat: "csv"
    }
  })

  const handleExportData = () => {
    toast.success("Preparing data export...", {
      description: "You'll receive an email with download link shortly.",
    })
  }

  const handleClearCache = () => {
    toast.success("Cache cleared successfully!")
  }

  const handleResetSettings = () => {
    toast.success("Settings reset to defaults!")
  }

  const handleChangePassword = () => {
    toast.success("Password changed successfully!", {
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    })
  }

  const handleBackupNow = () => {
    toast.info("Starting system backup...")
  }

  const getStatusColor = (value: number) => {
    if (value >= 80) return "text-green-600 bg-green-100"
    if (value >= 60) return "text-amber-600 bg-amber-100"
    return "text-red-600 bg-red-100"
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Administrative Settings
            </h1>
            <p className="text-gray-600 mt-2">Configure system settings and preferences</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/secretary')}
              className="border-amber-200 hover:bg-amber-50"
            >
              Back to Dashboard
            </Button>
            <Button 
              onClick={() => navigate('/secretary/profile')}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              <User className="h-4 w-4 mr-2" />
              My Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Settings Navigation */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border border-amber-100 bg-gradient-to-b from-white to-amber-50/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <SettingsIcon className="h-5 w-5 text-amber-500" />
                  Settings Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {[
                    { id: "general", label: "General", icon: Globe, color: "from-blue-500 to-cyan-500" },
                    { id: "security", label: "Security", icon: Shield, color: "from-green-500 to-emerald-500" },
                    { id: "notifications", label: "Notifications", icon: Bell, color: "from-amber-500 to-orange-500" },
                    { id: "data", label: "Data Management", icon: Database, color: "from-purple-500 to-pink-500" },
                    { id: "appearance", label: "Appearance", icon: Palette, color: "from-indigo-500 to-blue-500" },
                    { id: "advanced", label: "Advanced", icon: Cpu, color: "from-gray-600 to-gray-800" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                        activeTab === item.id
                          ? `bg-gradient-to-r ${item.color} text-white shadow-md transform scale-[1.02]`
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:shadow-sm'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </CardContent>
              <CardFooter className="border-t border-amber-100 pt-6">
                <div className="w-full space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-amber-200 hover:bg-amber-50"
                    onClick={handleResetSettings}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    onClick={() => toast.error("This action requires confirmation")}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete All Data
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="border border-amber-100 bg-gradient-to-b from-white to-amber-50/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Activity className="h-5 w-5 text-amber-500" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Database Size</span>
                    <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700">2.8 GB</Badge>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Storage Usage</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Last Backup</span>
                    <span className="font-medium text-gray-900">Today, 2:00 AM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Users</span>
                    <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700">48</Badge>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">System Health</span>
                  <Badge className={`${getStatusColor(92)}`}>92%</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Settings Content */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 bg-gradient-to-r from-white to-amber-50/50 border border-amber-100 p-1 rounded-xl">
                <TabsTrigger 
                  value="general" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">General</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="notifications" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Alerts</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="data" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
                >
                  <Database className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Data</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="appearance" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
                >
                  <Palette className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Theme</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="advanced" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
                >
                  <Cpu className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Advanced</span>
                </TabsTrigger>
              </TabsList>

              {/* General Settings */}
              <TabsContent value="general" className="space-y-6">
                <Card className="border border-amber-100 bg-gradient-to-b from-white to-amber-50/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-gray-900">General Settings</CardTitle>
                    <CardDescription>
                      Configure basic system preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select value={settings.general.language}>
                          <SelectTrigger className="border-amber-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="spanish">Spanish</SelectItem>
                            <SelectItem value="french">French</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select value={settings.general.timezone}>
                          <SelectTrigger className="border-amber-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/New_York">Eastern Time</SelectItem>
                            <SelectItem value="America/Chicago">Central Time</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date-format">Date Format</Label>
                        <Select value={settings.general.dateFormat}>
                          <SelectTrigger className="border-amber-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time-format">Time Format</Label>
                        <Select value={settings.general.timeFormat}>
                          <SelectTrigger className="border-amber-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12-hour">12-hour</SelectItem>
                            <SelectItem value="24-hour">24-hour</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator className="border-amber-100" />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Zap className="h-5 w-5 text-amber-500" />
                        System Preferences
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl border border-amber-100 bg-amber-50/50">
                          <div>
                            <Label className="font-medium">Auto-save Forms</Label>
                            <p className="text-sm text-gray-500">Automatically save form progress</p>
                          </div>
                          <Switch defaultChecked className="data-[state=checked]:bg-amber-500" />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl border border-amber-100 bg-amber-50/50">
                          <div>
                            <Label className="font-medium">Quick Search</Label>
                            <p className="text-sm text-gray-500">Enable instant search across records</p>
                          </div>
                          <Switch defaultChecked className="data-[state=checked]:bg-amber-500" />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl border border-amber-100 bg-amber-50/50">
                          <div>
                            <Label className="font-medium">Bulk Actions</Label>
                            <p className="text-sm text-gray-500">Enable multiple record operations</p>
                          </div>
                          <Switch defaultChecked className="data-[state=checked]:bg-amber-500" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => toast.success("General settings saved!")}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    >
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security" className="space-y-6">
                <Card className="border border-amber-100 bg-gradient-to-b from-white to-amber-50/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Security Settings</CardTitle>
                    <CardDescription>
                      Manage account security and access controls
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Lock className="h-5 w-5 text-amber-500" />
                        Password & Authentication
                      </h4>
                      <Card className="border border-amber-100 bg-gradient-to-b from-white to-amber-50/50">
                        <CardContent className="p-6 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <div className="relative">
                              <Input
                                id="current-password"
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder="Enter current password"
                                className="border-amber-200"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-amber-50"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              >
                                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <div className="relative">
                              <Input
                                id="new-password"
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                className="border-amber-200"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-amber-50"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                              >
                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                            <p className="text-xs text-gray-500">
                              Password must be at least 12 characters with uppercase, lowercase, numbers, and symbols
                            </p>
                          </div>
                          <Button 
                            onClick={handleChangePassword}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                          >
                            <Key className="h-4 w-4 mr-2" />
                            Change Password
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-amber-500" />
                        Session & Access
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl border border-amber-100 bg-amber-50/50">
                          <div>
                            <Label className="font-medium">Two-Factor Authentication</Label>
                            <p className="text-sm text-gray-500">Add an extra layer of security</p>
                          </div>
                          <Switch 
                            checked={settings.security.twoFactorAuth}
                            onCheckedChange={(checked) => setSettings({
                              ...settings,
                              security: { ...settings.security, twoFactorAuth: checked }
                            })}
                            className="data-[state=checked]:bg-amber-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="session-timeout">Session Timeout</Label>
                          <Select 
                            value={settings.security.sessionTimeout}
                            onValueChange={(value) => setSettings({
                              ...settings,
                              security: { ...settings.security, sessionTimeout: value }
                            })}
                          >
                            <SelectTrigger className="border-amber-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="60">1 hour</SelectItem>
                              <SelectItem value="120">2 hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl border border-amber-100 bg-amber-50/50">
                          <div>
                            <Label className="font-medium">Login Alerts</Label>
                            <p className="text-sm text-gray-500">Get notified of new logins</p>
                          </div>
                          <Switch 
                            checked={settings.security.loginAlerts}
                            onCheckedChange={(checked) => setSettings({
                              ...settings,
                              security: { ...settings.security, loginAlerts: checked }
                            })}
                            className="data-[state=checked]:bg-amber-500"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="border-amber-100" />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Access Logs</h4>
                      <div className="space-y-3">
                        <div className="p-3 rounded-xl border border-amber-100 bg-amber-50/50">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Recent Login Activity</p>
                              <p className="text-sm text-gray-500">Last login: Today, 9:15 AM</p>
                            </div>
                            <Button size="sm" variant="outline" className="border-amber-200 hover:bg-amber-50">
                              View Logs
                            </Button>
                          </div>
                        </div>
                        <div className="p-3 rounded-xl border border-amber-100 bg-amber-50/50">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Active Sessions</p>
                              <p className="text-sm text-gray-500">2 active sessions</p>
                            </div>
                            <Button size="sm" variant="outline" className="border-amber-200 hover:bg-amber-50">
                              Manage Sessions
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Settings */}
              <TabsContent value="notifications" className="space-y-6">
                <Card className="border border-amber-100 bg-gradient-to-b from-white to-amber-50/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Notification Settings</CardTitle>
                    <CardDescription>
                      Configure administrative alerts and notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Bell className="h-5 w-5 text-amber-500" />
                        Alert Types
                      </h4>
                      <div className="space-y-4">
                        {[
                          { id: "student-alerts", label: "Student Registration Alerts", description: "New student registrations" },
                          { id: "payment-alerts", label: "Payment Notifications", description: "Fee payments and reminders" },
                          { id: "attendance-alerts", label: "Attendance Alerts", description: "Absence and late arrival alerts" },
                          { id: "report-alerts", label: "Report Generation Alerts", description: "When reports are generated" },
                          { id: "system-alerts", label: "System Maintenance Alerts", description: "System updates and maintenance" },
                          { id: "parent-alerts", label: "Parent Communication Alerts", description: "Parent inquiries and requests" }
                        ].map((alert) => (
                          <div key={alert.id} className="flex items-center justify-between p-3 rounded-xl border border-amber-100 bg-amber-50/50">
                            <div>
                              <Label className="font-medium text-gray-900">{alert.label}</Label>
                              <p className="text-sm text-gray-500">{alert.description}</p>
                            </div>
                            <Switch defaultChecked className="data-[state=checked]:bg-amber-500" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="border-amber-100" />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-amber-500" />
                        Notification Schedule
                      </h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="quiet-hours">Quiet Hours</Label>
                          <Select defaultValue="10pm-7am">
                            <SelectTrigger className="border-amber-200">
                              <SelectValue placeholder="Select hours" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10pm-7am">10 PM - 7 AM</SelectItem>
                              <SelectItem value="11pm-8am">11 PM - 8 AM</SelectItem>
                              <SelectItem value="9pm-6am">9 PM - 6 AM</SelectItem>
                              <SelectItem value="none">No quiet hours</SelectItem>
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

                    <Separator className="border-amber-100" />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Bulk Notifications</h4>
                      <div className="grid md:grid-cols-3 gap-3">
                        <Button variant="outline" className="border-amber-200 hover:bg-amber-50">
                          <Mail className="h-4 w-4 mr-2" />
                          Email Templates
                        </Button>
                        <Button variant="outline" className="border-amber-200 hover:bg-amber-50">
                          <Bell className="h-4 w-4 mr-2" />
                          SMS Alerts
                        </Button>
                        <Button variant="outline" className="border-amber-200 hover:bg-amber-50">
                          <FileText className="h-4 w-4 mr-2" />
                          Templates
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Data Management Settings */}
              <TabsContent value="data" className="space-y-6">
                <Card className="border border-amber-100 bg-gradient-to-b from-white to-amber-50/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Data Management</CardTitle>
                    <CardDescription>
                      Configure data backup, retention, and export settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <HardDrive className="h-5 w-5 text-amber-500" />
                        Backup Settings
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl border border-amber-100 bg-amber-50/50">
                          <div>
                            <Label className="font-medium">Automatic Backups</Label>
                            <p className="text-sm text-gray-500">Automatically backup system data</p>
                          </div>
                          <Switch 
                            checked={settings.data.autoBackup}
                            onCheckedChange={(checked) => setSettings({
                              ...settings,
                              data: { ...settings.data, autoBackup: checked }
                            })}
                            className="data-[state=checked]:bg-amber-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="backup-frequency">Backup Frequency</Label>
                          <Select 
                            value={settings.data.backupFrequency}
                            onValueChange={(value) => setSettings({
                              ...settings,
                              data: { ...settings.data, backupFrequency: value }
                            })}
                          >
                            <SelectTrigger className="border-amber-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={handleBackupNow}
                          className="border-amber-200 hover:bg-amber-50"
                        >
                          <UploadCloud className="h-4 w-4 mr-2" />
                          Backup Now
                        </Button>
                      </div>
                    </div>

                    <Separator className="border-amber-100" />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-amber-500" />
                        Data Retention
                      </h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="retain-records">Record Retention Period</Label>
                          <Select 
                            value={settings.data.retainRecords}
                            onValueChange={(value) => setSettings({
                              ...settings,
                              data: { ...settings.data, retainRecords: value }
                            })}
                          >
                            <SelectTrigger className="border-amber-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-year">1 Year</SelectItem>
                              <SelectItem value="3-years">3 Years</SelectItem>
                              <SelectItem value="5-years">5 Years</SelectItem>
                              <SelectItem value="forever">Keep Forever</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl border border-amber-100 bg-amber-50/50">
                          <div>
                            <Label className="font-medium">Auto-archive Old Records</Label>
                            <p className="text-sm text-gray-500">Move old records to archive</p>
                          </div>
                          <Switch defaultChecked className="data-[state=checked]:bg-amber-500" />
                        </div>
                      </div>
                    </div>

                    <Separator className="border-amber-100" />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Download className="h-5 w-5 text-amber-500" />
                        Data Export
                      </h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="export-format">Default Export Format</Label>
                          <Select 
                            value={settings.data.exportFormat}
                            onValueChange={(value) => setSettings({
                              ...settings,
                              data: { ...settings.data, exportFormat: value }
                            })}
                          >
                            <SelectTrigger className="border-amber-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="csv">CSV</SelectItem>
                              <SelectItem value="excel">Excel</SelectItem>
                              <SelectItem value="pdf">PDF</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Button 
                            variant="outline" 
                            onClick={handleExportData}
                            className="border-amber-200 hover:bg-amber-50"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export All Data
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={handleClearCache}
                            className="border-amber-200 hover:bg-amber-50"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Clear Cache
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center gap-3 text-sm text-amber-700 bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-xl">
                      <Shield className="h-4 w-4" />
                      <span>Your data is encrypted and GDPR compliant</span>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Appearance Settings */}
              <TabsContent value="appearance" className="space-y-6">
                <Card className="border border-amber-100 bg-gradient-to-b from-white to-amber-50/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Appearance Settings</CardTitle>
                    <CardDescription>
                      Customize the look and feel of the admin interface
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Palette className="h-5 w-5 text-amber-500" />
                        Theme Customization
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          { name: "Light", value: "light", active: true, color: "from-gray-100 to-gray-50", icon: Sun },
                          { name: "Dark", value: "dark", color: "from-gray-800 to-gray-900", icon: Moon },
                          { name: "Amber", value: "amber", color: "from-amber-500 to-orange-500", icon: Sun },
                          { name: "Blue", value: "blue", color: "from-blue-500 to-cyan-500", icon: Palette },
                          { name: "Green", value: "green", color: "from-green-500 to-emerald-500", icon: Palette },
                          { name: "System", value: "system", color: "from-gray-100 to-gray-800", icon: SettingsIcon }
                        ].map((theme) => (
                          <motion.button
                            key={theme.value}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-4 rounded-xl border-2 ${
                              theme.active 
                                ? 'border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50' 
                                : 'border-amber-100 hover:border-amber-300'
                            }`}
                            onClick={() => toast.info(`Applied ${theme.name} theme`)}
                          >
                            <div className={`h-8 rounded-lg mb-2 bg-gradient-to-r ${theme.color}`} />
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-gray-900">{theme.name}</p>
                              <theme.icon className="h-4 w-4 text-gray-500" />
                            </div>
                            {theme.active && (
                              <Badge className="mt-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-amber-200">
                                Active
                              </Badge>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <Separator className="border-amber-100" />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Layout className="h-5 w-5 text-amber-500" />
                        Display Preferences
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl border border-amber-100 bg-amber-50/50">
                          <div>
                            <Label className="font-medium">Compact Mode</Label>
                            <p className="text-sm text-gray-500">Show more content in less space</p>
                          </div>
                          <Switch className="data-[state=checked]:bg-amber-500" />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl border border-amber-100 bg-amber-50/50">
                          <div>
                            <Label className="font-medium">Density</Label>
                            <p className="text-sm text-gray-500">Control spacing and padding</p>
                          </div>
                          <Select defaultValue="comfortable">
                            <SelectTrigger className="w-32 border-amber-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="compact">Compact</SelectItem>
                              <SelectItem value="comfortable">Comfortable</SelectItem>
                              <SelectItem value="spacious">Spacious</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl border border-amber-100 bg-amber-50/50">
                          <div>
                            <Label className="font-medium">Reduced Motion</Label>
                            <p className="text-sm text-gray-500">Minimize animations and transitions</p>
                          </div>
                          <Switch className="data-[state=checked]:bg-amber-500" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => toast.success("Appearance settings applied!")}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    >
                      Apply Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Advanced Settings */}
              <TabsContent value="advanced" className="space-y-6">
                <Card className="border border-amber-100 bg-gradient-to-b from-white to-amber-50/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Advanced Settings</CardTitle>
                    <CardDescription>
                      System configuration and maintenance options
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Cpu className="h-5 w-5 text-amber-500" />
                        System Maintenance
                      </h4>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start border-amber-200 hover:bg-amber-50">
                          <Database className="h-4 w-4 mr-2" />
                          Optimize Database
                        </Button>
                        <Button variant="outline" className="w-full justify-start border-amber-200 hover:bg-amber-50">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Clear System Cache
                        </Button>
                        <Button variant="outline" className="w-full justify-start border-amber-200 hover:bg-amber-50">
                          <FileText className="h-4 w-4 mr-2" />
                          Generate System Logs
                        </Button>
                      </div>
                    </div>

                    <Separator className="border-amber-100" />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">API & Integration</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl border border-amber-100 bg-amber-50/50">
                          <div>
                            <Label className="font-medium">API Access</Label>
                            <p className="text-sm text-gray-500">Enable third-party integrations</p>
                          </div>
                          <Switch className="data-[state=checked]:bg-amber-500" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="api-rate">API Rate Limit</Label>
                          <Select defaultValue="100">
                            <SelectTrigger className="border-amber-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="50">50 requests/hour</SelectItem>
                              <SelectItem value="100">100 requests/hour</SelectItem>
                              <SelectItem value="200">200 requests/hour</SelectItem>
                              <SelectItem value="unlimited">Unlimited</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Separator className="border-amber-100" />

                    <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-red-700">Danger Zone</h4>
                          <p className="text-sm text-red-600 mb-4">
                            These actions are irreversible. Please proceed with caution.
                          </p>
                          <div className="space-y-3">
                            <Button 
                              variant="destructive" 
                              className="w-full justify-start"
                              onClick={() => toast.error("System reset requires confirmation")}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Reset System to Factory Settings
                            </Button>
                            <Button 
                              variant="destructive" 
                              className="w-full justify-start"
                              onClick={() => toast.error("This action requires confirmation")}
                            >
                              <Database className="h-4 w-4 mr-2" />
                              Purge All Student Records
                            </Button>
                          </div>
                        </div>
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

export default Settings