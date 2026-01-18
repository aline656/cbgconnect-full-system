import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Filter,
  Search,
  Download,
  Printer,
  Bell,
  Mail,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  RefreshCw,
  FileText,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle , CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

// Mock attendance data
const mockAttendanceData = {
  summary: {
    totalStudents: 1250,
    presentToday: 1185,
    absentToday: 65,
    attendanceRate: "94.8%",
    lateArrivals: 28,
    earlyDepartures: 15,
    averageAttendance: "95.2%"
  },
  todayAttendance: [
    { id: 1, student: "Alex Chen", grade: "Grade 5", status: "present", time: "8:15 AM", remarks: "On time" },
    { id: 2, student: "Emma Rodriguez", grade: "Grade 6", status: "present", time: "8:05 AM", remarks: "On time" },
    { id: 3, student: "James Wilson", grade: "Grade 7", status: "absent", time: "-", remarks: "Sick leave" },
    { id: 4, student: "Sophia Kim", grade: "Grade 5", status: "present", time: "8:25 AM", remarks: "Late arrival" },
    { id: 5, student: "Michael Brown", grade: "Grade 8", status: "present", time: "8:10 AM", remarks: "On time" },
    { id: 6, student: "Olivia Davis", grade: "Grade 6", status: "present", time: "8:00 AM", remarks: "On time" },
    { id: 7, student: "William Garcia", grade: "Grade 7", status: "absent", time: "-", remarks: "Family trip" },
    { id: 8, student: "Ava Martinez", grade: "Grade 5", status: "present", time: "8:30 AM", remarks: "Late arrival" }
  ],
  monthlyTrend: [
    { month: "Jan", rate: 94.2 },
    { month: "Feb", rate: 95.1 },
    { month: "Mar", rate: 96.3 },
    { month: "Apr", rate: 94.8 },
    { month: "May", rate: 95.7 },
    { month: "Jun", rate: 93.9 },
    { month: "Jul", rate: 92.5 },
    { month: "Aug", rate: 95.2 },
    { month: "Sep", rate: 96.0 },
    { month: "Oct", rate: 94.8 }
  ],
  gradeWiseAttendance: [
    { grade: "Grade 5", total: 320, present: 305, rate: "95.3%" },
    { grade: "Grade 6", total: 310, present: 295, rate: "95.2%" },
    { grade: "Grade 7", total: 315, present: 295, rate: "93.7%" },
    { grade: "Grade 8", total: 305, present: 290, rate: "95.1%" }
  ],
  recentAbsences: [
    { student: "James Wilson", grade: "Grade 7", dates: "Oct 18-19", reason: "Sick leave", parent: "Mr. Wilson" },
    { student: "William Garcia", grade: "Grade 7", dates: "Oct 20", reason: "Family trip", parent: "Mr. Garcia" },
    { student: "Noah Taylor", grade: "Grade 8", dates: "Oct 17", reason: "Doctor appointment", parent: "Ms. Taylor" },
    { student: "Isabella Lee", grade: "Grade 6", dates: "Oct 16", reason: "Personal", parent: "Dr. Lee" }
  ]
}

const Attendance = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("daily")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [gradeFilter, setGradeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const handleMarkAttendance = () => {
    toast.info("Opening attendance marking interface...")
  }

  const handleSendAbsenceReport = () => {
    toast.success("Sending absence reports to parents...")
  }

  const handleUpdateAttendance = (studentId: number, status: string) => {
    toast.success(`Attendance updated for student #${studentId}`)
  }

  const handleExportReport = () => {
    toast.success("Exporting attendance report...")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present": return "bg-green-100 text-green-700"
      case "absent": return "bg-red-100 text-red-700"
      case "late": return "bg-yellow-100 text-yellow-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
              <p className="text-gray-600">Track and manage student attendance records</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                onClick={handleExportReport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button 
                onClick={handleMarkAttendance}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Attendance
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Present Today</p>
                  <div className="text-2xl font-bold text-gray-900">{mockAttendanceData.summary.presentToday}</div>
                  <p className="text-xs text-gray-500 mt-1">Out of {mockAttendanceData.summary.totalStudents} students</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Absent Today</p>
                  <div className="text-2xl font-bold text-gray-900">{mockAttendanceData.summary.absentToday}</div>
                  <p className="text-xs text-gray-500 mt-1">{mockAttendanceData.recentAbsences.length} new absences</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Attendance Rate</p>
                  <div className="text-2xl font-bold text-gray-900">{mockAttendanceData.summary.attendanceRate}</div>
                  <div className="flex items-center gap-1 text-xs mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-600">+0.8% from yesterday</span>
                  </div>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Late Arrivals</p>
                  <div className="text-2xl font-bold text-gray-900">{mockAttendanceData.summary.lateArrivals}</div>
                  <p className="text-xs text-gray-500 mt-1">Early departures: {mockAttendanceData.summary.earlyDepartures}</p>
                </div>
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Daily View
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Monthly Trend
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Daily Attendance Tab */}
          <TabsContent value="daily" className="space-y-6">
            <Card className="border-gray-200 shadow-lg">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle>Today's Attendance ({selectedDate})</CardTitle>
                    <CardDescription>
                      Live attendance records for all students
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input 
                      type="date" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-40"
                    />
                    <Select value={gradeFilter} onValueChange={setGradeFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Grades</SelectItem>
                        <SelectItem value="5">Grade 5</SelectItem>
                        <SelectItem value="6">Grade 6</SelectItem>
                        <SelectItem value="7">Grade 7</SelectItem>
                        <SelectItem value="8">Grade 8</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="late">Late</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Arrival Time</TableHead>
                        <TableHead>Remarks</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockAttendanceData.todayAttendance
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((record) => (
                        <TableRow key={record.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{record.student}</TableCell>
                          <TableCell>{record.grade}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(record.status)}>
                              {record.status === 'present' ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{record.time}</TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600">{record.remarks}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleUpdateAttendance(record.id, 'present')}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleUpdateAttendance(record.id, 'absent')}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-600">
                    Showing {Math.min(itemsPerPage, mockAttendanceData.todayAttendance.length)} of {mockAttendanceData.todayAttendance.length} records
                  </p>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      {[1, 2].map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(2, prev + 1))}
                          className={currentPage === 2 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <div className="w-full space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Quick Actions:</span> Update multiple records at once
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => toast.success("Marked all as present")}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark All Present
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleSendAbsenceReport}>
                        <Bell className="h-4 w-4 mr-2" />
                        Send Absence Alerts
                      </Button>
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>

            {/* Recent Absences */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Recent Absences</CardTitle>
                <CardDescription>
                  Students with recent absence records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {mockAttendanceData.recentAbsences.map((absence, index) => (
                    <div key={index} className="p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{absence.student}</h4>
                          <p className="text-sm text-gray-600">{absence.grade} • Parent: {absence.parent}</p>
                        </div>
                        <Badge className="bg-red-100 text-red-700">Absent</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Dates:</span>
                          <span className="font-medium">{absence.dates}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Reason:</span>
                          <span className="font-medium">{absence.reason}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Mail className="h-4 w-4 mr-2" />
                          Contact Parent
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <FileText className="h-4 w-4 mr-2" />
                          Add Note
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monthly Trend Tab */}
          <TabsContent value="monthly">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Monthly Attendance Chart */}
              <Card className="border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle>Monthly Attendance Trend</CardTitle>
                  <CardDescription>
                    Attendance rate over the past 10 months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <div className="flex items-end h-48 gap-2">
                      {mockAttendanceData.monthlyTrend.map((month, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg"
                            style={{ height: `${month.rate}%` }}
                          />
                          <span className="text-xs text-gray-600 mt-2">{month.month}</span>
                          <span className="text-xs font-medium">{month.rate}%</span>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Average attendance: {mockAttendanceData.summary.averageAttendance}</span>
                      <span className="font-medium text-green-600">Target: 95%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Grade-wise Attendance */}
              <Card className="border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle>Grade-wise Attendance</CardTitle>
                  <CardDescription>
                    Current attendance breakdown by grade level
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {mockAttendanceData.gradeWiseAttendance.map((grade, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{grade.grade}</h4>
                            <p className="text-sm text-gray-600">{grade.present} present / {grade.total} total</p>
                          </div>
                          <Badge className={
                            parseFloat(grade.rate) >= 95 ? "bg-green-100 text-green-700" :
                            parseFloat(grade.rate) >= 90 ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          }>
                            {grade.rate}
                          </Badge>
                        </div>
                        <Progress 
                          value={parseFloat(grade.rate)} 
                          className={`h-2 ${
                            parseFloat(grade.rate) >= 95 ? "bg-green-500" :
                            parseFloat(grade.rate) >= 90 ? "bg-yellow-500" :
                            "bg-red-500"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                  <Separator className="my-6" />
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Overall School Attendance</p>
                    <div className="text-3xl font-bold text-gray-900 mt-2">
                      {mockAttendanceData.summary.attendanceRate}
                    </div>
                    <div className="flex items-center justify-center gap-1 text-sm mt-2">
                      {parseFloat(mockAttendanceData.summary.attendanceRate) >= 95 ? (
                        <>
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-green-600">Meeting target</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="h-4 w-4 text-red-500" />
                          <span className="text-red-600">Below target</span>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Attendance Statistics */}
            <Card className="mt-8 border-gray-200">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-2">42</div>
                    <p className="text-gray-600">Chronic Absences</p>
                    <p className="text-sm text-gray-500">3+ consecutive days</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-2">89%</div>
                    <p className="text-gray-600">Regular Attendance</p>
                    <p className="text-sm text-gray-500">Students with - 90% attendance</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-2">15</div>
                    <p className="text-gray-600">Pending Approvals</p>
                    <p className="text-sm text-gray-500">Leave requests to review</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle>Generate Attendance Reports</CardTitle>
                  <CardDescription>
                    Create detailed attendance reports for different periods
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Button variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Daily Report
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Weekly Report
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Monthly Report
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Term Report
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Custom Report</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600 mb-1 block">Start Date</label>
                          <Input type="date" />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 mb-1 block">End Date</label>
                          <Input type="date" />
                        </div>
                      </div>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="summary">Attendance Summary</SelectItem>
                          <SelectItem value="absenteeism">Absenteeism Report</SelectItem>
                          <SelectItem value="grade">Grade-wise Report</SelectItem>
                          <SelectItem value="individual">Student-wise Report</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button className="w-full">
                        <Printer className="h-4 w-4 mr-2" />
                        Generate Custom Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle>Attendance Alerts & Notifications</CardTitle>
                  <CardDescription>
                    Configure automated attendance alerts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Absence Notifications</p>
                        <p className="text-sm text-gray-500">Send alerts when students are absent</p>
                      </div>
                      <Button size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Chronic Absence Alerts</p>
                        <p className="text-sm text-gray-500">Alert for 3+ consecutive absences</p>
                      </div>
                      <Button size="sm" variant="outline">Enable</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Monthly Reports to Parents</p>
                        <p className="text-sm text-gray-500">Automated monthly attendance summaries</p>
                      </div>
                      <Button size="sm" variant="outline">Schedule</Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Send Bulk Notifications</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Mail className="h-4 w-4 mr-2" />
                        Email Parents of Absent Students
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Bell className="h-4 w-4 mr-2" />
                        SMS Alerts for Late Arrivals
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Warning Letters
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Attendance