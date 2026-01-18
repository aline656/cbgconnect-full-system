import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { 
  FileText, 
  Download, 
  Printer, 
  Share2, 
  Calendar, 
  TrendingUp,
  TrendingDown,
  BarChart3,
  ArrowLeft,
  Clock,
  Award,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { toast } from "sonner"

import { api } from "@/lib/api"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type ReportSubject = {
  name: string
  grade: string
  progress: number
  teacher: string
}

type TeacherComment = {
  teacher: string
  subject: string
  comment: string
  date: string
}

type ReportData = {
  name: string
  grade: string
  teacher: string
  period: string
  attendance: {
    total: number
    present: number
    absent: number
    percentage: number
  }
  grades: {
    overall: string
    subjects: ReportSubject[]
  }
  assignments: {
    total: number
    completed: number
    pending: number
    late: number
  }
  behavior: Array<{ type: string; count: number; last: string }>
  teacherComments: TeacherComment[]
}

// Mock data for reports
const mockReportData = {
  1: { // Emily
    name: "Emily Johnson",
    grade: "Grade 5",
    teacher: "Mr. Wilson",
    period: "Fall 2024",
    attendance: {
      total: 45,
      present: 43,
      absent: 2,
      percentage: 95.6
    },
    grades: {
      overall: "A-",
      subjects: [
        { name: "Mathematics", grade: "A", progress: 92, teacher: "Mr. Wilson" },
        { name: "Science", grade: "B+", progress: 88, teacher: "Ms. Chen" },
        { name: "English", grade: "A-", progress: 90, teacher: "Mr. Davis" },
        { name: "History", grade: "B", progress: 85, teacher: "Mrs. Taylor" },
        { name: "Art", grade: "A", progress: 94, teacher: "Ms. Garcia" },
        { name: "Physical Education", grade: "A", progress: 96, teacher: "Coach Smith" }
      ]
    },
    assignments: {
      total: 24,
      completed: 22,
      pending: 2,
      late: 0
    },
    behavior: [
      { type: "Positive", count: 12, last: "2 days ago" },
      { type: "Needs Improvement", count: 2, last: "1 week ago" },
      { type: "Excellent", count: 8, last: "Yesterday" }
    ],
    teacherComments: [
      {
        teacher: "Mr. Wilson",
        subject: "Mathematics",
        comment: "Emily shows excellent problem-solving skills. She actively participates in class discussions.",
        date: "Oct 15, 2024"
      },
      {
        teacher: "Ms. Chen",
        subject: "Science",
        comment: "Great improvement in laboratory work. Shows curiosity and asks thoughtful questions.",
        date: "Oct 10, 2024"
      }
    ]
  },
  2: { // Michael
    name: "Michael Johnson",
    grade: "Grade 7",
    teacher: "Ms. Rodriguez",
    period: "Fall 2024",
    attendance: {
      total: 45,
      present: 44,
      absent: 1,
      percentage: 97.8
    },
    grades: {
      overall: "B+",
      subjects: [
        { name: "Mathematics", grade: "B+", progress: 87, teacher: "Ms. Rodriguez" },
        { name: "Science", grade: "A-", progress: 91, teacher: "Dr. Miller" },
        { name: "English", grade: "B", progress: 84, teacher: "Mrs. Anderson" },
        { name: "History", grade: "C+", progress: 78, teacher: "Mr. Thompson" },
        { name: "Computer Science", grade: "A", progress: 95, teacher: "Ms. Lee" }
      ]
    },
    assignments: {
      total: 28,
      completed: 25,
      pending: 3,
      late: 1
    },
    behavior: [
      { type: "Positive", count: 8, last: "3 days ago" },
      { type: "Needs Improvement", count: 3, last: "2 days ago" },
      { type: "Excellent", count: 5, last: "Last week" }
    ],
    teacherComments: [
      {
        teacher: "Ms. Rodriguez",
        subject: "Mathematics",
        comment: "Michael is making good progress. Could benefit from additional practice with algebra concepts.",
        date: "Oct 18, 2024"
      },
      {
        teacher: "Ms. Lee",
        subject: "Computer Science",
        comment: "Excels in programming assignments. Shows strong logical thinking skills.",
        date: "Oct 12, 2024"
      }
    ]
  }
}

const Report = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const query = new URLSearchParams(location.search)
  const childId = parseInt(query.get('child') || '1')
  
  const [selectedChild, setSelectedChild] = useState(childId)
  const [reportPeriod] = useState("fall-2024")
  const [activeTab, setActiveTab] = useState("grades")

  const [childrenOptions, setChildrenOptions] = useState<
    Array<{ id: number; name: string; grade: string }>
  >([
    { id: 1, name: "Emily Johnson", grade: "Grade 5" },
    { id: 2, name: "Michael Johnson", grade: "Grade 7" },
  ])

  const [report, setReport] = useState<ReportData>(
    (mockReportData[selectedChild as keyof typeof mockReportData] || mockReportData[1]) as ReportData,
  )

  useEffect(() => {
    const loadChildren = async () => {
      try {
        const r = await api.get("/parents/me/profile")
        const children = r.data?.children
        if (Array.isArray(children)) {
          setChildrenOptions(
            children.map((c: any) => ({ id: c.id, name: c.name, grade: c.grade })),
          )
        }
      } catch (_e) {
        // keep fallback
      }
    }
    loadChildren()
  }, [])

  useEffect(() => {
    const loadReport = async () => {
      try {
        const r = await api.get("/parents/me/report", {
          params: { child: selectedChild, period: reportPeriod },
        })
        if (r.data) {
          setReport(r.data)
        }
      } catch (_e) {
        setReport(
          (mockReportData[selectedChild as keyof typeof mockReportData] || mockReportData[1]) as ReportData,
        )
      }
    }

    loadReport()
  }, [selectedChild, reportPeriod])

  const handleExportPDF = () => {
    toast.success("Generating PDF report...")
    // PDF generation logic would go here
  }

  const handlePrint = () => {
    window.print()
    toast.info("Printing report...")
  }

  const handleShare = () => {
    toast.success("Share link copied to clipboard!")
    navigator.clipboard.writeText(`https://cbgconnect.com/report/${selectedChild}`)
  }

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-700'
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-700'
    if (grade.startsWith('C')) return 'bg-amber-100 text-amber-700'
    return 'bg-red-100 text-red-700'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/parent')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Academic Report</h1>
                <p className="text-gray-600">Detailed performance analysis for {report.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedChild.toString()} onValueChange={(value) => setSelectedChild(parseInt(value))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select child" />
                </SelectTrigger>
                <SelectContent>
                  {childrenOptions.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name} - {c.grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handlePrint}>
                  <Printer className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleExportPDF}>
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overall Grade</p>
                  <div className="text-3xl font-bold text-gray-900 mt-2">{report.grades.overall}</div>
                </div>
                <Award className="h-10 w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Attendance Rate</p>
                  <div className="text-3xl font-bold text-gray-900 mt-2">{report.attendance.percentage}%</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {report.attendance.present} present / {report.attendance.total} total
                  </p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Assignments</p>
                  <div className="text-3xl font-bold text-gray-900 mt-2">
                    {report.assignments.completed}/{report.assignments.total}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {report.assignments.pending} pending • {report.assignments.late} late
                  </p>
                </div>
                <FileText className="h-10 w-10 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Report Period</p>
                  <div className="text-lg font-bold text-gray-900 mt-2">{report.period}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    Generated: {new Date().toLocaleDateString()}
                  </p>
                </div>
                <Calendar className="h-10 w-10 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="grades" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Grades
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Assignments
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Teacher Comments
            </TabsTrigger>
          </TabsList>

          {/* Grades Tab */}
          <TabsContent value="grades" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subject-wise Performance</CardTitle>
                <CardDescription>
                  Detailed breakdown of grades across all subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {report.grades.subjects.map((subject, index) => (
                    <div key={index} className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{subject.name}</h4>
                          <p className="text-sm text-gray-600">Teacher: {subject.teacher}</p>
                        </div>
                        <Badge className={`text-lg px-3 py-1 ${getGradeColor(subject.grade)}`}>
                          {subject.grade}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{subject.progress}%</span>
                        </div>
                        <Progress value={subject.progress} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        {subject.progress >= 90 && (
                          <Badge className="bg-green-100 text-green-700">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Excellent
                          </Badge>
                        )}
                        {subject.progress < 90 && subject.progress >= 80 && (
                          <Badge className="bg-blue-100 text-blue-700">
                            Good Progress
                          </Badge>
                        )}
                        {subject.progress < 80 && (
                          <Badge className="bg-amber-100 text-amber-700">
                            <TrendingDown className="h-3 w-3 mr-1" />
                            Needs Improvement
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Grade Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>
                  Comparison across all subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {report.grades.subjects.map((subject, index) => (
                    <div key={index} className="text-center">
                      <div className={`h-16 flex items-center justify-center rounded-t-lg ${getGradeColor(subject.grade)}`}>
                        <span className="text-xl font-bold">{subject.grade}</span>
                      </div>
                      <div className="p-3 border border-t-0 rounded-b-lg">
                        <p className="text-sm font-medium">{subject.name}</p>
                        <p className="text-xs text-gray-500">{subject.progress}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Details</CardTitle>
                <CardDescription>
                  Daily attendance record for {report.period}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-xl bg-green-50 border border-green-200">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-600">{report.attendance.present}</div>
                        <p className="text-gray-700 mt-2">Days Present</p>
                      </div>
                    </div>
                    <div className="p-6 rounded-xl bg-red-50 border border-red-200">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-red-600">{report.attendance.absent}</div>
                        <p className="text-gray-700 mt-2">Days Absent</p>
                      </div>
                    </div>
                    <div className="p-6 rounded-xl bg-blue-50 border border-blue-200">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600">{report.attendance.percentage}%</div>
                        <p className="text-gray-700 mt-2">Attendance Rate</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Monthly Breakdown</h4>
                    <div className="space-y-4">
                      {['August', 'September', 'October'].map((month, index) => (
                        <div key={index} className="p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{month} 2024</span>
                            <Badge className="bg-green-100 text-green-700">95%</Badge>
                          </div>
                          <div className="grid grid-cols-5 gap-1">
                            {Array.from({ length: 20 }).map((_, day) => (
                              <div
                                key={day}
                                className={`h-2 rounded ${Math.random() > 0.1 ? 'bg-green-400' : 'bg-red-400'}`}
                                title={`Day ${day + 1}: ${Math.random() > 0.1 ? 'Present' : 'Absent'}`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Green = Present • Red = Absent</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Tracking</CardTitle>
                <CardDescription>
                  Completion status of all assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                      <div className="text-2xl font-bold text-blue-600">{report.assignments.total}</div>
                      <p className="text-sm text-gray-600">Total Assignments</p>
                    </div>
                    <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                      <div className="text-2xl font-bold text-green-600">{report.assignments.completed}</div>
                      <p className="text-sm text-gray-600">Completed</p>
                    </div>
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                      <div className="text-2xl font-bold text-amber-600">{report.assignments.pending}</div>
                      <p className="text-sm text-gray-600">Pending</p>
                    </div>
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                      <div className="text-2xl font-bold text-red-600">{report.assignments.late}</div>
                      <p className="text-sm text-gray-600">Late</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Recent Assignments</h4>
                    <div className="space-y-3">
                      {[
                        { subject: "Math", title: "Algebra Practice", due: "Oct 20", status: "completed", grade: "A" },
                        { subject: "Science", title: "Lab Report", due: "Oct 22", status: "pending", grade: "-" },
                        { subject: "English", title: "Book Analysis", due: "Oct 18", status: "late", grade: "C+" },
                        { subject: "History", title: "Research Paper", due: "Oct 25", status: "pending", grade: "-" }
                      ].map((assignment, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              assignment.status === 'completed' ? 'bg-green-100 text-green-600' :
                              assignment.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                              'bg-red-100 text-red-600'
                            }`}>
                              <FileText className="h-4 w-4" />
                            </div>
                            <div>
                              <h5 className="font-medium">{assignment.title}</h5>
                              <p className="text-sm text-gray-600">{assignment.subject} • Due: {assignment.due}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={
                              assignment.status === 'completed' ? 'bg-green-100 text-green-700' :
                              assignment.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }>
                              {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                            </Badge>
                            {assignment.grade !== '-' && (
                              <p className="text-sm font-medium mt-1">Grade: {assignment.grade}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments">
            <Card>
              <CardHeader>
                <CardTitle>Teacher Comments & Feedback</CardTitle>
                <CardDescription>
                  Personalized feedback from teachers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {report.teacherComments.map((comment, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {comment.teacher.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-semibold">{comment.teacher}</h4>
                                <p className="text-sm text-gray-600">{comment.subject} Teacher</p>
                              </div>
                              <Badge variant="outline">{comment.date}</Badge>
                            </div>
                            <p className="text-gray-700 leading-relaxed">"{comment.comment}"</p>
                            <div className="mt-4 flex gap-2">
                              <Badge className="bg-blue-100 text-blue-700">Positive</Badge>
                              <Badge className="bg-green-100 text-green-700">Constructive</Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Overall Assessment</h4>
                    <p className="text-gray-700 mb-4">
                      {report.name} is making {report.grades.overall.startsWith('A') || report.grades.overall.startsWith('B') ? 'good' : 'satisfactory'} progress. 
                      {report.grades.overall.startsWith('A') ? ' Shows excellent dedication and understanding of material.' :
                       report.grades.overall.startsWith('B') ? ' Demonstrates solid understanding with room for growth.' :
                       ' Would benefit from additional support and practice.'}
                    </p>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-600">Recommendation: Continue current study habits</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Summary Section */}
        <Card className="mt-8 bg-gradient-to-r from-gray-50 to-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">Need more detailed analysis?</h3>
                <p className="text-gray-600">Schedule a parent-teacher conference for in-depth discussion</p>
              </div>
              <Button onClick={() => toast.success("Conference request sent!")}>
                Request Conference
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Report