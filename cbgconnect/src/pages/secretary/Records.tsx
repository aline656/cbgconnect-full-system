import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  Search, 
  Filter, 
  Download, 
  Printer, 
  UserPlus,
  Edit,
  Eye,
  Trash2,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Users,
  Shield,
  CheckCircle,
  XCircle,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

// Mock student records data
const mockStudentRecords = [
  {
    id: 1,
    name: "Alex Chen",
    studentId: "STU-2024-001",
    grade: "Grade 5",
    parent: "Mr. & Mrs. Chen",
    contact: "alex.chen@student.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    attendance: "95%",
    lastPayment: "Paid",
    enrollmentDate: "2023-08-15"
  },
  {
    id: 2,
    name: "Emma Rodriguez",
    studentId: "STU-2024-002",
    grade: "Grade 6",
    parent: "Ms. Rodriguez",
    contact: "emma.rodriguez@student.com",
    phone: "+1 (555) 234-5678",
    status: "active",
    attendance: "98%",
    lastPayment: "Overdue",
    enrollmentDate: "2023-08-20"
  },
  {
    id: 3,
    name: "James Wilson",
    studentId: "STU-2024-003",
    grade: "Grade 7",
    parent: "Mr. Wilson",
    contact: "james.wilson@student.com",
    phone: "+1 (555) 345-6789",
    status: "inactive",
    attendance: "85%",
    lastPayment: "Paid",
    enrollmentDate: "2023-09-05"
  },
  {
    id: 4,
    name: "Sophia Kim",
    studentId: "STU-2024-004",
    grade: "Grade 5",
    parent: "Dr. & Mrs. Kim",
    contact: "sophia.kim@student.com",
    phone: "+1 (555) 456-7890",
    status: "active",
    attendance: "99%",
    lastPayment: "Paid",
    enrollmentDate: "2023-08-25"
  },
  {
    id: 5,
    name: "Michael Brown",
    studentId: "STU-2024-005",
    grade: "Grade 8",
    parent: "Mr. & Mrs. Brown",
    contact: "michael.brown@student.com",
    phone: "+1 (555) 567-8901",
    status: "active",
    attendance: "92%",
    lastPayment: "Pending",
    enrollmentDate: "2023-09-10"
  },
  {
    id: 6,
    name: "Olivia Davis",
    studentId: "STU-2024-006",
    grade: "Grade 6",
    parent: "Ms. Davis",
    contact: "olivia.davis@student.com",
    phone: "+1 (555) 678-9012",
    status: "active",
    attendance: "96%",
    lastPayment: "Paid",
    enrollmentDate: "2023-08-30"
  },
  {
    id: 7,
    name: "William Garcia",
    studentId: "STU-2024-007",
    grade: "Grade 7",
    parent: "Mr. Garcia",
    contact: "william.garcia@student.com",
    phone: "+1 (555) 789-0123",
    status: "active",
    attendance: "88%",
    lastPayment: "Overdue",
    enrollmentDate: "2023-09-15"
  },
  {
    id: 8,
    name: "Ava Martinez",
    studentId: "STU-2024-008",
    grade: "Grade 5",
    parent: "Mr. & Mrs. Martinez",
    contact: "ava.martinez@student.com",
    phone: "+1 (555) 890-1234",
    status: "active",
    attendance: "94%",
    lastPayment: "Paid",
    enrollmentDate: "2023-08-18"
  }
]

const Records = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [gradeFilter, setGradeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filteredRecords = mockStudentRecords.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.parent.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || student.status === statusFilter
    const matchesGrade = gradeFilter === "all" || student.grade === gradeFilter
    
    return matchesSearch && matchesStatus && matchesGrade
  })

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage)
  const currentRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleViewStudent = (id: number) => {
    navigate(`/secretary/students/${id}`)
    toast.info(`Viewing student #${id}`)
  }

  const handleEditStudent = (id: number) => {
    toast.info(`Editing student #${id}`)
  }

  const handleDeleteStudent = (id: number) => {
    toast.error(`Student #${id} marked for deletion`)
  }

  const handleExportRecords = () => {
    toast.success("Exporting student records to CSV...")
  }

  const handlePrintRecords = () => {
    window.print()
    toast.info("Printing student records...")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700"
      case "inactive": return "bg-gray-100 text-gray-700"
      default: return "bg-yellow-100 text-yellow-700"
    }
  }

  const getPaymentColor = (payment: string) => {
    switch (payment) {
      case "Paid": return "bg-green-100 text-green-700"
      case "Pending": return "bg-yellow-100 text-yellow-700"
      case "Overdue": return "bg-red-100 text-red-700"
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
              <h1 className="text-3xl font-bold text-gray-900">Student Records</h1>
              <p className="text-gray-600">Manage student information, enrollment, and records</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                onClick={handleExportRecords}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button 
                variant="outline"
                onClick={handlePrintRecords}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button 
                onClick={() => navigate('/secretary/students/new')}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add New Student
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters & Search */}
        <Card className="mb-8 border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, ID, or parent..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={gradeFilter} onValueChange={setGradeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    <SelectItem value="Grade 5">Grade 5</SelectItem>
                    <SelectItem value="Grade 6">Grade 6</SelectItem>
                    <SelectItem value="Grade 7">Grade 7</SelectItem>
                    <SelectItem value="Grade 8">Grade 8</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-600">
                Showing {filteredRecords.length} of {mockStudentRecords.length} students
              </p>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-700">
                  <Users className="h-3 w-3 mr-1" />
                  Active: {mockStudentRecords.filter(s => s.status === 'active').length}
                </Badge>
                <Badge className="bg-gray-100 text-gray-700">
                  Total: {mockStudentRecords.length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle>Student Directory</CardTitle>
            <CardDescription>
              Complete list of enrolled students with administrative controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Parent/Guardian</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Last Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentRecords.map((student) => (
                    <TableRow key={student.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.studentId}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.grade}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{student.parent}</div>
                          <div className="text-sm text-gray-500">{student.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{student.contact}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(student.status)}>
                          {student.status === 'active' ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 mr-1" />
                          )}
                          {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                parseInt(student.attendance) >= 90 ? 'bg-green-500' :
                                parseInt(student.attendance) >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: student.attendance }}
                            />
                          </div>
                          <span className="text-sm font-medium">{student.attendance}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentColor(student.lastPayment)}>
                          {student.lastPayment}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewStudent(student.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditStudent(student.id)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Record
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info(`Contacting ${student.name}`)}>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info(`Calling ${student.parent}`)}>
                              <Phone className="h-4 w-4 mr-2" />
                              Call Parent
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteStudent(student.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Record
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          onClick={() => setCurrentPage(i + 1)}
                          isActive={currentPage === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <div className="text-2xl font-bold text-gray-900">{mockStudentRecords.length}</div>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Students</p>
                  <div className="text-2xl font-bold text-gray-900">
                    {mockStudentRecords.filter(s => s.status === 'active').length}
                  </div>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overdue Payments</p>
                  <div className="text-2xl font-bold text-gray-900">
                    {mockStudentRecords.filter(s => s.lastPayment === 'Overdue').length}
                  </div>
                </div>
                <Shield className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">New This Month</p>
                  <div className="text-2xl font-bold text-gray-900">8</div>
                </div>
                <BookOpen className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bulk Actions */}
        <Card className="mt-8 border-gray-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Bulk Actions</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Send Bulk Email
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Selected
              </Button>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Update Enrollment Dates
              </Button>
              <Button variant="outline" className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-2" />
                Archive Selected
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Records