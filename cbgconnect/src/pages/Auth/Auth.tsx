import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, Lock, User, Eye, EyeOff, Shield, Zap, CheckCircle } from "lucide-react"
import { z } from "zod"
import { toast } from "sonner"

import { setAuthToken } from "@/lib/api"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api"

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
})

const roles = ["teacher", "parent", "secretary", "metron", "patron"] as const

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    role: z.enum(roles, {
      required_error: "Please select a role",
    }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
    acceptTerms: z.boolean().refine((value) => value === true, {
      message: "You must accept the terms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type LoginValues = z.infer<typeof loginSchema>
type RegisterValues = z.infer<typeof registerSchema>

function Auth() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false)

  const getDashboardPathForRole = (role: unknown) => {
    const r = typeof role === "string" ? role : ""
    const mapping: Record<string, string> = {
      parent: "/parent",
      secretary: "/secretary",
      teacher: "/teacher",
      metron: "/metron",
      patron: "/patron",
      admin: "/admin",
    }
    return mapping[r] ?? "/"
  }

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onChange",
  })

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "parent",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    mode: "onChange",
  })

  const handleLoginSubmit = async (values: LoginValues) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, values)

      if (response.data?.token) {
        setAuthToken(String(response.data.token))
      }

      toast.success("Signed in", {
        description: `Welcome back, ${response.data.user.name}`,
      })

      navigate(getDashboardPathForRole(response.data?.user?.role))
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error("Sign in failed", {
          description: String(error.response.data?.message ?? "Invalid email or password"),
        })
      } else {
        toast.error("Sign in failed", {
          description: "Unexpected error. Please try again.",
        })
      }
    }
  }

  const handleRegisterSubmit = async (values: RegisterValues) => {
    try {
      const { name, email, password, role } = values

      await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password,
        role,
      })

      toast.success("Account created", {
        description: "Your account has been created. You can now sign in.",
      })

      setActiveTab("login")
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error("Sign up failed", {
          description: String(error.response.data?.message ?? "Unable to create account"),
        })
      } else {
        toast.error("Sign up failed", {
          description: "Unexpected error. Please try again.",
        })
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-100/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-100/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-100/20 blur-3xl" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #64748b 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
        <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Column - Welcome Content */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-blue-700 shadow-lg backdrop-blur-sm border border-blue-200/50">
                <Shield className="h-4 w-4" />
                Secure Authentication Portal
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Welcome to <span className="text-blue-600">CBG Connect</span>
              </h1>
              
              <p className="text-lg text-gray-600 max-w-2xl">
                Access your professional dashboard or create a new account to join our platform. 
                Enterprise-grade security meets elegant design.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="rounded-2xl bg-white/60 p-6 backdrop-blur-sm border border-gray-200/50 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">Advanced Security</h3>
                    <p className="text-gray-600">
                      End-to-end encryption and secure authentication powered by industry standards.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white/60 p-6 backdrop-blur-sm border border-gray-200/50 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">Lightning Fast</h3>
                    <p className="text-gray-600">
                      Seamless experience with instant form validation and real-time feedback.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white/60 p-6 backdrop-blur-sm border border-gray-200/50 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">Reliable Validation</h3>
                    <p className="text-gray-600">
                      Built with Zod and React Hook Form for robust form handling and validation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              <p>Trusted by professionals worldwide • 99.9% Uptime • GDPR Compliant</p>
            </div>
          </div>

          {/* Right Column - Auth Card */}
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-gray-300/50 shadow-2xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-1 shadow-lg">
                  <div className="rounded-full bg-white p-1">
                    <Lock className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <CardHeader className="pt-8 text-center">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {activeTab === "login" ? "Welcome Back" : "Join Our Platform"}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {activeTab === "login" 
                    ? "Sign in to continue to your dashboard" 
                    : "Create your account in seconds"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <Tabs
                  value={activeTab}
                  onValueChange={(value) => setActiveTab(value as "login" | "register")}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100/50 p-1">
                    <TabsTrigger 
                      value="login"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600"
                    >
                      Login
                    </TabsTrigger>
                    <TabsTrigger 
                      value="register"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600"
                    >
                      Register
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-4 mt-6">
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                  <Input
                                    placeholder="you@example.com"
                                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                              <FormLabel className="text-gray-700">Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                  <Input
                                    type={showLoginPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    {...field}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                  >
                                    {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                  </button>
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
                                    className="border-gray-300 data-[state=checked]:bg-blue-600"
                                  />
                                </FormControl>
                                <FormLabel className="text-sm text-gray-600">
                                  Remember me
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                          <Button variant="link" className="text-blue-600 hover:text-blue-800 text-sm p-0">
                            Forgot password?
                          </Button>
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                          disabled={loginForm.formState.isSubmitting}
                        >
                          {loginForm.formState.isSubmitting ? "Signing in..." : "Sign In"}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>

                  <TabsContent value="register" className="space-y-4 mt-6">
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-4">
                        <FormField
                          control={registerForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Full Name</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                  <Input
                                    placeholder="John Doe"
                                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                  <Input
                                    placeholder="you@example.com"
                                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Role</FormLabel>
                              <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                    <SelectValue placeholder="Select your role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {roles.map((r) => (
                                      <SelectItem key={r} value={r}>
                                        {r}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                  <Input
                                    type={showRegisterPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    {...field}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                  >
                                    {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                  </button>
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
                              <FormLabel className="text-gray-700">Confirm Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                  <Input
                                    type={showRegisterConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    {...field}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                  >
                                    {showRegisterConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registerForm.control}
                          name="acceptTerms"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-200 bg-gray-50/50 p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="mt-0.5 border-gray-300 data-[state=checked]:bg-blue-600"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-gray-700 font-medium">
                                  I agree to the Terms of Service and Privacy Policy
                                </FormLabel>
                                <p className="text-sm text-gray-500">
                                  By creating an account, you confirm that you've read and accepted our terms.
                                </p>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                          disabled={registerForm.formState.isSubmitting}
                        >
                          {registerForm.formState.isSubmitting ? "Creating account..." : "Create Account"}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>

                <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
                  <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth