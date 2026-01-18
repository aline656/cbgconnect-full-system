import { motion } from "framer-motion"
import { 
  Users, 
  BookOpen, 
  Shield, 
  MessageSquare, 
  Bell, 
  Calendar, 
  TrendingUp, 
  CheckCircle,
  Award,
  Clock,
  Zap,
  HeartHandshake,
  FileText,
  ChartBar,
  Smartphone,
  Lock,
  Sparkles,
  Star,
  Target,
  GraduationCap,
  UserCheck,
  School,
  Feather,
  UserCircle,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const LandingPage = () => {
  const features = [
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Real-time Communication",
      description: "Instant messaging between teachers, parents, and students"
    },
    {
      icon: <Bell className="h-8 w-8" />,
      title: "Smart Notifications",
      description: "Get alerts for grades, attendance, and important announcements"
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Shared Calendar",
      description: "Track assignments, exams, and school events in one place"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure Platform",
      description: "End-to-end encrypted with role-based access control"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Progress Tracking",
      description: "Monitor academic performance with detailed analytics"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Digital Documents",
      description: "Access report cards, assignments, and school forms online"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Parent",
      content: "CBG Connect has transformed how I stay involved in my child's education. The real-time updates are incredible!",
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Teacher",
      content: "Streamlines communication with parents and reduces administrative work by 50%. Highly recommend!",
      avatar: "MC"
    },
    {
      name: "David Rodriguez",
      role: "School Administrator",
      content: "The analytics dashboard has given us unprecedented insights into student performance patterns.",
      avatar: "DR"
    },
    {
      name: "Emily Wilson",
      role: "Student",
      content: "Love having all my assignments and grades in one app. Makes staying organized so much easier!",
      avatar: "EW"
    }
  ]

  const stats = [
    { value: "10K+", label: "Active Students", icon: <GraduationCap className="h-5 w-5" /> },
    { value: "2K+", label: "Connected Parents", icon: <Feather className="h-5 w-5" /> },
    { value: "500+", label: "Engaged Teachers", icon: <UserCheck className="h-5 w-5" /> },
    { value: "100+", label: "Partner Schools", icon: <School className="h-5 w-5" /> }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-100/50 rounded-full blur-3xl" />
        
        <div className="container relative mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
                <Sparkles className="h-3 w-3 mr-2" />
                Transforming Education Together
              </Badge>
              
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CBG Connect
                </span>
                <br />
                <span className="text-gray-900">Where Education Meets</span>
                <span className="text-blue-600"> Connection</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
                The revolutionary platform connecting students, parents, teachers, and administrators 
                in one seamless ecosystem. Experience education like never before.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-gray-300">
                  <Zap className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-gray-200 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-3">
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                          {stat.icon}
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                      <p className="text-gray-600">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools designed specifically for every member of the educational community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-blue-200">
                  <CardContent className="p-8">
                    <div className="p-3 rounded-xl bg-blue-100 text-blue-600 w-fit mb-6">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stakeholders Section */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for Everyone in Education
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored experiences for each role in the educational ecosystem
            </p>
          </div>

          <Tabs defaultValue="students" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100">
              <TabsTrigger value="students" className="data-[state=active]:bg-white">
                <UserCircle className="h-4 w-4 mr-2" />
                Students
              </TabsTrigger>
              <TabsTrigger value="parents" className="data-[state=active]:bg-white">
                <Feather className="h-4 w-4 mr-2" />
                Parents
              </TabsTrigger>
              <TabsTrigger value="teachers" className="data-[state=active]:bg-white">
                <UserCheck className="h-4 w-4 mr-2" />
                Teachers
              </TabsTrigger>
              <TabsTrigger value="admins" className="data-[state=active]:bg-white">
                <School className="h-4 w-4 mr-2" />
                Administrators
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="students" className="mt-8">
              <Card className="border-gray-200">
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Student Dashboard
                      </h3>
                      <ul className="space-y-4">
                        {[
                          "Track assignments and deadlines",
                          "Monitor grades and progress",
                          "Access learning materials",
                          "Communicate with teachers",
                          "Join study groups",
                          "Set academic goals"
                        ].map((item, i) => (
                          <li key={i} className="flex items-center text-gray-700">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-8">
                      <div className="text-center">
                        <BookOpen className="h-24 w-24 mx-auto text-blue-600 mb-6" />
                        <p className="text-gray-700 font-medium">
                          Your academic journey, simplified
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="parents" className="mt-8">
              <Card className="border-gray-200">
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Parent Portal
                      </h3>
                      <ul className="space-y-4">
                        {[
                          "Real-time grade monitoring",
                          "Attendance tracking",
                          "Direct teacher communication",
                          "Fee payment portal",
                          "Event calendar",
                          "Progress reports"
                        ].map((item, i) => (
                          <li key={i} className="flex items-center text-gray-700">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8">
                      <div className="text-center">
                        <HeartHandshake className="h-24 w-24 mx-auto text-purple-600 mb-6" />
                        <p className="text-gray-700 font-medium">
                          Stay connected with your child's education
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teachers" className="mt-8">
              <Card className="border-gray-200">
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Teacher Workspace
                      </h3>
                      <ul className="space-y-4">
                        {[
                          "Grade management system",
                          "Assignment creation & distribution",
                          "Parent communication log",
                          "Attendance recording",
                          "Lesson planning tools",
                          "Student progress analytics"
                        ].map((item, i) => (
                          <li key={i} className="flex items-center text-gray-700">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-8">
                      <div className="text-center">
                        <Award className="h-24 w-24 mx-auto text-green-600 mb-6" />
                        <p className="text-gray-700 font-medium">
                          Empower your teaching with smart tools
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admins" className="mt-8">
              <Card className="border-gray-200">
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Admin Dashboard
                      </h3>
                      <ul className="space-y-4">
                        {[
                          "School-wide analytics",
                          "User management system",
                          "Financial tracking",
                          "Report generation",
                          "Policy management",
                          "Compliance monitoring"
                        ].map((item, i) => (
                          <li key={i} className="flex items-center text-gray-700">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl p-8">
                      <div className="text-center">
                        <ChartBar className="h-24 w-24 mx-auto text-orange-600 mb-6" />
                        <p className="text-gray-700 font-medium">
                          Comprehensive school management solutions
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Educational Communities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our users are saying about their CBG Connect experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-gray-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                        {testimonial.avatar}
                      </div>
                      <div className="ml-4">
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-blue-600">{testimonial.role}</div>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 italic">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Transform Your Educational Experience?
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Join thousands of schools already using CBG Connect to build stronger educational communities.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Smartphone className="mr-2 h-5 w-5" />
                  Download Mobile App
                </Button>
              </div>
              
              <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-blue-100">
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Enterprise-grade security
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  24/7 Support
                </div>
                <div className="flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Data privacy guaranteed
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage