import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  DollarSign,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  FileText,
  Target,
  Award,
  Clock,
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
    toast.success("Exporting analytics report...")
  }

  const handleRefreshData = () => {
    toast.info("Refreshing analytics data...")
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
                  <div className="h-64">
                    <div className="flex items-end h-48 gap-1">
                      {analyticsData.trends.enrollment.map((value, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg"
                            style={{ height: `${(value / 300) * 100}%` }}
                          />
                          <span className="text-xs text-gray-600 mt-2">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-4 text-sm">
                      <span className="text-gray-600">Total growth: +125 students</span>
                      <span className="font-medium text-green-600">+12.5% increase</span>
                    </div>
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
                  <div className="h-64">
                    <div className="flex items-end h-48 gap-1">
                      {analyticsData.trends.attendance.map((value, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-gradient-to-t from-green-500 to-emerald-500 rounded-t-lg"
                            style={{ height: `${value}%` }}
                          />
                          <span className="text-xs text-gray-600 mt-2">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-4 text-sm">
                      <span className="text-gray-600">Average: 94.2%</span>
                      <span className="font-medium text-green-600">Meeting target (95%)</span>
                    </div>
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

              {/* Revenue Trend */}
              <Card className="border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>
                    Monthly revenue growth
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <div className="flex items-end h-48 gap-1">
                      {analyticsData.trends.revenue.map((value, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg"
                            style={{ height: `${(value / 25000) * 100}%` }}
                          />
                          <span className="text-xs text-gray-600 mt-2">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-4 text-sm">
                      <span className="text-gray-600">Total: ${analyticsData.overview.revenue.toLocaleString()}</span>
                      <span className="font-medium text-green-600">+8.5% growth</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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