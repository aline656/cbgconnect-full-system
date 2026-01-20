import { useState } from "react"
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Download,
  RefreshCw,
  Target,
  Award,
  Activity
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

// Simple chart component for line charts
const LineChart = ({ data, color = "text-blue-500" }: { data: number[], color?: string }) => {
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const range = maxValue - minValue || 1
  
  return (
    <svg className="w-full h-48" viewBox="0 0 400 150" preserveAspectRatio="xMidYMid meet">
      {/* Grid lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={`grid-h-${i}`} x1="0" y1={i * 30} x2="400" y2={i * 30} stroke="#e5e7eb" strokeWidth="1" />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line key={`grid-v-${i}`} x1={i * 80} y1="0" x2={i * 80} y2="150" stroke="#e5e7eb" strokeWidth="1" />
      ))}
      
      {/* Line path */}
      <polyline
        points={data.map((val, idx) => {
          const x = (idx / (data.length - 1)) * 400
          const y = 150 - ((val - minValue) / range) * 140
          return `${x},${y}`
        }).join(' ')}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={color}
      />
      
      {/* Data points */}
      {data.map((val, idx) => {
        const x = (idx / (data.length - 1)) * 400
        const y = 150 - ((val - minValue) / range) * 140
        return (
          <circle key={`point-${idx}`} cx={x} cy={y} r="4" fill="white" stroke="currentColor" strokeWidth="2" className={color} />
        )
      })}
    </svg>
  )
}

// Simple pie chart component
const PieChartComponent = ({ data, colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"] }: { data: { label: string, value: number }[], colors?: string[] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let startAngle = -Math.PI / 2
  
  return (
    <svg className="w-full h-48" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
      {data.map((item, idx) => {
        const sliceAngle = (item.value / total) * 2 * Math.PI
        const endAngle = startAngle + sliceAngle
        
        const x1 = 100 + 80 * Math.cos(startAngle)
        const y1 = 100 + 80 * Math.sin(startAngle)
        const x2 = 100 + 80 * Math.cos(endAngle)
        const y2 = 100 + 80 * Math.sin(endAngle)
        
        const largeArc = sliceAngle > Math.PI ? 1 : 0
        const pathData = [
          `M 100 100`,
          `L ${x1} ${y1}`,
          `A 80 80 0 ${largeArc} 1 ${x2} ${y2}`,
          'Z'
        ].join(' ')
        
        startAngle = endAngle
        
        return (
          <path key={idx} d={pathData} fill={colors[idx % colors.length]} opacity="0.8" />
        )
      })}
      
      {/* Center circle for donut effect */}
      <circle cx="100" cy="100" r="50" fill="white" />
    </svg>
  )
}

const Analytics = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("monthly")

  const analyticsData = {
    overview: {
      totalStudents: 1250,
      activeStudents: 1185,
      attendanceRate: 94.8,
      avgGrade: 85.2,
      revenue: 125430,
      growthRate: 12.5
    },
    trends: {
      enrollment: [120, 135, 142, 150, 165, 180, 195, 210, 225, 240, 255, 270],
      attendance: [92, 93, 94, 95, 94, 93, 94, 95, 96, 95, 94, 95],
      performance: [82, 83, 84, 85, 86, 85, 86, 87, 88, 87, 86, 87],
      revenue: [9500, 10500, 11200, 12500, 13500, 14200, 15500, 16500, 17200, 18500, 19200, 21000]
    },
    performance: {
      subjects: [
        { name: "Mathematics", avg: 88, improvement: 5 },
        { name: "Science", avg: 85, improvement: 3 },
        { name: "English", avg: 82, improvement: 2 },
        { name: "History", avg: 78, improvement: 4 },
        { name: "Art", avg: 92, improvement: 6 }
      ],
      grades: [
        { grade: "Grade 5", avg: 86, students: 320 },
        { grade: "Grade 6", avg: 84, students: 310 },
        { grade: "Grade 7", avg: 82, students: 315 },
        { grade: "Grade 8", avg: 80, students: 305 }
      ]
    },
    financial: {
      totalRevenue: 125430,
      collected: 112887,
      pending: 12543,
      expenses: 85430,
      profit: 40000,
      collectionRate: 90
    }
  }

  const handleExportReport = () => {
    let csv = "Analytics Report - CBG International School\n"
    csv += `Generated: ${new Date().toISOString()}\n\n`
    
    // Overview data
    csv += "OVERVIEW METRICS\n"
    csv += "Metric,Value\n"
    csv += `Total Students,${analyticsData.overview.totalStudents}\n`
    csv += `Active Students,${analyticsData.overview.activeStudents}\n`
    csv += `Attendance Rate,${analyticsData.overview.attendanceRate}%\n`
    csv += `Average Grade,${analyticsData.overview.avgGrade}%\n`
    csv += `Total Revenue,${analyticsData.overview.revenue}\n`
    csv += `Growth Rate,${analyticsData.overview.growthRate}%\n\n`
    
    // Performance data
    csv += "SUBJECT PERFORMANCE\n"
    csv += "Subject,Average,Improvement\n"
    analyticsData.performance.subjects.forEach(subject => {
      csv += `"${subject.name}",${subject.avg},+${subject.improvement}%\n`
    })
    csv += "\n"
    
    // Financial data
    csv += "FINANCIAL SUMMARY\n"
    csv += "Category,Amount\n"
    csv += `Total Revenue,${analyticsData.financial.totalRevenue}\n`
    csv += `Collected,${analyticsData.financial.collected}\n`
    csv += `Pending,${analyticsData.financial.pending}\n`
    csv += `Expenses,${analyticsData.financial.expenses}\n`
    csv += `Profit,${analyticsData.financial.profit}\n`
    csv += `Collection Rate,${analyticsData.financial.collectionRate}%\n`
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast.success('Analytics report exported successfully!')
  }

  const handleRefreshData = () => {
    toast.info('Refreshing analytics data...')
    setTimeout(() => {
      toast.success('Data refreshed successfully!')
    }, 1000)
  }

  const getTrendColor = (value: number) => {
    return value >= 0 ? "text-green-600" : "text-red-600"
  }

  const getTrendIcon = (value: number) => {
    return value >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Advanced analytics and performance insights</p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline"
                onClick={handleExportReport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button 
                onClick={handleRefreshData}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <div className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalStudents}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(analyticsData.overview.growthRate)}
                    <span className={`text-sm font-medium ${getTrendColor(analyticsData.overview.growthRate)}`}>
                      +{analyticsData.overview.growthRate}%
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Attendance Rate</p>
                  <div className="text-2xl font-bold text-gray-900">{analyticsData.overview.attendanceRate}%</div>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">+2.3%</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <Activity className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Grade</p>
                  <div className="text-2xl font-bold text-gray-900">{analyticsData.overview.avgGrade}%</div>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">+1.8%</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                  <Award className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <div className="text-2xl font-bold text-gray-900">${analyticsData.overview.revenue.toLocaleString()}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">+8.5%</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Financial
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trends
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Enrollment Trend */}
              <Card className="border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle>Enrollment Trend</CardTitle>
                  <CardDescription>
                    Monthly student enrollment growth
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChart data={analyticsData.trends.enrollment} color="text-blue-500" />
                  <div className="flex items-center justify-between mt-4 text-sm">
                    <span className="text-gray-600">Total growth: +125 students</span>
                    <span className="font-medium text-green-600">+12.5% increase</span>
                  </div>
                </CardContent>
              </Card>

              {/* Attendance Trend */}
              <Card className="border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle>Attendance Trend</CardTitle>
                  <CardDescription>
                    Monthly attendance rate percentage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChart data={analyticsData.trends.attendance} color="text-green-500" />
                  <div className="flex items-center justify-between mt-4 text-sm">
                    <span className="text-gray-600">Average: 94.2%</span>
                    <span className="font-medium text-green-600">Meeting target (95%)</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Metrics */}
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {analyticsData.overview.activeStudents}/{analyticsData.overview.totalStudents}
                    </div>
                    <p className="text-gray-600">Active Students</p>
                    <Progress value={94} className="h-2 mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">98%</div>
                    <p className="text-gray-600">Parent Satisfaction</p>
                    <p className="text-sm text-gray-500">Based on surveys</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
                    <p className="text-gray-600">System Uptime</p>
                    <p className="text-sm text-gray-500">Last 30 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Subject Performance */}
              <Card className="border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle>Subject Performance</CardTitle>
                  <CardDescription>
                    Average grades by subject with improvement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {analyticsData.performance.subjects.map((subject, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{subject.name}</h4>
                            <p className="text-sm text-gray-600">Average: {subject.avg}%</p>
                          </div>
                          <Badge className="bg-green-100 text-green-700">
                            +{subject.improvement}%
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                              style={{ width: `${subject.avg}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{subject.avg}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Grade-wise Performance */}
              <Card className="border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle>Grade-wise Performance</CardTitle>
                  <CardDescription>
                    Average performance by grade level
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {analyticsData.performance.grades.map((grade, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{grade.grade}</h4>
                            <p className="text-sm text-gray-600">{grade.students} students</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">{grade.avg}%</div>
                            <div className={`text-sm ${grade.avg >= 85 ? 'text-green-600' : 'text-amber-600'}`}>
                              {grade.avg >= 85 ? 'Excellent' : 'Good'}
                            </div>
                          </div>
                        </div>
                        <Progress value={grade.avg} className="h-2" />
                      </div>
                    ))}
                  </div>
                  <Separator className="my-6" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      Overall: {analyticsData.overview.avgGrade}%
                    </div>
                    <p className="text-gray-600">School-wide Average</p>
                    <Badge className="mt-2 bg-green-100 text-green-700">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +1.8% from last term
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Financial Overview */}
              <Card className="border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle>Financial Overview</CardTitle>
                  <CardDescription>
                    Revenue, expenses, and profit analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-green-50">
                        <div className="text-2xl font-bold text-green-600">
                          ${analyticsData.financial.collected.toLocaleString()}
                        </div>
                        <p className="text-gray-600">Collected</p>
                      </div>
                      <div className="p-4 rounded-xl bg-amber-50">
                        <div className="text-2xl font-bold text-amber-600">
                          ${analyticsData.financial.pending.toLocaleString()}
                        </div>
                        <p className="text-gray-600">Pending</p>
                      </div>
                      <div className="p-4 rounded-xl bg-red-50">
                        <div className="text-2xl font-bold text-red-600">
                          ${analyticsData.financial.expenses.toLocaleString()}
                        </div>
                        <p className="text-gray-600">Expenses</p>
                      </div>
                      <div className="p-4 rounded-xl bg-blue-50">
                        <div className="text-2xl font-bold text-blue-600">
                          ${analyticsData.financial.profit.toLocaleString()}
                        </div>
                        <p className="text-gray-600">Profit</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Collection Rate</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Target: 95%</span>
                          <span className="font-medium">{analyticsData.financial.collectionRate}%</span>
                        </div>
                        <Progress value={analyticsData.financial.collectionRate} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Distribution */}
              <Card className="border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle>Revenue Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of revenue sources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <PieChartComponent 
                      data={[
                        { label: "Tuition Fees", value: 85000 },
                        { label: "Activity Fees", value: 15000 },
                        { label: "Transport", value: 12000 },
                        { label: "Misc", value: 13430 }
                      ]}
                    />
                    <div className="mt-6 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Tuition Fees</span>
                        <Badge className="bg-blue-100 text-blue-700">68%</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Activity Fees</span>
                        <Badge className="bg-green-100 text-green-700">12%</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Transport</span>
                        <Badge className="bg-amber-100 text-amber-700">10%</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Miscellaneous</span>
                        <Badge className="bg-purple-100 text-purple-700">10%</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Trend */}
            <Card className="mt-8 border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>
                  Monthly revenue growth pattern
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart data={analyticsData.trends.revenue.map(v => v / 1000)} color="text-purple-500" />
                <div className="flex items-center justify-between mt-4 text-sm">
                  <span className="text-gray-600">Total: ${analyticsData.overview.revenue.toLocaleString()}</span>
                  <span className="font-medium text-green-600">+8.5% growth</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends">
            <Card className="border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>
                  Year-over-year comparison of key metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: "Student Growth", current: 1250, previous: 1115, change: 12.1 },
                    { label: "Attendance Rate", current: 94.8, previous: 92.5, change: 2.3 },
                    { label: "Academic Performance", current: 85.2, previous: 83.4, change: 1.8 },
                    { label: "Revenue Growth", current: 125430, previous: 115500, change: 8.5 }
                  ].map((metric, index) => (
                    <Card key={index} className="border-gray-200">
                      <CardContent className="p-6">
                        <p className="text-sm text-gray-600">{metric.label}</p>
                        <div className="text-2xl font-bold text-gray-900 mt-2">
                          {typeof metric.current === 'number' && metric.current > 1000 
                            ? `$${metric.current.toLocaleString()}`
                            : metric.current}
                          {typeof metric.current === 'number' && metric.current <= 100 && !metric.label.includes('Rate') ? '%' : ''}
                          {metric.label.includes('Rate') ? '%' : ''}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {getTrendIcon(metric.change)}
                          <span className={`text-sm font-medium ${getTrendColor(metric.change)}`}>
                            +{metric.change}%
                          </span>
                          <span className="text-sm text-gray-500">from last year</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Comparative Analysis */}
            <Card className="mt-8 border-gray-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Comparative Analysis</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 rounded-xl bg-blue-50">
                    <Target className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                    <div className="text-lg font-bold text-gray-900">Top 10%</div>
                    <p className="text-gray-600">National Ranking</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-green-50">
                    <Award className="h-8 w-8 text-green-500 mx-auto mb-3" />
                    <div className="text-lg font-bold text-gray-900">+15%</div>
                    <p className="text-gray-600">Above District Average</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-purple-50">
                    <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                    <div className="text-lg font-bold text-gray-900">98%</div>
                    <p className="text-gray-600">Parent Satisfaction</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Analytics