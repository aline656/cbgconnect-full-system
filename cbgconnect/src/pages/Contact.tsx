import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Send, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  CheckCircle,
  User,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Heart
} from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  department: z.string({
    required_error: "Please select a department",
  }),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
  urgency: z.enum(["low", "medium", "high"]),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must agree to our privacy policy",
  }),
  subscribe: z.boolean().optional(),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      department: "",
      subject: "",
      message: "",
      urgency: "medium",
      consent: false,
      subscribe: false,
    },
    mode: "onChange",
  })

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.success("Message Sent Successfully!", {
      description: "We'll get back to you within 24 hours. Thank you for reaching out!",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    })
    
    form.reset()
    setIsSubmitting(false)
  }

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email Support",
      details: "support@cbgconnect.com",
      description: "24/7 Email support",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Phone Number",
      details: "+1 (555) 123-4567",
      description: "Mon-Fri, 9AM-6PM EST",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Office Location",
      details: "123 Education St, Suite 400",
      description: "San Francisco, CA 94107",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Response Time",
      details: "Within 24 hours",
      description: "For all inquiries",
      color: "bg-amber-100 text-amber-600",
    },
  ]

  const departments = [
    { value: "general", label: "General Inquiry" },
    { value: "technical", label: "Technical Support" },
    { value: "billing", label: "Billing & Payments" },
    { value: "feedback", label: "Feedback & Suggestions" },
    { value: "partnership", label: "Partnership Opportunities" },
    { value: "press", label: "Press & Media" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Liquid-like floating blobs */}
        <motion.div
          className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-gradient-to-r from-blue-100/30 to-cyan-100/20 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-10 w-[600px] h-[600px] bg-gradient-to-r from-purple-100/20 to-pink-100/10 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        />
        
        {/* Animated dots */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-200 rounded-full"
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

      <div className="container relative mx-auto px-4 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200 hover:bg-blue-200">
            <Sparkles className="h-3 w-3 mr-2" />
            We're Here to Help
          </Badge>
          
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Get in Touch
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about CBG Connect? Our team is ready to assist you with 
            personalized support and expert guidance.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info Cards - Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/80 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Contact Information</CardTitle>
                <CardDescription>
                  Multiple ways to reach our dedicated support team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50/50 transition-colors">
                      <div className={`p-3 rounded-xl ${info.color}`}>
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{info.title}</h3>
                        <p className="text-gray-900 font-medium">{info.details}</p>
                        <p className="text-sm text-gray-500">{info.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Why Choose Us?</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Zap className="h-4 w-4 text-blue-500" />
                      <span>24/7 Support Availability</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>GDPR Compliant & Secure</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Heart className="h-4 w-4 text-pink-500" />
                      <span>Personalized Assistance</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/50">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
                  <p className="text-gray-700 font-medium">Customer Satisfaction</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Average response time: 2 hours
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form - Right Column */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-xl border-gray-300/50 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500" />
              
              <CardHeader className="pb-6">
                <CardTitle className="text-3xl">Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">
                              <User className="inline h-4 w-4 mr-2" />
                              Full Name *
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="John Doe" 
                                className="bg-white/50 border-gray-300 focus:border-blue-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">
                              <Mail className="inline h-4 w-4 mr-2" />
                              Email Address *
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="email"
                                placeholder="you@example.com" 
                                className="bg-white/50 border-gray-300 focus:border-blue-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">
                              <Phone className="inline h-4 w-4 mr-2" />
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="+1 (555) 000-0000" 
                                className="bg-white/50 border-gray-300 focus:border-blue-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">
                              Department *
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white/50 border-gray-300 focus:border-blue-500">
                                  <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {departments.map((dept) => (
                                  <SelectItem key={dept.value} value={dept.value}>
                                    {dept.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            Subject *
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Brief description of your inquiry" 
                              className="bg-white/50 border-gray-300 focus:border-blue-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="urgency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            Urgency Level
                          </FormLabel>
                          <div className="flex gap-4">
                            {[
                              { value: "low", label: "Low", color: "bg-green-100 text-green-700" },
                              { value: "medium", label: "Medium", color: "bg-amber-100 text-amber-700" },
                              { value: "high", label: "High", color: "bg-red-100 text-red-700" },
                            ].map((option) => (
                              <Button
                                key={option.value}
                                type="button"
                                variant={field.value === option.value ? "default" : "outline"}
                                className={`${
                                  field.value === option.value 
                                    ? option.color.replace("bg-", "bg-").replace("text-", "text-")
                                    : "border-gray-300"
                                }`}
                                onClick={() => field.onChange(option.value)}
                              >
                                {option.label}
                              </Button>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            <MessageSquare className="inline h-4 w-4 mr-2" />
                            Your Message *
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Please provide detailed information about your inquiry..."
                              className="min-h-[150px] bg-white/50 border-gray-300 focus:border-blue-500 resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="consent"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="border-gray-300 data-[state=checked]:bg-blue-600"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-gray-700">
                                I agree to the privacy policy and terms of service *
                              </FormLabel>
                              <p className="text-sm text-gray-500">
                                Your information is secure and will only be used to respond to your inquiry.
                              </p>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subscribe"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="border-gray-300 data-[state=checked]:bg-blue-600"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-gray-700">
                                Subscribe to our newsletter
                              </FormLabel>
                              <p className="text-sm text-gray-500">
                                Get updates about new features and educational resources.
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting || !form.formState.isValid}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg group"
                        size="lg"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                            Sending Message...
                          </>
                        ) : (
                          <>
                            Send Message
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                      
                      <p className="text-center text-sm text-gray-500 mt-4">
                        By submitting this form, you acknowledge that you have read and agree to our 
                        <a href="#" className="text-blue-600 hover:text-blue-800 ml-1">Privacy Policy</a>.
                      </p>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* FAQ Preview */}
            <Card className="mt-8 bg-white/80 backdrop-blur-sm border-gray-200/80">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Frequently Asked Questions
                  </h3>
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    View All FAQs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 rounded-lg bg-gray-50/50">
                    <p className="font-medium text-gray-900">How quickly will I receive a response?</p>
                    <p className="text-gray-600">Typically within 2-4 business hours.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50/50">
                    <p className="font-medium text-gray-900">Is my data secure?</p>
                    <p className="text-gray-600">Yes, we use enterprise-grade encryption.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact