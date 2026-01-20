import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  Settings as SettingsIcon,
  Shield,
  Database,
  Globe,
  Bell,
  Mail,
  Lock,
  Monitor,
  Download,
  Upload,
  RefreshCw,
  Save,
  AlertCircle,
  CheckCircle,
  Server,
  Network,
  Cpu,
  HardDrive,
  ShieldCheck,
  Key,
  Eye,
  EyeOff
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const SystemSettings = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("general")
  const [isSaving, setIsSaving] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)

  const [settings, setSettings] = useState({
    general: {
      schoolName: "CBG International School",
      schoolCode: "CBG-2024",
      timezone: "America/Los_Angeles",
      language: "english",
      dateFormat: "MM/DD/YYYY",
      academicYear: "2024-2025"
    },
    security: {
      require2FA: true,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5,
      ipWhitelist: "",
      enableAuditLog: true
    },
    email: {
      smtpHost: "smtp.school.edu",
      smtpPort: "587",
      smtpUser: "noreply@school.edu",
      emailFooter: "© 2024 CBG International School. All rights reserved."
    },
    backup: {
      autoBackup: true,
      backupFrequency: "daily",
      retainBackups: 30,
      backupLocation: "cloud",
      lastBackup: "2024-10-20 02:00:00"
    }
  })

  const handleSaveSettings = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success("Settings saved successfully!", {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      })
    }, 1500)
  }

  const handleBackupNow = () => {
    toast.info("Starting system backup...")
  }

  const handleRestoreBackup = () => {
    toast.info("Please select backup file to restore")
  }

  const handleTestEmail = () => {
    toast.success("Test email sent successfully!")
  }

  const handleResetSettings = () => {
    toast.error("This will reset all settings to default. Are you sure?", {
      action: {
        label: "Confirm",
        onClick: () => {
          toast.success("Settings reset to defaults")
          setSettings({
            general: {
              schoolName: "CBG International School",
              schoolCode: "CBG-2024",
              timezone: "America/Los_Angeles",
              language: "english",
              dateFormat: "MM/DD/YYYY",
              academicYear: "2024-2025"
            },
            security: {
              require2FA: true,
              sessionTimeout: 30,
              passwordExpiry: 90,
              loginAttempts: 5,
              ipWhitelist: "",
              enableAuditLog: true
            },
            email: {
              smtpHost: "smtp.school.edu",
              smtpPort: "587",
              smtpUser: "noreply@school.edu",
              emailFooter: "© 2024 CBG International School. All rights reserved."
            },
            backup: {
              autoBackup: true,
              backupFrequency: "daily",
              retainBackups: 30,
              backupLocation: "cloud",
              lastBackup: "2024-10-20 02:00:00"
            }
          })
        }
      },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
              <p className="text-gray-600">Configure and manage system-wide settings</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin')}
              >
                Back to Dashboard
              </Button>
              <Button 
                onClick={handleSaveSettings}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
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
                    { id: "email", label: "Email", icon: Mail },
                    { id: "backup", label: "Backup", icon: Database },
                    { id: "appearance", label: "Appearance", icon: Monitor },
                    { id: "api", label: "API", icon: Server },
                    { id: "maintenance", label: "Maintenance", icon: Cpu }
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
                <div className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleResetSettings}
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </Button>
                </div>
              </CardFooter>
            </Card>

            {/* System Info */}
            <Card className="mt-8 border-gray-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">System Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Version</span>
                      <span className="font-medium">2.5.1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated</span>
                      <span className="font-medium">Oct 15, 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Database Size</span>
                      <span className="font-medium">2.8 GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Users</span>
                      <span className="font-medium">1,245</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              {/* General Settings */}
              <TabsContent value="general" className="space-y-6">
                <Card className="border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>
                      Configure basic system information and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="schoolName">School Name</Label>
                        <Input
                          id="schoolName"
                          value={settings.general.schoolName}
                          onChange={(e) => setSettings({
                            ...settings,
                            general: { ...settings.general, schoolName: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="schoolCode">School Code</Label>
                        <Input
                          id="schoolCode"
                          value={settings.general.schoolCode}
                          onChange={(e) => setSettings({
                            ...settings,
                            general: { ...settings.general, schoolCode: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="academicYear">Academic Year</Label>
                        <Input
                          id="academicYear"
                          value={settings.general.academicYear}
                          onChange={(e) => setSettings({
                            ...settings,
                            general: { ...settings.general, academicYear: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select
                          value={settings.general.timezone}
                          onValueChange={(value) => setSettings({
                            ...settings,
                            general: { ...settings.general, timezone: value }
                          })}
                        >
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
                        <Label htmlFor="language">Language</Label>
                        <Select
                          value={settings.general.language}
                          onValueChange={(value) => setSettings({
                            ...settings,
                            general: { ...settings.general, language: value }
                          })}
                        >
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
                        <Label htmlFor="dateFormat">Date Format</Label>
                        <Select
                          value={settings.general.dateFormat}
                          onValueChange={(value) => setSettings({
                            ...settings,
                            general: { ...settings.general, dateFormat: value }
                          })}
                        >
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
                    </div>
                  </CardContent>
                </Card>

                {/* System Features */}
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle>System Features</CardTitle>
                    <CardDescription>
                      Enable or disable system modules
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { id: "attendance", label: "Attendance Module", description: "Track student attendance" },
                      { id: "grades", label: "Grade Management", description: "Manage student grades and reports" },
                      { id: "finance", label: "Finance Module", description: "Handle fee payments and billing" },
                      { id: "messaging", label: "Messaging System", description: "Internal communication platform" },
                      { id: "portal", label: "Parent Portal", description: "Parent access to student information" },
                      { id: "reports", label: "Advanced Reports", description: "Generate detailed analytics" }
                    ].map((feature) => (
                      <div key={feature.id} className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">{feature.label}</Label>
                          <p className="text-sm text-gray-500">{feature.description}</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security" className="space-y-6">
                <Card className="border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Configure system security and access controls
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Authentication</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Require Two-Factor Authentication</Label>
                            <p className="text-sm text-gray-500">Add extra security layer for all users</p>
                          </div>
                          <Switch 
                            checked={settings.security.require2FA}
                            onCheckedChange={(checked) => setSettings({
                              ...settings,
                              security: { ...settings.security, require2FA: checked }
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                          <Select
                            value={settings.security.sessionTimeout.toString()}
                            onValueChange={(value) => setSettings({
                              ...settings,
                              security: { ...settings.security, sessionTimeout: parseInt(value) }
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
                        <div className="space-y-2">
                          <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                          <Input
                            id="loginAttempts"
                            type="number"
                            value={settings.security.loginAttempts}
                            onChange={(e) => setSettings({
                              ...settings,
                              security: { ...settings.security, loginAttempts: parseInt(e.target.value) }
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Access Control</h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                          <Textarea
                            id="ipWhitelist"
                            placeholder="Enter IP addresses (one per line)"
                            value={settings.security.ipWhitelist}
                            onChange={(e) => setSettings({
                              ...settings,
                              security: { ...settings.security, ipWhitelist: e.target.value }
                            })}
                            rows={3}
                          />
                          <p className="text-sm text-gray-500">
                            Only allow access from these IP addresses. Leave empty to allow all.
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Enable Audit Logging</Label>
                            <p className="text-sm text-gray-500">Log all system activities</p>
                          </div>
                          <Switch 
                            checked={settings.security.enableAuditLog}
                            onCheckedChange={(checked) => setSettings({
                              ...settings,
                              security: { ...settings.security, enableAuditLog: checked }
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">API Security</h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="apiKey">API Key</Label>
                          <div className="relative">
                            <Input
                              id="apiKey"
                              type={showApiKey ? "text" : "password"}
                              value="sk_live_51Hx...y6F8"
                              readOnly
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2"
                              onClick={() => setShowApiKey(!showApiKey)}
                            >
                              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="outline">
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Regenerate
                            </Button>
                            <Button size="sm" variant="outline">
                              <Key className="h-4 w-4 mr-2" />
                              View Logs
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Security Status */}
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle>Security Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center p-4 rounded-xl bg-green-50">
                        <ShieldCheck className="h-8 w-8 text-green-500 mx-auto mb-3" />
                        <div className="text-lg font-bold text-gray-900">Protected</div>
                        <p className="text-sm text-gray-600">Overall Security</p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-blue-50">
                        <Lock className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                        <div className="text-lg font-bold text-gray-900">128-bit</div>
                        <p className="text-sm text-gray-600">Encryption</p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-amber-50">
                        <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                        <div className="text-lg font-bold text-gray-900">2 Alerts</div>
                        <p className="text-sm text-gray-600">Require Attention</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Email Settings */}
              <TabsContent value="email" className="space-y-6">
                <Card className="border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle>Email Configuration</CardTitle>
                    <CardDescription>
                      Configure email server settings and templates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">SMTP Settings</h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="smtpHost">SMTP Host</Label>
                          <Input
                            id="smtpHost"
                            value={settings.email.smtpHost}
                            onChange={(e) => setSettings({
                              ...settings,
                              email: { ...settings.email, smtpHost: e.target.value }
                            })}
                            placeholder="smtp.server.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smtpPort">SMTP Port</Label>
                          <Input
                            id="smtpPort"
                            value={settings.email.smtpPort}
                            onChange={(e) => setSettings({
                              ...settings,
                              email: { ...settings.email, smtpPort: e.target.value }
                            })}
                            placeholder="587"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smtpUser">SMTP Username</Label>
                          <Input
                            id="smtpUser"
                            value={settings.email.smtpUser}
                            onChange={(e) => setSettings({
                              ...settings,
                              email: { ...settings.email, smtpUser: e.target.value }
                            })}
                            placeholder="noreply@school.edu"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smtpPass">SMTP Password</Label>
                          <Input
                            id="smtpPass"
                            type="password"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <Button onClick={handleTestEmail} className="flex-1 md:flex-none">
                          <Mail className="h-4 w-4 mr-2" />
                          Send Test Email
                        </Button>
                        <Button variant="outline" className="flex-1 md:flex-none">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Verify Connection
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Email Templates</h4>
                      <div className="space-y-2">
                        <Label htmlFor="emailFooter">Email Footer</Label>
                        <Textarea
                          id="emailFooter"
                          value={settings.email.emailFooter}
                          onChange={(e) => setSettings({
                            ...settings,
                            email: { ...settings.email, emailFooter: e.target.value }
                          })}
                          rows={3}
                        />
                      </div>
                      <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
                        <h5 className="font-medium text-gray-900 mb-2">Email Template Variables</h5>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                          <code className="px-2 py-1 bg-white rounded border border-gray-200">{'{student_name}'}</code>
                          <code className="px-2 py-1 bg-white rounded border border-gray-200">{'{school_name}'}</code>
                          <code className="px-2 py-1 bg-white rounded border border-gray-200">{'{admin_email}'}</code>
                          <code className="px-2 py-1 bg-white rounded border border-gray-200">{'{date}'}</code>
                          <code className="px-2 py-1 bg-white rounded border border-gray-200">{'{year}'}</code>
                          <code className="px-2 py-1 bg-white rounded border border-gray-200">{'{support_phone}'}</code>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Email Notifications</h4>
                      <div className="space-y-3">
                        {[
                          { id: "studentEnrollment", label: "Student Enrollment", description: "Send email when new student enrolls" },
                          { id: "feePayment", label: "Fee Payment Confirmation", description: "Send receipt for fee payments" },
                          { id: "attendanceAlert", label: "Low Attendance Alert", description: "Notify parents of low attendance" },
                          { id: "gradeUpdate", label: "Grade Updates", description: "Notify parents of grade changes" }
                        ].map((notif) => (
                          <div key={notif.id} className="flex items-center justify-between">
                            <div>
                              <Label className="font-medium">{notif.label}</Label>
                              <p className="text-sm text-gray-500">{notif.description}</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* SMS Configuration */}
                <Card className="border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle>SMS Configuration</CardTitle>
                    <CardDescription>
                      Configure SMS service for notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-medium">Enable SMS Notifications</Label>
                        <p className="text-sm text-gray-500">Send SMS alerts to parents and staff</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="smsProvider">SMS Provider</Label>
                        <Select defaultValue="twilio">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="twilio">Twilio</SelectItem>
                            <SelectItem value="aws">AWS SNS</SelectItem>
                            <SelectItem value="nexmo">Nexmo</SelectItem>
                            <SelectItem value="custom">Custom Gateway</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smsAccountId">Account ID / SID</Label>
                        <Input id="smsAccountId" placeholder="Enter account ID" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smsAuthToken">Auth Token / API Key</Label>
                        <div className="relative">
                          <Input id="smsAuthToken" type="password" placeholder="••••••••" />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smsPhoneNumber">From Phone Number</Label>
                        <Input id="smsPhoneNumber" placeholder="+1234567890" />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button>
                        <Bell className="h-4 w-4 mr-2" />
                        Send Test SMS
                      </Button>
                      <Button variant="outline">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Verify Gateway
                      </Button>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">SMS Templates</h4>
                      <div className="space-y-4">
                        {[
                          { id: "attendance", label: "Attendance Alert", template: "Hi {student_name}, your attendance is {percentage}%. " },
                          { id: "payment", label: "Payment Reminder", template: "Reminder: Fee of {amount} is due by {date}. " },
                          { id: "grade", label: "Grade Notification", template: "Your latest grade in {subject} is {grade}. " }
                        ].map((template) => (
                          <div key={template.id} className="space-y-2">
                            <Label className="font-medium">{template.label}</Label>
                            <Textarea
                              placeholder={template.template}
                              rows={2}
                              defaultValue={template.template}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Backup Settings */}
              <TabsContent value="backup" className="space-y-6">
                <Card className="border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle>Backup & Restore</CardTitle>
                    <CardDescription>
                      Configure automated backups and restore points
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Backup Settings</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Automatic Backups</Label>
                            <p className="text-sm text-gray-500">Schedule regular system backups</p>
                          </div>
                          <Switch 
                            checked={settings.backup.autoBackup}
                            onCheckedChange={(checked) => setSettings({
                              ...settings,
                              backup: { ...settings.backup, autoBackup: checked }
                            })}
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="backupFrequency">Backup Frequency</Label>
                            <Select
                              value={settings.backup.backupFrequency}
                              onValueChange={(value) => setSettings({
                                ...settings,
                                backup: { ...settings.backup, backupFrequency: value }
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="hourly">Hourly</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="retainBackups">Retain Backups (days)</Label>
                            <Input
                              id="retainBackups"
                              type="number"
                              value={settings.backup.retainBackups}
                              onChange={(e) => setSettings({
                                ...settings,
                                backup: { ...settings.backup, retainBackups: parseInt(e.target.value) }
                              })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="backupLocation">Backup Location</Label>
                          <Select
                            value={settings.backup.backupLocation}
                            onValueChange={(value) => setSettings({
                              ...settings,
                              backup: { ...settings.backup, backupLocation: value }
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cloud">Cloud Storage</SelectItem>
                              <SelectItem value="local">Local Server</SelectItem>
                              <SelectItem value="both">Both</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Backup Actions</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Button onClick={handleBackupNow}>
                          <Database className="h-4 w-4 mr-2" />
                          Backup Now
                        </Button>
                        <Button variant="outline" onClick={handleRestoreBackup}>
                          <Upload className="h-4 w-4 mr-2" />
                          Restore Backup
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Backup History</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                          <div>
                            <p className="font-medium">Full System Backup</p>
                            <p className="text-sm text-gray-500">{settings.backup.lastBackup}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-700">Completed</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                          <div>
                            <p className="font-medium">Database Backup</p>
                            <p className="text-sm text-gray-500">2024-10-19 02:00:00</p>
                          </div>
                          <Badge className="bg-green-100 text-green-700">Completed</Badge>
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

export default SystemSettings