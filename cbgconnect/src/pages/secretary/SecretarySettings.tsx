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
  FileText
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const SecretarySettings = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Administrative Settings</h1>
              <p className="text-gray-600">Configure system settings and preferences</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/secretary')}
              >
                Back to Dashboard
              </Button>
              <Button onClick={() => navigate('/secretary/profile')}>
                <User className="h-4 w-4 mr-2" />
                My Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Settings Navigation */}
          <div className="lg:col-span-1">
            <Card className="border-gray-200 shadow-lg sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  Settings Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {[
                    { id: "general", label: "General", icon: Globe },
                    { id: "security", label: "Security", icon: Shield },
                    { id: "notifications", label: "Notifications", icon: Bell },
                    { id: "data", label: "Data Management", icon: Database },
                    { id: "appearance", label: "Appearance", icon: Monitor },
                    { id: "advanced", label: "Advanced", icon: SettingsIcon }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <div className="w-full space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleResetSettings}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => toast.error("This action requires confirmation")}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete All Data
                  </Button>
                </div>
              </CardFooter>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-8 border-gray-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">System Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Database Size</span>
                      <span className="font-medium">2.8 GB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Backup</span>
                      <span className="font-medium">Today, 2:00 AM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Active Users</span>
                      <span className="font-medium">48</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Settings Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              {/* General Settings */}
              <TabsContent value="general" className="space-y-6">
                <Card className="border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>
                      Configure basic system preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select value={settings.general.language}>
                          <SelectTrigger>
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
                          <SelectTrigger>
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
                          <SelectTrigger>
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
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12-hour">12-hour</SelectItem>
                            <SelectItem value="24-hour">24-hour</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">System Preferences</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Auto-save Forms</Label>
                            <p className="text-sm text-gray-500">Automatically save form progress</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Quick Search</Label>
                            <p className="text-sm text-gray-500">Enable instant search across records</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Bulk Actions</Label>
                            <p className="text-sm text-gray-500">Enable multiple record operations</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => toast.success("General settings saved!")}>
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security" className="space-y-6">
                <Card className="border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage account security and access controls
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Password & Authentication</h4>
                      <Card className="border-gray-200">
                        <CardContent className="p-6 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <div className="relative">
                              <Input
                                id="current-password"
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder="Enter current password"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2"
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
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                              >
                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                            <p className="text-xs text-gray-500">
                              Password must be at least 12 characters with uppercase, lowercase, numbers, and symbols
                            </p>
                          </div>
                          <Button onClick={handleChangePassword}>
                            <Key className="h-4 w-4 mr-2" />
                            Change Password
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Session & Access</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
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
                            <SelectTrigger>
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
                        <div className="flex items-center justify-between">
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
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Access Logs</h4>
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Recent Login Activity</p>
                              <p className="text-sm text-gray-500">Last login: Today, 9:15 AM</p>
                            </div>
                            <Button size="sm" variant="outline">View Logs</Button>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Active Sessions</p>
                              <p className="text-sm text-gray-500">2 active sessions</p>
                            </div>
                            <Button size="sm" variant="outline">Manage Sessions</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Settings */}
              <TabsContent value="notifications" className="space-y-6">
                <Card className="border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Configure administrative alerts and notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Alert Types</h4>
                      <div className="space-y-4">
                        {[
                          { id: "student-alerts", label: "Student Registration Alerts", description: "New student registrations" },
                          { id: "payment-alerts", label: "Payment Notifications", description: "Fee payments and reminders" },
                          { id: "attendance-alerts", label: "Attendance Alerts", description: "Absence and late arrival alerts" },
                          { id: "report-alerts", label: "Report Generation Alerts", description: "When reports are generated" },
                          { id: "system-alerts", label: "System Maintenance Alerts", description: "System updates and maintenance" },
                          { id: "parent-alerts", label: "Parent Communication Alerts", description: "Parent inquiries and requests" }
                        ].map((alert) => (
                          <div key={alert.id} className="flex items-center justify-between">
                            <div>
                              <Label className="font-medium">{alert.label}</Label>
                              <p className="text-sm text-gray-500">{alert.description}</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Notification Schedule</h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="quiet-hours">Quiet Hours</Label>
                          <Select defaultValue="10pm-7am">
                            <SelectTrigger>
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

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Bulk Notifications</h4>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <Mail className="h-4 w-4 mr-2" />
                          Configure Email Templates
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Bell className="h-4 w-4 mr-2" />
                          Setup SMS Alerts
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <FileText className="h-4 w-4 mr-2" />
                          Manage Notification Templates
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Data Management Settings */}
              <TabsContent value="data" className="space-y-6">
                <Card className="border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                    <CardDescription>
                      Configure data backup, retention, and export settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Backup Settings</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
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
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button variant="outline" onClick={handleBackupNow}>
                          <Database className="h-4 w-4 mr-2" />
                          Backup Now
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Data Retention</h4>
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
                            <SelectTrigger>
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
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Auto-archive Old Records</Label>
                            <p className="text-sm text-gray-500">Move old records to archive</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Data Export</h4>
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
                            <SelectTrigger>
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
                          <Button variant="outline" onClick={handleExportData}>
                            <Download className="h-4 w-4 mr-2" />
                            Export All Data
                          </Button>
                          <Button variant="outline" onClick={handleClearCache}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Clear Cache
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Shield className="h-4 w-4" />
                      <span>Your data is encrypted and GDPR compliant</span>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Appearance Settings */}
              <TabsContent value="appearance" className="space-y-6">
                <Card className="border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                    <CardDescription>
                      Customize the look and feel of the admin interface
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Theme Customization</h4>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { name: "Light", value: "light", active: true },
                          { name: "Dark", value: "dark" },
                          { name: "Blue", value: "blue" },
                          { name: "Green", value: "green" },
                          { name: "Purple", value: "purple" },
                          { name: "System", value: "system" }
                        ].map((theme) => (
                          <button
                            key={theme.value}
                            className={`p-4 rounded-lg border-2 ${
                              theme.active 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => toast.info(`Applied ${theme.name} theme`)}
                          >
                            <div className={`h-8 rounded mb-2 ${
                              theme.value === 'light' ? 'bg-gray-100' :
                              theme.value === 'dark' ? 'bg-gray-800' :
                              theme.value === 'blue' ? 'bg-blue-500' :
                              theme.value === 'green' ? 'bg-green-500' :
                              theme.value === 'purple' ? 'bg-purple-500' :
                              'bg-gradient-to-r from-gray-100 to-gray-800'
                            }`} />
                            <p className="font-medium">{theme.name}</p>
                            {theme.active && (
                              <Badge className="mt-2 bg-blue-100 text-blue-700">Active</Badge>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Display Preferences</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Compact Mode</Label>
                            <p className="text-sm text-gray-500">Show more content in less space</p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Density</Label>
                            <p className="text-sm text-gray-500">Control spacing and padding</p>
                          </div>
                          <Select defaultValue="comfortable">
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="compact">Compact</SelectItem>
                              <SelectItem value="comfortable">Comfortable</SelectItem>
                              <SelectItem value="spacious">Spacious</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Reduced Motion</Label>
                            <p className="text-sm text-gray-500">Minimize animations and transitions</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => toast.success("Appearance settings applied!")}>
                      Apply Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Advanced Settings */}
              <TabsContent value="advanced" className="space-y-6">
                <Card className="border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle>Advanced Settings</CardTitle>
                    <CardDescription>
                      System configuration and maintenance options
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">System Maintenance</h4>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <Database className="h-4 w-4 mr-2" />
                          Optimize Database
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Clear System Cache
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <FileText className="h-4 w-4 mr-2" />
                          Generate System Logs
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">API & Integration</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">API Access</Label>
                            <p className="text-sm text-gray-500">Enable third-party integrations</p>
                          </div>
                          <Switch />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="api-rate">API Rate Limit</Label>
                          <Select defaultValue="100">
                            <SelectTrigger>
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

                    <Separator />

                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecretarySettings