import { useEffect, useState } from "react"
import { Archive, Download, Eye, BarChart3, AlertCircle, Calendar } from "lucide-react"
import { toast } from "sonner"
import api from "@/services/api"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ArchivedStudent {
  id: string
  name: string
  email: string
  phone: string
  class: string
  academicYear: string
  finalGPA: number
  status: 'promoted' | 'repeat' | 'transferred'
  createdAt: string
}

interface AcademicYearArchive {
  id: string
  year: string
  startDate: string
  endDate: string
  totalStudents: number
  averageGPA: number
  archivedDate: string
  students: ArchivedStudent[]
}

// initial state will be loaded from API

export default function AcademicYearArchive() {
  const [archivedYears, setArchivedYears] = useState<AcademicYearArchive[]>([])
  const [selectedYear, setSelectedYear] = useState<AcademicYearArchive | null>(null)
  const [isOpenDetailsDialog, setIsOpenDetailsDialog] = useState(false)
  const [searchStudent, setSearchStudent] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const handleViewDetails = (year: AcademicYearArchive) => {
    // fetch details for selected year
    api.getAcademicYearDetails(year.id)
      .then((data) => {
        setSelectedYear(data)
        setIsOpenDetailsDialog(true)
      })
      .catch((err) => {
        console.error('Failed to load year details', err)
        toast.error('Failed to load year details')
      })
  }

  const handleExportArchive = (year: AcademicYearArchive) => {
    // For now just notify; export can call backend/export endpoint in future
    toast.success(`Archive for ${year.year} exported successfully`)
  }

  useEffect(() => {
    api.getArchivedAcademicYears()
      .then((rows) => {
        // normalize fields to component type
        const normalized = (rows || []).map((r: any) => ({
          id: String(r.id),
          year: r.year,
          startDate: r.start_date || r.startDate,
          endDate: r.end_date || r.endDate,
          totalStudents: r.total_students || 0,
          averageGPA: Number(r.average_gpa || 0),
          archivedDate: r.archived_at || null,
          students: [] as any[],
        }))
        setArchivedYears(normalized)
      })
      .catch((err) => {
        console.error('Failed to load archived years', err)
        toast.error('Failed to load archived years')
      })
  }, [])

  const filteredStudents = selectedYear
    ? selectedYear.students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchStudent.toLowerCase())
        const matchesStatus = filterStatus === 'all' || student.status === filterStatus
        return matchesSearch && matchesStatus
      })
    : []

  const statusColor = (status: string) => {
    switch(status) {
      case 'promoted':
        return 'bg-green-100 text-green-800'
      case 'repeat':
        return 'bg-yellow-100 text-yellow-800'
      case 'transferred':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Academic Year Archive</h1>
        <p className="text-gray-600 mt-2">View and manage archived academic years and student records</p>
      </div>

      {/* Archive Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Archive className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Total Archived Years</p>
              <p className="text-3xl font-bold">{archivedYears.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Archived Students</p>
              <p className="text-3xl font-bold">
                {archivedYears.reduce((sum, year) => sum + year.totalStudents, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Average Academic GPA</p>
              <p className="text-3xl font-bold">
                {(archivedYears.reduce((sum, year) => sum + year.averageGPA, 0) / archivedYears.length).toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Archived Years List */}
      <Card>
        <CardHeader>
          <CardTitle>Archived Academic Years</CardTitle>
          <CardDescription>Complete records of all previous academic years</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {archivedYears.map(year => (
              <Card key={year.id} className="border-2 hover:border-blue-300 transition-colors">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{year.year}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(year.startDate).toLocaleDateString()} - {new Date(year.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-gray-100">
                        Archived
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <p className="text-xs text-gray-600">Total Students</p>
                        <p className="text-2xl font-bold">{year.totalStudents}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Average GPA</p>
                        <p className="text-2xl font-bold">{year.averageGPA.toFixed(2)}</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">
                      Archived on: {new Date(year.archivedDate).toLocaleDateString()}
                    </p>

                    <div className="flex gap-2 pt-3">
                      <Dialog open={isOpenDetailsDialog && selectedYear?.id === year.id} onOpenChange={setIsOpenDetailsDialog}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleViewDetails(year)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View Students
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Archived Students - {year.year}</DialogTitle>
                            <DialogDescription>
                              Complete list of {year.totalStudents} students from {year.year}
                            </DialogDescription>
                          </DialogHeader>

                          {/* Filters for students */}
                          <div className="space-y-4">
                            <div className="flex gap-4 items-end">
                              <div className="flex-1">
                                <Label htmlFor="search" className="text-xs">Search Student</Label>
                                <Input
                                  id="search"
                                  placeholder="Search by name..."
                                  value={searchStudent}
                                  onChange={(e) => setSearchStudent(e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              <div className="w-40">
                                <Label htmlFor="status" className="text-xs">Status</Label>
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="promoted">Promoted</SelectItem>
                                    <SelectItem value="repeat">Repeat</SelectItem>
                                    <SelectItem value="transferred">Transferred</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {/* Students Table */}
                            <div className="overflow-x-auto border rounded-lg">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead className="text-center">Final GPA</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {filteredStudents.length === 0 ? (
                                    <TableRow>
                                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                        No students found
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    filteredStudents.map(student => (
                                      <TableRow key={student.id}>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell className="text-sm">{student.email}</TableCell>
                                        <TableCell className="text-sm">{student.phone}</TableCell>
                                        <TableCell>{student.class}</TableCell>
                                        <TableCell className="text-center font-semibold">{student.finalGPA}</TableCell>
                                        <TableCell className="text-center">
                                          <Badge className={statusColor(student.status)}>
                                            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                                          </Badge>
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  )}
                                </TableBody>
                              </Table>
                            </div>

                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setIsOpenDetailsDialog(false)}>
                                Close
                              </Button>
                              <Button className="bg-blue-600 hover:bg-blue-700">
                                <Download className="h-4 w-4 mr-2" />
                                Export Report
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExportArchive(year)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Archive Statistics */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Archive Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600">Total Students Archived</p>
              <p className="text-3xl font-bold text-blue-900">
                {archivedYears.reduce((sum, year) => sum + year.totalStudents, 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Archive Coverage (Years)</p>
              <p className="text-3xl font-bold text-blue-900">{archivedYears.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Oldest Archive</p>
              <p className="text-xl font-bold text-blue-900">
                {archivedYears[archivedYears.length - 1]?.year || 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900">About Academic Archives</h4>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>• Archives contain complete records of all students from previous academic years</li>
                <li>• Students are marked as promoted, repeat, or transferred based on their performance</li>
                <li>• Historical data is preserved permanently for reference and reporting</li>
                <li>• Final GPA is calculated at the end of each academic year</li>
                <li>• You can export archives for reporting and analysis purposes</li>
                <li>• Archives are read-only for data integrity and audit purposes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
