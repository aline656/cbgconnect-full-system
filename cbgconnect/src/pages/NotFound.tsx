import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Home, Search, ArrowRight, Ghost, Compass, Sparkles, ArrowLeft, AlertCircle, Navigation, Satellite } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const NotFound = () => {
  const navigate = useNavigate()

  const floatingElements = [
    { emoji: "🚀", style: "top-10 left-10" },
    { emoji: "✨", style: "top-20 right-20" },
    { emoji: "💫", style: "bottom-20 left-20" },
    { emoji: "🌌", style: "bottom-10 right-10" },
    { emoji: "🔭", style: "top-1/3 left-1/4" },
    { emoji: "📡", style: "top-1/4 right-1/3" },
  ]

  const quickLinks = [
    { label: "Home", path: "/", icon: <Home className="h-4 w-4" /> },
    { label: "Dashboard", path: "/dashboard", icon: <Compass className="h-4 w-4" /> },
    { label: "Profile", path: "/profile", icon: <Ghost className="h-4 w-4" /> },
  ]

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Soft Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30" />
        
        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(to right, #00000010 1px, transparent 1px),
              linear-gradient(to bottom, #00000010 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Floating Elements */}
        {floatingElements.map((element, index) => (
          <motion.div
            key={index}
            className={`absolute text-3xl ${element.style} opacity-10`}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: index * 0.5,
              ease: "easeInOut"
            }}
          >
            {element.emoji}
          </motion.div>
        ))}

        {/* Soft Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-100/40 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Error Code with Animation */}
          <motion.div
            className="relative inline-block mb-8"
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <div className="relative">
              <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                404
              </h1>
              <Sparkles className="absolute -top-4 -right-4 h-8 w-8 text-yellow-500 animate-spin-slow" />
              <Sparkles className="absolute -bottom-4 -left-4 h-8 w-8 text-cyan-500 animate-spin-slow" />
            </div>
          </motion.div>

          {/* Animated Ghost */}
          <motion.div
            className="mb-8"
            animate={{ 
              y: [0, -15, 0],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Ghost className="h-32 w-32 mx-auto text-purple-400" />
          </motion.div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
              Lost in Digital Space
            </span>
          </h2>

          {/* Description */}
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The page you're looking for seems to have drifted into the digital cosmos. 
            Let's navigate you back to familiar territory.
          </p>

          {/* Search Card */}
          <Card className="bg-white/80 backdrop-blur-lg border-gray-200/80 shadow-lg mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Navigation className="h-5 w-5 text-blue-600" />
                <p className="text-gray-700 font-medium">Where would you like to go?</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search our platform..." 
                    className="pl-10 bg-white/50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              onClick={() => navigate(-1)}
              variant="outline"
              className="bg-white/80 hover:bg-gray-100 text-gray-700 border-gray-300 group shadow-sm"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </Button>
            
            <Button
              size="lg"
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white group shadow-lg"
            >
              <Home className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Return Home
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Quick Links */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Popular Destinations</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {quickLinks.map((link) => (
                <Button
                  key={link.path}
                  variant="outline"
                  onClick={() => navigate(link.path)}
                  className="bg-white/70 hover:bg-gray-100/90 border-gray-300 text-gray-700 hover:text-gray-900 group shadow-sm"
                >
                  {link.icon}
                  <span className="ml-2">{link.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Help Card */}
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200/60 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Satellite className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-blue-800 mb-2">Navigation Assistance</h4>
                  <p className="text-gray-700 text-sm">
                    Even the best digital explorers need help sometimes! If you continue to encounter issues, 
                    our support team is ready to assist. Check your URL or use the search above to find what you're looking for.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50">
              <div className="text-2xl font-bold text-blue-600">99.9%</div>
              <div className="text-xs text-gray-600">Uptime</div>
            </div>
            <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50">
              <div className="text-2xl font-bold text-purple-600">24/7</div>
              <div className="text-xs text-gray-600">Support</div>
            </div>
            <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50">
              <div className="text-2xl font-bold text-cyan-600">10ms</div>
              <div className="text-xs text-gray-600">Response Time</div>
            </div>
            <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50">
              <div className="text-2xl font-bold text-green-600">SSL</div>
              <div className="text-xs text-gray-600">Secure</div>
            </div>
          </div>
        </motion.div>

        {/* Animated Dots */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gray-300 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 0.5, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-8 text-center text-gray-500 text-sm"
        >
          <p>© {new Date().getFullYear()} CBG Connect • Need help? <button className="text-blue-600 hover:text-blue-800">Contact Support</button></p>
          <div className="flex items-center justify-center gap-4 mt-2 text-xs">
            <span className="text-gray-400">Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-400">Session: {Date.now().toString(36)}</span>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 1,
        }}
      />

      {/* CSS Animations */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-pulse-soft {
          animation: pulse-soft 4s ease-in-out infinite;
        }
        
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        
        .animate-float-gentle {
          animation: float-gentle 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default NotFound