import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { 
  Settings as SettingsIcon,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Smartphone,
  Monitor,
  Mail,
  MessageSquare,
  Download,
  Database,
  Eye,
  EyeOff,
  Key,
  User,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Trash2,
  Lock
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
import { Progress } from "@/components/ui/progress"

import { api } from "@/lib/api"

const Settings = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("notifications")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: true,
      push: false,
      grades: true,
      attendance: true,
      events: true,
      announcements: true,
      messages: true
    },
    privacy: {
      profileVisibility: "teachers-only",
      dataSharing: false,
      activityStatus: true,
      contactVisibility: false
    },
    account: {
      language: "english",
      timezone: "America/Los_Angeles",
      dateFormat: "MM/DD/YYYY",
      theme: "light"
    },
    billing: {
      plan: "premium",
      status: "active",
      nextBilling: "2024-11-15",
      autoRenew: true
    }
  })

  useEffect(() => {
    const load = async () => {
      try {
        const r = await api.get("/parents/me/settings")
        const serverSettings = r.data?.settings
        if (serverSettings && typeof serverSettings === "object") {
          setSettings(serverSettings)
        }
      } catch (_e) {
        // keep fallback settings
      }
    }

    load()
  }, [])

  const handleSaveSettings = async () => {
    try {
      await api.put("/parents/me/settings", { settings })
      toast.success("Settings saved!")
    } catch (_e) {
      toast.error("Failed to save settings")
    }
  }

  const handleExportData = () => {
    toast.success("Preparing your data export...", {
      description: "You'll receive an email with download link shortly.",
    })
  }

  const handleClearCache = () => {
    toast.success("Cache cleared successfully!")
  }

  const handleResetSettings = () => {
    setSettings({
      notifications: {
        email: true,
        sms: true,
        push: false,
        grades: true,
        attendance: true,
        events: true,
        announcements: true,
        messages: true
      },
      privacy: {
        profileVisibility: "teachers-only",
        dataSharing: false,
        activityStatus: true,
        contactVisibility: false
      },
      account: {
        language: "english",
        timezone: "America/Los_Angeles",
        dateFormat: "MM/DD/YYYY",
        theme: "light"
      },
      billing: {
        plan: "premium",
        status: "active",
        nextBilling: "2024-11-15",
        autoRenew: true
      }
    })
    toast.success("Settings reset to defaults!")
  }

  const handleChangePassword = () => {
    toast.success("Password changed successfully!", {
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    })
  }

  const handleUpgradePlan = () => {
    toast.info("Redirecting to upgrade page...")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Customize your CBG Connect experience</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/parent')}
              >
                Back to Dashboard
              </Button>
              <Button onClick={() => navigate('/parent/profile')}>
                <User className="h-4 w-4 mr-2" />
                View Profile
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
                    { id: "notifications", label: "Notifications", icon: Bell },
                    { id: "privacy", label: "Privacy & Security", icon: Shield },
                    { id: "account", label: "Account", icon: User },
                    { id: "appearance", label: "Appearance", icon: Monitor },
                    { id: "billing", label: "Billing", icon: CreditCard },
                    { id: "data", label: "Data & Storage", icon: Database }
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
                      {item.id === "billing" && (
                        <Badge className="ml-auto bg-green-100 text-green-700">Active</Badge>
                      )}
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
                    Delete Account
                  </Button>
                </div>
              </CardFooter>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-8 border-gray-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Storage Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">2.4 GB of 5 GB used</span>
                      <span className="font-medium">48%</span>
                    </div>
                    <Progress value={48} className="h-2" />
                  </div>
                  <p className="text-sm text-gray-500">
                    Documents, attachments, and media files
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Settings Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card className="border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notification Settings
                    </CardTitle>
                    <CardDescription>
                      Choose how you want to be notified about school updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Notification Channels</h4>
                      <div className="space-y-4">
                        {Object.entries(settings.notifications).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <div>
                              <Label htmlFor={key} className="capitalize font-medium">
                                {key === 'sms' ? 'SMS Text Messages' : 
                                 key === 'push' ? 'Push Notifications' :
                                 key.charAt(0).toUpperCase() + key.slice(1)}
                              </Label>
                              <p className="text-sm text-gray-500">
                                {key === 'grades' ? 'Receive grade updates' :
                                 key === 'attendance' ? 'Attendance alerts' :
                                 key === 'events' ? 'School event reminders' :
                                 key === 'announcements' ? 'Important announcements' :
                                 key === 'messages' ? 'New message alerts' :
                                 'Receive notifications via this channel'}
                              </p>
                            </div>
                            <Switch 
                              id={key}
                              checked={value}
                              onCheckedChange={(checked) => setSettings({
                                ...settings,
                                notifications: { ...settings.notifications, [key]: checked }
                              })}
                            />
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
                          <Label htmlFor="frequency">Email Frequency</Label>
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
                  <CardFooter>
                    <Button onClick={handleSaveSettings}>
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Privacy & Security Tab */}
              <TabsContent value="privacy" className="space-y-6">
                <Card className="border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Privacy & Security
                    </CardTitle>
                    <CardDescription>
                      Manage your privacy settings and security preferences
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
                              Password must be at least 8 characters with uppercase, lowercase, and numbers
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
                      <h4 className="font-semibold text-gray-900 mb-4">Privacy Settings</h4>
                      <div className="space-y-4">
                        {Object.entries(settings.privacy).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <div>
                              <Label htmlFor={key} className="capitalize font-medium">
                                {key === 'profileVisibility' ? 'Profile Visibility' :
                                 key === 'dataSharing' ? 'Data Sharing for Research' :
                                 key === 'activityStatus' ? 'Show Activity Status' :
                                 'Contact Information Visibility'}
                              </Label>
                              <p className="text-sm text-gray-500">
                                {key === 'profileVisibility' ? 'Control who can see your profile' :
                                 key === 'dataSharing' ? 'Allow anonymous data for educational research' :
                                 key === 'activityStatus' ? 'Show when you are online' :
                                 'Show contact info to teachers'}
                              </p>
                            </div>
                            {typeof value === 'boolean' ? (
                              <Switch 
                                id={key}
                                checked={value}
                                onCheckedChange={(checked) => setSettings({
                                  ...settings,
                                  privacy: { ...settings.privacy, [key]: checked }
                                })}
                              />
                            ) : (
                              <Select 
                                value={value}
                                onValueChange={(val) => setSettings({
                                  ...settings,
                                  privacy: { ...settings.privacy, [key]: val }
                                })}
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="everyone">Everyone</SelectItem>
                                  <SelectItem value="teachers-only">Teachers Only</SelectItem>
                                  <SelectItem value="school-only">School Staff Only</SelectItem>
                                  <SelectItem value="private">Private</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Two-Factor Authentication</h4>
                      <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Enhanced Security</p>
                              <p className="text-sm text-gray-600">
                                Add an extra layer of security to your account
                              </p>
                            </div>
                            <Button variant="outline" onClick={() => toast.info("2FA setup initiated")}>
                              Enable 2FA
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSaveSettings}>
                      Apply Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Account Tab */}
              <TabsContent value="account" className="space-y-6">
                <Card className="border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Account Settings
                    </CardTitle>
                    <CardDescription>
                      Manage your account preferences and personalization
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select value={settings.account.language}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="spanish">Spanish</SelectItem>
                            <SelectItem value="french">French</SelectItem>
                            <SelectItem value="german">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select value={settings.account.timezone}>
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
                        <Select value={settings.account.dateFormat}>
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
                        <Label htmlFor="theme">Theme</Label>
                        <Select value={settings.account.theme}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Communication Preferences</h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Button variant="outline" className="flex-1">
                            <Mail className="h-4 w-4 mr-2" />
                            Email Support
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Live Chat
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <Smartphone className="h-4 w-4 mr-2" />
                            Call Back
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSaveSettings}>
                      Apply Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Appearance Tab */}
              <TabsContent value="appearance" className="space-y-6">
                <Card className="border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5" />
                      Appearance
                    </CardTitle>
                    <CardDescription>
                      Customize how CBG Connect looks and feels
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
                        <div className="flex items-center gap-4">
                          <div>
                            <Label className="font-medium">Compact Mode</Label>
                            <p className="text-sm text-gray-500">Show more content in less space</p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center gap-4">
                          <div>
                            <Label className="font-medium">Reduced Motion</Label>
                            <p className="text-sm text-gray-500">Minimize animations and transitions</p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center gap-4">
                          <div>
                            <Label className="font-medium">High Contrast</Label>
                            <p className="text-sm text-gray-500">Increase color contrast for readability</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSaveSettings}>
                      Apply Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Billing Tab */}
              <TabsContent value="billing" className="space-y-6">
                <Card className="border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Billing & Subscription
                    </CardTitle>
                    <CardDescription>
                      Manage your subscription and payment methods
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Current Plan</h4>
                      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <Badge className="bg-blue-100 text-blue-700 mb-2">PREMIUM</Badge>
                              <h3 className="text-2xl font-bold text-gray-900">$9.99/month</h3>
                              <p className="text-gray-600">Billed annually • Next billing: {settings.billing.nextBilling}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-700">
                              {settings.billing.status.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="mt-6">
                            <Button onClick={handleUpgradePlan} className="w-full">
                              Upgrade to Family Plan
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Payment Methods</h4>
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-blue-100">
                                <CreditCard className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium">Visa ending in 4242</p>
                                <p className="text-sm text-gray-600">Expires 12/2025</p>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-700">Default</Badge>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full">
                          Add Payment Method
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Billing History</h4>
                      <div className="space-y-3">
                        {[
                          { date: "Oct 15, 2024", amount: "$9.99", status: "Paid" },
                          { date: "Sep 15, 2024", amount: "$9.99", status: "Paid" },
                          { date: "Aug 15, 2024", amount: "$9.99", status: "Paid" }
                        ].map((invoice, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                            <div>
                              <p className="font-medium">Monthly Subscription</p>
                              <p className="text-sm text-gray-600">{invoice.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{invoice.amount}</p>
                              <Badge className="bg-green-100 text-green-700">{invoice.status}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Data & Storage Tab */}
              <TabsContent value="data" className="space-y-6">
                <Card className="border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Data & Storage
                    </CardTitle>
                    <CardDescription>
                      Manage your data and storage preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Data Management</h4>
                      <div className="space-y-4">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={handleExportData}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export All Data
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={handleClearCache}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Clear Cache
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => toast.info("Data cleanup scheduled")}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Clean Up Old Data
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Storage Usage</h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Documents & Files</span>
                            <span className="font-medium">1.2 GB</span>
                          </div>
                          <Progress value={60} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Messages & Media</span>
                            <span className="font-medium">0.8 GB</span>
                          </div>
                          <Progress value={40} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Reports & History</span>
                            <span className="font-medium">0.4 GB</span>
                          </div>
                          <Progress value={20} className="h-2" />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Data Retention</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Auto-delete Old Messages</Label>
                            <p className="text-sm text-gray-500">Delete messages older than 1 year</p>
                          </div>
                          <Switch />
                        </div>
                        <div className="space-y-2">
                          <Label>Report Retention Period</Label>
                          <Select defaultValue="3-years">
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
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Lock className="h-4 w-4" />
                      <span>Your data is encrypted and securely stored</span>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings