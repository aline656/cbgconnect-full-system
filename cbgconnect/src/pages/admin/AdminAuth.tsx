import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Shield,
  UserCog,
  Building,
  Key,
  CheckCircle,
  AlertCircle,
  Users,
  Database,
  Settings,
  BarChart3
} from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { api, setAuthToken } from "@/lib/api"

const adminLoginSchema = z.object({
  email: z.string().email("Enter a valid admin email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
})

const adminRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  adminCode: z.string().min(6, "Admin code is required"),
  password: z.string().min(12, "Password must be at least 12 characters"),
  confirmPassword: z.string().min(12, "Password must be at least 12 characters"),
  schoolName: z.string().min(3, "School name is required"),
  acceptTerms: z.boolean().refine((value) => value === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type AdminLoginValues = z.infer<typeof adminLoginSchema>
type AdminRegisterValues = z.infer<typeof adminRegisterSchema>

const AdminAuth = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const loginForm = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onChange",
  })

  const registerForm = useForm<AdminRegisterValues>({
    resolver: zodResolver(adminRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      adminCode: "",
      password: "",
      confirmPassword: "",
      schoolName: "",
      acceptTerms: false,
    },
    mode: "onChange",
  })

  const handleLogin = async (values: AdminLoginValues) => {
    try {
      const response = await api.post("/auth/login", {
        email: values.email,
        password: values.password,
      })

      const { token, user } = response.data

      // Only allow admin users
      if (user.role !== "admin") {
        toast.error("Access Denied", {
          description: "This portal is for administrators only",
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        })
        return
      }

      setAuthToken(token)
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('userRole', user.role)
      localStorage.setItem('userId', user.id)
      localStorage.setItem('adminName', user.name)
      
      toast.success("Admin Login Successful", {
        description: "Welcome to the Admin Dashboard",
        icon: <Shield className="h-5 w-5 text-green-500" />,
      })
      
      navigate("/admin")
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed"
      toast.error("Login Failed", {
        description: message,
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      })
    }
  }

  const handleRegister = async (values: AdminRegisterValues) => {
    try {
      // Check admin code (in real app, this would validate with backend)
      if (values.adminCode !== "ADMIN2024") {
        throw new Error("Invalid admin registration code")
      }
      
      const response = await api.post("/auth/register", {
        name: values.name,
        email: values.email,
        password: values.password,
        role: "admin",
        schoolName: values.schoolName,
        adminCode: values.adminCode
      })
      
      const { user } = response.data
      
      toast.success("Admin Registration Successful", {
        description: "Your admin account has been created",
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      })
      
      setActiveTab("login")
      registerForm.reset()
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed"
      toast.error("Registration Failed", {
        description: message,
      })
    }
  }

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "User Management",
      description: "Manage teachers, students, and parents"
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Data Analytics",
      description: "Comprehensive school performance insights"
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "System Configuration",
      description: "Full control over school settings"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Advanced Reports",
      description: "Generate detailed academic reports"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="h-8 w-8 text-blue-400" />
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                <span className="flex items-center gap-2">
                  <Key className="h-3 w-3" />
                  Admin Portal
                </span>
              </Badge>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                School Administration
              </span>
              <br />
              <span className="text-gray-200">Control Panel</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Complete administrative control over your educational institution. 
              Manage users, configure systems, and analyze performance.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Features Panel */}
            <div className="lg:col-span-1 space-y-8">
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Administrative Features</CardTitle>
                  <CardDescription className="text-gray-400">
                    Full control over your school's ecosystem
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start gap-4 p-3 rounded-lg bg-gray-900/30 border border-gray-700/30"
                    >
                      <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{feature.title}</h3>
                        <p className="text-sm text-gray-400">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Security Info */}
              <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-800/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-5 w-5 text-blue-400" />
                    <h3 className="font-semibold text-white">Enterprise Security</h3>
                  </div>
                  <ul className="space-y-3 text-sm text-gray-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>End-to-end encryption</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Role-based access control</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Audit logging</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>GDPR compliant</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Auth Card */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700/50 shadow-2xl">
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-white">
                        {activeTab === "login" ? "Admin Login" : "Register Admin Account"}
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        {activeTab === "login" 
                          ? "Access the administration dashboard" 
                          : "Create a new administrator account"}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="border-blue-500/50 text-blue-300">
                      <UserCog className="h-3 w-3 mr-2" />
                      Administrator
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <Tabs
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value as "login" | "register")}
                    className="space-y-6"
                  >
                    <TabsList className="grid w-full grid-cols-2 bg-gray-900/50">
                      <TabsTrigger 
                        value="login"
                        className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300"
                      >
                        Login
                      </TabsTrigger>
                      <TabsTrigger 
                        value="register"
                        className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300"
                      >
                        Register
                      </TabsTrigger>
                    </TabsList>

                    {/* Login Tab */}
                    <TabsContent value="login" className="space-y-6">
                      <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                          <FormField
                            control={loginForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Admin Email</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                      type="email"
                                      placeholder="admin@school.edu"
                                      className="pl-10 bg-gray-900/50 border-gray-700 text-white"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                      type={showLoginPassword ? "text" : "password"}
                                      placeholder="••••••••"
                                      className="pl-10 pr-10 bg-gray-900/50 border-gray-700 text-white"
                                      {...field}
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="absolute right-0 top-0 h-full px-3"
                                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                                    >
                                      {showLoginPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                      ) : (
                                        <Eye className="h-4 w-4 text-gray-400" />
                                      )}
                                    </Button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex items-center justify-between">
                            <FormField
                              control={loginForm.control}
                              name="rememberMe"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      className="border-gray-600 data-[state=checked]:bg-blue-500"
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm text-gray-400">
                                    Remember this device
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="link"
                              className="text-sm text-blue-400 hover:text-blue-300 p-0"
                              onClick={() => toast.info("Contact system administrator")}
                            >
                              Forgot password?
                            </Button>
                          </div>

                          <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                            disabled={loginForm.formState.isSubmitting}
                          >
                            {loginForm.formState.isSubmitting ? (
                              <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                                Authenticating...
                              </>
                            ) : (
                              <>
                                <Shield className="h-4 w-4 mr-2" />
                                Login to Admin Panel
                              </>
                            )}
                          </Button>
                        </form>
                      </Form>

                      <Separator className="bg-gray-700" />

                      <div className="text-center">
                        <p className="text-sm text-gray-400">
                          Need help?{" "}
                          <Button
                            variant="link"
                            className="text-blue-400 hover:text-blue-300 p-0"
                            onClick={() => toast.info("Contact system administrator")}
                          >
                            Contact System Administrator
                          </Button>
                        </p>
                      </div>
                    </TabsContent>

                    {/* Register Tab */}
                    <TabsContent value="register" className="space-y-6">
                      <Form {...registerForm}>
                        <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={registerForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-300">Full Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="John Doe"
                                      className="bg-gray-900/50 border-gray-700 text-white"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={registerForm.control}
                              name="schoolName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-300">School Name</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                      <Input
                                        placeholder="Your School Name"
                                        className="pl-10 bg-gray-900/50 border-gray-700 text-white"
                                        {...field}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={registerForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Email Address</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                      type="email"
                                      placeholder="admin@school.edu"
                                      className="pl-10 bg-gray-900/50 border-gray-700 text-white"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={registerForm.control}
                            name="adminCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Admin Registration Code</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                      placeholder="Enter admin code"
                                      className="pl-10 bg-gray-900/50 border-gray-700 text-white"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                                <p className="text-xs text-gray-400">
                                  Contact existing admin for registration code
                                </p>
                              </FormItem>
                            )}
                          />

                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={registerForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-300">Password</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                      <Input
                                        type={showRegisterPassword ? "text" : "password"}
                                        placeholder="••••••••••••"
                                        className="pl-10 pr-10 bg-gray-900/50 border-gray-700 text-white"
                                        {...field}
                                      />
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3"
                                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                                      >
                                        {showRegisterPassword ? (
                                          <EyeOff className="h-4 w-4 text-gray-400" />
                                        ) : (
                                          <Eye className="h-4 w-4 text-gray-400" />
                                        )}
                                      </Button>
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={registerForm.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-300">Confirm Password</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                      <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••••••"
                                        className="pl-10 pr-10 bg-gray-900/50 border-gray-700 text-white"
                                        {...field}
                                      />
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                      >
                                        {showConfirmPassword ? (
                                          <EyeOff className="h-4 w-4 text-gray-400" />
                                        ) : (
                                          <Eye className="h-4 w-4 text-gray-400" />
                                        )}
                                      </Button>
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={registerForm.control}
                            name="acceptTerms"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-gray-700 bg-gray-900/30 p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="border-gray-600 data-[state=checked]:bg-blue-500"
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="text-gray-300">
                                    I agree to the administrator terms and conditions
                                  </FormLabel>
                                  <p className="text-sm text-gray-400">
                                    By registering, you agree to comply with all administrative policies
                                    and maintain the confidentiality of sensitive information.
                                  </p>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                            disabled={registerForm.formState.isSubmitting}
                          >
                            {registerForm.formState.isSubmitting ? (
                              <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                                Creating Account...
                              </>
                            ) : (
                              <>
                                <UserCog className="h-4 w-4 mr-2" />
                                Register Admin Account
                              </>
                            )}
                          </Button>
                        </form>
                      </Form>

                      <div className="text-center">
                        <p className="text-sm text-gray-400">
                          Already have an account?{" "}
                          <Button
                            variant="link"
                            className="text-blue-400 hover:text-blue-300 p-0"
                            onClick={() => setActiveTab("login")}
                          >
                            Login here
                          </Button>
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>

                <CardFooter className="border-t border-gray-700/50 pt-6">
                  <div className="w-full text-center">
                    <p className="text-xs text-gray-500">
                      <Shield className="inline h-3 w-3 mr-1" />
                      Secure administrative access only. All activities are logged and monitored.
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAuth